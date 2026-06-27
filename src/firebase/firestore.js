// Firestore utility functions for CRUD operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// ========== USER OPERATIONS ==========

/**
 * Get user document by UID
 * Note: uid is stored as a field, not document ID
 */
export const getUser = async (uid) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

/**
 * Create user document after registration
 */
export const createUser = async (uid, userData) => {
  await addDoc(collection(db, 'users'), {
    uid,
    name: userData.name,
    role: userData.role,
    score: 0,
    completedTasks: 0
  });
};

/**
 * Update user document
 */
export const updateUser = async (uid, updates) => {
  // Find user document by uid field
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, 'users', userDoc.id), updates);
  }
};

/**
 * Get all faculty members (for HOD to assign tasks)
 */
export const getAllFaculty = async () => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('role', '==', 'faculty'));
  const querySnapshot = await getDocs(q);
  
  const faculty = querySnapshot.docs.map(doc => {
    const data = doc.data();
    // Ensure we have a uid - use the uid field if available, otherwise use document ID
    // The uid field should match the Firebase Auth UID
    const uid = data.uid || doc.id;
    
    console.log('Faculty member:', {
      name: data.name,
      documentId: doc.id,
      uidField: data.uid,
      finalUid: uid,
      role: data.role
    });
    
    return {
      id: doc.id,
      uid: uid, // Always use the uid field or fallback to document ID
      ...data
    };
  });
  
  console.log('All faculty members:', faculty);
  return faculty;
};

// ========== TASK OPERATIONS ==========

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  // Convert deadline to Firestore Timestamp if it's a Date object
  let deadline = taskData.deadline;
  if (deadline instanceof Date) {
    deadline = Timestamp.fromDate(deadline);
  }
  
  const taskRef = await addDoc(collection(db, 'tasks'), {
    title: taskData.title,
    description: taskData.description,
    assignedTo: taskData.assignedTo,
    deadline: deadline,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  
  console.log('Task created successfully with ID:', taskRef.id);
  return taskRef.id;
};

/**
 * Get all tasks (for HOD dashboard)
 */
export const getAllTasks = async () => {
  try {
    const tasksRef = collection(db, 'tasks');
    // Try with orderBy first, fallback to no ordering if index is missing
    let q;
    try {
      q = query(tasksRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (orderError) {
      // If orderBy fails (missing index), get all tasks without ordering
      console.warn('OrderBy failed, fetching without order:', orderError);
      const querySnapshot = await getDocs(tasksRef);
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort manually by createdAt if available
      return tasks.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
    }
  } catch (error) {
    console.error('Error getting all tasks:', error);
    throw error;
  }
};

/**
 * Get tasks assigned to a specific faculty member
 */
export const getFacultyTasks = async (facultyUid) => {
  try {
    console.log('=== getFacultyTasks called ===');
    console.log('Searching for tasks assigned to UID:', facultyUid);
    console.log('UID type:', typeof facultyUid);
    
    const tasksRef = collection(db, 'tasks');
    
    // First, get ALL tasks to debug
    const allTasksSnapshot = await getDocs(tasksRef);
    const allTasks = allTasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('Total tasks in database:', allTasks.length);
    allTasks.forEach((task, index) => {
      const assignedToValue = task.assignedTo;
      const assignedToString = String(assignedToValue || '');
      const facultyUidString = String(facultyUid || '');
      
      console.log(`Task ${index + 1}:`, {
        id: task.id,
        title: task.title,
        assignedTo: assignedToValue,
        assignedToType: typeof assignedToValue,
        assignedToString: assignedToString,
        facultyUid: facultyUid,
        facultyUidString: facultyUidString,
        exactMatch: assignedToValue === facultyUid,
        stringMatch: assignedToString === facultyUidString,
        includesMatch: assignedToString.includes(facultyUidString) || facultyUidString.includes(assignedToString)
      });
      
      // Log the full task object for debugging
      console.log(`Task ${index + 1} full data:`, task);
    });
    
    // Try with orderBy first, fallback to no ordering if index is missing
    try {
      const q = query(
        tasksRef,
        where('assignedTo', '==', facultyUid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Tasks found with query (with orderBy):', tasks.length);
      return tasks;
    } catch (orderError) {
      // If orderBy fails (missing index), get tasks without ordering
      console.warn('OrderBy failed, fetching without order:', orderError);
      const q = query(tasksRef, where('assignedTo', '==', facultyUid));
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Tasks found with query (without orderBy):', tasks.length);
      
      // Sort manually by createdAt if available
      const sortedTasks = tasks.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
      
      // If no tasks found but we have tasks in DB, try manual filtering as fallback
      if (sortedTasks.length === 0 && allTasks.length > 0) {
        console.warn('No tasks found with query, trying manual filter...');
        console.log('Attempting to match facultyUid:', facultyUid, 'against', allTasks.length, 'tasks');
        
        const manuallyFiltered = allTasks.filter(task => {
          const assignedTo = task.assignedTo;
          const assignedToString = String(assignedTo || '').trim();
          const facultyUidString = String(facultyUid || '').trim();
          
          // Try multiple matching strategies
          const exactMatch = assignedTo === facultyUid;
          const stringMatch = assignedToString === facultyUidString;
          const caseInsensitiveMatch = assignedToString.toLowerCase() === facultyUidString.toLowerCase();
          
          const matches = exactMatch || stringMatch || caseInsensitiveMatch;
          
          if (assignedTo) {
            console.log(`Checking task "${task.title}":`, {
              assignedTo: assignedTo,
              facultyUid: facultyUid,
              exactMatch,
              stringMatch,
              caseInsensitiveMatch,
              matches
            });
          }
          
          return matches;
        });
        
        console.log('Manually filtered tasks:', manuallyFiltered.length);
        if (manuallyFiltered.length === 0) {
          console.error('⚠️ NO TASKS MATCHED!');
          console.error('This means the task.assignedTo field does not match the faculty UID.');
          console.error('Please check:');
          console.error('1. The task was created with the correct UID (not name)');
          console.error('2. The faculty member is logged in with the same account that was assigned the task');
          console.error('3. The assignedTo field in Firestore contains the UID, not the name');
        }
        
        return manuallyFiltered.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });
      }
      
      return sortedTasks;
    }
  } catch (error) {
    console.error('Error getting faculty tasks:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Get a single task by ID
 */
export const getTask = async (taskId) => {
  const taskDoc = await getDoc(doc(db, 'tasks', taskId));
  if (taskDoc.exists()) {
    return { id: taskDoc.id, ...taskDoc.data() };
  }
  return null;
};

/**
 * Update task status
 */
export const updateTaskStatus = async (taskId, status) => {
  await updateDoc(doc(db, 'tasks', taskId), {
    status
  });
};

/**
 * Reassign a task to a different faculty member
 */
export const reassignTask = async (taskId, newFacultyUid) => {
  console.log('Reassigning task:', taskId, 'to faculty UID:', newFacultyUid);
  await updateDoc(doc(db, 'tasks', taskId), {
    assignedTo: newFacultyUid
  });
  console.log('Task reassigned successfully');
};

// ========== SUBMISSION OPERATIONS ==========

/**
 * Create a submission for a task
 */
export const createSubmission = async (submissionData) => {
  await addDoc(collection(db, 'submissions'), {
    taskId: submissionData.taskId,
    facultyId: submissionData.facultyId,
    content: submissionData.content,
    submittedAt: serverTimestamp()
  });
  
  // Update task status to "submitted"
  await updateTaskStatus(submissionData.taskId, 'submitted');
};

/**
 * Get submission for a task
 */
export const getSubmission = async (taskId) => {
  const submissionsRef = collection(db, 'submissions');
  const q = query(submissionsRef, where('taskId', '==', taskId));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const submissionDoc = querySnapshot.docs[0];
    return { id: submissionDoc.id, ...submissionDoc.data() };
  }
  return null;
};

/**
 * Get all submissions (for HOD to review)
 */
export const getAllSubmissions = async () => {
  const submissionsRef = collection(db, 'submissions');
  const q = query(submissionsRef, orderBy('submittedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Approve a task submission
 * - Updates task status to "approved"
 * - Increments faculty completedTasks by 1
 * - Increments faculty score by 10
 */
export const approveTask = async (taskId, facultyUid) => {
  // Update task status
  await updateTaskStatus(taskId, 'approved');
  
  // Get current user data
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('uid', '==', facultyUid));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    // Update user score and completed tasks
    await updateDoc(doc(db, 'users', userDoc.id), {
      completedTasks: (userData.completedTasks || 0) + 1,
      score: (userData.score || 0) + 10
    });
  }
};


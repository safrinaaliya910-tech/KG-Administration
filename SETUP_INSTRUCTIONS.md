# Setup Instructions for Department Task Management System

## Step 1: Firebase Configuration

Your Firebase is already configured in `src/firebase/config.js`. Make sure:
- Firebase Authentication is enabled with Email/Password provider
- Firestore Database is created

## Step 2: Create Predefined Users

### Option A: Using the Setup Page (Recommended)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/setup`

3. Click "Create Predefined Users" button

4. This will create the following users:

   **HOD Account:**
   - Email: `hod@department.com`
   - Password: `hod123456`
   - Role: HOD

   **Faculty Accounts:**
   - Email: `faculty1@department.com`
   - Password: `faculty123`
   - Email: `faculty2@department.com`
   - Password: `faculty123`
   - Email: `faculty3@department.com`
   - Password: `faculty123`
   - Role: Faculty

### Option B: Manual Setup via Firebase Console

1. Go to Firebase Console > Authentication
2. Add users manually with the emails and passwords listed above
3. Go to Firestore Database
4. Create a `users` collection
5. For each user, create a document with:
   ```json
   {
     "uid": "firebase-auth-uid",
     "name": "User Name",
     "role": "hod" or "faculty",
     "score": 0,
     "completedTasks": 0
   }
   ```

## Step 3: Firestore Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'hod');
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'hod';
      allow update: if request.auth != null;
    }
    
    // Submissions collection
    match /submissions/{submissionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'faculty';
      allow update: if request.auth != null;
    }
  }
}
```

## Step 4: Test the Application

1. **Login as HOD:**
   - Go to `http://localhost:5173`
   - Click "HOD Login"
   - Use: `hod@department.com` / `hod123456`
   - Create a task and assign it to a faculty member

2. **Login as Faculty:**
   - Go to `http://localhost:5173`
   - Click "Faculty Login"
   - Use: `faculty1@department.com` / `faculty123`
   - View assigned tasks and submit work

3. **Approve as HOD:**
   - Login as HOD again
   - Go to "Submissions" page
   - Review and approve faculty submissions
   - Check that faculty score increases

## Features

### HOD Features:
- ✅ Separate HOD login interface
- ✅ Dashboard showing all tasks
- ✅ Create tasks with assignment to faculty
- ✅ View and approve submissions
- ✅ See faculty names (not just UIDs)

### Faculty Features:
- ✅ Separate Faculty login interface
- ✅ Dashboard showing assigned tasks
- ✅ Submit task work
- ✅ View profile with score and completed tasks

## Troubleshooting

**Issue: Users not created**
- Make sure Firebase Authentication is enabled
- Check browser console for errors
- Verify Firestore is initialized

**Issue: Can't login**
- Verify users were created successfully
- Check email/password are correct
- Ensure Firestore has user documents with correct `uid` field

**Issue: Tasks not showing**
- Check Firestore security rules
- Verify user role is set correctly in database
- Check browser console for errors


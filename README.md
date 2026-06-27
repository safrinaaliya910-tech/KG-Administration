# Department Task Management System

A full-stack web application for managing tasks between HOD (Head of Department) and Faculty members.

## Tech Stack

- **React** (Vite)
- **Tailwind CSS** (for styling)
- **Firebase** (Authentication + Firestore)
- **React Router DOM** (for routing)

## Features

### Authentication
- **Separate Login Interfaces**: Dedicated login pages for HOD and Faculty
- **Role-based Access**: Automatic redirection based on user role
- **Predefined Users**: Easy setup with predefined HOD and Faculty accounts
- **Secure Authentication**: Firebase email/password authentication

### HOD (Admin) Features
- **Separate HOD Login Interface**: Dedicated portal for Head of Department
- Dashboard showing all tasks with faculty names
- Create tasks with title, description, deadline, and assigned faculty
- View submitted tasks with faculty information
- Approve tasks (updates faculty score and completed tasks count)
- See faculty names instead of UIDs

### Faculty Features
- **Separate Faculty Login Interface**: Dedicated portal for Faculty members
- Dashboard showing assigned tasks only
- View task status and deadline
- Submit task work with text content
- View approval status
- Profile page showing score and completed tasks

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

Your Firebase is already configured! The config file is at `src/firebase/config.js`.

**Make sure:**
1. Firebase Authentication is enabled with Email/Password provider
2. Firestore Database is created (start in test mode for development)

### 3. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. First Time Login

1. Go to the home page - you'll see two login options (HOD and Faculty)
2. Click on your role to access the dedicated login page
3. Use the predefined credentials from Step 3
4. You'll be automatically redirected to your dashboard


## Usage

1. **Register**: Create an account as either HOD or Faculty
2. **Login**: Sign in with your credentials
3. **HOD**: Create tasks, view submissions, and approve tasks
4. **Faculty**: View assigned tasks, submit work, and check profile score

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout with navigation
│   └── ProtectedRoute.jsx  # Route protection
├── context/
│   └── AuthContext.jsx # Authentication context
├── firebase/
│   ├── config.js       # Firebase configuration
│   └── firestore.js    # Firestore CRUD operations
├── pages/
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── hod/           # HOD pages
│   │   ├── HODDashboard.jsx
│   │   ├── CreateTask.jsx
│   │   └── Submissions.jsx
│   └── faculty/        # Faculty pages
│       ├── FacultyDashboard.jsx
│       ├── SubmitTask.jsx
│       └── Profile.jsx
└── App.jsx            # Main app with routing
```

## Notes

- Faculty score increases by 10 points per approved task
- Completed tasks count increments when HOD approves a submission
- Tasks can only be submitted once (status changes from "pending" to "submitted")
- HOD can only approve tasks that are in "submitted" status

## Development

- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Lint code: `npm run lint`

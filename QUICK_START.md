# Quick Start Guide

## 🚀 Get the Website Running

### Step 1: Start the Development Server

The server should already be running! If not, run:

```bash
npm run dev
```

### Step 2: Open Your Browser

Go to: **http://localhost:5173**

You should see the main login page with two options:
- **HOD Login** (blue card)
- **Faculty Login** (green card)

### Step 3: Setup Predefined Users (First Time Only)

1. Click the link at the bottom: **"Setup Predefined Users (First Time Only)"**
   OR go directly to: **http://localhost:5173/setup**

2. Click **"Create Predefined Users"** button

3. Wait for the success message

### Step 4: Login and Test

#### Test as HOD:
1. Click **"HOD Login"** card
2. Enter:
   - Email: `hod@department.com`
   - Password: `hod123456`
3. You'll see the HOD Dashboard
4. Try creating a task and assigning it to a faculty member

#### Test as Faculty:
1. Click **"Faculty Login"** card
2. Enter:
   - Email: `faculty1@department.com`
   - Password: `faculty123`
3. You'll see the Faculty Dashboard with assigned tasks
4. Try submitting a task

#### Complete Workflow:
1. **HOD** → Create Task → Assign to Faculty
2. **Faculty** → View Task → Submit Work
3. **HOD** → Go to Submissions → Approve Task
4. **Faculty** → Check Profile → See Updated Score

## ✅ Everything Should Work Now!

- ✅ Separate login interfaces for HOD and Faculty
- ✅ All data stored in Firebase
- ✅ Predefined users ready to use
- ✅ Full workflow: Create → Submit → Approve → Score Update

## 🔧 Troubleshooting

**If the server isn't running:**
```bash
npm run dev
```

**If you see errors:**
- Check browser console (F12)
- Make sure Firebase is configured correctly
- Verify Firestore database is created
- Check that Authentication is enabled

**If users aren't created:**
- Go to `/setup` page
- Click "Create Predefined Users"
- Check browser console for any errors

## 📝 Predefined Users

| Role | Email | Password |
|------|-------|----------|
| HOD | hod@department.com | hod123456 |
| Faculty 1 | faculty1@department.com | faculty123 |
| Faculty 2 | faculty2@department.com | faculty123 |
| Faculty 3 | faculty3@department.com | faculty123 |

---

**The website is now fully functional and ready to use!** 🎉


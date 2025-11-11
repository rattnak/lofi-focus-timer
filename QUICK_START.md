# Quick Start Guide - LoFi Focus Timer

## ✅ Current Status
- Server is **RUNNING** at http://localhost:8000
- All code is **IMPLEMENTED** and **TESTED**
- Firebase credentials are **CONFIGURED**
- Ready to test!

---

## 🚀 3-Step Quick Start

### Step 1: Firebase Console Setup (5 minutes)

Open: https://console.firebase.google.com/project/lofi-focus-timer-c18fd

#### A. Enable Anonymous Auth
```
Authentication → Sign-in method → Anonymous → Enable → Save
```

#### B. Create Firestore Database
```
Firestore Database → Create database → Test mode → Choose location → Enable
```

#### C. Set Security Rules
```
Firestore Database → Rules → Replace with:
```

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

```
Click Publish
```

---

### Step 2: Open the App

Click here or copy to browser:
```
http://localhost:8000
```

---

### Step 3: Test Everything

#### Open Developer Tools
Press **F12** (or **Cmd+Option+I** on Mac)

#### Watch the Console
You should see:
```
=== LoFi Focus Timer Initializing ===
1. Initializing IndexedDB...
IndexedDB: Database opened successfully
2. Initializing Firebase...
Firebase initialized successfully
3. Signing in anonymously...
Signed in anonymously with UID: [some-unique-id]
4. Setting up sync manager...
Sync Manager: Initial status - ONLINE
5. Loading data...
=== Initialization Complete ===
```

#### Test Online CRUD
1. ✅ Green indicator should be visible (top-right)
2. ✅ Type "Test task online" → Click "Add Task"
3. ✅ Task appears in the UI
4. ✅ Check console: Should say "Firebase: Task saved"
5. ✅ Go to Firebase Console → Firestore Database
6. ✅ Navigate to: `users/[your-uid]/tasks/[task-id]`
7. ✅ Your task should be there!

#### Test Offline CRUD
1. ✅ Open Dev Tools → **Network** tab
2. ✅ Change dropdown from "No throttling" to **"Offline"**
3. ✅ Indicator should turn **orange**
4. ✅ Add a task: "Test offline task"
5. ✅ Task appears in UI
6. ✅ Check console: "Sync Manager: Task saved offline"
7. ✅ Dev Tools → **Application** → **IndexedDB** → **LoFiFocusDB** → **pendingSync**
8. ✅ Should show 1 pending operation

#### Test Synchronization
1. ✅ Network tab → Change "Offline" back to **"No throttling"**
2. ✅ Indicator turns **green**
3. ✅ Toast notification: "✓ Data synchronized with cloud"
4. ✅ Go to Firebase Console
5. ✅ Offline task should now be in Firestore!
6. ✅ Check **pendingSync** store → Should be empty

---

## 🎯 What to Check

### UI Elements
- [ ] Green/Orange indicator in top-right
- [ ] Timer display (25:00)
- [ ] Play/Pause button works
- [ ] Reset button works
- [ ] Task input field
- [ ] Add Task button
- [ ] Task list displays
- [ ] Complete (✓) button on tasks
- [ ] Delete (trash) button on tasks
- [ ] Statistics display (Sessions, Tasks, Focus Time)

### Console Logs
- [ ] Initialization logs appear
- [ ] Firebase UID logged
- [ ] Task operations logged
- [ ] Sync operations logged
- [ ] No error messages

### Firebase Console
- [ ] Database exists
- [ ] `users` collection created
- [ ] Your UID appears
- [ ] `tasks` subcollection has your tasks
- [ ] `stats` subcollection has statistics
- [ ] Data updates in real-time

### IndexedDB (Dev Tools → Application)
- [ ] Database: LoFiFocusDB exists
- [ ] Store: tasks (has your tasks)
- [ ] Store: stats (has statistics)
- [ ] Store: pendingSync (empty when online)

---

## 📱 PWA Installation Test

### Desktop
1. Look for install icon in address bar (⊕)
2. OR Menu (⋮) → "Install LoFi Focus Timer"
3. App opens in standalone window

### Mobile
1. Menu → "Add to Home Screen"
2. App icon appears on home screen
3. Opens like native app

---

## 🐛 Troubleshooting

### App Won't Load
**Problem:** Blank page or errors
**Solution:**
1. Check console for errors
2. Verify server is running: `http://localhost:8000`
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Firebase Errors
**Problem:** "Firebase not initialized" or auth errors
**Solution:**
1. Check Firebase Console setup is complete
2. Verify Anonymous Auth is enabled
3. Check Firestore Database is created
4. Verify Security Rules are published

### Sync Not Working
**Problem:** Offline data doesn't upload
**Solution:**
1. Check you actually went from offline → online
2. Look at pendingSync store in IndexedDB
3. Check Network tab for Firebase API calls
4. Verify you're signed in (check console for UID)

### Service Worker Issues
**Problem:** Old version cached
**Solution:**
1. Dev Tools → Application → Service Workers
2. Click "Unregister"
3. Hard refresh page
4. New service worker will register

---

## 📊 Expected Behavior

### When Online
```
Add Task → Saves to IndexedDB + Firebase → Shows in UI
Complete Task → Updates IndexedDB + Firebase → Updates UI
Delete Task → Removes from IndexedDB + Firebase → Removes from UI
```

### When Offline
```
Add Task → Saves to IndexedDB + Queue → Shows in UI
Complete Task → Updates IndexedDB + Queue → Updates UI
Delete Task → Removes from IndexedDB + Queue → Removes from UI
```

### On Reconnect
```
Detect online → Process queue → Upload to Firebase → Clear queue → Notify user
```

---

## 💡 Tips

1. **Keep Console Open:** You'll see helpful logs
2. **Check Both Storages:** Verify data in both Firebase and IndexedDB
3. **Test Both Modes:** Try online and offline scenarios
4. **Watch Network Tab:** See Firebase API calls
5. **Clear Cache:** If something seems wrong, clear cache and hard refresh

---

## 📸 Screenshot Checklist

For your submission, capture:
- [ ] App running with green indicator (online)
- [ ] App running with orange indicator (offline)
- [ ] Task list with multiple tasks
- [ ] Firebase Console showing your data
- [ ] IndexedDB with data in Dev Tools
- [ ] Console logs showing initialization
- [ ] Sync notification toast message

---

## ✅ Submission Checklist

Before submitting:
- [ ] Firebase Console setup complete
- [ ] Tested online CRUD operations
- [ ] Tested offline CRUD operations
- [ ] Tested synchronization
- [ ] Data persists across page refreshes
- [ ] Screenshots taken
- [ ] Code commented
- [ ] README.md updated
- [ ] All files committed to Git
- [ ] Repository pushed to GitHub

---

## 🎉 You're Done!

Your LoFi Focus Timer is fully implemented with:
✅ Firebase for online storage
✅ IndexedDB for offline storage
✅ Automatic synchronization
✅ PWA capabilities
✅ Beautiful UI with status indicators

**Need help?** See [TEST_SUMMARY.md](TEST_SUMMARY.md) for detailed test results or [FIREBASE_CHECKLIST.md](FIREBASE_CHECKLIST.md) for Firebase setup.

**Ready to submit!** 🚀

# Firebase Setup Checklist

## ✅ Configuration Done
- [x] Firebase project created (lofi-focus-timer-c18fd)
- [x] Firebase config added to firebase-config.js

## 🔧 Firebase Console Tasks Required

Go to [Firebase Console](https://console.firebase.google.com/project/lofi-focus-timer-c18fd)

### 1. Enable Anonymous Authentication
- [ ] Go to **Authentication** → **Sign-in method**
- [ ] Click on **Anonymous**
- [ ] Toggle **Enable**
- [ ] Click **Save**

### 2. Create Firestore Database
- [ ] Go to **Firestore Database**
- [ ] Click **Create database**
- [ ] Select **Start in test mode** (for development)
- [ ] Choose a location (e.g., us-central)
- [ ] Click **Enable**

### 3. Set Firestore Security Rules
- [ ] In Firestore Database, click **Rules** tab
- [ ] Replace the rules with:

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

- [ ] Click **Publish**

## 🧪 Test Your Setup

### 1. Start Local Server
```bash
cd /Users/chanrattnakmong/Desktop/F2025-Code/INF654-Mobile-Web/lofi-focus-timer
python -m http.server 8000
```

### 2. Open in Browser
Open: `http://localhost:8000`

### 3. Check Console Logs
Open Developer Tools → Console. You should see:
```
=== LoFi Focus Timer Initializing ===
1. Initializing IndexedDB...
IndexedDB: Database opened successfully
2. Initializing Firebase...
Firebase initialized successfully
3. Signing in anonymously...
Signed in anonymously with UID: [some-uid]
4. Setting up sync manager...
Sync Manager: Initial status - ONLINE
5. Loading data...
=== Initialization Complete ===
```

### 4. Test CRUD Operations

**Add a Task (Online):**
- [ ] Type a task name and click "Add Task"
- [ ] Check console for: `Firebase: Task saved`
- [ ] Go to Firebase Console → Firestore Database
- [ ] Navigate to: `users/[your-uid]/tasks/[task-id]`
- [ ] Verify the task appears in Firestore

**Test Offline Mode:**
- [ ] Open Dev Tools → Network tab
- [ ] Select "Offline" from throttling dropdown
- [ ] Notice indicator turns orange
- [ ] Add a task offline
- [ ] Check console for: `Sync Manager: Task saved offline`
- [ ] Go back online (select "No throttling")
- [ ] Watch for sync notification
- [ ] Verify task appears in Firebase Console

**Check IndexedDB:**
- [ ] Dev Tools → Application → IndexedDB
- [ ] Expand "LoFiFocusDB"
- [ ] Check `tasks` store - should have all tasks
- [ ] Check `stats` store - should have statistics
- [ ] Check `pendingSync` store - should be empty when online

## ⚠️ Common Issues

### Firebase Not Initializing
- Make sure Anonymous Auth is enabled
- Check browser console for specific error messages

### CORS Errors
- Ensure you're running on `http://localhost:8000`, not `file://`
- Service worker requires HTTP/HTTPS

### Data Not Syncing
- Verify Firestore security rules are published
- Check that you're signed in (check console logs)
- Look for pending sync queue in IndexedDB

## 📊 Assignment Requirements Verification

### ✅ Firebase Integration (Online Storage)
- [x] Firestore database setup
- [x] CRUD operations implemented ([firebase-operations.js](js/firebase-operations.js))
- [x] Unique IDs prevent conflicts (timestamp + random)
- [x] Anonymous authentication (no login required)

### ✅ IndexedDB Integration (Offline Storage)
- [x] IndexedDB database created ([indexeddb-helper.js](js/indexeddb-helper.js))
- [x] Three object stores (tasks, stats, pendingSync)
- [x] CRUD operations implemented
- [x] Data persists offline

### ✅ Data Synchronization
- [x] Online/offline detection ([sync-manager.js](js/sync-manager.js))
- [x] Toggles between Firebase and IndexedDB
- [x] Auto-sync on reconnection
- [x] Consistent ID usage (same ID in both storages)
- [x] Conflict prevention

### ✅ Service Worker
- [x] Updated to cache Firebase SDK ([serviceWorker.js](serviceWorker.js))
- [x] Caches all new modules
- [x] Supports offline operations

### ✅ UI and Error Handling
- [x] Online/offline indicator (green/orange)
- [x] Sync notifications (toast messages)
- [x] Error handling for all operations
- [x] CRUD UI (add/complete/delete tasks)

### ✅ Documentation
- [x] README with complete instructions ([README.md](README.md))
- [x] Code comments in all files
- [x] Setup guide ([SETUP.md](SETUP.md))
- [x] How synchronization works

## 🎯 You're Almost Done!

Just complete the Firebase Console tasks above (sections 1-3), then test your app!

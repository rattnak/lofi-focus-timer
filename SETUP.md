# Quick Setup Guide

## Step 1: Firebase Configuration

1. Open [js/firebase-config.js](js/firebase-config.js)

2. Replace the placeholder config with your Firebase values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                          // From Firebase Console
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",   // From Firebase Console
  projectId: "YOUR_PROJECT_ID",                     // From Firebase Console
  storageBucket: "YOUR_PROJECT_ID.appspot.com",     // From Firebase Console
  messagingSenderId: "YOUR_SENDER_ID",              // From Firebase Console
  appId: "YOUR_APP_ID"                              // From Firebase Console
};
```

## Step 2: Firebase Console Setup

### Enable Anonymous Authentication
1. Go to Firebase Console → Authentication
2. Click "Sign-in method" tab
3. Enable "Anonymous"
4. Click "Save"

### Create Firestore Database
1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Select "Start in test mode"
4. Choose location
5. Click "Enable"

### Set Security Rules
1. Go to Firestore Database → Rules
2. Paste this:

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

3. Click "Publish"

## Step 3: Run the App

```bash
# Python 3
python -m http.server 8000

# OR Node.js
npx http-server

# OR VS Code Live Server
# Right-click index.html → Open with Live Server
```

## Step 4: Test

1. Open `http://localhost:8000`
2. Check browser console for initialization logs
3. Add a task - it should save to both IndexedDB and Firebase
4. Check Firebase Console → Firestore to see your data
5. Go offline (Dev Tools → Network → Offline)
6. Add more tasks offline
7. Go back online - watch for sync notification

## Checklist

- [ ] Firebase project created
- [ ] Anonymous auth enabled
- [ ] Firestore database created
- [ ] Security rules set
- [ ] Firebase config updated in `js/firebase-config.js`
- [ ] App running on local server
- [ ] Green online indicator visible
- [ ] Tasks saving to Firebase (check console)
- [ ] Offline mode works (orange indicator)
- [ ] Sync works when reconnecting

## Troubleshooting

**App won't load:**
- Check browser console for errors
- Verify you're on `http://localhost`, not `file://`

**Firebase errors:**
- Double-check your config values
- Ensure anonymous auth is enabled
- Check security rules are published

**Sync not working:**
- Open Dev Tools → Application → IndexedDB → LoFiFocusDB
- Check `pendingSync` store for queued operations
- Check Network tab for Firebase API calls

## Need Help?

Check the detailed [README.md](README.md) for more information.

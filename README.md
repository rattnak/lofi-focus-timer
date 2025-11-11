# LoFi Focus Timer

A minimalistic Pomodoro timer Progressive Web App (PWA) with **Firebase and IndexedDB integration** for seamless online/offline data synchronization. Designed for focused work sessions with a beautiful, distraction-free interface.

## Features

- **Pomodoro Timer**: 25-minute focus sessions with 5-minute breaks
- **Task Management**: Create, complete, and delete daily tasks with full CRUD operations
- **Session Statistics**: Monitor sessions completed, tasks done, and total focus time
- **Firebase Integration**: Online cloud storage with anonymous authentication
- **IndexedDB Integration**: Offline-first local storage for seamless offline functionality
- **Automatic Synchronization**: Data syncs automatically between IndexedDB and Firebase when online
- **Online/Offline Detection**: Visual indicator shows connection status
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Progressive Web App**: Install and use offline on any device
- **Modern UI**: Gradient animations, glassmorphism effects, and smooth transitions

## New Features (Assignment 2)

### Firebase Integration
- **Cloud Storage**: All tasks and statistics are stored in Firebase Firestore
- **Anonymous Authentication**: Each device gets a unique user ID without requiring login
- **Real-time Sync**: Data automatically syncs with Firebase when online
- **Secure**: Firestore security rules ensure each user can only access their own data

### IndexedDB Integration
- **Offline Storage**: Tasks and stats persist locally using IndexedDB
- **Three Object Stores**:
  - `tasks`: Stores all user tasks with unique IDs
  - `stats`: Stores user statistics (sessions, focus time, etc.)
  - `pendingSync`: Queue for operations that need to sync when online

### Data Synchronization
- **Online Mode**: All CRUD operations save to both IndexedDB and Firebase
- **Offline Mode**: Operations save to IndexedDB and queue for later sync
- **Auto-Sync**: When reconnecting online, pending operations automatically sync to Firebase
- **Conflict Prevention**: Uses timestamp-based unique IDs to prevent duplicates
- **Toast Notifications**: User is notified when data syncs successfully

## Project Structure

```
lofi-focus-timer/
├── index.html                  # Main application page
├── manifest.json               # PWA manifest file
├── serviceWorker.js            # Service worker for offline support and caching
├── .env                        # Firebase configuration (not committed to git)
├── css/
│   ├── materialize.css         # Materialize framework (full)
│   ├── materialize.min.css     # Materialize framework (minified)
│   └── style.css               # Custom styles and animations
├── js/
│   ├── firebase-config.js      # Firebase initialization and authentication
│   ├── firebase-operations.js  # Firebase CRUD operations (online storage)
│   ├── indexeddb-helper.js     # IndexedDB CRUD operations (offline storage)
│   ├── sync-manager.js         # Online/offline detection and synchronization logic
│   ├── ui.js                   # Main application logic and UI updates
│   ├── materialize.js          # Materialize JavaScript (full)
│   └── materialize.min.js      # Materialize JavaScript (minified)
├── pages/
│   ├── about.html              # About page
│   └── settings.html           # Settings page
└── README.md                   # Project documentation
```

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: ES6 modules for modern code organization
- **Materialize CSS**: UI framework for responsive design
- **Firebase**: Cloud storage and anonymous authentication
  - Firebase Authentication (Anonymous)
  - Firebase Firestore (Database)
- **IndexedDB**: Browser-based offline storage
- **Service Workers**: Offline functionality, caching, and PWA features
- **Web App Manifest**: PWA configuration for installation

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd lofi-focus-timer
```

### 2. Set Up Firebase

#### Create a Firebase Project:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Name your project (e.g., "LoFi Focus Timer")

#### Enable Anonymous Authentication:
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Anonymous** authentication
3. Click "Save"

#### Create Firestore Database:
1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location and click "Enable"

#### Get Firebase Configuration:
1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`) to add a web app
4. Register app with a nickname (e.g., "LoFi Focus Timer")
5. Copy the `firebaseConfig` object

#### Update Firebase Configuration:
Open [js/firebase-config.js](js/firebase-config.js) and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

#### Set Firestore Security Rules:
In Firebase Console → Firestore Database → Rules, add:

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

### 3. Run the Application

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server
```

**Using VS Code:**
- Install the "Live Server" extension
- Right-click `index.html` and select "Open with Live Server"

**Access the app:**
Open your browser and navigate to `http://localhost:8000`

### 4. Install as PWA

**Desktop (Chrome/Edge):**
- Look for the install icon in the address bar
- OR click the three-dot menu → "Install LoFi Focus Timer"

**Mobile:**
- Tap the menu (three dots)
- Select "Add to Home Screen" or "Install app"

## How It Works

### Online Mode (Firebase)
When your device is online:
1. **Anonymous sign-in** happens automatically on app load
2. All CRUD operations save to **Firebase Firestore**
3. Data is also saved to **IndexedDB** for offline backup
4. Green indicator shows you're online and syncing

### Offline Mode (IndexedDB)
When your device is offline:
1. All CRUD operations save to **IndexedDB**
2. Operations are added to a **pending sync queue**
3. Orange indicator shows you're offline
4. You can still use all features normally

### Synchronization Process
When you reconnect online:
1. App detects online status change
2. **Sync Manager** processes pending operations
3. Queued changes upload to Firebase
4. Toast notification confirms successful sync
5. Indicator turns green

### Data Persistence
- **Across Sessions**: Data persists in IndexedDB even when closing the browser
- **Across Devices**: Data syncs to Firebase and can be accessed on other devices with same anonymous user ID
- **Offline-First**: App works fully offline and syncs when possible

## CRUD Operations

### Online Mode
- **Create**: Task/Stats → IndexedDB + Firebase
- **Read**: Firebase → IndexedDB (cache update)
- **Update**: IndexedDB + Firebase
- **Delete**: IndexedDB + Firebase

### Offline Mode
- **Create**: Task/Stats → IndexedDB + Pending Sync Queue
- **Read**: IndexedDB
- **Update**: IndexedDB + Pending Sync Queue
- **Delete**: IndexedDB + Pending Sync Queue

### Sync on Reconnect
- Pending operations execute sequentially
- Firebase receives all queued changes
- Duplicate prevention via unique IDs
- Failed operations remain in queue for retry

## Testing Instructions

### Functional Testing
1. **Online CRUD**:
   - Ensure you're online (green indicator)
   - Add, complete, and delete tasks
   - Check browser console for Firebase logs
   - Verify data in Firebase Console → Firestore Database

2. **Offline CRUD**:
   - Go offline (Dev Tools → Network → Offline)
   - Add, complete, and delete tasks
   - Check that orange indicator appears
   - Verify operations work smoothly

3. **Synchronization**:
   - Perform operations offline
   - Go back online
   - Watch for sync notification
   - Verify changes appear in Firebase Console

4. **Persistence**:
   - Add tasks and refresh the page
   - Close browser and reopen
   - Verify all data persists

### Cross-Device Compatibility
Test on:
- Chrome/Edge (Desktop)
- Firefox (Desktop)
- Safari (macOS/iOS)
- Chrome (Android)

### Browser Support
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Opera 67+

**Note**: PWA features require HTTPS (or localhost for development)

## UI and Error Handling

### Online/Offline Indicator
- **Green (pulsing)**: Online - Data syncing to cloud
- **Orange**: Offline - Data saved locally, will sync later

### Toast Notifications
- Task added/completed/deleted
- Sync success/failure messages
- Offline mode warnings
- Connection status changes

### Error Handling
- Firebase connection failures
- IndexedDB quota exceeded
- Network timeouts
- Sync retry logic

## Firebase ID Management

### Unique ID Strategy
Tasks use timestamp + random string:
```javascript
id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
```

### Benefits
- **Unique**: Timestamp + random ensures no collisions
- **Offline-Safe**: Generated client-side without Firebase
- **Consistent**: Same ID used in IndexedDB and Firebase
- **Sortable**: Timestamp prefix allows chronological sorting

## Service Worker Caching

The service worker caches:
- Static assets (HTML, CSS, JS)
- Materialize CSS and JS
- Firebase SDK files
- Google Material Icons
- All custom modules

**Cache Strategy**: Network-first with cache fallback for offline support

## Development Notes

### ES6 Modules
The app uses ES6 modules for code organization. All modules must be imported with `type="module"`:
```html
<script type="module" src="js/ui.js"></script>
```

### Code Comments
All files contain detailed comments explaining:
- Purpose of functions
- Data flow between modules
- Error handling logic
- Synchronization strategy

## Troubleshooting

### App Won't Load
- Check browser console for errors
- Verify Firebase config is correct
- Ensure you're serving over HTTP/HTTPS (not file://)

### Data Not Syncing
- Check Firebase security rules
- Verify anonymous auth is enabled
- Check network tab for API errors
- Look for sync queue in IndexedDB

### Service Worker Issues
- Unregister old service worker in Dev Tools
- Clear cache and hard reload
- Update cache version in serviceWorker.js

## Future Enhancements

- Multi-device sync with same anonymous ID
- Data export/import functionality
- Task categories and priorities
- Weekly/monthly statistics
- Custom timer sounds
- Theme customization
- Settings sync across devices

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Materialize CSS](https://materializecss.com/)
- Icons from [Google Material Icons](https://fonts.google.com/icons)
- Powered by [Firebase](https://firebase.google.com/)
- Inspired by the Pomodoro Technique by Francesco Cirillo

## Submission Information

**Assignment**: INF654 - Week [X] - Firebase and IndexedDB Integration
**Student**: [Your Name]
**Date**: [Submission Date]

This project demonstrates:
- ✅ Firebase Firestore integration for online storage
- ✅ Anonymous authentication without login UI
- ✅ IndexedDB for offline storage
- ✅ CRUD operations in both online and offline modes
- ✅ Online/offline detection and status indication
- ✅ Automatic data synchronization when reconnecting
- ✅ Firebase ID consistency across storage systems
- ✅ Service worker updated for new dependencies
- ✅ Error handling and user notifications
- ✅ Comprehensive documentation

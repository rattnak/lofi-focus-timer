# LoFi Focus Timer - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│                         (index.html)                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐  │
│  │  Timer  │  │  Tasks  │  │  Stats  │  │ Online/      │  │
│  │         │  │  CRUD   │  │         │  │ Offline      │  │
│  └─────────┘  └─────────┘  └─────────┘  │ Indicator    │  │
└─────────────────────────────────────────┴──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LOGIC                        │
│                         (ui.js)                              │
│  - Timer management                                          │
│  - Task CRUD operations                                      │
│  - Statistics tracking                                       │
│  - UI updates                                                │
└──────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SYNC MANAGER                            │
│                    (sync-manager.js)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Online/Offline Detection                             │  │
│  │  - Monitors navigator.onLine                          │  │
│  │  - Triggers sync on reconnection                      │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Storage Routing Logic                                │  │
│  │  - Routes to Firebase when online                     │  │
│  │  - Routes to IndexedDB when offline                   │  │
│  │  - Manages pending sync queue                         │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
      ONLINE   │                               │  OFFLINE
               ▼                               ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   FIREBASE OPERATIONS    │    │   INDEXEDDB HELPER       │
│  (firebase-operations.js)│    │  (indexeddb-helper.js)   │
├──────────────────────────┤    ├──────────────────────────┤
│ ┌──────────────────────┐ │    │ ┌──────────────────────┐ │
│ │  CRUD Operations     │ │    │ │  CRUD Operations     │ │
│ │  - saveTask()        │ │    │ │  - saveTask()        │ │
│ │  - getTasks()        │ │    │ │  - getTasks()        │ │
│ │  - deleteTask()      │ │    │ │  - deleteTask()      │ │
│ │  - saveStats()       │ │    │ │  - saveStats()       │ │
│ │  - getStats()        │ │    │ │  - getStats()        │ │
│ └──────────────────────┘ │    │ └──────────────────────┘ │
└────────────┬─────────────┘    └──────────┬───────────────┘
             │                              │
             ▼                              ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   FIREBASE FIRESTORE     │    │   BROWSER INDEXEDDB      │
├──────────────────────────┤    ├──────────────────────────┤
│ users/                   │    │ LoFiFocusDB/             │
│ └─ {userId}/             │    │ ├─ tasks/                │
│    ├─ tasks/             │    │ │  └─ {taskId}           │
│    │  └─ {taskId}        │    │ ├─ stats/                │
│    └─ stats/             │    │ │  └─ currentStats       │
│       └─ currentStats    │    │ └─ pendingSync/          │
│                          │    │    └─ {operations}       │
└──────────────────────────┘    └──────────────────────────┘
      ☁️ Cloud Storage           💾 Local Storage
```

## Data Flow Diagrams

### Online Mode - Create Task

```
User enters task
      │
      ▼
[ui.js] addTask()
      │
      ▼
[sync-manager.js] saveTask()
      │
      ├──────────────────┬──────────────────┐
      ▼                  ▼                  ▼
Save to IndexedDB   Save to Firebase   Show Toast
(backup/cache)      (primary storage)   Notification
      │                  │
      ▼                  ▼
  Success!         users/{uid}/tasks/{id}
                         │
                         ▼
                   Data in Cloud ☁️
```

### Offline Mode - Create Task

```
User enters task (OFFLINE)
      │
      ▼
[ui.js] addTask()
      │
      ▼
[sync-manager.js] saveTask()
      │
      ├──────────────────┬──────────────────┐
      ▼                  ▼                  ▼
Save to IndexedDB   Add to            Show Toast
(primary storage)   pendingSync       "Saved offline"
                    Queue
      │                  │
      ▼                  ▼
  Success!         Waiting for sync...
```

### Reconnection - Auto Sync

```
Device goes ONLINE
      │
      ▼
[sync-manager.js] handleOnline()
      │
      ▼
Get pending operations from IndexedDB
      │
      ▼
For each operation:
├─ saveTask → Firebase
├─ deleteTask → Firebase
└─ saveStats → Firebase
      │
      ▼
Remove from pendingSync queue
      │
      ▼
Show "Data synchronized" notification
      │
      ▼
All data now in cloud! ☁️
```

## Module Dependencies

```
index.html
    │
    ├─── ui.js (type="module")
    │     │
    │     ├─── firebase-config.js
    │     │       │
    │     │       └─── Firebase SDK (CDN)
    │     │
    │     ├─── indexeddb-helper.js
    │     │       │
    │     │       └─── Browser IndexedDB API
    │     │
    │     ├─── firebase-operations.js
    │     │       │
    │     │       └─── firebase-config.js
    │     │
    │     └─── sync-manager.js
    │             │
    │             ├─── indexeddb-helper.js
    │             └─── firebase-operations.js
    │
    └─── serviceWorker.js (non-module)
              │
              └─── Caches all of the above
```

## CRUD Operation Flow

### CREATE (Add Task)

**Online:**
```
1. User clicks "Add Task"
2. Generate unique ID: 'task_' + timestamp + random
3. Create task object with ID
4. sync-manager.saveTask(task)
   ├─ Save to IndexedDB (backup)
   └─ Save to Firebase (primary)
5. Update UI
6. Show success toast
```

**Offline:**
```
1. User clicks "Add Task"
2. Generate unique ID (same format)
3. Create task object with ID
4. sync-manager.saveTask(task)
   ├─ Save to IndexedDB (primary)
   └─ Add to pendingSync queue
5. Update UI
6. Show "Saved offline" toast
7. When online: Auto-sync to Firebase
```

### READ (Load Tasks)

**Online:**
```
1. App initializes
2. sync-manager.getTasks()
   ├─ Fetch from Firebase
   └─ Update IndexedDB cache
3. Display tasks in UI
```

**Offline:**
```
1. App initializes
2. sync-manager.getTasks()
   └─ Fetch from IndexedDB
3. Display tasks in UI
```

### UPDATE (Complete Task)

**Online:**
```
1. User clicks "Complete"
2. Update task object (completed: true)
3. sync-manager.saveTask(task)
   ├─ Update in IndexedDB
   └─ Update in Firebase
4. Update stats
5. Update UI
```

**Offline:**
```
1. User clicks "Complete"
2. Update task object
3. sync-manager.saveTask(task)
   ├─ Update in IndexedDB
   └─ Add to pendingSync queue
4. Update stats (also queued)
5. Update UI
6. When online: Auto-sync
```

### DELETE (Remove Task)

**Online:**
```
1. User clicks "Delete"
2. sync-manager.deleteTask(taskId)
   ├─ Delete from IndexedDB
   └─ Delete from Firebase
3. Update UI
```

**Offline:**
```
1. User clicks "Delete"
2. sync-manager.deleteTask(taskId)
   ├─ Delete from IndexedDB
   └─ Add delete operation to pendingSync
3. Update UI
4. When online: Auto-sync deletion
```

## ID Management Strategy

### Why Unique IDs Matter
- Prevents duplicates during sync
- Same ID used in both IndexedDB and Firebase
- Allows offline operation creation
- No conflicts when syncing

### ID Format
```javascript
'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
// Example: task_1699123456789_k2j4n5m8p
```

### Benefits
- **Timestamp**: Orders chronologically
- **Random**: Prevents collisions
- **Client-generated**: Works offline
- **Consistent**: Same in both storages

## Error Handling

```
Operation Failed
      │
      ▼
Is it a network error?
      │
      ├─ Yes → Save to IndexedDB + Queue for sync
      │         Show: "Saved offline, will sync later"
      │
      └─ No → Log error
              Show: "Error occurred"
              Retry logic (if appropriate)
```

## Security Model

```
Firebase Security Rules:

users/{userId}/
    │
    └─── Only accessible if:
         request.auth.uid == userId

Anonymous Authentication:
    │
    ├─ Each device gets unique UID
    ├─ No login required
    └─ Data isolated per user
```

## Service Worker Caching Strategy

```
Request
    │
    ▼
Try Network First
    │
    ├─ Success → Update cache & return
    │
    └─ Fail → Serve from cache
              │
              └─ Not in cache? → Error
```

## Summary

This architecture provides:
- ✅ Offline-first functionality
- ✅ Automatic synchronization
- ✅ Data persistence
- ✅ Conflict-free operations
- ✅ User-friendly error handling
- ✅ Scalable design

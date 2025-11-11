// ==========================================
// IndexedDB Helper Module
// Handles offline data storage using IndexedDB
// ==========================================

const DB_NAME = 'LoFiFocusDB';
const DB_VERSION = 1;
const TASKS_STORE = 'tasks';
const STATS_STORE = 'stats';
const PENDING_SYNC_STORE = 'pendingSync';

let db = null;

// Initialize IndexedDB
function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB: Error opening database');
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('IndexedDB: Database opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      console.log('IndexedDB: Upgrading database...');

      // Create tasks object store
      if (!db.objectStoreNames.contains(TASKS_STORE)) {
        const tasksStore = db.createObjectStore(TASKS_STORE, { keyPath: 'id' });
        tasksStore.createIndex('completed', 'completed', { unique: false });
        tasksStore.createIndex('createdAt', 'createdAt', { unique: false });
        console.log('IndexedDB: Tasks store created');
      }

      // Create stats object store
      if (!db.objectStoreNames.contains(STATS_STORE)) {
        db.createObjectStore(STATS_STORE, { keyPath: 'id' });
        console.log('IndexedDB: Stats store created');
      }

      // Create pending sync store for offline changes
      if (!db.objectStoreNames.contains(PENDING_SYNC_STORE)) {
        const syncStore = db.createObjectStore(PENDING_SYNC_STORE, { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        syncStore.createIndex('type', 'type', { unique: false });
        console.log('IndexedDB: Pending sync store created');
      }
    };
  });
}

// ==========================================
// Tasks Operations
// ==========================================

// Add or update task in IndexedDB
async function saveTaskToIndexedDB(task) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TASKS_STORE], 'readwrite');
    const store = transaction.objectStore(TASKS_STORE);
    const request = store.put(task);

    request.onsuccess = () => {
      console.log('IndexedDB: Task saved', task.id);
      resolve(task);
    };

    request.onerror = () => {
      console.error('IndexedDB: Error saving task');
      reject(request.error);
    };
  });
}

// Get all tasks from IndexedDB
async function getTasksFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TASKS_STORE], 'readonly');
    const store = transaction.objectStore(TASKS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      console.log('IndexedDB: Retrieved tasks', request.result.length);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('IndexedDB: Error getting tasks');
      reject(request.error);
    };
  });
}

// Get single task from IndexedDB
async function getTaskFromIndexedDB(taskId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TASKS_STORE], 'readonly');
    const store = transaction.objectStore(TASKS_STORE);
    const request = store.get(taskId);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Delete task from IndexedDB
async function deleteTaskFromIndexedDB(taskId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TASKS_STORE], 'readwrite');
    const store = transaction.objectStore(TASKS_STORE);
    const request = store.delete(taskId);

    request.onsuccess = () => {
      console.log('IndexedDB: Task deleted', taskId);
      resolve();
    };

    request.onerror = () => {
      console.error('IndexedDB: Error deleting task');
      reject(request.error);
    };
  });
}

// Clear all tasks from IndexedDB
async function clearTasksFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TASKS_STORE], 'readwrite');
    const store = transaction.objectStore(TASKS_STORE);
    const request = store.clear();

    request.onsuccess = () => {
      console.log('IndexedDB: All tasks cleared');
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// ==========================================
// Stats Operations
// ==========================================

// Save stats to IndexedDB
async function saveStatsToIndexedDB(stats) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STATS_STORE], 'readwrite');
    const store = transaction.objectStore(STATS_STORE);
    const statsWithId = { ...stats, id: 'currentStats' };
    const request = store.put(statsWithId);

    request.onsuccess = () => {
      console.log('IndexedDB: Stats saved');
      resolve(stats);
    };

    request.onerror = () => {
      console.error('IndexedDB: Error saving stats');
      reject(request.error);
    };
  });
}

// Get stats from IndexedDB
async function getStatsFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STATS_STORE], 'readonly');
    const store = transaction.objectStore(STATS_STORE);
    const request = store.get('currentStats');

    request.onsuccess = () => {
      const result = request.result || {
        sessionsToday: 0,
        tasksCompleted: 0,
        totalFocusTime: 0
      };
      console.log('IndexedDB: Retrieved stats');
      resolve(result);
    };

    request.onerror = () => {
      console.error('IndexedDB: Error getting stats');
      reject(request.error);
    };
  });
}

// ==========================================
// Pending Sync Operations
// ==========================================

// Add operation to pending sync queue
async function addToPendingSync(operation) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PENDING_SYNC_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_SYNC_STORE);
    const syncItem = {
      ...operation,
      timestamp: Date.now()
    };
    const request = store.add(syncItem);

    request.onsuccess = () => {
      console.log('IndexedDB: Added to pending sync', operation.type);
      resolve();
    };

    request.onerror = () => {
      console.error('IndexedDB: Error adding to pending sync');
      reject(request.error);
    };
  });
}

// Get all pending sync operations
async function getPendingSyncOperations() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PENDING_SYNC_STORE], 'readonly');
    const store = transaction.objectStore(PENDING_SYNC_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      console.log('IndexedDB: Retrieved pending sync operations', request.result.length);
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Remove operation from pending sync queue
async function removeFromPendingSync(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PENDING_SYNC_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_SYNC_STORE);
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log('IndexedDB: Removed from pending sync', id);
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Clear all pending sync operations
async function clearPendingSync() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PENDING_SYNC_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_SYNC_STORE);
    const request = store.clear();

    request.onsuccess = () => {
      console.log('IndexedDB: Cleared all pending sync operations');
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Export functions
export {
  initIndexedDB,
  saveTaskToIndexedDB,
  getTasksFromIndexedDB,
  getTaskFromIndexedDB,
  deleteTaskFromIndexedDB,
  clearTasksFromIndexedDB,
  saveStatsToIndexedDB,
  getStatsFromIndexedDB,
  addToPendingSync,
  getPendingSyncOperations,
  removeFromPendingSync,
  clearPendingSync
};

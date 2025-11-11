// ==========================================
// Sync Manager - Online/Offline Detection and Synchronization
// ==========================================

import {
  saveTaskToIndexedDB,
  getTasksFromIndexedDB,
  deleteTaskFromIndexedDB,
  saveStatsToIndexedDB,
  getStatsFromIndexedDB,
  addToPendingSync,
  getPendingSyncOperations,
  removeFromPendingSync,
  clearPendingSync
} from './indexeddb-helper.js';

import {
  saveTaskToFirebase,
  getTasksFromFirebase,
  deleteTaskFromFirebase,
  saveStatsToFirebase,
  getStatsFromFirebase
} from './firebase-operations.js';

import { getUserId } from './firebase-config.js';

// ==========================================
// Online/Offline State Management
// ==========================================

let isOnline = navigator.onLine;
let onlineStatusListeners = [];
let isSyncing = false;

// Initialize online/offline detection
function initOnlineOfflineDetection() {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Check initial status
  isOnline = navigator.onLine;
  console.log(`Sync Manager: Initial status - ${isOnline ? 'ONLINE' : 'OFFLINE'}`);

  // Notify listeners of initial status
  notifyStatusChange(isOnline);
}

// Handle coming online
async function handleOnline() {
  console.log('Sync Manager: Device is ONLINE');
  isOnline = true;
  notifyStatusChange(true);

  // Wait for Firebase auth to be ready
  setTimeout(() => {
    syncPendingOperations();
  }, 1000);
}

// Handle going offline
function handleOffline() {
  console.log('Sync Manager: Device is OFFLINE');
  isOnline = false;
  notifyStatusChange(false);
}

// Check if online
function checkIsOnline() {
  return isOnline;
}

// Add listener for online/offline status changes
function addOnlineStatusListener(callback) {
  onlineStatusListeners.push(callback);
}

// Notify all listeners of status change
function notifyStatusChange(online) {
  onlineStatusListeners.forEach(callback => callback(online));
}

// ==========================================
// Storage Layer - Routes to Firebase or IndexedDB
// ==========================================

// Save task (routes to appropriate storage)
async function saveTask(task) {
  try {
    // Always save to IndexedDB first for persistence
    await saveTaskToIndexedDB(task);

    if (isOnline && getUserId()) {
      // If online, save to Firebase
      try {
        await saveTaskToFirebase(task);
        console.log('Sync Manager: Task saved to Firebase');
      } catch (error) {
        console.error('Sync Manager: Failed to save to Firebase, added to sync queue');
        await addToPendingSync({
          type: 'saveTask',
          data: task
        });
      }
    } else {
      // If offline, add to pending sync
      await addToPendingSync({
        type: 'saveTask',
        data: task
      });
      console.log('Sync Manager: Task saved offline, will sync when online');
    }

    return task;
  } catch (error) {
    console.error('Sync Manager: Error saving task', error);
    throw error;
  }
}

// Get all tasks
async function getTasks() {
  try {
    if (isOnline && getUserId()) {
      // If online, get from Firebase and update IndexedDB
      try {
        const tasks = await getTasksFromFirebase();

        // Update IndexedDB with Firebase data
        for (const task of tasks) {
          await saveTaskToIndexedDB(task);
        }

        console.log('Sync Manager: Tasks loaded from Firebase');
        return tasks;
      } catch (error) {
        console.error('Sync Manager: Failed to load from Firebase, using IndexedDB');
        return await getTasksFromIndexedDB();
      }
    } else {
      // If offline, get from IndexedDB
      console.log('Sync Manager: Tasks loaded from IndexedDB (offline)');
      return await getTasksFromIndexedDB();
    }
  } catch (error) {
    console.error('Sync Manager: Error getting tasks', error);
    return [];
  }
}

// Delete task
async function deleteTask(taskId) {
  try {
    // Always delete from IndexedDB
    await deleteTaskFromIndexedDB(taskId);

    if (isOnline && getUserId()) {
      // If online, delete from Firebase
      try {
        await deleteTaskFromFirebase(taskId);
        console.log('Sync Manager: Task deleted from Firebase');
      } catch (error) {
        console.error('Sync Manager: Failed to delete from Firebase, added to sync queue');
        await addToPendingSync({
          type: 'deleteTask',
          data: { id: taskId }
        });
      }
    } else {
      // If offline, add to pending sync
      await addToPendingSync({
        type: 'deleteTask',
        data: { id: taskId }
      });
      console.log('Sync Manager: Task deletion queued for sync');
    }
  } catch (error) {
    console.error('Sync Manager: Error deleting task', error);
    throw error;
  }
}

// Save stats
async function saveStats(stats) {
  try {
    // Always save to IndexedDB
    await saveStatsToIndexedDB(stats);

    if (isOnline && getUserId()) {
      // If online, save to Firebase
      try {
        await saveStatsToFirebase(stats);
        console.log('Sync Manager: Stats saved to Firebase');
      } catch (error) {
        console.error('Sync Manager: Failed to save stats to Firebase');
        await addToPendingSync({
          type: 'saveStats',
          data: stats
        });
      }
    } else {
      // If offline, add to pending sync
      await addToPendingSync({
        type: 'saveStats',
        data: stats
      });
    }

    return stats;
  } catch (error) {
    console.error('Sync Manager: Error saving stats', error);
    throw error;
  }
}

// Get stats
async function getStats() {
  try {
    if (isOnline && getUserId()) {
      // If online, get from Firebase
      try {
        const stats = await getStatsFromFirebase();
        await saveStatsToIndexedDB(stats);
        console.log('Sync Manager: Stats loaded from Firebase');
        return stats;
      } catch (error) {
        console.error('Sync Manager: Failed to load stats from Firebase');
        return await getStatsFromIndexedDB();
      }
    } else {
      // If offline, get from IndexedDB
      console.log('Sync Manager: Stats loaded from IndexedDB (offline)');
      return await getStatsFromIndexedDB();
    }
  } catch (error) {
    console.error('Sync Manager: Error getting stats', error);
    return {
      sessionsToday: 0,
      tasksCompleted: 0,
      totalFocusTime: 0
    };
  }
}

// ==========================================
// Synchronization Logic
// ==========================================

// Sync pending operations with Firebase
async function syncPendingOperations() {
  if (!isOnline || !getUserId() || isSyncing) {
    return;
  }

  isSyncing = true;
  console.log('Sync Manager: Starting synchronization...');

  try {
    const pendingOps = await getPendingSyncOperations();

    if (pendingOps.length === 0) {
      console.log('Sync Manager: No pending operations to sync');
      isSyncing = false;
      return;
    }

    console.log(`Sync Manager: Syncing ${pendingOps.length} operations`);

    for (const op of pendingOps) {
      try {
        switch (op.type) {
          case 'saveTask':
            await saveTaskToFirebase(op.data);
            break;
          case 'deleteTask':
            await deleteTaskFromFirebase(op.data.id);
            break;
          case 'saveStats':
            await saveStatsToFirebase(op.data);
            break;
        }

        // Remove from pending sync after successful sync
        await removeFromPendingSync(op.id);
        console.log(`Sync Manager: Synced ${op.type}`);
      } catch (error) {
        console.error(`Sync Manager: Failed to sync ${op.type}`, error);
        // Keep in pending sync for retry
      }
    }

    console.log('Sync Manager: Synchronization complete');

    // Notify user
    if (typeof M !== 'undefined' && M.toast) {
      M.toast({
        html: '✓ Data synchronized with cloud',
        classes: 'rounded green'
      });
    }

  } catch (error) {
    console.error('Sync Manager: Error during sync', error);
  } finally {
    isSyncing = false;
  }
}

// Get sync status
function getSyncStatus() {
  return {
    isOnline,
    isSyncing
  };
}

// Force sync
async function forceSync() {
  if (isOnline && getUserId()) {
    await syncPendingOperations();
  } else {
    console.log('Sync Manager: Cannot sync - offline or not authenticated');
  }
}

// Export functions
export {
  initOnlineOfflineDetection,
  checkIsOnline,
  addOnlineStatusListener,
  saveTask,
  getTasks,
  deleteTask,
  saveStats,
  getStats,
  syncPendingOperations,
  getSyncStatus,
  forceSync
};

// ==========================================
// Firebase Operations Module
// Handles online data storage using Firebase Firestore
// ==========================================

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

import { getFirestoreDb, getUserId } from './firebase-config.js';

// ==========================================
// Tasks Operations
// ==========================================

// Save task to Firebase
async function saveTaskToFirebase(task) {
  try {
    const db = getFirestoreDb();
    const userId = getUserId();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const taskRef = doc(db, 'users', userId, 'tasks', task.id);
    await setDoc(taskRef, {
      ...task,
      updatedAt: serverTimestamp()
    });

    console.log('Firebase: Task saved', task.id);
    return task;
  } catch (error) {
    console.error('Firebase: Error saving task', error);
    throw error;
  }
}

// Get all tasks from Firebase
async function getTasksFromFirebase() {
  try {
    const db = getFirestoreDb();
    const userId = getUserId();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tasksRef = collection(db, 'users', userId, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push(doc.data());
    });

    console.log('Firebase: Retrieved tasks', tasks.length);
    return tasks;
  } catch (error) {
    console.error('Firebase: Error getting tasks', error);
    throw error;
  }
}

// Get single task from Firebase
async function getTaskFromFirebase(taskId) {
  try {
    const db = getFirestoreDb();
    const userId = getUserId();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);

    if (taskDoc.exists()) {
      return taskDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Firebase: Error getting task', error);
    throw error;
  }
}

// Delete task from Firebase
async function deleteTaskFromFirebase(taskId) {
  try {
    const db = getFirestoreDb();
    const userId = getUserId();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(taskRef);

    console.log('Firebase: Task deleted', taskId);
  } catch (error) {
    console.error('Firebase: Error deleting task', error);
    throw error;
  }
}

// Listen to tasks changes in real-time
function listenToTasksChanges(callback) {
  try {
    const db = getFirestoreDb();
    const userId = getUserId();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tasksRef = collection(db, 'users', userId, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push(doc.data());
      });
      callback(tasks);
    });
  } catch (error) {
    console.error('Firebase: Error setting up listener', error);
    throw error;
  }
}

// ==========================================
// Stats Operations
// ==========================================

// Save stats to Firebase
async function saveStatsToFirebase(stats) {
  try {
    const db = getFirestoreDb();
    const userId = getUserId();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const statsRef = doc(db, 'users', userId, 'stats', 'currentStats');
    await setDoc(statsRef, {
      ...stats,
      updatedAt: serverTimestamp()
    });

    console.log('Firebase: Stats saved');
    return stats;
  } catch (error) {
    console.error('Firebase: Error saving stats', error);
    throw error;
  }
}

// Get stats from Firebase
async function getStatsFromFirebase() {
  try {
    const db = getFirestoreDb();
    const userId = getUserId();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const statsRef = doc(db, 'users', userId, 'stats', 'currentStats');
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      console.log('Firebase: Retrieved stats');
      return statsDoc.data();
    } else {
      const defaultStats = {
        sessionsToday: 0,
        tasksCompleted: 0,
        totalFocusTime: 0
      };
      // Create default stats if doesn't exist
      await setDoc(statsRef, defaultStats);
      return defaultStats;
    }
  } catch (error) {
    console.error('Firebase: Error getting stats', error);
    throw error;
  }
}

// Export functions
export {
  saveTaskToFirebase,
  getTasksFromFirebase,
  getTaskFromFirebase,
  deleteTaskFromFirebase,
  listenToTasksChanges,
  saveStatsToFirebase,
  getStatsFromFirebase
};

// ==========================================
// LoFi Focus Timer - Application Logic
// Updated to use Firebase and IndexedDB with synchronization
// ==========================================

import { initializeFirebase, signInUser, onAuthChange } from './firebase-config.js';
import { initIndexedDB } from './indexeddb-helper.js';
import {
  initOnlineOfflineDetection,
  checkIsOnline,
  addOnlineStatusListener,
  saveTask as saveSyncTask,
  getTasks as getSyncTasks,
  deleteTask as deleteSyncTask,
  saveStats as saveSyncStats,
  getStats as getSyncStats
} from './sync-manager.js';

// Timer State
let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let isBreak = false;
const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

// Stats
let stats = {
  sessionsToday: 0,
  tasksCompleted: 0,
  totalFocusTime: 0
};

// Tasks
let tasks = [];

// ==========================================
// Initialization
// ==========================================

window.addEventListener('load', async () => {
  console.log('=== LoFi Focus Timer Initializing ===');

  try {
    // Show loading indicator
    showLoadingState();

    // 1. Initialize IndexedDB first (offline storage)
    console.log('1. Initializing IndexedDB...');
    await initIndexedDB();

    // 2. Initialize Firebase
    console.log('2. Initializing Firebase...');
    const firebaseInitialized = initializeFirebase();

    if (firebaseInitialized) {
      // 3. Sign in anonymously
      console.log('3. Signing in anonymously...');
      await signInUser();

      // 4. Listen for auth state changes
      onAuthChange((user) => {
        console.log('Auth state changed:', user ? user.uid : 'No user');
        loadDataFromStorage();
      });
    } else {
      console.warn('Firebase not initialized, running in offline mode only');
      await loadDataFromStorage();
    }

    // 5. Initialize online/offline detection and sync
    console.log('4. Setting up sync manager...');
    initOnlineOfflineDetection();
    addOnlineStatusListener(handleOnlineStatusChange);

    // 6. Load initial data
    console.log('5. Loading data...');
    await loadDataFromStorage();

    // 7. Update UI
    updateStatsDisplay();
    updateTaskList();
    updateCircleProgress();
    updateOnlineStatus(checkIsOnline());

    // 8. Initialize event listeners
    initializeEventListeners();

    hideLoadingState();
    console.log('=== Initialization Complete ===');

  } catch (error) {
    console.error('Error during initialization:', error);
    hideLoadingState();
    if (typeof M !== 'undefined' && M.toast) {
      M.toast({
        html: '⚠️ Error loading app. Some features may not work.',
        classes: 'rounded red'
      });
    }
  }
});

// Show loading state
function showLoadingState() {
  const container = document.querySelector('.container');
  if (container) {
    container.style.opacity = '0.5';
  }
}

// Hide loading state
function hideLoadingState() {
  const container = document.querySelector('.container');
  if (container) {
    container.style.opacity = '1';
  }
}

// Load data from storage
async function loadDataFromStorage() {
  try {
    // Load stats
    const loadedStats = await getSyncStats();
    if (loadedStats) {
      stats = loadedStats;
    }

    // Load tasks
    const loadedTasks = await getSyncTasks();
    if (loadedTasks && loadedTasks.length > 0) {
      tasks = loadedTasks;
    }

    updateStatsDisplay();
    updateTaskList();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Handle online/offline status changes
function handleOnlineStatusChange(isOnline) {
  console.log('Online status changed:', isOnline ? 'ONLINE' : 'OFFLINE');
  updateOnlineStatus(isOnline);

  if (isOnline) {
    if (typeof M !== 'undefined' && M.toast) {
      M.toast({
        html: '✓ Back online - syncing data...',
        classes: 'rounded green'
      });
    }
  } else {
    if (typeof M !== 'undefined' && M.toast) {
      M.toast({
        html: '⚠️ Offline - changes will sync when reconnected',
        classes: 'rounded orange'
      });
    }
  }
}

// Update online status indicator
function updateOnlineStatus(isOnline) {
  const statusIndicator = document.getElementById('online-status');
  if (statusIndicator) {
    statusIndicator.className = isOnline ? 'online-indicator online' : 'online-indicator offline';
    statusIndicator.title = isOnline ? 'Online - Data syncing to cloud' : 'Offline - Data saved locally';
  }
}

// ==========================================
// Event Listeners
// ==========================================

function initializeEventListeners() {
  const btnStart = document.getElementById('btn-start');
  const btnReset = document.getElementById('btn-reset');
  const btnAddTask = document.getElementById('btn-add-task');
  const taskInput = document.getElementById('task-input');

  btnStart.addEventListener('click', startTimer);
  btnReset.addEventListener('click', resetTimer);
  btnAddTask.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
}

// ==========================================
// Timer Functions
// ==========================================

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateCircleProgress() {
  const totalTime = isBreak ? BREAK_TIME : FOCUS_TIME;
  const progress = (totalTime - timeLeft) / totalTime;
  const circumference = 817;
  const offset = circumference * (1 - progress);
  const progressCircle = document.getElementById('progress-circle');
  progressCircle.style.strokeDashoffset = offset;
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    document.getElementById('timer-display').textContent = formatTime(timeLeft);
    updateCircleProgress();
  } else {
    completeSession();
  }
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    document.getElementById('play-icon').textContent = 'pause';
    timerInterval = setInterval(updateTimer, 1000);
  } else {
    pauseTimer();
  }
}

function pauseTimer() {
  isRunning = false;
  document.getElementById('play-icon').textContent = 'play_arrow';
  clearInterval(timerInterval);
}

function resetTimer() {
  pauseTimer();
  isBreak = false;
  timeLeft = FOCUS_TIME;
  document.getElementById('timer-display').textContent = formatTime(timeLeft);
  document.getElementById('timer-label').textContent = 'Focus Time';
  const progressCircle = document.getElementById('progress-circle');
  progressCircle.style.stroke = 'url(#gradient)';
  updateCircleProgress();
}

async function completeSession() {
  pauseTimer();

  if (!isBreak) {
    stats.sessionsToday++;
    stats.totalFocusTime += FOCUS_TIME;
    await saveSyncStats(stats);
    updateStatsDisplay();
    M.toast({ html: '🎉 Focus session complete! Time for a break.', classes: 'rounded' });
    startBreak();
  } else {
    M.toast({ html: '✨ Break time over! Ready for another session?', classes: 'rounded' });
    resetTimer();
  }
}

function startBreak() {
  isBreak = true;
  timeLeft = BREAK_TIME;
  document.getElementById('timer-display').textContent = formatTime(timeLeft);
  document.getElementById('timer-label').textContent = 'Break Time';
  const progressCircle = document.getElementById('progress-circle');
  progressCircle.style.stroke = 'url(#breakGradient)';
  updateCircleProgress();
}

// ==========================================
// Task Management Functions
// ==========================================

async function addTask() {
  const taskInput = document.getElementById('task-input');
  const taskName = taskInput.value.trim();

  if (taskName === '') {
    M.toast({ html: 'Please enter a task name', classes: 'rounded' });
    return;
  }

  const task = {
    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    name: taskName,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  try {
    await saveSyncTask(task);
    tasks.push(task);
    updateTaskList();
    taskInput.value = '';
    M.toast({ html: '✓ Task added!', classes: 'rounded' });
  } catch (error) {
    console.error('Error adding task:', error);
    M.toast({ html: '⚠️ Error adding task', classes: 'rounded red' });
  }
}

async function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task && !task.completed) {
    task.completed = true;
    task.completedAt = new Date().toISOString();
    stats.tasksCompleted++;

    try {
      await saveSyncTask(task);
      await saveSyncStats(stats);
      updateTaskList();
      updateStatsDisplay();
      M.toast({ html: '✓ Task completed!', classes: 'rounded' });
    } catch (error) {
      console.error('Error completing task:', error);
      M.toast({ html: '⚠️ Error completing task', classes: 'rounded red' });
    }
  }
}

async function deleteTask(id) {
  try {
    await deleteSyncTask(id);
    tasks = tasks.filter(t => t.id !== id);
    updateTaskList();
    M.toast({ html: 'Task deleted', classes: 'rounded' });
  } catch (error) {
    console.error('Error deleting task:', error);
    M.toast({ html: '⚠️ Error deleting task', classes: 'rounded red' });
  }
}

function updateTaskList() {
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');

  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      const timeStr = task.completed
        ? `Completed at ${new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : `Added ${new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      li.innerHTML = `
                <div class="task-content">
                    <div class="task-name">${task.name}</div>
                    <div class="task-meta">
                        <span>${timeStr}</span>
                    </div>
                </div>
                <div class="task-actions">
                    ${!task.completed ? `
                        <button class="btn btn-small waves-effect waves-light btn-complete" onclick="window.completeTask('${task.id}')">
                            <i class="material-icons">check</i>
                        </button>
                    ` : ''}
                    <button class="btn btn-small waves-effect waves-light btn-delete" onclick="window.deleteTask('${task.id}')">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            `;

      taskList.appendChild(li);
    });
  }
}

// ==========================================
// Statistics Functions
// ==========================================

function updateStatsDisplay() {
  document.getElementById('sessions-today').textContent = stats.sessionsToday;
  document.getElementById('tasks-completed').textContent = stats.tasksCompleted;

  const hours = Math.floor(stats.totalFocusTime / 3600);
  const mins = Math.floor((stats.totalFocusTime % 3600) / 60);
  document.getElementById('focus-time').textContent = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// ==========================================
// Export functions to global scope for onclick handlers
// ==========================================

window.completeTask = completeTask;
window.deleteTask = deleteTask;

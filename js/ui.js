// ==========================================
// LoFi Focus Timer - Application Logic
// ==========================================

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
let taskIdCounter = 0;

// ==========================================
// Initialization
// ==========================================

window.addEventListener('load', () => {
    loadStats();
    loadTasks();
    updateStatsDisplay();
    updateTaskList();
    updateCircleProgress();
    initializeEventListeners();
});

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

function completeSession() {
    pauseTimer();
    
    if (!isBreak) {
        stats.sessionsToday++;
        stats.totalFocusTime += FOCUS_TIME;
        saveStats();
        updateStatsDisplay();
        M.toast({html: '🎉 Focus session complete! Time for a break.', classes: 'rounded'});
        startBreak();
    } else {
        M.toast({html: '✨ Break time over! Ready for another session?', classes: 'rounded'});
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

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskName = taskInput.value.trim();
    
    if (taskName === '') {
        M.toast({html: 'Please enter a task name', classes: 'rounded'});
        return;
    }
    
    const task = {
        id: taskIdCounter++,
        name: taskName,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    tasks.push(task);
    saveTasks();
    updateTaskList();
    taskInput.value = '';
    M.toast({html: 'Task added!', classes: 'rounded'});
}

function completeTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
        task.completed = true;
        task.completedAt = new Date().toISOString();
        stats.tasksCompleted++;
        saveTasks();
        saveStats();
        updateTaskList();
        updateStatsDisplay();
        M.toast({html: '✓ Task completed!', classes: 'rounded'});
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    updateTaskList();
    M.toast({html: 'Task deleted', classes: 'rounded'});
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
                ? `Completed at ${new Date(task.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                : `Added ${new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            
            li.innerHTML = `
                <div class="task-content">
                    <div class="task-name">${task.name}</div>
                    <div class="task-meta">
                        <span>${timeStr}</span>
                    </div>
                </div>
                <div class="task-actions">
                    ${!task.completed ? `
                        <button class="btn btn-small waves-effect waves-light btn-complete" onclick="completeTask(${task.id})">
                            <i class="material-icons">check</i>
                        </button>
                    ` : ''}
                    <button class="btn btn-small waves-effect waves-light btn-delete" onclick="deleteTask(${task.id})">
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
// Storage Functions (In-Memory)
// ==========================================

let memoryStorage = {
    stats: null,
    tasks: null
};

function saveStats() {
    memoryStorage.stats = JSON.parse(JSON.stringify(stats));
}

function loadStats() {
    if (memoryStorage.stats) {
        stats = JSON.parse(JSON.stringify(memoryStorage.stats));
    }
}

function saveTasks() {
    memoryStorage.tasks = JSON.parse(JSON.stringify(tasks));
}

function loadTasks() {
    if (memoryStorage.tasks) {
        tasks = JSON.parse(JSON.stringify(memoryStorage.tasks));
        taskIdCounter = Math.max(...tasks.map(t => t.id), 0) + 1;
    }
}
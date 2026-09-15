// ================================
// STORAGE
// ================================

const STORAGE_KEY = "taskflow_tasks";


// ================================
// STATE
// ================================

let tasks = loadTasks();


// ================================
// DOM ELEMENTS
// ================================

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const pendingList = document.getElementById("pendingList");

const completedList = document.getElementById("completedList");

const pendingCount = document.getElementById("pendingCount");

const completedCount = document.getElementById("completedCount");

const pendingEmpty = document.getElementById("pendingEmpty");

const completedEmpty = document.getElementById("completedEmpty");


// ================================
// LOAD TASKS
// ================================

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
        console.error("Could not load tasks:", error);

        return [];
    }
}


// ================================
// SAVE TASKS
// ================================

function saveTasks() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}


// ================================
// FORMAT DATE
// ================================

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}


// ================================
// ADD TASK
// ================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const text = taskInput.value.trim();

    // Don't add empty task
    if (!text) {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now().toString(),

        text: text,

        completed: false,

        createdAt: new Date().toISOString(),

        completedAt: null
    };

    tasks.unshift(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    taskInput.focus();
});


// ================================
// RENDER TASKS
// ================================

function renderTasks() {

    // Clear old lists
    pendingList.innerHTML = "";

    completedList.innerHTML = "";


    // Separate tasks
    const pendingTasks = tasks.filter(
        task => !task.completed
    );

    const completedTasks = tasks.filter(
        task => task.completed
    );


    // Update counters
    pendingCount.textContent =
        `${pendingTasks.length} pending`;

    completedCount.textContent =
        `${completedTasks.length} completed`;


    // Empty states
    pendingEmpty.style.display =
        pendingTasks.length === 0
            ? "flex"
            : "none";

    completedEmpty.style.display =
        completedTasks.length === 0
            ? "flex"
            : "none";


    // Render pending tasks
    pendingTasks.forEach(task => {

        const taskElement = createTaskElement(task);

        pendingList.appendChild(taskElement);
    });


    // Render completed tasks
    completedTasks.forEach(task => {

        const taskElement = createTaskElement(task);

        completedList.appendChild(taskElement);
    });
}


// ================================
// CREATE TASK ELEMENT
// ================================

function createTaskElement(task) {

    const card = document.createElement("div");

    card.className = "task-card";

    if (task.completed) {
        card.classList.add("completed");
    }


    // Complete button
    const completeButton = document.createElement("button");

    completeButton.className = "complete-btn";

    completeButton.title = task.completed
        ? "Mark as pending"
        : "Mark complete";

    completeButton.textContent =
        task.completed ? "✓" : "";

    completeButton.addEventListener(
        "click",
        () => toggleComplete(task.id)
    );


    // Content
    const content = document.createElement("div");

    content.className = "task-content";


    // Task text
    const text = document.createElement("div");

    text.className = "task-text";

    text.textContent = task.text;


    // Timestamp
    const time = document.createElement("small");

    time.className = "task-time";

    if (task.completed && task.completedAt) {

        time.textContent =
            `Completed ${formatDate(task.completedAt)}`;

    } else {

        time.textContent =
            `Added ${formatDate(task.createdAt)}`;
    }


    content.appendChild(text);

    content.appendChild(time);


    // Actions
    const actions = document.createElement("div");

    actions.className = "task-actions";


    // Edit button
    const editButton = document.createElement("button");

    editButton.className = "action-btn edit-btn";

    editButton.textContent = "Edit";

    editButton.addEventListener(
        "click",
        () => editTask(task.id)
    );


    // Delete button
    const deleteButton = document.createElement("button");

    deleteButton.className = "action-btn delete-btn";

    deleteButton.textContent = "Delete";

    deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
    );


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    // Final card
    card.appendChild(completeButton);

    card.appendChild(content);

    card.appendChild(actions);


    return card;
}


// ================================
// COMPLETE / UNCOMPLETE TASK
// ================================

function toggleComplete(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) return;


    task.completed = !task.completed;


    if (task.completed) {

        task.completedAt =
            new Date().toISOString();

    } else {

        task.completedAt = null;
    }


    saveTasks();

    renderTasks();
}


// ================================
// EDIT TASK
// ================================

function editTask(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) return;


    const card = findTaskCard(taskId);

    if (!card) return;


    const content =
        card.querySelector(".task-content");

    const actions =
        card.querySelector(".task-actions");


    // Remove existing content
    content.innerHTML = "";


    // Create edit input
    const input = document.createElement("input");

    input.type = "text";

    input.className = "edit-input";

    input.value = task.text;

    input.maxLength = 200;


    // Save button
    const saveButton = document.createElement("button");

    saveButton.className =
        "action-btn save-btn";

    saveButton.textContent = "Save";


    // Cancel button
    const cancelButton = document.createElement("button");

    cancelButton.className =
        "action-btn delete-btn";

    cancelButton.textContent = "Cancel";


    // Replace actions
    actions.innerHTML = "";

    actions.appendChild(saveButton);

    actions.appendChild(cancelButton);


    // Add input
    content.appendChild(input);

    input.focus();

    input.select();


    // Save
    saveButton.addEventListener(
        "click",
        () => saveEditedTask(taskId, input.value)
    );


    // Cancel
    cancelButton.addEventListener(
        "click",
        () => renderTasks()
    );


    // Enter = Save
    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                saveEditedTask(
                    taskId,
                    input.value
                );
            }


            if (event.key === "Escape") {

                renderTasks();
            }
        }
    );
}


// ================================
// SAVE EDITED TASK
// ================================

function saveEditedTask(taskId, newText) {

    const text = newText.trim();

    if (!text) {
        alert("Task cannot be empty.");
        return;
    }


    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) return;


    task.text = text;

    saveTasks();

    renderTasks();
}


// ================================
// DELETE TASK
// ================================

function deleteTask(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) return;


    const confirmed = confirm(
        `Delete "${task.text}"?`
    );


    if (!confirmed) return;


    tasks = tasks.filter(
        task => task.id !== taskId
    );


    saveTasks();

    renderTasks();
}


// ================================
// FIND TASK CARD
// ================================

function findTaskCard(taskId) {

    const allCards =
        document.querySelectorAll(".task-card");


    for (const card of allCards) {

        const text =
            card.querySelector(".task-text");

        if (!text) continue;


        const task =
            tasks.find(task => task.id === taskId);


        if (task && text.textContent === task.text) {

            return card;
        }
    }


    return null;
}


// ================================
// INITIAL RENDER
// ================================

renderTasks();

const taskList = document.getElementById('task-list');
/* Control Panel */
const taskNameInput = document.getElementById('task-input');
const taskDueDateInput = document.getElementById('task-date');
const taskPriorityInput = document.getElementById('task-priority');

const addTaskButton = document.getElementById('add-task-Btn');

const filterBtns = document.querySelectorAll('[data-filter]');
const sortSelect = document.getElementById('sort-select');

let tasks = getTasks();
let currentFilter = 'all';
// print the sorted board
sortTasks(sortSelect.value);

/* Events */
addTaskButton.addEventListener('click',() => {
  let finalDate = taskDueDateInput.value ? taskDueDateInput.value : "No due date";
  if (taskNameInput.value.trim() === "") {
    Swal.fire({
      icon: "question",
      title: "Please enter a task"
    });
    return;
  }
  addTask(taskNameInput.value.trim(), finalDate, taskPriorityInput.value)
});

filterBtns.forEach(btn => btn.addEventListener('click', (ev) => eventFilter(ev)));

sortSelect.addEventListener('change', (ev) => {
  sortTasks(ev.target.value);
});

/* Functions */
function addTask(taskName, taskDueDate, taskPriorityValue) {
  const task = {
    id: Date.now(),
    text: taskName,
    dueDate: taskDueDate,
    priority: taskPriorityValue,
    completed: false
  };
  tasks.push(task);
  sortTasks(sortSelect.value);
  taskNameInput.value = "";
  taskDueDateInput.value = "";
  taskPriorityInput.value = "medium";
}

// save tasks to local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// get tasks from local storage
function getTasks() {
  const tasksData = JSON.parse(localStorage.getItem('tasks')) || [];
  return tasksData;
}

function eventFilter(ev) {
  filterBtns.forEach(btn => {
    switch (true) {
      case (btn != ev.target && btn.classList.contains('active')):
        btn.classList.remove('active');
        break;
      case (btn === ev.target && !btn.classList.contains('active')):
        btn.classList.add('active');
        break;
      default:
        break;
    }
    console.log(btn.dataset.filter, ev.target.classList.contains('active'));
    
  });
  
  currentFilter = ev.target.dataset.filter;
  renderTasks(tasks, currentFilter);
};

function renderTasks() {
  //initzialize task list
  taskList.innerHTML = "";
  
  const filterdTasks = filterTasks(tasks, currentFilter);
  filterdTasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.classList.add("task-item", `priority-${task.priority}`);
    
    //for the main
    const taskMain = document.createElement('div');
    taskMain.classList.add("task-content-top");
    
    const priorityTag = document.createElement('span')
    priorityTag.classList.add('badge-text', task.priority)
    const taskTitle = document.createElement('h3');
    taskTitle.classList.add('task-title') 

    // main content
    priorityTag.textContent = `${task.priority} Priority Task`;
    taskTitle.textContent = task.text;

    // for the bottom
    const taskFooter = document.createElement('div');
    taskFooter.classList.add("task-content-bottom");
    
    const dueDate = document.createElement('span');
    dueDate.classList.add('task-duedate');
    dueDate.textContent = `Due: ${task.dueDate}`;
    
    // buttons for task
    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    const doneButton = document.createElement('button');
    doneButton.classList.add('done-btn');
    doneButton.textContent = task.completed ? "Undo" : "Done";
    doneButton.dataset.id = task.id; // Store task ID 
    doneButton.addEventListener('click', () => {
      console.log(task.id);
      const taskToUpdate = tasks.find(t => t.id === task.id);
      if (taskToUpdate) {
        taskToUpdate.completed = !taskToUpdate.completed; // Toggle completion status
        saveTasks();
        renderTasks();  
      }
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = "Delete";
    deleteButton.dataset.id = task.id; // Store task ID 
    deleteButton.addEventListener('click', () => {
      console.log(task.id);
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();  
    });

    
    taskActions.append(doneButton, deleteButton);
    taskFooter.append(dueDate, taskActions);

    //add to task item
    taskMain.append(priorityTag, taskTitle)
    taskItem.appendChild(taskMain);
    taskItem.appendChild(taskFooter);
    // add to DOM
    taskList.appendChild(taskItem);

    if (task.completed) taskItem.classList.add('completed');
  })
}

function filterTasks(tasks, filter){
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed)
    case 'completed':
      return tasks.filter(task => task.completed)
    default:
      return tasks;
  }
}

async function fetchInitialTasks() {
  const source = "https://jsonplaceholder.typicode.com/todos?_limit=5";
  try{
    const response = await fetch(source);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    data.forEach((obj, index) => { 
      obj.text = obj.title;
      delete obj.title;

      obj.id = Date.now() + index;
      obj.dueDate = 'no due date'
      obj.priority = 'low';
    });
    
    tasks.push(...data);
    sortTasks(sortSelect.value);
  }catch(error) {
    console.error("Error fetching initial tasks:", error);
    Swal.fire({
      icon: "error",
      title: "Oops..",
      text: "Failed to load initial tasks from the server. Please try refreshing the page."
    });
  }
}

function sortTasks(sortBy) {
  switch (sortBy) {
    case "creationDate":
      tasks.sort((a, b) => a.id - b.id);
      break;
    case "priority":
      const priorityWeight = {high: 3, medium: 2, low: 1};
      tasks.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
      break;
    default:
      tasks.sort((a, b) => {
        const dateA = a.dueDate.toLowerCase();
        const dateB = b.dueDate.toLowerCase();

        if(dateA === "no due date")return 1;
        if(dateB === "no due date")return -1;   
        return new Date(dateA) - new Date(dateB);
      });
      break;
  }
  saveTasks();
  renderTasks();
}

// only fetch tasks when emptey
if (tasks.length <= 0) {
  fetchInitialTasks()
}

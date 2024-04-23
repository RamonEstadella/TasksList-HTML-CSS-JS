// Necesitamos obtener y acceder a los elementos HTML que usaremos:
// La Lista (ul), el texto del input, i el botón.

const tasksList = document.querySelector('#tasks-list');
const newTaskInput = document.querySelector('#new-task-input');
const addTaskButton = document.querySelector('#add-task-button');


// Guardamos las tareas que vamos entrando en un Array.
const tasks = [];

// Crearemos un objeto global para tener las referencias de las tareas. 
// TODO No entenc la funció d'aquest objecte:
const app = {
    tasks: tasks,
    tasksList: tasksList,
    newTaskInput: newTaskInput,
};

window.onload = function() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    app.tasks = savedTasks.map((task) => {
        return createTask(task.title, task.isCompleted);
    });
    app.tasks.forEach( (task) => {
        return addTaskToList(task, app.tasksList);
    });
}

// Función para Guardar en Local Storage del Navegador las Tareas
function saveTasksToLocalStorage(tasks) {
    localStorage.Storage.setItem('tasks', JSON.stringify(tasks)) // Lo transformamos a string para guardarlo
}

// Función para añadir/crear Tareas => nos crea el OBJETO de la Tarea
function createTask(title, isCompleted = false) {
    return {
        id: Date.now(),
        title,
        isCompleted,
    };
}

// Función para añadir la Tarea a la Lista => añade el elemento HTML que representa la tarea a la Lista
function addTaskToList(task, taskList) {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
}

// Función que se llamará cuando pulsemos el botón de añadir Tarea => crea la tarea y lo añade al Array y llama a la otra función para insertarlo en el HTML
function addTask(app) {
    const newTaskTitle = app.newTaskInput.value;
    const newTask = createTask(newTaskTitle);
    app.tasks.push(newTask);

    addTaskToList(newTask, app.tasksList);
    saveTasksToLocalStorage(app.tasks);
    app.newTaskInput.value = '';
}

// Función para representar la tarea en HTML
function createTaskElement(task) {
    const taskElement = document.createElement('li');
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = task.isCompleted;
    taskCheckbox.addEventListener('change', () => {
        task.isCompleted = taskCheckbox.checked;
        taskText.classList.toggle('completed', task.isCompleted);
        saveTasksToLocalStorage(app.tasks);
    });

    const taskText = document.createElement('span');
    taskText.textContent = task.title;
    taskText.classList.toggle('completed', task.isCompleted);

    const taskDeleteButton = document.createElement('button');
    taskDeleteButton.textContent = 'Eliminar';
    taskDeleteButton.className = 'delete-button';
    taskDeleteButton.addEventListener('click', () => {
        // Eliminar la tarea de la lista
        taskElement.remove();

        const taskIndex = app.tasks.indexOf(task);
        if (taskIndex > -1) {
            app.tasks.splice(taskIndex, 1);
        }
        saveTasksToLocalStorage(app.tasks);
    });

    taskElement.appendChild(taskCheckbox);
    taskElement.appendChild(taskText);
    taskElement.appendChild(taskDeleteButton);

    return taskElement;
}

// Añadir la tarea al pulsar el Botón
addTaskButton.addEventListener('click', () => {
    addTask(app);
});

// Añadir la tarea al pulsar en el teclado "Enter" en vez del botón
newTaskInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        addTask(app);
    }
});



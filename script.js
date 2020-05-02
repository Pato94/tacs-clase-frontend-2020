const listsContainer = document.querySelector("[data-lists]")
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listContainer = document.querySelector("[data-list-container]");
const listTitle = document.querySelector("[data-list-title]");
const listCount = document.querySelector("[data-list-count]");
const listTasks = document.querySelector("[data-list-tasks]");
const taskTemplate = document.getElementById("task-template");
const clearCompletedTasks = document.querySelector("[data-clear-completed-tasks]");

const LOCAL_STORAGE_LIST_KEY = "todo_lists";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "todo_selected_list";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);

clearCompletedTasks.addEventListener("click", e => {
    const selectedList = lists.find(({id}) => id === selectedListId)
    if (selectedList == null) {
        return
    }
    selectedList.tasks = selectedList.tasks.filter(({completed}) => !completed)
    saveAndRender();
})

deleteListButton.addEventListener("click", e => {
    lists = lists.filter(({id}) => selectedListId !== id)
    if (lists.length > 0) {
        selectedListId = lists[0].id;
    } else {
        selectedListId = null;
    }
    saveAndRender();
})

newListForm.addEventListener("submit", e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (!listName) {
        return
    }
    newListInput.value = "";
    const list = createList(listName);
    lists.push(list);
    saveAndRender();
})

newTaskForm.addEventListener("submit", e => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (!taskName) {
        return
    }
    const selectedList = lists.find(({id}) => id === selectedListId)
    if (!selectedList) {
        return
    }
    newTaskInput.value = "";
    const task = createTask(taskName);
    selectedList.tasks.push(task);
    saveAndRender();
})

function createList(name) {
    return {
        id: Date.now().toString(),
        name,
        tasks: []
    }
}

function createTask(name) {
    return {
        id: Date.now().toString(),
        name,
        completed: false
    }
}

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, selectedListId);
}

function select(id) {
    selectedListId = id;
    saveAndRender();
}

function render() {
    clearElement(listsContainer);

    renderLists();

    const selectedList = lists.find(({id}) => id === selectedListId);

    if (selectedList == null) {
        listContainer.style.display = "none";
    } else {
        listContainer.style.display = "";
        listTitle.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(listTasks);
        renderTasks(selectedList);
    }
}

function renderTaskCount(list) {
    const incompleteTasks = list.tasks.filter(({ completed }) => !completed).length;
    const taskWord = incompleteTasks === 1 ? "task" : "tasks";
    listCount.innerText = `${incompleteTasks} ${taskWord} remaining`;
}

function renderTasks(list) {
    list.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector("input");
        checkbox.id = task.id;
        checkbox.checked = task.completed;
        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        label.append(task.name);
        checkbox.addEventListener("click", e => {
            task.completed = !task.completed;
            saveAndRender();
        })
        listTasks.appendChild(taskElement);
    })
}

function renderLists() {
    lists.forEach(list => {
        const li = document.createElement('li');
        li.dataset.listId = list.id;
        if (list.id === selectedListId) {
            li.classList.add('active-list');
        }
        li.classList.add('list-name');
        li.innerText = list.name;
        li.addEventListener("click", e => {
            select(list.id);
        })
        listsContainer.appendChild(li);
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();
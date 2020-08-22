const TodoHeader = ({ list }) => {
    const count = list.tasks.filter(({ completed }) => !completed).length
    const taskWord = count === 1 ? "task" : "tasks"
    const countString = `${count} ${taskWord} remaining`

    return (
        <div className="todo-header">
            <h2 className="list-title">{list.name}</h2>
            <p className="task-count">{countString}</p>
        </div>
    )
}

const NewTaskForm = ({ addTask }) => {
    const [name, setName] = React.useState("");
    const onSubmit = (e) => {
        e.preventDefault()
        if (!name) return
        const newTask = {
            id: Date.now().toString(),
            name,
            completed: false
        }
        setName("")
        addTask(newTask)
    }
    return (
        <div className="new-task-creator">
            <form
                onSubmit={onSubmit}>
                <input
                    type="text"
                    className="new task"
                    placeholder="new task name"
                    aria-label="new task name"
                    onChange={e => setName(e.target.value)}
                    value={name} />
                <button
                    className="btn create"
                    aria-label="create new task">
                    +
                </button>
            </form>
        </div>
    );
}

const Task = ({ task, toggleTask }) => {
    return (
        <div className="task">
            <input type="checkbox" id={task.id} checked={task.completed}
                onChange={() => toggleTask(task)} />
            <label onClick={() => toggleTask(task)}>
                <span className="custom-checkbox"></span>
                {task.name}
            </label>
        </div>
    )
}

const Tasks = ({ list, addTask, toggleTask, clearCompletedTasks, deleteList }) => {
    if (!list) return null

    const tasks = list.tasks.map(task =>
        <Task
            key={task.id}
            task={task}
            toggleTask={toggleTask} />
    )

    return (
        <div className="todo-list">
            <TodoHeader list={list} />
            <div className="todo-body">
                <div className="tasks-container">
                    <div className="tasks">
                        {tasks}
                    </div>
                    <NewTaskForm addTask={addTask} />
                </div>
                <div className="delete-stuff">
                    <button
                        className="btn delete"
                        onClick={clearCompletedTasks}>
                        Clear completed tasks
                    </button>
                    <button
                        className="btn delete"
                        onClick={deleteList}>
                        Delete list
                    </button>
                </div>
            </div>
        </div>
    )
}
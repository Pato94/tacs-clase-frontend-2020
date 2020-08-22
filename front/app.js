const domContainer = document.querySelector('#app');

const LOCAL_STORAGE_LIST_KEY = "todo_lists";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "todo_selected_list";

const lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
const selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);

const replaceInList = (list, item) => list.map(i => i.id === item.id ? item : i)

const socket = io();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { lists, selectedListId }
    }

    componentDidMount() {
        socket.on('list_updated', list => {
            this.updateList(list, false)
        })
        socket.on('list_created', list => {
            this.addList(list, false)
        })
        socket.on('list_deleted', event => {
            this.deleteList(event.id, false)
        })
    }

    updateLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(this.state.lists))
        localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, this.state.selectedListId)
    }

    selectedList() {
        return this.state.lists.find(({ id }) => id === this.state.selectedListId)
    }

    addTask(task) {
        const list = this.selectedList()
        const newList = { ...list, tasks: [...list.tasks, task] }
        this.updateList(newList, true)
    }

    toggleTask(task) {
        const list = this.selectedList()
        const newTasks = replaceInList(list.tasks, { ...task, completed: !task.completed })
        const newList = { ...list, tasks: newTasks }
        this.updateList(newList, true)
    }

    selectList(id) {
        this.setState({ selectedListId: id })
        this.updateLocalStorage()
    }

    clearCompletedTasks() {
        const list = this.selectedList();
        const newList = { ...list, tasks: list.tasks.filter(({ completed }) => !completed) };
        this.updateList(newList, true)
    }

    addList(list, emit) {
        if (emit) {
            socket.emit('list_created', list)
        }
        const newLists = [...this.state.lists, list]
        this.updateLists(newLists)
    }

    updateList(newList, emit) {
        if (emit) {
            socket.emit('list_updated', newList)
        }
        const newLists = replaceInList(this.state.lists, newList);
        this.updateLists(newLists)
    }

    deleteList(removedId, emit) {
        if (emit) {
            socket.emit('list_deleted', {id: removedId})
        }
        const newLists = this.state.lists.filter(({ id }) => id !== removedId)
        this.updateLists(newLists)
    }

    updateLists(newLists) {
        this.setState({ lists: newLists });
        this.updateLocalStorage();
    }

    render() {
        return (
            <React.Fragment>
                <h1
                    className="title">
                    Stuff I need to do
                </h1>
                <Lists
                    lists={this.state.lists}
                    addList={list => this.addList(list, true)}
                    selectedId={this.state.selectedListId}
                    selectList={id => this.selectList(id)} />
                <Tasks
                    list={this.selectedList()}
                    addTask={(task) => this.addTask(task)}
                    toggleTask={(task) => this.toggleTask(task)}
                    clearCompletedTasks={() => this.clearCompletedTasks()}
                    deleteList={() => this.deleteList(this.state.selectedListId, true)} />
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App />, domContainer);

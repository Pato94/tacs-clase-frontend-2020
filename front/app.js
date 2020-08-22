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
        console.log('mounted')
        socket.on('list_updated', list => {
            console.log(list)
            const lists = replaceInList(this.state.lists, list)
            this.setState({ lists })
            this.updateLocalStorage()
        })
        socket.on('list_created', list => {
            console.log(list)
            this.setState({ lists: [...this.state.lists, list] })
            this.updateLocalStorage()
        })
        socket.on('list_deleted', event => {
            const removedId = event.id
            this.setState({ lists: this.state.lists.filter(({ id }) => id !== removedId) });
            this.updateLocalStorage();
        })
    }

    updateLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(this.state.lists))
        localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, this.state.selectedListId)
    }

    selectedList() {
        return this.state.lists.find(({ id }) => id === this.state.selectedListId)
    }

    addList(list) {
        socket.emit('list_created', list)
        this.setState({ lists: [...this.state.lists, list] })
        this.updateLocalStorage()
    }

    addTask(task) {
        const list = this.selectedList()
        const newList = { ...list, tasks: [...list.tasks, task] }
        socket.emit('list_updated', newList)
        const lists = replaceInList(this.state.lists, newList)
        this.setState({ lists })
        this.updateLocalStorage()
    }

    toggleTask(task) {
        const list = this.selectedList()
        const newTasks = replaceInList(list.tasks, { ...task, completed: !task.completed })
        const newList = { ...list, tasks: newTasks }
        socket.emit('list_updated', newList)
        const newLists = replaceInList(this.state.lists, newList)
        this.setState({ lists: newLists })
        this.updateLocalStorage()
    }

    selectList(id) {
        this.setState({ selectedListId: id })
        this.updateLocalStorage()
    }

    clearCompletedTasks() {
        const list = this.selectedList();
        const newList = { ...list, tasks: list.tasks.filter(({ completed }) => !completed) };
        socket.emit('list_updated', newList)
        const newLists = replaceInList(this.state.lists, newList);
        this.setState({ lists: newLists });
        this.updateLocalStorage();
    }

    deleteList() {
        socket.emit('list_deleted', { id: this.state.selectedListId })
        this.setState({ lists: this.state.lists.filter(({ id }) => id !== this.state.selectedListId) });
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
                    addList={list => this.addList(list)}
                    selectedId={this.state.selectedListId}
                    selectList={id => this.selectList(id)} />
                <Tasks
                    list={this.selectedList()}
                    addTask={(task) => this.addTask(task)}
                    toggleTask={(task) => this.toggleTask(task)}
                    clearCompletedTasks={() => this.clearCompletedTasks()}
                    deleteList={() => this.deleteList()} />
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App />, domContainer);

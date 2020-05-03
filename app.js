const domContainer = document.querySelector('#app');

const LOCAL_STORAGE_LIST_KEY = "todo_lists";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "todo_selected_list";

const lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
const selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);

const replaceInList = (list, item) => list.map(i => i.id === item.id ? item : i)

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { lists, selectedListId }
    }

    updateLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(this.state.lists))
        localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, this.state.selectedListId)
    }

    selectedList() {
        return this.state.lists.find(({ id }) => id === this.state.selectedListId)
    }

    addList(list) {
        this.setState({ lists: [...this.state.lists, list] })
        this.updateLocalStorage()
    }

    addTask(task) {
        const list = this.selectedList()
        const lists = replaceInList(this.state.lists, { ...list, tasks: [...list.tasks, task] })
        this.setState({ lists })
        this.updateLocalStorage()
    }

    toggleTask(task) {
        const list = this.selectedList()
        const newTasks = replaceInList(list.tasks, { ...task, completed: !task.completed })
        const newLists = replaceInList(this.state.lists, { ...list, tasks: newTasks })
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
        const newLists = replaceInList(this.state.lists, newList);
        this.setState({ lists: newLists });
        this.updateLocalStorage();
    }

    deleteList() {
        this.setState({ lists: this.state.lists.filter(({ id }) => id !== selectedListId) });
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
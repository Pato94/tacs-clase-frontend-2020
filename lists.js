const NewListForm = ({ addList }) => {
    const [name, setName] = React.useState("");

    const onSubmit = e => {
        e.preventDefault();
        if (!name) return
        const newList = {
            id: Date.now().toString(),
            name,
            tasks: []
        }
        setName("");
        addList(newList);
    }

    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                className="new list"
                placeholder="new list name"
                aria-label="new list name"
                onChange={e => setName(e.target.value)}
                value={name} />
            <button
                className="btn create"
                aria-label="create new list">
                +
            </button>
        </form>
    );
}

const List = ({ list, selectedId, onClick }) => {
    const maybeActiveClass = list.id === selectedId ? "active-list" : ""
    return (
        <li
            key={list.id}
            className={`list-name ${maybeActiveClass}`}
            onClick={onClick}>
            {list.name}
        </li>
    )
}

const Lists = ({ lists, addList, selectedId, selectList }) => {
    return (
        <div className="all-tasks">
            <h2 className="task-list-title">
                My lists
            </h2>
            <ul className="task-list">
                {
                    lists.map(list => (
                        <List
                            key={list.id}
                            list={list}
                            selectedId={selectedId}
                            onClick={() => selectList(list.id)} />
                    ))
                }
            </ul>
            <NewListForm addList={addList} />
        </div>
    )
}

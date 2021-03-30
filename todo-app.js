/** @jsx MiniReact.createElement */

const root = document.getElementById("root");

//////******* TODO APP ***********/
let Header = props => {
  return (
    <div>
      <h1 style="color:brown">{props.text}</h1>
      <h6>(double click on todo to mark as completed)</h6>
    </div>
  );
};


class TodoItem extends MiniReact.Component {
  constructor(props) {
    super(props);
    this.logging = true;
  }

  log(...args) {
    if (this.logging) {
      for (let i = 0; i < args.length; i++) {
        console.log(args[i]);
      }
    }
  }
  componentDidMount() {
    this.log("2. TodoItem:cdm");
  }
  componentWillMount() {
    this.log("1. TodoItem:cwm");
  }

  // VERY IMPORTANT
  shouldComponentUpdate(nextProps, nextState) {
    let result = nextProps.task != this.props.task;
    return result;
  }

  componentWillReceiveProps(nextProps) {
    this.log("TodoItem:cwrp: ", JSON.stringify(nextProps));
  }
  componentWillUnmount() {
    this.log("TodoItem:cwu: " + this.props.task.title);
  }

  handleEdit = task => {
    this.props.onUpdateTask(task.id, this.textInput.value);
  };

  editView = props => {
    if (props.task.edit) {
      return (
        <span style="display:flex">
          <input
            type="text"
            className="editItemInput"
            value={props.task.title}
            ref={input => (this.textInput = input)}
          />
          <button
            style="width:30px"
            type="button"
            onClick={() => this.handleEdit(this.props.task)}
          >
            <i className="fas fa-save" />
          </button>
        </span>
      );
    }
    return props.task.title;
  };

  render() {
    let className = "todo-item ";
    if (this.props.task.completed) {
      className += "strike";
    }

    let todoItemStyle = {
      borderBottom: "1px dashed gray",
      color: "red"
    };

    return (
      <li
        style={todoItemStyle}
        key={this.props.key}
        className={className}
        onDblClick={() => this.props.onToggleComplete(this.props.task)}
      >
        {this.editView(this.props)}
        <div className="todo-actions">
          <button
            type="button"
            onClick={() => this.props.onToggleEdit(this.props.task)}
          >
            <i className="fas fa-edit" />
          </button>
          <button
            type="button"
            className="btnDelete"
            onClick={() => this.props.onDelete(this.props.task)}
          >
            <i className="fas fa-trash" />
          </button>
        </div>
      </li>
    );
  }
}

class TodoApp extends MiniReact.Component {
  constructor(props) {
    super(props);
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.onToggleEdit = this.onToggleEdit.bind(this);
    this.onUpdateTask = this.onUpdateTask.bind(this);
    this.onToggleComplete = this.onToggleComplete.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      tasks: [{ id: 1, title: "Task 1", edit: false }],
      sortOrder: "asc"
    };
  }

  onKeyDown(e) {
    if (e.which === 13) {
      this.addTodo();
    }
  }
  deleteTodo(task) {
    var tasks = this.state.tasks.filter(t => {
      return t.id != task.id;
    });

    this.setState({
      header: "# Todos: " + tasks.length,
      tasks
    });
  }

  addTodo() {
    if (this.newTodo.value.trim() == "") {
      alert("You don't wanna do anything !");
      return;
    }
    let newTodo = {
      id: +new Date(),
      title: this.newTodo.value,
      edit: false
    };
    this.setState({
      tasks: [...this.state.tasks, newTodo]
    });

    this.newTodo.value = "";
    this.newTodo.focus();
  }

  sortToDo = () => {
    let tasks = null;
    let sortOrder = this.state.sortOrder;
    if (!sortOrder) {
      tasks = this.state.tasks.sort(
        (a, b) => +(a.title > b.title) || -(a.title < b.title)
      );
      sortOrder = "asc";
    } else if (sortOrder === "asc") {
      sortOrder = "desc";
      tasks = this.state.tasks.sort(
        (a, b) => +(b.title > a.title) || -(b.title < a.title)
      );
    } else {
      sortOrder = "asc";
      tasks = this.state.tasks.sort(
        (a, b) => +(a.title > b.title) || -(a.title < b.title)
      );
    }
    this.setState({
      tasks,
      sortOrder
    });
  };

  onUpdateTask(taskId, newTitle) {
    var tasks = this.state.tasks.map(t => {
      return t.id !== taskId ?
        t :
        Object.assign({}, t, { title: newTitle, edit: !t.edit });
    });

    this.setState({
      tasks
    });
  }

  // Uses setstate with fn argument
  onToggleEdit(task) {
    let tasks = this.state.tasks.map(t => {
      return t.id !== task.id ?
        t :
        Object.assign({}, t, { edit: !t.edit });
    });

    // DONT MUTATE STATE DIRECTLY
    // let tasks = this.state.tasks.map(t => {
    //   if (t.id === task.id) {
    //     t.edit = !t.edit;
    //   }
    //   return t;
    // });

    this.setState({
      tasks
    });
  }

  onToggleComplete(task) {
    let tasks = this.state.tasks.map(t => {
      return t.id !== task.id ?
        t :
        Object.assign({}, t, { completed: !t.completed });
    });

    this.setState({
      tasks
    });
  }

  render() {
    let tasksUI = this.state.tasks.map((task, index) => {
      return (
        <TodoItem
          key={task.id}
          task={task}
          index={index}
          onDelete={this.deleteTodo}
          onToggleEdit={this.onToggleEdit}
          onToggleComplete={this.onToggleComplete}
          onUpdateTask={this.onUpdateTask}
        />
      );
    });

    let sortIcon = <i className="fas fa-sort-alpha-down" />;
    if (this.state.sortOrder === "asc") {
      sortIcon = <i className="fas fa-sort-alpha-up" />;
    } else {
      sortIcon = <i className="fas fa-sort-alpha-down" />;
    }

    return (
      <div className="container">
        <Header text="Todo App (MiniReact)" />

        <div className="todo-input-container">
          <input
            type="text"
            className="addItemInput"
            onKeyDown={this.onKeyDown}
            ref={newTodo => (this.newTodo = newTodo)}
            placeholder="what do you want to do today?"
          />
          <button
            type="button"
            className="addItemButton"
            onClick={this.addTodo}
            value="Add Todo"
          >
            Add Todo
          </button>
          <button type="button" onClick={this.sortToDo} value="Sort">
            {sortIcon}
          </button>
        </div>
        <ul className="todos">{tasksUI}</ul>
      </div>
    );
  }
}

MiniReact.render(<TodoApp />, root);
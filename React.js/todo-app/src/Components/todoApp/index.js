import React, { Component } from 'react';
import TodoItem from '../todoItem';
import './index.css'

class TodoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      todos: JSON.parse(localStorage.getItem('todos')) || []
    };
  }

  componentDidUpdate(_, prevState) {
    if (prevState.todos !== this.state.todos) {
      localStorage.setItem('todos', JSON.stringify(this.state.todos));
    }
  }

  handleInputChange = (e) => {
    this.setState({ input: e.target.value })
  };

  handleAddTodo = () => {
    const { input, todos } = this.state;
    if (input.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false
    };

    this.setState({
      todos: [newTodo, ...todos],
      input: ''
    });
  };

  handleDeleteTodo = (id) => {
    const updatedTodos = this.state.todos.filter(todo => todo.id !== id);
    this.setState({ todos: updatedTodos });
  };

  handleToggleComplete = (id) => {
    const updatedTodos = this.state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.setState({ todos: updatedTodos })
  };

  render() {
    const { input, todos } = this.state

    return (
      <div className="mt-2 p-1">
        <div className="flex gap-3 mb-5">
          <input
            className='p-1 text-md rounded-md shadow-lg border-2 w-3/4'
            type="text"
            value={input}
            onChange={this.handleInputChange}
            placeholder="Add a new task..."
          />
          <button className="bg-green-500 px-4 py-2 text-white rounded-md hover:bg-green-900" onClick={this.handleAddTodo}>Add</button>
        </div>

        <ul className="todo-list">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={this.handleDeleteTodo}
              onToggle={this.handleToggleComplete}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default TodoApp

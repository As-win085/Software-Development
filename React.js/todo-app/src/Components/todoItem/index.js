import { Component } from "react";
import "./index.css";

class TodoItem extends Component {
  render() {
    const { todo, onDelete, onToggle } = this.props;

    return (
      <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
        <label className="mr-5">
          <input
            className="mr-2"
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span className="checkmark"></span>
          <span className="todo-text">{todo.text}</span>
        </label>
        <button onClick={() => onDelete(todo.id)}>❌</button>
      </li>
    );
  }
}

export default TodoItem

import { useContext } from "react";
import { Link } from "react-router-dom";
import { TodoContext } from "../App";
import "../styles/TodoList.css";

export function TodoList() {
  const { todos, setTodos } = useContext(TodoContext)!;

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-list-container">
      <div className="header">
        <h1>My Todos</h1>
        <Link to="/create" className="btn btn-primary">
          + Add New Todo
        </Link>
      </div>

      {todos.length === 0 ? (
        <div className="empty-state">
          <p>No todos yet. Create one to get started!</p>
          <Link to="/create" className="btn btn-primary">
            Create First Todo
          </Link>
        </div>
      ) : (
        <div className="todos-grid">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-card ${todo.completed ? "completed" : ""}`}
            >
              <div className="todo-content">
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
                <small className="date">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </small>
              </div>
              <div className="todo-actions">
                <button
                  className={`btn btn-toggle ${todo.completed ? "completed" : ""}`}
                  onClick={() => toggleComplete(todo.id)}
                >
                  {todo.completed ? "✓ Done" : "Mark Done"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

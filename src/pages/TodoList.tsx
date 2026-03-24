import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { TodoContext } from "../App";
import { deleteTask, updateTask } from "../api";
import "../styles/TodoList.css";

export function TodoList() {
  const { todos, setTodos } = useContext(TodoContext)!;
  const [updatingTodoIds, setUpdatingTodoIds] = useState<Set<string>>(
    new Set(),
  );
  const [deletingTodoIds, setDeletingTodoIds] = useState<Set<string>>(
    new Set(),
  );

  const toggleComplete = async (id: string) => {
    if (updatingTodoIds.has(id)) {
      return;
    }

    const existingTodo = todos.find((todo) => todo.id === id);
    if (!existingTodo) {
      return;
    }

    setUpdatingTodoIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(id);
      return nextIds;
    });

    try {
      const updatedTodo = await updateTask(id, {
        completed: !existingTodo.completed,
      });

      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );
    } catch {
      console.error("Failed to update task");
    } finally {
      setUpdatingTodoIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(id);
        return nextIds;
      });
    }
  };

  const deleteTodo = async (id: string) => {
    if (deletingTodoIds.has(id)) {
      return;
    }

    setDeletingTodoIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(id);
      return nextIds;
    });

    try {
      await deleteTask(id);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    } catch {
      console.error("Failed to delete task");
    } finally {
      setDeletingTodoIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(id);
        return nextIds;
      });
    }
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
                  disabled={updatingTodoIds.has(todo.id)}
                  onClick={() => toggleComplete(todo.id)}
                >
                  {updatingTodoIds.has(todo.id)
                    ? "Updating..."
                    : todo.completed
                      ? "✓ Done"
                      : "Mark Done"}
                </button>
                <button
                  className="btn btn-danger"
                  disabled={deletingTodoIds.has(todo.id)}
                  onClick={() => deleteTodo(todo.id)}
                >
                  {deletingTodoIds.has(todo.id) ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

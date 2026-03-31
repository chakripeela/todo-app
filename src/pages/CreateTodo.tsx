import { useContext, useState, useContext as useContextReact } from "react";
import { useNavigate } from "react-router-dom";
import { TodoContext } from "../App";
import { createTask } from "../api";
import { LoaderContext } from "../App";
import "../styles/CreateTodo.css";

export function CreateTodo() {
  const navigate = useNavigate();
  const { todos, setTodos } = useContext(TodoContext)!;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const { showLoader, hideLoader } = useContextReact(LoaderContext)!;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    showLoader();
    try {
      const newTodo = await createTask({
        title: title.trim(),
        description: description.trim(),
      });
      setTodos([newTodo, ...todos]);
      navigate("/");
    } catch {
      setError("Failed to create todo. Please try again.");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="create-todo-container">
      <div className="form-wrapper">
        <h1>Create New Todo</h1>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Todo Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about your todo (optional)"
              rows={5}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create Todo
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TodoList } from "./pages/TodoList";
import { CreateTodo } from "./pages/CreateTodo";
import { Todo } from "./types";
import { fetchTasks } from "./api";
import "./styles/App.css";

export const TodoContext = createContext<{
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
} | null>(null);

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const tasks = await fetchTasks();
        setTodos(tasks);
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };

    void loadTodos();
  }, []);

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<TodoList />} />
            <Route path="/create" element={<CreateTodo />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TodoContext.Provider>
  );
}

export default App;

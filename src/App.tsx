import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TodoList } from "./pages/TodoList";
import { CreateTodo } from "./pages/CreateTodo";
import { Todo } from "./types";
import "./styles/App.css";

export const TodoContext = createContext<{
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
} | null>(null);

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Welcome to Todo App",
      description:
        "This is your first todo. You can mark it as done or delete it!",
      completed: false,
      createdAt: new Date(),
    },
  ]);

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

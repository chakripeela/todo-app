import {
  createContext,
  JSX,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { TodoList } from "./pages/TodoList";
import { CreateTodo } from "./pages/CreateTodo";
import { Login } from "./pages/Login";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Todo } from "./types";
import { fetchTasks } from "./api";
import "./styles/App.css";

export const TodoContext = createContext<{
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
} | null>(null);

function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const location = useLocation();
  if (inProgress !== "none") {
    return <div className="loading">Loading authentication...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const account = accounts && accounts.length > 0 ? accounts[0] : undefined;

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadTodos = async () => {
      try {
        const tasks = await fetchTasks();
        setTodos(tasks);
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };
    void loadTodos();
  }, [isAuthenticated]);

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      <BrowserRouter>
        <div className="app">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            {isAuthenticated && account && (
              <>
                <span style={{ marginRight: "1rem" }}>
                  {account.name || account.username}
                </span>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              }
            />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <TodoList />
                </RequireAuth>
              }
            />
            <Route
              path="/create"
              element={
                <RequireAuth>
                  <CreateTodo />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TodoContext.Provider>
  );
}

export default App;

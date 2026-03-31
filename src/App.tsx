import {
  createContext,
  JSX,
  useEffect,
  useState,
  useCallback,
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

export const LoaderContext = createContext<{
  showLoader: () => void;
  hideLoader: () => void;
} | null>(null);

function RequireAuth({ children }: { children: JSX.Element }): JSX.Element {
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
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const account = accounts && accounts.length > 0 ? accounts[0] : undefined;

  const showLoader = useCallback(() => setLoading(true), []);
  const hideLoader = useCallback(() => setLoading(false), []);

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadTodos = async () => {
      showLoader();
      try {
        const tasks = await fetchTasks();
        setTodos(tasks);
      } catch (error) {
        console.error("Failed to load tasks", error);
      } finally {
        hideLoader();
      }
    };
    void loadTodos();
  }, [isAuthenticated, showLoader, hideLoader]);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      <TodoContext.Provider value={{ todos, setTodos }}>
        <BrowserRouter>
          <div className="app">
            {loading && (
              <div className="loader-overlay">
                <div className="loader-spinner" />
              </div>
            )}
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
    </LoaderContext.Provider>
  );
}
export default App;

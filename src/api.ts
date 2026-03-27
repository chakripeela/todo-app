import { Todo } from "./types";

// In production, API calls go to the same origin (proxied by server.js).
// In development, use VITE_API_BASE_URL for local backend.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const TASKS_ENDPOINT = `${API_BASE_URL}/api/tasks`;
// Auth API

// The login function has been removed as it is only used for old login.

// The signup function has been removed as it is only used for old signup.

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function fetchTasks(): Promise<Todo[]> {
  return request<Todo[]>(TASKS_ENDPOINT);
}

export async function createTask(payload: {
  title: string;
  description: string;
}): Promise<Todo> {
  return request<Todo>(TASKS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await request<void>(`${TASKS_ENDPOINT}/${id}`, {
    method: "DELETE",
  });
}

export async function updateTask(
  id: string,
  payload: Partial<Pick<Todo, "title" | "description" | "completed">>,
): Promise<Todo> {
  return request<Todo>(`${TASKS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

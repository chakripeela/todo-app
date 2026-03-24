import { Todo } from "./types";

type RuntimeProcessEnv = {
  process?: {
    env?: {
      API_BASE_URL?: string;
    };
  };
};

const runtimeApiBaseUrl = (globalThis as RuntimeProcessEnv).process?.env
  ?.API_BASE_URL;
const API_BASE_URL =
  runtimeApiBaseUrl || import.meta.env.VITE_API_BASE_URL || "http://10.1.2.250";
const TASKS_ENDPOINT = `${API_BASE_URL}/api/tasks`;

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

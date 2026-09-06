import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${BASE}/api/v1`,
  withCredentials: true,
});

/*
 * Reachability is tracked here rather than in a component, because every call
 * in this file is evidence: a response — any response, including a 401 — means
 * the service answered. Only a request that never reaches it counts as down.
 * `null` means nothing has been tried yet.
 */
let reachable = null;
const watchers = new Set();

function record(next) {
  if (reachable === next) return;
  reachable = next;
  for (const watcher of watchers) watcher(next);
}

api.interceptors.response.use(
  (response) => {
    record(true);
    return response;
  },
  (error) => {
    record(Boolean(error.response));
    return Promise.reject(error);
  }
);

export function watchService(onChange) {
  watchers.add(onChange);
  return () => watchers.delete(onChange);
}

export function readService() {
  return reachable;
}

/* A cheap round trip used to re-test a service that was not answering. */
export async function pingService() {
  try {
    await api.get("/user/auth-status");
    return true;
  } catch (error) {
    return Boolean(error.response);
  }
}

/*
 * Errors are unwrapped once, here, so callers only ever deal with an Error
 * carrying a message worth showing. The previous version redirected the whole
 * window on any 401, which tore down React state mid-render; routing is the
 * router's job and lives in AuthContext now.
 */
function unwrap(error, fallback) {
  const message = error?.response?.data?.message;
  const validation = error?.response?.data?.errors?.[0]?.msg;
  const failure = new Error(validation || message || fallback);
  failure.status = error?.response?.status;
  throw failure;
}

export const loginUser = async (email, password) => {
  try {
    const { data } = await api.post("/user/login", { email, password });
    return data;
  } catch (error) {
    unwrap(error, "Could not sign in. Check the email and password.");
  }
};

export const signupUser = async (name, email, password) => {
  try {
    const { data } = await api.post("/user/signup", { name, email, password });
    return data;
  } catch (error) {
    unwrap(error, "Could not create the account.");
  }
};

export const checkAuthStatus = async () => {
  try {
    const { data } = await api.get("/user/auth-status");
    return data;
  } catch (error) {
    unwrap(error, "Session could not be verified.");
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await api.post("/user/logout");
    return data;
  } catch (error) {
    unwrap(error, "Could not sign out.");
  }
};

export const sendChatRequest = async (message) => {
  try {
    const { data } = await api.post("/chat/new", { message });
    return data;
  } catch (error) {
    unwrap(error, "The assistant did not respond. Try again.");
  }
};

export const getUserChats = async () => {
  try {
    const { data } = await api.get("/chat/all-chats");
    return data;
  } catch (error) {
    unwrap(error, "Could not load your conversation.");
  }
};

export const deleteUserChats = async () => {
  try {
    const { data } = await api.delete("/chat/delete");
    return data;
  } catch (error) {
    unwrap(error, "Could not clear your conversation.");
  }
};

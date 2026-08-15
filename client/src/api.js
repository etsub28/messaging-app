const API_URL = "https://messaging-app-production-8ef3.up.railway.app";

async function handleResponse(res) {
  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch (e) {
      // response wasn't JSON, keep default message
    }
    throw new Error(message);
  }
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function signup(username, email, password) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(res);
}

export async function getMe() {
  const res = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse(res);
}

export async function updateProfile(data) {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${API_URL}/users/me/avatar`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return handleResponse(res);
}

export async function getAllUsers() {
  const res = await fetch(`${API_URL}/users/all`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function getUserById(id) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function getConversationsList() {
  const res = await fetch(`${API_URL}/messages/conversations`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function getConversation(userId, cursor = null) {
  const url = cursor
    ? `${API_URL}/messages/${userId}?cursor=${cursor}`
    : `${API_URL}/messages/${userId}`;
  const res = await fetch(url, { credentials: "include" });
  return handleResponse(res);
}

export async function sendMessage(receiverId, content, imageFile = null) {
  const formData = new FormData();
  formData.append("receiverId", receiverId);
  if (content) formData.append("content", content);
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return handleResponse(res);
}
export async function sendFriendRequest(addresseeId) {
  const res = await fetch(`${API_URL}/friends/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ addresseeId }),
  });
  return handleResponse(res);
}

export async function respondToFriendRequest(requestId, action) {
  const res = await fetch(`${API_URL}/friends/request/${requestId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action }),
  });
  return handleResponse(res);
}

export async function getFriendsList() {
  const res = await fetch(`${API_URL}/friends`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function getPendingRequests() {
  const res = await fetch(`${API_URL}/friends/pending`, {
    credentials: "include",
  });
  return handleResponse(res);
}

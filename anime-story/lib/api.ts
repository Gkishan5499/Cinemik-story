const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const headers = (includeAuth = true) => {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

// AUTH
export const authAPI = {
  signup: (data: { email: string; password: string; username: string }) =>
    fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify(data),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  login: (data: { email: string; password: string }) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify(data),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  me: () =>
    fetch(`${API_URL}/auth/me`, {
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  updateMe: (data: { name?: string; email?: string }) =>
    fetch(`${API_URL}/auth/me`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  becomeCreator: () =>
    fetch(`${API_URL}/auth/me/become-creator`, {
      method: 'PATCH',
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  updateCreatorProfile: (data: { address?: string; city?: string; country?: string; bio?: string; interests?: string[] }) =>
    fetch(`${API_URL}/auth/me/creator-profile`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  logout: () => {
    localStorage.removeItem('token');
  },
};

// ADMIN USERS
export const adminUsersAPI = {
  list: () =>
    fetch(`${API_URL}/auth/users`, {
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  create: (data: { email: string; password: string; username: string; role: string }) =>
    fetch(`${API_URL}/auth/users`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  update: (userId: string, data: { username?: string; email?: string; role?: string; isActive?: boolean }) =>
    fetch(`${API_URL}/auth/users/${userId}`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  delete: (userId: string) =>
    fetch(`${API_URL}/auth/users/${userId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
};

// STORIES
export const storiesAPI = {
  listPublic: () =>
    fetch(`${API_URL}/stories`, {
      headers: headers(false),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  getDetail: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}`, {
      headers: headers(false),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  myStories: () =>
    fetch(`${API_URL}/stories/my/list`, {
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  create: (data: FormData) =>
    fetch(`${API_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: data,
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  update: (storyId: string, data: FormData) =>
    fetch(`${API_URL}/stories/${storyId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: data,
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  delete: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  toggleLike: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}/like`, {
      method: 'POST',
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  togglePublish: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}/publish`, {
      method: 'PATCH',
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  adminListAll: () =>
    fetch(`${API_URL}/stories/admin/all`, {
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  adminListAllComments: () =>
    fetch(`${API_URL}/stories/admin/comments`, {
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
};

// EPISODES
export const episodesAPI = {
  list: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}/episodes`, {
      headers: headers(false),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  getDetail: (storyId: string, episodeId: string) =>
    fetch(`${API_URL}/stories/${storyId}/episodes/${episodeId}`, {
      headers: headers(false),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  create: (storyId: string, data: FormData) =>
    fetch(`${API_URL}/stories/${storyId}/episodes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: data,
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  update: (storyId: string, episodeId: string, data: FormData) =>
    fetch(`${API_URL}/stories/${storyId}/episodes/${episodeId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: data,
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  delete: (storyId: string, episodeId: string) =>
    fetch(`${API_URL}/stories/${storyId}/episodes/${episodeId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
};

// COMMENTS
export const commentsAPI = {
  list: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}/comments`, {
      headers: headers(false),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  create: (storyId: string, data: { text: string; episodeId?: string }) =>
    fetch(`${API_URL}/stories/${storyId}/comments`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  update: (commentId: string, data: { text: string }) =>
    fetch(`${API_URL}/stories/comments/${commentId}`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  delete: (commentId: string) =>
    fetch(`${API_URL}/stories/comments/${commentId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  adminListAll: () =>
    fetch(`${API_URL}/stories/admin/comments`, {
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  adminToggleApprove: (commentId: string) =>
    fetch(`${API_URL}/stories/admin/comments/${commentId}/approve`, {
      method: 'PATCH',
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  adminDelete: (commentId: string) =>
    fetch(`${API_URL}/stories/comments/${commentId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
};

// CATEGORIES
export const categoriesAPI = {
  list: () =>
    fetch(`${API_URL}/stories/categories/list`, {
      headers: headers(false),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  create: (data: { name: string; description?: string }) =>
    fetch(`${API_URL}/stories/categories`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),

  delete: (categoryId: string) =>
    fetch(`${API_URL}/stories/categories/${categoryId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
};

// UPLOADS
export const uploadsAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_URL}/upload/single`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then((r) => (r.ok ? r.json() : Promise.reject(r)));
  },

  uploadMultipleImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return fetch(`${API_URL}/upload/multiple`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then((r) => (r.ok ? r.json() : Promise.reject(r)));
  },
};

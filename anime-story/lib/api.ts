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

// Robust response handler that parses JSON error messages from backend
const handleResponse = async (r: Response) => {
  if (r.ok) {
    return r.json();
  }
  let errMsg = r.statusText || 'Request failed';
  try {
    const data = await r.json();
    errMsg = data.message || data.error || errMsg;
  } catch {}
  throw new Error(errMsg);
};

// AUTH
export const authAPI = {
  signup: (data: { email: string; password: string; username: string }) =>
    fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify(data),
    }).then(handleResponse),

  login: (data: { email: string; password: string }) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify(data),
    }).then(handleResponse),

  forgotPassword: (data: { email: string }) =>
    fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify(data),
    }).then(handleResponse),

  resetPassword: (data: { email: string; token: string; newPassword: string }) =>
    fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify(data),
    }).then(handleResponse),

  me: () =>
    fetch(`${API_URL}/auth/me`, {
      headers: headers(true),
    }).then(handleResponse),

  updateMe: (data: { name?: string; email?: string }) =>
    fetch(`${API_URL}/auth/me`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  becomeCreator: () =>
    fetch(`${API_URL}/auth/me/become-creator`, {
      method: 'PATCH',
      headers: headers(true),
    }).then(handleResponse),

  updateCreatorProfile: (data: {
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
    interests?: string[];
  }) =>
    fetch(`${API_URL}/auth/me/creator-profile`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  logout: () => {
    localStorage.removeItem('token');
  },
};

// ADMIN USERS
export const adminUsersAPI = {
  list: () =>
    fetch(`${API_URL}/auth/users`, {
      headers: headers(true),
    }).then(handleResponse),

  create: (data: { email: string; password: string; username: string; role: string }) =>
    fetch(`${API_URL}/auth/users`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (
    userId: string,
    data: { username?: string; email?: string; role?: string; isActive?: boolean }
  ) =>
    fetch(`${API_URL}/auth/users/${userId}`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (userId: string) =>
    fetch(`${API_URL}/auth/users/${userId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then(handleResponse),
};

// STORIES
export const storiesAPI = {
  listPublic: () =>
    fetch(`${API_URL}/stories`, {
      headers: headers(false),
    }).then(handleResponse),

  getDetail: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}`, {
      headers: headers(false),
    }).then(handleResponse),

  myStories: () =>
    fetch(`${API_URL}/stories/my/list`, {
      headers: headers(true),
    }).then(handleResponse),

  create: (data: FormData) =>
    fetch(`${API_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: data,
    }).then(handleResponse),

  update: (storyId: string, data: FormData) =>
    fetch(`${API_URL}/stories/${storyId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: data,
    }).then(handleResponse),

  delete: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then(handleResponse),

  toggleLike: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}/like`, {
      method: 'POST',
      headers: headers(true),
    }).then(handleResponse),

  togglePublish: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}/publish`, {
      method: 'PATCH',
      headers: headers(true),
    }).then(handleResponse),

  adminListAll: () =>
    fetch(`${API_URL}/stories/admin/all`, {
      headers: headers(true),
    }).then(handleResponse),

  adminListAllComments: () =>
    fetch(`${API_URL}/stories/admin/comments`, {
      headers: headers(true),
    }).then(handleResponse),
};

// EPISODES
export const episodesAPI = {
  list: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}/episodes`, {
      headers: headers(false),
    }).then(handleResponse),

  getById: (episodeId: string) =>
    fetch(`${API_URL}/stories/episodes/${episodeId}`, {
      headers: headers(false),
    }).then(handleResponse),

  getDetail: (storyId: string, episodeId: string) =>
    fetch(`${API_URL}/stories/${storyId}/episodes/${episodeId}`, {
      headers: headers(false),
    }).then(handleResponse),

  create: (storyId: string, data: FormData) =>
    fetch(`${API_URL}/stories/${storyId}/episodes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: data,
    }).then(handleResponse),

  update: (storyId: string, episodeId: string, data: FormData) =>
    fetch(`${API_URL}/stories/${storyId}/episodes/${episodeId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: data,
    }).then(handleResponse),

  delete: (storyId: string, episodeId: string) =>
    fetch(`${API_URL}/stories/${storyId}/episodes/${episodeId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then(handleResponse),
};

// COMMENTS
export const commentsAPI = {
  list: (storyId: string) =>
    fetch(`${API_URL}/stories/${storyId}/comments`, {
      headers: headers(false),
    }).then(handleResponse),

  create: (storyId: string, data: { text: string; episodeId?: string }) =>
    fetch(`${API_URL}/stories/${storyId}/comments`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (commentId: string, data: { text: string }) =>
    fetch(`${API_URL}/stories/comments/${commentId}`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (commentId: string) =>
    fetch(`${API_URL}/stories/comments/${commentId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then(handleResponse),

  adminListAll: () =>
    fetch(`${API_URL}/stories/admin/comments`, {
      headers: headers(true),
    }).then(handleResponse),

  adminToggleApprove: (commentId: string) =>
    fetch(`${API_URL}/stories/admin/comments/${commentId}/approve`, {
      method: 'PATCH',
      headers: headers(true),
    }).then(handleResponse),

  adminDelete: (commentId: string) =>
    fetch(`${API_URL}/stories/comments/${commentId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then(handleResponse),
};

// CATEGORIES
export const categoriesAPI = {
  list: () =>
    fetch(`${API_URL}/stories/categories/list`, {
      headers: headers(false),
    }).then(handleResponse),

  create: (data: { name: string; description?: string }) =>
    fetch(`${API_URL}/stories/categories`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (categoryId: string) =>
    fetch(`${API_URL}/stories/categories/${categoryId}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then(handleResponse),
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
    }).then(handleResponse);
  },

  uploadVideo: (file: File) => {
    const formData = new FormData();
    formData.append('video', file);
    return fetch(`${API_URL}/upload/video`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then(handleResponse);
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
    }).then(handleResponse);
  },

  uploadMultipleVideos: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('videos', file));
    return fetch(`${API_URL}/upload/videos`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then(handleResponse);
  },
};

// CONTACT
export const contactAPI = {
  send: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) =>
    fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify(data),
    }).then(handleResponse),
};


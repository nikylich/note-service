const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  get: async (endpoint: string, token?: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Ошибка сети');
    return res.json();
  },
  post: async (endpoint: string, body: any, token?: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Ошибка сети');
    return res.json();
  },
};
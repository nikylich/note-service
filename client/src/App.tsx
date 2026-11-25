import { useState, useEffect } from 'react';
import { api } from './api/client';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [notes, setNotes] = useState<any[]>([]);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  const fetchNotes = async () => {
    try {
      const data = await api.get('/notes', token!);
      setNotes(data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = await api.post(endpoint, { email, password, name: 'User' });
      localStorage.setItem('token', data.accessToken);
      setToken(data.accessToken);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setNotes([]);
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newNote = await api.post('/notes', { title, content, color: 'yellow', tags: ['test'] }, token!);
      setNotes([newNote, ...notes]);
      setTitle('');
      setContent('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleShare = async (noteId: number) => {
    const email = prompt('Введите email пользователя:');
    if (!email) return;
    try {
      await api.post(`/notes/${noteId}/share`, { email, role: 'reader' }, token!);
      alert('Доступ выдан!');
      fetchNotes();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Вход' : 'Регистрация'}</h2>
          <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-4" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Пароль" className="w-full p-2 border rounded mb-4" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mb-2">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-blue-600 text-sm">
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мои заметки</h1>
        <button onClick={handleLogout} className="text-red-500">Выйти</button>
      </div>

      <form onSubmit={handleCreateNote} className="bg-white p-4 rounded shadow mb-8">
        <input type="text" placeholder="Заголовок" className="w-full text-xl p-2 mb-2 border-b" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Текст заметки..." className="w-full p-2 mb-2" rows={3} value={content} onChange={e => setContent(e.target.value)} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Сохранить</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <div key={note.id} className="bg-yellow-100 p-4 rounded shadow border flex flex-col">
            <h3 className="font-bold text-lg mb-2">{note.title}</h3>
            <p className="text-gray-700 flex-grow">{note.content}</p>
            <div className="mt-4 pt-4 border-t border-yellow-300">
              <button onClick={() => handleShare(note.id)} className="text-blue-600 font-semibold">
                + Поделиться
              </button>
            </div>
          </div>
        ))}
        {notes.length === 0 && <p>У вас пока нет заметок.</p>}
      </div>
    </div>
  );
}
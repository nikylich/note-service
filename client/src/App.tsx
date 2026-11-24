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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Вход' : 'Регистрация'}</h2>
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-2 border rounded mb-4"
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            className="w-full p-2 border rounded mb-4"
            value={password} onChange={e => setPassword(e.target.value)} required 
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-2">
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
        <h1 className="text-3xl font-bold text-gray-800">Мои заметки</h1>
        <button onClick={handleLogout} className="text-red-500 hover:underline">Выйти</button>
      </div>

      <form onSubmit={handleCreateNote} className="bg-white p-4 rounded-lg shadow mb-8">
        <input 
          type="text" 
          placeholder="Заголовок заметки" 
          className="w-full text-xl font-semibold p-2 outline-none mb-2"
          value={title} onChange={e => setTitle(e.target.value)} required 
        />
        <textarea 
          placeholder="Текст заметки..." 
          className="w-full p-2 outline-none resize-none"
          rows={3}
          value={content} onChange={e => setContent(e.target.value)} 
        />
        <div className="flex justify-end mt-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Сохранить
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <div key={note.id} className="bg-yellow-100 p-4 rounded-lg shadow border border-yellow-200">
            <h3 className="font-bold text-lg mb-2">{note.title}</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {note.tags?.map((t: any) => (
                <span key={t.tag.id} className="bg-white/50 text-xs px-2 py-1 rounded text-gray-600">
                  #{t.tag.name}
                </span>
              ))}
            </div>
          </div>
        ))}
        {notes.length === 0 && <p className="text-gray-500">У вас пока нет заметок. Создайте первую!</p>}
      </div>
    </div>
  );
}
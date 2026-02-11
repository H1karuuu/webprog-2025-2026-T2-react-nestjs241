import { useEffect, useState } from 'react';
import './App.css';

// Context: Vercel environment vs Local
// In Vercel, we use /api/guestbook (rewritten to backend)
// In Local, we might need http://localhost:3000/guestbook if not using proxy
const API_URL = import.meta.env.PROD
  ? '/api/guestbook'
  : 'http://localhost:3000/guestbook';

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchEntries = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        setEntries(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch entries', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ name: '', message: '' });
      setEditingId(null);
      fetchEntries();
    } catch (error) {
      console.error('Failed to save entry', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchEntries();
    } catch (error) {
      console.error('Failed to delete entry', error);
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setForm({ name: entry.name, message: entry.message });
  };

  return (
    <div className="container">
      <h1>Guestbook</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Leave a message..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
              rows={3}
            />
          </div>
          <div className="actions">
            <button type="submit">{editingId ? 'Update' : 'Sign Guestbook'}</button>
            {editingId && (
              <button type="button" onClick={() => {
                setEditingId(null);
                setForm({ name: '', message: '' });
              }} className="secondary">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="entries">
        {entries.map(entry => (
          <div key={entry.id} className="entry-card">
            <div className="entry-header">
              <strong>{entry.name}</strong>
              <span className="date">{new Date(entry.created_at).toLocaleDateString()}</span>
            </div>
            <p className="entry-message">{entry.message}</p>
            <div className="entry-actions">
              <button onClick={() => startEdit(entry)} className="icon-btn">Edit</button>
              <button onClick={() => handleDelete(entry.id)} className="icon-btn delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

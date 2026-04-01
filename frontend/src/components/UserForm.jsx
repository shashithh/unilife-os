import { useState } from 'react';

const empty = { name: '', email: '', phone: '', role: 'user' };

export default function UserForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || empty);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm(empty);
  };

  const inputStyle = {
    padding: '8px', marginRight: 8, marginBottom: 8,
    border: '1px solid #ccc', borderRadius: 4, fontSize: 14,
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
      <h2 style={{ marginTop: 0 }}>{initial ? 'Edit User' : 'Add User'}</h2>
      <div>
        <input style={inputStyle} name="name"  placeholder="Name"  value={form.name}  onChange={handleChange} required />
        <input style={inputStyle} name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
        <input style={inputStyle} name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <select style={inputStyle} name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        {initial ? 'Update' : 'Add User'}
      </button>
      {initial && (
        <button type="button" onClick={onCancel} style={{ marginLeft: 8, padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Cancel
        </button>
      )}
    </form>
  );
}

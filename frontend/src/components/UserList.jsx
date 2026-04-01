export default function UserList({ users, onEdit, onDelete }) {
  if (!users.length) return <p>No users found.</p>;

  const tdStyle = { padding: '10px 12px', borderBottom: '1px solid #eee', textAlign: 'left' };
  const thStyle = { ...tdStyle, background: '#f0f0f0', fontWeight: 600 };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr>
          {['Name', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map(h => (
            <th key={h} style={thStyle}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u._id}>
            <td style={tdStyle}>{u.name}</td>
            <td style={tdStyle}>{u.email}</td>
            <td style={tdStyle}>{u.phone || '-'}</td>
            <td style={tdStyle}>{u.role}</td>
            <td style={tdStyle}>{u.isActive ? '✅ Active' : '❌ Inactive'}</td>
            <td style={tdStyle}>
              <button onClick={() => onEdit(u)} style={{ marginRight: 6, cursor: 'pointer' }}>Edit</button>
              <button onClick={() => onDelete(u._id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

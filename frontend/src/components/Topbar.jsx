const s = {
  bar: {
    height: 56, background: '#fff', borderBottom: '1px solid #eef0f8',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 28px', position: 'fixed', top: 0, left: 220, right: 0, zIndex: 99,
  },
  breadcrumb: { fontSize: 13, color: '#aaa' },
  active: { color: '#1a1a2e', fontWeight: 600 },
  right: { display: 'flex', alignItems: 'center', gap: 14 },
  search: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#f4f6fb', borderRadius: 8, padding: '7px 14px', fontSize: 13, color: '#aaa',
  },
  bell: { fontSize: 18, cursor: 'pointer', color: '#888' },
  signupBtn: {
    padding: '7px 16px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(90deg,#5b6ef5,#7c3aed)', color: '#fff',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
};

export default function Topbar({ page, onLogout }) {
  const label = page.charAt(0).toUpperCase() + page.slice(1);
  return (
    <div style={s.bar}>
      <div style={s.breadcrumb}>
        UniLife OS &nbsp;›&nbsp; <span style={s.active}>{label}</span>
      </div>
      <div style={s.right}>
        <div style={s.search}>🔍 Search tasks, subjects...</div>
        <span style={s.bell}>🔔</span>
        <button style={s.signupBtn} onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  );
}

const navItems = [
  { section: 'MODULES', items: [
    { icon: '⊞', label: 'Dashboard', key: 'dashboard' },
    { icon: '📖', label: 'Academic Planner', key: 'academic' },
    { icon: '👥', label: 'Group Collaboration', key: 'group' },
    { icon: '🌿', label: 'Wellbeing Hub', key: 'wellbeing' },
    { icon: '💰', label: 'Budget Manager', key: 'budget' },
  ]},
  { section: 'SYSTEM', items: [
    { icon: '📅', label: 'Calendar', key: 'calendar' },
    { icon: '🔔', label: 'Notifications', key: 'notifications' },
    { icon: '👤', label: 'Profile', key: 'profile' },
    { icon: '⚙️', label: 'Settings', key: 'settings' },
  ]},
];

const s = {
  sidebar: {
    width: 220, minHeight: '100vh', background: '#fff',
    borderRight: '1px solid #eef0f8', display: 'flex',
    flexDirection: 'column', padding: '20px 0',
    position: 'fixed', top: 0, left: 0, zIndex: 100,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '0 20px 24px', fontWeight: 700, fontSize: 16, color: '#5b6ef5',
  },
  logoIcon: {
    width: 32, height: 32, background: 'linear-gradient(135deg,#5b6ef5,#7c3aed)',
    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 16,
  },
  section: { padding: '8px 20px 4px', fontSize: 10, fontWeight: 700, color: '#bbb', letterSpacing: 1 },
  item: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 20px', fontSize: 13, cursor: 'pointer', borderRadius: 8, margin: '1px 8px',
    background: active ? '#eef0ff' : 'transparent',
    color: active ? '#5b6ef5' : '#555',
    fontWeight: active ? 600 : 400,
  }),
  bottom: {
    marginTop: 'auto', padding: '16px 20px',
    borderTop: '1px solid #eef0f8', display: 'flex', alignItems: 'center', gap: 10,
  },
  avatar: {
    width: 36, height: 36, borderRadius: '50%', background: '#e0e4ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
  },
  userName: { fontSize: 13, fontWeight: 600 },
  userRole: { fontSize: 11, color: '#aaa' },
};

export default function Sidebar({ activePage, onNavigate, user }) {
  return (
    <div style={s.sidebar}>
      <div style={s.logo}>
        <div style={s.logoIcon}>✦</div>
        UniLife OS
      </div>
      {navItems.map(group => (
        <div key={group.section}>
          <div style={s.section}>{group.section}</div>
          {group.items.map(item => (
            <div key={item.key} style={s.item(activePage === item.key)} onClick={() => onNavigate(item.key)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      ))}
      <div style={s.bottom}>
        <div style={s.avatar}>👤</div>
        <div>
          <div style={s.userName}>{user?.name || 'Student'}</div>
          <div style={s.userRole}>{user?.major || 'Computer Science'}</div>
        </div>
      </div>
    </div>
  );
}

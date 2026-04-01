const modules = [
  { icon: '⊞', label: 'Dashboard', color: '#5b6ef5', bg: '#eef0ff', desc: 'Overview of your tasks, deadlines, and productivity at a glance.', open: true },
  { icon: '📖', label: 'Academic Planner', color: '#7c3aed', bg: '#f3eeff', desc: 'Manage assignments, deadlines, and study sessions efficiently.', open: true },
  { icon: '👥', label: 'Group Collaboration', color: '#0ea5e9', bg: '#e0f5ff', desc: 'Work together with classmates on shared projects and assignments.', open: true },
  { icon: '🌿', label: 'Wellbeing Hub', color: '#10b981', bg: '#e0fdf4', desc: 'Track your mental and physical wellbeing.', open: false },
  { icon: '💰', label: 'Budget Manager', color: '#f59e0b', bg: '#fffbeb', desc: 'Manage your student budget and expenses.', open: false },
];

const s = {
  hero: {
    background: 'linear-gradient(120deg,#5b6ef5 0%,#7c3aed 60%,#a855f7 100%)',
    borderRadius: 16, padding: '40px 40px', color: '#fff', marginBottom: 32,
  },
  heroTag: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 12, opacity: 0.85 },
  heroTitle: { fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 12 },
  heroSub: { fontSize: 14, opacity: 0.8, marginBottom: 24, maxWidth: 480 },
  heroBtns: { display: 'flex', gap: 12 },
  heroBtn: {
    padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 600,
  },
  sectionTitle: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  sectionSub: { fontSize: 13, color: '#888', marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  card: {
    background: '#fff', borderRadius: 14, padding: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  cardIcon: (bg) => ({
    width: 44, height: 44, borderRadius: 10, background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, marginBottom: 12,
  }),
  cardLabel: { fontSize: 14, fontWeight: 700, marginBottom: 6 },
  cardDesc: { fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 12 },
  openLink: { fontSize: 12, color: '#5b6ef5', fontWeight: 600 },
  soon: { fontSize: 11, color: '#bbb', background: '#f4f6fb', borderRadius: 6, padding: '3px 8px', display: 'inline-block' },
};

export default function Dashboard() {
  return (
    <div>
      <div style={s.hero}>
        <div style={s.heroTag}><span>✦</span> UniLife OS</div>
        <div style={s.heroTitle}>Your all-in-one<br />student operating system.</div>
        <div style={s.heroSub}>Manage tasks, collaborate with peers, track your wellbeing, and stay on top of your budget — all in one place.</div>
        <div style={s.heroBtns}>
          <button style={s.heroBtn}>📖 Academic Planner</button>
          <button style={s.heroBtn}>👥 Collaborate</button>
        </div>
      </div>
      <div style={s.sectionTitle}>Modules</div>
      <div style={s.sectionSub}>Everything you need for student life.</div>
      <div style={s.grid}>
        {modules.map(m => (
          <div key={m.label} style={s.card}>
            <div style={s.cardIcon(m.bg)}>{m.icon}</div>
            <div style={s.cardLabel}>{m.label}</div>
            <div style={s.cardDesc}>{m.desc}</div>
            {m.open ? <span style={s.openLink}>Open →</span> : <span style={s.soon}>Soon</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

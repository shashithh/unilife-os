const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#eef0f8',
  },
  card: {
    display: 'flex',
    width: 820,
    minHeight: 520,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 8px 40px rgba(80,60,180,0.13)',
    background: '#fff',
  },
  left: {
    width: 320,
    background: 'linear-gradient(160deg, #5b6ef5 0%, #7c3aed 60%, #a855f7 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '48px 32px 32px',
    color: '#fff',
  },
  logoBox: {
    width: 72,
    height: 72,
    background: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    marginBottom: 20,
  },
  brand: { fontSize: 26, fontWeight: 700, marginBottom: 12 },
  tagline: { fontSize: 13, opacity: 0.85, textAlign: 'center', lineHeight: 1.6 },
  tabs: { display: 'flex', gap: 24, fontSize: 13, opacity: 0.8 },
  tabLink: { cursor: 'pointer', color: '#fff' },
  right: { flex: 1, padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
};

export default function AuthLayout({ children, tagline, activeTab, onTabChange }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.left}>
          <div style={{ textAlign: 'center' }}>
            <div style={styles.logoBox}>✦</div>
            <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 6 }}>Welcome to</p>
            <div style={styles.brand}>UniLife OS</div>
            <p style={styles.tagline}>{tagline}</p>
          </div>
          <div style={styles.tabs}>
            <span style={{ ...styles.tabLink, fontWeight: activeTab === 'signin' ? 700 : 400 }} onClick={() => onTabChange('signin')}>Sign In</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ ...styles.tabLink, fontWeight: activeTab === 'register' ? 700 : 400 }} onClick={() => onTabChange('register')}>Create Account</span>
          </div>
        </div>
        <div style={styles.right}>{children}</div>
      </div>
    </div>
  );
}

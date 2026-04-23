import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AlertTriangle, Bell, CheckCircle2, Info,
  RefreshCw, TrendingUp, ShieldAlert, Tag,
  Clock, Zap
} from 'lucide-react';
import { getAlerts } from '../../services/budgetApi';

const NAV_ITEMS = [
  { label: 'Dashboard',    path: '/budget' },
  { label: 'Add Expense',  path: '/budget/add' },
  { label: 'History',      path: '/budget/history' },
  { label: 'Insights',     path: '/budget/insights' },
  { label: 'Alerts',       path: '/budget/alerts' },
  { label: 'Settings',     path: '/budget/settings' },
];

const ALERT_CONFIG = {
  danger: {
    bg: 'linear-gradient(135deg, #fff1f0 0%, #ffe4e1 100%)',
    border: '#fca5a5',
    badge: { bg: '#dc2626', text: '#fff', label: 'EXCEEDED' },
    icon: <ShieldAlert className="w-6 h-6" style={{ color: '#dc2626' }} />,
    titleColor: '#991b1b',
    textColor: '#7f1d1d',
    accentBar: '#dc2626',
  },
  warning: {
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    border: '#fcd34d',
    badge: { bg: '#d97706', text: '#fff', label: 'WARNING' },
    icon: <AlertTriangle className="w-6 h-6" style={{ color: '#d97706' }} />,
    titleColor: '#92400e',
    textColor: '#78350f',
    accentBar: '#f59e0b',
  },
  prediction: {
    bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    border: '#c4b5fd',
    badge: { bg: '#7c3aed', text: '#fff', label: 'PREDICTION' },
    icon: <TrendingUp className="w-6 h-6" style={{ color: '#7c3aed' }} />,
    titleColor: '#4c1d95',
    textColor: '#5b21b6',
    accentBar: '#7c3aed',
  },
};

function getTitle(alert) {
  if (alert.type === 'danger') {
    return alert.category && alert.category !== 'overall'
      ? `Category Budget Exceeded — ${alert.category}`
      : 'Monthly Budget Exceeded!';
  }
  if (alert.type === 'warning') {
    return alert.category && alert.category !== 'overall'
      ? `Category Warning — ${alert.category}`
      : 'Budget Warning';
  }
  return 'Spending Forecast';
}

function AlertCard({ alert, index }) {
  const cfg = ALERT_CONFIG[alert.type] || ALERT_CONFIG.warning;
  const isCategoryAlert = alert.category && alert.category !== 'overall';

  return (
    <div
      style={{
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        borderRadius: '16px',
        padding: '20px 22px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        animation: `slideIn 0.35s ease both`,
        animationDelay: `${index * 0.08}s`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '4px', background: cfg.accentBar,
        borderRadius: '16px 0 0 16px'
      }} />

      {/* Icon */}
      <div style={{
        flexShrink: 0, width: '44px', height: '44px',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '12px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '15px', color: cfg.titleColor, margin: 0 }}>
            {getTitle(alert)}
          </h3>
          <span style={{
            background: cfg.badge.bg, color: cfg.badge.text,
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px',
            padding: '2px 8px', borderRadius: '20px',
          }}>
            {cfg.badge.label}
          </span>
          {isCategoryAlert && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              background: 'rgba(0,0,0,0.07)', color: cfg.titleColor,
              fontSize: '11px', fontWeight: 600,
              padding: '2px 8px', borderRadius: '20px',
            }}>
              <Tag className="w-3 h-3" /> {alert.category}
            </span>
          )}
        </div>
        <p style={{ fontSize: '14px', color: cfg.textColor, margin: 0, lineHeight: 1.6 }}>
          {alert.message}
        </p>
      </div>
    </div>
  );
}

export function BudgetAlerts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlerts();
      setAlerts(Array.isArray(data) ? data : []);
      setLastRefreshed(new Date());
    } catch (e) {
      console.error('Failed to load alerts:', e);
      setError(e.message || 'Failed to load alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const dangerCount  = alerts.filter(a => a.type === 'danger').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const predCount    = alerts.filter(a => a.type === 'prediction').length;

  const now = new Date();
  const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .alert-nav-btn {
          padding: 10px 16px;
          font-size: 13.5px;
          font-weight: 500;
          border: none;
          background: none;
          cursor: pointer;
          transition: color 0.2s;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          white-space: nowrap;
        }
        .alert-nav-btn:hover { color: #4338ca; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            <Bell style={{ width: 28, height: 28, color: '#f97316' }} />
            Budget Alerts
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Monitoring your spending for <strong>{monthLabel}</strong>
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: loading ? '#f1f5f9' : '#4f46e5',
            color: loading ? '#94a3b8' : '#fff',
            border: 'none', borderRadius: '10px',
            padding: '9px 18px', fontWeight: 600, fontSize: '13px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <RefreshCw style={{ width: 15, height: 15, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Sub-nav */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e2e8f0', marginBottom: '28px', overflowX: 'auto' }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.label}
            className="alert-nav-btn"
            onClick={() => navigate(item.path)}
            style={{
              color: location.pathname === item.path ? '#4f46e5' : '#64748b',
              borderBottomColor: location.pathname === item.path ? '#4f46e5' : 'transparent',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Summary chips */}
      {!loading && !error && alerts.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {dangerCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#fee2e2', border: '1px solid #fca5a5',
              borderRadius: '30px', padding: '5px 14px',
              fontSize: '13px', fontWeight: 600, color: '#991b1b'
            }}>
              <ShieldAlert style={{ width: 14, height: 14 }} />
              {dangerCount} Exceeded
            </div>
          )}
          {warningCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#fef3c7', border: '1px solid #fcd34d',
              borderRadius: '30px', padding: '5px 14px',
              fontSize: '13px', fontWeight: 600, color: '#92400e'
            }}>
              <AlertTriangle style={{ width: 14, height: 14 }} />
              {warningCount} Warning{warningCount > 1 ? 's' : ''}
            </div>
          )}
          {predCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#ede9fe', border: '1px solid #c4b5fd',
              borderRadius: '30px', padding: '5px 14px',
              fontSize: '13px', fontWeight: 600, color: '#4c1d95'
            }}>
              <TrendingUp style={{ width: 14, height: 14 }} />
              {predCount} Forecast
            </div>
          )}
        </div>
      )}

      {/* States */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            border: '4px solid #f1f5f9', borderTopColor: '#f97316',
            animation: 'spin 0.9s linear infinite'
          }} />
          <p style={{ color: '#64748b', fontSize: '15px' }}>Checking your budget alerts…</p>
        </div>
      ) : error ? (
        <div style={{
          background: 'linear-gradient(135deg, #fff1f0, #ffe4e1)',
          border: '1.5px solid #fca5a5', borderRadius: '16px',
          padding: '32px', textAlign: 'center'
        }}>
          <ShieldAlert style={{ width: 40, height: 40, color: '#dc2626', margin: '0 auto 12px' }} />
          <h3 style={{ color: '#991b1b', fontWeight: 700, fontSize: '16px', margin: '0 0 8px' }}>Could Not Load Alerts</h3>
          <p style={{ color: '#7f1d1d', fontSize: '14px', margin: '0 0 16px' }}>{error}</p>
          <button
            onClick={fetchAlerts}
            style={{
              background: '#dc2626', color: '#fff', border: 'none',
              borderRadius: '10px', padding: '9px 20px',
              fontWeight: 600, cursor: 'pointer', fontSize: '13px'
            }}
          >
            Try Again
          </button>
        </div>
      ) : alerts.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '72px 24px', textAlign: 'center',
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          borderRadius: '20px', border: '1.5px solid #86efac',
          animation: 'slideIn 0.4s ease both'
        }}>
          <div style={{
            width: '72px', height: '72px', background: '#bbf7d0',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: '16px',
            boxShadow: '0 0 0 12px #dcfce7'
          }}>
            <CheckCircle2 style={{ width: 36, height: 36, color: '#16a34a' }} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#14532d', margin: '0 0 8px' }}>
            All Clear! 🎉
          </h2>
          <p style={{ color: '#166534', fontSize: '15px', margin: 0, maxWidth: '340px' }}>
            You're managing your budget well. No alerts for {monthLabel}.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {alerts.map((alert, i) => (
            <AlertCard key={i} alert={alert} index={i} />
          ))}

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', color: '#94a3b8', fontSize: '12px', marginTop: '8px'
          }}>
            <Clock style={{ width: 13, height: 13 }} />
            {lastRefreshed ? (
              `Last updated: ${lastRefreshed.toLocaleTimeString()}`
            ) : (
              'Alerts based on current month spending and your budget settings.'
            )}
          </div>
        </div>
      )}
    </div>
  );
}

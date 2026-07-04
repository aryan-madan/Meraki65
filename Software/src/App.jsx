import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { useWebHID } from './lib/hid';
import RemapPage from './pages/Remap';

function Shell({ children, hid }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          padding: '18px 28px',
          background: 'rgba(245, 245, 247, 0.78)',
          backdropFilter: 'saturate(180%) blur(28px)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 0 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              background: 'linear-gradient(180deg, #fefefe 0%, #d8dde6 100%)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 8px 22px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Keydeck</div>
            <div
              style={{
                marginTop: 2,
                fontSize: 12,
                color: '#6b7280',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              aryanworks Meraki
            </div>
          </div>
          <nav
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: 4,
              borderRadius: 999,
              background: 'rgba(15, 23, 42, 0.04)',
              border: '1px solid rgba(15, 23, 42, 0.06)',
            }}
          >
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                padding: '8px 14px',
                borderRadius: 999,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                color: isActive ? '#111827' : '#6b7280',
                background: isActive ? '#ffffff' : 'transparent',
                boxShadow: isActive ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
              })}
            >
              Remap
            </NavLink>
          </nav>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 999,
            background: '#ffffff',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: hid.connected ? '#34c759' : '#c7cdd6',
              boxShadow: hid.connected ? '0 0 0 6px rgba(52, 199, 89, 0.12)' : 'none',
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
            {hid.connected ? 'Keyboard Connected' : 'Keyboard Disconnected'}
          </span>
        </div>
      </header>

      <main style={{ flex: 1, minHeight: 0 }}>{children}</main>
    </div>
  );
}

export default function App() {
  const hid = useWebHID();

  return (
    <BrowserRouter>
      <Shell hid={hid}>
        <Routes>
          <Route path="/" element={<RemapPage hid={hid} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

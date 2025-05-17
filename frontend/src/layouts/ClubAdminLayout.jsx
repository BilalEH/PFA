import { Outlet, Link } from "react-router-dom";

export default function ClubAdminLayout() {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar admin club */}
      <aside style={{ 
        width: '200px',
        background: '#fff3e0',
        padding: '1rem',
        minHeight: '100vh'
      }}>
        <h3>Gestion Club</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/club-admin/dashboard">Dashboard</Link>
          <Link to="/club-admin/membres">Membres</Link>
          <Link to="/club-admin/entretiens">Entretiens</Link>
          <Link to="/club-admin/evenements">Événements</Link>
        </nav>
      </aside>

      {/* Contenu */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
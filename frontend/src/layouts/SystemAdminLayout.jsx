import { Outlet, Link } from "react-router-dom";

export default function SystemAdminLayout() {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar admin système */}
      <aside style={{ 
        width: '200px',
        background: '#fbe9e7',
        padding: '1rem',
        minHeight: '100vh'
      }}>
        <h3>Administration</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/system-admin/utilisateurs">Utilisateurs</Link>
          <Link to="/system-admin/clubs">Clubs</Link>
          <Link to="/system-admin/parametres">Paramètres</Link>
        </nav>
      </aside>

      {/* Contenu */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
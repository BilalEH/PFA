import { Outlet, Link } from "react-router-dom";

export default function StudentLayout() {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar étudiant */}
      <aside style={{ 
        width: '200px', 
        background: '#e8f5e9',
        padding: '1rem',
        minHeight: '100vh'
      }}>
        <h3>Menu Étudiant</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/student/dashboard">Tableau de bord</Link>
          <Link to="/student/candidatures">Mes candidatures</Link>
          <Link to="/student/evenements">Événements</Link>
        </nav>
      </aside>

      {/* Contenu */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
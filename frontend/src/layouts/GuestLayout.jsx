import { Outlet, Link } from "react-router-dom";

export default function GuestLayout() {
  return (
    <div>
      {/* Entête publique */}
      <header style={{ 
        padding: '1rem', 
        background: '#f0f0f0',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <Link to="/">Accueil</Link>
        <Link to="/clubs">Clubs</Link>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/login" style={{ marginRight: '1rem' }}>Connexion</Link>
          <Link to="/signup">Inscription</Link>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
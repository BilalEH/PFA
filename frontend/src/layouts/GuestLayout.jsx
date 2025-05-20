import {Link, Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <div>
      {/* Entête publique */}
      {/* <header style={{ 
        padding: '1rem', 
        background: '#fff3e0',
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
      </header> */}
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}
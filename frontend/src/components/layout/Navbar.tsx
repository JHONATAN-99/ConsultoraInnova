import logo from '../../assets/Innova.jpg';

type NavbarProps = {
  title?: string
  userRole?: string
  logoUrl?: string // Nueva prop opcional para la URL del logo
  onLogout: () => void
}

export function Navbar({ title = 'Consultora', userRole, logoUrl, onLogout }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-title">
        {/* Opción 1: Imagen desde una URL o prop */}
        <img
          src={logoUrl || logo}
          alt="Logo Empresa"
          className="navbar-logo"
        />

        <div className="title-group">
          <h1>{title}</h1>
          {userRole && <span className="navbar-role">({userRole})</span>}
        </div>
      </div>

      <button className="logout-button" type="button" onClick={onLogout}>
        Cerrar sesión
      </button>
    </header>
  )
}

type NavbarProps = {
  title?: string
  userRole?: string
  onLogout: () => void
}

export function Navbar({ title = 'Consultora', userRole, onLogout }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-title">
        <h1>{title}</h1>
        {userRole && <span className="navbar-role">({userRole})</span>}
      </div>
      <button className="logout-button" type="button" onClick={onLogout}>
        Cerrar sesión
      </button>
    </header>
  )
}

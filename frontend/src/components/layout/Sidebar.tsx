
type SidebarItem = {
  key: string
  label: string
}

type SidebarProps = {
  items: SidebarItem[]
  activeKey: string
  onSelect: (key: string) => void
}

export function Sidebar({ items, activeKey, onSelect }: SidebarProps) {
  return (
    <nav className="sidebar">
      <ul>
        {items.map((item) => (
          <li key={item.key}>
            <a
              href="#"
              className={item.key === activeKey ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                onSelect(item.key)
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

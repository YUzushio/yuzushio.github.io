import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/feed', label: 'Feed' },
  { to: '/drill', label: 'Drill' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/category', label: 'Category' },
] as const

export function ViewTabs() {
  return (
    <nav className="view-tabs" aria-label="Gallery views">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `view-tab${isActive ? ' view-tab--active' : ''}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

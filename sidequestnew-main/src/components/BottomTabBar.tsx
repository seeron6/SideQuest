import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Archive, Target, User } from 'lucide-react';

const tabs = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/vault', icon: Archive, label: 'Vault' },
  { path: '/challenges', icon: Target, label: 'Challenges' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border safe-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center gap-0.5 px-3 py-1 transition-colors"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

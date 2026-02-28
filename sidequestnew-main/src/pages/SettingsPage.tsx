import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, Bell, MapPin, User, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();

  const sections = [
    { title: 'Privacy', items: [
      { icon: Eye, label: 'Default memory visibility', value: 'Private' },
      { icon: User, label: 'Public posting', value: 'Enabled' },
    ]},
    { title: 'Permissions', items: [
      { icon: MapPin, label: 'Location access', value: 'Always' },
      { icon: Bell, label: 'Notifications', value: 'On' },
    ]},
  ];

  return (
    <div className="min-h-screen bg-background px-5 pt-14 pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-6">
        <ChevronLeft size={18} /> Back
      </button>

      <h1 className="text-2xl font-display text-foreground mb-6">Settings</h1>

      {sections.map(section => (
        <div key={section.title} className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{section.title}</h3>
          <div className="ios-card divide-y divide-border">
            {section.items.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-4">
                <Icon className="text-muted-foreground" size={18} />
                <span className="flex-1 text-sm text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">{value}</span>
                <ChevronRight className="text-muted-foreground" size={14} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="ios-card p-4">
        <button className="w-full text-center text-sm text-destructive font-medium">Sign Out</button>
      </div>
    </div>
  );
}

import { Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../routing/index.ts';

// Fab is the floating add-word button. It watches the current route
// via useLocation and only renders on routes that opt into the FAB via
// the route config. This keeps the visibility rule declarative instead
// of sprinkled across pages.

export interface FabProps {
  onClick: () => void;
  label: string;
}

export function Fab({ onClick, label }: FabProps): React.ReactNode {
  const location = useLocation();
  const route = ROUTES.find((r) => r.path === location.pathname);
  const showFab = route?.showFab ?? false;
  if (!showFab) return null;

  return (
    <button type="button" className="fab" onClick={onClick} aria-label={label}>
      <Plus size={26} strokeWidth={2.5} />
    </button>
  );
}

import { Outlet } from 'react-router-dom';
import { useSettings, useModal, useTranslation } from '../../core/application/index.ts';
import { Onboarding } from '../pages/Onboarding/index.ts';
import { BottomNav } from './BottomNav.tsx';
import { Fab } from './Fab.tsx';
import { Header } from './Header.tsx';
import { ModalHost } from './ModalHost.tsx';
import { ToastHost } from './ToastHost.tsx';
import { WordFormModal } from '../pages/Words/index.ts';

// AppShell is the persistent layout wrapper for every route. It
// renders the header, the routed outlet, the bottom navigation bar,
// the add-word FAB, and the global modal + toast hosts. If the user
// has not completed onboarding yet the overlay takes over the whole
// viewport without unmounting the rest of the shell.

export function AppShell(): React.ReactNode {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { open } = useModal();

  const openAddWord = (): void => {
    open({ title: t('add_word') }, <WordFormModal />);
  };

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomNav />
      <Fab onClick={openAddWord} label={t('add_word')} />
      <ModalHost />
      <ToastHost />
      {!settings.onboarded ? <Onboarding /> : null}
    </>
  );
}

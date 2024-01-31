import { useMemo } from 'react';
import { defineAbility } from '@casl/ability';
import GuestGuard from './GuestGuard';
import { AbilityContext } from '@/config/ability';
import AuthGuard from './AuthGuard';
import { DRAWER_NAVIGATION_LIST } from '@/utils/projectConfigs';
import { useAuth } from '@/hooks/useAuth';

const Guard = ({ children, authGuard = false, guestGuard = false }) => {
  const { user } = useAuth();

  const abilities = useMemo(
    () =>
      defineAbility((can) => {
        // if (user?.roles?.includes('admin')) {
        //   can('manage', 'employee-requests');
        // }
        DRAWER_NAVIGATION_LIST?.forEach((list) => {
          if (list.acl) {
            can('manage', list.acl);
          }
        });
      }),
    [user?.roles]
  );

  if (guestGuard) {
    return (
      <GuestGuard>
        <AbilityContext.Provider value={abilities}>{children}</AbilityContext.Provider>
      </GuestGuard>
    );
  }
  if (authGuard) {
    return (
      <AuthGuard>
        <AbilityContext.Provider value={abilities}>{children}</AbilityContext.Provider>
      </AuthGuard>
    );
  }
  return children;
};

export default Guard;

import { useRouter } from 'next/router';
import { useAbility } from '@casl/react';
import { Box } from '@mui/material';
import { AbilityContext } from '@/config/ability';
import NotAuthorised from '@/components/NotAuthorised';

const ACLGuard = (props) => {
  const { children, guestGuard = false, aclAbilities } = props;

  const router = useRouter();
  const ability = useAbility(AbilityContext);

  if (guestGuard || router?.route === '/404' || router?.route === '/500') {
    return children;
  }

  if (ability.can(aclAbilities?.action, aclAbilities?.subject)) {
    return children;
  }

  return (
    <Box sx={{ height: '100vh' }}>
      <NotAuthorised width="100%" height="100%" />
    </Box>
  );
};

export default ACLGuard;

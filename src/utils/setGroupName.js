export const setGroupName = (groupNo) => {
  let groupName = '';
  switch (groupNo) {
    case '0':
      groupName = 'Warmup';
      break;
    case '-1':
      groupName = 'Cooldown';
      break;
    case '1':
      groupName = 'Single Set';
      break;
    case '2':
      groupName = 'Super Set';
      break;
    case '3':
      groupName = 'Triset';
      break;
    default:
      groupName = 'Giant Set';
      break;
  }

  return groupName;
};

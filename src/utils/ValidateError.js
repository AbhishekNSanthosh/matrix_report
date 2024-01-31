import toast from 'react-hot-toast';

export const validateGraphQlError = (error) => {
  let graphQlError = error?.graphQLErrors?.[0]?.errors;
  if (graphQlError) {
    let specificError = error?.graphQLErrors?.[0]?.errors; // Renamed variable
    if (specificError && Object.keys(specificError).length) {
      return specificError;
    }
    return null;
  } else if (error?.networkError?.result?.errors?.length) {
    toast.error(error?.networkError?.result?.errors?.[0]?.message);
    return null;
  }
  toast.error(error + '');
};

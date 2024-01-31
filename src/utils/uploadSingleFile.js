import toast from 'react-hot-toast';

const { validateGraphQlError } = require('./ValidateError');

export const uploadSingleFile = async (file) => {
  if (file?.uploaded) {
    return { path: file?.uploaded_url || file?.path, uploaded: true };
  } else {
    toast.loading('Uploading file');
    let formData = new FormData();
    formData.append('file', file);
    try {
      let resData = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_GENERAL_URI}/api/upload`, {
        method: 'POST',
        body: formData
      }).then((res) => res.json());
      if (resData?.path) {
        toast.dismiss();
        return { path: resData?.path, uploaded: true };
      } else {
        toast.dismiss();
        return {
          file: file,
          uploaded: false
        };
      }
    } catch (error) {
      validateGraphQlError(error);
      toast.dismiss();
      return {
        file: file,
        uploaded: false
      };
    }
  }
};

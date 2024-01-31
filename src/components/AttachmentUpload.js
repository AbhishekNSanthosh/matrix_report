import DropzoneWrapper from '@/@core/styles/libs/react-dropzone';
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { Close, TrayArrowUp, Video } from 'mdi-material-ui';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

const AttachmentUpload = ({ image, updateImage, updateVideo, video, error }) => {
  // const { getRootProps, getInputProps } = useDropzone({
  //   maxFiles: 1,
  //   maxSize: 5000000,
  //   accept: {
  //     'image/*': ['.png', '.jpg', '.jpeg'],
  //     'video/*': ['.mp4', '.avi', '.mov']
  //   },
  //   onDrop: (acceptedFiles) => {
  //     if (acceptedFiles?.length) {
  //       updateImage(acceptedFiles?.[0]);
  //     }
  //   },
  //   onDropRejected: () => {
  //     toast.error('Please add a file below 5 MB', {
  //       duration: 2000
  //     });
  //   }
  // });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 5000000, // 5MB
    // accept: ['image/*'],
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },

    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.length) {
        updateImage(acceptedFiles?.[0]);
      }
    },
    onDropRejected: () => {
      toast.error('Please add a valid image file less than 5 MB', {
        duration: 2000
      });
    }
  });

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 5000000, // 5MB
    // accept: ['video/*'],
    accept: {
      'video/*': ['.mp4', '.avi', '.mov']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.length) {
        updateVideo(acceptedFiles?.[0]);
      }
    },
    onDropRejected: () => {
      toast.error('Please add a valid video file less than 5 MB', {
        duration: 2000
      });
    }
  });

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        {image ? (
          <Box sx={{ position: 'relative', width: 100 * (5 / 2), height: 100 }}>
            <img
              width={'100%'}
              height={'100%'}
              style={{ borderRadius: 5 }}
              alt={'image'}
              src={image?.path ? URL.createObjectURL(image) : image?.uploaded_url}
            />
            <Box sx={{ position: 'absolute', top: 0, right: 0 }} onClick={() => updateImage('')}>
              <Close />
            </Box>
          </Box>
        ) : (
          <Box>
            <DropzoneWrapper
              {...getImageRootProps({
                className: 'dropzone',
                style: { minHeight: 50, borderRadius: '8px' }
              })}>
              <input {...getImageInputProps()} />
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <TrayArrowUp sx={{ fontSize: 50, color: 'primary.main' }} />
                <Typography mt={1} variant="body2" color="gray">
                  Select image
                </Typography>
              </Box>
            </DropzoneWrapper>

            {error && <FormHelperText sx={{ color: 'error.main' }}>{error}</FormHelperText>}
          </Box>
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        {video ? (
          <Box sx={{ position: 'relative', width: 100 * (5 / 2), height: 100 }}>
            {/* <Video
              width={'100%'}
              height={'100%'}
              style={{ borderRadius: 5 }}
              alt={'video'}
              src={video?.path ? URL.createObjectURL(video) : video?.uploaded_url}
            /> */}
            <video width="100%" height={'100%'} controls>
              {video instanceof Blob ? (
                <source src={URL.createObjectURL(video)} type="video/mp4" />
              ) : (
                <p>Invalid video format</p>
              )}
              {/* Your browser does not support the video tag. */}
            </video>
            <Box sx={{ position: 'absolute', top: 0, right: 0 }} onClick={() => updateVideo('')}>
              <Close />
            </Box>
          </Box>
        ) : (
          <Box>
            <DropzoneWrapper
              {...getVideoRootProps({
                className: 'dropzone',
                style: { minHeight: 50, borderRadius: '8px' }
              })}>
              <input {...getVideoInputProps()} />
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <TrayArrowUp sx={{ fontSize: 50, color: 'primary.main' }} />
                <Typography mt={1} variant="body2" color="gray">
                  Select video
                </Typography>
              </Box>
            </DropzoneWrapper>

            {error && <FormHelperText sx={{ color: 'error.main' }}>{error}</FormHelperText>}
          </Box>
        )}
      </Grid>
    </Grid>
  );
};
export default AttachmentUpload;

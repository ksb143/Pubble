import { privateApi } from '@/utils/http-commons.ts';

export const getImageUrl = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('upload', imageFile);

  try {
    const response = await privateApi.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.s3Url;
  } catch (error) {
    console.error('Failed to upload image: ', error);
    throw error;
  }
};

export const getFileUrl = async (file: File) => {
  const formData = new FormData();
  formData.append('upload', file);

  try {
    const response = await privateApi.post('/uploads/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.s3Url;
  } catch (error) {
    console.error('Failed to upload image: ', error);
    throw error;
  }
};

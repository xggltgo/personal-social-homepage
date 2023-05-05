export default function useUploadImages() {
  const headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handlePreview = async (file) => {
    previewImage.value = file.response.data;
    previewVisible.value = true;
    previewTitle.value =
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  };

  return {
    headers,
    beforeUpload,
    handlePreview,
  };
}

import { ref } from 'vue';

export default function useUploadImage() {
  const fileList = ref([]);
  const headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  };
  const loading = ref(false);
  const imageUrl = ref('');
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      loading.value = true;
      return;
    }
    if (info.file.status === 'done') {
      imageUrl.value = info.file.response.data;
      loading.value = false;
    }
    if (info.file.status === 'error') {
      loading.value = false;
      message.error('upload error');
    }
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('Image must smaller than 1MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return {
    fileList,
    headers,
    loading,
    imageUrl,
    handleChange,
    beforeUpload,
  };
}

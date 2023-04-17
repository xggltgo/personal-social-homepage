import { onMounted, ref } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { getEssay } from '@/api/essay';

export default function useVditor(essayid) {
  const vditor = ref(null);
  onMounted(() => {
    vditor.value = new Vditor('vditor', {
      height: 700,
      placeholder: '请输入文章内容',
      mode: 'sv',
      cache: {
        enable: false,
      },
      after: async () => {
        if (essayid) {
          const result = await getEssay(essayid);
          vditor.value.setValue(vditor.value.html2md(result.content));
        }
      },
    });
  });

  return {
    vditor,
  };
}

import { onMounted, ref } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { getEssay } from '@/api/essay';
import { getIssue } from '@/api/issue';

export default function useVditor(id, type = 'essay') {
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
        if (type === 'essay' && id) {
          const result = await getEssay(id);
          vditor.value.setValue(vditor.value.html2md(result.content));
        }else if(type === 'issue' && id) {
          const result = await getIssue(id);
          vditor.value.setValue(vditor.value.html2md(result.content));
        }
      },
    });
  });

  return {
    vditor,
  };
}

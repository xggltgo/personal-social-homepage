import moment from 'moment';
import 'moment/dist/locale/zh-cn';
moment.locale('zh-cn');

// 封装一个函数随机从数组中取出一种颜色
export function getRandomColor() {
  const colors = [
    '#FF6B6B',
    '#3EC9A7',
    '#BF80FF',
    '#FF8A5B',
    '#79CEEE',
    '#F8B195',
    '#F67280',
    '#F7CAC9',
    '#92A8D1',
    '#FF6370',
    '#00FF00',
  ];
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

export function formatDateFromNow(timeStamp) {
  return moment(+timeStamp).fromNow();
}

export function formatLocaleTime(timeStamp, onlyDay = false) {
  if (onlyDay) {
    return moment(+timeStamp).format('YYYY-MM-DD');
  }
  return moment(+timeStamp).format('YYYY-MM-DD HH:mm:ss');
}

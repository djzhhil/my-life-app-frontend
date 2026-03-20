/**
 * 日期格式化工具
 */

// 解析日期字符串为 Date 对象
export function parseDateString(dateStr: string): Date {
  if (!dateStr) return new Date();
  return new Date(dateStr.replace(/-/g, '/').replace('T', ' ').substring(0, 19));
}

// 格式化日期
export function formatDate(date: Date, format: string = 'yyyy-MM-dd HH:mm:ss'): string {
  const o: Record<string, number> = {
    'yyyy': date.getFullYear(),
    'MM': date.getMonth() + 1,
    'dd': date.getDate(),
    'HH': date.getHours(),
    'mm': date.getMinutes(),
    'ss': date.getSeconds(),
    'SSS': date.getMilliseconds(),
  };

  // 处理月、日、时、分、秒的补零
  if (format.includes('MM')) {
    o['MM'] = o['MM'] < 10 ? '0' + o['MM'] : o['MM'];
  }
  if (format.includes('dd')) {
    o['dd'] = o['dd'] < 10 ? '0' + o['dd'] : o['dd'];
  }
  if (format.includes('HH')) {
    o['HH'] = o['HH'] < 10 ? '0' + o['HH'] : o['HH'];
  }
  if (format.includes('mm')) {
    o['mm'] = o['mm'] < 10 ? '0' + o['mm'] : o['mm'];
  }
  if (format.includes('ss')) {
    o['ss'] = o['ss'] < 10 ? '0' + o['ss'] : o['ss'];
  }

  return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS/g, (match) => {
    return String(o[match] || '');
  });
}

// 格式化日期字符串（兼容后端返回格式）
export function formatDateString(dateStr: string, format: string = 'yyyy-MM-dd HH:mm:ss'): string {
  const date = parseDateString(dateStr);
  return formatDate(date, format);
}

// 相对时间（如：刚刚、5分钟前、2小时前）
export function getRelativeTime(dateStr: string): string {
  const date = parseDateString(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;

  return formatDateString(dateStr, 'yyyy-MM-dd');
}
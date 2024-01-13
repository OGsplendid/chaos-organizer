// defines links and wrappes them
export const getLinks = (text) => {
  const arr = text.split(' ');
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].startsWith('http://') || arr[i].startsWith('https://')) {
      const withLink = `<a href="${arr[i]}">${arr[i]}</a>`;
      arr[i] = withLink;
    }
  }
  return arr.join(' ');
};

export const ds = (t) => {
  console.log(t);
};

export const defineFileType = (type) => {
  switch (type) {
    case 'image/bmp':
    case 'image/gif':
    case 'image/jpeg':
    case 'image/png':
    case 'image/svg+xml':
    case 'image/tiff':
      return 'image';
    default:
      return 'file';
  }
};

export const downloadFile = (linkSrc, fileName) => {
  const link = document.createElement('a');
  link.href = linkSrc;
  link.rel = 'noopener';
  link.download = fileName;
  link.click();
};

export const getNotificationInfo = (text) => {
  const arr = text.split(' ');
  const [query, time, date, ...info] = arr;
  const scheduled = `${time} ${date}`;
  const notificationTimeStamp = new Date(scheduled).getTime();
  const now = new Date().getTime();
  const difference = notificationTimeStamp - now;
  return {
    time: difference,
    info,
  };
};

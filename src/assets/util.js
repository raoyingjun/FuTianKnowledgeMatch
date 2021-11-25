const getImageInfo = (file) => (new Promise((res, rej) => {
  const fr = new FileReader();
  const img = document.createElement('img');
  fr.onload = (e) => {
    img.src = e.target.result;
  };
  fr.onerror = () => {
    rej(Error('无法获取图片的宽和高，请重新上传'));
  };
  img.onload = (e) => {
    res({
      width: e.target.width,
      height: e.target.height,
    });
  };
  img.onerror = () => {
    rej(Error('无法获取图片的宽和高，请重新上传'));
  };
  fr.readAsDataURL(file);
}));

export default getImageInfo;

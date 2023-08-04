const regExp =
  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

export const convertToEmbeddedUrl = (url: string) => {
  const match = url.match(regExp);
  const videoID = match && match[7].length === 11 ? match[7] : null;

  if (videoID) {
    return `https://www.youtube.com/embed/${videoID}`;
  } else {
    return null;
  }
};

export const convertBase64ToFile = (base64: string): File => {
  const byteString = atob(base64.split(",")[1]);
  const mimeType = base64.split(",")[0].match(/:(.*?);/)?.[1] || "image/png";
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  return new File([byteArray], "captured-image.png", { type: mimeType });
};

import { RefObject } from "react";

export const generateQrImage = async (qrCodeRef: RefObject<HTMLDivElement>) => {
  const svg = qrCodeRef.current?.querySelector("svg");
  if (svg) {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const base64Image = `data:image/svg+xml;base64,${btoa(svgString)}`;
    return base64Image;
  }
  throw new Error("QR code generation failed");
};

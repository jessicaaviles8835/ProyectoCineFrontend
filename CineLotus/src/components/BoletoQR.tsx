import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function BoletoQR({ valor }: { valor: string }) {
  const qrRef = useRef<HTMLDivElement>(null);

  const descargarQR = () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "codigo-qr.png";
    link.click();
  };

  return (
    <div>
      <div ref={qrRef}>
        <QRCodeCanvas value={valor} size={180} />
      </div>
      <button onClick={descargarQR}>Descargar QR</button>
    </div>
  );
}

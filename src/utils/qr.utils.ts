import QRCode from "qrcode";

export abstract class IQRUtils {
  abstract generateQR(data: string): Promise<string>;
}

class QRUtils implements IQRUtils {
  async generateQR(data: string): Promise<string> {
    const qrCode = await QRCode.toDataURL(data)
      .then((qr) => qr)
      .catch((err) => {
        throw new Error(err);
      });
    return qrCode;
  }
}

export default QRUtils;

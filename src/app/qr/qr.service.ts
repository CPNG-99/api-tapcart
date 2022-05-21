import QRCode from "qrcode";

export abstract class IQRService {
  abstract generateQR(data: string): Promise<string>;
}

class QRService implements IQRService {
  async generateQR(data: string): Promise<string> {
    const qrCode = await QRCode.toDataURL(data)
      .then((qr) => qr)
      .catch((err) => {
        throw new Error(err);
      });
    return qrCode;
  }
}

export default QRService;

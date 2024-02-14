import { Html5Qrcode } from "html5-qrcode";
import React, { useState, useEffect, useContext } from "react";
import "./qrScaner.css";
import ScanDataContext from "../ScanDataContext";

function QrScaner() {
  const [isEnabled, setEnabled] = useState(true);
  const [qrMessage, setQrMessage] = useState("");
  const { scanData, setScanData } = useContext(ScanDataContext);

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    const html5QrCode = new Html5Qrcode("qrCodeContainer");

    const qrScanerStop = () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode
          .stop()
          .then((ignore) => console.log("Scaner stop"))
          .catch((err) => console.log("Scaner error"));
      }
    };

    const qrCodeSuccess = (decodedText) => {
  const urlParts = decodedText.split('/');
  const campus = urlParts[3];
  const corpus = urlParts[4];
  const room = urlParts[5];
  setScanData(prevData => ({ ...prevData, campus, corpus, room, scanTime: new Date() }));
  setQrMessage(decodedText);
  setEnabled(false);
};
    

    if (isEnabled) {
        html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccess);
        setQrMessage("");
      } else {
        qrScanerStop();
      }      

    return () => {
      qrScanerStop();
    };
  }, [isEnabled]);

  return (
    <div className="scaner">
      <div id="qrCodeContainer" />
      {qrMessage && 
        <div className="qr-container">
          <div className="qr-message">Вы успешно прошли отметку</div>
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Корпус</th>
                <th>Аудитория</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{new Date().toLocaleString()}</td>
                <td>{qrMessage.split('/')[4]}</td>
                <td>{qrMessage.split('/')[5]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    </div>
  );  
}

export default QrScaner;

// src/views/VisitorAccess/QRCodeDisplay.jsx
import React from 'react';
import QRCode from 'react-qr-code'; // Requires 'react-qr-code' package
import './VisitorAccess.css'; // Usa el CSS compartido

function QRCodeDisplay({ value }) {
    return (
        <div className="qrCodeBox">
            <QRCode 
                value={value} 
                size={200} 
                level="H" 
                bgColor="#ffffff" 
                fgColor="#333333" 
            />
            <p className="qrScanInstruction">
                Presente este código para escanear en entrada y salida.
            </p>
        </div>
    );
}

export default QRCodeDisplay;
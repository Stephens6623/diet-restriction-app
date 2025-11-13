import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './BarcodeScanner.css';

function BarcodeScanner({ onScan, loading }) {
  const [scanning, setScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (html5QrCodeRef.current && scanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, [scanning]);

  const startScanning = async () => {
    try {
      setError(null);
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Barcode detected
          stopScanning();
          onScan({ barcode: decodedText });
        },
        (errorMessage) => {
          // Ignore scan errors (happens continuously while scanning)
        }
      );

      setScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start camera. Please ensure camera permissions are granted.');
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setScanning(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan({ barcode: manualBarcode.trim() });
      setManualBarcode('');
    }
  };

  return (
    <div className="barcode-scanner">
      <div className="scanner-card">
        <h3>Scan Barcode</h3>
        
        {!scanning && !loading && (
          <div className="scanner-controls">
            <button 
              className="scan-btn"
              onClick={startScanning}
            >
              📷 Start Camera
            </button>
            
            <div className="divider">
              <span>OR</span>
            </div>

            <form onSubmit={handleManualSubmit} className="manual-input">
              <input
                type="text"
                placeholder="Enter barcode manually..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
              />
              <button type="submit" disabled={!manualBarcode.trim()}>
                Check
              </button>
            </form>
          </div>
        )}

        {scanning && (
          <div className="scanner-active">
            <div id="reader" ref={scannerRef}></div>
            <button className="stop-btn" onClick={stopScanning}>
              Stop Scanning
            </button>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing product...</p>
          </div>
        )}

        {error && (
          <div className="scanner-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default BarcodeScanner;

import React, { useState } from 'react';
import './App.css';
import RestrictionSelector from './components/RestrictionSelector';
import BarcodeScanner from './components/BarcodeScanner';
import LabelUploader from './components/LabelUploader';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [restrictions, setRestrictions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanMode, setScanMode] = useState('upload'); // 'barcode' or 'upload'

  const handleAnalyze = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('restrictions', JSON.stringify(restrictions));
      
      if (data.barcode) {
        formData.append('barcode', data.barcode);
      } else if (data.image) {
        formData.append('image', data.image);
      }

      const response = await fetch('/api/analyze/product', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze product');
      }

      const resultData = await response.json();
      setResult(resultData);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍎 Diet Restriction Checker</h1>
        <p>Scan barcodes or labels to check if food is safe for you</p>
      </header>

      <main className="App-main">
        {!result && (
          <>
            <RestrictionSelector
              restrictions={restrictions}
              onRestrictionsChange={setRestrictions}
            />

            {restrictions.length > 0 && (
              <div className="scan-section">
                <div className="mode-selector">
                  <button
                    className={`mode-btn ${scanMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setScanMode('upload')}
                  >
                    📸 Upload Label
                  </button>
                  <button
                    className={`mode-btn ${scanMode === 'barcode' ? 'active' : ''}`}
                    onClick={() => setScanMode('barcode')}
                  >
                    🔍 Scan Barcode
                  </button>
                </div>

                {scanMode === 'barcode' ? (
                  <BarcodeScanner onScan={handleAnalyze} loading={loading} />
                ) : (
                  <LabelUploader onUpload={handleAnalyze} loading={loading} />
                )}
              </div>
            )}

            {error && (
              <div className="error-message">
                <strong>Error:</strong> {error}
              </div>
            )}
          </>
        )}

        {result && (
          <ResultDisplay
            result={result}
            restrictions={restrictions}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="App-footer">
        <p>Always verify product information before consuming</p>
      </footer>
    </div>
  );
}

export default App;

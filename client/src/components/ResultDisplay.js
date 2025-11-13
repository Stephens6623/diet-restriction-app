import React from 'react';
import './ResultDisplay.css';

function ResultDisplay({ result, restrictions, onReset }) {
  const isSafe = result.safe === true;

  return (
    <div className="result-display">
      <div className={`result-card ${isSafe ? 'safe' : 'unsafe'}`}>
        <div className="result-header">
          <div className={`status-icon ${isSafe ? 'safe' : 'unsafe'}`}>
            {isSafe ? '✓' : '⚠'}
          </div>
          <h2>{isSafe ? 'Safe to Consume' : 'Contains Restricted Ingredients'}</h2>
        </div>

        <div className="result-content">
          {result.barcode && (
            <div className="result-section">
              <h3>📊 Barcode</h3>
              <p className="barcode-info">{result.barcode}</p>
              <p className="info-note">
                Note: Barcode analysis is limited. For accurate results, please scan the ingredient label.
              </p>
            </div>
          )}

          {result.ingredients && result.ingredients.length > 0 && (
            <div className="result-section">
              <h3>📝 Detected Ingredients</h3>
              <ul className="ingredient-list">
                {result.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {result.conflicts && result.conflicts.length > 0 && (
            <div className="result-section conflicts">
              <h3>⚠️ Conflicting Ingredients</h3>
              <div className="conflict-list">
                {result.conflicts.map((conflict, index) => (
                  <div key={index} className="conflict-item">
                    {typeof conflict === 'string' ? (
                      <p>{conflict}</p>
                    ) : (
                      <>
                        <strong>{conflict.ingredient}</strong>
                        {conflict.explanation && <p>{conflict.explanation}</p>}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <div className="result-section warnings">
              <h3>⚠️ Warnings</h3>
              <ul className="warning-list">
                {result.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="result-section recommendations">
              <h3>💡 Recommendations</h3>
              <ul className="recommendation-list">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          )}

          {result.rawResponse && (
            <div className="result-section raw-response">
              <details>
                <summary>View Full AI Response</summary>
                <p>{result.rawResponse}</p>
              </details>
            </div>
          )}
        </div>

        <div className="result-footer">
          <p className="disclaimer">
            ⚠️ Always verify product information before consuming. This analysis is for informational purposes only.
          </p>
          <button className="reset-btn" onClick={onReset}>
            ← Scan Another Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultDisplay;

import React, { useState } from 'react';
import { Upload, FileSpreadsheet, X, Check, AlertCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/excel';

export function ImportExcelModal({ isOpen, onClose, onImportSuccess }) {
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setErrorMsg('');
      setFileName(file.name);
      try {
        const rows = await parseExcelFile(file);
        if (rows && rows.length > 0) {
          setParsedData(rows);
        } else {
          setErrorMsg('The selected Excel file is empty or formatted incorrectly.');
        }
      } catch (err) {
        setErrorMsg('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.');
      }
    }
  };

  const handleConfirmImport = () => {
    if (parsedData.length > 0) {
      onImportSuccess(parsedData);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-md fade-in">
        <div className="modal-header">
          <div className="modal-title-group">
            <FileSpreadsheet className="modal-header-icon text-gold" />
            <div>
              <h2>Import Records from Excel (.xlsx)</h2>
              <p className="modal-subtitle">Pastor Bulk Import Tool</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close">
            <X />
          </button>
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div className="alert-box alert-error">
              <AlertCircle className="alert-icon" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="file-upload-dropzone-large">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              id="excel-import-file"
              className="file-input-hidden"
            />
            <label htmlFor="excel-import-file" className="dropzone-label">
              <Upload className="dropzone-icon-lg text-gold" />
              <span className="dropzone-title">Select Excel (.xlsx) Spreadsheet</span>
              <span className="dropzone-hint">Supported columns: "Donor Name", "Address", "Amount (₹)", "Date & Time", "Notes"</span>
            </label>
          </div>

          {fileName && parsedData.length > 0 && (
            <div className="import-preview-box">
              <div className="preview-header">
                <Check className="text-success" />
                <span>Selected: <strong>{fileName}</strong></span>
              </div>
              <div className="preview-count">
                Detected <strong>{parsedData.length} records</strong> ready for import into the database.
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button 
            onClick={handleConfirmImport} 
            disabled={parsedData.length === 0}
            className="btn btn-primary"
          >
            <Upload className="btn-icon" />
            <span>Import {parsedData.length > 0 ? `${parsedData.length} Records` : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

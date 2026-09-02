import React, { useState } from 'react';
import { ShieldCheck, KeyRound, UserCheck, X, AlertCircle } from 'lucide-react';

export function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = nameInput.trim();
    const trimmedPass = passwordInput.trim();

    // Exact credentials validation: Pallapati Cornelius / Pallapati Cornelius
    if (trimmedName === 'Pallapati Cornelius' && trimmedPass === 'Pallapati Cornelius') {
      onLoginSuccess('Pallapati Cornelius');
      onClose();
    } else {
      setErrorMsg('Invalid Pastor Credentials! Please check the Pastor Name and Password.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-sm fade-in">
        <div className="modal-header">
          <div className="modal-title-group">
            <ShieldCheck className="modal-header-icon text-gold" />
            <div>
              <h2>Pastor Portal Login</h2>
              <p className="modal-subtitle">Authorized Pastor Access Only</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close">
            <X />
          </button>
        </div>

        <form onSubmit={handleLogin} className="modal-body">
          {errorMsg && (
            <div className="alert-box alert-error">
              <AlertCircle className="alert-icon" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <UserCheck className="label-icon" />
              <span>Pastor Name</span>
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter Pastor Name"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <KeyRound className="label-icon" />
              <span>Pastor Password</span>
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter Password"
              className="input-field"
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <ShieldCheck className="btn-icon" />
              <span>Authenticate & Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


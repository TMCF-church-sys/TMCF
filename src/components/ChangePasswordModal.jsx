import React, { useState, useEffect } from 'react';
import { KeyRound, Lock, CheckCircle2, X, AlertCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ChangePasswordModal({ isOpen, onClose, onSavePassword, currentPastorPassword }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setSuccessMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (currentPassword !== currentPastorPassword) {
      setErrorMsg('Incorrect Current Password! Please verify and try again.');
      return;
    }

    if (!newPassword || newPassword.trim().length === 0) {
      setErrorMsg('New Password cannot be empty.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMsg('New Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New Password and Confirm New Password do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMsg('New Password must be different from Current Password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSavePassword(newPassword);
      setSuccessMsg('Password changed successfully! Changes reflected everywhere.');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      setErrorMsg('Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-sm fade-in">
        <div className="modal-header">
          <div className="modal-title-group">
            <KeyRound className="modal-header-icon text-gold" />
            <div>
              <h2>Change Pastor Password</h2>
              <p className="modal-subtitle">Update your secure access credentials</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errorMsg && (
            <div className="alert-box alert-error">
              <AlertCircle className="alert-icon" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert-box alert-success" style={{ background: '#065f46', color: '#ecfdf5', borderColor: '#059669' }}>
              <CheckCircle2 className="alert-icon" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Lock className="label-icon" />
              <span>Current Password</span>
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <KeyRound className="label-icon" />
              <span>New Password</span>
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <ShieldCheck className="label-icon" />
              <span>Confirm New Password</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="input-field"
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <KeyRound className="btn-icon" />
              <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

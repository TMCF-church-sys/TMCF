import React from 'react';
import { Church, ShieldCheck, LogIn, LogOut, Plus, FileSpreadsheet, KeyRound } from 'lucide-react';
import { exportToExcel } from '../utils/excel';

export function Navbar({ isPastorLoggedIn, pastorName, onOpenLogin, onLogout, onOpenAddRecord, onOpenChangePassword, records }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Header */}
        <div className="brand-group">
          <div className="logo-icon-wrapper">
            <Church className="brand-icon" />
          </div>
          <div>
            <div className="brand-title">TMCF CHURCH</div>
            <div className="brand-subtitle">Reconstruction Fund Ledger</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Quick Excel Download Button (Accessible to Everyone) */}
          <button 
            onClick={() => exportToExcel(records)} 
            className="btn btn-excel"
            title="Download Excel Sheet (.xlsx)"
          >
            <FileSpreadsheet className="btn-icon" />
            <span className="btn-text">Download .xlsx</span>
          </button>

          {isPastorLoggedIn ? (
            <div className="pastor-actions">
              <button onClick={onOpenAddRecord} className="btn btn-primary btn-add-record">
                <Plus className="btn-icon" />
                <span>Add Record</span>
              </button>

              <button 
                onClick={onOpenChangePassword} 
                className="btn btn-outline btn-change-password"
                title="Change Pastor Access Password"
              >
                <KeyRound className="btn-icon" />
                <span className="btn-text">Change Password</span>
              </button>
              
              <div className="pastor-badge-group">
                <div className="pastor-badge" title="Pastor Authenticated">
                  <ShieldCheck className="shield-icon" />
                  <span className="pastor-name-text">{pastorName}</span>
                </div>
                
                <button onClick={onLogout} className="btn btn-outline btn-logout" title="Logout Pastor session">
                  <LogOut className="btn-icon" />
                  <span className="btn-text">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <button onClick={onOpenLogin} className="btn btn-pastor-login">
              <LogIn className="btn-icon" />
              <span>Pastor Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

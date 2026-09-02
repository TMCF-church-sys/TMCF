import React from 'react';
import { X, Download } from 'lucide-react';

export function ImageModal({ isOpen, onClose, imageSrc, title }) {
  if (!isOpen || !imageSrc) return null;

  return (
    <div className="modal-overlay image-modal-overlay" onClick={onClose}>
      <div className="modal-content image-modal-content fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Receipt / Photo - {title || 'Details'}</h3>
          <button onClick={onClose} className="btn-close">
            <X />
          </button>
        </div>
        
        <div className="image-viewer-body">
          <img src={imageSrc} alt={title || 'Receipt'} className="full-lightbox-img" />
        </div>

        <div className="modal-footer justify-between">
          <a 
            href={imageSrc} 
            download={`TMCF_Receipt_${(title || 'Photo').replace(/\s+/g, '_')}.jpg`} 
            className="btn btn-outline btn-sm"
            target="_blank"
            rel="noreferrer"
          >
            <Download className="btn-icon" />
            <span>Download Image</span>
          </a>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

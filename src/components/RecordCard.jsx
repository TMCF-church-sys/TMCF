import React from 'react';
import { MapPin, Calendar, Image as ImageIcon, Edit2, Trash2, FileText } from 'lucide-react';

export function RecordCard({ record, isPastorLoggedIn, onEdit, onDelete, onViewImage }) {
  let formattedDate = record.dateTime;
  try {
    if (record.dateTime) {
      const d = new Date(record.dateTime);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
    }
  } catch (e) {}

  return (
    <div className="record-card">
      <div className="card-top">
        <div className="donor-info">
          <h3 className="donor-name">{record.name}</h3>
          <div className="donor-address">
            <MapPin className="card-icon-sm" />
            <span>{record.address}</span>
          </div>
        </div>

        <div className="amount-badge">
          ₹ {Number(record.amount).toLocaleString('en-IN')}
        </div>
      </div>

      {record.notes && (
        <div className="card-notes">
          <FileText className="card-icon-sm notes-icon" />
          <span>{record.notes}</span>
        </div>
      )}

      <div className="card-footer">
        <div className="card-datetime">
          <Calendar className="card-icon-sm" />
          <span>{formattedDate}</span>
        </div>

        <div className="card-actions">
          {record.image && (
            <button 
              onClick={() => onViewImage(record.image, record.name)}
              className="btn btn-sm btn-image-view"
              title="View Receipt / Photo"
            >
              <ImageIcon className="btn-icon" />
              <span>Photo</span>
            </button>
          )}

          {isPastorLoggedIn && (
            <div className="pastor-card-btn-group">
              <button 
                onClick={() => onEdit(record)} 
                className="btn btn-sm btn-outline btn-edit"
                title="Edit Record"
              >
                <Edit2 className="btn-icon" />
              </button>
              <button 
                onClick={() => onDelete(record.id, record.name)} 
                className="btn btn-sm btn-danger btn-delete"
                title="Delete Record"
              >
                <Trash2 className="btn-icon" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

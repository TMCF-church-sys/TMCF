import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, X, Upload, Image as ImageIcon, CheckCircle2, User, MapPin, IndianRupee, Calendar, FileText } from 'lucide-react';

export function RecordModal({ isOpen, onClose, onSave, recordToEdit }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (recordToEdit) {
      setName(recordToEdit.name || '');
      setAddress(recordToEdit.address || '');
      setAmount(recordToEdit.amount || '');
      setDateTime(recordToEdit.dateTime || new Date().toISOString().slice(0, 16));
      setNotes(recordToEdit.notes || '');
      setImage(recordToEdit.image || '');
      setImagePreview(recordToEdit.image || '');
    } else {
      // Default new record values
      setName('');
      setAddress('');
      setAmount('');
      const now = new Date();
      // Format to YYYY-MM-DDTHH:mm for datetime-local input
      const localIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setDateTime(localIso);
      setNotes('');
      setImage('');
      setImagePreview('');
    }
  }, [recordToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local photo upload
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !amount || Number(amount) <= 0) {
      alert("Please fill in Donor Name, Address, and a valid Amount.");
      return;
    }

    onSave({
      name: name.trim(),
      address: address.trim(),
      amount: Number(amount),
      dateTime: dateTime || new Date().toISOString().slice(0, 16),
      notes: notes.trim(),
      image: image || null
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-md fade-in">
        <div className="modal-header">
          <div className="modal-title-group">
            {recordToEdit ? (
              <Edit className="modal-header-icon text-gold" />
            ) : (
              <PlusCircle className="modal-header-icon text-gold" />
            )}
            <div>
              <h2>{recordToEdit ? 'Edit Collection Record' : 'Add Reconstruction Record'}</h2>
              <p className="modal-subtitle">Pastor Management Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Donor Name */}
          <div className="form-group">
            <label className="form-label">
              <User className="label-icon" />
              <span>Donor Name *</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bro. K. Joseph & Family"
              className="input-field"
              required
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">
              <MapPin className="label-icon" />
              <span>Address / Area *</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. H.No. 4-12, Secunderabad"
              className="input-field"
              required
            />
          </div>

          {/* Grid Row for Amount & DateTime */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                <IndianRupee className="label-icon" />
                <span>Amount Collected (₹) *</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 25000"
                min="1"
                step="1"
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar className="label-icon" />
                <span>Date & Time *</span>
              </label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Optional Image Upload */}
          <div className="form-group">
            <label className="form-label">
              <ImageIcon className="label-icon" />
              <span>Receipt / Donor Photo (Optional)</span>
            </label>

            <div className="image-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                id="photo-upload-input"
                className="file-input-hidden"
              />
              <label htmlFor="photo-upload-input" className="file-upload-dropzone">
                <Upload className="dropzone-icon" />
                <span>Tap to Select Image File (or Photo)</span>
              </label>

              {imagePreview && (
                <div className="image-preview-card">
                  <img src={imagePreview} alt="Receipt Preview" className="preview-img" />
                  <button 
                    type="button" 
                    onClick={() => { setImage(''); setImagePreview(''); }}
                    className="btn btn-xs btn-danger remove-img-btn"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">
              <FileText className="label-icon" />
              <span>Notes / Payment Method (Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via PhonePe UPI / Cash handed during Sunday Service"
              className="input-field textarea-field"
              rows="2"
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 className="btn-icon" />
              <span>{recordToEdit ? 'Save Changes' : 'Add Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

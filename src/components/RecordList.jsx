import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, Table as TableIcon, FileSpreadsheet, ArrowUpDown, Upload, Image as ImageIcon, Edit2, Trash2 } from 'lucide-react';
import { RecordCard } from './RecordCard';
import { exportToExcel } from '../utils/excel';

export function RecordList({ 
  records, 
  isPastorLoggedIn, 
  onEditRecord, 
  onDeleteRecord, 
  onViewImage,
  onOpenImportExcel
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest, name
  const [viewMode, setViewMode] = useState('grid'); // grid or table

  // Filter & Sort Logic
  const filteredRecords = useMemo(() => {
    let result = [...records];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => 
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.address && r.address.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.dateTime || 0) - new Date(a.dateTime || 0);
      } else if (sortBy === 'oldest') {
        return new Date(a.dateTime || 0) - new Date(b.dateTime || 0);
      } else if (sortBy === 'highest') {
        return Number(b.amount || 0) - Number(a.amount || 0);
      } else if (sortBy === 'lowest') {
        return Number(a.amount || 0) - Number(b.amount || 0);
      } else if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });

    return result;
  }, [records, searchQuery, sortBy]);

  const filteredTotal = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [filteredRecords]);

  return (
    <section className="record-list-section">
      {/* Controls Bar */}
      <div className="controls-bar">
        {/* Search Input */}
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Donor Name, Address, or Notes..."
            className="search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="search-clear-btn">
              ✕
            </button>
          )}
        </div>

        <div className="controls-right">
          {/* Sort Dropdown */}
          <div className="select-wrapper">
            <ArrowUpDown className="select-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="select-dropdown"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Amount</option>
              <option value="lowest">Sort: Lowest Amount</option>
              <option value="name">Sort: Donor Name (A-Z)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="view-toggle-group">
            <button 
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid / Card View (Best for Mobile)"
            >
              <LayoutGrid className="btn-icon" />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              title="Table View (Best for Desktop)"
            >
              <TableIcon className="btn-icon" />
            </button>
          </div>

          {/* Export & Import Buttons */}
          <button 
            onClick={() => exportToExcel(filteredRecords)}
            className="btn btn-excel-sm"
            title="Download Excel (.xlsx) file"
          >
            <FileSpreadsheet className="btn-icon" />
            <span className="btn-text">Export Excel</span>
          </button>

          {isPastorLoggedIn && (
            <button 
              onClick={onOpenImportExcel}
              className="btn btn-outline-sm btn-import"
              title="Pastor Bulk Import from Excel"
            >
              <Upload className="btn-icon" />
              <span className="btn-text">Import Excel</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header Summary */}
      <div className="records-summary-row">
        <div className="records-count-text">
          Showing <strong>{filteredRecords.length}</strong> of {records.length} Records
          {searchQuery && <span> (Filtered)</span>}
        </div>
        <div className="filtered-sum-badge">
          Subtotal: ₹ {filteredTotal.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Content Rendering */}
      {filteredRecords.length === 0 ? (
        <div className="empty-state">
          <FileSpreadsheet className="empty-icon" />
          <h3>No Collection Records Found</h3>
          <p>Try clearing your search filters or add a new record.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="records-grid">
          {filteredRecords.map(rec => (
            <RecordCard
              key={rec.id}
              record={rec}
              isPastorLoggedIn={isPastorLoggedIn}
              onEdit={onEditRecord}
              onDelete={onDeleteRecord}
              onViewImage={onViewImage}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="table-responsive-container">
          <table className="records-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Donor Name</th>
                <th>Address / Area</th>
                <th>Amount (₹)</th>
                <th>Date & Time</th>
                <th>Photo / Receipt</th>
                <th>Notes</th>
                {isPastorLoggedIn && <th>Pastor Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec, idx) => {
                let formattedDate = rec.dateTime;
                try {
                  if (rec.dateTime) {
                    const d = new Date(rec.dateTime);
                    if (!isNaN(d.getTime())) {
                      formattedDate = d.toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      });
                    }
                  }
                } catch (e) {}

                return (
                  <tr key={rec.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td className="fw-bold">{rec.name}</td>
                    <td>{rec.address}</td>
                    <td className="amount-col">₹ {Number(rec.amount).toLocaleString('en-IN')}</td>
                    <td className="datetime-col">{formattedDate}</td>
                    <td>
                      {rec.image ? (
                        <button 
                          onClick={() => onViewImage(rec.image, rec.name)}
                          className="btn btn-xs btn-image-view"
                        >
                          <ImageIcon className="btn-icon" />
                          <span>View</span>
                        </button>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td className="notes-col">{rec.notes || '—'}</td>
                    {isPastorLoggedIn && (
                      <td>
                        <div className="table-actions">
                          <button 
                            onClick={() => onEditRecord(rec)} 
                            className="btn btn-xs btn-outline" 
                            title="Edit Record"
                          >
                            <Edit2 className="btn-icon" />
                          </button>
                          <button 
                            onClick={() => onDeleteRecord(rec.id, rec.name)} 
                            className="btn btn-xs btn-danger" 
                            title="Delete Record"
                          >
                            <Trash2 className="btn-icon" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { StatsHeader } from './components/StatsHeader';
import { RecordList } from './components/RecordList';
import { LoginModal } from './components/LoginModal';
import { RecordModal } from './components/RecordModal';
import { ImageModal } from './components/ImageModal';
import { ImportExcelModal } from './components/ImportExcelModal';
import { dbService } from './services/dbService';

export default function App() {
  const [records, setRecords] = useState([]);
  const [targetGoal, setTargetGoal] = useState(1500000);
  const [isPastorLoggedIn, setIsPastorLoggedIn] = useState(false);
  const [pastorName, setPastorName] = useState('Pallapati Cornelius');

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalData, setImageModalData] = useState({ src: '', title: '' });
  const [isImportExcelOpen, setIsImportExcelOpen] = useState(false);

  // Subscribe to Database Real-time Changes
  useEffect(() => {
    const unsubscribeRecords = dbService.subscribeToRecords((data) => {
      setRecords(data);
    });

    const unsubscribeGoal = dbService.subscribeToGoal((goal) => {
      setTargetGoal(goal);
    });

    return () => {
      unsubscribeRecords();
      unsubscribeGoal();
    };
  }, []);

  // Total amount calculation
  const totalAmount = records.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  // Pastor Login Handler
  const handleLoginSuccess = (name) => {
    setIsPastorLoggedIn(true);
    setPastorName(name);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  // Pastor Logout Handler
  const handleLogout = () => {
    setIsPastorLoggedIn(false);
  };

  // Add / Edit Record Handler
  const handleSaveRecord = async (recordData) => {
    if (recordToEdit) {
      // Edit existing record
      await dbService.updateRecord(recordToEdit.id, recordData);
    } else {
      // Add new record
      await dbService.addRecord(recordData);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Delete Record Handler
  const handleDeleteRecord = async (id, donorName) => {
    if (window.confirm(`Are you sure you want to delete the record for "${donorName}"?`)) {
      await dbService.deleteRecord(id);
    }
  };

  // Update Goal Handler
  const handleUpdateGoal = async (newGoal) => {
    await dbService.updateGoal(newGoal);
  };

  // Import Excel Handler
  const handleImportExcelSuccess = async (importedRows) => {
    const count = await dbService.importBulkRecords(importedRows);
    alert(`Successfully imported ${count} records into the collection database!`);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  // Open Edit Modal
  const handleOpenEdit = (rec) => {
    setRecordToEdit(rec);
    setIsRecordModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setRecordToEdit(null);
    setIsRecordModalOpen(true);
  };

  // View Receipt/Image Lightbox
  const handleViewImage = (src, title) => {
    setImageModalData({ src, title });
    setIsImageModalOpen(true);
  };

  return (
    <div className="app">
      <Navbar
        isPastorLoggedIn={isPastorLoggedIn}
        pastorName={pastorName}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenAddRecord={handleOpenAdd}
        records={records}
      />

      <main className="app-container">
        <StatsHeader
          totalAmount={totalAmount}
          targetGoal={targetGoal}
          donorCount={records.length}
          isPastorLoggedIn={isPastorLoggedIn}
          onUpdateGoal={handleUpdateGoal}
        />

        <RecordList
          records={records}
          isPastorLoggedIn={isPastorLoggedIn}
          onEditRecord={handleOpenEdit}
          onDeleteRecord={handleDeleteRecord}
          onViewImage={handleViewImage}
          onOpenImportExcel={() => setIsImportExcelOpen(true)}
        />
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSave={handleSaveRecord}
        recordToEdit={recordToEdit}
      />

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={imageModalData.src}
        title={imageModalData.title}
      />

      <ImportExcelModal
        isOpen={isImportExcelOpen}
        onClose={() => setIsImportExcelOpen(false)}
        onImportSuccess={handleImportExcelSuccess}
      />
    </div>
  );
}

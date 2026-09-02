import * as XLSX from 'xlsx';

/**
 * Export collection records to Excel (.xlsx) file
 * @param {Array} records - List of donation records
 * @param {String} fileName - Name of output file
 */
export function exportToExcel(records, fileName = "TMCF_Church_Reconstruction_Fund.xlsx") {
  if (!records || records.length === 0) {
    alert("No records available to export!");
    return;
  }

  // Format data for Excel worksheet
  const formattedData = records.map((rec, index) => {
    let formattedDate = rec.dateTime;
    try {
      if (rec.dateTime) {
        const d = new Date(rec.dateTime);
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

    return {
      'S.No': index + 1,
      'Donor Name': rec.name || 'Anonymous',
      'Address / Area': rec.address || 'N/A',
      'Amount Collected (₹)': Number(rec.amount) || 0,
      'Date & Time': formattedDate,
      'Receipt Photo': rec.image ? 'Attached (Available in App)' : 'None',
      'Notes / Remarks': rec.notes || ''
    };
  });

  // Calculate summary total
  const totalAmount = records.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  formattedData.push({
    'S.No': '',
    'Donor Name': 'TOTAL AMOUNT COLLECTED',
    'Address / Area': '',
    'Amount Collected (₹)': totalAmount,
    'Date & Time': '',
    'Receipt Photo': '',
    'Notes / Remarks': `Generated on ${new Date().toLocaleDateString('en-IN')}`
  });

  // Create worksheet & workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set column widths for clean readability
  worksheet['!cols'] = [
    { wch: 8 },  // S.No
    { wch: 28 }, // Donor Name
    { wch: 35 }, // Address
    { wch: 22 }, // Amount Collected
    { wch: 24 }, // Date & Time
    { wch: 18 }, // Receipt Photo
    { wch: 35 }  // Notes
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reconstruction Records");

  // Trigger browser download
  XLSX.writeFile(workbook, fileName);
}

/**
 * Parse uploaded Excel file for bulk import
 * @param {File} file 
 * @returns {Promise<Array>}
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

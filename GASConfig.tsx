
import React, { useState } from 'react';

const GASConfig: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const gasCode = `/**
 * MNJ & SCF Team - Advanced Google Apps Script Backend
 * Features: Log entry, ID-based updates, and data fetching.
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('MNJ & SCF Portal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Saves or updates a log entry. 
 * Looks for existing ID in Column A to decide between update or append.
 */
function processForm(formObject) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('MasterLogs') || ss.insertSheet('MasterLogs');
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Timestamp', 'Dept', 'Member', 'Description', 'Status', 'Metric']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#E2E8F0');
  }
  
  const data = sheet.getDataRange().getValues();
  let rowToEdit = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === formObject.id) {
      rowToEdit = i + 1;
      break;
    }
  }
  
  const rowData = [
    formObject.id,
    new Date(formObject.timestamp),
    formObject.category,
    formObject.teamMemberName,
    formObject.taskDescription,
    formObject.status,
    formObject.metricValue
  ];
  
  if (rowToEdit > -1) {
    sheet.getRange(rowToEdit, 1, 1, 7).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  
  return { status: 'success' };
}

function getTeamLogs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('MasterLogs');
  if (!sheet || sheet.getLastRow() < 2) return [];
  
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
  return values.map(r => ({
    id: r[0],
    timestamp: r[1],
    category: r[2],
    teamMemberName: r[3],
    taskDescription: r[4],
    status: r[5],
    metricValue: r[6]
  })).reverse();
}
`;

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Advanced Backend Setup</h3>
          <p className="text-xs text-slate-500">Supports Edit/Update functionality in Google Sheets.</p>
        </div>
        <button 
          onClick={() => { navigator.clipboard.writeText(gasCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
          className="bg-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
        >
          {copied ? 'Copied!' : 'Copy Code.gs'}
        </button>
      </div>
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 max-h-[400px] overflow-auto mono text-xs text-indigo-300">
        <pre>{gasCode}</pre>
      </div>
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 p-4 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
          <p className="text-xs text-indigo-300">The script now checks if a task ID exists and updates that specific row instead of creating a duplicate.</p>
        </div>
      </div>
    </div>
  );
};

export default GASConfig;

import React, { useState } from 'react';
import { X, FileSpreadsheet, Plus, Check } from 'lucide-react';
import { SpreadsheetRecord } from '../types/dashboard';

interface CreateSpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (record: Omit<SpreadsheetRecord, 'id' | 'lastUpdated' | 'updatedBy'>) => void;
}

export const CreateSpreadsheetModal: React.FC<CreateSpreadsheetModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Compliance');
  const [template, setTemplate] = useState('Blank');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a spreadsheet name.');
      return;
    }
    const cleanName = name.endsWith('.xlsx') ? name.trim() : `${name.trim()}.xlsx`;

    onCreate({
      name: cleanName,
      fileSize: '1.2 MB',
      recordsCount: template === 'Blank' ? 0 : 450,
      status: 'Active',
      department,
    });

    setName('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#E0E0DA] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#E0E0DA]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8FBF0] text-[#3F9A4B] border border-[#AAD39C]/40">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2E4A25]">
                Create New PMEx Spreadsheet
              </h3>
              <p className="text-xs text-[#505050]">
                Initialize workbook in PMEx repository
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#505050] hover:bg-[#F8FBF0] hover:text-[#2E4A25] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2E4A25] mb-1">
              Workbook Name <span className="text-[#3F9A4B]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Q4_Eligibility_Verification_Draft"
              className="w-full rounded-xl border border-[#E0E0DA] bg-[#F8FBF0] p-2.5 text-xs text-[#505050] focus:border-[#3F9A4B] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3F9A4B]"
            />
            {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2E4A25] mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-[#E0E0DA] bg-[#F8FBF0] p-2.5 text-xs text-[#505050] focus:border-[#3F9A4B] focus:bg-white focus:outline-none"
              >
                <option value="Compliance">Compliance</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Audit">Audit</option>
                <option value="Verification">Verification</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2E4A25] mb-1">
                Template Preset
              </label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full rounded-xl border border-[#E0E0DA] bg-[#F8FBF0] p-2.5 text-xs text-[#505050] focus:border-[#3F9A4B] focus:bg-white focus:outline-none"
              >
                <option value="Blank">Blank Workbook</option>
                <option value="Eligibility">Eligibility Matrix v3</option>
                <option value="Payout">Payout Reconciliation</option>
                <option value="Audit">Audit Log Template</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E0E0DA] bg-[#F8FBF0] p-3 text-[11px] text-[#505050]">
            <p className="font-semibold text-[#2E4A25]">Univer Spreadsheet Engine</p>
            <p className="mt-0.5">
              Workbooks are automatically synced to the PMEx backend database and tracked with full version history and cell change auditing.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E0E0DA] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E0E0DA] bg-white px-4 py-2 text-xs font-semibold text-[#505050] hover:bg-[#F8FBF0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#3F9A4B] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#34833e] transition-colors"
            >
              Create Workbook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

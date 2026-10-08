import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileCheck,
  FolderArchive,
  History,
  ShieldCheck,
  FileBarChart2,
  Search,
  Download,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Edit,
  FileText,
  Upload,
} from 'lucide-react';
import { PMExModuleId } from './DashboardSidebar';
import { SpreadsheetRecord, RecentActivityRecord } from '../types/dashboard';

interface ModuleViewsProps {
  activeModule: PMExModuleId;
  subItem?: string;
  onBackToDashboard: () => void;
  spreadsheets: SpreadsheetRecord[];
  onOpenCreateSpreadsheet: () => void;
  recentActivities: RecentActivityRecord[];
  onOpenActivityDetail: (activity: RecentActivityRecord) => void;
}

export const ModuleViews: React.FC<ModuleViewsProps> = ({
  activeModule,
  subItem,
  onBackToDashboard,
  spreadsheets,
  onOpenCreateSpreadsheet,
  recentActivities,
  onOpenActivityDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<SpreadsheetRecord | null>(null);

  const renderModuleHeader = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    actionBtn?: React.ReactNode
  ) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EDEAE0]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EDEAE0] bg-white text-[#676767] hover:text-[#2E4A25] hover:border-[#3F9A4B] transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#3F9A4B] border border-[#EDEAE0] shadow-2xs">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs text-[#959085]">
            <button onClick={onBackToDashboard} className="hover:text-[#3F9A4B]">
              Dashboard
            </button>
            <span>/</span>
            <span className="text-[#2E4A25] font-semibold">{title}</span>
            {subItem && (
              <>
                <span>/</span>
                <span className="text-[#3F9A4B] font-medium">{subItem}</span>
              </>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-[#2E4A25] tracking-tight">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2.5">{actionBtn}</div>
    </div>
  );

  // 1. ALL SPREADSHEETS
  if (activeModule === 'All Spreadsheets') {
    const filtered = spreadsheets.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.updatedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });

    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'All Spreadsheets',
          'Manage, audit, and collaborate on PMEx workbooks',
          <FileSpreadsheet className="h-5 w-5" />,
          <button
            type="button"
            onClick={onOpenCreateSpreadsheet}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2E4A25] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Spreadsheet</span>
          </button>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#959085]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by workbook name, department, or author..."
              className="w-full rounded-xl border border-[#D8DCE3] bg-white py-2 pl-9 pr-3 text-xs text-[#505050] focus:border-[#3F9A4B] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#EEF0E8] p-1 rounded-xl self-start">
            {['All', 'Active', 'Locked', 'Draft'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-[#3F9A4B] text-white shadow-2xs'
                    : 'text-[#676767] hover:text-[#2E4A25]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="pmex-floating-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#EDEAE0] bg-[#F8FBF0] text-[11px] font-bold text-[#2E4A25] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Workbook Name</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Records</th>
                  <th className="px-4 py-3.5">Size</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Last Updated</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEAE0]">
                {filtered.map((sheet) => (
                  <tr key={sheet.id} className="hover:bg-[#F8FBF0]/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8FBF0] text-[#3F9A4B] border border-[#EDEAE0]">
                          <FileSpreadsheet className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#2E4A25]">{sheet.name}</p>
                          <p className="text-[10px] text-[#959085]">Modified by {sheet.updatedBy}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#676767] font-medium">{sheet.department}</td>
                    <td className="px-4 py-4 font-mono text-[#2E4A25] font-semibold tabular-nums">
                      {sheet.recordsCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-mono text-[#676767] tabular-nums">{sheet.fileSize}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold text-[#2E4A25]">
                        {sheet.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#959085] tabular-nums">{sheet.lastUpdated}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSpreadsheet(sheet)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E0E0DA] text-[#676767] hover:text-[#3F9A4B] hover:border-[#3F9A4B] transition-colors"
                          title="Open in Univer Spreadsheet Engine"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E0E0DA] text-[#676767] hover:text-[#2E4A25] hover:border-[#2E4A25] transition-colors"
                          title="Download workbook"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedSpreadsheet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3316]/40 backdrop-blur-xs">
            <div className="relative w-full max-w-4xl h-[82vh] rounded-2xl border border-[#EDEAE0] bg-white p-6 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDEAE0]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3F9A4B] text-white">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2E4A25]">{selectedSpreadsheet.name}</h3>
                    <p className="text-xs text-[#676767]">Univer Spreadsheet Engine · {selectedSpreadsheet.department}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSpreadsheet(null)}
                  className="rounded-lg p-1 text-[#676767] hover:text-[#2E4A25]"
                >
                  ✕
                </button>
              </div>

              <div className="my-4 flex-1 overflow-auto border border-[#D8DCE3] rounded-xl bg-white">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead className="bg-[#F8FBF0] sticky top-0 border-b border-[#D8DCE3]">
                    <tr>
                      <th className="w-10 p-2 text-center border-r border-[#D8DCE3] text-[#959085]">#</th>
                      <th className="p-2 text-left border-r border-[#D8DCE3] text-[#2E4A25]">A: Applicant ID</th>
                      <th className="p-2 text-left border-r border-[#D8DCE3] text-[#2E4A25]">B: Full Name</th>
                      <th className="p-2 text-left border-r border-[#D8DCE3] text-[#2E4A25]">C: Eligibility Status</th>
                      <th className="p-2 text-left border-r border-[#D8DCE3] text-[#2E4A25]">D: Allocation</th>
                      <th className="p-2 text-left text-[#2E4A25]">E: Audit Checksum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'PMEX-8041', name: 'Robert Vance', status: 'Eligible', amount: '14,500.00', hash: 'e4f1a28c' },
                      { id: 'PMEX-8042', name: 'Maria Santos', status: 'Eligible', amount: '12,200.00', hash: 'c9d2f411' },
                      { id: 'PMEX-8043', name: 'Ahmed Al-Mansoor', status: 'Pending', amount: '8,400.00', hash: '88a109fe' },
                      { id: 'PMEX-8044', name: 'Catherine Dupond', status: 'Pending', amount: '19,800.00', hash: '14bc0891' },
                      { id: 'PMEX-8045', name: 'Vikram Sharma', status: 'Eligible', amount: '15,000.00', hash: 'f210ea57' },
                      { id: 'PMEX-8046', name: 'Elena Petrova', status: 'Rejected', amount: '0.00', hash: '33da4402' },
                    ].map((row, idx) => (
                      <tr key={row.id} className="border-b border-[#E8EAED] hover:bg-[#F8FBF0]">
                        <td className="p-2 text-center border-r border-[#E8EAED] text-[#959085] bg-[#F8FBF0]/50">{idx + 1}</td>
                        <td className="p-2 border-r border-[#E8EAED] font-semibold text-[#2E4A25]">{row.id}</td>
                        <td className="p-2 border-r border-[#E8EAED] text-[#505050]">{row.name}</td>
                        <td className="p-2 border-r border-[#E8EAED]">
                          <span className="text-[#3F9A4B] font-semibold">{row.status}</span>
                        </td>
                        <td className="p-2 border-r border-[#E8EAED] text-right font-semibold text-[#2E4A25]">{row.amount}</td>
                        <td className="p-2 text-[#959085]">{row.hash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EDEAE0] text-xs">
                <span className="text-[#959085]">Connected to Univer spreadsheet state</span>
                <button
                  type="button"
                  onClick={() => setSelectedSpreadsheet(null)}
                  className="rounded-xl bg-[#3F9A4B] px-4 py-2 text-xs font-semibold text-white"
                >
                  Save & Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. ELIGIBILITY MODULE (Strictly Eligible, Pending, Rejected)
  if (activeModule === 'Eligibility') {
    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'Eligibility',
          'Evaluate applicant batches against PMEx compliance rules',
          <FileCheck className="h-5 w-5" />,
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2E4A25] transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Run Batch Verification</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="pmex-floating-card p-5">
            <p className="text-xs text-[#676767] font-semibold">Eligible Records</p>
            <p className="text-2xl font-extrabold text-[#3F9A4B] mt-1 tabular-nums">1,420</p>
            <p className="text-[11px] text-[#959085] mt-1">77.1% of 1,842 total records</p>
          </div>
          <div className="pmex-floating-card p-5">
            <p className="text-xs text-[#676767] font-semibold">Pending Records</p>
            <p className="text-2xl font-extrabold text-[#2E4A25] mt-1 tabular-nums">364</p>
            <p className="text-[11px] text-[#959085] mt-1">19.8% awaiting review</p>
          </div>
          <div className="pmex-floating-card p-5">
            <p className="text-xs text-[#676767] font-semibold">Rejected Records</p>
            <p className="text-2xl font-extrabold text-[#D9713C] mt-1 tabular-nums">58</p>
            <p className="text-[11px] text-[#959085] mt-1">3.1% archived per policy</p>
          </div>
        </div>

        <div className="pmex-floating-card p-6">
          <h3 className="text-sm font-bold text-[#2E4A25]">Active Verification Rules</h3>
          <p className="text-xs text-[#676767] mt-0.5">PMEx compliance validation pipelines</p>

          <div className="mt-4 space-y-2.5">
            {[
              { title: '01. Identity Registry Validation', status: 'Active', rate: '99.8% match' },
              { title: '02. Threshold & Allocation Check', status: 'Active', rate: '96.2% pass' },
              { title: '03. Duplicate Submission Filter', status: 'Active', rate: '100% enforced' },
            ].map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FBF0] border border-[#EDEAE0]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#3F9A4B]" />
                  <span className="text-xs font-bold text-[#2E4A25]">{rule.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[11px] font-mono text-[#676767] tabular-nums">{rule.rate}</span>
                  <span className="text-xs font-semibold text-[#3F9A4B]">{rule.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. FILE MANAGER
  if (activeModule === 'File Manager') {
    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'File Manager',
          'Document repository, attachments, and compliance archives',
          <FolderArchive className="h-5 w-5" />,
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2E4A25] transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload File</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: '/Regulatory_Submissions', files: '42 files', size: '124 MB' },
            { name: '/Eligibility_Proof_Docs', files: '64 files', size: '480 MB' },
            { name: '/Spreadsheet_Exports', files: '22 files', size: '68 MB' },
          ].map((folder, idx) => (
            <div key={idx} className="pmex-floating-card p-4 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <FolderArchive className="h-5 w-5 text-[#3F9A4B]" />
                <span className="text-xs font-bold text-[#2E4A25]">{folder.name}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#959085]">
                <span>{folder.files}</span>
                <span className="font-mono tabular-nums">{folder.size}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pmex-floating-card p-6">
          <h3 className="text-sm font-bold text-[#2E4A25]">Recent Uploads</h3>
          <div className="mt-4 divide-y divide-[#EDEAE0]">
            {[
              { name: 'Ministry_Compliance_Cert_Oct.pdf', size: '4.8 MB', date: 'Today at 08:00 AM', user: 'David Chen' },
              { name: 'Eligibility_Batch_Summary_Sep.csv', size: '1.2 MB', date: 'Yesterday at 04:12 PM', user: 'Sarah Jenkins' },
              { name: 'Audit_Trail_Export_Q3.zip', size: '18.4 MB', date: 'Sep 29, 2026', user: 'Super Admin' },
            ].map((f, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-[#3F9A4B]" />
                  <div>
                    <p className="font-bold text-[#2E4A25]">{f.name}</p>
                    <p className="text-[10px] text-[#959085]">Uploaded by {f.user}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#676767]">
                  <span className="font-mono tabular-nums">{f.size}</span>
                  <span className="tabular-nums text-[#959085]">{f.date}</span>
                  <button className="text-[#3F9A4B] hover:text-[#2E4A25] font-semibold">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. HISTORY
  if (activeModule === 'History') {
    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'History',
          'Complete audit trail of PMEx Portal user actions',
          <History className="h-5 w-5" />,
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDEAE0] bg-white px-4 py-2.5 text-xs font-semibold text-[#2E4A25] hover:bg-[#F8FBF0] transition-colors"
          >
            <Download className="h-4 w-4 text-[#3F9A4B]" />
            <span>Export Audit CSV</span>
          </button>
        )}

        <div className="pmex-floating-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FBF0] border-b border-[#EDEAE0] text-[11px] font-bold text-[#2E4A25] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Resource</th>
                <th className="px-4 py-3.5">Module</th>
                <th className="px-4 py-3.5">Time</th>
                <th className="px-5 py-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEAE0]">
              {recentActivities.map((act) => (
                <tr key={act.id} className="hover:bg-[#F8FBF0]/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-[#2E4A25]">{act.user}</td>
                  <td className="px-4 py-3.5 text-[#505050]">{act.action}</td>
                  <td className="px-4 py-3.5 font-medium text-[#2E4A25]">{act.resourceName}</td>
                  <td className="px-4 py-3.5 text-[#676767]">{act.module}</td>
                  <td className="px-4 py-3.5 text-[#959085] tabular-nums">{act.timeAgo}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenActivityDetail(act)}
                      className="text-[#3F9A4B] font-semibold hover:underline"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 5. REPORTING
  if (activeModule === 'Reporting') {
    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'Reporting',
          'Executive summaries and compliance exports',
          <FileBarChart2 className="h-5 w-5" />,
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2E4A25] transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { title: 'Monthly Executive Summary', freq: 'Monthly', desc: 'Overview of all eligibility decisions and spreadsheet modifications.' },
            { title: 'Spreadsheet Audit Reconciliation', freq: 'Weekly', desc: 'Cell-level modifications, formula integrity, and multi-user revisions.' },
            { title: 'Eligibility Status Register', freq: 'Realtime', desc: 'Breakdown of Eligible, Pending, and Rejected records.' },
          ].map((rep, idx) => (
            <div key={idx} className="pmex-floating-card p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F9A20]">
                  {rep.freq}
                </span>
                <h4 className="mt-2 text-sm font-bold text-[#2E4A25]">{rep.title}</h4>
                <p className="mt-1 text-xs text-[#676767] leading-relaxed">{rep.desc}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#EDEAE0] flex items-center justify-between text-xs">
                <span className="text-[#959085]">PDF / XLSX</span>
                <button className="text-[#3F9A4B] font-semibold hover:text-[#2E4A25]">
                  Export →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. ADMIN PANEL
  if (activeModule === 'Admin Panel') {
    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'Admin Panel',
          'User accounts, permissions, and portal settings',
          <ShieldCheck className="h-5 w-5" />,
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2E4A25] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        )}

        <div className="pmex-floating-card p-6">
          <h3 className="text-sm font-bold text-[#2E4A25]">Portal Users (24 Total · 3 Super Admins)</h3>
          <div className="mt-4 divide-y divide-[#EDEAE0] text-xs">
            {[
              { name: 'Super Admin', email: 'admin@pmex-portal.internal', role: 'Super Admin', status: 'Active' },
              { name: 'Sarah Jenkins', email: 's.jenkins@pmex-portal.internal', role: 'Compliance Lead', status: 'Active' },
              { name: 'David Chen', email: 'd.chen@pmex-portal.internal', role: 'Operations Analyst', status: 'Active' },
              { name: 'Elena Rostova', email: 'e.rostova@pmex-portal.internal', role: 'Reporting Specialist', status: 'Active' },
            ].map((u, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2E4A25]">{u.name}</p>
                  <p className="text-[11px] text-[#959085]">{u.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2.5 py-1 rounded-lg bg-[#EEF0E8] text-[#2A3828] font-semibold">
                    {u.role}
                  </span>
                  <span className="text-[#3F9A4B] font-semibold">{u.status}</span>
                  <button className="text-[#3F9A4B] font-semibold hover:text-[#2E4A25]">
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

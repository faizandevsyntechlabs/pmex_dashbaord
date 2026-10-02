import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileCheck,
  FolderArchive,
  History,
  ShieldCheck,
  FileBarChart2,
  Search,
  Filter,
  Download,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Trash2,
  Edit,
  Shield,
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
  onOpenSpreadsheetEditor?: (sheet: SpreadsheetRecord) => void;
}

export const ModuleViews: React.FC<ModuleViewsProps> = ({
  activeModule,
  subItem,
  onBackToDashboard,
  spreadsheets,
  onOpenCreateSpreadsheet,
  recentActivities,
  onOpenActivityDetail,
  onOpenSpreadsheetEditor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<SpreadsheetRecord | null>(null);

  // Common Header for modules
  const renderModuleHeader = (title: string, subtitle: string, icon: React.ReactNode, actionBtn?: React.ReactNode) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E0E0DA]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E0E0DA] bg-white text-[#505050] hover:text-[#2E4A25] hover:border-[#3F9A4B] transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FBF0] text-[#3F9A4B] border border-[#AAD39C]/40">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs text-[#505050]">
            <button onClick={onBackToDashboard} className="hover:text-[#3F9A4B]">Dashboard</button>
            <span>/</span>
            <span className="text-[#2E4A25] font-semibold">{title}</span>
            {subItem && (
              <>
                <span>/</span>
                <span className="text-[#3F9A4B]">{subItem}</span>
              </>
            )}
          </div>
          <h2 className="text-xl font-bold text-[#2E4A25] tracking-tight">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {actionBtn}
      </div>
    </div>
  );

  // 1. ALL SPREADSHEETS MODULE
  if (activeModule === 'All Spreadsheets') {
    const filtered = spreadsheets.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#34833e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Spreadsheet</span>
          </button>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#505050]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by sheet name, department, or modifier..."
              className="w-full rounded-xl border border-[#E0E0DA] bg-white py-2 pl-9 pr-3 text-xs text-[#505050] focus:border-[#3F9A4B] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#505050] font-medium">Status:</span>
            {['All', 'Active', 'Locked', 'Draft'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-[#3F9A4B] text-white shadow-xs'
                    : 'bg-white border border-[#E0E0DA] text-[#505050] hover:text-[#2E4A25]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Spreadsheets Table */}
        <div className="overflow-hidden rounded-3xl border border-[#E0E0DA] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E0E0DA] bg-[#F8FBF0] text-[11px] font-bold text-[#2E4A25] uppercase tracking-wider">
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
              <tbody className="divide-y divide-[#E0E0DA]/70">
                {filtered.map((sheet) => (
                  <tr key={sheet.id} className="hover:bg-[#F8FBF0]/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8FBF0] text-[#3F9A4B] border border-[#AAD39C]/40">
                          <FileSpreadsheet className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#2E4A25]">{sheet.name}</p>
                          <p className="text-[10px] text-[#505050]">Modified by {sheet.updatedBy}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#505050] font-medium">{sheet.department}</td>
                    <td className="px-4 py-4 font-mono text-[#2E4A25] font-semibold tabular-nums">
                      {sheet.recordsCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-mono text-[#505050] tabular-nums">{sheet.fileSize}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        sheet.status === 'Active'
                          ? 'bg-[#3F9A4B]/10 text-[#3F9A4B]'
                          : sheet.status === 'Locked'
                          ? 'bg-neutral-100 text-neutral-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {sheet.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#505050] tabular-nums">{sheet.lastUpdated}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSpreadsheet(sheet)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E0E0DA] text-[#505050] hover:text-[#3F9A4B] hover:border-[#3F9A4B] transition-colors"
                          title="Open in Univer Editor"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E0E0DA] text-[#505050] hover:text-[#2E4A25] hover:border-[#2E4A25] transition-colors"
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

        {/* In-Portal Spreadsheet Preview Drawer / Modal */}
        {selectedSpreadsheet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-4xl h-[85vh] rounded-3xl border border-[#E0E0DA] bg-white p-6 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#E0E0DA]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3F9A4B] text-white">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2E4A25]">{selectedSpreadsheet.name}</h3>
                    <p className="text-xs text-[#505050]">PMEx Spreadsheet Engine · {selectedSpreadsheet.department}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSpreadsheet(null)}
                  className="rounded-lg p-1 text-[#505050] hover:text-[#2E4A25]"
                >
                  ✕
                </button>
              </div>

              {/* Mock interactive spreadsheet grid */}
              <div className="my-4 flex-1 overflow-auto border border-[#E0E0DA] rounded-2xl bg-white">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead className="bg-[#F8FBF0] sticky top-0 border-b border-[#E0E0DA]">
                    <tr>
                      <th className="w-10 p-2 text-center border-r border-[#E0E0DA] text-[#505050]">#</th>
                      <th className="p-2 text-left border-r border-[#E0E0DA] text-[#2E4A25]">A: Applicant ID</th>
                      <th className="p-2 text-left border-r border-[#E0E0DA] text-[#2E4A25]">B: Full Legal Name</th>
                      <th className="p-2 text-left border-r border-[#E0E0DA] text-[#2E4A25]">C: Verification Status</th>
                      <th className="p-2 text-left border-r border-[#E0E0DA] text-[#2E4A25]">D: Department Grant ($)</th>
                      <th className="p-2 text-left text-[#2E4A25]">E: Last Audit Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'PMEX-8041', name: 'Robert Vance', status: 'Eligible', amount: '14,500.00', hash: 'e4f1a28c' },
                      { id: 'PMEX-8042', name: 'Maria Santos', status: 'Eligible', amount: '12,200.00', hash: 'c9d2f411' },
                      { id: 'PMEX-8043', name: 'Ahmed Al-Mansoor', status: 'Pending', amount: '8,400.00', hash: '88a109fe' },
                      { id: 'PMEX-8044', name: 'Catherine Dupond', status: 'Under Review', amount: '19,800.00', hash: '14bc0891' },
                      { id: 'PMEX-8045', name: 'Vikram Sharma', status: 'Eligible', amount: '15,000.00', hash: 'f210ea57' },
                      { id: 'PMEX-8046', name: 'Elena Petrova', status: 'Eligible', amount: '11,350.00', hash: '33da4402' },
                    ].map((row, idx) => (
                      <tr key={row.id} className="border-b border-[#E0E0DA]/70 hover:bg-[#F8FBF0]">
                        <td className="p-2 text-center border-r border-[#E0E0DA] text-[#505050] bg-[#F8FBF0]/40">{idx + 1}</td>
                        <td className="p-2 border-r border-[#E0E0DA] font-semibold text-[#2E4A25]">{row.id}</td>
                        <td className="p-2 border-r border-[#E0E0DA] text-[#505050]">{row.name}</td>
                        <td className="p-2 border-r border-[#E0E0DA]">
                          <span className="text-[#3F9A4B] font-semibold">{row.status}</span>
                        </td>
                        <td className="p-2 border-r border-[#E0E0DA] text-right font-semibold text-[#2E4A25]">{row.amount}</td>
                        <td className="p-2 text-[#505050]">{row.hash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E0E0DA] text-xs">
                <span className="text-[#505050]">Live connection to Univer spreadsheet backend</span>
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

  // 2. ELIGIBILITY MODULE
  if (activeModule === 'Eligibility') {
    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'Eligibility Verification',
          'Evaluate applicant batches against compliance criteria',
          <FileCheck className="h-5 w-5" />,
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#34833e] transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Run Batch Verification</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#E0E0DA] bg-white p-4">
            <p className="text-xs text-[#505050] font-semibold uppercase">Total Evaluated</p>
            <p className="text-2xl font-black text-[#2E4A25] mt-1 tabular-nums">1,842</p>
            <p className="text-[11px] text-[#3F9A4B] mt-1 font-medium">+124 this week</p>
          </div>
          <div className="rounded-2xl border border-[#E0E0DA] bg-white p-4">
            <p className="text-xs text-[#505050] font-semibold uppercase">Eligible</p>
            <p className="text-2xl font-black text-[#3F9A4B] mt-1 tabular-nums">1,420</p>
            <p className="text-[11px] text-[#505050] mt-1">77.1% success rate</p>
          </div>
          <div className="rounded-2xl border border-[#E0E0DA] bg-white p-4">
            <p className="text-xs text-[#505050] font-semibold uppercase">Pending Documents</p>
            <p className="text-2xl font-black text-[#AAD39C] mt-1 tabular-nums">246</p>
            <p className="text-[11px] text-[#505050] mt-1">Awaiting applicant action</p>
          </div>
          <div className="rounded-2xl border border-[#E0E0DA] bg-white p-4">
            <p className="text-xs text-[#505050] font-semibold uppercase">Under Review</p>
            <p className="text-2xl font-black text-[#2E4A25] mt-1 tabular-nums">118</p>
            <p className="text-[11px] text-[#505050] mt-1">Manual officer sign-off</p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E0E0DA] bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#2E4A25]">Active Verification Rules</h3>
          <p className="text-xs text-[#505050] mt-0.5">PMEx compliance validation engines</p>

          <div className="mt-4 space-y-3">
            {[
              { title: 'Rule 01: Tax ID & Identity Registry Validation', status: 'Active', rate: '99.8% match' },
              { title: 'Rule 02: Income & Asset Threshold Check', status: 'Active', rate: '96.2% pass' },
              { title: 'Rule 03: Cross-Program Disqualification Duplicate Filter', status: 'Active', rate: '100% enforced' },
              { title: 'Rule 04: Regional Jurisdiction Residency Compliance', status: 'Active', rate: '98.5% pass' },
            ].map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FBF0] border border-[#E0E0DA]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#3F9A4B]" />
                  <span className="text-xs font-bold text-[#2E4A25]">{rule.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[11px] font-mono text-[#505050]">{rule.rate}</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#3F9A4B] text-white rounded-md">
                    {rule.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. FILE MANAGER MODULE
  if (activeModule === 'File Manager') {
    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'File Manager',
          'Document vault, attachments, and compliance archives',
          <FolderArchive className="h-5 w-5" />,
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#34833e] transition-colors"
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
            <div key={idx} className="p-4 rounded-2xl border border-[#E0E0DA] bg-white hover:border-[#3F9A4B] transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <FolderArchive className="h-5 w-5 text-[#3F9A4B]" />
                <span className="text-xs font-bold text-[#2E4A25]">{folder.name}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#505050]">
                <span>{folder.files}</span>
                <span className="font-mono">{folder.size}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-[#E0E0DA] bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#2E4A25]">Recent Uploads</h3>
          <div className="mt-4 divide-y divide-[#E0E0DA]/70">
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
                    <p className="text-[10px] text-[#505050]">Uploaded by {f.user}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#505050]">
                  <span className="font-mono">{f.size}</span>
                  <span className="tabular-nums">{f.date}</span>
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

  // 4. HISTORY MODULE
  if (activeModule === 'History') {
    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'History & Audit Log',
          'Complete immutable operational trail of system events',
          <History className="h-5 w-5" />,
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E0E0DA] bg-white px-4 py-2.5 text-xs font-semibold text-[#2E4A25] hover:bg-[#F8FBF0] transition-colors"
          >
            <Download className="h-4 w-4 text-[#3F9A4B]" />
            <span>Export CSV Audit</span>
          </button>
        )}

        <div className="rounded-3xl border border-[#E0E0DA] bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FBF0] border-b border-[#E0E0DA] text-[11px] font-bold text-[#2E4A25] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Actor</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Target Resource</th>
                <th className="px-4 py-3.5">Module</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0DA]/70">
              {recentActivities.map((act) => (
                <tr key={act.id} className="hover:bg-[#F8FBF0]/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-[#2E4A25]">{act.user}</td>
                  <td className="px-4 py-3.5 text-[#505050]">{act.action}</td>
                  <td className="px-4 py-3.5 font-medium text-[#2E4A25]">{act.resourceName}</td>
                  <td className="px-4 py-3.5">
                    <span className="bg-[#F8FBF0] border border-[#E0E0DA] text-[#2E4A25] px-2 py-0.5 rounded-md font-medium text-[10px]">
                      {act.module}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[#505050] font-mono tabular-nums">{act.timestamp}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenActivityDetail(act)}
                      className="text-[#3F9A4B] font-semibold hover:underline"
                    >
                      Inspect
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

  // 5. REPORTING MODULE
  if (activeModule === 'Reporting') {
    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'Reporting & Analytics',
          'Automated executive reports and compliance exports',
          <FileBarChart2 className="h-5 w-5" />,
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#34833e] transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Generate Executive Report</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { title: 'Monthly Executive Summary', freq: 'Monthly', desc: 'Overview of all eligibility decisions and financial payout distributions.' },
            { title: 'Spreadsheet Audit Reconciliation', freq: 'Weekly', desc: 'Cell level modifications, formula integrity, and multi-user revisions.' },
            { title: 'Compliance Discrepancy Register', freq: 'Realtime', desc: 'Flagged submissions requiring ministerial oversight and justification.' },
          ].map((rep, idx) => (
            <div key={idx} className="rounded-3xl border border-[#E0E0DA] bg-white p-5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F9A4B] bg-[#F8FBF0] px-2 py-0.5 rounded border border-[#E0E0DA]">
                  {rep.freq}
                </span>
                <h4 className="mt-3 text-sm font-bold text-[#2E4A25]">{rep.title}</h4>
                <p className="mt-1 text-xs text-[#505050] leading-relaxed">{rep.desc}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E0E0DA] flex items-center justify-between text-xs">
                <span className="text-[#505050]">PDF / XLSX Export</span>
                <button className="text-[#3F9A4B] font-semibold hover:text-[#2E4A25]">
                  Download →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. ADMIN PANEL MODULE
  if (activeModule === 'Admin Panel') {
    return (
      <div className="space-y-6">
        {renderModuleHeader(
          'Admin Panel',
          'Role-based access control, security policies, and system config',
          <ShieldCheck className="h-5 w-5" />,
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#34833e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        )}

        <div className="rounded-3xl border border-[#E0E0DA] bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#2E4A25]">System User Accounts (24 Total)</h3>
          <div className="mt-4 divide-y divide-[#E0E0DA]/70 text-xs">
            {[
              { name: 'Super Admin', email: 'admin@pmex-portal.internal', role: 'Super Admin', status: 'Active', mfa: 'Enforced' },
              { name: 'Sarah Jenkins', email: 's.jenkins@pmex-portal.internal', role: 'Compliance Lead', status: 'Active', mfa: 'Enforced' },
              { name: 'David Chen', email: 'd.chen@pmex-portal.internal', role: 'Operations Analyst', status: 'Active', mfa: 'Enforced' },
              { name: 'Elena Rostova', email: 'e.rostova@pmex-portal.internal', role: 'Reporting Specialist', status: 'Active', mfa: 'Enforced' },
            ].map((u, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2E4A25]">{u.name}</p>
                  <p className="text-[11px] text-[#505050]">{u.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-0.5 rounded-md bg-[#F8FBF0] text-[#2E4A25] font-semibold border border-[#E0E0DA]">
                    {u.role}
                  </span>
                  <span className="text-[#3F9A4B] font-medium">{u.status}</span>
                  <button className="text-[#3F9A4B] font-semibold hover:text-[#2E4A25]">
                    Manage
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

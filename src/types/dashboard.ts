export type TimeRange = '7d' | '30d' | '90d';

export type ActivityModule = 'spreadsheets' | 'eligibility' | 'files' | 'admin' | 'reporting' | 'all';

export interface StatMetric {
  id: string;
  label: string;
  value: number | string;
  formattedValue: string;
  secondaryValue?: string;
  sublabel: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  ringProgress: number; // 0 to 100 for the top-right radial indicator
  timeframe: string;
  iconName: 'file-text' | 'clipboard-check' | 'users' | 'table-cells' | 'shield-check';
  badgeNote?: string;
  targetModule: string;
}

export interface ActivityDataPoint {
  dayLabel: string;
  dateStr: string;
  total: number;
  spreadsheets: number;
  eligibility: number;
  files: number;
}

export interface EligibilityStatusData {
  status: 'Eligible' | 'Pending' | 'Rejected';
  count: number;
  percentage: number;
  color: string;
  description: string;
}

export interface RecentActivityRecord {
  id: string;
  user: string;
  userRole: string;
  avatarUrl?: string;
  action: string;
  resourceName: string;
  module: 'Spreadsheets' | 'Eligibility' | 'File Manager' | 'Admin Panel' | 'Reporting';
  timeAgo: string;
  timestamp: string;
  status: 'success' | 'pending' | 'updated';
  metadata?: Record<string, string>;
}

export interface SpreadsheetRecord {
  id: string;
  name: string;
  fileSize: string;
  recordsCount: number;
  lastUpdated: string;
  updatedBy: string;
  status: 'Active' | 'Locked' | 'Draft';
  department: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

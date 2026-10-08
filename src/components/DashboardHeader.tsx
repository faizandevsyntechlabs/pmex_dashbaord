import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  LogOut,
  Shield,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import avatarAdmin from '../assets/images/avatar_super_admin_1790968185971.jpg';
import { NotificationItem } from '../types/dashboard';

interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenCreateSpreadsheet: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  userRole?: string;
  userName?: string;
  onNavigateToModule?: (module: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenMobileMenu,
  onOpenCreateSpreadsheet,
  notifications,
  onMarkNotificationRead,
  onSearch,
  searchQuery,
  userName = 'Super Admin',
  userRole = 'System Administrator',
  onNavigateToModule,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-[#EDEAE0] bg-white/90 px-4 md:px-8 backdrop-blur-md transition-all">
      {/* Left Zone: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#2E4A25] hover:bg-[#F8FBF0] lg:hidden focus-visible:outline-2 focus-visible:outline-[#3F9A4B]"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-[#959085]">
            <span className="truncate">PMEx Portal</span>
            <span className="text-[#E0E0DA]">/</span>
            <span className="text-[#2E4A25] font-semibold">Dashboard</span>
          </div>
          <span className="text-xs text-[#676767] truncate hidden sm:inline">
            Spreadsheets, eligibility records & audit history
          </span>
        </div>
      </div>

      {/* Center Zone: Clean Search Input */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#959085]">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search spreadsheets, eligibility records, or users..."
            className="w-full rounded-2xl border border-[#D8DCE3] bg-[#F8FBF0] py-2 pl-10 pr-8 text-xs text-[#505050] placeholder:text-[#959085] transition-colors focus:border-[#3F9A4B] focus:bg-white focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearch('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#959085] hover:text-[#505050]"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Zone: Primary Action, Notifications & User Profile */}
      <div className="flex items-center gap-2.5 md:gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenCreateSpreadsheet}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[#2E4A25] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#3F9A4B] whitespace-nowrap"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Create Spreadsheet</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="View notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#EDEAE0] bg-white text-[#676767] hover:border-[#AAD39C] hover:text-[#2E4A25] transition-colors focus-visible:outline-2 focus-visible:outline-[#3F9A4B]"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3F9A4B] px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-[#EDEAE0] bg-white p-3.5 shadow-xl z-50">
              <div className="flex items-center justify-between px-1 pb-2.5 border-b border-[#EDEAE0]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2E4A25]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-[#3F9A4B] tabular-nums">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => notifications.forEach((n) => onMarkNotificationRead(n.id))}
                  className="text-[11px] font-semibold text-[#3F9A4B] hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="mt-2 max-h-72 overflow-y-auto space-y-1.5">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onMarkNotificationRead(notif.id)}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                      notif.read
                        ? 'bg-transparent hover:bg-[#F8FBF0]'
                        : 'bg-[#F8FBF0] border border-[#EDEAE0]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[#2E4A25] leading-snug">
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-[#959085] tabular-nums shrink-0">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#676767] mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            className="flex items-center gap-2.5 rounded-2xl border border-[#EDEAE0] bg-white p-1 pr-3 hover:border-[#AAD39C] transition-colors focus-visible:outline-2 focus-visible:outline-[#3F9A4B]"
          >
            <div className="relative h-8 w-8 rounded-xl overflow-hidden bg-[#F8FBF0] shrink-0">
              <img
                src={avatarAdmin}
                alt={userName}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="hidden text-left xl:block">
              <p className="text-xs font-bold leading-none text-[#2E4A25]">{userName}</p>
              <p className="text-[10px] leading-tight text-[#959085] mt-0.5">{userRole}</p>
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-[#959085]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#EDEAE0] bg-white p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-[#EDEAE0]">
                <p className="text-xs font-bold text-[#2E4A25]">{userName}</p>
                <p className="text-[11px] text-[#676767]">{userRole}</p>
              </div>

              <div className="mt-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigateToModule?.('Admin Panel');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#505050] hover:text-[#2E4A25] hover:bg-[#F8FBF0] rounded-xl transition-colors text-left"
                >
                  <Shield className="h-3.5 w-3.5 text-[#3F9A4B]" />
                  <span>Admin Panel</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigateToModule?.('All Spreadsheets');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#505050] hover:text-[#2E4A25] hover:bg-[#F8FBF0] rounded-xl transition-colors text-left"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-[#3F9A4B]" />
                  <span>All Spreadsheets</span>
                </button>
              </div>

              <div className="mt-1 pt-1 border-t border-[#EDEAE0]">
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#676767] hover:text-[#2E4A25] hover:bg-[#F8FBF0] rounded-xl transition-colors text-left"
                >
                  <LogOut className="h-3.5 w-3.5 text-[#959085]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

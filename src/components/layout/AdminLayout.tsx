import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Activity, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const AdminLayout: React.FC = () => {
  const { members, schedules, activeTrainer } = useGym();

  const redListCount = members.filter(m => m.trangThai === 'DANH_SACH_DO').length;
  const pendingCancelCount = schedules.filter(s => s.trangThai === 'CHO_DUYET_HUY').length;

  const links = [
    {
      to: '/admin/dashboard',
      label: 'Tổng Quan & Điều Hành',
      icon: LayoutDashboard,
      badge: redListCount > 0 ? `${redListCount} Cần thu` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    {
      to: '/admin/members',
      label: 'Quản Lý Học Viên',
      icon: Users,
      badge: `${members.length} HV`
    },
    {
      to: '/admin/schedule',
      label: 'Lịch Hẹn PT 1-kèm-1',
      icon: Calendar,
      badge: pendingCancelCount > 0 ? `${pendingCancelCount} Chờ duyệt` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      to: '/admin/therapy',
      label: 'Hồ Sơ Nắn Chỉnh & Cột Sống',
      icon: Activity,
      highlight: true
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-72 lg:w-80 shrink-0 bg-white border-r border-slate-100/90 p-5 lg:p-6 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Active Trainer Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-100 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={activeTrainer.avatar}
                alt={activeTrainer.hoTen}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  Đang Đăng Nhập
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">{activeTrainer.hoTen}</h4>
                <p className="text-[11px] text-slate-500 truncate">{activeTrainer.vaiTro}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-100/60 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
              <span>Trụ sở Trảng Bom</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Trực tuyến
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">
              Chức Năng Quản Trị
            </p>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold translate-x-1'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : link.badgeColor || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                      {link.highlight && !link.badge && (
                        <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-amber-500'}`} />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

        </div>

        {/* Quick Kiosk Callout at bottom */}
        <div className="mt-8 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-emerald-400">Chế Độ Điểm Danh Kiosk</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Mở màn hình Kiosk Tiếp Tân toàn màn hình cho tablet đặt tại quầy lễ tân.
            </p>
            <a
              href="/kiosk"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 rounded-xl transition-colors w-full justify-center shadow-xs"
            >
              <span>Mở Màn Hình Kiosk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Admin Page Content */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

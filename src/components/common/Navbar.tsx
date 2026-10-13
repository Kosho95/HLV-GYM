import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  LayoutDashboard, 
  Store, 
  UserCheck, 
  RotateCcw, 
  MapPin, 
  ChevronDown,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { activeTrainer, trainers, setActiveTrainer, resetToMockData } = useGym();
  const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);

  const navItems = [
    { path: '/', label: 'Cổng Chào', icon: Activity },
    { path: '/admin/dashboard', label: 'Quản Trị HLV', icon: LayoutDashboard },
    { path: '/kiosk', label: 'Kiosk Tiếp Tân', icon: Store, badge: 'Quầy' },
    { path: '/student', label: 'Cổng Hội Viên', icon: UserCheck }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Gym Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  HLV<span className="text-emerald-600">GYM</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <MapPin className="w-2.5 h-2.5" /> Trảng Bom
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Thể Hình & Nắn Chỉnh Cột Sống Phục Hồi
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-white text-emerald-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-100 text-emerald-700 uppercase">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Switcher */}
          <div className="flex items-center gap-2.5">
            
            {/* Trainer Switcher for Cross-Approval */}
            <div className="relative">
              <button
                onClick={() => setShowTrainerDropdown(!showTrainerDropdown)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all text-left"
                title="Đổi vai trò HLV để kiểm thử duyệt chéo ca tập"
              >
                <img
                  src={activeTrainer.avatar}
                  alt={activeTrainer.hoTen}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-800">{activeTrainer.hoTen}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{activeTrainer.vaiTro}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {showTrainerDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowTrainerDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Phân Quyền & Duyệt Chéo (02 HLV)
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Chọn tài khoản HLV để thao tác phê duyệt ca hẹn:
                      </p>
                    </div>

                    {trainers.map((t) => {
                      const isSelected = t.id === activeTrainer.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setActiveTrainer(t);
                            setShowTrainerDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                            isSelected
                              ? 'bg-emerald-50/80 text-emerald-950 font-medium'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <img
                            src={t.avatar}
                            alt={t.hoTen}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-800">{t.hoTen}</p>
                              {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{t.vaiTro}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Reset Mock Data button */}
            <button
              onClick={resetToMockData}
              className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-transparent hover:border-emerald-100"
              title="Khôi phục dữ liệu mẫu gốc ban đầu để chấm điểm/kiểm thử"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-white/95 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2 text-[11px] font-semibold transition-colors ${
                active ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};

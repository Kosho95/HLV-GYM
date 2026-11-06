import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  LayoutDashboard, 
  Store, 
  UserCheck, 
  RotateCcw, 
  MapPin, 
  ChevronDown,
  ShieldCheck,
  Check,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { SunMoonSwitch } from './SunMoonSwitch';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    activeTrainer, 
    trainers, 
    setActiveTrainer, 
    resetToMockData,
    currentUser,
    logout
  } = useGym();
  
  const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);

  // Dynamic Navigation Items based on current role
  const getNavItems = () => {
    if (currentUser.role === 'TRAINER') {
      return [
        { path: '/', label: 'Trang Chủ', icon: Activity },
        { path: '/admin/dashboard', label: 'Bảng Điều Hành HLV', icon: LayoutDashboard },
        { path: '/student', label: 'Xem Cổng Học Viên', icon: UserCheck },
        { path: '/kiosk', label: 'Kiosk Tiếp Tân', icon: Store, badge: 'Tablet' }
      ];
    }
    if (currentUser.role === 'STUDENT') {
      return [
        { path: '/', label: 'Trang Chủ', icon: Activity },
        { path: '/student', label: 'Cổng Học Viên Cá Nhân', icon: UserCheck, badge: 'E-Card' },
        { path: '/kiosk', label: 'Kiosk Tiếp Tân', icon: Store, badge: 'Tablet' }
      ];
    }
    // GUEST mode
    return [
      { path: '/', label: 'Trang Chủ', icon: Activity },
      { path: '/kiosk', label: 'Kiosk Quầy', icon: Store, badge: 'Tablet' }
    ];
  };

  const navItems = getNavItems();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setShowTrainerDropdown(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Gym Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900 tracking-tight">
                  HLV<span className="text-emerald-700">GYM</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <MapPin className="w-2.5 h-2.5" /> Trảng Bom
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Thể Hình &bull; Nắn Chỉnh Cột Sống &bull; Sống Khỏe
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-white text-emerald-800 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Role State */}
          <div className="flex items-center gap-2.5">
            
            {/* Animated Sun/Moon Light/Dark Switch */}
            <SunMoonSwitch size="md" />

            {/* 1. GUEST MODE: Show Login Button */}
            {currentUser.role === 'GUEST' && (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </Link>
            )}

            {/* 2. TRAINER MODE: Show Trainer Profile & Dropdown Switcher */}
            {currentUser.role === 'TRAINER' && (
              <div className="relative">
                <button
                  onClick={() => setShowTrainerDropdown(!showTrainerDropdown)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs text-left"
                >
                  <img
                    src={activeTrainer.avatar}
                    alt={activeTrainer.hoTen}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-600/30"
                  />
                  <div className="hidden lg:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800">{activeTrainer.hoTen}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
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
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Đang Đăng Nhập Quản Trị
                        </p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">
                          {activeTrainer.hoTen} ({activeTrainer.id})
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Đổi nhanh tài khoản HLV để kiểm thử duyệt chéo ca hẹn:
                        </p>
                      </div>

                      <div className="space-y-1">
                        {trainers.map((t) => {
                          const isSelected = t.id === activeTrainer.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                setActiveTrainer(t);
                                setShowTrainerDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left text-xs ${
                                isSelected
                                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <img src={t.avatar} alt={t.hoTen} className="w-8 h-8 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="truncate">{t.hoTen}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                </div>
                                <span className="text-[10px] text-slate-400 block truncate">{t.vaiTro}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng Xuất Khỏi Ban Quản Trị</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 3. STUDENT MODE: Show Student Pill & Logout Button */}
            {currentUser.role === 'STUDENT' && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 py-1 px-3 rounded-xl">
                <img
                  src={currentUser.member?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                  alt={currentUser.member?.hoTen}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-emerald-900 line-clamp-1">
                    {currentUser.member?.hoTen}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    Hội Viên ({currentUser.member?.id})
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-1 p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                  title="Đăng xuất khỏi tài khoản học viên"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Reset Mock Data button */}
            <button
              onClick={resetToMockData}
              className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-transparent hover:border-emerald-100"
              title="Khôi phục dữ liệu mẫu gốc ban đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2 text-[11px] font-semibold transition-colors ${
                active ? 'text-emerald-700 font-bold' : 'text-slate-500'
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

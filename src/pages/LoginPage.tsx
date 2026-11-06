import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Activity, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Phone, 
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useGym } from '../context/GymContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trainers, members, loginTrainer, loginStudent, currentUser } = useGym();

  // Tab: 'STUDENT' or 'TRAINER'
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'TRAINER'>('STUDENT');

  // Student Form State
  const [studentIdOrPhone, setStudentIdOrPhone] = useState<string>('HV005');
  const [studentPassword, setStudentPassword] = useState<string>('123456');

  // Trainer Form State
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>(trainers[0]?.id || 'HLV01');
  const [trainerPassword, setTrainerPassword] = useState<string>('admin123');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handle student submission
  const handleStudentLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (!studentIdOrPhone.trim()) {
      setErrorMessage('Vui lòng nhập Mã học viên (VD: HV001) hoặc Số điện thoại');
      return;
    }
    const success = loginStudent(studentIdOrPhone);
    if (success) {
      navigate('/student');
    } else {
      setErrorMessage('Không tìm thấy học viên với mã hoặc SĐT này. Vui lòng kiểm tra lại!');
    }
  };

  // Handle trainer submission
  const handleTrainerLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const success = loginTrainer(selectedTrainerId);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại!');
    }
  };

  // Quick 1-click login handler for examiners/demo
  const handleQuickLogin = (type: 'TRAINER_QUAN' | 'TRAINER_THAI' | 'STUDENT_TUAN' | 'STUDENT_BINH') => {
    setErrorMessage('');
    if (type === 'TRAINER_QUAN') {
      loginTrainer('HLV01');
      navigate('/admin/dashboard');
    } else if (type === 'TRAINER_THAI') {
      loginTrainer('HLV02');
      navigate('/admin/dashboard');
    } else if (type === 'STUDENT_TUAN') {
      loginStudent('HV005');
      navigate('/student');
    } else if (type === 'STUDENT_BINH') {
      loginStudent('HV002');
      navigate('/student');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex flex-col items-center group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-sm mb-3">
            <Activity className="w-7 h-7" />
          </div>
          <h2 className="text-center text-2xl font-black text-slate-900 tracking-tight">
            HLV<span className="text-emerald-700">GYM</span> &bull; TRẢNG BOM
          </h2>
          <p className="text-center text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Hệ thống Huấn luyện &amp; Nắn chỉnh Cột sống Trảng Bom
          </p>
        </Link>

        {/* Tab Switcher: Student vs Trainer */}
        <div className="mt-8 bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-300/60">
          <button
            type="button"
            onClick={() => { setActiveTab('STUDENT'); setErrorMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'STUDENT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Dành Cho Học Viên</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('TRAINER'); setErrorMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'TRAINER'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Ban Quản Trị / HLV</span>
          </button>
        </div>

      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-3xl sm:px-10">
          
          {/* Error alert */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: STUDENT LOGIN FORM */}
          {activeTab === 'STUDENT' && (
            <form onSubmit={handleStudentLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mã Học Viên Hoặc Số Điện Thoại
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={studentIdOrPhone}
                    onChange={(e) => setStudentIdOrPhone(e.target.value)}
                    placeholder="VD: HV005 hoặc 0901234567"
                    className="w-full py-3 px-4 text-sm font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <UserCheck className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Nhập mã thẻ E-Card hoặc số điện thoại đã đăng ký tại phòng tập.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mật Khẩu / Mã PIN (Mặc định: 123456)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    className="w-full py-3 px-4 text-sm font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors"
              >
                <span>Vào Cổng Học Viên</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Chưa có thẻ hội viên? Vui lòng đến <Link to="/kiosk" className="text-emerald-700 font-bold hover:underline">Quầy Kiosk</Link> hoặc liên hệ 02 HLV để ghi danh.
              </div>
            </form>
          )}

          {/* TAB 2: TRAINER LOGIN FORM */}
          {activeTab === 'TRAINER' && (
            <form onSubmit={handleTrainerLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Chọn Tài Khoản Huấn Luyện Viên
                </label>
                <div className="space-y-2">
                  {trainers.map((t) => (
                    <label
                      key={t.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedTrainerId === t.id
                          ? 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-600'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={t.avatar} alt={t.hoTen} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{t.hoTen}</div>
                          <div className="text-[11px] text-slate-500">{t.vaiTro}</div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="trainerSelect"
                        checked={selectedTrainerId === t.id}
                        onChange={() => setSelectedTrainerId(t.id)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mật Khẩu Quản Trị
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={trainerPassword}
                    onChange={(e) => setTrainerPassword(e.target.value)}
                    placeholder="Mật khẩu HLV..."
                    className="w-full py-3 px-4 text-sm font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mặc định kiểm thử: <span className="font-mono text-emerald-800 font-bold">admin123</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Đăng Nhập Vào Bảng Điều Hành</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Login Bar for Examiners */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Đăng Nhập Nhanh 1-Chạm (Dành Cho Hội Đồng Chấm):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('TRAINER_QUAN')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-left border border-slate-200 flex items-center gap-2 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                <span className="truncate">HLV Võ Minh Quân (Quản Trị)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('TRAINER_THAI')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-left border border-slate-200 flex items-center gap-2 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>
                <span className="truncate">HLV Quốc Thái (Trị Liệu)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('STUDENT_TUAN')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-left border border-emerald-200 flex items-center gap-2 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                <span className="truncate">Học Viên Tuấn (Bệnh án VAS)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('STUDENT_BINH')}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-left border border-amber-200 flex items-center gap-2 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0"></span>
                <span className="truncate">Học Viên Bình (Danh Sách Đỏ)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


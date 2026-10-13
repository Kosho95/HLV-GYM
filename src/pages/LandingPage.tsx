import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  LayoutDashboard, 
  Store, 
  UserCheck, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Award, 
  Sparkles,
  Wifi,
  CalendarCheck
} from 'lucide-react';
import { useGym } from '../context/GymContext';

export const LandingPage: React.FC = () => {
  const { trainers, members } = useGym();
  const redCount = members.filter(m => m.trangThai === 'DANH_SACH_DO').length;

  return (
    <div className="flex-1 bg-gradient-to-b from-white via-slate-50 to-slate-100">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
        {/* Subtle Decorative Background Rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute -top-32 right-1/4 w-[450px] h-[450px] bg-teal-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Badge & Slogan */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-xs mb-6 animate-in fade-in zoom-in duration-300">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Hệ Thống Độc Lập - Trảng Bom, Đồng Nai</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-emerald-700 font-semibold">Đội ngũ 02 HLV Chuyên Môn</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Rèn Thể Lực &bull; <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Nắn Chỉnh Cột Sống</span> &bull; Sống Khỏe
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Nền tảng quản lý phòng tập thể hình kết hợp phục hồi chức năng cơ xương khớp thông minh.
              Vận hành khép kín, minh bạch thẻ tập và lịch hẹn PT tại khu vực Trảng Bom.
            </p>

            {/* Quick stats pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Chống gian lận Wi-Fi Kiosk
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs font-semibold">
                <CalendarCheck className="w-4 h-4 text-emerald-600" /> Phê duyệt chéo hủy lịch & Hoàn slot bù
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs font-semibold">
                <Activity className="w-4 h-4 text-emerald-600" /> Hồ sơ nắn chỉnh Before/After chuẩn VAS
              </span>
            </div>
          </div>

          {/* 3 Main Entry Cards - Spacious, Clean, Big Targets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            
            {/* 1. Admin Management Card */}
            <div className="relative group bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Bảng Điều Hành HLV
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Ban Quản Trị
                  </span>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Dành riêng cho 02 Huấn luyện viên: Theo dõi Danh Sách Đỏ cần thu phí, duyệt chéo hủy lịch PT và ghi nhận phác đồ nắn chỉnh.
                </p>

                <div className="space-y-2 mb-8 text-xs font-semibold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span>Tổng hội viên quản lý:</span>
                    <span className="font-bold text-emerald-700">{members.length} học viên</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cần thu phí gấp (≤ 3 ngày):</span>
                    <span className={`font-bold ${redCount > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                      {redCount} trường hợp
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/admin/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all duration-200 group-hover:shadow-emerald-600/20"
              >
                <span>Vào Trang Quản Trị</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 2. Self-service Kiosk Card */}
            <div className="relative group bg-white rounded-3xl p-8 border-2 border-emerald-500/50 shadow-md hover:shadow-2xl hover:border-emerald-600 transition-all duration-300 flex flex-col justify-between ring-4 ring-emerald-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                Màn Hình Tiếp Tân Độc Lập
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-xs mt-2">
                  <Store className="w-7 h-7" />
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Kiosk Tiếp Tân Quầy
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                    Tablet Quầy
                  </span>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Điểm danh tự phục vụ 1-chạm bằng bàn phím số ảo. Bắn pháo hoa Confetti, phát chuông Ting-ting và cảnh báo nợ phí tự động.
                </p>

                <div className="space-y-2 mb-8 text-xs font-semibold text-slate-700 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Xác thực Wi-Fi nội bộ Trảng Bom</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pháo hoa mừng check-in thành công</span>
                  </div>
                </div>
              </div>

              <Link
                to="/kiosk"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all duration-200"
              >
                <span>Mở Màn Hình Kiosk Quầy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3. Student Portal Card */}
            <div className="relative group bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 shadow-xs">
                  <UserCheck className="w-7 h-7" />
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Cổng Tra Cứu Hội Viên
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                    Khách Hàng
                  </span>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Thẻ tập điện tử E-Card tích hợp mã QR, theo dõi hành trình nắn chỉnh Before/After, kiểm tra số ca tập bù và giáo án tại nhà.
                </p>

                <div className="space-y-2 mb-8 text-xs font-semibold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span>Thẻ tập điện tử:</span>
                    <span className="text-sky-700 font-bold">QR Cá nhân tiện lợi</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bài tập bổ trợ:</span>
                    <span className="text-emerald-700 font-bold">Cat-cow, Plank, Bird-dog</span>
                  </div>
                </div>
              </div>

              <Link
                to="/student"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all duration-200 group-hover:shadow-emerald-600/20"
              >
                <span>Vào Cổng Hội Viên</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Trainers & Facility Overview Section */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100">
                Đội Ngũ Phụ Trách Chuyên Môn
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                02 Huấn Luyện Viên Trực Tiếp Vận Hành Tại Trảng Bom
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 md:mt-0 max-w-md">
              Mô hình độc lập tinh gọn: kết hợp giữa giáo án phát triển cơ bắp và chuyên môn y khoa nắn chỉnh sai lệch tư thế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trainers.map((trainer) => (
              <div 
                key={trainer.id}
                className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/70 hover:border-emerald-200 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-6 items-start"
              >
                <img
                  src={trainer.avatar}
                  alt={trainer.hoTen}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md shrink-0"
                />
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {trainer.vaiTro}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{trainer.kinhNghiem}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{trainer.hoTen}</h3>
                  
                  <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>{trainer.chuyenMon}</span>
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {trainer.moTa}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trainer.soDienThoai}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Trảng Bom, Đồng Nai</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer Info */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">HLV GYM</span>
            <span className="text-slate-600">&bull;</span>
            <span>Đồ án Tốt nghiệp CNTT - Hệ thống Quản lý Phòng tập & Huấn luyện viên Phục hồi</span>
          </div>
          <p className="text-slate-500">
            Trảng Bom, Tỉnh Đồng Nai &bull; Vận hành thực tế 2026
          </p>
        </div>
      </footer>

    </div>
  );
};

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
  CalendarCheck,
  Clock,
  Dumbbell,
  HeartPulse,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  QrCode,
  FileText
} from 'lucide-react';
import { useGym } from '../context/GymContext';

export const LandingPage: React.FC = () => {
  const { trainers, members } = useGym();
  const redCount = members.filter(m => m.trangThai === 'DANH_SACH_DO').length;
  const activeMembersCount = members.filter(m => m.trangThai === 'DANG_TAP').length;

  return (
    <div className="flex-1 bg-slate-50 text-slate-800 antialiased">
      
      {/* 1. Top Notice Bar - Real Local Context */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" /> Thị trấn Trảng Bom, Đồng Nai
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400">Giờ hoạt động: 05:30 - 10:30 &amp; 14:30 - 20:30 (Thứ 2 - Thứ 7)</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-slate-400">Hotline hỗ trợ: <strong className="text-white">0901.234.567</strong></span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Phòng tập đang mở cửa
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section - Human-crafted Editorial Layout */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Activity className="w-4 h-4 text-emerald-700" />
                <span>Cơ Sở Huấn Luyện Thể Hình &amp; Nắn Chỉnh Cột Sống Trảng Bom</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.2]">
                Tập Luyện Thể Lực &amp; <br />
                <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">
                  Phục Hồi Cột Sống
                </span> Chuyên Sâu
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Hệ thống phòng tập độc lập do <strong>02 Huấn luyện viên chuyên môn</strong> trực tiếp vận hành.
                Kết hợp giữa giáo án phát triển cơ bắp cá nhân hóa và phương pháp nắn chỉnh sai lệch tư thế, thoát vị, gù vẹo cột sống chuẩn y khoa.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/student"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all duration-150"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Cổng Tra Cứu Hội Viên (E-Card)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/kiosk"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition-all duration-150"
                >
                  <Store className="w-4 h-4 text-emerald-700" />
                  <span>Màn Hình Kiosk Điểm Danh Quầy</span>
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all duration-150"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Đăng Nhập HLV / Hội Viên</span>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-slate-700 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium">Chống gian lận Wi-Fi Kiosk</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium">Hoàn slot hủy lịch trước 2h</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium">Bệnh án nắn chỉnh chuẩn VAS</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Operational Snapshot */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Bảng Trạng Thái Vận Hành
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      Cơ Sở Trảng Bom Hôm Nay
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Trực Tuyến
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500">Hội viên đang tập:</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      {activeMembersCount} <span className="text-xs font-normal text-slate-500">người</span>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500">Danh sách đỏ (cần thu):</span>
                    <div className={`text-2xl font-black mt-1 ${redCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {redCount} <span className="text-xs font-normal text-slate-500">hội viên</span>
                    </div>
                  </div>
                </div>

                {/* 2 Trainers mini bar */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">Đội ngũ HLV trực tiếp phụ trách:</span>
                  
                  {trainers.map((t) => (
                    <div key={t.id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src={t.avatar} alt={t.hoTen} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-slate-900">{t.hoTen}</div>
                          <div className="text-[11px] text-slate-500">{t.vaiTro}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Có mặt
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                  <Link
                    to="/admin/dashboard"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                  >
                    Xem chi tiết bảng điều hành nội bộ <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Three Functional Portals (Clear, Practical Cards) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
              Hệ Thống Phân Quyền Vận Hành
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              03 Lối Vào Phục Vụ Đúng Đối Tượng
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Thiết kế độc lập, bảo mật và đáp ứng đầy đủ nghiệp vụ phòng tập tại Trảng Bom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Kiosk Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-500 hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
                  <Store className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">1. Kiosk Tiếp Tân Quầy</h3>
                  <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    Màn Hình Quầy
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Học viên tự điểm danh 1 chạm bằng mã HV hoặc nhận diện khuôn mặt Face ID. Bắn pháo hoa và phát chuông báo khi hợp lệ.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Nhận diện Face ID &amp; Bàn phím số
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Báo động nợ phí / danh sách đỏ
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Khóa ngoài IP Wi-Fi nội bộ
                  </li>
                </ul>
              </div>
              <Link
                to="/kiosk"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <span>Mở Giao Diện Kiosk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Student Portal Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-500 hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-5">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">2. Cổng Tra Cứu Hội Viên</h3>
                  <span className="text-[10px] font-bold uppercase bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
                    Khách Hàng
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Thẻ hội viên điện tử E-Card tích hợp mã QR quét quầy, hồ sơ nắn chỉnh cột sống Before/After và ngân hàng bài tập tại nhà.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Thẻ E-Card &amp; QR cá nhân
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Theo dõi điểm đau cột sống VAS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Gia hạn gói qua chuyển khoản VietQR
                  </li>
                </ul>
              </div>
              <Link
                to="/student"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <span>Vào Cổng Hội Viên</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Admin Dashboard Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-500 hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">3. Bảng Điều Hành 02 HLV</h3>
                  <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                    Nội Bộ HLV
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Dành riêng cho HLV Võ Minh Quân và HLV Nguyễn Quốc Thái: Phê duyệt chéo hủy lịch PT, kiểm soát thu nợ và quản lý bệnh án.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Phê duyệt chéo hủy ca &amp; hoàn slot bù
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Kiểm soát Danh Sách Đỏ cần thu phí
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Ghi nhận hình ảnh thước đo cột sống
                  </li>
                </ul>
              </div>
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <span>Vào Bảng Điều Hành HLV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Real Packages & Pricing (Tangible Evidence of Real Business) */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
              Bảng Phí Niêm Yết
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Gói Tập &amp; Trị Liệu Minh Bạch Tại Cơ Sở
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Không chi phí ẩn, chính sách gia hạn và hoàn slot rõ ràng theo quy định phòng tập.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Gói HSSV */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã Gói: GYM01-SV</div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Học Sinh - Sinh Viên</h3>
                <p className="text-xs text-slate-600 mt-2">Áp dụng cho học sinh, sinh viên ĐH Đồng Nai và các trường lân cận Trảng Bom.</p>
                <div className="my-6">
                  <span className="text-3xl font-black text-slate-900">250.000</span>
                  <span className="text-xs font-semibold text-slate-500"> đ / tháng</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Tập không giới hạn buổi trong tháng
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Điểm danh tự động tại Kiosk quầy
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Tủ gửi đồ cá nhân miễn phí
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <span className="w-4 h-4 inline-block text-center">&bull;</span> Cần xuất trình thẻ HSSV khi đăng ký
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200">
                <Link
                  to="/student"
                  className="block text-center py-2.5 px-4 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-100"
                >
                  Đăng Ký / Tra Cứu
                </Link>
              </div>
            </div>

            {/* Gói Đi Làm */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã Gói: GYM01-DL</div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Người Đi Làm / Tự Do</h3>
                <p className="text-xs text-slate-600 mt-2">Dành cho công nhân viên, kỹ sư KCN Bàu Xéo và cư dân khu vực Trảng Bom.</p>
                <div className="my-6">
                  <span className="text-3xl font-black text-slate-900">300.000</span>
                  <span className="text-xs font-semibold text-slate-500"> đ / tháng</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Tập toàn bộ khung giờ sáng &amp; chiều
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Thẻ hội viên điện tử E-Card tích hợp QR
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Hướng dẫn khởi động cơ bản với HLV
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Chuyển khoản VietQR tự động gia hạn
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200">
                <Link
                  to="/student"
                  className="block text-center py-2.5 px-4 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-100"
                >
                  Đăng Ký / Tra Cứu
                </Link>
              </div>
            </div>

            {/* Gói Nắn Chỉnh Trị Liệu - Nổi bật */}
            <div className="bg-emerald-50/60 rounded-2xl p-6 border-2 border-emerald-600 flex flex-col justify-between relative shadow-sm">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Chuyên Môn Đặc Thù
              </span>
              <div>
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Mã Gói: TL01-VIP</div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Trị Liệu &amp; Nắn Chỉnh Cột Sống</h3>
                <p className="text-xs text-slate-600 mt-2">Kèm 1-1 với HLV Nguyễn Quốc Thái. Phục hồi sai lệch đốt sống, thoái hóa, giảm đau mỏi.</p>
                <div className="my-6">
                  <span className="text-3xl font-black text-emerald-800">1.500.000</span>
                  <span className="text-xs font-semibold text-slate-600"> đ / tháng</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-800 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /> 12 buổi kèm 1-1 trực tiếp với HLV Trị liệu
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /> Hồ sơ bệnh án Before/After chuẩn VAS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /> Chính sách hoàn slot bù khi báo bận trước 2h
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /> Giáo án phục hồi tại nhà (Cat-cow, Plank...)
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-emerald-200">
                <Link
                  to="/student"
                  className="block text-center py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                >
                  Đặt Ca Tư Vấn &amp; Trị Liệu
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. 4-Step Chiropractic & Rehab Protocol */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
              Quy Trình Khoa Học
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              04 Bước Tiếp Nhận &amp; Nắn Chỉnh Cột Sống
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Đảm bảo an toàn, đúng chỉ định chuyên môn và theo dõi cải thiện rõ rệt theo từng buổi tập.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center mb-3">
                01
              </span>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">Khảo Sát Sai Lệch Tư Thế</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đo góc lệch vai, độ cong sinh lý cột sống thắt lưng qua lưới tọa độ Posture Grid chuyên dụng.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center mb-3">
                02
              </span>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">Đánh Giá Thang Điểm Đau VAS</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ghi nhận chỉ số đau từ mức 1 (nhẹ) đến 10 (cấp tính), lập hồ sơ điện tử theo dõi theo từng tuần.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center mb-3">
                03
              </span>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">Nắn Chỉnh &amp; Tập PT 1-1</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kéo dãn giải áp cơ co cứng, nắn chỉnh khớp và tập bổ trợ nhóm cơ lõi (core) giữ vững cột sống.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center mb-3">
                04
              </span>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">Giáo Án Bổ Trợ Tại Nhà</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cấp video hướng dẫn động tác Cat-cow, Bird-dog, tư thế ngồi làm việc chuẩn tránh tái phát đau.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Real Trainers Team Section */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
                Ban Quản Trị &amp; Huấn Luyện
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                02 Huấn Luyện Viên Trực Tiếp Đứng Lớp Tại Trảng Bom
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 md:mt-0 max-w-md">
              Mô hình tinh gọn, tận tâm. Mỗi học viên đều được theo sát bởi chính người sáng lập phòng tập.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainers.map((trainer) => (
              <div 
                key={trainer.id}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row gap-5 items-start"
              >
                <img
                  src={trainer.avatar}
                  alt={trainer.hoTen}
                  className="w-24 h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                      {trainer.vaiTro}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{trainer.kinhNghiem}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{trainer.hoTen}</h3>
                  
                  <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 shrink-0 text-emerald-700" />
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

      {/* 7. Footer - Authentic Local Capstone Project Footer */}
      <footer className="py-10 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-white font-black text-base">
                <Activity className="w-5 h-5 text-emerald-500" />
                <span>HLV GYM TRẢNG BOM</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Đồ án Tốt nghiệp ngành Công nghệ Thông tin — Nhóm DOULINGO.
                Khảo sát hiện trạng và số hóa quy trình quản lý phòng tập thể hình kết hợp phục hồi chức năng cột sống.
              </p>
            </div>

            <div>
              <div className="font-bold text-white text-sm mb-2">Địa Chỉ &amp; Liên Hệ</div>
              <p className="text-slate-400 leading-relaxed">
                Cơ sở phòng tập: Thị trấn Trảng Bom, Huyện Trảng Bom, Tỉnh Đồng Nai.<br />
                Đường dây nóng: 0901.234.567 (HLV Võ Minh Quân) &bull; 0907.654.321 (HLV Nguyễn Quốc Thái)
              </p>
            </div>

            <div>
              <div className="font-bold text-white text-sm mb-2">Quy Định &amp; Cam Kết</div>
              <ul className="space-y-1 text-slate-400">
                <li>&bull; Điểm danh quầy tự động qua Wi-Fi nội bộ</li>
                <li>&bull; Hủy lịch trước 2 giờ được bảo lưu và hoàn slot bù</li>
                <li>&bull; Minh bạch thẻ tập E-Card không lo thất lạc</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <p>&copy; 2026 Nhóm DOULINGO — HLV GYM Trảng Bom. Tất cả quyền được bảo lưu.</p>
            <p>Hệ thống vận hành thực tế tại phòng tập Trảng Bom, Đồng Nai.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

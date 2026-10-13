import React, { useState } from 'react';
import { 
  Users, 
  AlertOctagon, 
  Calendar, 
  Clock, 
  Send, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Sparkles,
  PhoneCall, 
  DollarSign,
  UserX,
  MessageSquare,
  X
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { HocVien, LichHenPT } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    members, 
    schedules, 
    checkInLogs, 
    activeTrainer, 
    renewMember, 
    approveCancelSchedule,
    getDaysRemaining
  } = useGym();

  // State for Zalo ZNS Preview Modal
  const [znsModalMember, setZnsModalMember] = useState<HocVien | null>(null);
  const [znsSentSuccess, setZnsSentSuccess] = useState(false);

  // Compute stats
  const activeMembers = members.filter(m => m.trangThai === 'DANG_TAP');
  const redListMembers = members.filter(m => m.trangThai === 'DANH_SACH_DO');
  const expiredMembers = members.filter(m => m.trangThai === 'HET_HAN');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySchedules = schedules.filter(s => s.ngay === todayStr);
  const pendingCancelSchedules = schedules.filter(s => s.trangThai === 'CHO_DUYET_HUY');

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleSendZns = () => {
    setZnsSentSuccess(true);
    setTimeout(() => {
      setZnsSentSuccess(false);
      setZnsModalMember(null);
    }, 1800);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Welcome & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Hệ Thống Trực Tuyến &bull; Phòng Tập Trảng Bom
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bảng Điều Hành & Vận Hành HLV
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xin chào <strong className="text-slate-800">{activeTrainer.hoTen}</strong>. Theo dõi học viên nợ phí, phê duyệt dời ca và quản lý dòng tiền.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{members.length} Học viên đăng ký</span>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Đang tập */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Học Viên Đang Tập</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{activeMembers.length}</h3>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <span>Đang hoạt động tốt</span>
            </span>
          </div>
        </div>

        {/* KPI 2: Danh Sách Đỏ */}
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full pointer-events-none" />
          <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Danh Sách Đỏ (≤ 3 ngày)</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{redListMembers.length}</h3>
            <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
              Cần thu phí gia hạn
            </span>
          </div>
        </div>

        {/* KPI 3: PT Hôm nay */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ca PT Trị Liệu Hôm Nay</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{todaySchedules.length}</h3>
            <span className="text-[11px] text-sky-700 font-semibold mt-0.5 block">
              Ca 1-kèm-1 theo lịch
            </span>
          </div>
        </div>

        {/* KPI 4: Chờ Duyệt Hủy Ca */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chờ Duyệt Hủy Lịch</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{pendingCancelSchedules.length}</h3>
            <span className="text-[11px] text-rose-700 font-semibold mt-0.5 block">
              Cần HLV duyệt chéo
            </span>
          </div>
        </div>

      </div>

      {/* Row 1: Widget Danh Sách Đỏ & Widget Chờ Duyệt Hủy Lịch PT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Widget 1: Danh Sách Đỏ Cần Thu Phí (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Danh Sách Đỏ Cần Thu Phí
                    {redListMembers.length > 0 && (
                      <span className="px-2 py-0.5 text-xs font-black rounded-full bg-rose-100 text-rose-700 animate-pulse">
                        {redListMembers.length}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">Hội viên còn ≤ 3 ngày hoặc đã hết hạn cần gửi nhắc nhở & xác nhận thu</p>
                </div>
              </div>

              <span className="text-xs font-semibold text-slate-500">
                Ưu tiên vận hành
              </span>
            </div>

            {/* List of Red Members */}
            {redListMembers.length === 0 && expiredMembers.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-900">Không có hội viên trong Danh Sách Đỏ!</p>
                <p className="text-xs text-emerald-700 mt-1">Tất cả hội viên đều còn hạn tập luyện trên 3 ngày.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...redListMembers, ...expiredMembers].map((member) => {
                  const days = getDaysRemaining(member.ngayHetHan);
                  const isExpired = days < 0;

                  return (
                    <div
                      key={member.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-100 hover:border-amber-200 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={member.avatar}
                          alt={member.hoTen}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-2xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{member.hoTen}</span>
                            <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {member.id}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                              {member.nhom === 'HSSV' ? 'Học sinh / SV' : 'Đi làm'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1 font-medium text-slate-600">
                              <PhoneCall className="w-3 h-3 text-slate-400" />
                              {member.soDienThoai}
                            </span>
                            <span>&bull;</span>
                            <span className="font-semibold text-emerald-700">
                              Gói: {member.goiTap === 'GYM01' ? 'Gym tự do' : 'PT Trị liệu 1:1'}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                                isExpired
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isExpired ? `Đã quá hạn ${Math.abs(days)} ngày` : `Còn đúng ${days} ngày`}
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              Cần thu: <strong className="text-slate-900">{formatVND(member.soTienGoi)}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons: Zalo ZNS and 1-Click Renew */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => setZnsModalMember(member)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1.5"
                          title="Xem trước và gửi thông báo Zalo ZNS"
                        >
                          <Send className="w-3.5 h-3.5 text-sky-600" />
                          <span>Gửi ZNS</span>
                        </button>

                        <button
                          onClick={() => renewMember(member.id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                          title="Xác nhận học viên đã thanh toán, gia hạn +30 ngày"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã thu tiền (+30d)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>💡 Quy tắc: Còn ≤ 3 ngày tự động chuyển Danh Sách Đỏ</span>
            <span className="font-semibold text-emerald-700">1-Chạm gia hạn lập tức</span>
          </div>
        </div>

        {/* Widget 2: Phê Duyệt Hủy Lịch PT & Hoàn Slot Bù (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Yêu Cầu Hủy Lịch PT
                    {pendingCancelSchedules.length > 0 && (
                      <span className="px-2 py-0.5 text-xs font-black rounded-full bg-amber-100 text-amber-800">
                        {pendingCancelSchedules.length}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">Phê duyệt chéo giữa 02 HLV & tự động bù slot</p>
                </div>
              </div>
            </div>

            {pendingCancelSchedules.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Hiện không có ca hẹn nào xin hoãn/hủy</p>
                <p className="text-xs text-slate-500 mt-1">Tất cả lịch tập 1-1 đều diễn ra bình thường.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCancelSchedules.map((req) => {
                  const isValidNotice = (req.soGioBaoTruoc || 0) >= 2;

                  return (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl border border-amber-200/80 bg-amber-50/40 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{req.tenHV}</span>
                            <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                              {req.maHV}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            HLV phụ trách: <strong>{req.tenHLV}</strong>
                          </p>
                        </div>

                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-800">
                          {req.khungGio} &bull; {req.ngay}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                        <div className="text-slate-700">
                          <span className="font-semibold text-slate-500">Lý do xin hủy:</span> {req.lyDoHuy || 'Bận việc đột xuất'}
                        </div>
                        <div className="text-slate-700">
                          <span className="font-semibold text-slate-500">Thời gian báo:</span> Báo trước <strong>{req.soGioBaoTruoc} tiếng</strong>
                        </div>
                        <div className="pt-1">
                          {isValidNotice ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Hợp lệ quy chế (≥ 2 tiếng) &bull; Được hoàn 1 slot
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                              <AlertOctagon className="w-3 h-3 text-rose-600" /> Báo muộn (&lt; 2 tiếng) &bull; Cần cân nhắc override
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Approval buttons */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => approveCancelSchedule(req.id, false)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
                        >
                          Từ chối
                        </button>

                        <button
                          onClick={() => approveCancelSchedule(req.id, true, !isValidNotice)}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Duyệt & Hoàn +1 Slot Bù</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            <span>🛡️ Cơ chế: Cả 02 HLV ({activeTrainer.hoTen}) đều có thẩm quyền duyệt chéo.</span>
          </div>
        </div>

      </div>

      {/* Row 2: Live Realtime Check-in Log Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Nhật Ký Check-in Tiếp Tân Realtime
              </h3>
              <p className="text-xs text-slate-500">
                Các lượt quét mã và nhập thẻ gần nhất từ màn hình Kiosk Quầy Trảng Bom
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Live Feed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Học Viên</th>
                <th className="pb-3 px-3">Mã HV</th>
                <th className="pb-3 px-3">Gói Tập</th>
                <th className="pb-3 px-3">Thời Gian</th>
                <th className="pb-3 px-3">Tình Trạng Hạn Thẻ</th>
                <th className="pb-3 px-3 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {checkInLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={log.avatar}
                        alt={log.tenHV}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-900">{log.tenHV}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-600">
                    {log.maHV}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {log.goiTap === 'GYM01' ? 'Gym Tự Do' : 'PT Trị Liệu'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-medium">
                    {log.thoiGian}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {log.ghiChu}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {log.hopLe ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Hợp lệ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                        <XCircle className="w-3 h-3 text-rose-600" /> Hết hạn
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zalo ZNS Message Preview Modal */}
      {znsModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setZnsModalMember(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Xem Trước Thông Báo Zalo ZNS
                </h3>
                <p className="text-xs text-slate-500">Mẫu thông báo tự động gửi tới số {znsModalMember.soDienThoai}</p>
              </div>
            </div>

            {/* ZNS Phone preview card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <span className="font-bold text-sky-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span> Zalo Official Account: HLV GYM Trảng Bom
                </span>
                <span className="text-[10px] text-slate-400">Đã xác thực tick vàng</span>
              </div>

              <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                <p className="font-semibold text-slate-900">
                  Kính gửi Hội viên <strong className="text-emerald-700">{znsModalMember.hoTen}</strong> ({znsModalMember.id}),
                </p>
                <p>
                  Gói tập <strong>{znsModalMember.goiTap === 'GYM01' ? 'Gym Tự Do' : 'PT Trị Liệu'}</strong> của bạn tại phòng tập HLV GYM Trảng Bom sẽ hết hạn vào ngày <strong>{znsModalMember.ngayHetHan}</strong> (còn <strong>{Math.max(0, getDaysRemaining(znsModalMember.ngayHetHan))} ngày</strong>).
                </p>
                <p>
                  Mức phí gia hạn tháng tiếp theo của bạn là: <strong className="text-slate-900">{formatVND(znsModalMember.soTienGoi)}</strong>.
                </p>
                <p className="text-slate-500 italic">
                  Vui lòng liên hệ HLV Võ Minh Quân hoặc chuyển khoản trực tiếp tại quầy tiếp tân để giữ ưu đãi và tiếp tục duy trì phác đồ tập luyện.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setZnsModalMember(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy Bỏ
              </button>

              <button
                onClick={handleSendZns}
                disabled={znsSentSuccess}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 shadow-md ${
                  znsSentSuccess ? 'bg-emerald-600' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20'
                }`}
              >
                {znsSentSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã Gửi ZNS Thành Công!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Tin Nhắn Zalo Ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

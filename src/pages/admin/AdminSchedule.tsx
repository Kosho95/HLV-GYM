import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  X,
  User, 
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { LichHenPT, TrangThaiLichHen } from '../../types';

export const AdminSchedule: React.FC = () => {
  const { 
    schedules, 
    trainers, 
    members, 
    activeTrainer, 
    createSchedule, 
    approveCancelSchedule 
  } = useGym();

  const [selectedTrainerFilter, setSelectedTrainerFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new appointment
  const todayStr = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    maHV: members[0]?.id || 'HV001',
    maHLV: trainers[0]?.id || 'HLV01',
    ngay: todayStr,
    khungGio: '08:00 - 09:30',
    noiDungTap: 'Nắn chỉnh giải áp thắt lưng & Phục hồi cơ cốt lõi'
  });

  const timeSlots = [
    '06:30 - 08:00',
    '08:00 - 09:30',
    '09:30 - 11:00',
    '14:00 - 15:30',
    '15:30 - 17:00',
    '17:30 - 19:00',
    '19:00 - 20:30'
  ];

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = members.find(m => m.id === formData.maHV);
    const trainer = trainers.find(t => t.id === formData.maHLV);

    if (!student || !trainer) return;

    const res = createSchedule({
      maHV: student.id,
      tenHV: student.hoTen,
      maHLV: trainer.id,
      tenHLV: trainer.hoTen,
      ngay: formData.ngay,
      khungGio: formData.khungGio,
      trangThai: 'DAT_THANH_CONG',
      noiDungTap: formData.noiDungTap
    });

    if (res.success) {
      setShowAddModal(false);
    }
  };

  // Filter schedules
  const filteredSchedules = schedules.filter(s => {
    if (selectedTrainerFilter === 'ALL') return true;
    return s.maHLV === selectedTrainerFilter;
  });

  const getStatusBadge = (status: TrangThaiLichHen) => {
    switch (status) {
      case 'DAT_THANH_CONG':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đặt thành công
          </span>
        );
      case 'CHO_DUYET_HUY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Chờ duyệt hủy
          </span>
        );
      case 'DA_DUYET_HUY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <Check className="w-3.5 h-3.5 text-slate-400" /> Đã duyệt hủy (Hoàn slot)
          </span>
        );
      case 'HOAN_TAT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Đã hoàn tất ca
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Lịch Hẹn PT 1-kèm-1
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xếp lịch ca tập cho 02 HLV &bull; Tránh trùng ca & Phê duyệt dời lịch hoàn slot bù tự động.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Đặt Lịch PT Mới</span>
        </button>
      </div>

      {/* Filter by Trainer tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Lọc theo Huấn luyện viên:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedTrainerFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTrainerFilter === 'ALL'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({schedules.length})
          </button>

          {trainers.map((t) => {
            const count = schedules.filter(s => s.maHLV === t.id).length;
            const isSelected = selectedTrainerFilter === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setSelectedTrainerFilter(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <img
                  src={t.avatar}
                  alt={t.hoTen}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{t.hoTen} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Schedule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchedules.map((schedule) => {
          const isPending = schedule.trangThai === 'CHO_DUYET_HUY';

          return (
            <div
              key={schedule.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs transition-all flex flex-col justify-between ${
                isPending
                  ? 'border-amber-200 ring-2 ring-amber-500/10'
                  : 'border-slate-100 hover:border-emerald-200 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {schedule.id}
                  </span>
                  {getStatusBadge(schedule.trangThai)}
                </div>

                {/* Date & Time Slot */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <CalendarDays className="w-4 h-4 text-emerald-600" />
                    <span>{schedule.ngay}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{schedule.khungGio}</span>
                  </div>
                </div>

                {/* Member & Trainer */}
                <div className="space-y-3 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Hội Viên Tham Gia
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {schedule.tenHV.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{schedule.tenHV}</span>
                        <span className="text-[11px] text-slate-400 font-mono ml-1.5">({schedule.maHV})</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      HLV Phụ Trách
                    </span>
                    <div className="flex items-center gap-2 mt-1 font-semibold text-slate-700">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{schedule.tenHLV}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Mục Tiêu & Nội Dung Buổi Tập
                    </span>
                    <p className="mt-1 text-slate-600 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {schedule.noiDungTap}
                    </p>
                  </div>
                </div>

                {/* Cancellation Details if pending */}
                {isPending && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5 mb-4">
                    <p className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Yêu cầu dời/hủy từ hội viên:
                    </p>
                    <p className="text-amber-800">
                      <strong>Lý do:</strong> {schedule.lyDoHuy || 'Bận đột xuất'}
                    </p>
                    <p className="text-amber-800">
                      <strong>Báo trước:</strong> {schedule.soGioBaoTruoc} tiếng (≥ 2 tiếng hợp lệ)
                    </p>
                  </div>
                )}

                {schedule.nguoiDuyet && (
                  <p className="text-[11px] text-slate-400 italic mb-2">
                    ✓ Đã duyệt bởi: {schedule.nguoiDuyet}
                  </p>
                )}
              </div>

              {/* Action buttons if pending */}
              {isPending && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => approveCancelSchedule(schedule.id, false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Từ Chối
                  </button>

                  <button
                    onClick={() => approveCancelSchedule(schedule.id, true)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Duyệt & Hoàn Slot Bù</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Đặt Lịch PT Mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Đặt Lịch PT 1-kèm-1 Mới
                </h3>
                <p className="text-xs text-slate-500">
                  Hệ thống tự động kiểm tra xung đột trùng giờ của HLV
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              
              {/* Chọn Học viên */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Chọn Hội Viên Tham Gia
                </label>
                <select
                  value={formData.maHV}
                  onChange={(e) => setFormData({ ...formData, maHV: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 bg-white font-medium"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.hoTen} ({m.id}) - {m.goiTap === 'TL01' ? 'PT Trị Liệu' : 'Gym Tự Do'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn HLV */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Chọn Huấn Luyện Viên Phụ Trách
                </label>
                <select
                  value={formData.maHLV}
                  onChange={(e) => setFormData({ ...formData, maHLV: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 bg-white font-medium"
                >
                  {trainers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.hoTen} - {t.vaiTro}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ngày & Giờ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Ngày Tập
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.ngay}
                    onChange={(e) => setFormData({ ...formData, ngay: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Khung Giờ Tập
                  </label>
                  <select
                    value={formData.khungGio}
                    onChange={(e) => setFormData({ ...formData, khungGio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nội dung tập */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Nội Dung / Phác Đồ Buổi Tập
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="VD: Kiểm tra biên độ khớp háng, bài tập phục hồi lưng dưới..."
                  value={formData.noiDungTap}
                  onChange={(e) => setFormData({ ...formData, noiDungTap: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Xác Nhận Xếp Lịch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

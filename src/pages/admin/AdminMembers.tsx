import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  QrCode, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  RotateCw, 
  X,
  CreditCard,
  Printer,
  Sparkles
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { HocVien, NhomHocVien, GoiTapType } from '../../types';

export const AdminMembers: React.FC = () => {
  const { members, addMember, renewMember, getDaysRemaining } = useGym();

  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<'ALL' | NhomHocVien>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DANG_TAP' | 'DANH_SACH_DO' | 'HET_HAN'>('ALL');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailMember, setDetailMember] = useState<HocVien | null>(null);

  // Auto next ID
  const computeNextId = () => {
    const nums = members
      .map(m => parseInt(m.id.replace('HV', ''), 10))
      .filter(n => !isNaN(n));
    const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `HV${String(nextNum).padStart(3, '0')}`;
  };

  // Form state for adding member
  const getThirtyDaysAhead = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    id: computeNextId(),
    hoTen: '',
    soDienThoai: '',
    nhom: 'HSSV' as NhomHocVien,
    goiTap: 'GYM01' as GoiTapType,
    soTienGoi: 250000,
    ngayBatDau: new Date().toISOString().split('T')[0],
    ngayHetHan: getThirtyDaysAhead(),
    ghiChu: ''
  });

  // Automatically update price based on Group and Package
  const handleGroupChange = (nhom: NhomHocVien) => {
    let price = 250000;
    if (formData.goiTap === 'TL01') {
      price = 1500000;
    } else {
      price = nhom === 'HSSV' ? 250000 : 300000;
    }
    setFormData(prev => ({
      ...prev,
      nhom,
      soTienGoi: price
    }));
  };

  const handlePackageChange = (goiTap: GoiTapType) => {
    let price = 250000;
    if (goiTap === 'TL01') {
      price = 1500000;
    } else {
      price = formData.nhom === 'HSSV' ? 250000 : 300000;
    }
    setFormData(prev => ({
      ...prev,
      goiTap,
      soTienGoi: price
    }));
  };

  const handleOpenAddModal = () => {
    setFormData({
      id: computeNextId(),
      hoTen: '',
      soDienThoai: '',
      nhom: 'HSSV',
      goiTap: 'GYM01',
      soTienGoi: 250000,
      ngayBatDau: new Date().toISOString().split('T')[0],
      ngayHetHan: getThirtyDaysAhead(),
      ghiChu: ''
    });
    setShowAddModal(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hoTen.trim() || !formData.soDienThoai.trim()) return;

    addMember({
      id: formData.id,
      hoTen: formData.hoTen.trim(),
      soDienThoai: formData.soDienThoai.trim(),
      nhom: formData.nhom,
      goiTap: formData.goiTap,
      ngayBatDau: formData.ngayBatDau,
      ngayHetHan: formData.ngayHetHan,
      soTienGoi: formData.soTienGoi,
      soSlotTapBu: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.id}`,
      ghiChu: formData.ghiChu
    });

    setShowAddModal(false);
  };

  // Filter members
  const filteredMembers = members.filter(m => {
    const matchSearch = 
      m.hoTen.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.soDienThoai.includes(search);
    
    const matchGroup = filterGroup === 'ALL' || m.nhom === filterGroup;
    const matchStatus = filterStatus === 'ALL' || m.trangThai === filterStatus;

    return matchSearch && matchGroup && matchStatus;
  });

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Hội Viên & Gói Tập
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh bạ hội viên phòng tập Trảng Bom &bull; Quản lý hạn thẻ, bù slot và cấp thẻ QR điện tử.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm Hội Viên Mới</span>
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo Tên, SĐT hoặc Mã (HV001)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Group Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl text-xs font-semibold">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Nhóm:
            </span>
            <button
              onClick={() => setFilterGroup('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterGroup === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterGroup('HSSV')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterGroup === 'HSSV' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HSSV (250k)
            </button>
            <button
              onClick={() => setFilterGroup('DI_LAM')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterGroup === 'DI_LAM' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đi làm (300k)
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả hạn
            </button>
            <button
              onClick={() => setFilterStatus('DANG_TAP')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'DANG_TAP' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đang tập
            </button>
            <button
              onClick={() => setFilterStatus('DANH_SACH_DO')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'DANH_SACH_DO' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Danh sách đỏ
            </button>
            <button
              onClick={() => setFilterStatus('HET_HAN')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'HET_HAN' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hết hạn
            </button>
          </div>

        </div>

      </div>

      {/* Spacious Member Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-6">Mã & Học Viên</th>
                <th className="py-4 px-4">Nhóm / Gói Tập</th>
                <th className="py-4 px-4">Liên Hệ</th>
                <th className="py-4 px-4">Thời Hạn Thẻ</th>
                <th className="py-4 px-4">Slot Bù</th>
                <th className="py-4 px-4">Trạng Thái</th>
                <th className="py-4 px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => {
                const days = getDaysRemaining(member.ngayHetHan);
                const isRed = member.trangThai === 'DANH_SACH_DO';
                const isExpired = member.trangThai === 'HET_HAN';

                return (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.hoTen}
                          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{member.hoTen}</span>
                            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              {member.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {member.soBuoiDaTap ? `Đã tập ${member.soBuoiDaTap} buổi` : 'Mới kích hoạt'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Group & Package */}
                    <td className="py-4 px-4">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                          {member.nhom === 'HSSV' ? 'HSSV (250k)' : 'Đi Làm (300k)'}
                        </span>
                        <p className="text-xs font-semibold text-emerald-700 mt-1">
                          {member.goiTap === 'GYM01' ? 'Gym Tự Do' : 'PT Trị Liệu 1:1'}
                        </p>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-4 font-mono font-medium text-slate-600">
                      {member.soDienThoai}
                    </td>

                    {/* Expiry */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-800 text-xs block">
                          Hạn: {member.ngayHetHan}
                        </span>
                        <span
                          className={`text-[11px] font-bold inline-block px-2 py-0.5 rounded-md ${
                            isExpired
                              ? 'bg-rose-100 text-rose-800'
                              : isRed
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isExpired
                            ? `Quá hạn ${Math.abs(days)} ngày`
                            : `Còn ${days} ngày`}
                        </span>
                      </div>
                    </td>

                    {/* Slot bù */}
                    <td className="py-4 px-4">
                      {member.soSlotTapBu > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>+{member.soSlotTapBu} slot bù</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">0</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {member.trangThai === 'DANG_TAP' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đang tập
                        </span>
                      )}
                      {member.trangThai === 'DANH_SACH_DO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Danh sách đỏ
                        </span>
                      )}
                      {member.trangThai === 'HET_HAN' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Hết hạn
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Detail / QR Modal */}
                        <button
                          onClick={() => setDetailMember(member)}
                          className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/80 transition-colors"
                          title="Xem Thẻ Hội Viên & Mã QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* Renew Button */}
                        <button
                          onClick={() => renewMember(member.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isRed || isExpired
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                          title="Gia hạn thêm 30 ngày tập"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Gia Hạn</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Thêm Học Viên Mới (2 Cột rộng rãi) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Thêm Học Viên Mới & Đăng Ký Gói
                </h3>
                <p className="text-xs text-slate-500">
                  Mã học viên và ngày hết hạn được hệ thống tự động thiết lập chuẩn xác
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Mã HV (Auto) */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Mã Học Viên (Tự Sinh)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.id}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-mono font-bold text-emerald-800 text-sm"
                  />
                </div>

                {/* Họ và Tên */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Họ và Tên Hội Viên *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={formData.hoTen}
                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Số Điện Thoại */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Số Điện Thoại (Dùng Check-in) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0912345678"
                    value={formData.soDienThoai}
                    onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono"
                  />
                </div>

                {/* Nhóm Học Viên */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Nhóm Đối Tượng (Biểu Phí)
                  </label>
                  <select
                    value={formData.nhom}
                    onChange={(e) => handleGroupChange(e.target.value as NhomHocVien)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="HSSV">Học sinh - Sinh viên (Ưu đãi 250.000đ)</option>
                    <option value="DI_LAM">Người đi làm (Chuẩn 300.000đ)</option>
                  </select>
                </div>

                {/* Loại Gói Tập */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Loại Gói Đăng Ký
                  </label>
                  <select
                    value={formData.goiTap}
                    onChange={(e) => handlePackageChange(e.target.value as GoiTapType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="GYM01">GYM01 - Gym Tự Do (Tháng)</option>
                    <option value="TL01">TL01 - PT Nắn Chỉnh & Trị Liệu 1:1 (1.500.000đ)</option>
                  </select>
                </div>

                {/* Đơn Giá Thực Thu */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Đơn Giá Thực Thu (Tự Động)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formatVND(formData.soTienGoi)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-emerald-50 text-emerald-900 font-extrabold text-sm"
                  />
                </div>

                {/* Ngày Kích Hoạt */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Ngày Bắt Đầu Kích Hoạt
                  </label>
                  <input
                    type="date"
                    value={formData.ngayBatDau}
                    onChange={(e) => {
                      const d = new Date(e.target.value);
                      d.setDate(d.getDate() + 30);
                      setFormData({
                        ...formData,
                        ngayBatDau: e.target.value,
                        ngayHetHan: d.toISOString().split('T')[0]
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                {/* Ngày Hết Hạn (+30 ngày) */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Ngày Hết Hạn (+30 Ngày)
                  </label>
                  <input
                    type="date"
                    value={formData.ngayHetHan}
                    onChange={(e) => setFormData({ ...formData, ngayHetHan: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
                  />
                </div>

              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Ghi Chú Y Khoa / Thói Quen Tập Luyện (Nếu có)
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Tiền sử đau thắt lưng nhẹ, thẻ sinh viên trường ĐH Đồng Nai..."
                  value={formData.ghiChu}
                  onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cấp Thẻ Hội Viên</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Xem Thẻ Điện Tử & Mã QR Cá Nhân */}
      {detailMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setDetailMember(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Thẻ Hội Viên Điện Tử E-Card
            </h3>

            {/* Luxurious Emerald E-Card */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                    HLV GYM &bull; TRẢNG BOM
                  </span>
                  <h4 className="text-xl font-extrabold tracking-tight mt-0.5">{detailMember.hoTen}</h4>
                </div>
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-xs border border-white/20">
                  {detailMember.id}
                </span>
              </div>

              {/* QR Code Simulation */}
              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center mb-5 text-slate-900 shadow-md">
                {/* SVG QR Code Mock */}
                <div className="w-36 h-36 border-4 border-slate-900 p-2 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 bg-slate-900 rounded-xs flex items-center justify-center">
                      <div className="w-3 h-3 bg-white"></div>
                    </div>
                    <div className="w-8 h-8 bg-slate-900 rounded-xs flex items-center justify-center">
                      <div className="w-3 h-3 bg-white"></div>
                    </div>
                  </div>
                  <div className="text-center font-mono font-bold text-xs tracking-widest text-slate-800">
                    {detailMember.id}
                  </div>
                  <div className="flex justify-between">
                    <div className="w-8 h-8 bg-slate-900 rounded-xs flex items-center justify-center">
                      <div className="w-3 h-3 bg-white"></div>
                    </div>
                    <div className="w-8 h-8 border-2 border-slate-900 rounded-xs flex items-center justify-center">
                      <div className="w-3 h-3 bg-slate-900"></div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-2">
                  Đưa mã vào camera Kiosk hoặc nhập SĐT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs relative">
                <div>
                  <span className="text-emerald-200 text-[10px] block">GÓI TẬP</span>
                  <span className="font-bold">{detailMember.goiTap === 'GYM01' ? 'Gym Tự Do' : 'PT Trị Liệu'}</span>
                </div>
                <div>
                  <span className="text-emerald-200 text-[10px] block">HẠN THẺ</span>
                  <span className="font-bold">{detailMember.ngayHetHan}</span>
                </div>
              </div>

              {detailMember.soSlotTapBu > 0 && (
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Buổi tập bù tích lũy:
                  </span>
                  <span className="font-black text-amber-300">{detailMember.soSlotTapBu} ca</span>
                </div>
              )}
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>In Thẻ / Xuất Thẻ</span>
              </button>

              <button
                onClick={() => setDetailMember(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

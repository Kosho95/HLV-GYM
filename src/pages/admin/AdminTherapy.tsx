import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Grid, 
  Sliders, 
  TrendingDown, 
  Plus, 
  HeartPulse, 
  Scale, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Dumbbell,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { HoSoTriLieu } from '../../types';

export const AdminTherapy: React.FC = () => {
  const { therapyRecords, updateTherapyPainScore, addTherapyRecordSession } = useGym();

  // Active selected record
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    therapyRecords[0]?.id || 'HS001'
  );

  const record = therapyRecords.find(r => r.id === selectedRecordId) || therapyRecords[0];

  // Before / After Slider state
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [showPostureGrid, setShowPostureGrid] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  // Pain score slider in new session
  const [currentPainScore, setCurrentPainScore] = useState<number>(
    record ? record.thangDiemDauHienTai : 3
  );

  // New session form
  const [newSessionWeight, setNewSessionWeight] = useState<number>(record ? record.canNang : 72);
  const [newSessionNote, setNewSessionNote] = useState<string>('');

  useEffect(() => {
    if (record) {
      setCurrentPainScore(record.thangDiemDauHienTai);
      setNewSessionWeight(record.canNang);
    }
  }, [record]);

  // Handle Dragging Slider
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const getPainColor = (score: number) => {
    if (score <= 3) return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Đau nhẹ / Ổn định' };
    if (score <= 6) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Đau trung bình' };
    if (score <= 8) return { bg: 'bg-orange-500', text: 'text-orange-700', badge: 'bg-orange-50 text-orange-800 border-orange-200', label: 'Đau nhiều / Cần can thiệp' };
    return { bg: 'bg-rose-600', text: 'text-rose-700', badge: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Đau dữ dội / Hạn chế vận động' };
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;

    addTherapyRecordSession(record.id, {
      diemDau: currentPainScore,
      ghiChu: newSessionNote.trim() || `Buổi nắn chỉnh định kỳ - Điểm đau ${currentPainScore}/10`,
      canNang: Number(newSessionWeight)
    });

    setNewSessionNote('');
  };

  if (!record) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-slate-100">
        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700">Chưa có hồ sơ trị liệu nào</h3>
      </div>
    );
  }

  const painColorInfo = getPainColor(currentPainScore);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner & Member Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phục Hồi Chức Năng & Chiropractic Chuyên Sâu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hồ Sơ Nắn Chỉnh & Cân Bằng Cột Sống
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Đánh giá sai lệch tư thế &bull; Thang đo đau chuẩn y tế VAS 1-10 &bull; Biểu đồ tiến trình hồi phục.
          </p>
        </div>

        {/* Member dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bệnh Án Học Viên</span>
            <span className="text-sm font-bold text-slate-800">{record.tenHV} ({record.maHV})</span>
          </div>

          <select
            value={selectedRecordId}
            onChange={(e) => setSelectedRecordId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
          >
            {therapyRecords.map(r => (
              <option key={r.id} value={r.id}>
                {r.tenHV} ({r.maHV})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clinical Diagnosis Summary Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Chẩn Đoán Ban Đầu Của HLV Nguyễn Quốc Thái:</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
              &ldquo;{record.chanDoan}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-emerald-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Cân Nặng</span>
              <span className="text-lg font-black text-slate-900">{record.canNang} kg</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Điểm Đau Hiện Tại</span>
              <span className={`text-lg font-black ${painColorInfo.text}`}>
                {record.thangDiemDauHienTai} / 10
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Số Buổi Nắn</span>
              <span className="text-lg font-black text-emerald-700">
                {record.lichSuDiemDau.length} buổi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Before/After Slider + Pain Scale & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Col 1: Before / After Slider (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  So Sánh Tư Thế Trước & Sau Nắn Chỉnh
                </h3>
                <p className="text-xs text-slate-500">
                  Kéo thanh trượt ngang để so sánh độ cân bằng vai, xương chậu và cột sống
                </p>
              </div>

              {/* Posture Grid Toggle */}
              <button
                onClick={() => setShowPostureGrid(!showPostureGrid)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  showPostureGrid
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title="Bật/tắt lưới tọa độ trục đối xứng cơ thể"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Lưới Trục (Grid)</span>
              </button>
            </div>

            {/* Interactive Image Comparison Container */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-200 bg-slate-100 shadow-inner"
            >
              {/* After Image (Background) */}
              <img
                src={record.anhSau}
                alt="Sau can thiệp"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Before Image (Clipped overlay) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={record.anhTruoc}
                  alt="Trước can thiệp"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerRef.current?.offsetWidth || '100%' }}
                />
              </div>

              {/* Optional Posture Grid Overlay */}
              {showPostureGrid && (
                <div className="absolute inset-0 posture-grid pointer-events-none">
                  {/* Central Vertical Plumb Line */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-emerald-500/80 shadow-xs" />
                  {/* Shoulder Horizontal Level */}
                  <div className="absolute top-[32%] left-0 right-0 h-0.5 bg-rose-500/60 dashed" />
                  {/* Pelvic Horizontal Level */}
                  <div className="absolute top-[68%] left-0 right-0 h-0.5 bg-rose-500/60 dashed" />
                </div>
              )}

              {/* Divider Line & Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-emerald-700 shadow-xl border border-slate-200 flex items-center justify-center font-bold text-xs pointer-events-none">
                  &#8596;
                </div>
              </div>

              {/* Badges for Before / After */}
              <div className="absolute top-4 left-4 pointer-events-none">
                <span className="px-3 py-1 rounded-lg bg-rose-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs shadow-md">
                  Trước Can Thiệp ({record.lichSuDiemDau[0]?.diemDau || 8}/10)
                </span>
              </div>
              <div className="absolute top-4 right-4 pointer-events-none">
                <span className="px-3 py-1 rounded-lg bg-emerald-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs shadow-md">
                  Hiện Tại ({record.thangDiemDauHienTai}/10)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>👈 Kéo sang trái: Xem kết quả nắn chỉnh</span>
            <span>Kéo sang phải: Xem tư thế sai lệch ban đầu 👉</span>
          </div>
        </div>

        {/* Col 2: Pain Scale & Pain Trend Chart (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Medical Pain Scale (VAS 1 - 10) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Thang Đo Điểm Đau Y Tế (VAS)
                  </h3>
                  <p className="text-[11px] text-slate-500">Mức độ đau đo lường theo chuẩn lâm sàng 1 - 10</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border ${painColorInfo.badge}`}>
                {painColorInfo.label}
              </span>
            </div>

            {/* Pain Slider with Spectrum Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Đánh giá mức đau hiện tại:</span>
                <span className={`text-2xl font-black ${painColorInfo.text}`}>
                  {currentPainScore} <span className="text-xs font-semibold text-slate-400">/ 10</span>
                </span>
              </div>

              {/* Gradient Track */}
              <div className="relative">
                <div className="h-3 rounded-full w-full bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 to-rose-600 opacity-90 shadow-inner" />
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={currentPainScore}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCurrentPainScore(val);
                    updateTherapyPainScore(record.id, val);
                  }}
                  className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                />
              </div>

              {/* Reference ticks */}
              <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                <span>1 (Nhẹ)</span>
                <span>3</span>
                <span>5 (Trung bình)</span>
                <span>7</span>
                <span>10 (Dữ dội)</span>
              </div>
            </div>
          </div>

          {/* Pain Reduction Progress SVG Line Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Tiến Trình Giảm Đau Qua Các Buổi
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Giảm {(record.lichSuDiemDau[0]?.diemDau || 8) - record.thangDiemDauHienTai} điểm
              </span>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="w-full h-40">
              <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                {/* Horizontal reference lines */}
                <line x1="20" y1="20" x2="280" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="20" y1="60" x2="280" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="20" y1="100" x2="280" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {/* Y labels */}
                <text x="5" y="24" fontSize="8" fill="#94A3B8">10</text>
                <text x="5" y="64" fontSize="8" fill="#94A3B8">5</text>
                <text x="5" y="104" fontSize="8" fill="#94A3B8">1</text>

                {/* Render line connecting data points */}
                {(() => {
                  const points = record.lichSuDiemDau;
                  if (points.length < 2) return null;

                  const stepX = (280 - 40) / (points.length - 1);
                  // Map pain score (1 to 10) to y (100 to 20)
                  const getY = (val: number) => 100 - ((val - 1) / 9) * 80;

                  const pathD = points.map((p, i) => {
                    const x = 40 + i * stepX;
                    const y = getY(p.diemDau);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');

                  return (
                    <>
                      {/* Gradient area under line */}
                      <path
                        d={`${pathD} L ${40 + (points.length - 1) * stepX} 100 L 40 100 Z`}
                        fill="rgba(16, 185, 129, 0.12)"
                      />

                      {/* Main trend line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Points */}
                      {points.map((p, i) => {
                        const x = 40 + i * stepX;
                        const y = getY(p.diemDau);
                        return (
                          <g key={i}>
                            <circle
                              cx={x}
                              cy={y}
                              r="4.5"
                              fill="#FFFFFF"
                              stroke="#059669"
                              strokeWidth="2.5"
                            />
                            <text
                              x={x}
                              y={y - 8}
                              fontSize="8"
                              fontWeight="bold"
                              fill="#0F172A"
                              textAnchor="middle"
                            >
                              {p.diemDau}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="mt-2 flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Buổi 1: Thăm khám</span>
              <span>Buổi {record.lichSuDiemDau.length}: Cải thiện rõ rệt</span>
            </div>
          </div>

        </div>

      </div>

      {/* Row: Form "Ghi Nhận Buổi Nắn Mới" & "Bài Tập Bổ Trợ Tại Nhà" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Ghi nhận buổi nắn (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ghi Nhận Buổi Nắn Chỉnh Mới
              </h3>
              <p className="text-xs text-slate-500">Cập nhật cân nặng và đánh giá sau can thiệp</p>
            </div>
          </div>

          <form onSubmit={handleSaveSession} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">
                Cân Nặng Hôm Nay (kg)
              </label>
              <div className="relative">
                <Scale className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.5"
                  value={newSessionWeight}
                  onChange={(e) => setNewSessionWeight(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">
                Đánh Giá Kỹ Thuật Can Thiệp
              </label>
              <textarea
                rows={3}
                required
                placeholder="VD: Đã giải áp thắt lưng, nắn chỉnh xương sườn lệch phải, cho học viên nằm giãn cơ 10 phút..."
                value={newSessionNote}
                onChange={(e) => setNewSessionNote(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu Thông Số & Cập Nhật Hồ Sơ</span>
            </button>
          </form>
        </div>

        {/* Danh sách bài tập bổ trợ tại nhà (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Bài Tập Phục Hồi Chỉ Định Về Nhà
                </h3>
                <p className="text-xs text-slate-500">Giáo án do HLV Trị liệu giao cho hội viên thực hiện tại nhà</p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {record.baiTapVeNha.length} Bài Tập
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {record.baiTapVeNha.map((bt) => (
              <div
                key={bt.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-emerald-200 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{bt.ten}</h4>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {bt.thoiLuong}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {bt.moTa}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> Chuẩn chỉnh tư thế
                  </span>
                  <span>Mỗi ngày</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Dặn dò sinh hoạt:</strong> {record.dinhDuongVaKhuyenNghi}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

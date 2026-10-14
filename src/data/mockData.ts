import type { 
  HocVien, 
  HuanLuyenVien, 
  LichHenPT, 
  HoSoTriLieu, 
  CheckInLog, 
  BaiTapMau, 
  NhatKyTapLuyen,
  GiaoDichThanhToan
} from '../types';


export const INITIAL_TRAINERS: HuanLuyenVien[] = [
  {
    id: 'HLV01',
    hoTen: 'Võ Minh Quân',
    soDienThoai: '0901234567',
    vaiTro: 'Chủ phòng kiêm HLV Trưởng',
    chuyenMon: 'Thể hình Chuyên sâu & Quản lý Vận hành',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    kinhNghiem: '8 năm kinh nghiệm huấn luyện thể hình & thi đấu',
    moTa: 'Tốt nghiệp ĐH TDTT, chứng chỉ HLV Quốc gia cấp I. Phụ trách giáo án tăng cơ, giảm mỡ và quản lý chung phòng tập Trảng Bom.'
  },
  {
    id: 'HLV02',
    hoTen: 'Nguyễn Quốc Thái',
    soDienThoai: '0907654321',
    vaiTro: 'HLV Trị liệu & Phục hồi',
    chuyenMon: 'Nắn chỉnh sai lệch Cột sống & Phục hồi Cơ Xương Khớp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    kinhNghiem: '6 năm kinh nghiệm Trị liệu Cơ Xương Khớp',
    moTa: 'Chứng chỉ Nắn chỉnh Cột sống (Chiropractic Specialist) & Phục hồi vận động sau chấn thương thể thao.'
  }
];

// Helper to compute date offset from today
const getOffsetDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_MEMBERS: HocVien[] = [
  {
    id: 'HV001',
    hoTen: 'Võ Minh Quân',
    soDienThoai: '0901234567',
    nhom: 'HSSV',
    goiTap: 'GYM01',
    trangThai: 'DANG_TAP',
    ngayBatDau: getOffsetDate(-10),
    ngayHetHan: getOffsetDate(20),
    soSlotTapBu: 0,
    soTienGoi: 250000,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    faceIdPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    hasFaceId: true,
    faceIdRegisteredAt: '10 ngày trước',
    gioiTinh: 'Nam',
    ngaySinh: '2003-05-14',
    chieuCao: 175,
    canNang: 68,
    ghiChu: 'Thẻ sinh viên ĐH Đồng Nai, tập đều đặn ca chiều',
    soBuoiDaTap: 12
  },
  {
    id: 'HV002',
    hoTen: 'Trần Văn Bình',
    soDienThoai: '0912345678',
    nhom: 'DI_LAM',
    goiTap: 'GYM01',
    trangThai: 'DANH_SACH_DO',
    ngayBatDau: getOffsetDate(-28),
    ngayHetHan: getOffsetDate(2), // Còn đúng 2 ngày
    soSlotTapBu: 0,
    soTienGoi: 300000,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    hasFaceId: false,
    gioiTinh: 'Nam',
    ngaySinh: '1995-10-22',
    chieuCao: 170,
    canNang: 74,
    ghiChu: 'Kỹ sư KCN Bàu Xéo Trảng Bom, hay tập sau 18h',
    soBuoiDaTap: 24
  },
  {
    id: 'HV003',
    hoTen: 'Lê Thị Mai',
    soDienThoai: '0987654321',
    nhom: 'DI_LAM',
    goiTap: 'TL01',
    trangThai: 'DANG_TAP',
    ngayBatDau: getOffsetDate(-14),
    ngayHetHan: getOffsetDate(16),
    soSlotTapBu: 1, // Tích lũy 1 buổi bù
    soTienGoi: 1500000,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    hasFaceId: false,
    gioiTinh: 'Nữ',
    ngaySinh: '1998-03-12',
    chieuCao: 160,
    canNang: 52,
    ghiChu: 'Gói PT Trị liệu thoái hóa đốt sống cổ C4-C5',
    soBuoiDaTap: 6
  },
  {
    id: 'HV004',
    hoTen: 'Phạm Quốc Hưng',
    soDienThoai: '0933445566',
    nhom: 'HSSV',
    goiTap: 'GYM01',
    trangThai: 'HET_HAN',
    ngayBatDau: getOffsetDate(-35),
    ngayHetHan: getOffsetDate(-5), // Đã hết hạn 5 ngày
    soSlotTapBu: 0,
    soTienGoi: 250000,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
    hasFaceId: false,
    gioiTinh: 'Nam',
    ngaySinh: '2007-08-19',
    chieuCao: 172,
    canNang: 65,
    ghiChu: 'Học sinh THPT Thống Nhất A, chuẩn bị gia hạn kỳ thi',
    soBuoiDaTap: 18
  },
  {
    id: 'HV005',
    hoTen: 'Hoàng Anh Tuấn',
    soDienThoai: '0966778899',
    nhom: 'DI_LAM',
    goiTap: 'TL01',
    trangThai: 'DANG_TAP',
    ngayBatDau: getOffsetDate(-18),
    ngayHetHan: getOffsetDate(12),
    soSlotTapBu: 0,
    soTienGoi: 1500000,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    faceIdPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    hasFaceId: true,
    faceIdRegisteredAt: '18 ngày trước',
    gioiTinh: 'Nam',
    ngaySinh: '1992-12-05',
    chieuCao: 176,
    canNang: 72.5,
    ghiChu: 'Phục hồi chấn thương lưng dưới & mất cân bằng khung chậu',
    soBuoiDaTap: 8
  }
];

export const INITIAL_SCHEDULES: LichHenPT[] = [
  {
    id: 'LH001',
    maHV: 'HV005',
    tenHV: 'Hoàng Anh Tuấn',
    maHLV: 'HLV02',
    tenHLV: 'Nguyễn Quốc Thái',
    ngay: getOffsetDate(0), // Hôm nay
    khungGio: '09:00 - 10:30',
    trangThai: 'DAT_THANH_CONG',
    noiDungTap: 'Nắn chỉnh giải áp thắt lưng L4-L5 & Kích hoạt cơ mông'
  },
  {
    id: 'LH002',
    maHV: 'HV003',
    tenHV: 'Lê Thị Mai',
    maHLV: 'HLV02',
    tenHLV: 'Nguyễn Quốc Thái',
    ngay: getOffsetDate(1), // Ngày mai
    khungGio: '15:00 - 16:30',
    trangThai: 'CHO_DUYET_HUY',
    noiDungTap: 'Giãn cơ cổ vai gáy & bài tập kéo giãn cơ ngực',
    thoiGianGuiHuy: 'Hôm nay 10:15',
    lyDoHuy: 'Đột xuất có cuộc họp công ty ngoài giờ',
    soGioBaoTruoc: 3 // Báo trước 3 tiếng (hợp lệ >= 2 tiếng)
  },
  {
    id: 'LH003',
    maHV: 'HV001',
    tenHV: 'Võ Minh Quân',
    maHLV: 'HLV01',
    tenHLV: 'Võ Minh Quân',
    ngay: getOffsetDate(2),
    khungGio: '17:30 - 19:00',
    trangThai: 'DAT_THANH_CONG',
    noiDungTap: 'Kỹ thuật Squat & Deadlift an toàn cho khớp gối'
  }
];

export const INITIAL_THERAPY_RECORDS: HoSoTriLieu[] = [
  {
    id: 'HS001',
    maHV: 'HV005',
    tenHV: 'Hoàng Anh Tuấn',
    ngayKham: getOffsetDate(-18),
    chanDoan: 'Vẹo cột sống ngực T6-T10, gù lưng trên (Kyphosis), nghiêng khung chậu trước (Anterior Pelvic Tilt) gây đau thắt lưng khi ngồi lâu.',
    canNang: 72.5,
    thangDiemDauHienTai: 3, // Giảm từ 8 xuống 3
    lichSuDiemDau: [
      { ngay: getOffsetDate(-18), diemDau: 8, ghiChu: 'Buổi 1: Thăm khám ban đầu, đau nhói thắt lưng khi cúi người' },
      { ngay: getOffsetDate(-14), diemDau: 7, ghiChu: 'Buổi 2: Giải áp đĩa đệm thắt lưng, giảm co thắt cơ dựng sống' },
      { ngay: getOffsetDate(-10), diemDau: 5, ghiChu: 'Buổi 3: Cân chỉnh khung chậu, biên độ xoay thân cải thiện 40%' },
      { ngay: getOffsetDate(-6), diemDau: 4, ghiChu: 'Buổi 4: Kích hoạt nhóm cơ cốt lõi sâu (TVA) và mông nhỡ' },
      { ngay: getOffsetDate(-2), diemDau: 3, ghiChu: 'Buổi 5: Tư thế đứng thẳng tự nhiên hơn, đi lại không còn đau nhói' }
    ],
    anhTruoc: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    anhSau: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    baiTapVeNha: [
      {
        id: 'BT01',
        ten: 'Cat-Cow (Mèo - Bò)',
        moTa: 'Tăng cường sự linh hoạt cho toàn bộ trục cột sống. Hít vào võng lưng ngẩng mặt, thở ra cuộn tròn lưng cúi đầu.',
        thoiLuong: '3 hiệp x 12 lần',
        hinhAnh: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80',
        daHoanThanh: true
      },
      {
        id: 'BT02',
        ten: 'Bird-Dog (Chim - Chó săn)',
        moTa: 'Ổn định cơ cốt lõi sâu, cân bằng nhóm cơ đối xứng hai bên lưng và kích hoạt cơ mông.',
        thoiLuong: '3 hiệp x 10 lần mỗi bên (giữ 3s)',
        hinhAnh: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=300&q=80',
        daHoanThanh: true
      },
      {
        id: 'BT03',
        ten: 'Dead Bug (Bọ chết ngửa)',
        moTa: 'Gồng chặt bụng ép sát thắt lưng xuống sàn, luân phiên hạ chân và tay đối diện.',
        thoiLuong: '3 hiệp x 12 lần',
        hinhAnh: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=300&q=80',
        daHoanThanh: false
      },
      {
        id: 'BT04',
        ten: 'Glute Bridge (Cầu mông phục hồi)',
        moTa: 'Nâng hông gồng chặt mông, giữ khớp háng mở thẳng hàng với đùi và ngực, giải tỏa áp lực đĩa đệm.',
        thoiLuong: '3 hiệp x 15 lần (giữ đỉnh 2s)',
        hinhAnh: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=300&q=80',
        daHoanThanh: false
      }
    ],
    dinhDuongVaKhuyenNghi: 'Uống đủ 2.5 lít nước/ngày. Tránh ngồi liên tục quá 45 phút, đứng dậy đi lại và làm bài tập gập mở ngực tại bàn làm việc.'
  }
];

export const INITIAL_CHECKIN_LOGS: CheckInLog[] = [
  {
    id: 'CK001',
    maHV: 'HV001',
    tenHV: 'Võ Minh Quân',
    thoiGian: '17:45 - Hôm nay',
    hopLe: true,
    ghiChu: 'Check-in thành công (Còn 20 ngày)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    nhom: 'HSSV',
    soNgayConLai: 20,
    goiTap: 'GYM01'
  },
  {
    id: 'CK002',
    maHV: 'HV005',
    tenHV: 'Hoàng Anh Tuấn',
    thoiGian: '08:55 - Hôm nay',
    hopLe: true,
    ghiChu: 'Check-in PT Trị liệu ca 09:00',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    nhom: 'DI_LAM',
    soNgayConLai: 12,
    goiTap: 'TL01'
  },
  {
    id: 'CK003',
    maHV: 'HV003',
    tenHV: 'Lê Thị Mai',
    thoiGian: '16:10 - Hôm qua',
    hopLe: true,
    ghiChu: 'Check-in thành công (Có 1 ca bù tích lũy)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    nhom: 'DI_LAM',
    soNgayConLai: 16,
    goiTap: 'TL01'
  }
];

export const EXERCISE_CATALOG: BaiTapMau[] = [
  // Nhóm tập tạ (Strength)
  {
    id: 'EX_LAT_PULLDOWN',
    ten: 'Kéo Xô Lat Pulldown',
    nhomCo: 'Lưng xô (Lats)',
    loai: 'STRENGTH',
    metScore: 5.0,
    donVi: 'REPS_SETS',
    caloMoiRepKhoang: 0.35,
    moTa: 'Phát triển nhóm xô lưng, mở rộng khung lưng v-taper và hỗ trợ kéo dãn đốt sống lưng.'
  },
  {
    id: 'EX_BENCH_PRESS',
    ten: 'Đẩy Ngực Ngang (Barbell Bench Press)',
    nhomCo: 'Cơ Ngực (Chest)',
    loai: 'STRENGTH',
    metScore: 6.0,
    donVi: 'REPS_SETS',
    caloMoiRepKhoang: 0.45,
    moTa: 'Tăng cường sức mạnh cơ ngực trên, ngực giữa, vai trước và tay sau.'
  },
  {
    id: 'EX_BARBELL_SQUAT',
    ten: 'Gánh Tạ Đùi Sau / Trước (Squat)',
    nhomCo: 'Chân Đùi & Mông (Legs & Glutes)',
    loai: 'STRENGTH',
    metScore: 7.5,
    donVi: 'REPS_SETS',
    caloMoiRepKhoang: 0.65,
    moTa: 'Bài tập vua kích hoạt toàn bộ cơ chi dưới, tiêu hao năng lượng cực cao.'
  },
  {
    id: 'EX_DEADLIFT',
    ten: 'Kéo Tạ Đất (Deadlift)',
    nhomCo: 'Toàn thân & Chuỗi sau (Posterior Chain)',
    loai: 'STRENGTH',
    metScore: 8.0,
    donVi: 'REPS_SETS',
    caloMoiRepKhoang: 0.75,
    moTa: 'Củng cố cơ lưng, mông, đùi sau và sức mạnh cầm nắm.'
  },
  {
    id: 'EX_DUMBBELL_CURL',
    ten: 'Cuốn Tạ Đơn Bắp Tay Trước (Bicep Curl)',
    nhomCo: 'Tay trước (Biceps)',
    loai: 'STRENGTH',
    metScore: 3.8,
    donVi: 'REPS_SETS',
    caloMoiRepKhoang: 0.25,
    moTa: 'Cô lập nhóm cơ bắp tay trước, định hình cơ bắp.'
  },
  {
    id: 'EX_SEATED_CABLE_ROW',
    ten: 'Kéo Cáp Ngồi (Seated Cable Row)',
    nhomCo: 'Lưng giữa & Khung vai',
    loai: 'STRENGTH',
    metScore: 5.5,
    donVi: 'REPS_SETS',
    caloMoiRepKhoang: 0.38,
    moTa: 'Khắc phục gù lưng, kéo khớp bả vai về vị trí sinh lý cân bằng.'
  },
  {
    id: 'EX_SHOULDER_PRESS',
    ten: 'Đẩy Vai Quá Đầu (Overhead Dumbbell Press)',
    nhomCo: 'Cơ Vai (Deltoids)',
    loai: 'STRENGTH',
    metScore: 5.2,
    donVi: 'REPS_SETS',
    caloMoiRepKhoang: 0.35,
    moTa: 'Xây dựng độ dày và độ rộng cho khớp vai.'
  },
  // Cardio & Vận động tim mạch
  {
    id: 'EX_INCLINE_TREADMILL',
    ten: 'Đi Bộ Leo Dốc Máy Chạy (Incline Treadmill Walk)',
    nhomCo: 'Tim Mạch, Đùi & Bắp Chân',
    loai: 'CARDIO',
    metScore: 6.8, // 5km/h với dốc 8-12%
    donVi: 'DURATION',
    moTa: 'Đốt mỡ tối đa, bảo vệ sụn khớp gối tốt hơn chạy bộ thông thường.'
  },
  {
    id: 'EX_RUNNING_TREADMILL',
    ten: 'Chạy Bộ Tốc Độ Vừa (8-10 km/h)',
    nhomCo: 'Cardio Toàn Thân',
    loai: 'CARDIO',
    metScore: 9.8,
    donVi: 'DURATION',
    moTa: 'Tăng sức bền tim phổi và đốt năng lượng mạnh mẽ.'
  },
  {
    id: 'EX_STATIONARY_BIKE',
    ten: 'Đạp Xe Phòng Gym (Spinning Bike)',
    nhomCo: 'Tim Mạch & Chân',
    loai: 'CARDIO',
    metScore: 7.0,
    donVi: 'DURATION',
    moTa: 'Nhịp tim duy trì vùng Zone 2-3 đốt mỡ, rất êm cho cột sống.'
  },
  {
    id: 'EX_JUMP_ROPE',
    ten: 'Nhảy Dây Thể Lực (Jump Rope)',
    nhomCo: 'Cardio & Phản xạ',
    loai: 'CARDIO',
    metScore: 11.0,
    donVi: 'DURATION',
    moTa: 'Vận động cường độ cao, cải thiện độ linh hoạt cổ chân và nhịp thở.'
  },
  {
    id: 'EX_PLANK_CORE',
    ten: 'Plank Giữ Khối Cơ Lõi (Core Plank)',
    nhomCo: 'Cơ Bụng & Cơ Lưng Dưới',
    loai: 'HIIT_FUNCTIONAL',
    metScore: 4.0,
    donVi: 'DURATION',
    moTa: 'Tăng cường vững vàng cột sống thắt lưng, ngăn ngừa đau lưng tái phát.'
  }
];

export const INITIAL_WORKOUT_LOGS: NhatKyTapLuyen[] = [
  {
    id: 'WL_001',
    maHV: 'HV005',
    ngayTap: getOffsetDate(0),
    thoiGian: '09:30',
    tongCalo: 385,
    tongThoiGianPhut: 45,
    ghiChu: 'Buổi tập lưng và đi bộ leo dốc phục hồi. Cột sống cảm giác nhẹ nhõm, không bị buốt lưng.',
    danhSachBaiTap: [
      {
        id: 'DT_01',
        tenBaiTap: 'Kéo Xô Lat Pulldown',
        loai: 'STRENGTH',
        nhomCo: 'Lưng xô (Lats)',
        soHiep: 4,
        soRep: 12,
        mucTaKg: 35,
        caloTieuHao: 125
      },
      {
        id: 'DT_02',
        tenBaiTap: 'Đi Bộ Leo Dốc Máy Chạy (Incline Treadmill Walk)',
        loai: 'CARDIO',
        nhomCo: 'Tim Mạch, Đùi & Bắp Chân',
        thoiGianPhut: 30,
        cuongDo: 'TRUNG_BINH',
        caloTieuHao: 260
      }
    ]
  },
  {
    id: 'WL_002',
    maHV: 'HV001',
    ngayTap: getOffsetDate(-1),
    thoiGian: '18:15',
    tongCalo: 510,
    tongThoiGianPhut: 55,
    ghiChu: 'Tập ngực vai và chạy bộ nhẹ xả cơ',
    danhSachBaiTap: [
      {
        id: 'DT_03',
        tenBaiTap: 'Đẩy Ngực Ngang (Barbell Bench Press)',
        loai: 'STRENGTH',
        nhomCo: 'Cơ Ngực (Chest)',
        soHiep: 4,
        soRep: 10,
        mucTaKg: 50,
        caloTieuHao: 190
      },
      {
        id: 'DT_04',
        tenBaiTap: 'Đẩy Vai Quá Đầu (Overhead Dumbbell Press)',
        loai: 'STRENGTH',
        nhomCo: 'Cơ Vai (Deltoids)',
        soHiep: 3,
        soRep: 12,
        mucTaKg: 14,
        caloTieuHao: 110
      },
      {
        id: 'DT_05',
        tenBaiTap: 'Đi Bộ Leo Dốc Máy Chạy (Incline Treadmill Walk)',
        loai: 'CARDIO',
        thoiGianPhut: 25,
        cuongDo: 'CAO',
        caloTieuHao: 210
      }
    ]
  }
];

export const INITIAL_TRANSACTIONS: GiaoDichThanhToan[] = [
  {
    id: 'GD_1001',
    maHV: 'HV005',
    tenHV: 'Hoàng Anh Tuấn',
    soDienThoai: '0934567890',
    congThanhToan: 'VIETQR',
    mucDich: 'DAT_CA_PT_1_1',
    soTien: 350000,
    noiDung: 'HV005 DAT CA PT TRI LIEU 09H00',
    ngayTao: '2026-10-14 08:30:15',
    trangThai: 'THANH_CONG',
    maGiaoDichNganHang: 'MBB_FT26101498271',
    thongTinPT: {
      maHLV: 'HLV02',
      tenHLV: 'Nguyễn Quốc Thái',
      ngay: '2026-10-14',
      khungGio: '09:30 - 11:00',
      noiDungTap: 'Nắn chỉnh giải áp thắt lưng L4-L5 & Phục hồi cơ cốt lõi'
    }
  },
  {
    id: 'GD_1002',
    maHV: 'HV001',
    tenHV: 'Võ Minh Quân',
    soDienThoai: '0901234567',
    congThanhToan: 'MOMO',
    mucDich: 'GIA_HAN_GOI',
    soTien: 250000,
    noiDung: 'HV001 GIA HAN THE GYM HSSV 30 NGAY',
    ngayTao: '2026-10-10 17:15:20',
    trangThai: 'THANH_CONG',
    maGiaoDichNganHang: 'MOMO_20261010_8849',
    thongTinGoi: {
      tenGoi: 'Thẻ Gym Học Sinh - Sinh Viên',
      soThang: 1,
      ngayHetHanMoi: '2026-11-09'
    }
  }
];



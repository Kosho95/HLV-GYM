export type NhomHocVien = 'HSSV' | 'DI_LAM';

export type GoiTapType = 'GYM01' | 'TL01';

export type TrangThaiHocVien = 'DANG_TAP' | 'DANH_SACH_DO' | 'HET_HAN';

export interface HocVien {
  id: string; // VD: HV001
  hoTen: string;
  soDienThoai: string;
  nhom: NhomHocVien;
  goiTap: GoiTapType;
  trangThai: TrangThaiHocVien;
  ngayBatDau: string; // YYYY-MM-DD
  ngayHetHan: string; // YYYY-MM-DD
  soSlotTapBu: number; // Mặc định 0
  soTienGoi: number; // 250000 or 300000 or 1500000
  avatar: string;
  faceIdPhoto?: string; // Ảnh khuôn mặt sinh trắc học Face ID
  hasFaceId?: boolean; // Đã đăng ký Face ID chưa
  faceIdRegisteredAt?: string; // Thời gian đăng ký Face ID
  gioiTinh?: 'Nam' | 'Nữ';
  ngaySinh?: string;
  chieuCao?: number;
  canNang?: number;
  ghiChu?: string;
  soBuoiDaTap?: number;
}

export interface HuanLuyenVien {
  id: string; // HLV01, HLV02
  hoTen: string;
  soDienThoai: string;
  vaiTro: string;
  chuyenMon: string;
  avatar: string;
  kinhNghiem: string;
  moTa: string;
}

export type TrangThaiLichHen = 'DAT_THANH_CONG' | 'CHO_DUYET_HUY' | 'DA_DUYET_HUY' | 'HOAN_TAT';

export interface LichHenPT {
  id: string; // LH001
  maHV: string;
  tenHV: string;
  maHLV: string;
  tenHLV: string;
  ngay: string; // YYYY-MM-DD
  khungGio: string; // e.g. 08:00 - 09:30
  trangThai: TrangThaiLichHen;
  noiDungTap: string;
  thoiGianGuiHuy?: string;
  lyDoHuy?: string;
  soGioBaoTruoc?: number;
  nguoiDuyet?: string;
}

export interface BaiTapVeNha {
  id: string;
  ten: string;
  moTa: string;
  thoiLuong: string;
  hinhAnh: string;
  daHoanThanh?: boolean;
}

export interface HoSoTriLieu {
  id: string;
  maHV: string;
  tenHV: string;
  ngayKham: string;
  chanDoan: string;
  canNang: number;
  thangDiemDauHienTai: number; // 1 - 10
  lichSuDiemDau: {
    ngay: string;
    diemDau: number;
    ghiChu: string;
  }[];
  anhTruoc: string;
  anhSau: string;
  baiTapVeNha: BaiTapVeNha[];
  dinhDuongVaKhuyenNghi: string;
}

export interface CheckInLog {
  id: string;
  maHV: string;
  tenHV: string;
  thoiGian: string; // HH:mm:ss DD/MM/YYYY
  hopLe: boolean;
  ghiChu: string;
  avatar: string;
  nhom: NhomHocVien;
  soNgayConLai: number;
  goiTap: GoiTapType;
  faceIdVerified?: boolean; // Xác thực qua Face ID
}

export type LoaiBaiTap = 'STRENGTH' | 'CARDIO' | 'HIIT_FUNCTIONAL';

export interface BaiTapMau {
  id: string;
  ten: string;
  nhomCo: string;
  loai: LoaiBaiTap;
  metScore: number; // Hệ số MET tiêu hao năng lượng
  donVi: 'REPS_SETS' | 'DURATION'; // tập tạ hiệp/rep hay theo phút
  caloMoiRepKhoang?: number; // ước tính cho rep/kg
  moTa: string;
}

export interface ChiTietBaiTapLog {
  id: string;
  tenBaiTap: string;
  loai: LoaiBaiTap;
  nhomCo?: string;
  // Cho bài tập tạ / kháng lực
  soHiep?: number;
  soRep?: number;
  mucTaKg?: number;
  // Cho bài tập cardio / thời gian
  thoiGianPhut?: number;
  cuongDo?: 'THAP' | 'TRUNG_BINH' | 'CAO'; // Dốc/Tốc độ cao
  caloTieuHao: number;
}

export interface NhatKyTapLuyen {
  id: string;
  maHV: string;
  ngayTap: string; // YYYY-MM-DD
  thoiGian: string; // HH:mm
  tongCalo: number;
  tongThoiGianPhut: number;
  ghiChu?: string;
  danhSachBaiTap: ChiTietBaiTapLog[];
}

export type CongThanhToan = 'VIETQR' | 'MOMO' | 'VNPAY' | 'ZALOPAY';

export type MucDichThanhToan = 'GIA_HAN_GOI' | 'NANG_CAP_GOI' | 'DAT_CA_PT_1_1';

export type TrangThaiThanhToan = 'CHO_THANH_TOAN' | 'THANH_CONG' | 'THAT_BAI';

export interface GiaoDichThanhToan {
  id: string; // GD_xxx
  maHV: string;
  tenHV: string;
  soDienThoai: string;
  congThanhToan: CongThanhToan;
  mucDich: MucDichThanhToan;
  soTien: number;
  noiDung: string;
  ngayTao: string;
  trangThai: TrangThaiThanhToan;
  maGiaoDichNganHang?: string;
  // Chi tiết đi kèm nếu là đặt ca PT
  thongTinPT?: {
    maHLV: string;
    tenHLV: string;
    ngay: string;
    khungGio: string;
    noiDungTap: string;
  };
  // Chi tiết nếu là gia hạn
  thongTinGoi?: {
    tenGoi: string;
    soThang: number;
    ngayHetHanMoi: string;
  };
}



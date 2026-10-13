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

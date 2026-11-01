-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 01, 2026 lúc 12:43 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hlv_gym`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `baitapgym`
--

CREATE TABLE `baitapgym` (
  `maBaiTapGym` varchar(20) NOT NULL,
  `tenBaiTap` varchar(150) NOT NULL,
  `nhomCo` varchar(100) NOT NULL,
  `loaiBaiTap` enum('CARDIO','KHANG_LUC') NOT NULL DEFAULT 'KHANG_LUC',
  `caloDotMoiPhut` decimal(6,2) NOT NULL DEFAULT 5.00
) ;

--
-- Đang đổ dữ liệu cho bảng `baitapgym`
--

INSERT INTO `baitapgym` (`maBaiTapGym`, `tenBaiTap`, `nhomCo`, `loaiBaiTap`, `caloDotMoiPhut`) VALUES
('BG01', 'Chạy bộ máy Treadmill', 'Cardio', 'CARDIO', 10.50),
('BG02', 'Đạp xe cố định', 'Cardio', 'CARDIO', 7.50),
('BG03', 'Barbell Bench Press (Đẩy ngực tạ đòn)', 'Ngực', 'KHANG_LUC', 6.00),
('BG04', 'Lat Pulldown (Kéo xô máy)', 'Lưng/Xô', 'KHANG_LUC', 5.50),
('BG05', 'Barbell Squat (Gánh đùi tạ đòn)', 'Đùi/Mông', 'KHANG_LUC', 8.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `baitapphuchoi`
--

CREATE TABLE `baitapphuchoi` (
  `maBaiTap` varchar(20) NOT NULL,
  `tenBaiTap` varchar(100) NOT NULL,
  `videoUrl` text DEFAULT NULL,
  `vungCoTacDong` varchar(150) NOT NULL,
  `huongDan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `baitapphuchoi`
--

INSERT INTO `baitapphuchoi` (`maBaiTap`, `tenBaiTap`, `videoUrl`, `vungCoTacDong`, `huongDan`) VALUES
('BT01', 'Cat-Cow Pose (Tư thế con mèo - con bò)', 'https://youtube.com/watch?v=catcow', 'Toàn bộ cột sống', 'Quỳ gối 4 điểm, hít vào võng lưng ngẩng mặt, thở ra gù lưng hóp bụng.'),
('BT02', 'Bird-Dog (Tư thế chim - chó)', 'https://youtube.com/watch?v=birddog', 'Cơ lõi, thắt lưng', 'Duỗi thẳng tay phải và chân trái song song mặt sàn, giữ 3 giây rồi đổi bên.'),
('BT03', 'Glute Bridge (Cầu mông)', 'https://youtube.com/watch?v=glutebridge', 'Mông, đùi sau, khớp háng', 'Nằm ngửa, co gối, siết mông nâng hông lên cao tạo đường thẳng từ gối đến vai.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chidinhbaitap`
--

CREATE TABLE `chidinhbaitap` (
  `maChiDinh` int(11) NOT NULL,
  `maHoSo` varchar(20) NOT NULL,
  `maBaiTap` varchar(20) NOT NULL,
  `soHiep` int(11) NOT NULL DEFAULT 3,
  `soLanLap` int(11) NOT NULL DEFAULT 10,
  `daHoanThanh` tinyint(1) DEFAULT 0
) ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dangkygoitap`
--

CREATE TABLE `dangkygoitap` (
  `maDangKy` varchar(20) NOT NULL,
  `maHV` varchar(20) NOT NULL,
  `maGoi` varchar(20) NOT NULL,
  `ngayBatDau` datetime NOT NULL,
  `ngayHetHan` datetime NOT NULL,
  `donGiaThucThu` decimal(12,2) NOT NULL,
  `daThuTien` tinyint(1) DEFAULT 0,
  `tongSoBuoi` int(11) DEFAULT 0,
  `soBuoiDaTap` int(11) DEFAULT 0
) ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giaodichthanhtoan`
--

CREATE TABLE `giaodichthanhtoan` (
  `maGiaoDich` varchar(30) NOT NULL,
  `maDangKy` varchar(20) NOT NULL,
  `maHV` varchar(20) NOT NULL,
  `soTien` decimal(12,2) NOT NULL,
  `phuongThuc` enum('TIEN_MAT','VNPAY','MOMO','VIETQR','ZALOPAY') NOT NULL DEFAULT 'VIETQR',
  `maGiaoDichCong` varchar(100) DEFAULT NULL,
  `trangThai` enum('CHO_THANH_TOAN','THANH_CONG','THAT_BAI','HOAN_TIEN') DEFAULT 'CHO_THANH_TOAN',
  `thoiGianTao` datetime DEFAULT current_timestamp(),
  `thoiGianHoanTat` datetime DEFAULT NULL,
  `ghiChu` varchar(255) DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `goitap`
--

CREATE TABLE `goitap` (
  `maGoi` varchar(20) NOT NULL,
  `tenGoi` varchar(100) NOT NULL,
  `loaiGoi` enum('GYM_TU_DO','PT_TRI_LIEU') NOT NULL,
  `chuKyThang` int(11) NOT NULL DEFAULT 1,
  `donGiaGoc` decimal(12,2) NOT NULL
) ;

--
-- Đang đổ dữ liệu cho bảng `goitap`
--

INSERT INTO `goitap` (`maGoi`, `tenGoi`, `loaiGoi`, `chuKyThang`, `donGiaGoc`) VALUES
('GYM01', 'Gói Gym Tự Do 1 Tháng', 'GYM_TU_DO', 1, 300000.00),
('TL01', 'Gói PT Trị Liệu & Phục Hồi 1 Tháng (12 buổi)', 'PT_TRI_LIEU', 1, 2400000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hlv`
--

CREATE TABLE `hlv` (
  `maHLV` varchar(20) NOT NULL,
  `maTaiKhoan` varchar(20) DEFAULT NULL,
  `hoTen` varchar(100) NOT NULL,
  `soDienThoai` varchar(15) NOT NULL,
  `chuyenMon` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hlv`
--

INSERT INTO `hlv` (`maHLV`, `maTaiKhoan`, `hoTen`, `soDienThoai`, `chuyenMon`) VALUES
('HLV01', 'TK_HLV01', 'Nguyễn Văn A', '0901234567', 'Chủ phòng kiêm HLV Trưởng - Nắn chỉnh Chiropractic'),
('HLV02', 'TK_HLV02', 'Trần Văn B', '0907654321', 'HLV Trị liệu - Phục hồi sai lệch cột sống');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hocvien`
--

CREATE TABLE `hocvien` (
  `maHV` varchar(20) NOT NULL,
  `maTaiKhoan` varchar(20) DEFAULT NULL,
  `hoTen` varchar(100) NOT NULL,
  `soDienThoai` varchar(15) NOT NULL,
  `maQRThe` varchar(100) DEFAULT NULL,
  `faceVector` text DEFAULT NULL,
  `nhom` enum('HSSV','DI_LAM') NOT NULL,
  `trangThai` enum('DANG_TAP','DANH_SACH_DO','HET_HAN') DEFAULT 'DANG_TAP',
  `soSlotTapBu` int(11) DEFAULT 0
) ;

--
-- Đang đổ dữ liệu cho bảng `hocvien`
--

INSERT INTO `hocvien` (`maHV`, `maTaiKhoan`, `hoTen`, `soDienThoai`, `maQRThe`, `faceVector`, `nhom`, `trangThai`, `soSlotTapBu`) VALUES
('HV001', 'TK_HV001', 'Võ Minh Quân', '0912345678', 'QR_HV001_SECRET', NULL, 'HSSV', 'DANG_TAP', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hosotrilieu`
--

CREATE TABLE `hosotrilieu` (
  `maHoSo` varchar(20) NOT NULL,
  `maHV` varchar(20) NOT NULL,
  `maHLV` varchar(20) DEFAULT NULL,
  `ngayKham` datetime NOT NULL,
  `canNang` float NOT NULL,
  `mucDoDau` int(11) NOT NULL,
  `anhTuTheTruoc` text DEFAULT NULL,
  `anhTuTheSau` text DEFAULT NULL,
  `chiDinhHLV` text DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichhenpt`
--

CREATE TABLE `lichhenpt` (
  `maLich` varchar(20) NOT NULL,
  `maHV` varchar(20) NOT NULL,
  `maHLV` varchar(20) NOT NULL,
  `thoiGianBatDau` datetime NOT NULL,
  `thoiGianKetThuc` datetime NOT NULL,
  `trangThai` enum('DAT_THANH_CONG','CHO_DUYET_HUY','DA_DUYET_HUY','HOAN_TAT') DEFAULT 'DAT_THANH_CONG',
  `ghiChuHuy` text DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichsucheckin`
--

CREATE TABLE `lichsucheckin` (
  `maCheckIn` varchar(20) NOT NULL,
  `maHV` varchar(20) NOT NULL,
  `thoiGianVao` datetime DEFAULT current_timestamp(),
  `phuongThucCheckIn` enum('QR_CODE','FACE_ID','SO_DIEN_THOAI') NOT NULL,
  `hopLe` tinyint(1) NOT NULL DEFAULT 1,
  `ghiChu` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `monan`
--

CREATE TABLE `monan` (
  `maMon` varchar(20) NOT NULL,
  `tenMon` varchar(150) NOT NULL,
  `donViTinh` varchar(50) NOT NULL,
  `calo` decimal(8,2) NOT NULL,
  `protein` decimal(8,2) NOT NULL DEFAULT 0.00,
  `carb` decimal(8,2) NOT NULL DEFAULT 0.00,
  `fat` decimal(8,2) NOT NULL DEFAULT 0.00
) ;

--
-- Đang đổ dữ liệu cho bảng `monan`
--

INSERT INTO `monan` (`maMon`, `tenMon`, `donViTinh`, `calo`, `protein`, `carb`, `fat`) VALUES
('MA01', 'Ức gà áp chảo', '100g', 165.00, 31.00, 0.00, 3.60),
('MA02', 'Cơm trắng', '1 chén (150g)', 195.00, 4.00, 43.00, 0.50),
('MA03', 'Cơm gạo lứt', '1 chén (150g)', 166.00, 3.50, 34.00, 1.40),
('MA04', 'Trứng gà luộc', '1 quả', 78.00, 6.30, 0.60, 5.30),
('MA05', 'Bún bò Huế', '1 tô', 550.00, 25.00, 65.00, 18.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhatkybuaan`
--

CREATE TABLE `nhatkybuaan` (
  `maNhatKy` varchar(20) NOT NULL,
  `maHV` varchar(20) NOT NULL,
  `maMon` varchar(20) NOT NULL,
  `ngayGhi` datetime DEFAULT current_timestamp(),
  `buoiAn` enum('SANG','TRUA','TOI','PHU') NOT NULL,
  `soLuong` float NOT NULL DEFAULT 1,
  `tongCalo` decimal(10,2) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhatkytapluyen`
--

CREATE TABLE `nhatkytapluyen` (
  `maNhatKyTap` varchar(20) NOT NULL,
  `maHV` varchar(20) NOT NULL,
  `maBaiTapGym` varchar(20) NOT NULL,
  `ngayTap` datetime DEFAULT current_timestamp(),
  `thoiLuongPhut` int(11) NOT NULL DEFAULT 0,
  `soHiep` int(11) DEFAULT 0,
  `soLanLap` int(11) DEFAULT 0,
  `mucTa` float DEFAULT 0,
  `tongTaiLuong` decimal(12,2) DEFAULT 0.00,
  `tongCaloDot` decimal(10,2) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `maTaiKhoan` varchar(20) NOT NULL,
  `tenDangNhap` varchar(50) NOT NULL,
  `matKhauHash` varchar(255) NOT NULL,
  `maPIN` varchar(6) DEFAULT NULL,
  `vaiTro` varchar(20) NOT NULL,
  `maOTP` varchar(10) DEFAULT NULL,
  `otpHetHan` datetime DEFAULT NULL,
  `ngayTao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`maTaiKhoan`, `tenDangNhap`, `matKhauHash`, `maPIN`, `vaiTro`, `maOTP`, `otpHetHan`, `ngayTao`) VALUES
('TK_HLV01', 'admin@hlvgym.vn', '$2y$10$e846Q7x7H8Gv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5J', '123456', 'ADMIN', NULL, NULL, '2026-11-01 18:41:42'),
('TK_HLV02', 'pttrilieu@hlvgym.vn', '$2y$10$e846Q7x7H8Gv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5J', '654321', 'ADMIN', NULL, NULL, '2026-11-01 18:41:42'),
('TK_HV001', '0912345678', '$2y$10$e846Q7x7H8Gv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5Jv5J', NULL, 'STUDENT', NULL, NULL, '2026-11-01 18:41:42');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thongsothetrang`
--

CREATE TABLE `thongsothetrang` (
  `maTheTrang` int(11) NOT NULL,
  `maHV` varchar(20) NOT NULL,
  `chieuCao` float NOT NULL,
  `canNang` float NOT NULL,
  `tyLeMo` float DEFAULT NULL,
  `mucTieu` enum('GIAM_MO','TANG_CO','PHUC_HOI_KHOP','DUY_TRI') NOT NULL,
  `ngayCapNhat` datetime DEFAULT current_timestamp()
) ;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `baitapgym`
--
ALTER TABLE `baitapgym`
  ADD PRIMARY KEY (`maBaiTapGym`);

--
-- Chỉ mục cho bảng `baitapphuchoi`
--
ALTER TABLE `baitapphuchoi`
  ADD PRIMARY KEY (`maBaiTap`);

--
-- Chỉ mục cho bảng `chidinhbaitap`
--
ALTER TABLE `chidinhbaitap`
  ADD PRIMARY KEY (`maChiDinh`),
  ADD KEY `fk_cd_hoso` (`maHoSo`),
  ADD KEY `fk_cd_baitap` (`maBaiTap`);

--
-- Chỉ mục cho bảng `dangkygoitap`
--
ALTER TABLE `dangkygoitap`
  ADD PRIMARY KEY (`maDangKy`),
  ADD KEY `fk_dk_hocvien` (`maHV`),
  ADD KEY `fk_dk_goitap` (`maGoi`);

--
-- Chỉ mục cho bảng `giaodichthanhtoan`
--
ALTER TABLE `giaodichthanhtoan`
  ADD PRIMARY KEY (`maGiaoDich`),
  ADD KEY `fk_gd_dangky` (`maDangKy`),
  ADD KEY `fk_gd_hocvien` (`maHV`);

--
-- Chỉ mục cho bảng `goitap`
--
ALTER TABLE `goitap`
  ADD PRIMARY KEY (`maGoi`);

--
-- Chỉ mục cho bảng `hlv`
--
ALTER TABLE `hlv`
  ADD PRIMARY KEY (`maHLV`),
  ADD UNIQUE KEY `maTaiKhoan` (`maTaiKhoan`);

--
-- Chỉ mục cho bảng `hocvien`
--
ALTER TABLE `hocvien`
  ADD PRIMARY KEY (`maHV`),
  ADD UNIQUE KEY `maTaiKhoan` (`maTaiKhoan`),
  ADD UNIQUE KEY `maQRThe` (`maQRThe`);

--
-- Chỉ mục cho bảng `hosotrilieu`
--
ALTER TABLE `hosotrilieu`
  ADD PRIMARY KEY (`maHoSo`),
  ADD KEY `fk_hs_hocvien` (`maHV`),
  ADD KEY `fk_hs_hlv` (`maHLV`);

--
-- Chỉ mục cho bảng `lichhenpt`
--
ALTER TABLE `lichhenpt`
  ADD PRIMARY KEY (`maLich`),
  ADD KEY `fk_lh_hocvien` (`maHV`),
  ADD KEY `fk_lh_hlv` (`maHLV`);

--
-- Chỉ mục cho bảng `lichsucheckin`
--
ALTER TABLE `lichsucheckin`
  ADD PRIMARY KEY (`maCheckIn`),
  ADD KEY `fk_checkin_hocvien` (`maHV`);

--
-- Chỉ mục cho bảng `monan`
--
ALTER TABLE `monan`
  ADD PRIMARY KEY (`maMon`);

--
-- Chỉ mục cho bảng `nhatkybuaan`
--
ALTER TABLE `nhatkybuaan`
  ADD PRIMARY KEY (`maNhatKy`),
  ADD KEY `fk_nk_hocvien` (`maHV`),
  ADD KEY `fk_nk_monan` (`maMon`);

--
-- Chỉ mục cho bảng `nhatkytapluyen`
--
ALTER TABLE `nhatkytapluyen`
  ADD PRIMARY KEY (`maNhatKyTap`),
  ADD KEY `fk_nt_hocvien` (`maHV`),
  ADD KEY `fk_nt_baitapgym` (`maBaiTapGym`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`maTaiKhoan`),
  ADD UNIQUE KEY `tenDangNhap` (`tenDangNhap`);

--
-- Chỉ mục cho bảng `thongsothetrang`
--
ALTER TABLE `thongsothetrang`
  ADD PRIMARY KEY (`maTheTrang`),
  ADD KEY `fk_tt_hocvien` (`maHV`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `chidinhbaitap`
--
ALTER TABLE `chidinhbaitap`
  MODIFY `maChiDinh` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thongsothetrang`
--
ALTER TABLE `thongsothetrang`
  MODIFY `maTheTrang` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chidinhbaitap`
--
ALTER TABLE `chidinhbaitap`
  ADD CONSTRAINT `fk_cd_baitap` FOREIGN KEY (`maBaiTap`) REFERENCES `baitapphuchoi` (`maBaiTap`),
  ADD CONSTRAINT `fk_cd_hoso` FOREIGN KEY (`maHoSo`) REFERENCES `hosotrilieu` (`maHoSo`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `dangkygoitap`
--
ALTER TABLE `dangkygoitap`
  ADD CONSTRAINT `fk_dk_goitap` FOREIGN KEY (`maGoi`) REFERENCES `goitap` (`maGoi`),
  ADD CONSTRAINT `fk_dk_hocvien` FOREIGN KEY (`maHV`) REFERENCES `hocvien` (`maHV`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `giaodichthanhtoan`
--
ALTER TABLE `giaodichthanhtoan`
  ADD CONSTRAINT `fk_gd_dangky` FOREIGN KEY (`maDangKy`) REFERENCES `dangkygoitap` (`maDangKy`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_gd_hocvien` FOREIGN KEY (`maHV`) REFERENCES `hocvien` (`maHV`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hlv`
--
ALTER TABLE `hlv`
  ADD CONSTRAINT `fk_hlv_taikhoan` FOREIGN KEY (`maTaiKhoan`) REFERENCES `taikhoan` (`maTaiKhoan`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `hocvien`
--
ALTER TABLE `hocvien`
  ADD CONSTRAINT `fk_hocvien_taikhoan` FOREIGN KEY (`maTaiKhoan`) REFERENCES `taikhoan` (`maTaiKhoan`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `hosotrilieu`
--
ALTER TABLE `hosotrilieu`
  ADD CONSTRAINT `fk_hs_hlv` FOREIGN KEY (`maHLV`) REFERENCES `hlv` (`maHLV`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_hs_hocvien` FOREIGN KEY (`maHV`) REFERENCES `hocvien` (`maHV`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `lichhenpt`
--
ALTER TABLE `lichhenpt`
  ADD CONSTRAINT `fk_lh_hlv` FOREIGN KEY (`maHLV`) REFERENCES `hlv` (`maHLV`),
  ADD CONSTRAINT `fk_lh_hocvien` FOREIGN KEY (`maHV`) REFERENCES `hocvien` (`maHV`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `lichsucheckin`
--
ALTER TABLE `lichsucheckin`
  ADD CONSTRAINT `fk_checkin_hocvien` FOREIGN KEY (`maHV`) REFERENCES `hocvien` (`maHV`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `nhatkybuaan`
--
ALTER TABLE `nhatkybuaan`
  ADD CONSTRAINT `fk_nk_hocvien` FOREIGN KEY (`maHV`) REFERENCES `hocvien` (`maHV`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_nk_monan` FOREIGN KEY (`maMon`) REFERENCES `monan` (`maMon`);

--
-- Các ràng buộc cho bảng `nhatkytapluyen`
--
ALTER TABLE `nhatkytapluyen`
  ADD CONSTRAINT `fk_nt_baitapgym` FOREIGN KEY (`maBaiTapGym`) REFERENCES `baitapgym` (`maBaiTapGym`),
  ADD CONSTRAINT `fk_nt_hocvien` FOREIGN KEY (`maHV`) REFERENCES `hocvien` (`maHV`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thongsothetrang`
--
ALTER TABLE `thongsothetrang`
  ADD CONSTRAINT `fk_tt_hocvien` FOREIGN KEY (`maHV`) REFERENCES `hocvien` (`maHV`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

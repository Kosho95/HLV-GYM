import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  HocVien, 
  HuanLuyenVien, 
  LichHenPT, 
  HoSoTriLieu, 
  CheckInLog, 
  TrangThaiHocVien 
} from '../types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_TRAINERS, 
  INITIAL_SCHEDULES, 
  INITIAL_THERAPY_RECORDS, 
  INITIAL_CHECKIN_LOGS 
} from '../data/mockData';
import { soundEffects } from '../utils/audio';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface CheckInResult {
  success: boolean;
  member: HocVien | null;
  daysRemaining: number;
  message: string;
  isRedList?: boolean;
}

interface GymContextType {
  members: HocVien[];
  trainers: HuanLuyenVien[];
  schedules: LichHenPT[];
  therapyRecords: HoSoTriLieu[];
  checkInLogs: CheckInLog[];
  activeTrainer: HuanLuyenVien;
  toasts: ToastMessage[];
  setActiveTrainer: (trainer: HuanLuyenVien) => void;
  removeToast: (id: string) => void;
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  
  // Member actions
  addMember: (data: Omit<HocVien, 'id' | 'trangThai'> & { id?: string }) => HocVien;
  renewMember: (memberId: string) => void;
  updateMemberNotes: (memberId: string, notes: string) => void;
  updateMemberProfile: (memberId: string, data: Partial<HocVien>) => void;
  registerFaceId: (memberId: string, photoBase64OrUrl: string) => void;
  
  // Schedule actions
  createSchedule: (data: Omit<LichHenPT, 'id'>) => { success: boolean; error?: string };
  approveCancelSchedule: (scheduleId: string, isApproved: boolean, isManualOverride?: boolean) => void;
  
  // Therapy actions
  updateTherapyPainScore: (recordId: string, newScore: number, note?: string) => void;
  toggleExerciseCompleted: (recordId: string, exerciseId: string) => void;
  addTherapyRecordSession: (recordId: string, session: { diemDau: number; ghiChu: string; canNang?: number; baiTapThem?: string }) => void;
  
  // Kiosk Check-in
  checkIn: (query: string) => CheckInResult;
  checkInWithFaceId: (memberId: string) => CheckInResult;
  
  // Reset
  resetToMockData: () => void;
  getDaysRemaining: (dateStr: string) => number;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MEMBERS: 'hlvgym_members_v2',
  SCHEDULES: 'hlvgym_schedules_v2',
  THERAPY: 'hlvgym_therapy_v2',
  LOGS: 'hlvgym_checkin_logs_v2',
  TRAINER: 'hlvgym_active_trainer_v2'
};

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to compute remaining days
  const getDaysRemaining = (dateStr: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusFromExpiry = (dateStr: string): TrangThaiHocVien => {
    const days = getDaysRemaining(dateStr);
    if (days < 0) return 'HET_HAN';
    if (days <= 3) return 'DANH_SACH_DO';
    return 'DANG_TAP';
  };

  // State initialization with localStorage fallback
  const [members, setMembers] = useState<HocVien[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as HocVien[];
        return parsed.map(m => ({
          ...m,
          trangThai: getStatusFromExpiry(m.ngayHetHan)
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MEMBERS.map(m => ({
      ...m,
      trangThai: getStatusFromExpiry(m.ngayHetHan)
    }));
  });

  const [trainers] = useState<HuanLuyenVien[]>(INITIAL_TRAINERS);
  
  const [activeTrainer, setActiveTrainerState] = useState<HuanLuyenVien>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRAINER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TRAINERS[0]; // Võ Minh Quân default
  });

  const [schedules, setSchedules] = useState<LichHenPT[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SCHEDULES;
  });

  const [therapyRecords, setTherapyRecords] = useState<HoSoTriLieu[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THERAPY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_THERAPY_RECORDS;
  });

  const [checkInLogs, setCheckInLogs] = useState<CheckInLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CHECKIN_LOGS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THERAPY, JSON.stringify(therapyRecords));
  }, [therapyRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(checkInLogs));
  }, [checkInLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAINER, JSON.stringify(activeTrainer));
  }, [activeTrainer]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setActiveTrainer = (trainer: HuanLuyenVien) => {
    setActiveTrainerState(trainer);
    addToast('info', 'Chuyển Đổi Quản Trị Viên', `Bạn đang thao tác với tư cách: ${trainer.hoTen} (${trainer.vaiTro})`);
  };

  // 1-Click Renewal
  const renewMember = (memberId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;

      // Extend +30 days from either current expiry or today
      const baseDate = new Date(m.ngayHetHan) > new Date() ? new Date(m.ngayHetHan) : new Date();
      baseDate.setDate(baseDate.getDate() + 30);
      const newExpiry = baseDate.toISOString().split('T')[0];

      return {
        ...m,
        ngayHetHan: newExpiry,
        trangThai: 'DANG_TAP'
      };
    }));

    const member = members.find(m => m.id === memberId);
    addToast(
      'success', 
      'Thu Phí & Gia Hạn Thành Công!', 
      `Học viên ${member?.hoTen || memberId} đã được gia hạn thêm 30 ngày tập. Trạng thái đã khôi phục ĐANG TẬP.`
    );
  };

  const addMember = (data: Omit<HocVien, 'id' | 'trangThai'> & { id?: string }): HocVien => {
    // Generate next ID if not given
    let nextId = data.id;
    if (!nextId) {
      const numbers = members
        .map(m => parseInt(m.id.replace('HV', ''), 10))
        .filter(n => !isNaN(n));
      const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
      nextId = `HV${String(maxNum + 1).padStart(3, '0')}`;
    }

    const status = getStatusFromExpiry(data.ngayHetHan);
    const newMember: HocVien = {
      ...data,
      id: nextId,
      trangThai: status,
      soSlotTapBu: data.soSlotTapBu || 0,
      soBuoiDaTap: 0,
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${nextId}`
    };

    setMembers(prev => [newMember, ...prev]);
    addToast('success', 'Thêm Học Viên Mới', `Đã cấp thẻ thành công cho học viên ${newMember.hoTen} (${newMember.id}).`);
    return newMember;
  };

  const updateMemberNotes = (memberId: string, notes: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ghiChu: notes } : m));
    addToast('info', 'Cập Nhật Ghi Chú', 'Đã lưu ghi chú học viên thành công.');
  };

  const updateMemberProfile = (memberId: string, data: Partial<HocVien>) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      return {
        ...m,
        ...data,
        trangThai: data.ngayHetHan ? getStatusFromExpiry(data.ngayHetHan) : m.trangThai
      };
    }));
    addToast('success', 'Cập Nhật Hồ Sơ Hội Viên', 'Thông tin cá nhân và thể trạng của bạn đã được lưu thành công.');
  };

  const registerFaceId = (memberId: string, photoBase64OrUrl: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      return {
        ...m,
        faceIdPhoto: photoBase64OrUrl,
        hasFaceId: true,
        faceIdRegisteredAt: 'Vừa đăng ký (Hợp lệ)',
        avatar: photoBase64OrUrl // Also sync avatar to real photo
      };
    }));
    addToast(
      'success',
      'Đăng Ký Face ID Thành Công! 🛡️',
      'Dữ liệu nhận diện khuôn mặt sinh trắc học đã được mã hóa và kích hoạt cho cổng điểm danh Kiosk.'
    );
  };

  // Schedule Approval with Cross-Approval and Auto Slot Compensation
  const approveCancelSchedule = (scheduleId: string, isApproved: boolean, isManualOverride = false) => {
    const targetSchedule = schedules.find(s => s.id === scheduleId);
    if (!targetSchedule) return;

    if (isApproved) {
      // Set schedule to DA_DUYET_HUY
      setSchedules(prev => prev.map(s => s.id === scheduleId ? {
        ...s,
        trangThai: 'DA_DUYET_HUY',
        nguoiDuyet: `${activeTrainer.hoTen} (${activeTrainer.vaiTro})`
      } : s));

      // Auto compensate +1 slot bù to student
      setMembers(prev => prev.map(m => {
        if (m.id === targetSchedule.maHV) {
          return {
            ...m,
            soSlotTapBu: m.soSlotTapBu + 1
          };
        }
        return m;
      }));

      addToast(
        'success',
        isManualOverride ? 'Duyệt Hủy Khẩn Cấp (Manual Override)' : 'Đã Phê Duyệt Hủy Ca & Hoàn Slot',
        `HLV ${activeTrainer.hoTen} đã duyệt hủy ca [${targetSchedule.khungGio} - ${targetSchedule.ngay}]. Hệ thống tự động cộng +1 Buổi tập bù cho học viên ${targetSchedule.tenHV}.`
      );
    } else {
      setSchedules(prev => prev.map(s => s.id === scheduleId ? {
        ...s,
        trangThai: 'DAT_THANH_CONG'
      } : s));

      addToast(
        'warning',
        'Đã Từ Chối Hủy Ca',
        `Yêu cầu hủy ca của học viên ${targetSchedule.tenHV} đã bị từ chối. Ca tập tiếp tục theo lịch gốc.`
      );
    }
  };

  // Create PT Schedule with automatic conflict check
  const createSchedule = (data: Omit<LichHenPT, 'id'>): { success: boolean; error?: string } => {
    // Conflict check for same trainer at same date and timeslot
    const conflict = schedules.find(s => 
      s.maHLV === data.maHLV &&
      s.ngay === data.ngay &&
      s.khungGio === data.khungGio &&
      s.trangThai !== 'DA_DUYET_HUY'
    );

    if (conflict) {
      const err = `Trùng lịch! HLV ${data.tenHLV} đã có ca hẹn với học viên ${conflict.tenHV} trong khung giờ ${data.khungGio} ngày ${data.ngay}.`;
      addToast('error', 'Xung Đột Lịch Hẹn', err);
      return { success: false, error: err };
    }

    const nextId = `LH${String(schedules.length + 1).padStart(3, '0')}`;
    const newSchedule: LichHenPT = {
      ...data,
      id: nextId
    };

    setSchedules(prev => [newSchedule, ...prev]);
    addToast('success', 'Đặt Lịch PT Thành Công', `Đã xếp lịch cho ${data.tenHV} với HLV ${data.tenHLV} lúc ${data.khungGio} ngày ${data.ngay}.`);
    return { success: true };
  };

  // Therapy operations
  const updateTherapyPainScore = (recordId: string, newScore: number, note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setTherapyRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      return {
        ...r,
        thangDiemDauHienTai: newScore,
        lichSuDiemDau: [
          ...r.lichSuDiemDau,
          {
            ngay: today,
            diemDau: newScore,
            ghiChu: note || `Đánh giá lại điểm đau: ${newScore}/10`
          }
        ]
      };
    }));
    addToast('success', 'Cập Nhật Thang Điểm Đau', `Mức độ đau mới: ${newScore}/10. Đã lưu vào biểu đồ tiến trình.`);
  };

  const toggleExerciseCompleted = (recordId: string, exerciseId: string) => {
    setTherapyRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      return {
        ...r,
        baiTapVeNha: r.baiTapVeNha.map(bt => bt.id === exerciseId ? { ...bt, daHoanThanh: !bt.daHoanThanh } : bt)
      };
    }));
  };

  const addTherapyRecordSession = (
    recordId: string, 
    session: { diemDau: number; ghiChu: string; canNang?: number; baiTapThem?: string }
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setTherapyRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      return {
        ...r,
        canNang: session.canNang || r.canNang,
        thangDiemDauHienTai: session.diemDau,
        lichSuDiemDau: [
          ...r.lichSuDiemDau,
          {
            ngay: today,
            diemDau: session.diemDau,
            ghiChu: session.ghiChu
          }
        ]
      };
    }));
    addToast('success', 'Ghi Nhận Buổi Nắn Chỉnh', 'Đã lưu thông số buổi nắn chỉnh mới và cập nhật phác đồ.');
  };

  // Kiosk Check-In with Sound and Log
  const checkIn = (query: string): CheckInResult => {
    const clean = query.trim().toUpperCase();
    if (!clean) {
      soundEffects.playWarningBeep();
      return {
        success: false,
        member: null,
        daysRemaining: 0,
        message: 'Vui lòng nhập Mã học viên hoặc Số điện thoại!'
      };
    }

    const member = members.find(m => 
      m.id.toUpperCase() === clean || 
      m.id.toUpperCase() === `HV${clean.padStart(3, '0')}` ||
      m.soDienThoai.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );

    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Hôm nay';

    if (!member) {
      soundEffects.playWarningBeep();
      return {
        success: false,
        member: null,
        daysRemaining: 0,
        message: `Không tìm thấy học viên với thông tin "${query}". Vui lòng kiểm tra lại!`
      };
    }

    const daysRemaining = getDaysRemaining(member.ngayHetHan);

    if (daysRemaining < 0) {
      soundEffects.playWarningBeep();
      const newLog: CheckInLog = {
        id: 'CK' + Date.now(),
        maHV: member.id,
        tenHV: member.hoTen,
        thoiGian: nowStr,
        hopLe: false,
        ghiChu: `Gói tập hết hạn từ ${Math.abs(daysRemaining)} ngày trước`,
        avatar: member.avatar,
        nhom: member.nhom,
        soNgayConLai: daysRemaining,
        goiTap: member.goiTap
      };
      setCheckInLogs(prev => [newLog, ...prev.slice(0, 19)]);

      return {
        success: false,
        member,
        daysRemaining,
        message: 'Gói tập đã hết hạn! Vui lòng liên hệ HLV tại quầy để gia hạn và tiếp tục tập luyện.'
      };
    }

    // Success check-in!
    soundEffects.playSuccessChime();

    // Increment attendance
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, soBuoiDaTap: (m.soBuoiDaTap || 0) + 1 } : m));

    const isRed = daysRemaining <= 3;
    const newLog: CheckInLog = {
      id: 'CK' + Date.now(),
      maHV: member.id,
      tenHV: member.hoTen,
      thoiGian: nowStr,
      hopLe: true,
      ghiChu: isRed ? `Hợp lệ (Cảnh báo: Còn ${daysRemaining} ngày)` : `Check-in hợp lệ (Còn ${daysRemaining} ngày)`,
      avatar: member.avatar,
      nhom: member.nhom,
      soNgayConLai: daysRemaining,
      goiTap: member.goiTap
    };
    setCheckInLogs(prev => [newLog, ...prev.slice(0, 19)]);

    return {
      success: true,
      member,
      daysRemaining,
      isRedList: isRed,
      message: `Chào mừng ${member.hoTen}! Check-in thành công. Chúc bạn có buổi tập tràn đầy năng lượng!`
    };
  };

  // Face ID Check-in verification
  const checkInWithFaceId = (memberId: string): CheckInResult => {
    const member = members.find(m => m.id === memberId);
    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Hôm nay';

    if (!member) {
      soundEffects.playWarningBeep();
      return {
        success: false,
        member: null,
        daysRemaining: 0,
        message: 'Không tìm thấy hồ sơ Face ID tương ứng trên hệ thống!'
      };
    }

    if (!member.hasFaceId) {
      soundEffects.playWarningBeep();
      return {
        success: false,
        member,
        daysRemaining: getDaysRemaining(member.ngayHetHan),
        message: `Học viên ${member.hoTen} chưa đăng ký dữ liệu khuôn mặt Face ID! Vui lòng vào Cổng hội viên để chụp ảnh đăng ký hoặc nhập mã quầy.`
      };
    }

    const daysRemaining = getDaysRemaining(member.ngayHetHan);

    if (daysRemaining < 0) {
      soundEffects.playWarningBeep();
      const newLog: CheckInLog = {
        id: 'CK' + Date.now(),
        maHV: member.id,
        tenHV: member.hoTen,
        thoiGian: nowStr,
        hopLe: false,
        ghiChu: `Face ID trùng khớp nhưng thẻ hết hạn (${Math.abs(daysRemaining)} ngày trước)`,
        avatar: member.avatar,
        nhom: member.nhom,
        soNgayConLai: daysRemaining,
        goiTap: member.goiTap,
        faceIdVerified: true
      };
      setCheckInLogs(prev => [newLog, ...prev.slice(0, 19)]);

      return {
        success: false,
        member,
        daysRemaining,
        message: `Xác nhận đúng học viên ${member.hoTen} qua Face ID. Tuy nhiên gói tập đã hết hạn! Vui lòng liên hệ HLV gia hạn.`
      };
    }

    // Success Face ID match & Valid subscription!
    soundEffects.playSuccessChime();
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, soBuoiDaTap: (m.soBuoiDaTap || 0) + 1 } : m));

    const isRed = daysRemaining <= 3;
    const newLog: CheckInLog = {
      id: 'CK' + Date.now(),
      maHV: member.id,
      tenHV: member.hoTen,
      thoiGian: nowStr,
      hopLe: true,
      ghiChu: isRed ? `Face ID Hợp Lệ 100% (Cảnh báo: Còn ${daysRemaining} ngày)` : `Face ID Hợp Lệ 100% (Độ khớp 99.4%)`,
      avatar: member.avatar,
      nhom: member.nhom,
      soNgayConLai: daysRemaining,
      goiTap: member.goiTap,
      faceIdVerified: true
    };
    setCheckInLogs(prev => [newLog, ...prev.slice(0, 19)]);

    return {
      success: true,
      member,
      daysRemaining,
      isRedList: isRed,
      message: `Xác thực Face ID chính chủ thành công! Chào mừng ${member.hoTen} (${member.id}) vào tập luyện.`
    };
  };

  const resetToMockData = () => {
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.THERAPY);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.TRAINER);

    setMembers(INITIAL_MEMBERS.map(m => ({ ...m, trangThai: getStatusFromExpiry(m.ngayHetHan) })));
    setSchedules(INITIAL_SCHEDULES);
    setTherapyRecords(INITIAL_THERAPY_RECORDS);
    setCheckInLogs(INITIAL_CHECKIN_LOGS);
    setActiveTrainerState(INITIAL_TRAINERS[0]);

    addToast('info', 'Khôi Phục Dữ Liệu Gốc', 'Đã đặt lại toàn bộ Mock Data mẫu ban đầu cho HLV GYM Trảng Bom.');
  };

  return (
    <GymContext.Provider value={{
      members,
      trainers,
      schedules,
      therapyRecords,
      checkInLogs,
      activeTrainer,
      toasts,
      setActiveTrainer,
      removeToast,
      addToast,
      addMember,
      renewMember,
      updateMemberNotes,
      updateMemberProfile,
      registerFaceId,
      createSchedule,
      approveCancelSchedule,
      updateTherapyPainScore,
      toggleExerciseCompleted,
      addTherapyRecordSession,
      checkIn,
      checkInWithFaceId,
      resetToMockData,
      getDaysRemaining
    }}>
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};

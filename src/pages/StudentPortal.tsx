import React, { useState, useRef, useEffect } from 'react';
import { 
  CreditCard, 
  Activity, 
  Dumbbell, 
  Calculator, 
  CheckCircle2, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Camera, 
  Upload, 
  UserCheck, 
  ScanFace, 
  RefreshCw, 
  X, 
  AlertCircle,
  FileCheck2,
  Lock,
  Edit3
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import type { HocVien } from '../types';

export const StudentPortal: React.FC = () => {
  const { 
    members, 
    therapyRecords, 
    toggleExerciseCompleted, 
    updateMemberProfile,
    registerFaceId,
    getDaysRemaining 
  } = useGym();

  // Active student selection (default to HV005 who has therapy record, or HV001)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('HV005');
  const currentStudent = members.find(m => m.id === selectedStudentId) || members[0];

  // Tab navigation inside Student Portal
  const [activeTab, setActiveTab] = useState<'CARD' | 'PROFILE_FACEID' | 'SPINE' | 'EXERCISES' | 'MACRO'>('CARD');

  // Therapy record if available
  const studentTherapy = therapyRecords.find(t => t.maHV === currentStudent?.id) || therapyRecords[0];

  // Profile Edit Form State
  const [editForm, setEditForm] = useState({
    hoTen: currentStudent?.hoTen || '',
    soDienThoai: currentStudent?.soDienThoai || '',
    gioiTinh: currentStudent?.gioiTinh || 'Nam',
    ngaySinh: currentStudent?.ngaySinh || '1998-01-01',
    chieuCao: currentStudent?.chieuCao || 170,
    canNang: currentStudent?.canNang || 68,
    ghiChu: currentStudent?.ghiChu || ''
  });

  // Sync form when active student changes
  useEffect(() => {
    if (currentStudent) {
      setEditForm({
        hoTen: currentStudent.hoTen,
        soDienThoai: currentStudent.soDienThoai,
        gioiTinh: currentStudent.gioiTinh || 'Nam',
        ngaySinh: currentStudent.ngaySinh || '1998-01-01',
        chieuCao: currentStudent.chieuCao || 170,
        canNang: currentStudent.canNang || 68,
        ghiChu: currentStudent.ghiChu || ''
      });
    }
  }, [currentStudent]);

  // Face ID Camera & Upload States
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedFacePreview, setCapturedFacePreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when unmounting or switching tabs
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Ensure webcam stream is attached to video element once it is mounted
  useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(err => console.warn('Video play failed:', err));
    }
  }, [isCameraActive, cameraStream]);

  // Start live webcam for Face ID
  const startCamera = async () => {
    setCameraError(null);
    setCapturedFacePreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Webcam access error:', err);
      setCameraError('Không thể mở camera (thiết bị không có webcam hoặc bị từ chối quyền). Bạn có thể chọn tải ảnh chân dung lên từ máy tính!');
    }
  };

  // Capture face photo from webcam stream
  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedFacePreview(dataUrl);
      stopCamera();
    }
  };

  // Handle file upload for Face ID
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedFacePreview(event.target.result as string);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Face ID
  const handleSaveFaceId = () => {
    if (!capturedFacePreview || !currentStudent) return;
    registerFaceId(currentStudent.id, capturedFacePreview);
    setCapturedFacePreview(null);
  };

  // Submit Profile update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    updateMemberProfile(currentStudent.id, {
      hoTen: editForm.hoTen.trim(),
      soDienThoai: editForm.soDienThoai.trim(),
      gioiTinh: editForm.gioiTinh as 'Nam' | 'Nữ',
      ngaySinh: editForm.ngaySinh,
      chieuCao: Number(editForm.chieuCao),
      canNang: Number(editForm.canNang),
      ghiChu: editForm.ghiChu.trim()
    });
  };

  // Macro Calculator
  const [macroAge, setMacroAge] = useState<number>(25);
  const [macroGender, setMacroGender] = useState<'male' | 'female'>('male');
  const [macroWeight, setMacroWeight] = useState<number>(70);
  const [macroHeight, setMacroHeight] = useState<number>(172);
  const [macroActivity, setMacroActivity] = useState<number>(1.375);
  const [macroGoal, setMacroGoal] = useState<'MAINTAIN' | 'FAT_LOSS' | 'MUSCLE_GAIN' | 'REHAB'>('REHAB');

  const calculateTDEE = () => {
    let bmr = 10 * macroWeight + 6.25 * macroHeight - 5 * macroAge;
    bmr = macroGender === 'male' ? bmr + 5 : bmr - 161;
    let tdee = bmr * macroActivity;

    if (macroGoal === 'FAT_LOSS') tdee -= 400;
    if (macroGoal === 'MUSCLE_GAIN') tdee += 300;
    if (macroGoal === 'REHAB') tdee += 100;

    const calories = Math.round(tdee);
    const proteinGrams = Math.round((calories * 0.3) / 4);
    const carbGrams = Math.round((calories * 0.45) / 4);
    const fatGrams = Math.round((calories * 0.25) / 9);

    return { calories, proteinGrams, carbGrams, fatGrams, bmr: Math.round(bmr) };
  };

  const macroResult = calculateTDEE();
  const daysLeft = currentStudent ? getDaysRemaining(currentStudent.ngayHetHan) : 0;

  return (
    <div className="flex-1 bg-slate-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Fast Switcher */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentStudent?.faceIdPhoto || currentStudent?.avatar}
                alt={currentStudent?.hoTen}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md shrink-0"
              />
              {currentStudent?.hasFaceId && (
                <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full ring-2 ring-white" title="Đã bảo mật bằng Face ID">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Hội Viên HLV GYM
                </span>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {currentStudent?.id}
                </span>
                {currentStudent?.hasFaceId ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <ScanFace className="w-3 h-3 text-emerald-600" /> Face ID Kích Hoạt
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3 text-amber-600" /> Chưa Đăng Ký Face ID
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {currentStudent?.hoTen}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentStudent?.nhom === 'HSSV' ? 'Thẻ Học Sinh - Sinh Viên' : 'Thẻ Người Đi Làm'} &bull; SĐT: {currentStudent?.soDienThoai}
              </p>
            </div>
          </div>

          {/* Quick Member Switcher for Demo */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 pl-2">Đổi tài khoản xem thử:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                stopCamera();
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.hoTen} ({m.id} - {m.hasFaceId ? '✓ Đã có Face ID' : 'Chưa có Face ID'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
          <button
            id="tab-card"
            onClick={() => { setActiveTab('CARD'); stopCamera(); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'CARD'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Thẻ Hội Viên E-Card</span>
          </button>

          <button
            id="tab-profile-faceid"
            onClick={() => setActiveTab('PROFILE_FACEID')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'PROFILE_FACEID'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            <ScanFace className="w-4 h-4" />
            <span>Hồ Sơ & Face ID Bảo Mật</span>
            {currentStudent?.hasFaceId ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('SPINE'); stopCamera(); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'SPINE'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Hành Trình Cột Sống Của Bạn</span>
          </button>

          <button
            onClick={() => { setActiveTab('EXERCISES'); stopCamera(); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'EXERCISES'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Bài Tập Bổ Trợ Tại Nhà</span>
          </button>

          <button
            onClick={() => { setActiveTab('MACRO'); stopCamera(); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'MACRO'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Tính Macro & Calo Dinh Dưỡng</span>
          </button>
        </div>

        {/* Tab 1: E-Membership Card */}
        {activeTab === 'CARD' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* The E-Card (7 cols) */}
            <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900">Thẻ Tập Kỹ Thuật Số</h3>
                <button
                  onClick={() => setActiveTab('PROFILE_FACEID')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa Thông Tin & Face ID</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-6">Đưa mã QR này vào camera quầy Kiosk hoặc dùng nhận diện khuôn mặt Face ID để check-in</p>

              {/* Luxury Emerald Card */}
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-tr from-emerald-800 via-teal-700 to-slate-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8 relative">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                      HLV GYM &bull; TRẢNG BOM
                    </span>
                    <h4 className="text-2xl font-black tracking-tight mt-1">{currentStudent?.hoTen}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentStudent?.hasFaceId && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                        <ScanFace className="w-3 h-3" /> Face ID
                      </span>
                    )}
                    <span className="font-mono text-sm font-black px-3 py-1 rounded-xl bg-white/20 backdrop-blur-xs border border-white/20">
                      {currentStudent?.id}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/95 p-5 rounded-2xl text-slate-900 shadow-md mb-6">
                  {/* QR SVG */}
                  <div className="w-28 h-28 border-4 border-slate-900 p-1.5 rounded-xl flex flex-col justify-between shrink-0">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 bg-slate-900 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white"></div>
                      </div>
                      <div className="w-6 h-6 bg-slate-900 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white"></div>
                      </div>
                    </div>
                    <div className="text-center font-mono font-black text-[11px] text-slate-800">
                      {currentStudent?.id}
                    </div>
                    <div className="flex justify-between">
                      <div className="w-6 h-6 bg-slate-900 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white"></div>
                      </div>
                      <div className="w-6 h-6 border-2 border-slate-900 flex items-center justify-center">
                        <div className="w-2 h-2 bg-slate-900"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-slate-900">Mã Quét Tự Động Tại Quầy</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Chỉ hợp lệ khi thiết bị kết nối vào mạng Wi-Fi quầy HLV GYM Trảng Bom (Bảo mật chống gian lận).
                    </p>
                    {currentStudent?.hasFaceId ? (
                      <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 justify-center sm:justify-start pt-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Bạn đã kích hoạt Face ID: Có thể quét mặt trực tiếp tại Kiosk!
                      </p>
                    ) : (
                      <p className="text-[11px] text-amber-700 font-bold flex items-center gap-1 justify-center sm:justify-start pt-1">
                        <ScanFace className="w-3.5 h-3.5" /> Chưa kích hoạt Face ID: Hãy đăng ký khuôn mặt để điểm danh 1-chạm.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-emerald-300 text-[10px] block font-bold">GÓI TẬP</span>
                    <span className="font-bold text-white text-sm">
                      {currentStudent?.goiTap === 'GYM01' ? 'Gym Tự Do (Tháng)' : 'PT Trị Liệu 1:1'}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-300 text-[10px] block font-bold">NGÀY HẾT HẠN</span>
                    <span className="font-bold text-white text-sm">{currentStudent?.ngayHetHan}</span>
                  </div>
                </div>

                {currentStudent && currentStudent.soSlotTapBu > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Ca tập bù tích lũy do xin hoãn hợp lệ:
                    </span>
                    <span className="font-black text-amber-300 text-sm">+{currentStudent.soSlotTapBu} buổi bù</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Summary & Quick Actions (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Tình Trạng Thẻ Hiện Tại</h3>
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Thời gian còn lại:</span>
                  <span className={`text-sm font-black ${daysLeft <= 3 ? 'text-amber-600' : 'text-emerald-700'}`}>
                    {daysLeft >= 0 ? `Còn ${daysLeft} ngày` : `Đã hết hạn ${Math.abs(daysLeft)} ngày`}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Số buổi đã điểm danh:</span>
                  <span className="text-sm font-black text-slate-900">
                    {currentStudent?.soBuoiDaTap || 0} buổi tập
                  </span>
                </div>

                {/* Face ID Status Card */}
                <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  currentStudent?.hasFaceId 
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <ScanFace className="w-4 h-4" />
                      Bảo Mật Sinh Trắc Học Face ID:
                    </span>
                    <span className={`font-black text-[11px] px-2 py-0.5 rounded-full ${
                      currentStudent?.hasFaceId ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                    }`}>
                      {currentStudent?.hasFaceId ? 'Đã Kích Hoạt' : 'Chưa Đăng Ký'}
                    </span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-slate-600">
                    {currentStudent?.hasFaceId
                      ? 'Khuôn mặt của bạn đã được đăng ký vào hệ thống quầy. Khi tới phòng tập, hệ thống sẽ tự động nhận diện và cho phép vào tập.'
                      : 'Đăng ký khuôn mặt giúp bạn không cần mang theo điện thoại hay thẻ nhựa, hệ thống quét mặt và xác nhận đúng chủ thẻ mới cho vào.'}
                  </p>
                  <button
                    onClick={() => setActiveTab('PROFILE_FACEID')}
                    className="w-full py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs mt-1"
                  >
                    {currentStudent?.hasFaceId ? 'Xem Dữ Liệu Face ID' : 'Chụp Ảnh Đăng Ký Ngay'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Profile & Face ID Security (NEW!) */}
        {activeTab === 'PROFILE_FACEID' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Col 1: Face ID Camera & Registration (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ScanFace className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Bảo Mật Sinh Trắc Học Face ID
                    </h3>
                    <p className="text-xs text-slate-500">
                      Xác nhận đúng học viên chính chủ khi đến quầy tập luyện
                    </p>
                  </div>
                </div>

                {currentStudent?.hasFaceId && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Đã Kích Hoạt
                  </span>
                )}
              </div>

              {/* Current Face ID Display / Camera Viewfinder */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 flex flex-col items-center justify-center text-white shadow-inner">
                {/* 1. Live Camera Stream */}
                {isCameraActive && (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                    />

                    {/* Biometric Face Reticle Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-60 border-2 border-dashed border-emerald-400/80 rounded-[40%] relative animate-pulse">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Căn chỉnh khuôn mặt vào khung
                        </div>
                        {/* Scanning Laser Line */}
                        <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#10B981] animate-bounce" />
                      </div>
                    </div>

                    {/* Camera Capture Controls */}
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 px-4">
                      <button
                        type="button"
                        onClick={capturePhotoFromCamera}
                        className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>CHỤP ẢNH FACE ID</span>
                      </button>

                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs border border-white/20 transition-colors"
                      >
                        Đóng Camera
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Captured Preview (Awaiting confirmation) */}
                {!isCameraActive && capturedFacePreview && (
                  <div className="relative w-full h-full">
                    <img
                      src={capturedFacePreview}
                      alt="Ảnh vừa chụp"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
                      <span className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Xem trước ảnh khuôn mặt vừa chụp/tải lên
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleSaveFaceId}
                          className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>LƯU DỮ LIỆU FACE ID</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCapturedFacePreview(null)}
                          className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
                        >
                          Chụp Lại
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Existing Face ID Photo */}
                {!isCameraActive && !capturedFacePreview && currentStudent?.hasFaceId && (
                  <div className="relative w-full h-full group">
                    <img
                      src={currentStudent.faceIdPhoto}
                      alt={currentStudent.hoTen}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mb-3">
                        <ScanFace className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-bold text-white">Đã Đăng Ký Khuôn Mặt</h4>
                      <p className="text-xs text-slate-300 max-w-xs mt-1">
                        Hệ thống đã mã hóa khuôn mặt của bạn để quầy Kiosk tự động nhận diện chính chủ.
                      </p>
                      <span className="text-[11px] font-mono text-emerald-400 bg-slate-900/80 px-3 py-1 rounded-full border border-emerald-500/30 mt-3">
                        Đăng ký: {currentStudent.faceIdRegisteredAt || '10 ngày trước'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. Not yet registered placeholder */}
                {!isCameraActive && !capturedFacePreview && !currentStudent?.hasFaceId && (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <ScanFace className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-white">Chưa Có Dữ Liệu Face ID</h4>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Chụp trực tiếp bằng camera hoặc tải ảnh chân dung lên để kích hoạt tính năng quét mặt vào phòng tập.
                    </p>
                  </div>
                )}
              </div>

              {/* Camera Error Message if any */}
              {cameraError && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{cameraError}</p>
                </div>
              )}

              {/* Action Buttons: Open Camera vs Upload Image */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={startCamera}
                  className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>{currentStudent?.hasFaceId ? 'Quét / Chụp Lại Mặt' : 'Mở Camera Chụp Ảnh'}</span>
                </button>

                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Tải Ảnh Chân Dung</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Nguyên lý bảo mật Face ID tại HLV GYM Trảng Bom:
                </p>
                <p className="leading-relaxed text-[11px]">
                  Khi học viên đến tập, màn hình Kiosk sẽ kích hoạt camera AI để đối chiếu vector khuôn mặt với ảnh Face ID đã lưu. Nếu khớp chính chủ và gói tập còn hạn, cửa/quầy sẽ tự động mở và điểm danh thành công mà không sợ bị người khác dùng trộm thẻ.
                </p>
              </div>
            </div>

            {/* Col 2: Edit Member Information Form (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Chỉnh Sửa Thông Tin Cá Nhân
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật số điện thoại, thể trạng và mục tiêu tập luyện
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                {/* Họ và Tên */}
                <div>
                  <label className="block font-bold text-slate-600 uppercase mb-1">
                    Họ và Tên Hội Viên *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.hoTen}
                    onChange={(e) => setEditForm({ ...editForm, hoTen: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Số Điện Thoại */}
                <div>
                  <label className="block font-bold text-slate-600 uppercase mb-1">
                    Số Điện Thoại Liên Hệ & Check-in *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.soDienThoai}
                    onChange={(e) => setEditForm({ ...editForm, soDienThoai: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Giới Tính & Ngày Sinh */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">Giới Tính</label>
                    <select
                      value={editForm.gioiTinh}
                      onChange={(e) => setEditForm({ ...editForm, gioiTinh: e.target.value as 'Nam' | 'Nữ' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium"
                    >
                      <option value="Nam">Nam Giới</option>
                      <option value="Nữ">Nữ Giới</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">Ngày Sinh</label>
                    <input
                      type="date"
                      value={editForm.ngaySinh}
                      onChange={(e) => setEditForm({ ...editForm, ngaySinh: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                {/* Chiều Cao & Cân Nặng */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">Chiều Cao (cm)</label>
                    <input
                      type="number"
                      value={editForm.chieuCao}
                      onChange={(e) => setEditForm({ ...editForm, chieuCao: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">Cân Nặng (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editForm.canNang}
                      onChange={(e) => setEditForm({ ...editForm, canNang: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Ghi chú sức khỏe / thể trạng */}
                <div>
                  <label className="block font-bold text-slate-600 uppercase mb-1">
                    Ghi Chú Thể Trạng / Tiền Sử Chấn Thương
                  </label>
                  <textarea
                    rows={3}
                    placeholder="VD: Đau thắt lưng khi ngồi lâu, thoái hóa đốt sống cổ nhẹ..."
                    value={editForm.ghiChu}
                    onChange={(e) => setEditForm({ ...editForm, ghiChu: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>LƯU CẬP NHẬT THÔNG TIN</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Tab 3: Spine Journey Before / After */}
        {activeTab === 'SPINE' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  Hành Trình Cột Sống Của Bạn
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Quan sát sự thay đổi tư thế và mức độ giảm đau qua phác đồ trị liệu
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  Điểm đau hiện tại: {studentTherapy?.thangDiemDauHienTai || 3} / 10 (VAS)
                </span>
              </div>
            </div>

            {/* Before / After Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 inline-block">
                  Tư thế trước nắn chỉnh ({studentTherapy?.lichSuDiemDau[0]?.diemDau || 8}/10)
                </span>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                  <img
                    src={studentTherapy?.anhTruoc}
                    alt="Trước nắn chỉnh"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Khung chậu nghiêng trước, gù lưng trên gây đau nhức thắt lưng khi ngồi lâu.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 inline-block">
                  Tư thế hiện tại ({studentTherapy?.thangDiemDauHienTai || 3}/10)
                </span>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                  <img
                    src={studentTherapy?.anhSau}
                    alt="Hiện tại"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Cột sống thẳng hàng, cơ lưng dựng cân bằng, không còn nhức mỏi khi vận động.
                </p>
              </div>
            </div>

            {/* Pain History log */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Lịch Sử Ghi Nhận Điểm Đau</h4>
              <div className="space-y-3">
                {studentTherapy?.lichSuDiemDau.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/60 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{entry.ngay}:</span>{' '}
                      <span className="text-slate-600">{entry.ghiChu}</span>
                    </div>
                    <span className="font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                      {entry.diemDau} / 10
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Home Rehabilitation Exercises */}
        {activeTab === 'EXERCISES' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-emerald-600" />
                  Bài Tập Bổ Trợ Phục Hồi Tại Nhà
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Được chỉ định bởi HLV Nguyễn Quốc Thái. Tích chọn để duy trì chuỗi tập luyện (Streak)!
                </p>
              </div>

              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  Đã hoàn thành:{' '}
                  {studentTherapy?.baiTapVeNha.filter(b => b.daHoanThanh).length || 0} / {studentTherapy?.baiTapVeNha.length || 0}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentTherapy?.baiTapVeNha.map((ex) => (
                <div
                  key={ex.id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 ${
                    ex.daHoanThanh
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {ex.thoiLuong}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">{ex.ten}</h4>
                    </div>

                    <button
                      onClick={() => toggleExerciseCompleted(studentTherapy.id, ex.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        ex.daHoanThanh
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{ex.daHoanThanh ? 'Đã Xong' : 'Chưa Tập'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ex.moTa}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> An toàn cột sống
                    </span>
                    <span>Tập nhẹ nhàng, hít thở đều</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Macro & Nutrition Calculator */}
        {activeTab === 'MACRO' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Parameters (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  Công Cụ Tính Calo & Macro Chuẩn Khoa Học
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Phương trình Mifflin-St Jeor tối ưu cho thể hình & phục hồi mô cơ khớp
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Gender */}
                <div>
                  <label className="block font-bold text-slate-600 uppercase mb-1.5">Giới Tính</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMacroGender('male')}
                      className={`py-2.5 rounded-xl font-bold transition-all ${
                        macroGender === 'male' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Nam Giới
                    </button>
                    <button
                      type="button"
                      onClick={() => setMacroGender('female')}
                      className={`py-2.5 rounded-xl font-bold transition-all ${
                        macroGender === 'female' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Nữ Giới
                    </button>
                  </div>
                </div>

                {/* Weight & Height */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1.5">Cân Nặng (kg)</label>
                    <input
                      type="number"
                      value={macroWeight}
                      onChange={(e) => setMacroWeight(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1.5">Chiều Cao (cm)</label>
                    <input
                      type="number"
                      value={macroHeight}
                      onChange={(e) => setMacroHeight(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Age & Activity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1.5">Tuổi</label>
                    <input
                      type="number"
                      value={macroAge}
                      onChange={(e) => setMacroAge(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1.5">Cường Độ Vận Động</label>
                    <select
                      value={macroActivity}
                      onChange={(e) => setMacroActivity(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value={1.2}>Ít vận động (Ngồi văn phòng)</option>
                      <option value={1.375}>Nhẹ (Tập 1-3 buổi/tuần)</option>
                      <option value={1.55}>Vừa (Tập 3-5 buổi/tuần)</option>
                      <option value={1.725}>Cao (Tập 6-7 buổi/tuần)</option>
                    </select>
                  </div>
                </div>

                {/* Goal */}
                <div>
                  <label className="block font-bold text-slate-600 uppercase mb-1.5">Mục Tiêu Tập Luyện</label>
                  <select
                    value={macroGoal}
                    onChange={(e) => setMacroGoal(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-emerald-800"
                  >
                    <option value="REHAB">Phục hồi cơ xương khớp & Giữ cân (+100 kcal phục hồi)</option>
                    <option value="FAT_LOSS">Giảm mỡ, săn chắc (-400 kcal)</option>
                    <option value="MUSCLE_GAIN">Tăng cơ, phát triển thể hình (+300 kcal)</option>
                    <option value="MAINTAIN">Duy trì vóc dáng (TDEE chuẩn)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Display (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    KẾT QUẢ DINH DƯỠNG MỖI NGÀY
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <h2 className="text-4xl sm:text-5xl font-black text-white">{macroResult.calories}</h2>
                    <span className="text-sm font-semibold text-slate-400">kcal / ngày</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    BMR cơ sở: {macroResult.bmr} kcal &bull; Mục tiêu: {macroGoal === 'REHAB' ? 'Phục hồi mô cơ' : macroGoal}
                  </p>
                </div>

                {/* Macro breakdown bars */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">ĐẠM (PROTEIN)</span>
                    <span className="text-2xl font-black text-white mt-1 block">{macroResult.proteinGrams}g</span>
                    <span className="text-[10px] text-slate-400">30% Calo</span>
                  </div>

                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
                    <span className="text-[10px] font-bold text-sky-400 uppercase block">TINH BỘT (CARB)</span>
                    <span className="text-2xl font-black text-white mt-1 block">{macroResult.carbGrams}g</span>
                    <span className="text-[10px] text-slate-400">45% Calo</span>
                  </div>

                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
                    <span className="text-[10px] font-bold text-amber-400 uppercase block">CHẤT BÉO (FAT)</span>
                    <span className="text-2xl font-black text-white mt-1 block">{macroResult.fatGrams}g</span>
                    <span className="text-[10px] text-slate-400">25% Calo</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-emerald-400">Lời khuyên từ HLV Võ Minh Quân:</p>
                  <p className="leading-relaxed text-[11px]">
                    Chia đều lượng đạm vào 3-4 bữa chính. Uống đủ 2-2.5 lít nước để bôi trơn đĩa đệm cột sống và phục hồi tốt nhất.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

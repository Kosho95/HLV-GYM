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
  Edit3,
  Flame,

  Timer,
  Plus,
  Trash2,
  History,
  ChevronRight,
  Award,
  QrCode,
  Wallet,
  Smartphone,
  Landmark,
  Receipt,
  CalendarDays,
  Copy,
  Clock
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import type { HocVien, ChiTietBaiTapLog, CongThanhToan } from '../types';

export const StudentPortal: React.FC = () => {
  const { 
    members, 
    trainers,
    therapyRecords, 
    toggleExerciseCompleted, 
    updateMemberProfile,
    registerFaceId,
    getDaysRemaining,
    workoutLogs,
    exerciseCatalog,
    addWorkoutLog,
    deleteWorkoutLog,
    calculateExerciseCalories,
    transactions,
    processOnlinePayment
  } = useGym();



  // Active student selection (default to HV005 who has therapy record, or HV001)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('HV005');
  const currentStudent = members.find(m => m.id === selectedStudentId) || members[0];

  // Tab navigation inside Student Portal
  const [activeTab, setActiveTab] = useState<'CARD' | 'PROFILE_FACEID' | 'PAYMENT' | 'SPINE' | 'EXERCISES' | 'MACRO' | 'WORKOUT_LOG'>('CARD');

  // Workout Logger State
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(exerciseCatalog[0]?.id || 'EX_LAT_PULLDOWN');
  const [inputSets, setInputSets] = useState<number>(4);
  const [inputReps, setInputReps] = useState<number>(12);
  const [inputWeightKg, setInputWeightKg] = useState<number>(35);
  const [inputDurationMin, setInputDurationMin] = useState<number>(30);
  const [inputIntensity, setInputIntensity] = useState<'THAP' | 'TRUNG_BINH' | 'CAO'>('TRUNG_BINH');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [currentSessionItems, setCurrentSessionItems] = useState<ChiTietBaiTapLog[]>([]);

  // Online Payment State & Checkout Modal
  const [selectedGateway, setSelectedGateway] = useState<CongThanhToan>('VIETQR');
  const [paymentPurpose, setPaymentPurpose] = useState<'GIA_HAN_GOI' | 'DAT_CA_PT_1_1'>('GIA_HAN_GOI');
  const [selectedPlanMonths, setSelectedPlanMonths] = useState<number>(1);
  const [selectedTrainerForPT, setSelectedTrainerForPT] = useState<string>(trainers[0]?.id || 'HLV01');
  const [ptDate, setPtDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [ptTimeSlot, setPtTimeSlot] = useState<string>('08:00 - 09:30');
  const [ptSessionContent, setPtSessionContent] = useState<string>('Tập chuyên sâu phục hồi đốt sống lưng & Kéo dãn cơ');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [completedPaymentTx, setCompletedPaymentTx] = useState<any | null>(null);



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

  // Selected exercise details
  const activeExerciseObj = exerciseCatalog.find(e => e.id === selectedExerciseId) || exerciseCatalog[0];

  // Realtime preview of exercise calorie before adding
  const previewItemCalo = activeExerciseObj ? calculateExerciseCalories(activeExerciseObj, {
    soHiep: inputSets,
    soRep: inputReps,
    mucTaKg: inputWeightKg,
    thoiGianPhut: inputDurationMin,
    cuongDo: inputIntensity,
    canNangKg: currentStudent?.canNang || 68
  }) : 0;

  // Add exercise to current workout session draft
  const handleAddExerciseToSession = () => {
    if (!activeExerciseObj) return;

    const newItem: ChiTietBaiTapLog = {
      id: 'EX_ITEM_' + Date.now(),
      tenBaiTap: activeExerciseObj.ten,
      loai: activeExerciseObj.loai,
      nhomCo: activeExerciseObj.nhomCo,
      soHiep: activeExerciseObj.donVi === 'REPS_SETS' ? inputSets : undefined,
      soRep: activeExerciseObj.donVi === 'REPS_SETS' ? inputReps : undefined,
      mucTaKg: activeExerciseObj.donVi === 'REPS_SETS' ? inputWeightKg : undefined,
      thoiGianPhut: activeExerciseObj.donVi === 'DURATION' ? inputDurationMin : undefined,
      cuongDo: activeExerciseObj.donVi === 'DURATION' ? inputIntensity : undefined,
      caloTieuHao: previewItemCalo
    };

    setCurrentSessionItems(prev => [...prev, newItem]);
  };

  const handleRemoveExerciseFromSession = (itemId: string) => {
    setCurrentSessionItems(prev => prev.filter(i => i.id !== itemId));
  };

  const totalSessionCalories = currentSessionItems.reduce((sum, item) => sum + item.caloTieuHao, 0);
  const totalSessionMinutes = currentSessionItems.reduce((sum, item) => {
    if (item.thoiGianPhut) return sum + item.thoiGianPhut;
    if (item.soHiep) return sum + Math.round(item.soHiep * 2.5); // Ước lượng ~2.5 phút/set tập tạ
    return sum + 10;
  }, 0);

  const handleSaveWorkoutSession = () => {
    if (currentSessionItems.length === 0 || !currentStudent) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    addWorkoutLog({
      maHV: currentStudent.id,
      ngayTap: dateStr,
      thoiGian: timeStr,
      tongCalo: totalSessionCalories,
      tongThoiGianPhut: totalSessionMinutes,
      ghiChu: sessionNotes.trim() || undefined,
      danhSachBaiTap: currentSessionItems
    });

    // Reset draft
    setCurrentSessionItems([]);
    setSessionNotes('');
  };

  const studentWorkoutLogs = workoutLogs.filter(w => w.maHV === currentStudent?.id);
  const totalBurnedAllTime = studentWorkoutLogs.reduce((sum, w) => sum + w.tongCalo, 0);

  // Pricing calculation
  const monthlyFee = currentStudent?.nhom === 'HSSV' ? 250000 : 300000;
  const renewalDiscount = selectedPlanMonths === 3 ? 0.05 : selectedPlanMonths === 6 ? 0.1 : 0;
  const renewalSubtotal = monthlyFee * selectedPlanMonths;
  const renewalTotal = Math.round(renewalSubtotal * (1 - renewalDiscount));

  const ptSessionPrice = 350000; // 350k/ca 1-1 trị liệu & nắn chỉnh cột sống

  const currentPayAmount = paymentPurpose === 'GIA_HAN_GOI' ? renewalTotal : ptSessionPrice;

  const studentTransactions = transactions.filter(t => t.maHV === currentStudent?.id);

  // Trigger checkout modal
  const openCheckout = (purpose: 'GIA_HAN_GOI' | 'DAT_CA_PT_1_1') => {
    setPaymentPurpose(purpose);
    setCompletedPaymentTx(null);
    setShowCheckoutModal(true);
  };

  // Simulate payment processing through VietQR / MoMo / VNPay / ZaloPay API
  const handleExecuteOnlinePayment = () => {
    if (!currentStudent) return;
    setIsProcessingPayment(true);

    const activeTrainerObj = trainers.find(t => t.id === selectedTrainerForPT) || trainers[0];

    setTimeout(() => {
      try {
        const result = processOnlinePayment({
          maHV: currentStudent.id,
          congThanhToan: selectedGateway,
          mucDich: paymentPurpose,
          soTien: currentPayAmount,
          thongTinPT: paymentPurpose === 'DAT_CA_PT_1_1' ? {
            maHLV: activeTrainerObj.id,
            tenHLV: activeTrainerObj.hoTen,
            ngay: ptDate,
            khungGio: ptTimeSlot,
            noiDungTap: ptSessionContent
          } : undefined,
          thongTinGoi: paymentPurpose === 'GIA_HAN_GOI' ? {
            tenGoi: currentStudent.nhom === 'HSSV' ? 'Thẻ Gym Học Sinh - Sinh Viên' : 'Thẻ Gym Người Đi Làm',
            soThang: selectedPlanMonths
          } : undefined
        });

        setIsProcessingPayment(false);
        setCompletedPaymentTx(result.transaction);
      } catch (err: any) {
        setIsProcessingPayment(false);
        console.error(err);
      }
    }, 1800);
  };



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
            id="tab-payment"
            onClick={() => { setActiveTab('PAYMENT'); stopCamera(); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'PAYMENT'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 ring-2 ring-blue-300'
                : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 border border-slate-100'
            }`}
          >
            <Wallet className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
            <span>Thanh Toán Online (QR / Ví)</span>
            {daysLeft <= 3 && (
              <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full animate-bounce">
                Hết hạn
              </span>
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
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'MACRO'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Tính Macro & Dinh Dưỡng</span>
          </button>

          <button
            id="tab-workout-log"
            onClick={() => { setActiveTab('WORKOUT_LOG'); stopCamera(); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'WORKOUT_LOG'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-300'
                : 'bg-white text-slate-600 hover:text-orange-600 hover:bg-orange-50/50 border border-slate-100'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-500 group-hover:text-orange-600" />
            <span>Nhật Ký Tập & Calo Tiêu Hao</span>
            {studentWorkoutLogs.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${activeTab === 'WORKOUT_LOG' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'}`}>
                {studentWorkoutLogs.length}
              </span>
            )}
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

                {/* Online Payment & Renewal CTA Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-slate-900 text-white shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200">
                      CỔNG THANH TOÁN ONLINE
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                      VietQR / MoMo / VNPay
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-white">Gia Hạn Gói Hoặc Đặt Ca PT 1:1</h4>
                    <p className="text-[11px] text-blue-100 leading-relaxed mt-0.5">
                      Thanh toán quét mã trực tuyến tức thì không cần tiền mặt tại quầy. Thẻ tự động cộng ngày sau khi khớp lệnh.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => openCheckout('GIA_HAN_GOI')}
                      className="py-2.5 px-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                      <span>Gia Hạn Thẻ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openCheckout('DAT_CA_PT_1_1')}
                      className="py-2.5 px-3 rounded-xl bg-blue-400/30 hover:bg-blue-400/40 border border-white/25 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>Đặt Ca PT 1:1</span>
                    </button>
                  </div>
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

        {/* Tab 6: Workout Logging & Calorie Tracker */}
        {activeTab === 'WORKOUT_LOG' && (
          <div className="space-y-8">
            
            {/* Header summary banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-600/20">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
                    <span>Bộ Đếm Năng Lượng Tiêu Hao HLV GYM</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Nhập Bài Tập & Tính Calo Tự Động
                  </h2>
                  <p className="text-xs sm:text-sm text-orange-100 max-w-xl mt-1">
                    Hệ thống tính toán chuẩn xác dựa trên số hiệp, rep, mức tạ và thời gian cardio (theo chỉ số MET và cơ chế phục hồi cơ thể).
                  </p>
                </div>

                {/* Quick stats badge */}
                <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                  <div className="text-center px-2">
                    <span className="text-[10px] font-bold uppercase text-orange-200 block">Tổng Calo Đã Đốt</span>
                    <span className="text-2xl sm:text-3xl font-black text-white">{totalBurnedAllTime}</span>
                    <span className="text-[10px] text-orange-200 block">kcal tích lũy</span>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center px-2">
                    <span className="text-[10px] font-bold uppercase text-orange-200 block">Số Buổi Đã Lưu</span>
                    <span className="text-2xl sm:text-3xl font-black text-white">{studentWorkoutLogs.length}</span>
                    <span className="text-[10px] text-orange-200 block">buổi tập</span>
                  </div>
                </div>
              </div>

              {/* Background decorative glow */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Main Interactive Grid: Form Builder & Current Session Cart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Input: 7 cols */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Thêm Động Tác Vừa Tập
                      </h3>
                      <p className="text-xs text-slate-500">
                        Chọn bài tập tạ hoặc cardio leo dốc máy chạy để tính calo
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                    Cân nặng: {currentStudent?.canNang || 68} kg
                  </span>
                </div>

                <div className="space-y-5">
                  {/* Select Exercise from catalog */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Chọn Bài Tập / Thiết Bị
                    </label>
                    <select
                      value={selectedExerciseId}
                      onChange={(e) => {
                        setSelectedExerciseId(e.target.value);
                        const found = exerciseCatalog.find(x => x.id === e.target.value);
                        if (found) {
                          if (found.donVi === 'DURATION') {
                            setInputDurationMin(found.id === 'EX_INCLINE_TREADMILL' ? 30 : 20);
                          } else {
                            if (found.id === 'EX_LAT_PULLDOWN') { setInputSets(4); setInputReps(12); setInputWeightKg(35); }
                            if (found.id === 'EX_BENCH_PRESS') { setInputSets(4); setInputReps(10); setInputWeightKg(50); }
                            if (found.id === 'EX_BARBELL_SQUAT') { setInputSets(4); setInputReps(10); setInputWeightKg(60); }
                          }
                        }
                      }}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    >
                      <optgroup label="TẬP TẠ & KHÁNG LỰC (STRENGTH)">
                        {exerciseCatalog.filter(e => e.loai === 'STRENGTH').map(e => (
                          <option key={e.id} value={e.id}>{e.ten} &bull; {e.nhomCo}</option>
                        ))}
                      </optgroup>
                      <optgroup label="CARDIO & TIM MẠCH (CHẠY BỘ / LEO DỐC)">
                        {exerciseCatalog.filter(e => e.loai === 'CARDIO').map(e => (
                          <option key={e.id} value={e.id}>{e.ten} &bull; {e.nhomCo}</option>
                        ))}
                      </optgroup>
                      <optgroup label="HIIT & PHỤC HỒI CƠ LÕI">
                        {exerciseCatalog.filter(e => e.loai === 'HIIT_FUNCTIONAL').map(e => (
                          <option key={e.id} value={e.id}>{e.ten} &bull; {e.nhomCo}</option>
                        ))}
                      </optgroup>
                    </select>

                    {activeExerciseObj && (
                      <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span>{activeExerciseObj.moTa}</span>
                      </p>
                    )}
                  </div>

                  {/* Dynamic inputs depending on unit type */}
                  {activeExerciseObj?.donVi === 'REPS_SETS' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                      <div>
                        <label className="block text-xs font-bold text-orange-950 uppercase mb-1">
                          Số Hiệp (Sets)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={inputSets}
                            onChange={(e) => setInputSets(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-white font-black text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold pointer-events-none">hiệp</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-orange-950 uppercase mb-1">
                          Số Rep / Hiệp
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={inputReps}
                            onChange={(e) => setInputReps(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-white font-black text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold pointer-events-none">reps</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-orange-950 uppercase mb-1">
                          Mức Tạ (Kg)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={300}
                            step={2.5}
                            value={inputWeightKg}
                            onChange={(e) => setInputWeightKg(Math.max(0, Number(e.target.value)))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-white font-black text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold pointer-events-none">kg</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                      <div>
                        <label className="block text-xs font-bold text-amber-950 uppercase mb-1">
                          Thời Lượng Tập (Phút)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={1}
                            max={180}
                            value={inputDurationMin}
                            onChange={(e) => setInputDurationMin(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 bg-white font-black text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold pointer-events-none">phút</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-950 uppercase mb-1">
                          Cường Độ / Độ Dốc
                        </label>
                        <select
                          value={inputIntensity}
                          onChange={(e) => setInputIntensity(e.target.value as any)}
                          className="w-full px-3 py-2.5 rounded-xl border border-amber-200 bg-white font-bold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="THAP">Nhẹ (Dốc 3-5%, Vừa đi vừa thở đều)</option>
                          <option value="TRUNG_BINH">Vừa (Dốc 8-10%, Vã mồ hôi đều)</option>
                          <option value="CAO">Cao (Dốc 12-15% hoặc chạy tốc độ cao)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Realtime Calorie Estimator Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <Flame className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Ước tính tiêu hao động tác này</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-amber-400">~{previewItemCalo}</span>
                          <span className="text-xs text-slate-300 font-semibold">kcal</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddExerciseToSession}
                      className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>THÊM VÀO BUỔI TẬP</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Session Cart / Summary: 5 cols */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Buổi Tập Hôm Nay
                    </h3>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                    {currentSessionItems.length} bài đã thêm
                  </span>
                </div>

                {/* Session total stats */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-orange-800 block">Tổng Năng Lượng Đốt</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl font-black text-orange-600">{totalSessionCalories}</span>
                      <span className="text-xs font-bold text-orange-800">kcal</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-800 block">Thời Lượng Ước Tính</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl font-black text-amber-700">~{totalSessionMinutes}</span>
                      <span className="text-xs font-bold text-amber-800">phút</span>
                    </div>
                  </div>
                </div>

                {/* Exercises list in cart */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {currentSessionItems.length === 0 ? (
                    <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
                      <Dumbbell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-500">Chưa có bài tập nào trong buổi này</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Chọn bài tập bên trái và bấm "Thêm vào buổi tập"</p>
                    </div>
                  ) : (
                    currentSessionItems.map((item, idx) => (
                      <div 
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-black text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-800">{item.tenBaiTap}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 pl-6.5">
                            {item.loai === 'STRENGTH' 
                              ? `${item.soHiep} hiệp x ${item.soRep} rep (${item.mucTaKg}kg)` 
                              : `${item.thoiGianPhut} phút (${item.cuongDo === 'CAO' ? 'Dốc cao' : item.cuongDo === 'TRUNG_BINH' ? 'Dốc vừa' : 'Nhẹ'})`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
                            +{item.caloTieuHao} kcal
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExerciseFromSession(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Xóa bài này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Session Notes */}
                {currentSessionItems.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Ghi Chú Cảm Nhận / Khớp / HLV (Không bắt buộc)
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Cột sống ổn định, hoàn thành tốt buổi tập chân..."
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveWorkoutSession}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Flame className="w-4 h-4 fill-white" />
                      <span>LƯU NHẬT KÝ BUỔI TẬP VÀO HỒ SƠ</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Workout History Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <History className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Lịch Sử Tập Luyện Của {currentStudent?.hoTen}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ghi nhận toàn bộ các buổi tập kèm thống kê calo tiêu hao chi tiết
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                    {studentWorkoutLogs.length} Bản Ghi
                  </span>
                </div>
              </div>

              {studentWorkoutLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Dumbbell className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold">Chưa có nhật ký buổi tập nào cho học viên này.</p>
                  <p className="text-xs">Hãy thêm bài tập và lưu buổi tập ở phần trên nhé!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentWorkoutLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-5 border border-slate-200/80 transition-all space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                              📅 {log.ngayTap} ({log.thoiGian})
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                              <Timer className="w-3.5 h-3.5" /> {log.tongThoiGianPhut} phút
                            </span>
                          </div>
                          {log.ghiChu && (
                            <p className="text-xs text-slate-600 italic mt-2 bg-white/60 p-2 rounded-xl border border-slate-100">
                              "{log.ghiChu}"
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-orange-600 bg-orange-100/70 px-2.5 py-1 rounded-xl flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-orange-500" /> {log.tongCalo} kcal
                          </span>
                        </div>
                      </div>

                      {/* Exercises breakdown */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Chi Tiết Các Bài Tập:
                        </span>
                        <div className="space-y-1">
                          {log.danhSachBaiTap.map((ex) => (
                            <div key={ex.id} className="flex items-center justify-between text-xs py-0.5">
                              <span className="font-semibold text-slate-700 flex items-center gap-1">
                                <ChevronRight className="w-3 h-3 text-orange-500" />
                                {ex.tenBaiTap}
                                <span className="text-[10px] text-slate-400">
                                  ({ex.loai === 'STRENGTH' ? `${ex.soHiep}x${ex.soRep} (${ex.mucTaKg}kg)` : `${ex.thoiGianPhut}p`})
                                </span>
                              </span>
                              <span className="font-bold text-slate-600">+{ex.caloTieuHao} kcal</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => deleteWorkoutLog(log.id)}
                          className="text-[11px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa bản ghi này
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 3: Online Payment Gateways (VietQR, MoMo, VNPay, ZaloPay) */}
        {activeTab === 'PAYMENT' && (

          <div className="space-y-8">
            
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-700/20">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    <Wallet className="w-4 h-4 text-sky-300" />
                    <span>Cổng Thanh Toán Điện Tử 24/7 &bull; Không Cần Tiền Mặt</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Gia Hạn Thẻ & Đặt Lịch PT 1-Kèm-1 Trực Tuyến
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
                    Hỗ trợ chuẩn kết nối liên ngân hàng VietQR NAPAS 247, ví điện tử MoMo, VNPay-QR và ZaloPay. Tự động kích hoạt gói ngay sau khi quét mã thành công.
                  </p>
                </div>

                {/* Gateway Logos preview */}
                <div className="flex flex-wrap items-center gap-2 bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                  <span className="text-[10px] font-extrabold uppercase text-sky-200 block w-full mb-1">
                    Cổng Hỗ Trợ:
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-sky-500 text-white font-black text-xs">VietQR</span>
                  <span className="px-2.5 py-1 rounded-xl bg-pink-600 text-white font-black text-xs">MoMo</span>
                  <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-black text-xs">VNPay</span>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs">ZaloPay</span>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Quick Action Grid: Option 1: Renewal & Option 2: PT 1-on-1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Card 1: Gia Hạn Gói Tập */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">1. Gia Hạn Gói Tập Gym</h3>
                        <p className="text-xs text-slate-500">Tiếp tục duy trì thẻ hội viên không bị gián đoạn</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                      {currentStudent?.nhom === 'HSSV' ? 'Giá HSSV: 250k/tháng' : 'Giá Đi Làm: 300k/tháng'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Chọn Kỳ Hạn Gia Hạn:
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { months: 1, label: '1 Tháng', discount: '' },
                        { months: 3, label: '3 Tháng', discount: 'Giảm 5%' },
                        { months: 6, label: '6 Tháng', discount: 'Giảm 10%' }
                      ].map(item => (
                        <button
                          key={item.months}
                          type="button"
                          onClick={() => setSelectedPlanMonths(item.months)}
                          className={`p-3.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                            selectedPlanMonths === item.months
                              ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-black ring-2 ring-emerald-500/20'
                              : 'border-slate-100 hover:border-slate-300 text-slate-700 font-bold bg-white'
                          }`}
                        >
                          <span className="text-sm block">{item.label}</span>
                          {item.discount ? (
                            <span className="text-[10px] text-emerald-600 font-extrabold uppercase block mt-0.5">
                              {item.discount}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 block mt-0.5">Tiêu chuẩn</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing detail calculation */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Đơn giá niêm yết:</span>
                      <span>{monthlyFee.toLocaleString('vi-VN')} đ &times; {selectedPlanMonths} tháng</span>
                    </div>
                    {renewalDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Ưu đãi thanh toán dài hạn:</span>
                        <span>-{(renewalSubtotal * renewalDiscount).toLocaleString('vi-VN')} đ (-{renewalDiscount * 100}%)</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black">
                      <span className="text-slate-900">Tổng thanh toán:</span>
                      <span className="text-2xl text-emerald-600">
                        {renewalTotal.toLocaleString('vi-VN')} <span className="text-xs font-bold text-slate-500">VNĐ</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openCheckout('GIA_HAN_GOI')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <QrCode className="w-4 h-4" />
                  <span>THANH TOÁN GIA HẠN NGAY</span>
                </button>
              </div>

              {/* Card 2: Đăng Ký Ca PT 1-Kèm-1 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">2. Đặt Ca PT 1-Kèm-1</h3>
                        <p className="text-xs text-slate-500">Trị liệu cột sống & Tập cơ chuyên sâu cùng HLV</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100">
                      350.000 đ / Ca 90p
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Chọn Huấn Luyện Viên</label>
                      <select
                        value={selectedTrainerForPT}
                        onChange={(e) => setSelectedTrainerForPT(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 bg-white"
                      >
                        {trainers.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.hoTen} - {t.vaiTro} ({t.chuyenMon})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Ngày Tập</label>
                        <input
                          type="date"
                          value={ptDate}
                          onChange={(e) => setPtDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Khung Giờ</label>
                        <select
                          value={ptTimeSlot}
                          onChange={(e) => setPtTimeSlot(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-white"
                        >
                          <option value="06:30 - 08:00">06:30 - 08:00 (Sáng sớm)</option>
                          <option value="08:00 - 09:30">08:00 - 09:30 (Sáng)</option>
                          <option value="09:30 - 11:00">09:30 - 11:00 (Trưa)</option>
                          <option value="15:30 - 17:00">15:30 - 17:00 (Chiều)</option>
                          <option value="17:30 - 19:00">17:30 - 19:00 (Tối ca 1)</option>
                          <option value="19:00 - 20:30">19:00 - 20:30 (Tối ca 2)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Nội Dung / Tình Trạng Cơ Xương Khớp</label>
                      <input
                        type="text"
                        value={ptSessionContent}
                        onChange={(e) => setPtSessionContent(e.target.value)}
                        placeholder="VD: Cột sống thắt lưng mỏi, muốn nắn chỉnh và tập cơ cốt lõi..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openCheckout('DAT_CA_PT_1_1')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>ĐẶT LỊCH & THANH TOÁN 350.000 Đ</span>
                </button>
              </div>

            </div>

            {/* Payment Transaction History */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Receipt className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Lịch Sử Giao Dịch Điện Tử
                    </h3>
                    <p className="text-xs text-slate-500">
                      Toàn bộ biên lai thanh toán trực tuyến của {currentStudent?.hoTen}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                  {studentTransactions.length} Giao Dịch
                </span>
              </div>

              {studentTransactions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <Receipt className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold">Chưa có giao dịch thanh toán online nào.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md font-black text-[10px] text-white ${
                            tx.congThanhToan === 'VIETQR' ? 'bg-sky-600' :
                            tx.congThanhToan === 'MOMO' ? 'bg-pink-600' :
                            tx.congThanhToan === 'VNPAY' ? 'bg-blue-600' : 'bg-emerald-600'
                          }`}>
                            {tx.congThanhToan}
                          </span>
                          <span className="font-mono text-slate-500 font-bold">{tx.maGiaoDichNganHang}</span>
                          <span className="text-slate-400">&bull; {tx.ngayTao}</span>
                        </div>
                        <p className="font-bold text-slate-900 text-sm">{tx.noiDung}</p>
                        {tx.thongTinPT && (
                          <p className="text-slate-500 text-[11px]">
                            HLV: {tx.thongTinPT.tenHLV} &bull; Ca: {tx.thongTinPT.khungGio} ngày {tx.thongTinPT.ngay}
                          </p>
                        )}
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-lg font-black text-emerald-600 block">
                          +{tx.soTien.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Thành công
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* CHECKOUT MODAL: QR CODE & PAYMENT GATEWAY SIMULATION */}
        {/* ========================================================================= */}
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
              
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Cổng Thanh Toán Điện Tử HLV GYM</h3>
                    <p className="text-[11px] text-slate-500">Bảo mật giao dịch liên ngân hàng NAPAS / Ví điện tử</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-1 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                
                {/* When Transaction is NOT yet completed */}
                {!completedPaymentTx ? (
                  <>
                    {/* Gateway Selector Tabs */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-2">
                        Chọn Cổng / Phương Thức Thanh Toán:
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'VIETQR', name: 'VietQR', desc: 'Ngân Hàng', bg: 'hover:border-sky-500', active: 'border-sky-500 bg-sky-50 text-sky-900' },
                          { id: 'MOMO', name: 'MoMo', desc: 'Ví Điện Tử', bg: 'hover:border-pink-500', active: 'border-pink-500 bg-pink-50 text-pink-900' },
                          { id: 'VNPAY', name: 'VNPay', desc: 'QR Pay', bg: 'hover:border-blue-500', active: 'border-blue-500 bg-blue-50 text-blue-900' },
                          { id: 'ZALOPAY', name: 'ZaloPay', desc: 'Ví / QR', bg: 'hover:border-emerald-500', active: 'border-emerald-500 bg-emerald-50 text-emerald-900' }
                        ].map((gw) => (
                          <button
                            key={gw.id}
                            type="button"
                            onClick={() => setSelectedGateway(gw.id as CongThanhToan)}
                            className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                              selectedGateway === gw.id ? `${gw.active} font-black shadow-xs` : 'border-slate-200 bg-white text-slate-600'
                            }`}
                          >
                            <span className="text-xs font-bold block">{gw.name}</span>
                            <span className="text-[9px] text-slate-400 block">{gw.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* QR Code Container and Transfer Details */}
                    <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-inner flex flex-col sm:flex-row items-center gap-5">
                      {/* QR Display */}
                      <div className="bg-white p-3 rounded-2xl shadow-md shrink-0 flex flex-col items-center">
                        <div className="w-32 h-32 border-4 border-slate-900 p-1.5 rounded-xl flex flex-col justify-between">
                          <div className="flex justify-between">
                            <div className="w-7 h-7 bg-slate-900 flex items-center justify-center">
                              <div className="w-3 h-3 bg-white"></div>
                            </div>
                            <div className="w-7 h-7 bg-slate-900 flex items-center justify-center">
                              <div className="w-3 h-3 bg-white"></div>
                            </div>
                          </div>
                          <div className="text-center font-mono font-black text-[10px] text-slate-900 tracking-wider">
                            {selectedGateway}
                          </div>
                          <div className="flex justify-between">
                            <div className="w-7 h-7 bg-slate-900 flex items-center justify-center">
                              <div className="w-3 h-3 bg-white"></div>
                            </div>
                            <div className="w-7 h-7 border-2 border-slate-900 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-slate-900"></div>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-600 font-extrabold mt-1.5 uppercase">
                          Quét Mã Qua App
                        </span>
                      </div>

                      {/* Info & Amount */}
                      <div className="space-y-2 text-xs w-full text-center sm:text-left">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Số tiền thanh toán:
                          </span>
                          <span className="text-2xl font-black text-amber-400">
                            {currentPayAmount.toLocaleString('vi-VN')} đ
                          </span>
                        </div>

                        <div className="bg-white/10 p-2.5 rounded-xl text-[11px] space-y-1">
                          <p><span className="text-slate-400">Đơn vị thụ hưởng:</span> <strong>HLV GYM TRẢNG BOM</strong></p>
                          <p><span className="text-slate-400">Số tài khoản / Ví:</span> <strong className="font-mono text-sky-300">0901234567</strong></p>
                          <p><span className="text-slate-400">Nội dung chuyển khoản:</span> <strong className="font-mono text-emerald-300">{currentStudent?.id} {paymentPurpose === 'GIA_HAN_GOI' ? 'GIA HAN' : 'CA PT'}</strong></p>
                        </div>
                      </div>
                    </div>

                    {/* Simulate Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={isProcessingPayment}
                        onClick={handleExecuteOnlinePayment}
                        className={`w-full py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                          isProcessingPayment 
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-98'
                        }`}
                      >
                        {isProcessingPayment ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>ĐANG KẾT NỐI CỔNG {selectedGateway} & XÁC THỰC GD...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>MÔ PHỎNG QUÉT MÃ VÀ KHỚP LỆNH THÀNH CÔNG</span>
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-slate-400 text-center mt-2">
                        💡 Thao tác này mô phỏng phản hồi Webhook tức thì từ {selectedGateway} về máy chủ phòng gym.
                      </p>
                    </div>
                  </>
                ) : (
                  /* When Transaction Succeeded */
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50 animate-bounce">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        Thanh Toán Thành Công!
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Hệ thống đã nhận {completedPaymentTx.soTien.toLocaleString('vi-VN')} đ qua cổng {completedPaymentTx.congThanhToan}.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2 text-left max-w-sm mx-auto">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mã giao dịch ngân hàng:</span>
                        <span className="font-mono font-bold text-slate-800">{completedPaymentTx.maGiaoDichNganHang}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Thời gian:</span>
                        <span className="font-semibold text-slate-700">{completedPaymentTx.ngayTao}</span>
                      </div>
                      {completedPaymentTx.thongTinGoi && (
                        <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
                          <span>Hạn thẻ mới:</span>
                          <span>{completedPaymentTx.thongTinGoi.ngayHetHanMoi}</span>
                        </div>
                      )}
                      {completedPaymentTx.thongTinPT && (
                        <div className="text-blue-700 font-bold pt-1 border-t border-slate-200">
                          <span>Lịch PT 1:1 đã tạo: {completedPaymentTx.thongTinPT.tenHLV} ({completedPaymentTx.thongTinPT.khungGio})</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCheckoutModal(false);
                          setActiveTab(paymentPurpose === 'GIA_HAN_GOI' ? 'CARD' : 'PAYMENT');
                        }}
                        className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                      >
                        ĐÓNG & XEM LẠI THẺ HỘI VIÊN
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};



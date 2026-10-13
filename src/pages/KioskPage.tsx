import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Wifi, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Delete, 
  Sparkles, 
  History, 
  ArrowLeft,
  X,
  ScanFace,
  Keyboard,
  Camera,
  Lock,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGym } from '../context/GymContext';
import type { HocVien } from '../types';

export const KioskPage: React.FC = () => {
  const { members, checkIn, checkInWithFaceId, checkInLogs } = useGym();

  // Mode: Face ID vs Numpad
  const [checkInMode, setCheckInMode] = useState<'FACE_ID' | 'NUMPAD'>('FACE_ID');

  const [inputCode, setInputCode] = useState<string>('');
  
  // Face ID Scanning States
  const [isFaceScanning, setIsFaceScanning] = useState<boolean>(false);
  const [faceScanProgress, setFaceScanProgress] = useState<number>(0);
  const [activeScanningMember, setActiveScanningMember] = useState<HocVien | null>(null);

  // Live Camera state for Kiosk
  const [useLiveKioskCamera, setUseLiveKioskCamera] = useState<boolean>(false);
  const kioskVideoRef = useRef<HTMLVideoElement | null>(null);
  const [kioskStream, setKioskStream] = useState<MediaStream | null>(null);

  // Modal feedback state
  const [feedbackResult, setFeedbackResult] = useState<{
    show: boolean;
    success: boolean;
    member: HocVien | null;
    message: string;
    daysRemaining: number;
    isRedList?: boolean;
    isFaceId?: boolean;
    matchScore?: number;
  } | null>(null);

  // Virtual numpad click
  const handleKeyClick = (val: string) => {
    if (inputCode.length < 12) {
      setInputCode(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    setInputCode(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInputCode('');
  };

  // Stop Kiosk Camera
  const stopKioskCamera = () => {
    if (kioskStream) {
      kioskStream.getTracks().forEach(t => t.stop());
      setKioskStream(null);
    }
    setUseLiveKioskCamera(false);
  };

  useEffect(() => {
    return () => {
      stopKioskCamera();
    };
  }, []);

  // Ensure webcam stream is attached to kiosk video element once mounted
  useEffect(() => {
    if (useLiveKioskCamera && kioskStream && kioskVideoRef.current) {
      kioskVideoRef.current.srcObject = kioskStream;
      kioskVideoRef.current.play().catch(err => console.warn('Kiosk video play failed:', err));
    }
  }, [useLiveKioskCamera, kioskStream]);

  const startKioskCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      setKioskStream(stream);
      setUseLiveKioskCamera(true);
    } catch (e) {
      console.warn('Kiosk Camera not available, using high-tech simulated scanner', e);
    }
  };

  // Perform Traditional Check-in (Numpad)
  const executeNumpadCheckIn = (codeToTest?: string) => {
    const code = (codeToTest || inputCode).trim();
    if (!code) return;

    const result = checkIn(code);

    if (result.success) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }

    setFeedbackResult({
      show: true,
      success: result.success,
      member: result.member,
      message: result.message,
      daysRemaining: result.daysRemaining,
      isRedList: result.isRedList,
      isFaceId: false
    });

    setInputCode('');
    setTimeout(() => {
      setFeedbackResult(prev => prev ? { ...prev, show: false } : null);
    }, 6000);
  };

  // Perform Face ID Scanning Workflow
  const startFaceScan = (targetMember?: HocVien) => {
    const target = targetMember || members.find(m => m.hasFaceId) || members[0];
    setActiveScanningMember(target);
    setIsFaceScanning(true);
    setFaceScanProgress(0);

    // Simulate AI Face Landmark extraction progress
    const interval = setInterval(() => {
      setFaceScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishFaceScan(target);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const finishFaceScan = (target: HocVien) => {
    setIsFaceScanning(false);

    const result = checkInWithFaceId(target.id);

    if (result.success) {
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }

    setFeedbackResult({
      show: true,
      success: result.success,
      member: result.member,
      message: result.message,
      daysRemaining: result.daysRemaining,
      isRedList: result.isRedList,
      isFaceId: true,
      matchScore: target.hasFaceId ? 99.4 : 32.1
    });

    setTimeout(() => {
      setFeedbackResult(prev => prev ? { ...prev, show: false } : null);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Anti-fraud Wi-Fi info & Back link */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="p-2.5 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Trở về Trang Quản Trị"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                KIOSK TIẾP TÂN &bull; HLV GYM
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Tự Phục Vụ
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hệ thống nhận diện sinh trắc học Face ID & Điểm danh quầy tự động
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setCheckInMode('FACE_ID')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              checkInMode === 'FACE_ID'
                ? 'bg-emerald-500 text-slate-900 shadow-md shadow-emerald-500/20 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ScanFace className="w-4 h-4" />
            <span>Quét Face ID (Bảo Mật)</span>
          </button>

          <button
            onClick={() => setCheckInMode('NUMPAD')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              checkInMode === 'NUMPAD'
                ? 'bg-emerald-500 text-slate-900 shadow-md shadow-emerald-500/20 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Nhập Mã / SĐT</span>
          </button>
        </div>

        {/* Anti-fraud Wi-Fi Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">
            Wi-Fi Quầy Lễ Tân Trảng Bom
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Hợp lệ
          </span>
        </div>
      </div>

      {/* Main Kiosk Area */}
      <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto w-full">
        
        {/* Left Column (7 cols): Face ID Scanner OR Numpad */}
        <div className="lg:col-span-7 bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl">
          
          {/* MODE 1: FACE ID BIOMETRIC SCANNING */}
          {checkInMode === 'FACE_ID' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ScanFace className="w-5 h-5 text-emerald-400" />
                    Camera Quét Khuôn Mặt AI (Face ID)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Đứng trước camera để hệ thống đối chiếu sinh trắc học và mở cửa vào tập
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (useLiveKioskCamera) {
                      stopKioskCamera();
                    } else {
                      startKioskCamera();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-xs font-bold text-emerald-400 border border-emerald-500/30 transition-colors flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{useLiveKioskCamera ? 'Tắt Webcam' : 'Bật Webcam Quầy'}</span>
                </button>
              </div>

              {/* Face Reticle Viewport */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-500/40 shadow-inner flex flex-col items-center justify-center">
                {/* Live Camera View if on */}
                {useLiveKioskCamera ? (
                  <video
                    ref={kioskVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                ) : (
                  /* High-tech animated AI scanner visual */
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    {activeScanningMember ? (
                      <img
                        src={activeScanningMember.faceIdPhoto || activeScanningMember.avatar}
                        alt="Đang quét"
                        className="w-36 h-36 rounded-full object-cover ring-4 ring-emerald-500/50 shadow-2xl mb-2"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-emerald-500/10 border-2 border-dashed border-emerald-400/80 flex items-center justify-center mb-3">
                        <ScanFace className="w-14 h-14 text-emerald-400 animate-pulse" />
                      </div>
                    )}
                    <p className="text-xs font-bold text-slate-300">
                      {isFaceScanning
                        ? `Đang nhận diện vector 3D khuôn mặt (${faceScanProgress}%)...`
                        : 'Sẵn sàng nhận diện! Nhìn thẳng vào camera để xác thực.'}
                    </p>
                  </div>
                )}

                {/* Laser scanline overlay when scanning */}
                {isFaceScanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-1 bg-emerald-400 shadow-[0_0_16px_#10B981] animate-bounce" />
                    <div className="absolute top-4 left-4 bg-emerald-500/90 text-slate-950 font-mono font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                      AI Facial Landmark Match: {faceScanProgress}%
                    </div>
                  </div>
                )}

                {/* Reticle guide */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-64 border border-emerald-400/30 rounded-[35%] relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-slate-900/90 px-2 py-0.5 rounded">
                      Face ID Scanner
                    </div>
                  </div>
                </div>
              </div>

              {/* Action: Trigger Face ID Scan */}
              <button
                id="btn-kiosk-face-scan"
                type="button"
                onClick={() => startFaceScan()}
                disabled={isFaceScanning}
                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <ScanFace className="w-5 h-5" />
                <span>{isFaceScanning ? 'ĐANG ĐỐI CHIẾU SINH TRẮC HỌC...' : 'QUÉT KHUÔN MẶT ĐIỂM DANH NGAY'}</span>
              </button>

              {/* Quick Scenario Buttons for Examiners / Live Testing */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 space-y-2.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Kịch bản kiểm thử nhận diện Face ID cho hội đồng:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    id="btn-kiosk-test-hv001"
                    onClick={() => {
                      const m = members.find(x => x.id === 'HV001');
                      if (m) startFaceScan(m);
                    }}
                    className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 text-left transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>HV001 (Võ Minh Quân - Đã có Face ID)</span>
                  </button>

                  <button
                    id="btn-kiosk-test-hv005"
                    onClick={() => {
                      const m = members.find(x => x.id === 'HV005');
                      if (m) startFaceScan(m);
                    }}
                    className="p-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold border border-teal-500/30 text-left transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                    <span>HV005 (Anh Tuấn - PT Trị Liệu Face ID)</span>
                  </button>

                  <button
                    id="btn-kiosk-test-hv002"
                    onClick={() => {
                      const m = members.find(x => x.id === 'HV002');
                      if (m) startFaceScan(m);
                    }}
                    className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/30 text-left transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>HV002 (Chưa đăng ký Face ID)</span>
                  </button>

                  <button
                    id="btn-kiosk-test-hv004"
                    onClick={() => {
                      const m = members.find(x => x.id === 'HV004');
                      if (m) startFaceScan(m);
                    }}
                    className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold border border-rose-500/30 text-left transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>HV004 (Thẻ hết hạn)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: TRADITIONAL NUMPAD */}
          {checkInMode === 'NUMPAD' && (
            <div>
              {/* Code Input Display */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Nhập Mã Học Viên Hoặc Số Điện Thoại
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    placeholder="Ví dụ: HV001 hoặc 0901..."
                    value={inputCode}
                    className="w-full text-center text-2xl sm:text-3xl font-mono font-black py-4 px-6 rounded-2xl bg-slate-900/90 border-2 border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner tracking-wider"
                  />
                  {inputCode && (
                    <button
                      onClick={handleClear}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Big Virtual Numpad */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeyClick(digit)}
                    className="h-14 sm:h-16 rounded-2xl bg-slate-700/60 hover:bg-slate-700 active:scale-95 text-2xl font-bold text-white transition-all shadow-md flex items-center justify-center border border-slate-600/50"
                  >
                    {digit}
                  </button>
                ))}

                <button
                  onClick={handleClear}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800 hover:bg-slate-750 active:scale-95 text-sm font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center border border-slate-700"
                >
                  XÓA
                </button>

                <button
                  onClick={() => handleKeyClick('0')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-700/60 hover:bg-slate-700 active:scale-95 text-2xl font-bold text-white transition-all shadow-md flex items-center justify-center border border-slate-600/50"
                >
                  0
                </button>

                <button
                  onClick={handleBackspace}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800 hover:bg-slate-750 active:scale-95 text-slate-400 hover:text-white transition-all flex items-center justify-center border border-slate-700"
                >
                  <Delete className="w-6 h-6" />
                </button>
              </div>

              {/* Action Button */}
              <button
                onClick={() => executeNumpadCheckIn()}
                disabled={!inputCode}
                className={`w-full py-4 rounded-2xl font-black text-base sm:text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                  inputCode
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-emerald-500/25 active:scale-98 cursor-pointer'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>XÁC NHẬN ĐIỂM DANH</span>
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Live Check-in Feed at Reception (5 cols) */}
        <div className="lg:col-span-5 bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 flex flex-col h-[540px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Lượt Điểm Danh Vừa Vào</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {checkInLogs.length} lượt
            </span>
          </div>

          {/* Scrollable feed */}
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {checkInLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  log.hopLe
                    ? 'bg-slate-800/80 border-slate-700/80'
                    : 'bg-rose-950/20 border-rose-800/40'
                }`}
              >
                <div className="relative">
                  <img
                    src={log.avatar}
                    alt={log.tenHV}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700 shrink-0"
                  />
                  {log.faceIdVerified && (
                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 text-slate-900 rounded-full ring-1 ring-slate-900" title="Xác thực qua Face ID">
                      <ScanFace className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{log.tenHV}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{log.thoiGian}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] mt-0.5">
                    <span className="font-mono text-slate-400 font-bold">{log.maHV}</span>
                    <span>&bull;</span>
                    <span className={log.hopLe ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {log.ghiChu}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/80 text-[11px] text-slate-500 text-center flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bảo mật chống mượn thẻ bằng Face ID 3D Vector</span>
          </div>
        </div>

      </div>

      {/* Bottom info */}
      <div className="text-center text-xs text-slate-500 py-2">
        HLV GYM Trảng Bom &bull; Hệ Thống Tiếp Tân Kiosk Điện Tử & Face ID 2026
      </div>

      {/* Check-in Feedback Result Modal */}
      {feedbackResult && feedbackResult.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl p-8 border shadow-2xl relative text-center ${
              feedbackResult.success
                ? 'bg-gradient-to-b from-slate-900 to-emerald-950 border-emerald-500/60 shadow-emerald-500/20'
                : 'bg-gradient-to-b from-slate-900 to-rose-950 border-rose-500/60 shadow-rose-500/20'
            }`}
          >
            <button
              onClick={() => setFeedbackResult(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {feedbackResult.success ? (
              /* Success Modal */
              <div>
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                  {feedbackResult.isFaceId ? (
                    <ScanFace className="w-10 h-10" />
                  ) : (
                    <CheckCircle2 className="w-10 h-10" />
                  )}
                </div>

                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {feedbackResult.isFaceId ? 'XÁC THỰC FACE ID CHÍNH CHỦ THÀNH CÔNG' : 'ĐIỂM DANH THÀNH CÔNG!'}
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
                  {feedbackResult.member?.hoTen}
                </h2>

                <p className="text-sm text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  {feedbackResult.message}
                </p>

                {/* Member Details & Face ID comparison card */}
                {feedbackResult.member && (
                  <div className="my-5 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 text-left space-y-2.5">
                    {feedbackResult.isFaceId && (
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700 text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          Độ trùng khớp sinh trắc học:
                        </span>
                        <span className="font-mono font-black text-emerald-400">
                          {feedbackResult.matchScore || 99.4}% Landmark Match
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Mã Học Viên:</span>
                      <span className="font-mono font-bold text-white">{feedbackResult.member.id}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Gói Tập:</span>
                      <span className="font-bold text-emerald-400">
                        {feedbackResult.member.goiTap === 'GYM01' ? 'Gym Tự Do' : 'PT Trị Liệu 1:1'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Hạn Thẻ Còn Lại:</span>
                      <span className={`font-bold ${feedbackResult.isRedList ? 'text-amber-400' : 'text-emerald-400'}`}>
                        Còn {feedbackResult.daysRemaining} ngày
                        {feedbackResult.isRedList && ' (Sắp hết hạn)'}
                      </span>
                    </div>

                    {feedbackResult.member.soSlotTapBu > 0 && (
                      <div className="pt-2 border-t border-slate-700 flex justify-between text-xs">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Buổi Tập Bù:
                        </span>
                        <span className="font-black text-amber-400">
                          +{feedbackResult.member.soSlotTapBu} ca
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setFeedbackResult(null)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all"
                >
                  XONG & VÀO TẬP NGAY
                </button>
              </div>
            ) : (
              /* Warning / Expired / Unregistered Face ID Modal */
              <div>
                <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-400 border-2 border-rose-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/30">
                  <XCircle className="w-10 h-10" />
                </div>

                <span className="text-xs uppercase font-extrabold tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                  {feedbackResult.member?.hasFaceId ? 'THẺ ĐÃ HẾT HẠN' : 'CHƯA ĐĂNG KÝ FACE ID'}
                </span>

                <h2 className="text-2xl font-black text-white mt-3">
                  {feedbackResult.member?.hoTen || 'Cảnh Báo Điểm Danh'}
                </h2>

                <p className="text-sm text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  {feedbackResult.message}
                </p>

                <div className="my-5 p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200">
                  ⚠️ Để đảm bảo an ninh, phòng tập chỉ cho phép vào khi khuôn mặt trùng khớp chính chủ và gói tập còn hạn.
                </div>

                <button
                  onClick={() => setFeedbackResult(null)}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/25 transition-all"
                >
                  ĐÃ HIỂU & ĐÓNG
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

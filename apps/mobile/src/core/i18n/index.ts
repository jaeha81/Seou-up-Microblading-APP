import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'Seou-up Microblading',
      login: 'Sign In',
      register: 'Create Account',
      logout: 'Sign Out',
      home: 'Home',
      plugins: 'Plugins',
      settings: 'Settings',
      simulate: 'Brow Simulation',
      guide: 'Startup Guide',
      providers: 'Find Providers',
      feedback: 'Feedback',
      admin: 'Admin',
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      disclaimer:
        'For simulation purposes only. Consult a certified professional before any procedure.',
    },
  },
  ko: {
    translation: {
      appName: '서업 마이크로블레이딩',
      login: '로그인',
      register: '회원가입',
      logout: '로그아웃',
      home: '홈',
      plugins: '플러그인',
      settings: '설정',
      simulate: '눈썹 시뮬레이션',
      guide: '창업 가이드',
      providers: '시술소 찾기',
      feedback: '피드백',
      admin: '관리자',
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      retry: '다시 시도',
      save: '저장',
      cancel: '취소',
      disclaimer: '시뮬레이션 전용입니다. 시술 전 전문가와 상담하세요.',
    },
  },
  th: {
    translation: {
      appName: 'Seou-up ไมโครเบลดดิ้ง',
      login: 'เข้าสู่ระบบ',
      register: 'สมัครสมาชิก',
      logout: 'ออกจากระบบ',
      home: 'หน้าหลัก',
      plugins: 'ปลั๊กอิน',
      settings: 'ตั้งค่า',
      simulate: 'จำลองคิ้ว',
      guide: 'คู่มือเริ่มต้น',
      providers: 'หาผู้ให้บริการ',
      feedback: 'ข้อเสนอแนะ',
      admin: 'ผู้ดูแลระบบ',
      loading: 'กำลังโหลด...',
      error: 'เกิดข้อผิดพลาด',
      retry: 'ลองอีกครั้ง',
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      disclaimer: 'สำหรับการจำลองเท่านั้น ปรึกษาผู้เชี่ยวชาญก่อนทำหัตถการ',
    },
  },
  vi: {
    translation: {
      appName: 'Seou-up Microblading',
      login: 'Đăng nhập',
      register: 'Tạo tài khoản',
      logout: 'Đăng xuất',
      home: 'Trang chủ',
      plugins: 'Plugin',
      settings: 'Cài đặt',
      simulate: 'Mô phỏng lông mày',
      guide: 'Hướng dẫn khởi nghiệp',
      providers: 'Tìm nhà cung cấp',
      feedback: 'Phản hồi',
      admin: 'Quản trị',
      loading: 'Đang tải...',
      error: 'Đã xảy ra lỗi',
      retry: 'Thử lại',
      save: 'Lưu',
      cancel: 'Hủy',
      disclaimer: 'Chỉ dùng cho mô phỏng. Tham khảo chuyên gia trước khi làm thủ thuật.',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
  });

export default i18n;

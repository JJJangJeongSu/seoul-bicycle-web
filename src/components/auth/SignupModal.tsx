import { X } from 'lucide-react';
import { useState } from 'react';

type SignupModalProps = {
  onClose: () => void;
  onSignup: (data: SignupData) => Promise<void>;
  onLoginClick: () => void;
};

type SignupData = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export function SignupModal({ onClose, onSignup, onLoginClick }: SignupModalProps) {
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력하세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력하세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '영문과 숫자를 조합하세요';
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력하세요';
    }

    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력하세요';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다 (010-XXXX-XXXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        await onSignup(formData);
      } catch (err) {
        setErrors({ ...errors, general: '회원가입에 실패했습니다' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    // Auto-format phone number
    const numbers = value.replace(/[^\d]/g, '');
    let formatted = numbers;
    
    if (numbers.length > 3 && numbers.length <= 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length > 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
    
    setFormData({ ...formData, phone: formatted });
  };

  return (
    <div className="fixed inset-0 bg-primary/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full my-8 border-4 border-sky-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-sky-100 bg-muted">
          <h2 className="text-2xl">💫 회원가입</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sky-100 rounded-full transition-all hover:scale-110"
          >
            <X className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              📧 이메일 <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all bg-sky-50/30 ${
                errors.email ? 'border-destructive' : 'border-sky-200'
              }`}
              placeholder="example@email.com"
            />
            {errors.email && <p className="text-sm text-destructive mt-1">⚠️ {errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              🔒 비밀번호 <span className="text-destructive">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all bg-sky-50/30 ${
                errors.password ? 'border-destructive' : 'border-sky-200'
              }`}
              placeholder="8자 이상, 영문+숫자 조합"
            />
            {errors.password && <p className="text-sm text-destructive mt-1">⚠️ {errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              🔐 비밀번호 확인 <span className="text-destructive">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all bg-sky-50/30 ${
                errors.confirmPassword ? 'border-destructive' : 'border-sky-200'
              }`}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.confirmPassword && <p className="text-sm text-destructive mt-1">⚠️ {errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              👤 이름 <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all bg-sky-50/30 ${
                errors.name ? 'border-destructive' : 'border-sky-200'
              }`}
              placeholder="홍길동"
            />
            {errors.name && <p className="text-sm text-destructive mt-1">⚠️ {errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              📱 전화번호 <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all bg-sky-50/30 ${
                errors.phone ? 'border-destructive' : 'border-sky-200'
              }`}
              placeholder="010-1234-5678"
              maxLength={13}
            />
            {errors.phone && <p className="text-sm text-destructive mt-1">⚠️ {errors.phone}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-2xl hover:bg-sky-400 transition-all hover:scale-105 shadow-lg"
          >
            ✨ 회원가입
          </button>

          <div className="text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-primary hover:text-sky-600 transition-colors"
            >
              💖 로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

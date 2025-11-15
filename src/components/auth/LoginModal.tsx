import { X, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';

type LoginModalProps = {
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignupClick: () => void;
};

export function LoginModal({ onClose, onLogin, onSignupClick }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력하세요');
      return;
    }

    onLogin(email, password);
  };

  // 임시 비밀번호 발송 함수
  const handleSendTempPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      alert('이메일을 입력해주세요');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      alert('올바른 이메일 형식을 입력해주세요');
      return;
    }

    setSendingEmail(true);

    try {
      // TODO: 실제 이메일 API로 교체 필요
      // const API_ENDPOINT = 'https://your-api.com/send-temp-password';
      // const API_KEY = 'YOUR_API_KEY';

      // 실제 API 호출 예시 (주석 처리됨)
      /*
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          email: forgotEmail,
          type: 'temp_password',
        }),
      });

      if (!response.ok) {
        throw new Error('이메일 전송 실패');
      }
      */

      // Mock 이메일 전송 (실제 API 연동 전까지 사용)
      await new Promise(resolve => setTimeout(resolve, 2000)); // 이메일 전송 시뮬레이션

      // 임시 비밀번호 생성 (실제로는 서버에서 생성)
      const tempPassword = Math.random().toString(36).slice(-8);
      console.log(`[Mock Email] To: ${forgotEmail}`);
      console.log(`[Mock Email] 임시 비밀번호: ${tempPassword}`);
      console.log(`[Mock Email] 로그인 후 비밀번호를 변경해주세요.`);

      setEmailSent(true);
      
      // 3초 후 자동으로 로그인 화면으로 복귀
      setTimeout(() => {
        setShowForgotPassword(false);
        setEmailSent(false);
        setForgotEmail('');
      }, 3000);

    } catch (err) {
      alert(err instanceof Error ? err.message : '이메일 전송에 실패했습니다.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 border-sky-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-sky-100 bg-muted">
          <h2 className="text-2xl">
            {showForgotPassword ? '🔑 비밀번호 찾기' : '💖 로그인'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sky-100 rounded-full transition-all hover:scale-110"
          >
            <X className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Body */}
        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-4 bg-sky-50 border-2 border-sky-300 text-sky-700 rounded-2xl">
                ⚠️ {error}
              </div>
            )}

            <div className="bg-muted p-4 rounded-2xl border-2 border-sky-200">
              <p className="text-sm text-sky-800 mb-2">🔑 테스트 계정:</p>
              <p className="text-sm text-gray-700">👤 일반 사용자: user@test.com / password</p>
              <p className="text-sm text-gray-700">✨ 관리자: admin@test.com / password</p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">📧 이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-sky-200 rounded-2xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all bg-sky-50/30"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">🔒 비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-sky-200 rounded-2xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all bg-sky-50/30"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-2xl hover:bg-sky-400 transition-all hover:scale-105 shadow-lg"
            >
              ✨ 로그인
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                🤔 비밀번호를 잊으셨나요?
              </button>
              <div className="text-sm text-gray-600">
                계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={onSignupClick}
                  className="text-primary hover:text-sky-600 transition-colors"
                >
                  💫 회원가입
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSendTempPassword} className="p-6 space-y-5">
            {emailSent ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <p className="text-lg mb-2">✅ 이메일 전송 완료!</p>
                  <p className="text-sm text-gray-600">
                    {forgotEmail}로<br />
                    임시 비밀번호가 전송되었습니다.
                  </p>
                  <p className="text-sm text-gray-600 mt-3">
                    📬 이메일을 확인하여 로그인해주세요.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-200">
                  <p className="text-sm text-gray-700">
                    📧 가입하신 이메일 주소를 입력하시면<br />
                    임시 비밀번호를 발송해드립니다.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">📧 이메일</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-sky-200 rounded-2xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all bg-sky-50/30"
                    placeholder="example@email.com"
                    disabled={sendingEmail}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="w-full py-3 bg-primary text-white rounded-2xl hover:bg-sky-400 transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      임시 비밀번호 전송
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  ← 로그인으로 돌아가기
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
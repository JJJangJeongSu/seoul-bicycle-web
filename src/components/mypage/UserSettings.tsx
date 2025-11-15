import { useState } from 'react';
import { User as UserIcon, Lock, Trash2, Save } from 'lucide-react';
import { User } from '../../App';

type UserSettingsProps = {
  user: User;
};

export function UserSettings({ user }: UserSettingsProps) {
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'account'>('profile');
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert('개인정보가 수정되었습니다');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      alert('새 비밀번호가 일치하지 않습니다');
      return;
    }

    if (passwordData.new.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다');
      return;
    }

    alert('비밀번호가 변경되었습니다');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleAccountDelete = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      if (window.confirm('모든 데이터가 영구적으로 삭제됩니다. 계속하시겠습니까?')) {
        alert('계정이 삭제되었습니다');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b pb-4">
        <button
          onClick={() => setActiveSection('profile')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'profile'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <UserIcon className="w-4 h-4 inline mr-2" />
          개인정보 수정
        </button>
        <button
          onClick={() => setActiveSection('password')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'password'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Lock className="w-4 h-4 inline mr-2" />
          비밀번호 변경
        </button>
        <button
          onClick={() => setActiveSection('account')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'account'
              ? 'bg-red-100 text-red-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Trash2 className="w-4 h-4 inline mr-2" />
          계정 관리
        </button>
      </div>

      {/* Profile Edit */}
      {activeSection === 'profile' && (
        <div className="max-w-2xl">
          <h3 className="text-lg mb-4">개인정보 수정</h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">전화번호</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="010-1234-5678"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              저장하기
            </button>
          </form>
        </div>
      )}

      {/* Password Change */}
      {activeSection === 'password' && (
        <div className="max-w-2xl">
          <h3 className="text-lg mb-4">비밀번호 변경</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">현재 비밀번호</label>
              <input
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">새 비밀번호</label>
              <input
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="8자 이상, 영문+숫자 조합"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">새 비밀번호 확인</label>
              <input
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="새 비밀번호를 다시 입력하세요"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Lock className="w-5 h-5" />
              비밀번호 변경
            </button>
          </form>
        </div>
      )}

      {/* Account Management */}
      {activeSection === 'account' && (
        <div className="max-w-2xl">
          <h3 className="text-lg mb-4">계정 관리</h3>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="text-red-800 mb-2">⚠️ 회원탈퇴</h4>
            <p className="text-sm text-red-700 mb-4">
              계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다:
            </p>
            <ul className="text-sm text-red-700 mb-6 space-y-1 list-disc list-inside">
              <li>대여 이력 및 통계</li>
              <li>작성한 게시글 및 댓글</li>
              <li>고장 신고 내역</li>
              <li>개인정보</li>
            </ul>
            
            <button
              onClick={handleAccountDelete}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              회원탈퇴
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

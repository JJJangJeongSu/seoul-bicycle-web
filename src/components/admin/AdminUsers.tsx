import { useState, useMemo, useEffect } from 'react';
import { Search, Eye, Ban, X, CheckCircle, Loader2 } from 'lucide-react';
import { useServices } from '../../hooks/useServices';
import type { User } from '../../types';

export function AdminUsers() {
  const { adminService } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('회원 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [adminService]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.includes(term)
    );
  }, [users, searchTerm]);

  const handleView = (user: User) => {
    setViewingUser(user);
  };

  const handleToggleSuspend = async (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'suspended' ? '정지' : '정지 해제';

    const confirmed = window.confirm(`정말로 ${user.name} 회원을 ${action}하시겠습니까?`);
    if (!confirmed) return;

    try {
      // Update via service (this will throw in mock mode)
      try {
        await adminService.updateUserStatus(user.id, newStatus);
      } catch (err: any) {
        if (err.message?.includes('not supported in mock mode')) {
          // In mock mode, just update local state
          console.log('Mock mode: updating local state only');
        } else {
          throw err;
        }
      }

      // Update local state
      setUsers(users.map(u =>
        u.id === user.id
          ? { ...u, status: newStatus }
          : u
      ));

      alert(`${user.name} 회원이 ${action}되었습니다`);
    } catch (err) {
      console.error('Failed to update user status:', err);
      alert('회원 상태 업데이트에 실패했습니다.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-600">회원 목록을 불러오는 중...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-destructive mb-4 text-xl">⚠️</div>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름, 이메일, 전화번호로 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">이름</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">이메일</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">전화번호</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">대여횟수</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">가입일</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{user.id}</td>
                  <td className="px-6 py-4 text-sm">{user.name}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.phone}</td>
                  <td className="px-6 py-4 text-sm">{user.rentals}회</td>
                  <td className="px-6 py-4 text-sm">
                    {user.joinedAt.toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="상세보기"
                        onClick={() => handleView(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="정지"
                        onClick={() => handleToggleSuspend(user)}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          총 회원 수: <span className="text-lg mx-1">{users.length}</span>명
          {searchTerm && ` (검색 결과: ${filteredUsers.length}명)`}
        </p>
      </div>

      {/* User Detail Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">회원 상세 정보</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setViewingUser(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {viewingUser.status === 'active' ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <Ban className="w-8 h-8 text-red-500" />
                )}
                <div>
                  <p className="text-sm text-gray-500">상태</p>
                  <p className={viewingUser.status === 'active' ? 'text-green-700' : 'text-red-700'}>
                    {viewingUser.status === 'active' ? '✅ 활성화' : '🚫 정지됨'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">회원 ID</p>
                  <p className="text-sm">{viewingUser.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">이름</p>
                  <p className="text-sm">{viewingUser.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">이메일</p>
                  <p className="text-sm">{viewingUser.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">전화번호</p>
                  <p className="text-sm">{viewingUser.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">총 대여 횟수</p>
                  <p className="text-sm">{viewingUser.rentals}회</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">가입일</p>
                  <p className="text-sm">{viewingUser.joinedAt.toLocaleDateString('ko-KR')}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={() => {
                    handleToggleSuspend(viewingUser);
                    setViewingUser(null);
                  }}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    viewingUser.status === 'active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {viewingUser.status === 'active' ? '회원 정지' : '정지 해제'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
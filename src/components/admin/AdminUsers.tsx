import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Ban, X, CheckCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useServices } from '../../hooks/useServices';
import type { User, Pagination } from '../../types';

export function AdminUsers() {
  const { adminService } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { users: data, pagination: paging } = await adminService.getAllUsers(currentPage, 10, debouncedSearch);
      setUsers(data);
      setPagination(paging);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('회원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [adminService, currentPage, debouncedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleView = (user: User) => {
    setViewingUser(user);
  };

  const handleToggleSuspend = async (user: User) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    const action = newStatus === 'blocked' ? '정지' : '정지 해제';

    const confirmed = window.confirm(`정말로 ${user.name} 회원을 ${action}하시겠습니까?`);
    if (!confirmed) return;

    try {
      await adminService.updateUserStatus(user.id, newStatus);
      
      // Refresh list to get updated status
      loadUsers();

      alert(`${user.name} 회원이 ${action}되었습니다`);
    } catch (err) {
      console.error('Failed to update user status:', err);
      alert('회원 상태 업데이트에 실패했습니다.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Show loading state
  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-600">회원 목록을 불러오는 중...</p>
      </div>
    );
  }

  // Show error state
  if (error && users.length === 0) {
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
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{user.id}</td>
                  <td className="px-6 py-4 text-sm">{user.name}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? '활성' : '정지'}
                    </span>
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
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              총 {pagination.totalItems}명 중 {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}명 표시
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show current page, first, last, and pages around current
                  const current = pagination.currentPage;
                  return page === 1 || page === pagination.totalPages || Math.abs(page - current) <= 2;
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2 py-1">...</span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border rounded ${
                        pagination.currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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
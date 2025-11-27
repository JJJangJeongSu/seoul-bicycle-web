import { useState, useMemo, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useServices } from '../../hooks/useServices';
import type { Repair } from '../../types';

export function RepairList() {
  const { user } = useAuth();
  const { repairService } = useServices();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [allRepairs, setAllRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load repairs when user changes
  useEffect(() => {
    if (!user) {
      setAllRepairs([]);
      return;
    }

    const loadRepairs = async () => {
      try {
        setLoading(true);
        setError(null);
        const repairs = await repairService.getMyRepairs(user.id);
        setAllRepairs(repairs);
      } catch (err) {
        console.error('Failed to load repairs:', err);
        setError('신고 내역을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadRepairs();
  }, [user, repairService]);

  const filteredRepairs = useMemo(() => {
    let repairs = [...allRepairs];

    if (statusFilter !== 'all') {
      repairs = repairs.filter(r => r.status === statusFilter);
    }

    return repairs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [allRepairs, statusFilter]);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        icon: Clock,
        color: 'bg-blue-100 text-blue-700',
        label: '접수',
      },
      'in-progress': {
        icon: AlertCircle,
        color: 'bg-yellow-100 text-yellow-700',
        label: '처리중',
      },
      completed: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700',
        label: '완료',
      },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      brake: '브레이크',
      tire: '타이어',
      chain: '체인',
      seat: '안장',
      light: '라이트',
      lock: '잠금장치',
      other: '기타',
    };
    return labels[category as keyof typeof labels] || category;
  };

  // Show loading state
  if (loading && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-600">신고 내역을 불러오는 중...</p>
      </div>
    );
  }

  // Show error state
  if (error && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-destructive mb-4 text-xl">⚠️</div>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* No Login Message */}
      {!user ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg mb-2 text-gray-900">로그인이 필요합니다</h3>
          <p className="text-sm text-gray-600">
            고장 신고 내역을 보려면 로그인해주세요.<br />
            로그인하시면 본인이 신고한 내역만 확인할 수 있습니다.
          </p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                접수
              </button>
              <button
                onClick={() => setStatusFilter('in-progress')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                처리중
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                완료
              </button>
            </div>
          </div>

          {/* Repair List */}
          <div className="space-y-4">
            {filteredRepairs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">신고 내역이 없습니다</p>
              </div>
            ) : (
              filteredRepairs.map(repair => {
                const badge = getStatusBadge(repair.status);
                const Icon = badge.icon;

                return (
                  <div
                    key={repair.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg">신고 번호: {repair.id}</h3>
                          <span className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${badge.color}`}>
                            <Icon className="w-4 h-4" />
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          신고자: {repair.reporter} · {repair.createdAt.toLocaleString('ko-KR')}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">대상</p>
                        <p>
                          {repair.type === 'bike' ? '자전거' : '대여소'}: {repair.bikeId}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">고장 유형</p>
                        <p>{getCategoryLabel(repair.category)}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">상세 설명</p>
                      <p className="text-gray-700">{repair.description}</p>
                    </div>

                    {repair.status !== 'pending' && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-2">📊 처리 상태</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">접수 ({repair.createdAt.toLocaleString('ko-KR')})</span>
                          </div>
                          {repair.status !== 'pending' && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm">처리중</span>
                            </div>
                          )}
                          {repair.status === 'completed' && repair.completedAt && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm">완료 ({repair.completedAt.toLocaleString('ko-KR')})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {repair.adminNote && (
                      <div className="mt-4 pt-4 border-t bg-gray-50 rounded p-3">
                        <p className="text-sm text-gray-600 mb-1">💬 관리자 메모</p>
                        <p className="text-sm text-gray-700">{repair.adminNote}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
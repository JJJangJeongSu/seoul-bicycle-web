import { useState, useEffect } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Pencil, Filter, X } from 'lucide-react';
import { getAllRepairs, updateRepairStatus, updateRepair } from '../../services/admin.service';
import { Repair, RepairStatusEnum, Pagination, RepairCategoryEnum } from '../../../CodeGenerator';
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

// Valid categories for display mapping
const CATEGORY_LABELS: Record<string, string> = {
  [RepairCategoryEnum.Brake]: '브레이크',
  [RepairCategoryEnum.Tire]: '타이어',
  [RepairCategoryEnum.Chain]: '체인',
  [RepairCategoryEnum.Light]: '조명',
  [RepairCategoryEnum.Seat]: '안장',
  [RepairCategoryEnum.Bell]: '벨',
  [RepairCategoryEnum.Other]: '기타'
};

export function AdminRepairs() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false
  });
  // Filtering
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Editing
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null);
  const [editForm, setEditForm] = useState<{
    category: RepairCategoryEnum;
    bikeId: string;
    stationId: string;
    description: string;
    status: RepairStatusEnum;
    adminNote: string;
  }>({
    category: RepairCategoryEnum.Other,
    bikeId: '',
    stationId: '',
    description: '',
    status: RepairStatusEnum.Pending,
    adminNote: ''
  });

  const fetchRepairs = async (page: number, status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const queryStatus = status === 'all' ? undefined : (status as RepairStatusEnum);
      const { repairs: data, pagination: pagData } = await getAllRepairs(queryStatus, page);
      setRepairs(data);
      setPagination(pagData);
    } catch (err) {
      console.error('Failed to fetch repairs:', err);
      setError('고장 신고 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs(1, statusFilter);
  }, [statusFilter]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchRepairs(page, statusFilter);
  };

  const handleStartProcessing = async (repairId: string) => {
    const confirmed = window.confirm('이 고장 신고의 처리를 시작하시겠습니까?');
    if (!confirmed) return;

    try {
      await updateRepairStatus(repairId, 'in-progress');
      alert('처리가 시작되었습니다');
      fetchRepairs(pagination.currentPage, statusFilter);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('처리 상태 변경에 실패했습니다.');
    }
  };

  const handleComplete = async (repairId: string) => {
    const repair = repairs.find(r => r.id === repairId);
    if (!repair) return;

    const note = adminNotes[repairId] || repair.admin_note;
    if (!note) {
      alert('관리자 메모를 입력해주세요');
      return;
    }

    const confirmed = window.confirm('이 고장 신고의 처리를 완료하시겠습니까?');
    if (!confirmed) return;

    try {
      await updateRepairStatus(repairId, 'completed', note);
      
      const newNotes = { ...adminNotes };
      delete newNotes[repairId];
      setAdminNotes(newNotes);
      
      alert('처리가 완료되었습니다');
      fetchRepairs(pagination.currentPage, statusFilter);
    } catch (err) {
      console.error('Failed to complete repair:', err);
      alert('처리 완료 처리에 실패했습니다.');
    }
  };

  const handleSaveNote = async (repairId: string) => {
    const note = adminNotes[repairId];
    if (!note || !note.trim()) {
      alert('메모를 입력해주세요');
      return;
    }

    const repair = repairs.find(r => r.id === repairId);
    if (!repair) return;

    try {
      await updateRepairStatus(repairId, repair.status as any, note);
      
      const newNotes = { ...adminNotes };
      delete newNotes[repairId];
      setAdminNotes(newNotes);
      
      alert('메모가 저장되었습니다');
      fetchRepairs(pagination.currentPage, statusFilter);
    } catch (err) {
        console.error('Failed to save note:', err);
        alert('메모 저장에 실패했습니다.');
    }
  };

  const handleNoteChange = (repairId: string, value: string) => {
    setAdminNotes({
      ...adminNotes,
      [repairId]: value,
    });
  };

  // Edit Handlers
  const handleEditClick = (repair: Repair) => {
    setEditingRepair(repair);
    setEditForm({
      category: repair.category,
      bikeId: repair.bike_id || '',
      stationId: repair.station_id || '',
      description: repair.description || '',
      status: repair.status,
      adminNote: repair.admin_note || ''
    });
  };

  const handleEditSave = async () => {
    if (!editingRepair) return;
    
    try {
      await updateRepair(editingRepair.id, editForm);
      alert('수정되었습니다.');
      setEditingRepair(null);
      fetchRepairs(pagination.currentPage, statusFilter);
    } catch (err) {
      console.error('Failed to update repair:', err);
      alert('수정에 실패했습니다.');
    }
  };

  if (loading && repairs.length === 0) {
      return <div className="flex justify-center p-8"><span className="text-gray-500">로딩중...</span></div>;
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-red-500">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>{error}</p>
            <button 
                onClick={() => fetchRepairs(pagination.currentPage, statusFilter)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                다시 시도
            </button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">상태 필터:</span>
        </div>
        <div className="w-48">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">전체</option>
                <option value="pending">접수</option>
                <option value="in-progress">처리중</option>
                <option value="completed">완료</option>
            </select>
        </div>
      </div>

      {/* Repair List */}
      <div className="space-y-4">
        {repairs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
                접수된 고장 신고가 없습니다.
            </div>
        ) : (
            repairs.map(repair => (
            <div key={repair.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium">{CATEGORY_LABELS[repair.category] || repair.category}</h3>
                    <span className={`px-3 py-1 rounded text-sm ${
                        repair.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                        repair.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                        {repair.status === 'pending' ? '접수' :
                        repair.status === 'in-progress' ? '처리중' : '완료'}
                    </span>
                    </div>
                    <p className="text-sm text-gray-600">
                    ID: {repair.id} · 자전거: {repair.bike_id} · 신고자: {repair.reporter_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        접수일: {new Date(repair.created_at).toLocaleDateString()}
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded" 
                        title="수정"
                        onClick={() => handleEditClick(repair)}
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    {repair.status !== 'completed' && (
                        <>
                        {repair.status === 'pending' && (
                            <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700" onClick={() => handleStartProcessing(repair.id)}>
                            처리 시작
                            </button>
                        )}
                        {repair.status === 'in-progress' && (
                            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => handleComplete(repair.id)}>
                            처리 완료
                            </button>
                        )}
                        </>
                    )}
                </div>
                </div>

                <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">상세 설명</p>
                <p className="text-gray-700">{repair.description || '내용 없음'}</p>
                </div>

                {repair.admin_note && (
                <div className="pt-4 border-t bg-gray-50 rounded p-3 mb-4">
                    <p className="text-sm text-gray-600 mb-1">💬 관리자 메모</p>
                    <p className="text-sm text-gray-700">{repair.admin_note}</p>
                </div>
                )}

                {repair.status === 'in-progress' && (
                <div className="pt-4 border-t">
                    <textarea
                    placeholder={repair.admin_note ? "메모 수정..." : "관리자 메모를 입력하세요..."}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    rows={2}
                    value={adminNotes[repair.id] !== undefined ? adminNotes[repair.id] : (repair.admin_note || '')}
                    onChange={(e) => handleNoteChange(repair.id, e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" 
                            onClick={() => handleSaveNote(repair.id)}
                            disabled={!adminNotes[repair.id] || adminNotes[repair.id] === repair.admin_note}
                        >
                        메모 저장
                        </button>
                    </div>
                </div>
                )}
            </div>
            ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 0 && (
        <div className="bg-white shadow px-6 py-4 border-t flex items-center justify-between rounded-lg">
        <div className="text-sm text-gray-500">
            총 {pagination.totalItems}건 중 {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}건 표시
        </div>
        <div className="flex gap-2">
            <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent"
            >
            <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(page => {
                const current = pagination.currentPage;
                return page === 1 || page === pagination.totalPages || Math.abs(page - current) <= 2;
            })
            .map((page, index, array) => {
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
                        : 'hover:bg-gray-50'
                    }`}
                >
                    {page}
                </button>
                );
            })}

            <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent"
            >
            <ChevronRight className="w-4 h-4" />
            </button>
        </div>
        </div>
      )}

        {/* Custom Edit Modal */}
        {editingRepair && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">고장 신고 수정</h3>
                        <button 
                            onClick={() => setEditingRepair(null)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-500">카테고리</Label>
                            <div className="col-span-3 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                                {CATEGORY_LABELS[editForm.category] || editForm.category}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-500">자전거 ID</Label>
                            <div className="col-span-3 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                                {editForm.bikeId}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-500">대여소 ID</Label>
                            <div className="col-span-3 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                                {editForm.stationId || '-'}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right font-medium">상태</Label>
                            <div className="col-span-3">
                                <select
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({...editForm, status: e.target.value as RepairStatusEnum})}
                                >
                                    <option value={RepairStatusEnum.Pending}>접수</option>
                                    <option value={RepairStatusEnum.InProgress}>처리중</option>
                                    <option value={RepairStatusEnum.Completed}>완료</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-500">설명</Label>
                            <div className="col-span-3 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700 min-h-[40px]">
                                {editForm.description || '-'}
                            </div>
                        </div>

                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="adminNote" className="text-right font-medium">관리자 메모</Label>
                            <Textarea
                                id="adminNote"
                                value={editForm.adminNote || ''}
                                onChange={(e) => setEditForm({...editForm, adminNote: e.target.value})}
                                className="col-span-3 focus:ring-blue-500 font-normal"
                                placeholder="관리자 메모를 입력하세요"
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t flex justify-end gap-2 bg-gray-50">
                        <Button variant="outline" onClick={() => setEditingRepair(null)}>취소</Button>
                        <Button onClick={handleEditSave} className="bg-blue-600 hover:bg-blue-700 text-white">저장</Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

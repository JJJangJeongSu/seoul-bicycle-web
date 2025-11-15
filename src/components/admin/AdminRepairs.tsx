import { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { mockRepairs } from '../../lib/mockData';
import type { Repair } from '../../types';

export function AdminRepairs() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load repairs from localStorage or use mockRepairs
    const savedRepairs = localStorage.getItem('repairs');
    if (savedRepairs) {
      const parsedRepairs: Repair[] = JSON.parse(savedRepairs);
      // Convert date strings back to Date objects
      const repairsWithDates = parsedRepairs.map(r => ({
        ...r,
        createdAt: new Date(r.createdAt),
        completedAt: r.completedAt ? new Date(r.completedAt) : undefined,
      }));
      setRepairs(repairsWithDates);
    } else {
      setRepairs(mockRepairs);
    }
  }, []);

  const saveRepairs = (updatedRepairs: Repair[]) => {
    localStorage.setItem('repairs', JSON.stringify(updatedRepairs));
    setRepairs(updatedRepairs);
  };

  const handleStartProcessing = (repairId: string) => {
    const confirmed = window.confirm('이 고장 신고의 처리를 시작하시겠습니까?');
    if (!confirmed) return;

    const updatedRepairs = repairs.map(r =>
      r.id === repairId
        ? { ...r, status: 'in-progress' as const }
        : r
    );
    saveRepairs(updatedRepairs);
    alert('처리가 시작되었습니다');
  };

  const handleComplete = (repairId: string) => {
    const repair = repairs.find(r => r.id === repairId);
    if (!repair) return;

    const note = adminNotes[repairId] || repair.adminNote;
    if (!note) {
      alert('관리자 메모를 입력해주세요');
      return;
    }

    const confirmed = window.confirm('이 고장 신고의 처리를 완료하시겠습니까?');
    if (!confirmed) return;

    const updatedRepairs = repairs.map(r =>
      r.id === repairId
        ? {
            ...r,
            status: 'completed' as const,
            completedAt: new Date(),
            adminNote: note,
          }
        : r
    );
    saveRepairs(updatedRepairs);
    
    // Clear the note from temp state
    const newNotes = { ...adminNotes };
    delete newNotes[repairId];
    setAdminNotes(newNotes);
    
    alert('처리가 완료되었습니다');
  };

  const handleSaveNote = (repairId: string) => {
    const note = adminNotes[repairId];
    if (!note || !note.trim()) {
      alert('메모를 입력해주세요');
      return;
    }

    const updatedRepairs = repairs.map(r =>
      r.id === repairId
        ? { ...r, adminNote: note }
        : r
    );
    saveRepairs(updatedRepairs);
    
    // Clear the note from temp state
    const newNotes = { ...adminNotes };
    delete newNotes[repairId];
    setAdminNotes(newNotes);
    
    alert('메모가 저장되었습니다');
  };

  const handleNoteChange = (repairId: string, value: string) => {
    setAdminNotes({
      ...adminNotes,
      [repairId]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Repair List */}
      <div className="space-y-4">
        {repairs.map(repair => (
          <div key={repair.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg">{repair.id}</h3>
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
                  자전거: {repair.bikeId} · 신고자: {repair.reporter}
                </p>
              </div>
              
              {repair.status !== 'completed' && (
                <div className="flex gap-2">
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
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">상세 설명</p>
              <p className="text-gray-700">{repair.description}</p>
            </div>

            {repair.adminNote && (
              <div className="pt-4 border-t bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-600 mb-1">💬 관리자 메모</p>
                <p className="text-sm text-gray-700">{repair.adminNote}</p>
              </div>
            )}

            {repair.status === 'in-progress' && !repair.adminNote && (
              <div className="pt-4 border-t">
                <textarea
                  placeholder="관리자 메모를 입력하세요..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  value={adminNotes[repair.id] || ''}
                  onChange={(e) => handleNoteChange(repair.id, e.target.value)}
                />
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => handleSaveNote(repair.id)}>
                  메모 저장
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
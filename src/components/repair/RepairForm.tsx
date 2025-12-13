import { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useServices } from '../../hooks/useServices';
import { RepairCategory, RepairType } from '../../types';

type RepairFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export function RepairForm({ onSuccess, onCancel }: RepairFormProps) {
  const { user } = useAuth();
  const { repairService } = useServices();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'bike' as 'bike' | 'station',
    bikeId: '',
    category: 'brake',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }

    if (formData.type === 'bike' && !formData.bikeId) {
      alert('자전거 번호를 입력하세요');
      return;
    }

    if (!formData.description.trim()) {
      alert('상세 설명을 입력하세요');
      return;
    }

    try {
      setSubmitting(true);

      // Create repair via service
      const newRepair = await repairService.createRepair({
        type: formData.type,
        bike_id: formData.bikeId,
        category: formData.category as RepairCategory,
        description: formData.description,
        reporter: user.name,
        reporterId: user.id,
      });

      alert(`✅ 신고가 접수되었습니다\n\n신고 번호: ${newRepair.id}\n자전거 번호: ${formData.bikeId}\n\n관리자가 확인 후 처리 예정입니다.`);
      onSuccess();
    } catch (err) {
      console.error('Failed to create repair:', err);
      alert('신고 접수에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl mb-6">고장 신고하기</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            신고 대상 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="bike"
                checked={formData.type === 'bike'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RepairType })}
                className="w-4 h-4 text-blue-600"
              />
              <span>자전거</span>
            </label>
          </div>
        </div>

        {/* Bike ID */}
        {formData.type === 'bike' && (
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              자전거 번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.bikeId}
              onChange={(e) => setFormData({ ...formData, bikeId: e.target.value })}
              placeholder="SPB-12345"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              자전거에 표시된 번호를 입력하세요
            </p>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            고장 유형 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="brake">브레이크 고장</option>
            <option value="tire">타이어 문제</option>
            <option value="chain">체인 문제</option>
            <option value="seat">안장 문제</option>
            <option value="light">라이트 고장</option>
            <option value="lock">잠금장치 문제</option>
            <option value="other">기타</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            상세 설명 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="고장 상황을 자세히 설명해주세요"
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>



        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="mb-1">신고 전 확인사항:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>자전거 번호를 정확히 입력해주세요</li>
                <li>고장 상황을 구체적으로 설명해주세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            {submitting ? '접수 중...' : '신고 접수'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

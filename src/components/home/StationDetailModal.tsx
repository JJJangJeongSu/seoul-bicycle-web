import { useEffect } from 'react';
import { X, MapPin, Phone, Clock, Bike, Navigation } from 'lucide-react';
import type { Station } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useRental } from '../../contexts/RentalContext';

type StationDetailModalProps = {
  station: Station;
  onClose: () => void;
  onRent: (stationId: string) => void;
  onReturn: (stationId: string) => void;
};

export function StationDetailModal({
  station,
  onClose,
  onRent,
  onReturn,
}: StationDetailModalProps) {
  const { user, refreshUser } = useAuth();
  const { currentRental } = useRental();
  
  // Refresh user data when modal opens to get latest rental status
  useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, [user?.id]); // Depend on user ID to avoid infinite loops if user object reference changes deeply

  // Use isRenting from user object as primary source of truth for rental status
  const isRenting = user?.isRenting ?? false;
  console.log(isRenting);
  
  const canRent = user && !isRenting && station.bikeCount > 0 && station.status === 'active';
  const canReturn = user && isRenting && station.status === 'active';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl">{station.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">주소</p>
                <p>{station.address}</p>
              </div>
            </div>


            <div className="flex items-start gap-3">
              <Bike className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">현재 자전거</p>
                <p className={`text-xl ${
                  station.bikeCount === 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {station.bikeCount}대
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="p-4 rounded-lg border-2 border-dashed">
            {station.status === 'inactive' ? (
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg mb-2">
                  ⚫ 운영 중지
                </div>
                <p className="text-sm text-gray-600">현재 이 대여소는 운영이 중지되었습니다</p>
              </div>
            ) : station.bikeCount === 0 ? (
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-lg mb-2">
                  🔴 대여 불가
                </div>
                <p className="text-sm text-gray-600">현재 대여 가능한 자전거가 없습니다</p>
              </div>
            ) : station.bikeCount <= 4 ? (
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg mb-2">
                  🟡 여유 부족
                </div>
                <p className="text-sm text-gray-600">자전거가 얼마 남지 않았습니다</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg mb-2">
                  🟢 대여 여유
                </div>
                <p className="text-sm text-gray-600">자전거를 편하게 대여하실 수 있습니다</p>
              </div>
            )}
          </div>



          {/* Actions */}
          <div className="space-y-3">
            {!user && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  로그인 후 자전거를 대여하실 수 있습니다
                </p>
              </div>
            )}

            {isRenting && currentRental && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  현재 대여 중인 자전거: {currentRental.bikeId}
                </p>
                <p className="text-xs text-blue-600">
                  이 대여소에 반납하거나 다른 대여소를 선택하세요
                </p>
              </div>
            )}

            {isRenting && !currentRental && (
               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  현재 자전거를 대여 중입니다.
                </p>
                <p className="text-xs text-blue-600">
                  반납하시려면 '여기에 반납하기' 버튼을 눌러주세요.
                </p>
              </div>
            )}

            {isRenting && canReturn && (
              <button
                onClick={() => onReturn(station.id)}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Bike className="w-5 h-5" />
                여기에 반납하기
              </button>
            )}

            {!isRenting && canRent && (
              <button
                onClick={() => onRent(station.id)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Bike className="w-5 h-5" />
                자전거 대여하기
              </button>
            )}

           
          </div>
        </div>
      </div>
    </div>
  );
}

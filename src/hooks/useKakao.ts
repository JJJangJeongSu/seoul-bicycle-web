import { useEffect, useState } from 'react';

export function useKakaoMap(key: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if ((window as any).kakao && (window as any).kakao.maps) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    script.async = true;
    script.onload = () => {
      (window as any).kakao.maps.load(() => setLoaded(true));
    };
    document.head.appendChild(script);
  }, [key]);

  return loaded;
}

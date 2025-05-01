"use client";

import NaverMap from "@/components/naverMap/NaverMap";
import { useRef } from "react";

const MainPage = () => {
  const geoJsonRef = useRef<naver.maps.Data | null>(null);

  const handleMapLoad = (map: naver.maps.Map) => {
    if (!window.naver) return;

    // GeoJSON 로드
    const data = new naver.maps.Data();
    geoJsonRef.current = data;

    data.setMap(map);

    data.addGeoJson(
      {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [126.5, 37.5],
                  [128, 37.5],
                  [128, 37.575],
                  [126.5, 37.575],
                  [126.5, 37.5],
                ],
              ],
            },
            properties: {
              name: "샘플 폴리곤",
            },
          },
        ],
      },
      true // ✅ autoStyle: 기본 스타일 자동 적용 여부
    );
  };

  return (
    <>
      <NaverMap isBackground={false} onLoad={handleMapLoad} />
    </>
  );
};

export default MainPage;

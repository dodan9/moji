"use client";

import NaverMap from "@/components/naverMap/NaverMap";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash-es";
import axios from "axios";

const MapPage = () => {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null); // ✅ 단일 마커 참조

  const fetchRegion = async (lat: number, lng: number) => {
    try {
      const { data } = await axios.get("/api/geocode", {
        params: { lat, lng },
      });

      const area = data.results?.[0]?.region;
      if (area) {
        const name = `${area.area1.name} ${area.area2.name} ${area.area3.name}`;
        setRegion(name);
      } else {
        setRegion("주소를 찾을 수 없음");
      }
    } catch (err) {
      console.error("지역 정보 가져오기 실패:", err);
      setRegion(null);
    }
  };

  const handleMapLoad = (map: naver.maps.Map) => {
    mapRef.current = map;

    const updateCenter = debounce(() => {
      const c = map.getCenter() as naver.maps.LatLng;
      setCenter([c.lat(), c.lng()]);
    }, 200);

    naver.maps.Event.addListener(map, "center_changed", updateCenter);

    // ✅ 마커 최초 1회만 생성
    const initialPos = map.getCenter();
    const marker = new naver.maps.Marker({
      position: initialPos,
      map: map,
    });

    markerRef.current = marker;
  };

  useEffect(() => {
    if (!center || !mapRef.current || !markerRef.current) return;

    // ✅ 마커 위치 갱신
    const latlng = new naver.maps.LatLng(...center);
    markerRef.current.setPosition(latlng);

    fetchRegion(...center);
  }, [center]);

  return (
    <>
      <NaverMap onLoad={handleMapLoad} />
      {center && (
        <div className='fixed top-4 right-4 bg-white p-2 shadow rounded text-sm text-red-500'>
          {center.join(", ")}
        </div>
      )}
      {region && (
        <div className='fixed top-14 right-4 bg-white p-2 shadow rounded text-sm text-emerald-600'>
          {region}
        </div>
      )}
    </>
  );
};

export default MapPage;

"use client";

import NaverMap from "@/components/naverMap/NaverMap";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash-es";
import axios from "axios";
import { useCurrentLocation, useMapStore } from "@/store/mapStore";

const MapPage = () => {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const currentLocation = useCurrentLocation();

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

    const initialPos = map.getCenter();
    const marker = new naver.maps.Marker({
      position: initialPos,
      map,
    });

    updateCenter();

    markerRef.current = marker;
  };

  useEffect(() => {
    if (!center || !mapRef.current || !markerRef.current) return;

    const latlng = new naver.maps.LatLng(...center);
    markerRef.current.setPosition(latlng);

    fetchRegion(...center);
  }, [center]);

  const moveToCurrentLocation = () => {
    if (!mapRef.current || !markerRef.current || !currentLocation) return;

    const pos = new naver.maps.LatLng(...currentLocation);
    mapRef.current.setCenter(pos);
    markerRef.current.setPosition(pos);
    setCenter(currentLocation);
  };

  return (
    <>
      <NaverMap onLoad={handleMapLoad} />
      <button
        onClick={moveToCurrentLocation}
        className='fixed top-4 right-4 z-50 bg-blue-600 text-white px-3 py-2 rounded shadow'
      >
        현재 위치로 이동
      </button>
      {center && (
        <div className='fixed top-14 right-4 bg-white p-2 shadow rounded text-sm text-red-500'>
          {center.join(", ")}
        </div>
      )}
      {region && (
        <div className='fixed top-24 right-4 bg-white p-2 shadow rounded text-sm text-emerald-600'>
          {region}
        </div>
      )}
    </>
  );
};

export default MapPage;

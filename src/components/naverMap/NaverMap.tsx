"use client";

import { useMapStore } from "@/store/mapStore";
import { useEffect, useRef, useState } from "react";

interface NaverMapProps {
  isBackground?: boolean;
  onLoad?: (map: naver.maps.Map) => void;
}

const NaverMap = ({ isBackground = true, onLoad }: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<naver.maps.Map | null>(null);
  const { currentLocation, setCurrentLocation } = useMapStore();

  // 지도 생성
  useEffect(() => {
    if (!window.naver || !mapRef.current) return;

    const center = new naver.maps.LatLng(...currentLocation);

    mapInstance.current = new naver.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      mapTypeControl: false,
      zoomControl: isBackground,
    });

    // blank 맵 등록 (등록은 별도로 가능)
    const BlankMapType = new naver.maps.ImageMapType({
      name: "BlankMap",
      minZoom: 0,
      maxZoom: 21,
      tileSize: new naver.maps.Size(256, 256),
      getTileUrl: () => [
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      ],
    });

    mapInstance.current.mapTypes.set("blank", BlankMapType);

    // 현재 위치 마커
    new naver.maps.Marker({
      position: center,
      map: mapInstance.current,
      title: "현재 위치",
      icon: {
        content: `
          <div style="
            width: 40px;
            height: 40px;
            background-color: #f6543b;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 0 4px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
          ">
            위치
          </div>
        `,
        anchor: new naver.maps.Point(20, 20),
      },
    });

    // 콜백으로 map 인스턴스 전달
    if (onLoad && mapInstance.current) {
      onLoad(mapInstance.current);
    }
  }, [currentLocation]);

  // 배경 타입 전환
  useEffect(() => {
    if (!mapInstance.current) return;

    const typeId = isBackground
      ? naver.maps.MapTypeId.NORMAL
      : ("blank" as unknown as naver.maps.MapTypeId);

    mapInstance.current.setMapTypeId(typeId);
  }, [mapInstance.current, isBackground]);

  // 현재 위치 획득
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentLocation([coords.latitude, coords.longitude]);
      },
      (err) => {
        console.error("위치 에러:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "calc(100vh - 40px)" }} />
  );
};

export default NaverMap;

// src/app/api/geocode/route.ts

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_KEY!;
  const secret = process.env.NEXT_PUBLIC_NAVER_MAP_SECRET_KEY!;

  const url = "https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc";

  try {
    const { data } = await axios.get(url, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": clientId,
        "X-NCP-APIGW-API-KEY": secret,
      },
      params: {
        coords: `${lng},${lat}`,
        request: "coordsToaddr",
        output: "json",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("역지오코딩 오류:", (error as any).response?.data || error);
    return NextResponse.json(
      { error: "Geocoding API failed" },
      { status: 500 }
    );
  }
}

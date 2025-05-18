"use client";
import { useParams } from "next/navigation";
import MapFranchisePage from "../page";

const MapFranchiseDetailPage = () => {
  const params = useParams();
  const fid = params.fid as string;

  return (
    <>
      <MapFranchisePage />
      <h2>Map Franchise Detail {fid} Page</h2>
    </>
  );
};

export default MapFranchiseDetailPage;

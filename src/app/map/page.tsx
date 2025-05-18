import Link from "next/link";

const MapPage = () => {
  return (
    <>
      <h2>Map Page</h2>
      <div>
        <Link href='/map/favorites'>Favorites 저장</Link>
      </div>
      <div>
        <Link href='/map/franchise'>Franchise 가맹점</Link>
      </div>
    </>
  );
};

export default MapPage;

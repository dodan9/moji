import Link from "next/link";

const RootHeader = () => {
  const menuList = ["main", "map"];
  return (
    <div className='w-full flex justify-around items-center'>
      {menuList.map((menu) => {
        return (
          <div key={menu}>
            <Link href={menu}>{menu}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default RootHeader;

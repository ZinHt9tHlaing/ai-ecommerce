import { Link } from "react-router";

const Navbar = () => {
  return (
    <div className="flex h-[12vh] items-center justify-between px-9 shadow-lg">
      {/* Logo */}
      <Link to={"/"}>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          E-Mart
        </h1>
      </Link>

      {/* Navigation Links */}
      <div className="hidden items-center gap-8 md:flex">
        <Link
          to={"/"}
          className="text-base font-medium text-gray-700 transition-colors hover:text-gray-900"
        >
          Home
        </Link>
        <Link
          to={"/product"}
          className="text-base font-medium text-gray-700 transition-colors hover:text-gray-900"
        >
          Products
        </Link>
      </div>

      <div className="">
        <h1>User Profile</h1>
      </div>
    </div>
  );
};

export default Navbar;

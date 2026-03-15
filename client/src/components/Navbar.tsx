import { Link, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChartLine, LogOut, UserRound } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

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

      <div className="flex cursor-pointer items-center justify-center gap-4">
        {/* User Profile Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
              <Avatar className="h-8 w-8">
                <AvatarImage src={"https://github.com/shadcn.png"} />
                <AvatarFallback className="bg-gray-900 text-sm font-medium text-white">
                  {/* {user?.name?.charAt(0).toUpperCase()} */}
                  CN
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-gray-900 lg:block">
                {/* {user?.name} */}
                Profile
              </span>
            </button>
          </PopoverTrigger>

          <PopoverContent>
            <div className="flex flex-col gap-1">
              <Link
                to={"/profile"}
                className="group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <UserRound
                  size={16}
                  className="rounded-full ring-1 ring-black duration-150 group-hover:scale-110"
                />
                Profile
              </Link>

              {/* {user?.owner && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Dashboard
                </button>
              )} */}
              <button
                onClick={() => navigate("/dashboard")}
                className="group flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <ChartLine
                  size={16}
                  className="duration-150 group-hover:scale-110"
                />
                Dashboard
              </button>

              <button
                // onClick={logoutHandler}
                className="group flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut
                  size={16}
                  className="duration-150 group-hover:translate-x-0.5"
                />
                Logout
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;

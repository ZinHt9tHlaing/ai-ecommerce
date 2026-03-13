import Navbar from "@/components/Navbar";
import { Outlet, useLocation } from "react-router";

const MainLayoutPage = () => {
  const location = useLocation();
  const hiddenRoute = ["/login", "/register"];
  const shouldHideNavbar = hiddenRoute.some((route) =>
    location.pathname.startsWith(route),
  );

  return (
    <div className="">
      {!shouldHideNavbar && <Navbar />}
      <Outlet />
    </div>
  );
};

export default MainLayoutPage;

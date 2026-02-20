import api from "@/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const confirmed = confirm("Are you sure you want to logout?");
      if (confirmed) {
        const res = await api.post("/user/logout");
        if (res.status === 200) {
          toast.success(res.data.message);
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Logout error", error);
      toast.error("Logout error!");
    }
  };

  return (
    <div className="mb-5 bg-gray-300">
      <div className="flex max-w-6xl items-center justify-between p-2">
        <h1 className="text-lg font-bold">Todo App</h1>
        <Button variant={"destructive"} onClick={logoutHandler}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;

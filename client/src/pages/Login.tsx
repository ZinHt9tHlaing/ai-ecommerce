import api from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LoginTypes } from "@/types/user";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loginHandler = async () => {
    try {
      const res = await api.post<LoginTypes>("/user/login", user);

      if (res.data.success) {
        toast.success(res.data.message);
        setUser({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      console.error("Login error", error);
      toast.error("LUser not found with this credentials!");
    }
  };

  return (
    <div className="space-y-3">
      <Input
        type="email"
        name="email"
        value={user.email}
        onChange={changeHandler}
        placeholder="Email"
      />
      <div className="justify-betweens relative flex items-center">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          value={user.password}
          onChange={changeHandler}
          placeholder="Password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 text-gray-500 focus:outline-none"
        >
          {showPassword ? (
            <Eye className="size-5" />
          ) : (
            <EyeOff className="size-5" />
          )}
        </button>
      </div>
      <Button onClick={loginHandler}>Login</Button>
    </div>
  );
};

export default Login;

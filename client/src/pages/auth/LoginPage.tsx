import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginSchema } from "@/schema/user-schema";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "@/queries/user-queries";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: loginMutation, isPending } = useLoginMutation();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await loginMutation(data, {
        onSuccess: (data) => {
          toast.success(data.message);
          navigate("/", { replace: true });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data.message);
          }
        },
      });
      form.reset();
    } catch (error) {
      console.log("Login failed", error);
    }
  };

  return (
    <section className="flex h-screen items-center justify-center">
      <div className="mx-auto w-80 rounded-md border-2 border-gray-300 p-8 md:w-1/4">
        <h2 className="mb-2 text-center font-bold">E-Mart</h2>
        <p className="text-center text-sm font-medium text-gray-400">
          Enter your information to login.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@eshop.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="********"
                      inputMode="numeric"
                      // minLength={8}
                      // maxLength={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer rounded-lg duration-200 active:scale-95"
            >
              {isPending ? (
                <>
                  <Spinner className="size-5 animate-spin text-white" />
                  <span className="animate-pulse">Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium underline underline-offset-4"
          >
            Register
          </Link>
          <hr className="my-4" />
          <Link
            to={"/forgot-password"}
            className="w-full text-center text-xs text-gray-400 underline"
          >
            Forgot password ?
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

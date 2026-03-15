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
import { registerSchema, type RegisterSchema } from "@/schema/user-schema";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "@/queries/user-queries";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: registerMutation, isPending } = useRegisterMutation();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerMutation(data, {
        onSuccess: (data) => {
          toast.success(data.message);
          navigate("/login", { replace: true });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data.message);
          }
        },
      });
      form.reset();
    } catch (error) {
      console.log("Register failed", error);
    }
  };

  return (
    <section className="flex h-screen items-center justify-center">
      <div className="mx-auto w-90 rounded-md border-2 border-gray-300 p-8 md:w-1/4">
        <h2 className="mb-2 flex items-center justify-center gap-2 text-center font-bold">
          E-Mart <ShoppingCart className="size-4" />
        </h2>
        <p className="text-center text-sm font-medium text-gray-400">
          Enter your information to register.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input placeholder="your_name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@eshop.com"
                      {...field}
                    />
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
                  <span className="animate-pulse">Registering...</span>
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium underline underline-offset-4"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;

import userService, {
  type LoginPayload,
  type RegisterPayload,
} from "@/services/user-services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: ({ name, email, password }: RegisterPayload) =>
      userService.register({ name, email, password }),

    onSuccess: (data) => {
      console.log("Register data", data);
    },
    onError: (error) => {
      console.log("Register error", error);
    },
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ email, password }: LoginPayload) =>
      userService.login({ email, password }),
    onSuccess: (data) => {
      console.log("Login data", data);
    },
    onError: (error) => {
      console.log("Login error", error);
    },
  });

export const useGetUserProfileMQuery = () =>
  useQuery({
    queryKey: ["user-profile"],
    queryFn: userService.getUserProfile,
  });

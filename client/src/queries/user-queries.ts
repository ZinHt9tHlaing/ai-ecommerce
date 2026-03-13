import userService, {
  type LoginPayload,
  type RegisterPayload,
} from "@/services/user-services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: ({ name, email, password }: RegisterPayload) =>
      userService.register({ name, email, password }),
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ email, password }: LoginPayload) =>
      userService.login({ email, password }),
  });

export const useGetUserProfileMQuery = () =>
  useQuery({
    queryKey: ["user-profile"],
    queryFn: userService.getUserProfile,
  });

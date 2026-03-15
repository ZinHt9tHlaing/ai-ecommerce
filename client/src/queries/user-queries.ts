import userService, {
  type LoginPayload,
  type RegisterPayload,
  type UpdateProfilePayload,
} from "@/services/user-services";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

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

export const useUpdateUserProfileMutation = () =>
  useMutation({
    mutationFn: ({ name, profilePhoto }: UpdateProfilePayload) =>
      userService.updateProfile({ name, profilePhoto }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

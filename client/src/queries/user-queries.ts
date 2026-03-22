import userService, {
  type LoginPayload,
  type RegisterPayload,
  type UpdateProfilePayload,
} from "@/services/user-services";
import type { GetUserProfileResponse } from "@/types/response/user-responses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useGetUserProfileQuery = () =>
  useQuery({
    queryKey: ["user-profile"],
    queryFn: userService.getUserProfile,
  });

export const useUpdateUserProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, profilePhoto }: UpdateProfilePayload) =>
      userService.updateProfile({ name, profilePhoto }),

    // optimistic update
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["user-profile"] });

      const previousData = queryClient.getQueryData(["user-profile"]);

      // temporary update
      queryClient.setQueryData(
        ["user-profile"],
        (old: GetUserProfileResponse) => ({
          ...old,
          name: newData.name,
          profilePhoto:
            newData.profilePhoto instanceof File
              ? URL.createObjectURL(newData.profilePhoto)
              : newData.profilePhoto,
        }),
      );

      return { previousData };
    },

    onError: (err, newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["user-profile"], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};

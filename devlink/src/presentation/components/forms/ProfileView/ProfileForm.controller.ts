import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { useGetMyProfile, useUpdateProfile, useUpdateUser } from "@/infrastructure/apis/api-management/profile";
import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";
import { toast } from "react-toastify";

export type ProfileFormModel = {
  name: string;
  bio?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
};

const useInitProfileForm = (initialData?: ProfileFormModel) => {
  const defaultValues: ProfileFormModel = {
    name: initialData?.name || "",
    bio: initialData?.bio || "",
    linkedInUrl: initialData?.linkedInUrl || "",
    gitHubUrl: initialData?.gitHubUrl || "",
  };

  const schema = yup.object().shape({
    name: yup.string().required("Name is required!").min(2, "Name must be at least 2 characters!"),
    bio: yup.string(),
    linkedInUrl: yup.string().url("Invalid URL format!"),
    gitHubUrl: yup.string().url("Invalid URL format!"),
  });

  const resolver = yupResolver(schema);
  return { defaultValues, resolver };
};

export type ProfileFormController = {
  state: {
    errors: ReturnType<typeof useForm<ProfileFormModel>>["formState"]["errors"];
    isLoading: boolean;
  };
  actions: {
    register: ReturnType<typeof useForm<ProfileFormModel>>["register"];
    handleSubmit: ReturnType<typeof useForm<ProfileFormModel>>["handleSubmit"];
    submit: (data: ProfileFormModel) => void;
    reset: ReturnType<typeof useForm<ProfileFormModel>>["reset"];
  };
  computed: {
    isSubmitting: boolean;
  };
};

export const useProfileFormController = (): ProfileFormController => {
  const { data: profileData, isLoading: isProfileLoading } = useGetMyProfile();
  const user = useOwnUser();
  const { mutateAsync: updateProfile, status: profileStatus } = useUpdateProfile();
  const { mutateAsync: updateUser, status: userStatus } = useUpdateUser();

  const profileId = profileData?.response?.id;
  const userId = user?.id;

  const initialData: ProfileFormModel = {
    name: user?.name || "",
    bio: profileData?.response?.bio || "",
    linkedInUrl: profileData?.response?.linkedInUrl || "",
    gitHubUrl: profileData?.response?.gitHubUrl || "",
  };

  const { defaultValues, resolver } = useInitProfileForm(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormModel>({
    defaultValues,
    resolver,
  });

  useEffect(() => {
    if (user || profileData?.response) {
      reset({
        name: user?.name || "",
        bio: profileData?.response?.bio || "",
        linkedInUrl: profileData?.response?.linkedInUrl || "",
        gitHubUrl: profileData?.response?.gitHubUrl || "",
      });
    }
  }, [user, profileData, reset]);

  const submit = useCallback(
    async (data: ProfileFormModel) => {
      try {
        if (userId && data.name !== user?.name) {
          await updateUser({ id: userId, name: data.name });
        }

        if (profileId) {
          await updateProfile({
            id: profileId,
            bio: data.bio,
            linkedInUrl: data.linkedInUrl,
            gitHubUrl: data.gitHubUrl,
          });
        } else if (userId) {
          await updateProfile({
            id: userId,
            bio: data.bio,
            linkedInUrl: data.linkedInUrl,
            gitHubUrl: data.gitHubUrl,
          });
        }

        toast.success("Profile updated successfully!");
      } catch (error: unknown) {
        toast.error((error as Error)?.message || "Failed to update profile!");
      }
    },
    [updateProfile, updateUser, profileId, userId, user?.name]
  );

  return {
    actions: {
      handleSubmit,
      submit,
      register,
      reset,
    },
    computed: {
      isSubmitting: profileStatus === "pending" || userStatus === "pending",
    },
    state: {
      errors,
      isLoading: isProfileLoading,
    },
  };
};

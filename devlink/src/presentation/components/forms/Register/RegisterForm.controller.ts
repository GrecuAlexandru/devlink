import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useRegister } from "@/infrastructure/apis/api-management";
import { useAppDispatch } from "@/application/store";
import { setToken } from "@/application/state-slices";
import { toast } from "react-toastify";
import { useAppRouter } from "@/infrastructure/hooks/useAppRouter";

export type RegisterFormModel = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  userType: "User" | "CompanyOwner";
};

const useInitRegisterForm = () => {
  const defaultValues: RegisterFormModel = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    userType: "User",
  };

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required!")
      .email("Invalid email format!")
      .default(defaultValues.email),
    password: yup
      .string()
      .required("Password is required!")
      .min(6, "Password must be at least 6 characters!")
      .default(defaultValues.password),
    confirmPassword: yup
      .string()
      .required("Please confirm your password!")
      .oneOf([yup.ref("password")], "Passwords must match!")
      .default(defaultValues.confirmPassword),
    name: yup
      .string()
      .required("Name is required!")
      .min(2, "Name must be at least 2 characters!")
      .default(defaultValues.name),
    userType: yup
      .string()
      .oneOf(["User", "CompanyOwner"])
      .default(defaultValues.userType),
  });

  const resolver = yupResolver(schema);

  return { defaultValues, resolver };
};

export type RegisterFormController = {
  state: {
    errors: ReturnType<typeof useForm<RegisterFormModel>>["formState"]["errors"];
  };
  actions: {
    register: ReturnType<typeof useForm<RegisterFormModel>>["register"];
    handleSubmit: ReturnType<typeof useForm<RegisterFormModel>>["handleSubmit"];
    submit: (data: RegisterFormModel) => void;
  };
  computed: {
    isSubmitting: boolean;
  };
};

export const useRegisterFormController = (): RegisterFormController => {
  const { defaultValues, resolver } = useInitRegisterForm();
  const { redirectToLogin } = useAppRouter();
  const { mutateAsync: registerUser, status } = useRegister();
  const dispatch = useAppDispatch();

  const submit = useCallback(
    (data: RegisterFormModel) => {
      const { confirmPassword, ...registerData } = data;
      return registerUser(registerData)
        .then((result) => {
          if (result.response?.token) {
            dispatch(setToken(result.response.token));
            toast.success("Account created successfully!");
            redirectToLogin();
          } else {
            toast.success("Account created! Please login.");
            redirectToLogin();
          }
        })
        .catch((error) => {
          toast.error(error?.message || "Registration failed!");
        });
    },
    [registerUser, redirectToLogin, dispatch]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormModel>({
    defaultValues,
    resolver,
  });

  return {
    actions: {
      handleSubmit,
      submit,
      register,
    },
    computed: {
      isSubmitting: status === "pending",
    },
    state: {
      errors,
    },
  };
};

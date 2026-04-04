import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useLogin } from "@/infrastructure/apis/api-management";
import { useAppDispatch } from "@/application/store";
import { setToken } from "@/application/state-slices";
import { toast } from "react-toastify";
import { useAppRouter } from "@/infrastructure/hooks/useAppRouter";

export type LoginFormModel = {
  email: string;
  password: string;
};

const useInitLoginForm = () => {
  const defaultValues: LoginFormModel = {
    email: "",
    password: "",
  };

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Email is a required field!")
      .email()
      .default(defaultValues.email),
    password: yup
      .string()
      .required("Password is a required field!")
      .default(defaultValues.password),
  });

  const resolver = yupResolver(schema);

  return { defaultValues, resolver };
};

export type LoginFormController = {
  state: {
    errors: ReturnType<typeof useForm<LoginFormModel>>["formState"]["errors"];
  };
  actions: {
    register: ReturnType<typeof useForm<LoginFormModel>>["register"];
    handleSubmit: ReturnType<typeof useForm<LoginFormModel>>["handleSubmit"];
    submit: (data: LoginFormModel) => void;
  };
  computed: {
    isSubmitting: boolean;
  };
};

export const useLoginFormController = (): LoginFormController => {
  const { defaultValues, resolver } = useInitLoginForm();
  const { redirectToHome } = useAppRouter();
  const { mutateAsync: login, status } = useLogin();
  const dispatch = useAppDispatch();

  const submit = useCallback(
    (data: LoginFormModel) =>
      login(data).then((result) => {
        dispatch(setToken(result.response?.token ?? ""));
        toast.success("You logged in successfully!");
        redirectToHome();
      }),
    [login, redirectToHome, dispatch]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormModel>({
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

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useAppDispatch } from "@/application/store";
import { toast } from "react-toastify";
import { useAppRouter } from "@/infrastructure/hooks/useAppRouter";
import { useCreateCompany } from "@/infrastructure/apis/api-management";

export type CreateCompanyFormModel = {
  name: string;
  industry: string;
  website?: string;
};

const useInitCreateCompanyForm = () => {
  const defaultValues: CreateCompanyFormModel = {
    name: "",
    industry: "",
    website: "",
  };

  const schema = yup.object().shape({
    name: yup.string().required("Company name is required!").min(2, "Name must be at least 2 characters!"),
    industry: yup.string().required("Industry is required!"),
    website: yup.string().url("Invalid URL format!"),
  });

  const resolver = yupResolver(schema);
  return { defaultValues, resolver };
};

export type CreateCompanyFormController = {
  state: {
    errors: ReturnType<typeof useForm<CreateCompanyFormModel>>["formState"]["errors"];
  };
  actions: {
    register: ReturnType<typeof useForm<CreateCompanyFormModel>>["register"];
    handleSubmit: ReturnType<typeof useForm<CreateCompanyFormModel>>["handleSubmit"];
    submit: (data: CreateCompanyFormModel) => void;
  };
  computed: {
    isSubmitting: boolean;
  };
};

export const useCreateCompanyFormController = (): CreateCompanyFormController => {
  const { defaultValues, resolver } = useInitCreateCompanyForm();
  const { navigate } = useAppRouter();
  const { mutateAsync: createCompany, status } = useCreateCompany();

  const submit = useCallback(
    (data: CreateCompanyFormModel) =>
      createCompany(data)
        .then(() => {
          toast.success("Company created successfully!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error?.message || "Failed to create company!");
        }),
    [createCompany, navigate]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyFormModel>({
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

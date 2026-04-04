import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { useGetMyCompany, useUpdateCompany } from "@/infrastructure/apis/api-management/company";
import { toast } from "react-toastify";

export type CompanyFormModel = {
  name: string;
  industry: string;
  website?: string;
  description?: string;
};

const useInitCompanyForm = (initialData?: CompanyFormModel) => {
  const defaultValues: CompanyFormModel = {
    name: initialData?.name || "",
    industry: initialData?.industry || "",
    website: initialData?.website || "",
    description: initialData?.description || "",
  };

  const schema = yup.object().shape({
    name: yup.string().required("Company name is required!").min(2, "Name must be at least 2 characters!"),
    industry: yup.string().required("Industry is required!"),
    website: yup.string().url("Invalid URL format!"),
    description: yup.string(),
  });

  const resolver = yupResolver(schema);
  return { defaultValues, resolver };
};

export type CompanyFormController = {
  state: {
    errors: ReturnType<typeof useForm<CompanyFormModel>>["formState"]["errors"];
    isLoading: boolean;
    companyId: string | null;
  };
  actions: {
    register: ReturnType<typeof useForm<CompanyFormModel>>["register"];
    handleSubmit: ReturnType<typeof useForm<CompanyFormModel>>["handleSubmit"];
    submit: (data: CompanyFormModel) => void;
    reset: ReturnType<typeof useForm<CompanyFormModel>>["reset"];
  };
  computed: {
    isSubmitting: boolean;
  };
};

export const useCompanyFormController = (): CompanyFormController => {
  const { data: companyData, isLoading } = useGetMyCompany();
  const { mutateAsync: updateCompany, status } = useUpdateCompany();

  const companyId = companyData?.response?.id || null;
  const initialData = companyData?.response;

  const { defaultValues, resolver } = useInitCompanyForm(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormModel>({
    defaultValues,
    resolver,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        industry: initialData.industry || "",
        website: initialData.website || "",
        description: initialData.description || "",
      });
    }
  }, [initialData, reset]);

  const submit = useCallback(
    (data: CompanyFormModel) => {
      if (!companyId) {
        toast.error("Company not found!");
        return;
      }

      return updateCompany({
        id: companyId,
        ...data,
      })
        .then(() => {
          toast.success("Company updated successfully!");
        })
        .catch((error) => {
          toast.error(error?.message || "Failed to update company!");
        });
    },
    [updateCompany, companyId]
  );

  return {
    actions: {
      handleSubmit,
      submit,
      register,
      reset,
    },
    computed: {
      isSubmitting: status === "pending",
    },
    state: {
      errors,
      isLoading,
      companyId,
    },
  };
};

import { memo, useState } from "react";
import { useGetMyCompany, useUpdateCompany, useGetCompanyMembers, useAddCompanyMember, useRemoveCompanyMember } from "@/infrastructure/apis/api-management/company";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Briefcase, Users, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type CompanyFormModel = {
  name: string;
  industry: string;
  website?: string;
  description?: string;
};

export const CompanyPage = memo(() => {
  const { data: companyData, isLoading } = useGetMyCompany();
  const { mutateAsync: updateCompany, status } = useUpdateCompany();
  const queryClient = useQueryClient();
  const company = companyData?.response;
  const [showMembers, setShowMembers] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().required("Company name is required!").min(2, "Name must be at least 2 characters!"),
    industry: yup.string().required("Industry is required!"),
    website: yup.string().url("Invalid URL format!"),
    description: yup.string(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormModel>({
    defaultValues: {
      name: company?.name || "",
      industry: company?.industry || "",
      website: company?.website || "",
      description: company?.description || "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || "",
        industry: company.industry || "",
        website: company.website || "",
        description: company.description || "",
      });
    }
  }, [company, reset]);

  const submit = useCallback(
    (data: CompanyFormModel) => {
      if (!company?.id) {
        toast.error("Company not found!");
        return;
      }

      return updateCompany({ id: company.id, ...data })
        .then(() => {
          toast.success("Company updated successfully!");
          queryClient.invalidateQueries({ queryKey: ["myCompany"] });
        })
        .catch((error) => {
          toast.error(error?.message || "Failed to update company!");
        });
    },
    [updateCompany, company?.id, queryClient]
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-center text-muted-foreground">Loading company information...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">You don't have a company yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <CardContent className="relative px-6 pb-6">
          <div className="-mt-12 mb-6 flex items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-background shadow-sm">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <div className="mb-1">
              <h1 className="text-2xl font-bold">{company.name}</h1>
              {company.industry && (
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  {company.industry}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" {...register("name")} disabled={status === "pending"} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" {...register("industry")} disabled={status === "pending"} />
                {errors.industry && <p className="text-sm text-destructive">{errors.industry.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">
                <Globe className="mr-1 inline h-4 w-4" />
                Website
              </Label>
              <Input id="website" {...register("website")} disabled={status === "pending"} placeholder="https://company.com" />
              {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} disabled={status === "pending"} placeholder="Describe your company..." />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <Button type="submit" disabled={status === "pending"}>
              {status === "pending" ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>Manage your company members</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowMembers(!showMembers)}>
              {showMembers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {showMembers && <CompanyMembersView />}
      </Card>
    </div>
  );
});

const CompanyMembersView = () => {
  const { data: membersData, isLoading } = useGetCompanyMembers();
  const members = membersData?.response ?? [];
  const removeMember = useRemoveCompanyMember();
  const queryClient = useQueryClient();

  const handleRemove = (userId: string) => {
    removeMember.mutate(userId, {
      onSuccess: () => {
        toast.success("Member removed!");
        queryClient.invalidateQueries({ queryKey: ["companyMembers"] });
      },
      onError: (error: unknown) => {
        toast.error((error as Error)?.message || "Failed to remove member!");
      },
    });
  };

  if (isLoading) {
    return <p className="px-6 text-sm text-muted-foreground">Loading members...</p>;
  }

  if (members.length === 0) {
    return <p className="px-6 text-sm text-muted-foreground">No members yet.</p>;
  }

  return (
    <CardContent className="pt-0">
      <div className="space-y-3">
        {members.map((member: { id: string; userId: string; role: string; user?: { name: string; email: string } }) => (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{member.user?.name ?? "Unknown"}</p>
                <p className="text-sm text-muted-foreground">{member.user?.email ?? ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.role === "CompanyAdmin" ? "default" : member.role === "Recruiter" ? "secondary" : "outline"}>
                  {member.role === "CompanyAdmin" ? "Owner" : member.role}
                </Badge>
                {member.role !== "CompanyAdmin" && (
                  <Button variant="destructive" size="icon" onClick={() => handleRemove(member.userId)} disabled={removeMember.status === "pending"}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  );
};

import { memo, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useGetMyCompany, useUpdateCompany, useGetCompanyMembers, useAddCompanyMember, useRemoveCompanyMember, useGetCompanyById, useGetCompanyMembersById } from "@/infrastructure/apis/api-management/company";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Briefcase, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";

type CompanyFormModel = {
  name: string;
  
  
  description?: string;
};

export const CompanyPage = memo(() => {
  const { id } = useParams<{ id: string }>();

  if (id) {
    return <CompanyByIdView id={id} />;
  }
  return <MyCompanyView />;
});

const CompanyByIdView = ({ id }: { id: string }) => {
  const { data: companyData, isLoading } = useGetCompanyById(id);
  const company = companyData?.response;

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
            <p className="text-center text-muted-foreground">Company not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <CompanyDetailsCard company={company} isReadonly={true} />
      <CompanyMembersCard companyId={id} isReadonly={true} />
    </div>
  );
};

const MyCompanyView = () => {
  const { data: companyData, isLoading } = useGetMyCompany();
  const company = companyData?.response;

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
      <CompanyDetailsCard company={company} isReadonly={false} />
      <CompanyMembersCard companyId={company.id} isReadonly={false} />
    </div>
  );
};

const CompanyDetailsCard = ({ company, isReadonly }: { company: any; isReadonly: boolean }) => {
  const { mutateAsync: updateCompany, status } = useUpdateCompany();
  const queryClient = useQueryClient();
  const user = useOwnUser();
  const isOwner = user?.role === "CompanyAdmin" || user?.role === "Admin";

  const schema = yup.object().shape({
    name: yup.string().required("Company name is required!").min(2, "Name must be at least 2 characters!"),
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
      
      
      description: company?.description || "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || "",
        
        
        description: company.description || "",
      });
    }
  }, [company, reset]);

  const submit = useCallback(
    (data: CompanyFormModel) => {
      if (isReadonly || !isOwner) return;
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
    [updateCompany, company, queryClient, isReadonly, isOwner]
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="px-6 pb-6 pt-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted shadow-sm">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" {...register("name")} disabled={isReadonly || !isOwner || status === "pending"} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} disabled={isReadonly || !isOwner || status === "pending"} placeholder="Describe your company..." />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          {!isReadonly && isOwner && (
            <Button type="submit" disabled={status === "pending"}>
              {status === "pending" ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

const CompanyMembersCard = ({ companyId, isReadonly }: { companyId: string; isReadonly: boolean }) => {
  const [showMembers, setShowMembers] = useState(false);
  const user = useOwnUser();
  const isOwner = user?.role === "CompanyAdmin" || user?.role === "Admin";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>{isReadonly ? "People who work here" : isOwner ? "Manage your company members" : "View company members"}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowMembers(!showMembers)}>
            {showMembers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {showMembers && <CompanyMembersList companyId={companyId} isReadonly={isReadonly} />}
    </Card>
  );
};

const CompanyMembersList = ({ companyId, isReadonly }: { companyId: string; isReadonly: boolean }) => {
  const { data: membersData, isLoading } = useGetCompanyMembersById(companyId);
  const members = membersData?.response ?? [];
  const removeMember = useRemoveCompanyMember();
  const queryClient = useQueryClient();
  const user = useOwnUser();
  const isOwner = user?.role === "CompanyAdmin" || user?.role === "Admin";

  const handleRemove = (userId: string) => {
    if (!isOwner) return;

    if (!window.confirm("Remove this member from the company?")) {
      return;
    }

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
    return <p className="px-6 pb-6 text-sm text-muted-foreground">Loading members...</p>;
  }

  if (members.length === 0) {
    return <p className="px-6 pb-6 text-sm text-muted-foreground">No members yet.</p>;
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
                  {member.role === "CompanyAdmin" ? "Owner" : member.role === "Client" ? "Employee" : member.role}
                </Badge>
                {!isReadonly && isOwner && member.role !== "CompanyAdmin" && (
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

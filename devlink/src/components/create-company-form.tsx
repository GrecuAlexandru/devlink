import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCompanyFormController } from "@/presentation/components/forms/CreateCompany/CreateCompanyForm.controller";

export function CreateCompanyForm({ className }: React.ComponentProps<"div">) {
  const { state, actions, computed } = useCreateCompanyFormController();

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create Your Company</CardTitle>
          <CardDescription>You need to create a company profile to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={actions.handleSubmit(actions.submit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Company Inc."
                {...actions.register("name")}
                disabled={computed.isSubmitting}
              />
              {state.errors.name && <p className="text-sm text-destructive">{state.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                type="text"
                placeholder="Technology"
                {...actions.register("industry")}
                disabled={computed.isSubmitting}
              />
              {state.errors.industry && <p className="text-sm text-destructive">{state.errors.industry.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://company.com"
                {...actions.register("website")}
                disabled={computed.isSubmitting}
              />
              {state.errors.website && <p className="text-sm text-destructive">{state.errors.website.message}</p>}
            </div>
            <Button type="submit" disabled={computed.isSubmitting} className="w-full">
              {computed.isSubmitting ? "Creating..." : "Create Company"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

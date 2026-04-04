import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { AppRoute } from "@/routes";
import { useRegisterFormController } from "@/presentation/components/forms/Register/RegisterForm.controller";

export function RegisterForm({ className }: React.ComponentProps<"div">) {
  const { state, actions, computed } = useRegisterFormController();

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-sm", className)}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Choose your account type and fill in your details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={actions.handleSubmit(actions.submit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">Account Type</Label>
              <Select
                defaultValue="User"
                onValueChange={(value) => {
                  const event = { target: { name: "userType", value } };
                  actions.register("userType").onChange(event as React.ChangeEvent<HTMLInputElement>);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">Regular User</SelectItem>
                  <SelectItem value="CompanyOwner">Company Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...actions.register("name")}
                disabled={computed.isSubmitting}
              />
              {state.errors.name && (
                <p className="text-sm text-destructive">{state.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...actions.register("email")}
                disabled={computed.isSubmitting}
              />
              {state.errors.email && (
                <p className="text-sm text-destructive">{state.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...actions.register("password")}
                disabled={computed.isSubmitting}
              />
              {state.errors.password && (
                <p className="text-sm text-destructive">{state.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...actions.register("confirmPassword")}
                disabled={computed.isSubmitting}
              />
              {state.errors.confirmPassword && (
                <p className="text-sm text-destructive">{state.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={computed.isSubmitting} className="w-full">
              {computed.isSubmitting ? "Creating account..." : "Register"}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to={AppRoute.Login} className="text-primary underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

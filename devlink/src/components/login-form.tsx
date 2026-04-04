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
import { useLoginFormController } from "@/presentation/components/forms/Login/LoginForm.controller";

export function LoginForm({ className }: React.ComponentProps<"div">) {
  const { state, actions, computed } = useLoginFormController();

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={actions.handleSubmit(actions.submit)} className="space-y-4">
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
            <Button type="submit" disabled={computed.isSubmitting} className="w-full">
              {computed.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

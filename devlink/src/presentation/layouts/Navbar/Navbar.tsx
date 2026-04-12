import { Link } from "react-router-dom";
import { AppRoute } from "@/routes";
import { useAppDispatch, useAppSelector } from "@/application/store";
import { resetProfile } from "@/application/state-slices";
import { useAppRouter } from "@/infrastructure/hooks/useAppRouter";
import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { queryClient } from "@/main";

export function Navbar() {
  const { loggedIn } = useAppSelector((x) => x.profileReducer);
  const dispatch = useAppDispatch();
  const { redirectToHome } = useAppRouter();
  const user = useOwnUser();
  const isAdmin = user?.role === "Admin" || user?.email === "admin@default.com";

  const logout = () => {
    queryClient.clear();
    dispatch(resetProfile());
    redirectToHome();
  };

  return (
    <div className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <NavigationMenu className="h-14 w-full max-w-none justify-start">
          <NavigationMenuList className="w-full gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to={AppRoute.Index} className={`${navigationMenuTriggerStyle()} font-semibold tracking-tight`}>
                  DevLink
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {loggedIn && (isAdmin ? (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to={AppRoute.Feedback} className={navigationMenuTriggerStyle()}>
                    Feedback
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Feed} className={navigationMenuTriggerStyle()}>
                      Feed
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Jobs} className={navigationMenuTriggerStyle()}>
                      Jobs
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.People} className={navigationMenuTriggerStyle()}>
                      People
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Feedback} className={navigationMenuTriggerStyle()}>
                      Feedback
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Company} className={navigationMenuTriggerStyle()}>
                      Company
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            ))}

            <NavigationMenuItem className="ml-auto flex items-center gap-1">
              {!loggedIn ? (
                <>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Login} className={navigationMenuTriggerStyle()}>
                      Login
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Register} className={navigationMenuTriggerStyle()}>
                      Register
                    </Link>
                  </NavigationMenuLink>
                </>
              ) : (
                <>
                  {!isAdmin && (
                    <NavigationMenuLink asChild>
                      <Link to={AppRoute.Profile} className={navigationMenuTriggerStyle()}>
                        Profile
                      </Link>
                    </NavigationMenuLink>
                  )}
                  <button onClick={logout} className={navigationMenuTriggerStyle()}>
                    Logout
                  </button>
                </>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

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

export function Navbar() {
  const { loggedIn } = useAppSelector((x) => x.profileReducer);
  const dispatch = useAppDispatch();
  const { redirectToHome } = useAppRouter();
  const user = useOwnUser();
  const isCompanyAdmin = user?.role === "CompanyAdmin";

  const logout = () => {
    dispatch(resetProfile());
    redirectToHome();
  };

  return (
    <div className="w-full border-b bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <NavigationMenu className="h-14">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to={AppRoute.Index} className={navigationMenuTriggerStyle()}>
                  DevLink
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {loggedIn && (
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
                {isCompanyAdmin && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to={AppRoute.Company} className={navigationMenuTriggerStyle()}>
                        Company
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </>
            )}

            <NavigationMenuItem className="ml-auto flex gap-1">
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
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Profile} className={navigationMenuTriggerStyle()}>
                      Profile
                    </Link>
                  </NavigationMenuLink>
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

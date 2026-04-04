import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "@/routes";

export const useAppRouter = () => {
  const navigate = useNavigate();

  const redirectToHome = useCallback(() => navigate(AppRoute.Index), [navigate]);

  const redirectToLogin = useCallback(() => navigate(AppRoute.Login), [navigate]);

  const redirectToFeed = useCallback(() => navigate(AppRoute.Feed), [navigate]);

  const redirectToJobs = useCallback(() => navigate(AppRoute.Jobs), [navigate]);

  const redirectToApplications = useCallback(() => navigate(AppRoute.Applications), [navigate]);

  const redirectToFeedback = useCallback(() => navigate(AppRoute.Feedback), [navigate]);

  return {
    redirectToHome,
    redirectToLogin,
    redirectToFeed,
    redirectToJobs,
    redirectToApplications,
    redirectToFeedback,
    navigate,
  };
};

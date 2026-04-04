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
  const redirectToCreateCompany = useCallback(() => navigate(AppRoute.CreateCompany), [navigate]);
  const redirectToCompany = useCallback(() => navigate(AppRoute.Company), [navigate]);
  const redirectToProfile = useCallback(() => navigate(AppRoute.Profile), [navigate]);
  const redirectToPeople = useCallback(() => navigate(AppRoute.People), [navigate]);

  return {
    redirectToHome,
    redirectToLogin,
    redirectToFeed,
    redirectToJobs,
    redirectToApplications,
    redirectToFeedback,
    redirectToCreateCompany,
    redirectToCompany,
    redirectToProfile,
    redirectToPeople,
    navigate,
  };
};

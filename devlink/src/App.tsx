import { ToastNotifier } from "@/presentation/components/ui/ToastNotifier";
import { HomePage } from "@/presentation/pages/HomePage";
import { LoginPage } from "@/presentation/pages/LoginPage";
import { RegisterPage } from "@/presentation/pages/RegisterPage";
import { JobsPage } from "@/presentation/pages/JobsPage";
import { ApplicationsPage } from "@/presentation/pages/ApplicationsPage";
import { FeedbackPage } from "@/presentation/pages/FeedbackPage";
import { CreateCompanyPage } from "@/presentation/pages/CreateCompanyPage";
import { CompanyPage } from "@/presentation/pages/CompanyPage";
import { ProfilePage } from "@/presentation/pages/ProfilePage";
import { PeoplePage } from "@/presentation/pages/PeoplePage";
import { Navbar } from "@/presentation/layouts/Navbar";
import { Route, Routes } from "react-router-dom";
import { AppRoute } from "@/routes";
import { useAppSelector } from "@/application/store";

function App() {
  const { loggedIn } = useAppSelector((x) => x.profileReducer);

  return (
    <div className="app-shell-bg min-h-screen">
      <ToastNotifier />
      <Navbar />
      <main className="relative min-h-[calc(100vh-57px)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-background/80 to-transparent" />
        <div className="relative">
          <Routes>
            <Route path={AppRoute.Index} element={<HomePage />} />
            <Route path={AppRoute.Login} element={<LoginPage />} />
            <Route path={AppRoute.Register} element={<RegisterPage />} />
            {loggedIn && <Route path={AppRoute.Jobs} element={<JobsPage />} />}
            {loggedIn && <Route path={AppRoute.Applications} element={<ApplicationsPage />} />}
            {loggedIn && <Route path={AppRoute.Feedback} element={<FeedbackPage />} />}
            {loggedIn && <Route path={AppRoute.Company} element={<CompanyPage />} />}
            {loggedIn && <Route path={AppRoute.Company + "/:id"} element={<CompanyPage />} />}
            {loggedIn && <Route path={AppRoute.Profile} element={<ProfilePage />} />}
            {loggedIn && <Route path={AppRoute.Profile + "/:id"} element={<ProfilePage />} />}
            {loggedIn && <Route path={AppRoute.People} element={<PeoplePage />} />}
            <Route path={AppRoute.CreateCompany} element={<CreateCompanyPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

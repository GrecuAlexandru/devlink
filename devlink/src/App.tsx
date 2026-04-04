import { ToastNotifier } from "@/presentation/components/ui/ToastNotifier";
import { HomePage } from "@/presentation/pages/HomePage";
import { LoginPage } from "@/presentation/pages/LoginPage";
import { RegisterPage } from "@/presentation/pages/RegisterPage";
import { FeedPage } from "@/presentation/pages/FeedPage";
import { JobsPage } from "@/presentation/pages/JobsPage";
import { ApplicationsPage } from "@/presentation/pages/ApplicationsPage";
import { FeedbackPage } from "@/presentation/pages/FeedbackPage";
import { CreateCompanyPage } from "@/presentation/pages/CreateCompanyPage";
import { CompanyPage } from "@/presentation/pages/CompanyPage";
import { Navbar } from "@/presentation/layouts/Navbar";
import { Route, Routes } from "react-router-dom";
import { AppRoute } from "@/routes";
import { useAppSelector } from "@/application/store";

function App() {
  const { loggedIn } = useAppSelector((x) => x.profileReducer);

  return (
    <div className="min-h-screen">
      <ToastNotifier />
      <Navbar />
      <main>
        <Routes>
          <Route path={AppRoute.Index} element={<HomePage />} />
          <Route path={AppRoute.Login} element={<LoginPage />} />
          <Route path={AppRoute.Register} element={<RegisterPage />} />
          {loggedIn && <Route path={AppRoute.Feed} element={<FeedPage />} />}
          {loggedIn && <Route path={AppRoute.Jobs} element={<JobsPage />} />}
          {loggedIn && <Route path={AppRoute.Applications} element={<ApplicationsPage />} />}
          {loggedIn && <Route path={AppRoute.Feedback} element={<FeedbackPage />} />}
          {loggedIn && <Route path={AppRoute.Company} element={<CompanyPage />} />}
          <Route path={AppRoute.CreateCompany} element={<CreateCompanyPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

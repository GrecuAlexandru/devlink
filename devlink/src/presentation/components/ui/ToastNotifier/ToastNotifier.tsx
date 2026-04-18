import { useInterceptor } from "@/infrastructure/hooks/useInterceptor";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { ErrorResponse } from "@/application/models/ErrorResponse";
import { is } from "@/infrastructure/utils/typeUtils";
import { useTokenHasExpired } from "@/infrastructure/hooks/useOwnUser";
import { ErrorCodes } from "@/infrastructure/apis/client";

const getErrorMessage = (code?: ErrorCodes): string => {
  switch (code) {
    case ErrorCodes.CannotAdd:
      return "Cannot add data!";
    case ErrorCodes.CannotDelete:
      return "Cannot delete data!";
    case ErrorCodes.CannotUpdate:
      return "Cannot update data!";
    case ErrorCodes.EntityNotFound:
      return "The entity was not found!";
    case ErrorCodes.MailSendFailed:
      return "The mail couldn't be sent!";
    case ErrorCodes.PhysicalFileNotFound:
      return "The file was not found!";
    case ErrorCodes.TechnicalError:
      return "A technical error occurred, please contact support!";
    case ErrorCodes.UserAlreadyExists:
      return "The user already exists!";
    case ErrorCodes.WrongPassword:
      return "You entered the wrong password!";
    default:
      return "An unknown error occurred!";
  }
};

export const ToastNotifier = () => {
  const tokenHasExpired = useTokenHasExpired();

  useInterceptor({
    async onResponse(response: Response) {
      if (response.status === 401 && tokenHasExpired.loggedIn && tokenHasExpired.hasExpired) {
        toast.error("The session has expired, please login again!");
      } else if (response.status === 500) {
        toast.error("An unknown error occurred!");
      } else if (
        !response.ok &&
        response.headers.has("content-type") &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        const cloned = response.clone();
        const error = await cloned.json();
        
        // Suppress global errors for auth requests (login/register) to prevent duplicate toasts
        const isAuthRequest = response.url.includes("/api/Authorization/Login") || response.url.includes("/api/Authorization/Register");
        const isApplyRequest = response.url.includes("/api/Application/Apply");

        if (error && is<ErrorResponse>(error) && !isAuthRequest && !isApplyRequest) {
          toast.error(`Error: ${getErrorMessage(error.errorMessage.code)}`);
        }
      }

      return response;
    },
    onResponseError(error: unknown) {
      if ((error as Error).message === "Failed to fetch") {
        toast.error("A network error occurred, please verify your internet connection!");
      }

      return error;
    },
  });

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

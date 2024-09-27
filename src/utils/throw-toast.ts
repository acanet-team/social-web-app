import { toast, type ToastOptions } from "react-toastify";

export const throwToast = (message: string, notiType: string) => {
  const notiConfig: ToastOptions = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const notify = () => {
    // if (message !== "" && notiType === "success") {
    //   toast.success(message, notiConfig);
    // } else if (message !== "" && notiType === "error") {
    //   toast.error(message, notiConfig);
    // }
    if (message !== "") {
      if (notiType === "success") {
        toast.success(message, notiConfig);
      }
      if (notiType === "error") {
        toast.error(message, notiConfig);
      }
      if (notiType === "warning") {
        toast.warning(message, notiConfig);
      }
      if (notiType === "info") {
        toast.info(message, notiConfig);
      }
    }
  };

  notify();
};

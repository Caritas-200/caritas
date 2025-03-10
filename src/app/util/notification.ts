import Swal from "sweetalert2";

export const showSuccessNotification = (message: string) => {
  Swal.fire({
    position: "bottom-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500,
    toast: true,
  });
};

export const showErrorNotification = (message: string) => {
  Swal.fire({
    position: "bottom-end",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 1500,
    toast: true,
  });
};

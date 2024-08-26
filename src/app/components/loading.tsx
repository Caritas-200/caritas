// components/Loading.tsx
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Create a custom Swal instance with React content support
const MySwal = withReactContent(Swal);

const showLoading = () => {
  return MySwal.fire({
    title: "Loading...",
    text: "Please wait while we process your request.",
    didOpen: () => {
      // Display the loading spinner
      MySwal.showLoading();
    },
    allowOutsideClick: false, // Prevent closing the modal by clicking outside
    showConfirmButton: false, // Hide the confirm button
    showCancelButton: false, // Hide the cancel button
    didClose: () => {
      // Optional: Custom logic on close
    },
  });
};

const hideLoading = () => {
  return MySwal.close();
};

export { showLoading, hideLoading };

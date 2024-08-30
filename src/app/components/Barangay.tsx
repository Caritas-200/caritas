import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface FolderProps {
  name: string;
  onDelete: () => void; // Pass a delete function from the parent component
}

const MySwal = withReactContent(Swal);

const Folder: React.FC<FolderProps> = ({ name, onDelete }) => {
  const handleDelete = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
        MySwal.fire("Deleted!", "Your folder has been deleted.", "success");
      }
    });
  };

  return (
    <div className="relative bg-gray-500 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{name.toUpperCase()}</h3>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-red-500"
      >
        ✖
      </button>
    </div>
  );
};

export default Folder;

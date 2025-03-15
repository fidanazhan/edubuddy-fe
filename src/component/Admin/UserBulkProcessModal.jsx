import { useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FiFileText, FiTrash } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const UserBulkProcessModal = ({ onClose, modalProcess }) => {
  const [modalType, setModalType] = useState(null);
  const [newFile, setNewFile] = useState(null)
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { t, ready } = useTranslation(["common", "modal"]);

  const subdomain = window.location.hostname.split(".")[0];

  const closeModal = () => {
    setModalType(null);
    onClose();
  };

  const downloadTemplate = (type) => {
    const fileName = type.replace(" ", "_") + ".xlsx"; // Convert spaces to underscores
    const fileUrl = `/excel_template/User/${fileName}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrop = (e) => {
    e.preventDefault(); // Prevent default browser behavior

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setNewFile(droppedFiles[0]); // Set only the first dropped file
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setNewFile(selectedFiles[0]); // Set only the first selected file
    }
  };

  const handleRemoveFile = () => {
    setNewFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input to allow re-uploading the same file
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!newFile) {
      console.error("No file selected");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", newFile);

    // Determine the API endpoint based on modalType
    let apiEndpoint = "";
    switch (modalProcess) { // Use modalProcess instead of modalType (assuming modalProcess holds the type)
      case "Bulk Add":
        apiEndpoint = "/api/user/bulk-add";
        break;
      case "Bulk Update":
        apiEndpoint = "/api/user/bulk-update";
        break;
      case "Bulk Delete":
        apiEndpoint = "/api/user/bulk-delete";
        break;
      default:
        console.error("Invalid modal process type");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + apiEndpoint, {
        headers: { "x-tenant": subdomain }, // Ensure subdomain is defined somewhere
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Upload successful:", result);
      } else {
        const errorResponse = await response.json(); // Get error details
        console.error("Upload Failed (Status):", response.status);
        console.error("Upload Failed (Error Message):", errorResponse.error || errorResponse.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-[34rem]">
        <div className="text-xl font-bold mb-4 flex justify-between items-center">
          <h2>{modalProcess}</h2>
          <button
            className="text-white hover:text-gray-900 bg-red-500 p-1 rounded-md"
            onClick={closeModal}
          >
            <IoMdClose />
          </button>
        </div>

        <button
          onClick={() => downloadTemplate(modalProcess)}
          className="mt-2 text-sm px-2 py-1 mb-4 bg-green-500 font-semibold text-white rounded hover:bg-green-600"
        >
          {t("modal:user_bulk.download")}
        </button>
        {/* <p>Download the Excel template for {modalType}:</p> */}
        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 py-16 text-center cursor-pointer flex items-center justify-center dark:bg-gray-800"
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p className="text-gray-500">{t("common:drag")}</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {newFile && (
          <div className="space-y-3 mb-6 mt-4">
            <div className="border p-4 rounded-lg flex items-center justify-between bg-gray-100">
              <div className="flex items-center space-x-4">
                <FiFileText className="text-gray-500 w-6 h-6" />
                <div>
                  <p className="font-medium">{newFile.name}</p>
                  <p className="text-sm text-gray-500">{newFile.type || "Unknown Type"}</p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleFileUpload}
          disabled={newFile == null}
          className="mt-4 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t("common:button.upload")}
        </button>
        <button
          onClick={closeModal}
          className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          {t("common:button.close")}
        </button>
      </div>
    </div>
  );
};

export default UserBulkProcessModal;

import { useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FiFileText, FiTrash } from "react-icons/fi";

const BannerModal = ({onClose, modalProcess, onSuccess }) => {
  const [newFile, setNewFile] = useState(null)
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subdomain = window.location.hostname.split(".")[0];
  const token = localStorage.getItem("accessToken");

  const closeModal = () => {
    onClose();
  };

  const handleDrop = (e) => {
    setError(null)
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setNewFile(file);
      } else {
        setError("Only JPG and PNG files are allowed.");
      }
    }
  };
  
  const handleFileChange = (e) => {
    setError(null)
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setNewFile(file);
      } else {
        setError("Only JPG and PNG files are allowed.");
        e.target.value = ""; // Reset file input
      }
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
  
    // Ensure modalProcess and subdomain are correctly defined before making the API call
    if (!modalProcess) {
      console.error("modalProcess is undefined or null");
      setLoading(false);
      return;
    }
  
    if (!subdomain) {
      console.error("subdomain is undefined or null");
      setLoading(false);
      return;
    }
  
    // Determine the API endpoint based on the pictureType
    let apiEndpoint = "";
    switch (modalProcess) {
      case "Login Banner":
        apiEndpoint = `http://localhost:5000/api/config/upload/login-logo`;
        break;
      case "Banner":
        apiEndpoint = `http://localhost:5000/api/config/upload/banner`;
        break;
      case "Logo":
        apiEndpoint = `http://localhost:5000/api/config/upload/dashboard-logo`;
        break;
      default:
        console.error("Invalid picture type:", modalProcess);
        setLoading(false);
        return;
    }
  
    try {
      const response = await fetch(apiEndpoint, {
        headers: { 
            "x-tenant": subdomain,
            "Authorization": `Bearer ${token}`,
        }, // Ensure subdomain is passed correctly
        method: "POST",
        body: formData,
      });
  
      if (response.status == 200 || response.status == 201) {
        const result = await response.json();
        onSuccess();
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.error || errorResponse.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="z-10 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[34rem]">
        <div className="text-xl font-bold mb-4 flex justify-between items-center">
          <h2>{modalProcess}</h2>
          <button className="text-white hover:text-gray-900 bg-red-400 p-1 rounded-md" onClick={closeModal}>
            <IoMdClose />
          </button>
        </div>

        {error && 
            <p className="text-red-500 mb-2">{error}</p>
        }
        <div
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer flex items-center justify-center overflow-hidden"
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {newFile ? (
            <img
              src={URL.createObjectURL(newFile)}
              alt="Preview"
              className="w-full h-full object-fill rounded-lg"
            />
          ) : (
            <p className="text-gray-500">Drag & drop an image here, or click to upload.</p>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg, image/png" className="hidden" />
        </div>

        {newFile && (
          <div className="space-y-3 mb-6 mt-4">
            <div className="border p-4 rounded-lg flex items-center justify-between bg-gray-100">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">{newFile.name}</p>
                  <p className="text-sm text-gray-500">{newFile.type}</p>
                </div>
              </div>
              <button onClick={handleRemoveFile} className="text-red-500 hover:text-red-700">
                <FiTrash className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <button onClick={handleFileUpload} disabled={!newFile} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {loading ? "Uploading..." : "Upload"}
        </button>
        <button onClick={closeModal} className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  );
};

export default BannerModal;

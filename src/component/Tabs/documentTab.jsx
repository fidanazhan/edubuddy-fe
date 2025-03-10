import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Trash2, UploadCloud, Search, ChevronUp, ChevronDown } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { FiUploadCloud, FiFileText, FiTrash } from "react-icons/fi";
import StorageBar from "../../component/Workspace/Document/StorageBar";
import Toast from '../../component/Toast/Toast'
import { useTranslation } from 'react-i18next';
import api from '../../api/axios'

const ITEMS_PER_PAGE = 5;
const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState([]);
  const [tags, setTags] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState("")
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { t, ready } = useTranslation(["admin", "common"]);

  const subdomain = window.location.hostname.split(".")[0];
  const token = localStorage.getItem("accessToken");

  // Fetch files from backend
  useEffect(() => {
    getFileByUser()
  }, []);

  // ----------------------------- GET FILES API-----------------------------------

  const getFileByUser = async (page = 1, limit = ITEMS_PER_PAGE) => {
    setLoading(true);
    try {

      setTimeout(async () => {
        try {
          const response = await api.get(`/api/file`, {
            params: { page, limit, search: searchTerm || undefined },
            headers: {
              "Authorization": `Bearer ${token}`,
              "x-tenant": subdomain
            },
          });
          setFiles(Array.isArray(response.data.data) ? response.data.data : []);
          setTotalPages(response.data.pages);
          setCurrentPage(page);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  }

  const handlePageChange = (pageNumber) => {
    getFileByUser(pageNumber);
    setCurrentPage(pageNumber);
  };

  // ----------------------------- UPLOAD FILES API -----------------------------------

  // Handle file upload
  const handleFileUpload = async () => {
    if (newFile.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    const formData = new FormData();

    newFile.forEach((file) => {
      formData.append("files", file); // 'files' should match the backend key
    });

    formData.append("tag", tags || "Untagged"); // 

    // Properly log FormData contents
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": ", pair[1]);
    // }

    try {
      const response = await api.post("/api/file/upload", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-tenant": subdomain
        },
      });

      if (response.status === 201 || response.status === 200) {
        getFileByUser();
        showToast("Successfully added!", "bg-green-500", "success");
      }
      // setLoading(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      // setLoading(false);
      handleRemoveFile();
      setNewFile([]);
      setTags("");
    }
  };

  // Add file to preview listing
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewFile((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // Handle drag-and-drop
  const handleDrop = (e) => {
    e.preventDefault(); // Prevent default browser behavior

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setNewFile((prevFiles) => [...prevFiles, ...droppedFiles]); // Append new files
    }
  };

  const handleRemoveFile = (index) => {
    setNewFile((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      return updatedFiles;
    });

    // Reset the file input field to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  // ----------------------------- DELETE FILE API (ONE FILE ONLY) -----------------------------------

  // Handle file deletion
  const deleteFile = async (id) => {
    try {
      const response = await api.delete(`/api/file/delete/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-tenant": subdomain
        },
      });

      if (response.status === 200 || response.status === 204) {
        getFileByUser(currentPage);
        showToast("Successfully deleted!", "bg-red-500", "alert");
      } else {
        console.error("Failed to delete file: Unexpected response", response);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    } finally {
      setNewFile([]);
      handleRemoveFile();
      setTags("");
      setIsDeleteModalOpen(false);
    }
  };

  // ----------------------------- DELETE FILES API (MULTIPLE FILE) -----------------------------------

  // Select checkboxes for selection of files for multiple files delete
  const toggleSelection = (fileId) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId)
        : [...prevSelected, fileId]
    );
  };

  // Trigger deleteSelectedFiles function when button is clicked. 
  const handleDeleteSelected = () => {
    if (selectedFiles.length > 0) {
      deleteSelectedFiles(selectedFiles);
      setSelectedFiles([]); // Clear selection after deletion
    }
  };

  const deleteSelectedFiles = async (fileIds) => {
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      console.error("Invalid fileIds:", fileIds);
      return;
    }

    const data = {
      fileIds: fileIds
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/file/delete-multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "x-tenant": subdomain
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200 || response.status === 204) {
        getFileByUser(1);
        showToast("Successfully deleted!", "bg-red-500", "alert");
      } else {
        console.error("Failed to delete file: Unexpected response -> ", response);
      }

    } catch (error) {
      console.error("Error deleting files:", error);
    } finally {
      handleRemoveFile();
      setNewFile([]);
      setTags("");
      setIsDeleteModalOpen(false);
    }
  };

  // ----------------------------- SHOW TOAST -----------------------------------

  const showToast = (message, color, status) => {
    setToast({ message, color, status });
    setTimeout(() => setToast(null), 3000);
  };

  if (!ready) return null;

  return (
    <div className="max-w-screen-lg mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{t("admin:document.title")}</h1>
      </div>

      {/* Upload Section */}
      <div className="flex w-full space-x-4">
        {/* File Upload Box (7/12 width) */}
        <div className="w-7/12 border-2 border-dashed border-gray-300 rounded-lg p-6 py-10 text-center cursor-pointer flex items-center justify-center dark:bg-gray-600"
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}>
          <p className="text-gray-500 dark:text-gray-200">Drag & drop files here, or click to upload.</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>

        {/* Tag Input and Upload Button (5/12 width) */}
        <div className="w-5/12 flex flex-col items-center space-y-4  rounded-lg p-6">
          <input
            type="text"
            placeholder="Enter tag (optional)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border rounded w-full dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 text-gray-700 dark:text-gray-300 overflow-hidden"
          />
          <button
            onClick={handleFileUpload}
            disabled={newFile.length === 0 || newFile.length > 5}
            className="bg-blue-500 h-10 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center w-full justify-center"
          >
            <UploadCloud className="w-5 h-5 mr-2" />
            {t("common:button.upload")}
          </button>
        </div>
      </div>

      {newFile.length > 0 && (
        <div className="space-y-3 mb-6 mt-4">
          {newFile.map((file, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg flex items-center justify-between bg-gray-100"
            >
              <div className="flex items-center space-x-4">
                <FiFileText className="text-gray-500 w-6 h-6" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{file.type || "Unknown Type"}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search & Sort */}
      <div className="flex justify-end space-x-4 mb-4 mt-20 w-full">
        <div className="flex justify-end mb-2">
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={selectedFiles.length === 0}
          >
            Delete Files
          </button>
        </div>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getFileByUser(1, ITEMS_PER_PAGE);
              }
            }}
            className="border p-2 rounded w-full dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 dark:text-gray-300 overflow-hidden"
          />
          <Search className="absolute top-2 right-3 text-gray-500 w-5 h-5 dark:text-gray-100" />
        </div>
        {/* <button
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex items-center space-x-2"
        >
          {sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />}
          <span>Sort</span>
        </button> */}
      </div>

      {/* File Listing */}
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-600 border-b">
                <th className="px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(files.map((file) => file._id));
                      } else {
                        setSelectedFiles([]);
                      }
                    }}
                    checked={
                      selectedFiles.length === files.length &&
                      files.length > 0
                    }
                  />
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left w-96">File Name</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Type</th>
                <th className="border border-gray-200 px-4 py-2 text-center">User</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Size</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Tag</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id} className="border-b">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file._id)}
                      onChange={() => toggleSelection(file._id)}
                    />
                  </td>
                  <td className="border border-gray-200 px-4 py-2 w-96">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm"
                    >
                      {file.originalName}
                    </a>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center text-sm">
                    {file.type === "application/pdf" ? "PDF" : file.type}
                  </td>
                  <td className="px-4 py-2 flex text-center items-center justify-center">
                    {file.uploadedBy?.profilePictureUrl && (
                      <img
                        src={file.uploadedBy.profilePictureUrl}
                        alt="Profile Photo"
                        className="w-8 h-8 rounded-full"
                        title={file.uploadedBy.name}
                      />
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center text-sm">
                    {file.size < 1024
                      ? `${file.size} B`
                      : file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center text-sm">{file.tag}</td>
                  <td className="border border-gray-200 px-4 py-2 text-center space-x-4 text-sm">
                    <button
                      onClick={() => {
                        setSelectedFile(file);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Document"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-3 py-1 rounded-lg border ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-500 dark:font-semibold"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Delete User UserModal */}
      {isDeleteModalOpen && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 transform transition-all duration-300 scale-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to delete{" "}
              <span className="text-red-500">{selectedFile.originalName}</span>?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Please confirm your decision.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                onClick={() => { deleteFile(selectedFile._id) }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          color={toast.color}
          status={toast.status}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default FileManagement;

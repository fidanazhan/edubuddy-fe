import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Trash2, UploadCloud, Search, ChevronUp, ChevronDown } from "lucide-react";
import { BiEdit } from "react-icons/bi";
import { FiUploadCloud, FiFileText, FiTrash } from "react-icons/fi";
import StorageBar from "../../../component/Workspace/Document/StorageBar";
import Toast from '../../../component/Toast/Toast'

const ITEMS_PER_PAGE = 5;
const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [tags, setTags] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState("")
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
    
  

  const subdomain = window.location.hostname.split(".")[0];
  const token = localStorage.getItem("accessToken");


  // Fetch files from backend
  useEffect(() => {
    getFileByUser()
    // const savedFiles = JSON.parse(localStorage.getItem("files")) || [];
    // if (Array.isArray(savedFiles)) {
    //   setFiles(savedFiles);
    // } else {
    //   setFiles([]); // Ensure it's always an array
    // }
  }, []);

  const getFileByUser = async () => {
    setLoading(true);  // Show loading immediately when search is triggered
    try {

      setTimeout(async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/file`, {
            headers: { 
              "Authorization": `Bearer ${token}`,
              "x-tenant": subdomain 
            },
          });
        setFiles(response.data);
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
  

  // Handle file upload
  const handleFileUpload = async () => {
    // setLoading(true);
    if (!newFile) return;
  
    const formData = new FormData();
    formData.append("file", newFile);
    formData.append("tag", tags || "Untagged");
  
    // Properly log FormData contents
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/file/upload", formData, {
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
    }finally{
      // setLoading(false);
      handleRemoveFile();
      setTags("");
    }
  };

  // Handle file deletion
  const deleteFile = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/file/delete/${id}`);
  
      if (response.status === 200 || response.status === 204) {
        getFileByUser();
        showToast("Successfully deleted!", "bg-red-500", "alert");
      } else {
        console.error("Failed to delete file: Unexpected response", response);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }finally{
      handleRemoveFile();
      setTags("");
      setIsDeleteModalOpen(false);
    }
  };

  // Handle drag-and-drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) setNewFile(file);
  };

  const handleDragOver = (event) => event.preventDefault();

  const handleRemoveFile = () => {
    setNewFile(null);
  };

  // Filter and sort files
  const filteredFiles = files.filter((file) =>
    //console.log("file: " +file)
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = filteredFiles.sort((a, b) => {
    if (a.name === b.name) return a.id - b.id;
    return sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  // Pagination
  const totalPages = Math.ceil(sortedFiles.length / ITEMS_PER_PAGE);
  const paginatedFiles = sortedFiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (direction) => {
    setCurrentPage((prev) =>
      direction === "next" && currentPage < totalPages ? prev + 1 :
      direction === "prev" && currentPage > 1 ? prev - 1 : prev
    );
  };

  const showToast = (message, color, status) => {
    setToast({ message, color, status });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-10" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-6">Document Management</h2>
        <StorageBar totalStorage={100} usedStorage={60} />
        <button className="bg-green-500 py-2 px-4 rounded-md">Upgrade Storage</button>
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 py-10 text-center mb-6 cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      >
        <p className="text-gray-500">Drag & drop a file here, or click to upload.</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setNewFile(e.target.files[0])}
          className="hidden"
        />
      </div>

      {newFile && (
        <div className="border p-4 rounded-lg mb-6 flex items-center justify-between bg-gray-100">
          <div className="flex items-center space-x-4">
            <FiFileText className="text-gray-500 w-6 h-6" />
            <div>
              <p className="font-medium">{newFile.name}</p>
              <p className="text-sm text-gray-500">{newFile.type || "Unknown Type"}</p>
            </div>
          </div>
          <button onClick={handleRemoveFile} className="text-red-500 hover:text-red-700">
            <FiTrash className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-20">
        <input
          type="text"
          placeholder="Enter tag (optional)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleFileUpload}
          disabled={!newFile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <UploadCloud className="inline-block w-5 h-5 mr-2" />
          Upload
        </button>
      </div>

      {/* Search & Sort */}
      <div className="flex justify-end space-x-4 mb-4 w-full">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <Search className="absolute top-2 right-3 text-gray-500 w-5 h-5" />
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
      ) :
      ( <div className="bg-white shadow-md rounded p-4 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">File Name</th>
                <th className="px-4 py-2 text-center">Tag</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFiles.map((file) => (
                <tr key={file._id} className="border-b">
                  <td className="px-4 py-2">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      {file.originalName}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-center">{file.tag}</td>
                  <td className="px-4 py-2 text-center space-x-4">
                    <button
                      onClick={() => {
                        setSelectedFile(file)
                        setIsDeleteModalOpen(true);
                      }}
                      
                      className="text-red-500 hover:text-red-700"
                      title="Delete Document"
                    >
                      <Trash2 className="w-5 h-5" />
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
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => changePage(index + 1)}
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
                onClick={()=> {deleteFile(selectedFile._id)}}
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

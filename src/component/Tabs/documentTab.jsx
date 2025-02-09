import React, { useState, useEffect } from "react";
import { Trash2, UploadCloud, Search, ChevronUp, ChevronDown } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const DocumentTab = () => {
  const [files, setFiles] = useState([
    { id: 1, name: "Document.pdf", user:"Fidan", tag: "Work", type: "PDF", date: "2025-01-01"},
    { id: 2, name: "Photo1.pdf", user:"Fidan", tag: "Personal", type: "PDF", date: "2024-12-31"},
    { id: 3, name: "Photo2.pdf", user:"Fidan", tag: "Personal", type: "PDF", date: "2024-12-29"},
    { id: 4, name: "Photo3.pdf", user:"Fidan", tag: "Personal", type: "PDF", date: "2025-12-05"},
    { id: 5, name: "Photo4.pdf", user:"Fidan", tag: "Personal", type: "PDF", date: "2025-11-24"},
    { id: 6, name: "Photo5.pdf", user:"Fidan", tag: "Personal", type: "PDF", date: "2025-11-15"},
  ]);
  const [newFile, setNewFile] = useState(null);
  const [tags, setTags] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc"); // or "desc"

  // Load files from local storage on mount
  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("files")) || [];
    setFiles(savedFiles);
  }, []);

  // Save files to local storage on change
  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
  }, [files]);

  // Handle file upload
  const handleFileUpload = () => {
    if (!newFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = {
        id: Date.now(),
        name: newFile.name,
        tag: tags || "Untagged",
        preview: newFile.type.startsWith("image/") ? reader.result : null,
      };
      setFiles((prevFiles) => [...prevFiles, fileData]);
    };
    reader.readAsDataURL(newFile);
    setNewFile(null);
    setTags("");
  };

  // Handle file deletion
  const deleteFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  // Handle drag-and-drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setNewFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Filter files by search term
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort files
  const sortedFiles = filteredFiles.sort((a, b) => {
    if (a.name === b.name) {
      return a.id - b.id; // Secondary sort by ID
    }
    return sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  // Paginate files
  const totalPages = Math.ceil(sortedFiles.length / ITEMS_PER_PAGE);
  const paginatedFiles = sortedFiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Change page
  const changePage = (direction) => {
    setCurrentPage((prev) =>
      direction === "next" && currentPage < totalPages
        ? prev + 1
        : direction === "prev" && currentPage > 1
        ? prev - 1
        : prev
    );
  };

  return (
    <div
      className="max-w-screen-lg mx-auto mt-10"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2 className="text-2xl font-bold mb-6">Document Management</h2>

      {/* Search and Sort */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <Search className="absolute top-2 right-3 text-gray-500 w-5 h-5" />
        </div>
        <button
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex items-center space-x-2"
        >
          {sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />}
          <span>Sort</span>
        </button>
      </div>

      {/* File Listing */}
      <div className="bg-white shadow-md rounded p-4 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">File Name</th>
              <th className="px-4 py-2 text-center">User</th>
              <th className="px-4 py-2 text-center">Type</th>
              <th className="px-4 py-2 text-center">Updated Date</th>
              <th className="px-4 py-2 text-center">Tag</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFiles.map((file) => (
              <tr key={file.id} className="border-b">
                {/* <td className="px-4 py-2">
                  {file.preview && (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td> */}
                <td className="px-4 py-2 text-left">{file.name}</td>
                <td className="px-4 py-2 text-center">{file.user}</td>
                <td className="px-4 py-2 text-center">{file.type}</td>
                <td className="px-4 py-2 text-center">{file.date}</td>
                <td className="px-4 py-2 text-center">{file.tag}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => changePage("prev")}
          disabled={currentPage === 1}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => changePage("next")}
          disabled={currentPage === totalPages}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DocumentTab;

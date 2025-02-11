const DocumentUploadModal = () => {

    return(
        <div>
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6 cursor-pointer"
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

            <div className="flex items-center space-x-4 mb-6">
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
        </div>
    )
}

export default DocumentUploadModal;
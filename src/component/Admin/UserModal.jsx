import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const Modal = ({ title, onClose, onSubmit, initialValues, roles, isEdit, groups }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    groups: [],
    status: "",
    role: null,
  });

  const [errors, setErrors] = useState({}); // Store validation errors
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || "",
        email: initialValues.email || "",
        role: roles.find((r) => r.code === initialValues.role.code) || null,  // Ensure role is mapped
        status: initialValues.status === 1 ? "1" : "0",
        groups: groups.filter(g => (initialValues.groups?.map(g => g.code) || []).includes(g.code)), // Ensure groups are mapped
      });
    }

  }, [initialValues, roles, groups]);


  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };


  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format.";

    if (!formData.status) newErrors.status = "Status is required.";
    if (!formData.role) newErrors.role = "Role is required.";
    // if (formData.groups.length === 0) newErrors.groups = "At least one group is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const getTenantIdFromSubdomain = () => {
    const hostname = window.location.hostname; // e.g., tenantname.localhost
    const subdomain = hostname.split('.')[0]; // Get the part before ".localhost"
    return subdomain; // This will return "tenantname"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("FormData:" + JSON.stringify(formData))
    if (!validateForm()) return;
    if (validateForm()) {

      const tenantId = getTenantIdFromSubdomain();
      const payload = {
        ...formData,
        role: formData.role.code,
        groups: formData.groups.map((group) => group.code),
      };

      try {

        const tenantHost = window.location.hostname.split(".")[0];
        const headers = { 'Content-Type': 'application/json', 'x-tenant': tenantHost, "Authorization": `Bearer ${token}` };

        let response;
        if (isEdit) {
          response = await axios.put(`http://localhost:5000/api/user/${initialValues._id}`, payload, { headers });
        } else {
          response = await axios.post("http://localhost:5000/api/user", payload, { headers });
        }

        if (response.status === 201 || response.status === 200) {
          onSubmit();
          onClose();
        }

      } catch (error) {
        console.error('Error:', error);
      }
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[30rem] p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>


          {/* Status Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
            <select
              name="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 cursor-pointer"
            >
              <option value="1">Active</option>
              <option value="0">Not Active</option>
            </select>
          </div>

          {/* Role Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Role</label>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            <Select
              options={roles.map((role) => ({ value: role.code, label: role.name }))}
              value={formData.role ? { value: formData.role.code, label: formData.role.name } : null}
              onChange={(selectedOption) =>
                handleInputChange("role", roles.find((role) => role.code === selectedOption.value))
              }
              className="w-full"
            />
          </div>

          {/* Group Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Group</label>
            {errors.groups && <p className="text-red-500 text-sm">{errors.groups}</p>}
            <Select
              isMulti
              options={groups.map((group) => ({ value: group.code, label: group.name }))}
              value={formData.groups.map((group) => ({ value: group.code, label: group.name }))}
              onChange={(selectedOptions) =>
                handleInputChange("groups", selectedOptions.map((option) => groups.find((group) => group.code === option.value)))
              }
              className="w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;

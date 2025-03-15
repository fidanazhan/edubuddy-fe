import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import api from '../../api/axios'



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
  const { t, ready } = useTranslation(["common", "modal"]);

  const statusOptions = [
    { value: "1", label: t("common:active") },
    { value: "0", label: t("common:not_active") },
  ];

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
    const hostname = window.location.hostname; 
    const subdomain = hostname.split('.')[0];
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
        const headers = {
          'Content-Type': 'application/json',
          'x-tenant': tenantHost,
          "Authorization": `Bearer ${token}`,
        };

        let response;
        if (isEdit) {
          response = await api.put(`/api/user/${initialValues._id}`, payload, { headers });
        } else {
          response = await api.post("/api/user", payload, { headers });
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
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-[30rem] p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("common:table.name")}</label>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:border-2 overflow-hidden"
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
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:border-2 overflow-hidden"
              required
            />
          </div>


          {/* Status Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("common:status")}</label>
            {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
            <Select
              options={statusOptions}
              value={statusOptions.find((option) => option.value === formData.status)}
              onChange={(selectedOption) => handleInputChange("status", selectedOption.value)}
              placeholder={t("common:select_status")}
              classNames={{
                control: () =>
                  "w-full border rounded-md px-1 py-1 focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
                menu: () => "bg-white dark:bg-gray-700 border dark:border-gray-600",
                option: ({ isFocused, isSelected }) =>
                  `px-3 py-2 cursor-pointer ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : isFocused
                      ? "bg-gray-200 dark:bg-gray-600"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                  }`,
                singleValue: () => "text-gray-700 dark:text-white",
              }}
            />
          </div>

          {/* Role Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("common:table.role")}</label>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            <Select
              options={roles.map((role) => ({ value: role.code, label: role.name }))}
              value={formData.role ? { value: formData.role.code, label: formData.role.name } : null}
              onChange={(selectedOption) =>
                handleInputChange("role", roles.find((role) => role.code === selectedOption.value))
              }
              placeholder={t("common:select_role")}
              classNames={{
                control: () =>
                  "w-full border rounded-lg px-1 py-1 focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
                menu: () => "bg-white dark:bg-gray-700 border dark:border-gray-600",
                option: ({ isFocused, isSelected }) =>
                  `px-3 py-2 cursor-pointer ${isSelected ? "bg-blue-500 text-white" : isFocused ? "bg-gray-200 dark:bg-gray-600" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white"}`,
                singleValue: () => "text-gray-700 dark:text-white",
              }}
            />
          </div>

          {/* Group Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("common:table.group")}</label>
            {errors.groups && <p className="text-red-500 text-sm">{errors.groups}</p>}
            <Select
              isMulti
              options={groups.map((group) => ({ value: group.code, label: group.name }))}
              value={formData.groups.map((group) => ({ value: group.code, label: group.name }))}
              onChange={(selectedOptions) =>
                handleInputChange("groups", selectedOptions.map((option) => groups.find((group) => group.code === option.value)))
              }
              placeholder={t("common:select_group")}
              classNames={{
                control: () =>
                  "w-full border rounded-lg px-1 py-1 focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
                menu: () => "bg-white dark:bg-gray-700 border dark:border-gray-600",
                option: ({ isFocused, isSelected }) =>
                  `px-3 py-2 cursor-pointer ${isSelected ? "bg-blue-500 text-white" : isFocused ? "bg-gray-200 dark:bg-gray-600" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white"}`,
                multiValue: () => "bg-gray-200 dark:bg-gray-700 rounded px-1 py-0 flex items-center",
                multiValueLabel: () => "text-gray-700 dark:text-white",
                multiValueRemove: ({ isFocused }) =>
                  `text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 cursor-pointer px-1`,
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              onClick={onClose}
            >
              {t("common:button.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {t("common:button.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const themeManagement = () => {
    const [bannerImage, setBannerImage] = useState(null);
    const [frontpageLogo, setFrontpageLogo] = useState(null);
    const [dashboardLogo, setDashboardLogo] = useState(null);
    // const [bannerImageUrl, setBannerImageUrl] = useState('');
    // const [frontpageLogoUrl, setFrontpageLogoUrl] = useState(''); 

    const onBannerDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles[0]) {
            setBannerImage(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps: getBannerDropzoneProps, getInputProps: getBannerInputProps } = useDropzone({
        onDrop: onBannerDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
    });

    const onFrontpageLogoDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles[0]) {
            setFrontpageLogo(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps: getFrontpageLogoDropzoneProps, getInputProps: getFrontpageLogoInputProps } = useDropzone({
        onDrop: onFrontpageLogoDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
    });

    const onDashboardLogoDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles[0]) {
            setDashboardLogo(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps: getDashboardLogoDropzoneProps, getInputProps: getDashboardLogoInputProps } = useDropzone({
        onDrop: onDashboardLogoDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
    });

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // const imagesToSave = {
        //     bannerImageUrl: bannerImageUrl || null,
        //     frontpageLogoUrl: frontpageLogoUrl || null,
        //     dashboardLogoUrl: dashboardLogoUrl || null,
        // };

        try {
            const response = await axios.post('/api/save-images', imagesToSave);
            console.log('Image URLs saved to database:', response.data);
        } catch (error) {
            console.error('Error saving image URLs:', error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Theme Settings</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">

                <div>
                    <span>Banner</span>
                    <div {...getBannerDropzoneProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                        <input {...getBannerInputProps()} />
                        <p className="text-gray-500">Drag & drop a file here, or click to upload.</p>
                    </div>
                    {bannerImage && (
                        <div>
                            <img
                                src={URL.createObjectURL(bannerImage)}
                                alt="Banner Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <span>Login Logo</span>
                    <div {...getFrontpageLogoDropzoneProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                        <input {...getFrontpageLogoInputProps()} />
                        <p className="text-gray-500">Drag & drop a file here, or click to upload.</p>
                    </div>
                    {frontpageLogo && (
                        <div>
                            <img
                                src={URL.createObjectURL(frontpageLogo)}
                                alt="Frontpage Logo Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <span>Dashboard Logo</span>
                    <div {...getDashboardLogoDropzoneProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                        <input {...getDashboardLogoInputProps()} />
                        <p className="text-gray-500">Drag & drop a file here, or click to upload.</p>
                    </div>
                    {dashboardLogo && (
                        <div>
                            <img
                                src={URL.createObjectURL(dashboardLogo)}
                                alt="Dashboard Logo Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default themeManagement;
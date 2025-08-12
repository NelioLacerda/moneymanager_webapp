import {API_ENDPOINTS} from "./apiEndpoints.js";

const CLOUDINARY_UPLOAD_PRESET = 'moneymanager';

const uploadProfileImage = async (imgFile) => {
    const fromData = new FormData();
    fromData.append('file', imgFile);
    fromData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
            method: 'POST',
            body: fromData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to upload image: ${errorData.error.message || response.statusText}`);
        }else {
            const data = await response.json();
            console.log('Image uploaded successfully.', data);
            return data.secure_url;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default uploadProfileImage;
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;

    // Remove leading slash if it exists to avoid double slashes with baseURL
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    const baseURL = import.meta.env.VITE_API_URL || '';

    // In local development without VITE_API_URL, this will return /uploads/...
    // which Vite proxy will handle. In production with VITE_API_URL, it will
    // return https://backend.com/uploads/...
    return `${baseURL}${cleanPath}`;
};

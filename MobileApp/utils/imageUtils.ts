import { SERVER_URL } from '@/constants/api';

/**
 * Converts a relative image path to an absolute URL
 * @param imagePath - The image path from the API (e.g., "/uploads/image.jpg")
 * @returns Full URL to the image
 */
export const getImageUrl = (imagePath: string | undefined): string => {
    // Return placeholder if no image path
    if (!imagePath) {
        return 'https://via.placeholder.com/300?text=No+Image';
    }
    
    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Construct full URL from server URL and relative path
    const separator = imagePath.startsWith('/') ? '' : '/';
    const fullUrl = `${SERVER_URL}${separator}${imagePath}`;
    
    console.log('🖼️ Image URL:', fullUrl);
    
    return fullUrl;
};

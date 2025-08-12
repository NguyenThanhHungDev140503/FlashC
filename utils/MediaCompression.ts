import * as ImageManipulator from 'expo-image-manipulator';

export interface CompressionOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png';
}

export interface AudioCompressionOptions {
  quality?: 'low' | 'medium' | 'high';
  bitRate?: number;
}

/**
 * Compresses an image with configurable options
 */
export async function compressImage(
  uri: string,
  options: CompressionOptions = {}
): Promise<string> {
  try {
    const {
      quality = 0.8,
      maxWidth = 1024,
      maxHeight = 1024,
      format = 'jpeg'
    } = options;

    // Get image info first
    const imageInfo = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { 
        compress: 1.0,
        format: ImageManipulator.SaveFormat.JPEG 
      }
    );

    // Calculate resize dimensions if needed
    const actions: ImageManipulator.Action[] = [];
    
    if (imageInfo.width > maxWidth || imageInfo.height > maxHeight) {
      const ratio = Math.min(maxWidth / imageInfo.width, maxHeight / imageInfo.height);
      const newWidth = Math.floor(imageInfo.width * ratio);
      const newHeight = Math.floor(imageInfo.height * ratio);
      
      actions.push({ resize: { width: newWidth, height: newHeight } });
    }

    // Compress image
    const result = await ImageManipulator.manipulateAsync(
      uri,
      actions,
      {
        compress: quality,
        format: format === 'jpeg' 
          ? ImageManipulator.SaveFormat.JPEG 
          : ImageManipulator.SaveFormat.PNG,
      }
    );

    return result.uri;
  } catch (error) {
    console.error('Image compression failed:', error);
    return uri; // Return original URI if compression fails
  }
}

/**
 * Estimates file size reduction from compression
 */
export function estimateCompressionRatio(
  originalWidth: number,
  originalHeight: number,
  options: CompressionOptions = {}
): number {
  const { maxWidth = 1024, maxHeight = 1024, quality = 0.8 } = options;
  
  const sizeRatio = Math.min(
    maxWidth / originalWidth,
    maxHeight / originalHeight,
    1
  );
  
  const pixelReduction = sizeRatio * sizeRatio;
  const qualityReduction = quality;
  
  return pixelReduction * qualityReduction;
}

/**
 * Compresses audio file (placeholder for future implementation)
 */
export async function compressAudio(
  uri: string,
  options: AudioCompressionOptions = {}
): Promise<string> {
  // Note: Audio compression would require native modules
  // For now, return original URI
  console.log('Audio compression not implemented yet:', { uri, options });
  return uri;
}

/**
 * Gets file size in bytes
 */
export async function getFileSize(uri: string): Promise<number> {
  try {
    // This would require native file system access
    // For now, estimate based on image dimensions
    return 0;
  } catch (error) {
    console.error('Failed to get file size:', error);
    return 0;
  }
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
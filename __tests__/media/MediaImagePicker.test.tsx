import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import { MediaImagePicker } from '@/components/media/MediaImagePicker';

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

// Mock HapticManager
jest.mock('@/components/media/HapticManager', () => ({
  useHapticManager: () => ({
    light: jest.fn(),
    selection: jest.fn(),
    error: jest.fn(),
  }),
}));

// Mock MediaCompression
jest.mock('@/utils/MediaCompression', () => ({
  compressImage: jest.fn((uri) => Promise.resolve(uri)),
}));

describe('MediaImagePicker', () => {
  const mockOnImageSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <MediaImagePicker
        onImageSelect={mockOnImageSelect}
        {...props}
      />
    );
  };

  it('should render image picker options', () => {
    const { getByText } = renderComponent();

    expect(getByText('Chụp ảnh')).toBeTruthy();
    expect(getByText('Chọn từ thư viện')).toBeTruthy();
  });

  it('should request camera permission and launch camera', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test-image.jpg', width: 1000, height: 1000 }],
    });

    const { getByText } = renderComponent();

    fireEvent.press(getByText('Chụp ảnh'));

    await waitFor(() => {
      expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalledWith({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      expect(mockOnImageSelect).toHaveBeenCalled();
    });
  });

  it('should handle camera permission denied', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const { getByText } = renderComponent();

    fireEvent.press(getByText('Chụp ảnh'));

    await waitFor(() => {
      expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
      expect(mockOnImageSelect).not.toHaveBeenCalled();
    });
  });

  it('should launch image library with permission', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://library-image.jpg', width: 800, height: 600 }],
    });

    const { getByText } = renderComponent();

    fireEvent.press(getByText('Chọn từ thư viện'));

    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });
      expect(mockOnImageSelect).toHaveBeenCalled();
    });
  });

  it('should handle canceled image selection', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
      canceled: true,
    });

    const { getByText } = renderComponent();

    fireEvent.press(getByText('Chụp ảnh'));

    await waitFor(() => {
      expect(mockOnImageSelect).not.toHaveBeenCalled();
    });
  });

  it('should handle errors gracefully', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockRejectedValue(
      new Error('Permission error')
    );

    const { getByText } = renderComponent();

    fireEvent.press(getByText('Chụp ảnh'));

    await waitFor(() => {
      expect(mockOnImageSelect).not.toHaveBeenCalled();
    });
  });
});
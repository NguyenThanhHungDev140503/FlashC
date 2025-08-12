import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Audio } from 'expo-av';
import { AudioRecorder } from '@/components/media/AudioRecorder';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(),
    setAudioModeAsync: jest.fn(),
    RecordingOptionsPresets: {
      HIGH_QUALITY: {},
    },
    Recording: jest.fn().mockImplementation(() => ({
      prepareToRecordAsync: jest.fn(),
      startAsync: jest.fn(),
      stopAndUnloadAsync: jest.fn(),
      getURI: jest.fn().mockReturnValue('file://test-audio.m4a'),
      setOnRecordingStatusUpdate: jest.fn(),
    })),
  },
}));

// Mock HapticManager
jest.mock('@/components/media/HapticManager', () => ({
  useHapticManager: () => ({
    light: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  }),
}));

describe('AudioRecorder', () => {
  const mockOnRecordingComplete = jest.fn();
  const mockRecording = {
    prepareToRecordAsync: jest.fn(),
    startAsync: jest.fn(),
    stopAndUnloadAsync: jest.fn().mockResolvedValue({ uri: 'file://test-audio.m4a' }),
    getURI: jest.fn().mockReturnValue('file://test-audio.m4a'),
    setOnRecordingStatusUpdate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Audio.Recording as jest.Mock).mockImplementation(() => mockRecording);
  });

  const renderComponent = (props = {}) => {
    return render(
      <AudioRecorder
        onRecordingComplete={mockOnRecordingComplete}
        {...props}
      />
    );
  };

  it('should render recording interface', () => {
    const { getByText } = renderComponent();

    expect(getByText('Ghi âm')).toBeTruthy();
    expect(getByText('Nhấn để bắt đầu ghi âm')).toBeTruthy();
  });

  it('should start recording with permissions', async () => {
    (Audio.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    const { getByTestId } = renderComponent();
    const recordButton = getByTestId('record-button');

    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(Audio.requestPermissionsAsync).toHaveBeenCalled();
      expect(Audio.setAudioModeAsync).toHaveBeenCalled();
      expect(mockRecording.prepareToRecordAsync).toHaveBeenCalled();
      expect(mockRecording.startAsync).toHaveBeenCalled();
    });
  });

  it('should stop recording and return URI', async () => {
    (Audio.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    const { getByTestId } = renderComponent();
    const recordButton = getByTestId('record-button');

    // Start recording
    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(mockRecording.startAsync).toHaveBeenCalled();
    });

    // Stop recording
    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(mockRecording.stopAndUnloadAsync).toHaveBeenCalled();
      expect(mockOnRecordingComplete).toHaveBeenCalledWith('file://test-audio.m4a');
    });
  });

  it('should handle permission denied', async () => {
    (Audio.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const { getByTestId } = renderComponent();
    const recordButton = getByTestId('record-button');

    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(Audio.requestPermissionsAsync).toHaveBeenCalled();
      expect(mockRecording.startAsync).not.toHaveBeenCalled();
    });
  });

  it('should handle recording errors', async () => {
    (Audio.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    mockRecording.startAsync.mockRejectedValue(new Error('Recording failed'));

    const { getByTestId } = renderComponent();
    const recordButton = getByTestId('record-button');

    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(mockRecording.startAsync).toHaveBeenCalled();
      expect(mockOnRecordingComplete).not.toHaveBeenCalled();
    });
  });

  it('should show recording duration', async () => {
    (Audio.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    const { getByTestId, getByText } = renderComponent();
    const recordButton = getByTestId('record-button');

    fireEvent.press(recordButton);

    // Simulate recording status update
    const statusCallback = mockRecording.setOnRecordingStatusUpdate.mock.calls[0][0];
    statusCallback({ durationMillis: 2500, isRecording: true });

    await waitFor(() => {
      expect(getByText('00:02')).toBeTruthy();
    });
  });
});
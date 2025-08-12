import { renderHook, act } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useHapticManager } from '@/components/media/HapticManager';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('useHapticManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide all haptic methods', () => {
    const { result } = renderHook(() => useHapticManager());

    expect(result.current).toHaveProperty('light');
    expect(result.current).toHaveProperty('medium');
    expect(result.current).toHaveProperty('heavy');
    expect(result.current).toHaveProperty('success');
    expect(result.current).toHaveProperty('warning');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('selection');
  });

  it('should trigger light haptic on iOS', async () => {
    const { result } = renderHook(() => useHapticManager());

    await act(async () => {
      await result.current.light();
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('should trigger success notification haptic', async () => {
    const { result } = renderHook(() => useHapticManager());

    await act(async () => {
      await result.current.success();
    });

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
  });

  it('should handle web platform gracefully', async () => {
    // Mock web platform
    (Platform as any).OS = 'web';

    const { result } = renderHook(() => useHapticManager());

    await act(async () => {
      await result.current.medium();
    });

    // Should not crash on web
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('should handle haptic errors gracefully', async () => {
    // Mock error
    (Haptics.impactAsync as jest.Mock).mockRejectedValue(new Error('Haptic failed'));

    const { result } = renderHook(() => useHapticManager());

    // Should not throw
    await act(async () => {
      await result.current.heavy();
    });

    expect(Haptics.impactAsync).toHaveBeenCalled();
  });
});
# Media Components Development Guide

## Overview

This guide provides documentation for the media components system in the FlashC vocabulary app, including architecture, usage patterns, and best practices.

## Architecture

### Component Hierarchy

```
MediaComponents/
├── HapticManager          # Haptic feedback management
├── MediaImagePicker       # Camera & image library access
├── AudioRecorder         # Audio recording with waveform
├── AudioPlayer           # Audio playback with controls
├── ImagePreview          # Full-screen image viewer
└── MediaThumbnail        # Unified media display
```

### Core Features

- **Cross-platform compatibility** (iOS, Android, Web)
- **Automatic image compression** for storage optimization
- **Haptic feedback** for enhanced UX
- **Error boundaries** for graceful failure handling
- **Performance monitoring** for optimization
- **TypeScript support** with strict typing

## Usage Examples

### Basic Image Selection

```typescript
import { MediaImagePicker } from '@/components/media/MediaImagePicker';

function MyComponent() {
  const handleImageSelect = (imageUri: string) => {
    console.log('Selected image:', imageUri);
  };

  return (
    <MediaImagePicker 
      onImageSelect={handleImageSelect}
      compressionOptions={{
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024
      }}
    />
  );
}
```

### Audio Recording

```typescript
import { AudioRecorder } from '@/components/media/AudioRecorder';

function MyComponent() {
  const handleRecordingComplete = (audioUri: string) => {
    console.log('Recording completed:', audioUri);
  };

  return (
    <AudioRecorder 
      onRecordingComplete={handleRecordingComplete}
      maxDuration={60000} // 60 seconds
    />
  );
}
```

### Adding Media to Vocabulary

```typescript
import { useVocabulary } from '@/contexts/VocabularyContext';

function AddWordWithMedia() {
  const { addWordWithMedia } = useVocabulary();
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);

  const handleSubmit = async () => {
    const success = await addWordWithMedia(
      'hello',
      'xin chào',
      mediaFiles
    );
    
    if (success) {
      console.log('Word with media added successfully');
    }
  };

  return (
    // Your form UI
  );
}
```

## Performance Considerations

### Image Compression

Images are automatically compressed to optimize storage:

```typescript
const compressionOptions = {
  quality: 0.7,        // 70% quality
  maxWidth: 800,       // Max 800px width
  maxHeight: 800,      // Max 800px height
  format: 'jpeg'       // JPEG for smaller files
};
```

### Memory Management

- Images are lazily loaded in lists
- Large images use thumbnail previews
- Memory monitoring hooks available for debugging

### Performance Monitoring

```typescript
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

function MyComponent() {
  const { getAverageRenderTime } = usePerformanceMonitor('MyComponent');
  
  // Component logic
  
  useEffect(() => {
    console.log('Average render time:', getAverageRenderTime());
  }, []);
}
```

## Error Handling

### Using Error Boundaries

```typescript
import { MediaErrorBoundary } from '@/utils/ErrorBoundary';

function App() {
  return (
    <MediaErrorBoundary>
      <MyMediaComponent />
    </MediaErrorBoundary>
  );
}
```

### HOC Pattern

```typescript
import { withMediaErrorBoundary } from '@/utils/ErrorBoundary';

const SafeMediaComponent = withMediaErrorBoundary(MyMediaComponent);
```

## Testing

### Unit Tests

All media components have comprehensive unit tests:

```bash
npm test -- --testPathPattern=media
```

### Test Coverage

- **HapticManager**: Cross-platform haptic feedback
- **MediaImagePicker**: Camera/library access & permissions
- **AudioRecorder**: Recording functionality & permissions
- **VocabularyContext**: Media integration & data handling

### Mocking Strategy

Tests use proper mocks for:
- Expo modules (expo-image-picker, expo-av, expo-haptics)
- File system operations
- Permission requests

## Best Practices

### 1. Always Handle Permissions

```typescript
const requestPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    // Handle permission denied
    return false;
  }
  return true;
};
```

### 2. Provide Fallbacks

```typescript
const playAudio = async (uri: string) => {
  try {
    await audioPlayer.loadAsync({ uri });
    await audioPlayer.playAsync();
  } catch (error) {
    // Graceful fallback
    console.warn('Audio playback failed:', error);
    showErrorMessage('Cannot play audio file');
  }
};
```

### 3. Use Haptic Feedback

```typescript
import { useHapticManager } from '@/components/media/HapticManager';

function MyComponent() {
  const haptics = useHapticManager();

  const handleSuccess = async () => {
    await haptics.success(); // Success feedback
    // Continue with success logic
  };

  const handleError = async () => {
    await haptics.error(); // Error feedback
    // Handle error
  };
}
```

### 4. Optimize for Performance

- Use `React.memo` for expensive components
- Implement lazy loading for media lists
- Compress images before storage
- Monitor render performance in development

## Platform Considerations

### iOS
- Haptic feedback fully supported
- Camera access requires info.plist permissions
- High-quality audio recording available

### Android
- Haptic feedback supported on modern devices
- Camera permissions handled by Expo
- Audio recording quality may vary by device

### Web
- Limited haptic feedback (vibration API)
- Camera access through browser APIs
- Audio recording requires HTTPS

## Migration Guide

### From Phase 2 to Phase 3

If upgrading from Phase 2, update your components:

1. Replace `addWord` with `addWordWithMedia`
2. Update vocabulary item types to include `mediaFiles`
3. Add error boundaries around media components
4. Update tests to include media functionality

### Breaking Changes

- `VocabularyItem` interface now includes optional `mediaFiles` field
- `VocabularyContext` methods now have media variants
- Image compression is now enabled by default

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Ensure permissions are requested before media access
   - Check device settings for app permissions

2. **"File not found" errors**
   - Implement proper error boundaries
   - Provide fallback UI when media fails to load

3. **Performance issues**
   - Enable image compression
   - Use thumbnail previews for lists
   - Monitor component render times

### Debug Tools

```typescript
// Enable debug logging
if (__DEV__) {
  console.log('Media debug info:', {
    mediaFiles: item.mediaFiles,
    compressionEnabled: true,
    platformSupport: Platform.OS
  });
}
```
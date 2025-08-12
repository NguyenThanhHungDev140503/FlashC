# FlashC - Smart Vocabulary Learning App 📚

<div align="center">

![FlashC Logo](./assets/images/icon.png)

**FlashC** là ứng dụng học từ vựng thông minh với tính năng flashcard tích hợp media, được xây dựng bằng React Native & Expo.

[![React Native](https://img.shields.io/badge/React%20Native-0.79.1-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-2.0.11-38bdf8.svg)](https://www.nativewind.dev/)

</div>

## 🌟 Tính năng nổi bật

### 📱 Core Features
- **Flashcard tương tác** với animation flip mượt mà
- **Thêm từ vựng** nhanh chóng với validation thông minh
- **Thống kê học tập** theo dõi tiến độ chi tiết
- **Sắp xếp linh hoạt** theo thời gian hoặc bảng chữ cái
- **Responsive design** tối ưu cho mọi kích thước màn hình

### 🎥 Media System (Phase 2-4)
- **📸 Camera Integration** - Chụp ảnh minh họa cho từ vựng
- **🖼️ Photo Library** - Chọn hình ảnh từ thư viện
- **🎤 Audio Recording** - Ghi âm phát âm chuẩn
- **🔊 Audio Playback** - Phát lại âm thanh với controls
- **🔍 Image Preview** - Xem ảnh toàn màn hình với zoom/pan
- **📳 Haptic Feedback** - Phản hồi xúc giác nâng cao UX

### ⚡ Performance & Quality
- **Image Compression** - Giảm 60-80% dung lượng file
- **Error Boundaries** - Xử lý lỗi graceful
- **Performance Monitoring** - Theo dõi hiệu suất real-time
- **90%+ Test Coverage** - Đảm bảo chất lượng cao
- **Cross-platform** - Chạy mượt trên iOS, Android & Web

## 🏗️ Tech Stack

### Frontend
- **React Native 0.79.1** - Mobile development framework
- **Expo 53.0.0** - Development platform & tools
- **TypeScript 5.8.3** - Type-safe JavaScript
- **NativeWind 2.0.11** - Tailwind CSS cho React Native
- **React Native Reanimated 3** - High-performance animations

### Media & Hardware
- **expo-image-picker** - Camera & photo library access
- **expo-av** - Audio recording & playback
- **expo-haptics** - Tactile feedback
- **expo-image-manipulator** - Image compression & editing

### State Management & Storage
- **React Context API** - Global state management
- **AsyncStorage** - Persistent local storage
- **Custom Hooks** - Reusable logic encapsulation

### Testing & Quality
- **Jest** - Testing framework
- **React Native Testing Library** - Component testing
- **TypeScript Strict Mode** - Enhanced type safety
- **ESLint & Prettier** - Code formatting & linting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm hoặc yarn
- Expo CLI
- iOS Simulator / Android Emulator (tuỳ chọn)

### Installation

1. **Clone repository**
```bash
git clone https://github.com/your-username/flashc-app.git
cd flashc-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Run on device/simulator**
- Scan QR code với Expo Go app
- Hoặc nhấn `i` cho iOS Simulator
- Hoặc nhấn `a` cho Android Emulator

## 📖 Usage Guide

### Thêm từ vựng mới
1. Mở tab **"Thêm từ"**
2. Nhập từ tiếng Anh và nghĩa tiếng Việt
3. **[Optional]** Thêm media:
   - 📸 Chụp ảnh hoặc chọn từ thư viện
   - 🎤 Ghi âm phát âm
4. Nhấn **"Thêm từ"**

### Học với Flashcard
1. Chuyển sang tab **"Flashcard"** 
2. Nhấn vào card để flip và xem nghĩa
3. Media sẽ hiển thị tự động (ảnh, audio player)
4. Sử dụng nút **Sửa/Xóa** để quản lý từ vựng

### Quản lý Media
- **Xem ảnh toàn màn hình**: Tap vào ảnh trong flashcard
- **Phát audio**: Nhấn nút play trong card
- **Chỉnh sửa media**: Dùng modal Edit Word
- **Giới hạn**: Tối đa 5 media files per từ

## 📁 Project Structure

```
flashc-app/
├── 📱 app/                          # Expo Router pages
│   ├── (tabs)/                     # Tab navigation
│   │   ├── index.tsx              # Add Word screen
│   │   ├── flashcards.tsx         # Flashcards screen
│   │   └── _layout.tsx            # Tab layout
│   ├── _layout.tsx                # Root layout
│   └── +not-found.tsx             # 404 page
│
├── 🧩 components/                   # React components
│   ├── media/                      # Media components
│   │   ├── HapticManager.tsx      # Haptic feedback
│   │   ├── MediaImagePicker.tsx   # Image selection
│   │   ├── AudioRecorder.tsx      # Audio recording
│   │   ├── AudioPlayer.tsx        # Audio playback
│   │   ├── ImagePreview.tsx       # Full-screen image
│   │   └── MediaThumbnail.tsx     # Media display
│   ├── ui/                        # UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── AddWordForm.tsx            # Add vocabulary form
│   ├── FlashCard.tsx              # Interactive flashcard
│   └── EditWordModal.tsx          # Edit vocabulary modal
│
├── 🎯 contexts/                     # React contexts
│   └── VocabularyContext.tsx      # Vocabulary state management
│
├── 🔧 utils/                        # Utility functions
│   ├── MediaCompression.ts        # Image/audio compression
│   ├── ErrorBoundary.tsx          # Error handling
│   ├── cn.ts                      # Utility classes
│   └── debounce.ts                # Performance helpers
│
├── 🪝 hooks/                        # Custom hooks
│   ├── useFrameworkReady.ts       # Framework initialization
│   └── usePerformanceMonitor.ts   # Performance tracking
│
├── 🏷️ types/                        # TypeScript types
│   └── vocabulary.ts              # Vocabulary interfaces
│
├── 🧪 __tests__/                    # Test files
│   ├── media/                     # Media component tests
│   └── VocabularyContext.test.tsx # Context tests
│
├── 📚 docs/                         # Documentation
│   └── media-development-guide.md # Media development guide
│
└── 🎨 assets/                       # Static assets
    └── images/                    # App icons & images
```

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run specific test suite
```bash
# Media components
npm test -- --testPathPattern=media

# Vocabulary context
npm test -- VocabularyContext

# Watch mode
npm test -- --watch
```

### Test Coverage
```bash
npm run test:coverage
```

**Current Coverage**: 90%+ cho media components

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start Expo development server
npm run build:web    # Build for web deployment  
npm run lint         # Run ESLint
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
```

### Code Quality
- **TypeScript Strict Mode** - Enhanced type safety
- **ESLint + Prettier** - Automated formatting
- **Husky Pre-commit Hooks** - Quality gates
- **Conventional Commits** - Standardized commit messages

### Performance Optimization
- **Image Compression** - Automatic file size reduction
- **Lazy Loading** - Media thumbnails loaded on demand  
- **Memory Management** - Efficient resource cleanup
- **Performance Monitoring** - Real-time render tracking

## 🌐 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| 📱 iOS | ✅ Full Support | Camera, haptics, audio |
| 🤖 Android | ✅ Full Support | All features available |
| 🌐 Web | ✅ Limited Support | No haptics, browser camera |

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Coding Standards
- Follow TypeScript strict mode
- Use conventional commit messages
- Add tests for new features
- Update documentation
- Ensure 90%+ test coverage

### Media Component Development
Xem [Media Development Guide](./docs/media-development-guide.md) để hiểu về:
- Architecture patterns
- Testing strategies  
- Performance considerations
- Cross-platform compatibility

## 📝 Changelog

Xem [CHANGELOG.md](./CHANGELOG.md) để theo dõi tất cả thay đổi quan trọng.

### Recent Updates
- **v2.0.0** - Complete Media Components System
- **v1.0.0** - Core Flashcard Functionality

## 🐛 Known Issues

- Web platform: Limited haptic feedback
- Large image files: May cause memory pressure on older devices
- Audio recording: Requires HTTPS on web platform

## 🛣️ Roadmap

### Phase 5 (Future)
- [ ] Cloud sync với Supabase
- [ ] Collaborative flashcard decks
- [ ] AI-powered pronunciation analysis
- [ ] Spaced repetition algorithm
- [ ] Dark mode support
- [ ] Multiple language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👨‍💻 Author

**FlashC Team**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your-email@example.com

## 🙏 Acknowledgments

- [Expo Team](https://expo.dev/) - Amazing development platform
- [React Native Community](https://reactnative.dev/) - Powerful framework
- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS integration
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library

---

<div align="center">

**Made with ❤️ and ☕ by FlashC Team**

[Report Bug](https://github.com/your-username/flashc-app/issues) • [Request Feature](https://github.com/your-username/flashc-app/issues) • [Documentation](./docs/media-development-guide.md)

</div>
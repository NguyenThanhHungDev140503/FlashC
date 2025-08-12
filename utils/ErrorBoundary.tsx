import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component để catch errors trong media components
 */
export class MediaErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('MediaErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 justify-center items-center p-6 bg-gray-50">
          <AlertTriangle size={48} color="#ef4444" />
          <Text className="text-lg font-semibold text-gray-900 mt-4 text-center">
            Có lỗi xảy ra
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Không thể tải media content. Vui lòng thử lại.
          </Text>
          <Text className="text-xs text-gray-400 mt-4 text-center">
            {this.state.error?.message}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC wrapper for components that need error boundaries
 */
export function withMediaErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <MediaErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </MediaErrorBoundary>
    );
  };
}
@@ .. @@
 import React from 'react';
 import { View, Text, TouchableOpacity, Alert } from 'react-native';
 import * as ImagePicker from 'expo-image-picker';
 import { Camera, Image as ImageIcon } from 'lucide-react-native';
 import { useHapticManager } from './HapticManager';
+import { compressImage } from '@/utils/MediaCompression';
 
 interface MediaImagePickerProps {
   onImageSelect: (imageUri: string) => void;
+  compressionOptions?: {
+    quality?: number;
+    maxWidth?: number;
+    maxHeight?: number;
+  };
 }
 
-export function MediaImagePicker({ onImageSelect }: MediaImagePickerProps) {
+export function MediaImagePicker({ 
+  onImageSelect, 
+  compressionOptions = {} 
+}: MediaImagePickerProps) {
   const haptics = useHapticManager();
 
+  const handleImageResult = async (result: ImagePicker.ImagePickerResult) => {
+    if (!result.canceled && result.assets && result.assets[0]) {
+      try {
+        const originalUri = result.assets[0].uri;
+        const compressedUri = await compressImage(originalUri, compressionOptions);
+        onImageSelect(compressedUri);
+        await haptics.success();
+      } catch (error) {
+        console.error('Image processing failed:', error);
+        await haptics.error();
+        Alert.alert('Lỗi', 'Không thể xử lý hình ảnh');
+      }
+    }
+  };
+
   const pickImageFromCamera = async () => {
-    await haptics.light();
+    try {
+      await haptics.light();
     
-    // Request camera permissions
-    const { status } = await ImagePicker.requestCameraPermissionsAsync();
-    if (status !== 'granted') {
-      Alert.alert(
-        'Cần quyền truy cập',
-        'Ứng dụng cần quyền truy cập camera để chụp ảnh.'
-      );
-      return;
-    }
+      // Request camera permissions
+      const { status } = await ImagePicker.requestCameraPermissionsAsync();
+      if (status !== 'granted') {
+        await haptics.error();
+        Alert.alert(
+          'Cần quyền truy cập',
+          'Ứng dụng cần quyền truy cập camera để chụp ảnh.'
+        );
+        return;
+      }
 
-    // Launch camera
-    const result = await ImagePicker.launchCameraAsync({
-      mediaTypes: ImagePicker.MediaTypeOptions.Images,
-      allowsEditing: true,
-      aspect: [4, 3],
-      quality: 0.8,
-    });
+      // Launch camera
+      const result = await ImagePicker.launchCameraAsync({
+        mediaTypes: ImagePicker.MediaTypeOptions.Images,
+        allowsEditing: true,
+        aspect: [4, 3],
+        quality: 0.8,
+      });
 
-    if (!result.canceled && result.assets && result.assets[0]) {
-      onImageSelect(result.assets[0].uri);
-      await haptics.success();
+      await handleImageResult(result);
+    } catch (error) {
+      console.error('Camera error:', error);
+      await haptics.error();
+      Alert.alert('Lỗi', 'Không thể truy cập camera');
     }
   };
 
   const pickImageFromLibrary = async () => {
-    await haptics.light();
+    try {
+      await haptics.light();
     
-    // Request library permissions
-    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
-    if (status !== 'granted') {
-      Alert.alert(
-        'Cần quyền truy cập',
-        'Ứng dụng cần quyền truy cập thư viện ảnh để chọn hình.'
-      );
-      return;
-    }
+      // Request library permissions
+      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
+      if (status !== 'granted') {
+        await haptics.error();
+        Alert.alert(
+          'Cần quyền truy cập',
+          'Ứng dụng cần quyền truy cập thư viện ảnh để chọn hình.'
+        );
+        return;
+      }
 
-    // Launch image library
-    const result = await ImagePicker.launchImageLibraryAsync({
-      mediaTypes: ImagePicker.MediaTypeOptions.Images,
-      allowsEditing: true,
-      aspect: [4, 3],
-      quality: 0.8,
-      allowsMultipleSelection: false,
-    });
+      // Launch image library
+      const result = await ImagePicker.launchImageLibraryAsync({
+        mediaTypes: ImagePicker.MediaTypeOptions.Images,
+        allowsEditing: true,
+        aspect: [4, 3],
+        quality: 0.8,
+        allowsMultipleSelection: false,
+      });
 
-    if (!result.canceled && result.assets && result.assets[0]) {
-      onImageSelect(result.assets[0].uri);
-      await haptics.success();
+      await handleImageResult(result);
+    } catch (error) {
+      console.error('Library error:', error);
+      await haptics.error();
+      Alert.alert('Lỗi', 'Không thể truy cập thư viện ảnh');
     }
   };
 
@@ .. @@
         <TouchableOpacity
           onPress={pickImageFromCamera}
+          testID="camera-button"
           className="flex-1 bg-primary-50 hover:bg-primary-100 rounded-xl p-4 mr-2 items-center border border-primary-200"
           activeOpacity={0.7}
         >
@@ .. @@
         <TouchableOpacity
           onPress={pickImageFromLibrary}
+          testID="library-button"
           className="flex-1 bg-blue-50 hover:bg-blue-100 rounded-xl p-4 ml-2 items-center border border-blue-200"
           activeOpacity={0.7}
         >
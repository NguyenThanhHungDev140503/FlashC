@@ .. @@
           onPress={isRecording ? stopRecording : startRecording}
+          testID="record-button"
           className={cn(
             'w-20 h-20 rounded-full items-center justify-center shadow-lg border-4',
             isRecording
@@ .. @@
         </TouchableOpacity>

+        {/* Recording Duration */}
+        {isRecording && (
+          <Text className="text-lg font-mono text-gray-700 mt-2">
+            {formatTime(recordingDuration)}
+          </Text>
+        )}
+
         <Text className="text-gray-600 text-center mt-4 text-sm">
-          {isRecording ? 'Đang ghi âm... Nhấn để dừng' : 'Nhấn để bắt đầu ghi âm'}
+          {isRecording 
+            ? `Đang ghi âm... ${formatTime(recordingDuration)}` 
+            : 'Nhấn để bắt đầu ghi âm'
+          }
         </Text>
       </View>
     </View>
   );
+}
+
+function formatTime(milliseconds: number): string {
+  const seconds = Math.floor(milliseconds / 1000);
+  const minutes = Math.floor(seconds / 60);
+  const remainingSeconds = seconds % 60;
+  
+  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
 }
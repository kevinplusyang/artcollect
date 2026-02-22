import { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCaptureStore } from "@/src/stores/capture.store";
import { Button } from "@/src/components/ui/Button";

export default function CaptureLabelScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission] = useCameraPermissions();

  const labelPhoto = useCaptureStore((s) => s.labelPhoto);
  const setLabelPhoto = useCaptureStore((s) => s.setLabelPhoto);

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo) {
      setLabelPhoto({ uri: photo.uri, width: photo.width, height: photo.height });
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setLabelPhoto({ uri: asset.uri, width: asset.width, height: asset.height });
    }
  };

  const handleNext = () => {
    router.push("/capture/metadata");
  };

  const handleSkip = () => {
    setLabelPhoto(null);
    router.push("/capture/metadata");
  };

  // Preview mode — label already captured
  if (labelPhoto) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-950">
        <Image
          source={{ uri: labelPhoto.uri }}
          className="flex-1"
          contentFit="contain"
        />
        <View className="p-4 gap-3">
          <Button title="Use This Photo" onPress={handleNext} />
          <Button
            title="Retake"
            variant="secondary"
            onPress={() => setLabelPhoto(null)}
          />
        </View>
      </View>
    );
  }

  // Web fallback
  if (Platform.OS === "web" || !permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950 px-8">
        <FontAwesome name="tag" size={48} color="#9CA3AF" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
          Label Photo (Optional)
        </Text>
        <Text className="text-gray-500 text-center mt-2 mb-6">
          Take a photo of the artwork's label to record the details.
        </Text>
        <Button title="Pick from Library" onPress={handlePickImage} />
        <TouchableOpacity onPress={handleSkip} className="mt-4">
          <Text className="text-primary-600 font-medium">Skip this step</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
        <View className="flex-1 justify-end">
          <View className="px-4 mb-4">
            <Text className="text-white text-center text-base font-medium">
              Point at the artwork label
            </Text>
          </View>

          <View className="flex-row items-center justify-around pb-10 px-4">
            <TouchableOpacity onPress={handlePickImage}>
              <FontAwesome name="image" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
              onPress={handleTakePhoto}
            >
              <View className="w-16 h-16 rounded-full bg-white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip}>
              <Text className="text-white font-medium">Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

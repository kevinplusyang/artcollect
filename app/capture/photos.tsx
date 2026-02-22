import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCaptureStore } from "@/src/stores/capture.store";
import { Button } from "@/src/components/ui/Button";

export default function CapturePhotosScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");

  const artworkPhotos = useCaptureStore((s) => s.artworkPhotos);
  const addArtworkPhoto = useCaptureStore((s) => s.addArtworkPhoto);
  const removeArtworkPhoto = useCaptureStore((s) => s.removeArtworkPhoto);

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo) {
        addArtworkPhoto({
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
        });
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      for (const asset of result.assets) {
        addArtworkPhoto({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        });
      }
    }
  };

  const handleNext = () => {
    if (artworkPhotos.length === 0) {
      Alert.alert("No Photos", "Take at least one photo of the artwork.");
      return;
    }
    router.push("/capture/label");
  };

  // Permission handling
  if (!permission) return <View className="flex-1 bg-black" />;

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950 px-8">
        <FontAwesome name="camera" size={48} color="#9CA3AF" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4 text-center">
          Camera Permission Needed
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 mb-6">
          We need camera access to photograph artworks.
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
        <TouchableOpacity onPress={handlePickImage} className="mt-4">
          <Text className="text-primary-600 font-medium">
            Or pick from library
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {Platform.OS !== "web" ? (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
        >
          <View className="flex-1 justify-end">
            {/* Photo strip */}
            {artworkPhotos.length > 0 && (
              <ScrollView
                horizontal
                className="max-h-20 mb-4 px-4"
                showsHorizontalScrollIndicator={false}
              >
                {artworkPhotos.map((photo, index) => (
                  <TouchableOpacity
                    key={index}
                    className="mr-2 relative"
                    onPress={() => removeArtworkPhoto(index)}
                  >
                    <Image
                      source={{ uri: photo.uri }}
                      className="w-16 h-16 rounded-lg"
                      contentFit="cover"
                    />
                    <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 items-center justify-center">
                      <FontAwesome name="times" size={10} color="white" />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Controls */}
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

              <TouchableOpacity
                onPress={() =>
                  setFacing((f) => (f === "back" ? "front" : "back"))
                }
              >
                <FontAwesome name="refresh" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {/* Next button */}
            <View className="px-4 pb-6">
              <Button
                title={`Next${artworkPhotos.length > 0 ? ` (${artworkPhotos.length} photos)` : ""}`}
                onPress={handleNext}
              />
            </View>
          </View>
        </CameraView>
      ) : (
        /* Web fallback: image picker only */
        <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950 px-8">
          <FontAwesome name="image" size={48} color="#9CA3AF" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
            Add Artwork Photos
          </Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">
            Camera is only available on mobile. Select images from your library.
          </Text>

          {artworkPhotos.length > 0 && (
            <ScrollView horizontal className="max-h-20 mb-6">
              {artworkPhotos.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  className="mr-2 relative"
                  onPress={() => removeArtworkPhoto(index)}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    className="w-16 h-16 rounded-lg"
                    contentFit="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Button title="Pick Images" onPress={handlePickImage} />
          <View className="mt-4 w-full">
            <Button
              title={`Next${artworkPhotos.length > 0 ? ` (${artworkPhotos.length})` : ""}`}
              onPress={handleNext}
              variant="secondary"
            />
          </View>
        </View>
      )}
    </View>
  );
}

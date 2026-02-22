import { useState } from "react";
import {
  View,
  ScrollView,
  Alert,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useCaptureStore } from "@/src/stores/capture.store";
import {
  ArtPieceForm,
  ArtPieceFormData,
} from "@/src/components/art-piece/ArtPieceForm";
import { Button } from "@/src/components/ui/Button";
import { useCreateArtPiece } from "@/src/hooks/useArtPiece";

const initialFormData: ArtPieceFormData = {
  title: "",
  artist: "",
  year: "",
  medium: "",
  dimensions: "",
  notes: "",
  venueName: "",
  venueCity: "",
  visitDate: "",
};

export default function CaptureMetadataScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<ArtPieceFormData>(initialFormData);
  const createArtPiece = useCreateArtPiece();

  const portfolioId = useCaptureStore((s) => s.portfolioId);
  const artworkPhotos = useCaptureStore((s) => s.artworkPhotos);
  const labelPhoto = useCaptureStore((s) => s.labelPhoto);
  const resetCapture = useCaptureStore((s) => s.reset);

  const handleSave = async () => {
    if (!portfolioId) {
      Alert.alert("Error", "No collection selected");
      return;
    }

    try {
      await createArtPiece.mutateAsync({
        portfolioId,
        title: formData.title || undefined,
        artist: formData.artist || undefined,
        year: formData.year || undefined,
        medium: formData.medium || undefined,
        dimensions: formData.dimensions || undefined,
        notes: formData.notes || undefined,
        venueName: formData.venueName || undefined,
        venueCity: formData.venueCity || undefined,
        visitDate: formData.visitDate || undefined,
        artworkPhotos,
        labelPhoto,
      });

      resetCapture();
      Alert.alert("Saved", "Artwork has been added to your collection.", [
        { text: "OK", onPress: () => router.dismissAll() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-950">
      {/* Photo preview strip */}
      <ScrollView
        horizontal
        className="px-4 pt-4"
        showsHorizontalScrollIndicator={false}
      >
        {artworkPhotos.map((photo, i) => (
          <Image
            key={i}
            source={{ uri: photo.uri }}
            className="w-24 h-24 rounded-xl mr-2"
            contentFit="cover"
          />
        ))}
        {labelPhoto && (
          <View className="relative">
            <Image
              source={{ uri: labelPhoto.uri }}
              className="w-24 h-24 rounded-xl"
              contentFit="cover"
            />
            <View className="absolute bottom-1 left-1 bg-black/60 px-2 py-0.5 rounded">
              <Text className="text-white text-xs">Label</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="p-4">
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {artworkPhotos.length} artwork photo{artworkPhotos.length !== 1 ? "s" : ""}
          {labelPhoto ? " + 1 label photo" : ""}
        </Text>

        <ArtPieceForm data={formData} onChange={setFormData} />

        <View className="mt-6 mb-10">
          <Button
            title="Save Artwork"
            onPress={handleSave}
            loading={createArtPiece.isPending}
          />
        </View>
      </View>
    </ScrollView>
  );
}

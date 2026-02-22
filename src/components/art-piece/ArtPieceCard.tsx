import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ArtPieceWithPhotos } from "@/src/types/database.types";

interface ArtPieceCardProps {
  artPiece: ArtPieceWithPhotos;
  onPress: () => void;
}

export function ArtPieceCard({ artPiece, onPress }: ArtPieceCardProps) {
  const artworkPhoto = artPiece.art_photos?.find(
    (p) => p.photo_type === "artwork"
  );

  return (
    <TouchableOpacity
      className="flex-1 m-1.5 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
      onPress={onPress}
      activeOpacity={0.8}
    >
      {artworkPhoto ? (
        <Image
          source={{ uri: artworkPhoto.public_url }}
          className="w-full aspect-square"
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View className="w-full aspect-square items-center justify-center bg-gray-200 dark:bg-gray-700">
          <FontAwesome name="image" size={32} color="#9CA3AF" />
        </View>
      )}
      <View className="p-3">
        <Text
          className="font-semibold text-gray-900 dark:text-white"
          numberOfLines={1}
        >
          {artPiece.title || "Untitled"}
        </Text>
        {artPiece.artist && (
          <Text
            className="text-sm text-gray-500 dark:text-gray-400 mt-0.5"
            numberOfLines={1}
          >
            {artPiece.artist}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

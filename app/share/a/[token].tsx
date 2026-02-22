import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { usePublicArtPiece } from "@/src/hooks/usePublicShare";
import { PhotoCarousel } from "@/src/components/art-piece/PhotoCarousel";

function MetadataRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View className="flex-row py-2.5 border-b border-gray-100 dark:border-gray-800">
      <Text className="w-28 text-sm text-gray-500 dark:text-gray-400">
        {label}
      </Text>
      <Text className="flex-1 text-gray-900 dark:text-white">{value}</Text>
    </View>
  );
}

export default function PublicArtPieceScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { data: artPiece, isLoading, error } = usePublicArtPiece(token);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !artPiece) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950 px-8">
        <FontAwesome name="lock" size={48} color="#9CA3AF" />
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
          Not Available
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
          This artwork is no longer shared or doesn't exist.
        </Text>
      </View>
    );
  }

  const sortedPhotos = [...(artPiece.art_photos || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-950">
      <PhotoCarousel photos={sortedPhotos} />

      <View className="px-4 py-6">
        {artPiece.title && (
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {artPiece.title}
          </Text>
        )}
        {artPiece.artist && (
          <Text className="text-lg text-gray-600 dark:text-gray-300 mt-1">
            {artPiece.artist}
          </Text>
        )}

        <View className="mt-6">
          <MetadataRow label="Year" value={artPiece.year} />
          <MetadataRow label="Medium" value={artPiece.medium} />
          <MetadataRow label="Dimensions" value={artPiece.dimensions} />
          <MetadataRow label="Venue" value={artPiece.venue_name} />
          <MetadataRow label="City" value={artPiece.venue_city} />
          <MetadataRow label="Visited" value={artPiece.visit_date} />
        </View>

        {artPiece.notes && (
          <View className="mt-6">
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Notes
            </Text>
            <Text className="text-gray-900 dark:text-white leading-6">
              {artPiece.notes}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

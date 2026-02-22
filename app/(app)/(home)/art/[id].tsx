import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useArtPiece, useDeleteArtPiece } from "@/src/hooks/useArtPiece";
import { PhotoCarousel } from "@/src/components/art-piece/PhotoCarousel";
import { Button } from "@/src/components/ui/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import { shareArtPiece } from "@/src/hooks/useShareToken";

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

export default function ArtPieceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: artPiece, isLoading } = useArtPiece(id);
  const deleteArtPiece = useDeleteArtPiece();

  const handleDelete = () => {
    if (!artPiece) return;
    Alert.alert(
      "Delete Artwork",
      "This will permanently delete this artwork and its photos. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteArtPiece.mutateAsync({
                id: artPiece.id,
                portfolioId: artPiece.portfolio_id,
              });
              router.back();
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  const handleShare = () => {
    if (!artPiece) return;
    shareArtPiece(artPiece.share_token, artPiece.title || "Artwork");
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!artPiece) return null;

  const sortedPhotos = [...(artPiece.art_photos || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-950">
      <Stack.Screen
        options={{
          title: artPiece.title || "Artwork",
          headerRight: () => (
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={handleShare}>
                <FontAwesome name="share-alt" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <FontAwesome name="trash-o" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

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

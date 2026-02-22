import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { usePortfolio, usePortfolioArtPieces } from "@/src/hooks/usePortfolio";
import { useDeletePortfolio } from "@/src/hooks/usePortfolios";
import { ArtPieceCard } from "@/src/components/art-piece/ArtPieceCard";
import { ShareSheet } from "@/src/components/portfolio/ShareSheet";
import { EmptyState } from "@/src/components/ui/EmptyState";

export default function PortfolioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: portfolio, isLoading: loadingPortfolio } = usePortfolio(id);
  const {
    data: artPieces,
    isLoading: loadingPieces,
    refetch,
  } = usePortfolioArtPieces(id);
  const deletePortfolio = useDeletePortfolio();
  const [showShare, setShowShare] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Delete Collection",
      "This will permanently delete this collection and all its art pieces. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePortfolio.mutateAsync(id);
              router.back();
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  if (loadingPortfolio || loadingPieces) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!portfolio) return null;

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      <Stack.Screen
        options={{
          title: portfolio.name,
          headerRight: () => (
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={() => setShowShare(true)}>
                <FontAwesome name="share-alt" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <FontAwesome name="trash-o" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {portfolio.description && (
        <View className="px-4 pt-3 pb-1">
          <Text className="text-gray-500 dark:text-gray-400">
            {portfolio.description}
          </Text>
        </View>
      )}

      {!artPieces || artPieces.length === 0 ? (
        <EmptyState
          icon="camera"
          title="No Art Pieces Yet"
          message="Capture your first artwork to add it to this collection."
          actionLabel="Capture Artwork"
          onAction={() =>
            router.push({ pathname: "/capture", params: { portfolioId: id } })
          }
        />
      ) : (
        <FlashList
          data={artPieces}
          numColumns={2}

          contentContainerStyle={{ padding: 6 }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <ArtPieceCard
              artPiece={item}
              onPress={() =>
                router.push(`/(app)/(home)/art/${item.id}`)
              }
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary-600 items-center justify-center shadow-lg"
        onPress={() =>
          router.push({ pathname: "/capture", params: { portfolioId: id } })
        }
      >
        <FontAwesome name="camera" size={20} color="white" />
      </TouchableOpacity>

      {portfolio && (
        <ShareSheet
          visible={showShare}
          onClose={() => setShowShare(false)}
          portfolio={portfolio}
        />
      )}
    </View>
  );
}

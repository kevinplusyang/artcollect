import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { usePortfolios } from "@/src/hooks/usePortfolios";
import { useCaptureStore } from "@/src/stores/capture.store";
import { EmptyState } from "@/src/components/ui/EmptyState";

export default function CaptureTabScreen() {
  const router = useRouter();
  const { data: portfolios, isLoading } = usePortfolios();
  const setPortfolioId = useCaptureStore((s) => s.setPortfolioId);
  const resetCapture = useCaptureStore((s) => s.reset);

  const handleSelectPortfolio = (portfolioId: string) => {
    resetCapture();
    setPortfolioId(portfolioId);
    router.push("/capture/photos");
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <EmptyState
        icon="folder-open-o"
        title="No Collections"
        message="Create a collection first, then you can start capturing art."
        actionLabel="Go to Collections"
        onAction={() => router.push("/(app)/(home)")}
      />
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Select a collection
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">
          Choose where to save the artwork you're about to capture.
        </Text>
      </View>

      <FlashList
        data={portfolios}

        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center py-4 border-b border-gray-100 dark:border-gray-800"
            onPress={() => handleSelectPortfolio(item.id)}
          >
            <View className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 items-center justify-center mr-3">
              <FontAwesome name="folder" size={20} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900 dark:text-white">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {item.art_pieces?.[0]?.count ?? 0} pieces
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

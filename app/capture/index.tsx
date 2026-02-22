import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter, useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { usePortfolios } from "@/src/hooks/usePortfolios";
import { useCaptureStore } from "@/src/stores/capture.store";
import { useEffect } from "react";

export default function CaptureSelectPortfolio() {
  const router = useRouter();
  const { portfolioId } = useLocalSearchParams<{ portfolioId?: string }>();
  const { data: portfolios, isLoading } = usePortfolios();
  const setPortfolioId = useCaptureStore((s) => s.setPortfolioId);
  const resetCapture = useCaptureStore((s) => s.reset);

  // If portfolioId is passed directly, skip selection
  useEffect(() => {
    if (portfolioId) {
      resetCapture();
      setPortfolioId(portfolioId);
      router.replace("/capture/photos");
    }
  }, [portfolioId]);

  const handleSelect = (id: string) => {
    resetCapture();
    setPortfolioId(id);
    router.push("/capture/photos");
  };

  if (isLoading || portfolioId) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Which collection?
        </Text>
      </View>

      <FlashList
        data={portfolios || []}

        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center py-4 border-b border-gray-100 dark:border-gray-800"
            onPress={() => handleSelect(item.id)}
          >
            <View className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 items-center justify-center mr-3">
              <FontAwesome name="folder" size={20} color="#6B7280" />
            </View>
            <Text className="flex-1 font-medium text-gray-900 dark:text-white">
              {item.name}
            </Text>
            <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

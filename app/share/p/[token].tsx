import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { usePublicPortfolio } from "@/src/hooks/usePublicShare";

export default function PublicPortfolioScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { data: portfolio, isLoading, error } = usePublicPortfolio(token);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !portfolio) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950 px-8">
        <FontAwesome name="lock" size={48} color="#9CA3AF" />
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
          Not Available
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
          This collection is no longer shared or doesn't exist.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-950">
      {/* Header */}
      <View className="px-4 pt-6 pb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {portfolio.name}
        </Text>
        {portfolio.profiles?.display_name && (
          <Text className="text-gray-500 dark:text-gray-400 mt-1">
            by {portfolio.profiles.display_name}
          </Text>
        )}
        {portfolio.description && (
          <Text className="text-gray-600 dark:text-gray-300 mt-2">
            {portfolio.description}
          </Text>
        )}
      </View>

      {/* Art pieces grid */}
      <View className="flex-row flex-wrap px-2">
        {portfolio.art_pieces?.map((piece) => {
          const photo = piece.art_photos?.find(
            (p) => p.photo_type === "artwork"
          );
          return (
            <View key={piece.id} className="w-1/2 p-1.5">
              <View className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                {photo ? (
                  <Image
                    source={{ uri: photo.public_url }}
                    className="w-full aspect-square"
                    contentFit="cover"
                  />
                ) : (
                  <View className="w-full aspect-square items-center justify-center">
                    <FontAwesome name="image" size={32} color="#9CA3AF" />
                  </View>
                )}
                <View className="p-3">
                  <Text
                    className="font-semibold text-gray-900 dark:text-white"
                    numberOfLines={1}
                  >
                    {piece.title || "Untitled"}
                  </Text>
                  {piece.artist && (
                    <Text
                      className="text-sm text-gray-500 dark:text-gray-400"
                      numberOfLines={1}
                    >
                      {piece.artist}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}

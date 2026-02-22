import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Portfolio } from "@/src/types/database.types";

interface PortfolioCardProps {
  portfolio: Portfolio & { art_pieces: [{ count: number }] };
  onPress: () => void;
}

export function PortfolioCard({ portfolio, onPress }: PortfolioCardProps) {
  const count = portfolio.art_pieces?.[0]?.count ?? 0;

  return (
    <TouchableOpacity
      className="flex-1 m-1.5 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
      onPress={onPress}
      activeOpacity={0.8}
    >
      {portfolio.cover_image_url ? (
        <Image
          source={{ uri: portfolio.cover_image_url }}
          className="w-full aspect-square"
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View className="w-full aspect-square items-center justify-center bg-gray-200 dark:bg-gray-700">
          <FontAwesome name="picture-o" size={32} color="#9CA3AF" />
        </View>
      )}
      <View className="p-3">
        <Text
          className="font-semibold text-gray-900 dark:text-white"
          numberOfLines={1}
        >
          {portfolio.name}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {count} {count === 1 ? "piece" : "pieces"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

import { View, Text, Modal, TouchableOpacity, Switch, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Portfolio } from "@/src/types/database.types";
import { useTogglePublic, sharePortfolio } from "@/src/hooks/useShareToken";
import { getPortfolioShareUrl } from "@/src/utils/share";
import * as Clipboard from "expo-clipboard";

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  portfolio: Portfolio;
}

export function ShareSheet({ visible, onClose, portfolio }: ShareSheetProps) {
  const togglePublic = useTogglePublic("portfolios", [
    "portfolios",
    "portfolio",
    portfolio.id,
  ]);

  const handleToggle = async (value: boolean) => {
    try {
      await togglePublic.mutateAsync({ id: portfolio.id, isPublic: value });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCopyLink = async () => {
    const url = getPortfolioShareUrl(portfolio.share_token);
    await Clipboard.setStringAsync(url);
    Alert.alert("Copied", "Share link copied to clipboard");
  };

  const handleShare = async () => {
    await sharePortfolio(portfolio.share_token, portfolio.name);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity
        className="flex-1"
        onPress={onClose}
        activeOpacity={1}
      />
      <View className="bg-white dark:bg-gray-900 rounded-t-3xl px-6 pb-10 pt-6">
        <View className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full self-center mb-6" />
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Share Collection
        </Text>

        <View className="flex-row items-center justify-between mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
          <View className="flex-1 mr-4">
            <Text className="font-medium text-gray-900 dark:text-white">
              Public
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Anyone with the link can view
            </Text>
          </View>
          <Switch
            value={portfolio.is_public}
            onValueChange={handleToggle}
            trackColor={{ true: "#253de4" }}
          />
        </View>

        {portfolio.is_public && (
          <View className="gap-3">
            <TouchableOpacity
              className="flex-row items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
              onPress={handleCopyLink}
            >
              <FontAwesome name="link" size={20} color="#6B7280" />
              <Text className="ml-3 font-medium text-gray-900 dark:text-white">
                Copy Link
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
              onPress={handleShare}
            >
              <FontAwesome name="share" size={20} color="#6B7280" />
              <Text className="ml-3 font-medium text-gray-900 dark:text-white">
                Share via...
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

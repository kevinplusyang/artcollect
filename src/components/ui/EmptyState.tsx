import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface EmptyStateProps {
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <FontAwesome name={icon} size={48} color="#9CA3AF" />
      <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
        {title}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
        {message}
      </Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          className="mt-6 h-12 px-8 rounded-xl bg-primary-600 items-center justify-center"
          onPress={onAction}
        >
          <Text className="text-white font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

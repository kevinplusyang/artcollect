import { View, Text, Alert } from "react-native";
import { useAuthStore } from "@/src/stores/auth.store";
import { signOut } from "@/src/hooks/useAuth";
import { Button } from "@/src/components/ui/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-950 px-6 pt-8">
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mb-4">
          <FontAwesome name="user" size={32} color="#3b5eef" />
        </View>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          {user?.email}
        </Text>
      </View>

      <View className="gap-4">
        <View className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Account ID
          </Text>
          <Text className="text-gray-900 dark:text-white mt-1 text-xs">
            {user?.id}
          </Text>
        </View>

        <Button title="Sign Out" variant="danger" onPress={handleSignOut} />
      </View>
    </View>
  );
}

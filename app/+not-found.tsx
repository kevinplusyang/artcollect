import { View, Text } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950 px-8">
        <Text className="text-4xl font-bold text-gray-300 dark:text-gray-600">
          404
        </Text>
        <Text className="text-lg text-gray-900 dark:text-white mt-4">
          Page not found
        </Text>
        <Link href="/(app)/(home)" className="mt-6">
          <Text className="text-primary-600 font-semibold">Go Home</Text>
        </Link>
      </View>
    </>
  );
}

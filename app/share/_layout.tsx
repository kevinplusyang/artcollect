import { Stack } from "expo-router";

export default function ShareLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="p/[token]" options={{ title: "Shared Collection" }} />
      <Stack.Screen name="a/[token]" options={{ title: "Shared Artwork" }} />
    </Stack>
  );
}

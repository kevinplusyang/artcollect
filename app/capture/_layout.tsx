import { Stack } from "expo-router";

export default function CaptureModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Select Collection" }} />
      <Stack.Screen name="photos" options={{ title: "Take Photos" }} />
      <Stack.Screen name="label" options={{ title: "Label Photo" }} />
      <Stack.Screen name="metadata" options={{ title: "Details" }} />
    </Stack>
  );
}

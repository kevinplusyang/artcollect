import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "My Collections" }}
      />
      <Stack.Screen
        name="portfolio/[id]"
        options={{ title: "Portfolio" }}
      />
      <Stack.Screen
        name="art/[id]"
        options={{ title: "Artwork" }}
      />
    </Stack>
  );
}

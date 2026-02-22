import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/src/stores/auth.store";

export default function AuthLayout() {
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return null;

  if (session) {
    return <Redirect href="/(app)/(home)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}

import { Redirect, Tabs } from "expo-router";
import { useAuthStore } from "@/src/stores/auth.store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function AppLayout() {
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);
  const colorScheme = useColorScheme();

  if (isLoading) return null;

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "#93aef9" : "#253de4",
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Collections",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="th-large" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(capture)"
        options={{
          title: "Capture",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

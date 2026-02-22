import { useState } from "react";
import {
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { usePortfolios } from "@/src/hooks/usePortfolios";
import { PortfolioCard } from "@/src/components/portfolio/PortfolioCard";
import { CreatePortfolioModal } from "@/src/components/portfolio/CreatePortfolioModal";
import { EmptyState } from "@/src/components/ui/EmptyState";

export default function HomeScreen() {
  const router = useRouter();
  const { data: portfolios, isLoading, refetch } = usePortfolios();
  const [showCreate, setShowCreate] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      {!portfolios || portfolios.length === 0 ? (
        <EmptyState
          icon="picture-o"
          title="No Collections Yet"
          message="Create your first collection to start organizing your favorite art pieces."
          actionLabel="Create Collection"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <FlashList
          data={portfolios}
          numColumns={2}

          contentContainerStyle={{ padding: 6 }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <PortfolioCard
              portfolio={item}
              onPress={() =>
                router.push(`/(app)/(home)/portfolio/${item.id}`)
              }
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary-600 items-center justify-center shadow-lg"
        onPress={() => setShowCreate(true)}
      >
        <FontAwesome name="plus" size={20} color="white" />
      </TouchableOpacity>

      <CreatePortfolioModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </View>
  );
}

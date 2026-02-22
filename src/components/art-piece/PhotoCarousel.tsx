import { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ViewToken,
} from "react-native";
import { Image } from "expo-image";
import { ArtPhoto } from "@/src/types/database.types";

interface PhotoCarouselProps {
  photos: ArtPhoto[];
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  if (photos.length === 0) return null;

  return (
    <View>
      <FlatList
        data={photos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.public_url }}
            style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
            contentFit="contain"
            transition={200}
          />
        )}
      />
      {photos.length > 1 && (
        <View className="flex-row justify-center mt-3 gap-1.5">
          {photos.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === activeIndex
                  ? "bg-primary-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </View>
      )}
      {photos[activeIndex]?.photo_type === "label" && (
        <Text className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
          Label photo
        </Text>
      )}
    </View>
  );
}

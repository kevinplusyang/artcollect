import { View } from "react-native";
import { Input } from "@/src/components/ui/Input";

export interface ArtPieceFormData {
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions: string;
  notes: string;
  venueName: string;
  venueCity: string;
  visitDate: string;
}

interface ArtPieceFormProps {
  data: ArtPieceFormData;
  onChange: (data: ArtPieceFormData) => void;
}

export function ArtPieceForm({ data, onChange }: ArtPieceFormProps) {
  const update = (field: keyof ArtPieceFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <View className="gap-4">
      <Input
        label="Title"
        placeholder="e.g., Starry Night"
        value={data.title}
        onChangeText={(v) => update("title", v)}
      />
      <Input
        label="Artist"
        placeholder="e.g., Vincent van Gogh"
        value={data.artist}
        onChangeText={(v) => update("artist", v)}
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            label="Year"
            placeholder="e.g., 1889"
            value={data.year}
            onChangeText={(v) => update("year", v)}
          />
        </View>
        <View className="flex-1">
          <Input
            label="Medium"
            placeholder="e.g., Oil on canvas"
            value={data.medium}
            onChangeText={(v) => update("medium", v)}
          />
        </View>
      </View>
      <Input
        label="Dimensions"
        placeholder="e.g., 73.7 x 92.1 cm"
        value={data.dimensions}
        onChangeText={(v) => update("dimensions", v)}
      />
      <Input
        label="Notes"
        placeholder="Your personal notes..."
        value={data.notes}
        onChangeText={(v) => update("notes", v)}
        multiline
        numberOfLines={3}
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            label="Venue"
            placeholder="e.g., MoMA"
            value={data.venueName}
            onChangeText={(v) => update("venueName", v)}
          />
        </View>
        <View className="flex-1">
          <Input
            label="City"
            placeholder="e.g., New York"
            value={data.venueCity}
            onChangeText={(v) => update("venueCity", v)}
          />
        </View>
      </View>
      <Input
        label="Visit Date"
        placeholder="YYYY-MM-DD"
        value={data.visitDate}
        onChangeText={(v) => update("visitDate", v)}
      />
    </View>
  );
}

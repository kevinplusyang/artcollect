import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { useCreatePortfolio } from "@/src/hooks/usePortfolios";

interface CreatePortfolioModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreatePortfolioModal({
  visible,
  onClose,
}: CreatePortfolioModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createPortfolio = useCreatePortfolio();

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name for your collection");
      return;
    }
    try {
      await createPortfolio.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setName("");
      setDescription("");
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end"
      >
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />
        <View className="bg-white dark:bg-gray-900 rounded-t-3xl px-6 pb-10 pt-6">
          <View className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full self-center mb-6" />
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            New Collection
          </Text>

          <View className="gap-4">
            <Input
              label="Name"
              placeholder="e.g., Modern Art Favorites"
              value={name}
              onChangeText={setName}
              autoFocus
            />
            <Input
              label="Description (optional)"
              placeholder="What's this collection about?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              className="h-24 px-4 pt-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            />

            <View className="flex-row gap-3 mt-2">
              <View className="flex-1">
                <Button title="Cancel" variant="secondary" onPress={onClose} />
              </View>
              <View className="flex-1">
                <Button
                  title="Create"
                  onPress={handleCreate}
                  loading={createPortfolio.isPending}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

import { TextInput, View, Text, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <View>
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </Text>
      )}
      <TextInput
        className="h-12 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
}

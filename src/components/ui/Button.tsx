import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const variantStyles = {
  primary: "bg-primary-600",
  secondary: "bg-gray-200 dark:bg-gray-700",
  danger: "bg-red-600",
};

const textStyles = {
  primary: "text-white",
  secondary: "text-gray-900 dark:text-white",
  danger: "text-white",
};

export function Button({
  title,
  loading,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`h-12 rounded-xl items-center justify-center ${variantStyles[variant]} ${
        disabled || loading ? "opacity-50" : ""
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? "#374151" : "white"} />
      ) : (
        <Text className={`font-semibold text-base ${textStyles[variant]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

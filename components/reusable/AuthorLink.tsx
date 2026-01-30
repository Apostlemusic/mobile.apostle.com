import React from "react";
import { Pressable, Text, TextProps } from "react-native";
import { useRouter } from "expo-router";

type AuthorLinkProps = {
  name?: string | null;
  numberOfLines?: number;
  style?: TextProps["style"];
  disabled?: boolean;
};

const AuthorLink: React.FC<AuthorLinkProps> = ({ name, numberOfLines, style, disabled }) => {
  const router = useRouter();
  const label = (name ?? "").trim();
  const isDisabled = disabled || label.length === 0;

  const handlePress = () => {
    if (isDisabled) return;
    router.push(`/tabs/artist/${encodeURIComponent(label)}` as any);
  };

  if (isDisabled) {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {label}
      </Text>
    );
  }

  return (
    <Pressable onPress={handlePress}>
      <Text style={style} numberOfLines={numberOfLines}>
        {label}
      </Text>
    </Pressable>
  );
};

export default AuthorLink;

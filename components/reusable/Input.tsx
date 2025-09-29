import React, { useState, useRef } from 'react';
import { TextInput, View, TouchableOpacity, Animated } from 'react-native';
import tw from 'twrnc';
import { MaterialIcons } from '@expo/vector-icons';

type InputProps = {
  label: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
};

const Input: React.FC<InputProps> = ({
  label,
  secureTextEntry = false,
  value,
  onChangeText,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(secureTextEntry);
  const [isFocused, setFocused] = useState(false);
  const borderColor = useRef(new Animated.Value(0)).current;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderColor, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderColor, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const borderStyle = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#808080', '#3B82F6'], // Gray to Blue transition
  });

  return (
    <View style={tw`mb-4`}>
      <Animated.View
        style={[
          tw`flex-row items-center border-b p-2 mt-3 rounded-lg`,
          { borderColor: borderStyle, },
        ]}
      >
        <TextInput
          style={tw`flex-1 text-base`}
          placeholder={label}
          placeholderTextColor="#A1A1A1" // Set placeholder color to gray
          secureTextEntry={secureTextEntry && isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChangeText={onChangeText}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialIcons
              name={isPasswordVisible ? 'visibility-off' : 'visibility'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

export default Input;
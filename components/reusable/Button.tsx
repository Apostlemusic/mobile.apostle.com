import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const ArrowButton = ({ direction, onPress, disabled }: {direction: any, onPress: any, disabled: boolean,}) => {
  const icon = direction === 'next' ? 'arrowright' : 'arrowleft';

  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress} // Disable onPress if disabled
      style={[styles.button, disabled && styles.disabledButton]} // Apply styles conditionally
      activeOpacity={0.7}
      disabled={disabled} // Disable the button if needed
    >
      <AntDesign name={icon} size={26} color={disabled ? '#264252' : '#fff'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#264252', // Blue color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor:'transparent', // Make background transparent when disabled
    borderColor: '#264252', // Keep the border color
    borderWidth: 1, // Add border when disabled
    color: '#264252', // Change icon color when disabled
    opacity: 0.5, // Reduce opacity when disabled
  },
});

// Export the button component
export default ArrowButton;
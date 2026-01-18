// AccountActive.tsx
import React from "react";
import { Image } from "react-native";

const AccountActive = ({ color = "#FFFFFF" }: { color?: string }) => {
  return (
    <Image
      source={{
        uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABm0lEQVR4nO2Yu0oDQRSGPyLrpbHSV7CxSONTKJgIBlsrX0ErMRZeOn0FTfIUoo19Ok1iLKy0ETHrpQlZGTiCBEJW92zORuaDA0tmNvN/y+xhEvB4PJoEQAmoAQ3gTcpdV2XMzckka8AdEA0pN6dIhsgBxzGC99eh3GvOX8L/lDDfNlHCKliFD2Lu+WF1D0xaCJQUwkdS6xYCNUWBioVAS1GgYSEQKgqE4y7waiHQVBS4tRCoKgqcWQiMfRsNlDpR0/KEWkwYvgesYsxRAoEDMkBOTpW/ffIufCaO098UYr4TrSxsm0EE0lEq0ttDqRvgXMYy+5PS4/nPzABloA10FY8QUV91ZY09WVMt/HWKoaMB5dac1hAoG4SPpHY1BNqGAi0NgTT3fBTjnUhMz1CgpyHwYijwrCFwaShwoSGwZSiwoSEwZdSJGsAESizKfzejCh8CeZRZAT5GEP4dWCYl8ilvpwdgiZSZBfaBjmLwjhxZ3HePjHlgB6gnCF4HtoE5jFkANoFT4Eo6yBPwKfUon7mxE5nr7vF4PCTjC4hx5eF2DgTgAAAAAElFTkSuQmCC",
      }}
      style={{ width: 21, height: 20, tintColor: color }}
      resizeMode="contain"
    />
  );
};

export default AccountActive;

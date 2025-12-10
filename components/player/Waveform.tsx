import { View } from "react-native";
import tailwind from "twrnc";

export function Waveform({ progress = 0.5 }) {
  const bars = new Array(28).fill(0).map((_, i) => (
    <View
      key={i}
      style={tailwind.style("w-1 mx-0.5 rounded", {
        height: 8 + Math.random() * 32,
        backgroundColor: i < progress * 28 ? "white" : "rgba(255,255,255,0.35)",
      })}
    />
  ));
  return <View style={tailwind`flex-row items-end justify-center`}>{bars}</View>;
}

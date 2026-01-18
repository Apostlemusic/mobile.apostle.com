import React from "react";
import { Image } from "react-native";

const BurstActive = ({ color = "#FFFFFF" }: { color?: string }) => (
  <Image
    source={{
      uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACCUlEQVR4nO3YPWsUURjF8R8qSgQtbPwAFr5g8C2inV/BRuILq0W0sBYELdTCCFqoH0ERsRCiYrSItZU2YmGRSAQhsRfNmmQZGbjKumTdmUzuJAv3wMMWw9w95zL/2b2HpKSkpBLahmO4iJvYZY1qK47iAu7jDWaRdcyn1Ta6GYdwDnfwGl+WMNpt3tVldCP24RRG8RxTaJUwm88PvMcDXML22MaHMI65kkZ/4QOe4CqOYwfWqVFnsNDD6EJ4jp/iBk5gNzasNtx70eww+xkvcAunsR+blgn3edwLcM/EgPtR22L5o7Cz5P0DAe6zuI1XdcM927bY4R5wD+JkgPsZJtcC3K22xdcvcT3f3ZdrGe6sbZaCe74muFc8QCy4t+AIRnAXE/gavusjrpRds1uAlYD7IBoB7nFMF3z83ob7KwUoC/dweK+PBbgXSzKTdcy1qgF6wT20TLizgjNZNcD/4G4U+OWuOguxAgyGV2RM81mXjVuRAI9rMp/FCvCt3wO0+j1AlgJIAf5RCiAFUCnAn/8yc/0aYBTfw2dfBuimFEC1afV7gJmqAYrAHXMeVg1QBO5Y08QekVT1rJv1mPnQjEfTVCTjP0OVf0BkXa9odDEc2MdCizEcjql5u1GLBkJvU8TsdOiD8l6oEXqiwn1PTOW7dTkUXs3QrE2Epm0kNG95A5eUlJTkr34DffWEGaLaf9EAAAAASUVORK5CYII=",
    }}
    style={{ width: 21, height: 20, tintColor: color }}
    resizeMode="contain"
  />
);

export default BurstActive;

import React from "react";
import Svg, { Rect, Image, Defs, Pattern, Use } from "react-native-svg";

const BurstActive = () => (
  <Svg width={21} height={20} viewBox="0 0 21 20" fill="none">
    <Rect x="0.833496" width="20" height="20" fill="url(#pattern0_652_441)" />
    <Defs>
      <Pattern
        id="pattern0_652_441"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use href="#image0_652_441" transform="scale(0.0208333)" />
      </Pattern>
      <Image
        id="image0_652_441"
        width={48}
        height={48}
        preserveAspectRatio="none"
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACCUlEQVR4nO3YPWsUURjF8R8qSgQtbPwAFr5g8C2inV/BRuILq0W0sBYELdTCCFqoH0ERsRCiYrSItZU2YmGRSAQhsRfNmmQZGbjKumTdmUzuJAv3wMMWw9w95zL/2b2HpKSkpBLahmO4iJvYZY1qK47iAu7jDWaRdcyn1Ta6GYdwDnfwGl+WMNpt3tVldCP24RRG8RxTaJUwm88PvMcDXML22MaHMI65kkZ/4QOe4CqOYwfWqVFnsNDD6EJ4jp/iBk5gNzasNtx70eww+xkvcAunsR+blgn3edwLcM/EgPtR22L5o7Cz5P0DAe6zuI1XdcM927bY4R5wD+JkgPsZJtcC3K22xdcvcT3f3ZdrGe6sbZaCe74muFc8QCy4t+AIRnAXE/gavusjrpRds1uAlYD7IBoB7nFMF3z83ob7KwUoC/dweK+PBbgXSzKTdcy1qgF6wT20TLizgjNZNcD/4G4U+OWuOguxAgyGV2RM81mXjVuRAI9rMp/FCvCt3wO0+j1AlgJIAf5RCiAFUCnAn/8yc/0aYBTfw2dfBuimFEC1afV7gJmqAYrAHXMeVg1QBO5Y08QekVT1rJv1mPnQjEfTVCTjP0OVf0BkXa9odDEc2MdCizEcjql5u1GLBkJvU8TsdOiD8l6oEXqiwn1PTOW7dTkUXs3QrE2Epm0kNG95A5eUlJTkr34DffWEGaLaf9EAAAAASUVORK5CYII="
      />
    </Defs>
  </Svg>
);

export default BurstActive;

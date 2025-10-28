// SearchActive.tsx
import React from "react";
import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";

const SearchActive = (props: any) => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect x={0.1665} width={20} height={20} fill="url(#pattern0_696_799)" />
    <Defs>
      <Pattern
        id="pattern0_696_799"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#image0_696_799" transform="scale(0.0208333)" />
      </Pattern>
      <Image
        id="image0_696_799"
        width={48}
        height={48}
        preserveAspectRatio="none"
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACRUlEQVR4nO2Yz0tUURTHPxq5K0ylzGW2al/2R1QmKM4ibNFfUblqq/g/BGLTslz3C1qO2iIoKxAEpXa1HDWUI0cYDufhm5lz3/jkfeAy8Gbme89599xzv+9BRUVFRZkZBuaA10AD2AGa+tnQ6/L9EGeMm0Ad2AcOcwz53StgvNeBDwBLwF7OwO2Q1VkELvaqXN53GLgdn4GrRQY/AvzMCGYNeArcBq7r3ZXPO8AzYD3jfz9Ut5Cy+eQE8B24n1PjAbDpaHwoopyWnInfAJfa1JHfrzpaCyTuNntO8P0d6vU7STSBGySi7pRNu3feclnrv1V3hURdx/b5e0Hak845MUwwc063icR2p0fB+sc2oHUCaZWRPDf6Uq6hNMwE0ucjmTD634L12TUTXAvWHzP6/4L1j9tb6wRyoEUienYjh7JjJhB7kHIFfqfeA+JtUu6Br6m7kBizSOaN/nKZzoE+4IvRf0IwQ85JLK4yginHD41SgBfaVC/TDYPAL6P7kkSMO+30bRdu9IK6WXv3b5GQRcfDr3awEoOavNV6QWLkieljxiPhw5wbdsopm5MhzSI5I46HPxkbaswm9HAa0EPvrl633caOA6BWRBLi19+dEkyn4yCFnc4qpwVnY+cdTa35xxr0ofFChawE+gy70sabuaa2ytZuI8Hu9zIJ4YoufV39/F/gP/BHvc2ynrBZh1TtLCTRLTNOEoXtiShmzkMS0+chiVrGnpDXMKVh1klim5Ixa5KQFwylYxLY0rsf9RxSUVFRQSxHEZtxCQWGNWwAAAAASUVORK5CYII="
      />
    </Defs>
  </Svg>
);

export default SearchActive;

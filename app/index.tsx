// index.tsx
import { useFonts } from "expo-font";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import SplashScreen from "@/screens/SplashScreen"; // your custom splash component

// Keep the splash screen visible while fonts are loading
ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
    const [loaded, error] = useFonts({
        "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            ExpoSplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    // Once fonts are ready → render your custom SplashScreen component
    return <SplashScreen />;
}

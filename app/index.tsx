// index.tsx
import { useFonts } from "expo-font";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
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
        // You could also return null, but loader feels cleaner
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Once fonts are ready → render your custom SplashScreen component
    return <SplashScreen />;
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import colors from '../constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerShown: false,
          headerTintColor: colors.textWhite,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
          },
          headerShadowVisible: false,
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}

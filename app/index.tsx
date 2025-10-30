import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookListScreen from '../screens/bookScreen';
import BookDetailsScreen from '../screens/bookDetailsScreen';
import BookFormScreen from '../screens/bookFormScreen';
import colors from '../constants/colors';

export type RootStackParamList = {
  BookList: undefined;
  BookDetails: { bookId: string }; 
  BookForm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="BookList"
        screenOptions={{
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.textWhite,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 20,
            },
            headerShadowVisible: true,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="BookList"
            component={BookListScreen}
            options={{
              title: 'Mes Livres',
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="BookDetails"
            component={BookDetailsScreen}
            options={{
              title: 'Détails du livre',
            }}
          />
          <Stack.Screen
            name="BookForm"
            component={BookFormScreen}
            options={{
              title: 'Ajouter un livre',
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
    </>
  );
}
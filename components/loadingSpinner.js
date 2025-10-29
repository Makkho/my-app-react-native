// components/LoadingSpinner.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import colors from '../constants/colors';

const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
});

export default LoadingSpinner;
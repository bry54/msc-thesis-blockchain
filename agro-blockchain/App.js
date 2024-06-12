import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import StackNavigator from './src/navigation/stack-navigator';
import StoreProvider from './src/store';

const App = () => {
  return (
      <StoreProvider>
          <StackNavigator />
      </StoreProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

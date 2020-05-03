import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import GrocerEatsNavigator from './Navigation/GrocerEatsNavigator';
import store from './store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';



const App: () => React$Node = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <GrocerEatsNavigator />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>

  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default App;

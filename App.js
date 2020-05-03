import React from 'react';
import { StyleSheet, UIManager, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import GrocerEatsNavigator from './Navigation/GrocerEatsNavigator';
import store from './store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { init_grocery_list_db, init_saved_recipes_db } from './helpers/db';

init_saved_recipes_db().then(()=>{
}).catch(err=>{
  Alert.alert("Something went wrong","Error while initializing saved recipes database")
})

init_grocery_list_db().then(()=>{
}).catch(err=>{
  Alert.alert("Something went wrong","Error while initializing grocery list database")
})


const App: () => React$Node = () => {

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

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

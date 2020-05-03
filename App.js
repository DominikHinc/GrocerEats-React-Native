import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Alert, UIManager } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { init_grocery_list_db, init_saved_recipes_db } from './helpers/db';
import GrocerEatsNavigator from './Navigation/GrocerEatsNavigator';
import store from './store/store';


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


export default App;

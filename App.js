import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const App: () => React$Node = () => {
  return (
    <View style={styles.screen}>
      <Text>XD</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});

export default App;

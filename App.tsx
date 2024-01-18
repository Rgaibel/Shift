import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import Navigation from './src/navigation';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#231F20',
  },
});

export default App;

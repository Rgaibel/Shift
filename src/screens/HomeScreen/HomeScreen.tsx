// HomeScreen.tsx
import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const navigateToTimeParameter = () => {
    navigation.navigate('TimeParameterScreen');
  };

  return (
    <View style={styles.container}>
      <Button title="Go to Time Parameter" onPress={navigateToTimeParameter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;

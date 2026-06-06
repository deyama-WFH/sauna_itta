import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditLog'>;

export const EditLogScreen = ({ route }: Props) => (
  <View style={styles.container}>
    <Text style={styles.text}>編集中の記録ID: {route.params.logId}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  text: {
    color: '#667069',
    fontSize: 16,
    textAlign: 'center',
  },
});

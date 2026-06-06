import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LogDetail'>;

export const LogDetailScreen = ({ navigation, route }: Props) => (
  <View style={styles.container}>
    <Text style={styles.text}>記録ID: {route.params.logId}</Text>
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        navigation.navigate('EditLog', { logId: route.params.logId })
      }
      style={styles.button}
    >
      <Text style={styles.buttonText}>編集する</Text>
    </Pressable>
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
  button: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#c96f45',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 24,
    padding: 16,
  },
  buttonText: {
    color: '#c96f45',
    fontSize: 16,
    fontWeight: '700',
  },
});

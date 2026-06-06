import { StyleSheet, Text, View } from 'react-native';

export const CreateLogScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>記録フォームを準備中です。</Text>
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

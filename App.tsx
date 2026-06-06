import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import type { RootStackParamList } from './src/navigation/types';
import { CreateLogScreen } from './src/screens/CreateLogScreen';
import { EditLogScreen } from './src/screens/EditLogScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LogDetailScreen } from './src/screens/LogDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: '#f7f4ee' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f7f4ee' },
          headerTintColor: '#2f3a34',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateLog"
          component={CreateLogScreen}
          options={{ title: '今日のサウナ' }}
        />
        <Stack.Screen
          name="LogDetail"
          component={LogDetailScreen}
          options={{ title: 'サウナ記録' }}
        />
        <Stack.Screen
          name="EditLog"
          component={EditLogScreen}
          options={{ title: '記録を編集' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

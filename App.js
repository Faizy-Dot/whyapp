import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, RegisterScreen } from './src/screens';
import { Provider, useSelector } from 'react-redux';
import store from './src/redux/store';
import ChatingScreen from './src/screens/chating/ChatingScreen';
import Toast from 'react-native-toast-message';
import AppDrawer from "./src/screens/appTab/AppDrawer"


const Stack = createNativeStackNavigator();


function RootNavigator() {
  const user = useSelector(state => state.login.user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="AppTabs" component={AppDrawer} />
          <Stack.Screen name='Chating' component={ChatingScreen} />
        </>
      ) : (
        // Otherwise show Login/Register flow
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
        <Toast />
      </NavigationContainer>
    </Provider>
  );
}

export default App;

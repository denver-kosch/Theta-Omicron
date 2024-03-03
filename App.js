import { Provider } from 'react-redux';
import { store } from './storeStuff/store.js';
import { ActivityIndicator } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SplashScreen} from './portalPages/splashScreen.js';
import { LoginScreen } from './portalPages/loginScreen.js';

const persistor= persistStore(store);
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store ={store}>
      <PersistGate loading={<ActivityIndicator/>} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={SplashScreen} options={{title: 'Splash', headerShown: false}}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{title: "Log In"}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>  
  );
}
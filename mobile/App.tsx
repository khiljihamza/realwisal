import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';
import PushNotification from 'react-native-push-notification';
import NetInfo from '@react-native-community/netinfo';

import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { LoadingScreen } from './src/components/LoadingScreen';
import { OfflineNotice } from './src/components/OfflineNotice';
import { useAppDispatch } from './src/hooks/redux';
import { setNetworkStatus } from './src/store/slices/appSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize app
    const init = async () => {
      // Configure push notifications
      configurePushNotifications();
      
      // Setup network listener
      const unsubscribe = NetInfo.addEventListener(state => {
        dispatch(setNetworkStatus({
          isConnected: state.isConnected ?? false,
          isInternetReachable: state.isInternetReachable ?? false,
          type: state.type,
        }));
      });

      // Hide splash screen
      await BootSplash.hide({ fade: true });

      return unsubscribe;
    };

    init();
  }, [dispatch]);

  const configurePushNotifications = () => {
    PushNotification.configure({
      onRegister: function(token) {
        console.log('TOKEN:', token);
        // Send token to backend
      },

      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
        
        // Handle notification tap
        if (notification.userInteraction) {
          // Navigate to relevant screen based on notification data
          handleNotificationTap(notification);
        }
      },

      onRegistrationError: function(err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channels for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'orders',
          channelName: 'Order Updates',
          channelDescription: 'Notifications about your orders',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        () => {}
      );

      PushNotification.createChannel(
        {
          channelId: 'promotions',
          channelName: 'Promotions',
          channelDescription: 'Special offers and promotions',
          playSound: true,
          soundName: 'default',
          importance: 3,
          vibrate: false,
        },
        () => {}
      );
    }
  };

  const handleNotificationTap = (notification: any) => {
    const { data } = notification;
    
    switch (data?.type) {
      case 'order_update':
        // Navigate to order details
        break;
      case 'flash_sale':
        // Navigate to flash sale
        break;
      case 'loyalty_points':
        // Navigate to loyalty program
        break;
      default:
        // Navigate to home
        break;
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent
            />
            <AppNavigator />
            <OfflineNotice />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

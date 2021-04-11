import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// How the notifications should be handled is the app is running by the operating system
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    // Only for iOS
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then(statusObj => {
        if (statusObj.status !== 'granted') {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      })
      .then(statusObj => {
        if (statusObj.status !== 'granted') {
          throw new Error('Permission not granted!');
        }
      })
      // Sign the app installation up with official push notification servers (Expo servers) in order to receive push notifications.
      // We will get an ID (token) that we will use to push notifications to this app installation on this device.
      // In order to work, you have to be signed-up in Expo
      .then(() => {
        return Notifications.getExpoPushTokenAsync();
      })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
        return null;
      });
  }, []);

  useEffect(() => {
    // The app is close. The user taps on a notification
    // This subscription allow to unsubscribe too
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log(response);
      }
    );

    // The app is open and running!!
    // This subscription allow to unsubscribe too
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log(notification);
      }
    );

    // Avoiding memory leaks
    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  const triggerNotificationHandler = () => {
    // Local Notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'My first local notification',
        body: 'This is the first local notification we are sending!',
        // My own metadata in the notification
        data: {
          mySpecialData: 'Some Text',
        },
      },
      trigger: {
        seconds: 10,
      },
    });

    // Send a notification totally outside the app
  };

  return (
    <View style={styles.container}>
      <Button
        title="Trigger Notification"
        onPress={triggerNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

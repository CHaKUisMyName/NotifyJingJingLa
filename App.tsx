/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

import {StyleSheet, Text, View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {Alert, PermissionsAndroid, Platform} from 'react-native';

// ขออนุญาต Notification (Android 13+)
async function requestUserPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Permission Denied', 'You need to allow notifications');
    }
  }
}

// รับ FCM Token
async function getToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
}

// ตั้งค่า Background & Killed State Handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
  });
});

function App(): React.JSX.Element {
  useEffect(() => {
    requestUserPermission();
    getToken();

    // รับ Message ตอนแอปกำลังทำงาน
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
      });
    });

    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.textHead}>🟢 CHaKU App</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    height: 60,
  },
  textHead: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default App;

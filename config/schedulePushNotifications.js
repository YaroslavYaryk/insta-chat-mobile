import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

async function schedulePushNotification(title, body, data) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${title} 📬`,
      body: body,
      data: { data: data },
    },
    trigger: { seconds: 1 },
  });
}

export default schedulePushNotification;

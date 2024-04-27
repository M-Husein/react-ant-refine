import { NotificationProvider } from "@refinedev/core";
import { App, notification as staticNotification } from "antd";
import { UndoableNotification } from "@/components/UndoableNotification";

export const notificationProvider: NotificationProvider = {
  open: ({
    key,
    message,
    description,
    type,
    cancelMutation,
    undoableTimeout,
    // CUSTOM
    duration = 4.5,
    placement = "bottomLeft",
    btn,
    closeIcon,
    onClose,
  }: any) => {
    // console.log('notif message: ', message)
    // console.log('notif description: ', description)
    // console.log('notif type: ', type)
    // console.log('notif cancelMutation: ', cancelMutation)

    // Don't show notification if request abort / cancel
    // error.name === 'AbortError' || error.message === 'canceled'
    if (description === 'AbortError' || description === 'canceled') { //  && type === 'error'
      return;
    }
    
    if (type === "progress") {
      staticNotification.open({
        key,
        description: (
          <UndoableNotification
            notificationKey={key}
            message={message}
            cancelMutation={() => {
              cancelMutation?.();
              staticNotification.destroy(key ?? "");
            }}
            undoableTimeout={undoableTimeout}
          />
        ),
        message: null,
        duration: 0,
        placement,
        closeIcon: <></>,
      });
    } 
    else {
      staticNotification.open({
        key,
        /** @DEV : Find other solution */
        description: typeof message === 'string' ? message.split('&#x2F;')[0].replaceAll('-', ' ') : message,
        message: description ?? null,
        type,
        /** @CUSTOM */
        duration,
        placement,
        btn,
        closeIcon,
        onClose,
      });
    }
  },
  close: (key: any) => staticNotification.destroy(key),
};

export const useNotificationProvider = (): NotificationProvider => {
  const { notification: notificationFromContext } = App.useApp();
  const notification = "open" in notificationFromContext ? notificationFromContext : staticNotification;

  const notificationProvider: NotificationProvider = {
    open: ({
      key,
      message,
      description,
      type,
      cancelMutation,
      undoableTimeout,
      // CUSTOM
      duration = 4.5,
      placement = "bottomLeft",
      btn,
      closeIcon,
      onClose,
    }: any) => {
      // Don't show notification if request abort / cancel
      // error.name === 'AbortError' || error.message === 'canceled'
      if (description === 'AbortError' || description === 'canceled') { //  && type === 'error'
        return;
      }
      
      if (type === "progress") {
        notification.open({
          key,
          description: (
            <UndoableNotification
              notificationKey={key}
              message={message}
              cancelMutation={() => {
                cancelMutation?.();
                notification.destroy(key ?? "");
              }}
              undoableTimeout={undoableTimeout}
            />
          ),
          message: null,
          duration: 0,
          placement,
          closeIcon: <></>,
        });
      }
      else {
        notification.open({
          key,
          // description: message,
          /** @DEV : Find other solution */
          description: typeof message === 'string' ? message.split('&#x2F;')[0].replaceAll('-', ' ') : message,
          message: description ?? null,
          type,
          /** @CUSTOM */
          duration,
          placement,
          btn,
          closeIcon,
          onClose,
        });
      }
    },
    close: (key: any) => notification.destroy(key),
  };

  return notificationProvider;
}

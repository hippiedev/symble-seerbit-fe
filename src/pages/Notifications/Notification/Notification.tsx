import styles from './Notification.module.scss';
import { Notification } from '../../../constants/types';
import Button from '../../../components/UI/atoms/Button/Button';

function NotificationItem({
  isAuthUser = false,
  notificationData,
  hasBeenRead,
}: {
  isAuthUser?: boolean;
  notificationData: Notification;
  hasBeenRead: boolean;
}) {
  let message;
  switch (notificationData.type) {
    case 'event-live':
      message = (
        <div
          style={{ opacity: hasBeenRead ? 0.5 : 1 }}
          className={styles.Container}
        >
          <p>{notificationData.message}</p>
          <div className={styles.ButtonsWrap}>
            <Button
              buttonStyles={{
                padding: '10px 15px',
                width: 'fit-content',
                height: 'fit-content',
              }}
              variant="outlined"
            >
              Join now
            </Button>
            <Button
              buttonStyles={{
                padding: '10px 15px',
                flex: 'none',
                width: 'fit-content',
                height: 'fit-content',
                border: '1px solid #F18902',
                color: '#F18902',
              }}
              variant="outlined"
            >
              View event details
            </Button>
          </div>
        </div>
      );
      break;
    case 'scheduled-event':
      message = (
        <div
          style={{ opacity: hasBeenRead ? 0.5 : 1 }}
          className={styles.Container}
        >
          <p>{notificationData.message}</p>
          <div className={styles.ButtonsWrap}>
            <Button disabled={hasBeenRead} variant="outlined">
              Subscribe
            </Button>
            <Button disabled={hasBeenRead} variant="outlined">
              View event details
            </Button>
          </div>
        </div>
      );
      break;
    default:
      message = (
        <div
          style={{ opacity: hasBeenRead ? 0.5 : 1 }}
          className={styles.Container}
        >
          <p>{notificationData.message}</p>
        </div>
      );
  }
  console.log(isAuthUser);
  return <div className={styles.Notification}>{message}</div>;
}

export default NotificationItem;

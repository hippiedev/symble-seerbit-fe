// import Pusher from 'pusher-js';
import { useEffect } from 'react';
import styles from './Notifications.module.scss';
import notFound from '../../assets/images/not found.svg';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import { useGetNotifcationsQuery } from '../../redux/feature/user/userApiSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import NotificationItem from './Notification/Notification';
import { handleGetNotifications } from '../../redux/feature/user/userSlice';
import Spinner from '../../components/UI/atoms/Spinner/Spinner';

function Notifications() {
  // const [notificationData, setNotificationData]: any = useState();
  // const pusher = new Pusher('14396d60e466962a3fbd', {
  //   cluster: 'eu',
  // });
  const readNotifications = useAppSelector(
    (state: RootState) => state.user.readNotifications,
  );
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state: RootState) => state.user.user?.id);
  const {
    data: notificationData,
    error,
    isError,
    isSuccess,
    isLoading,
  } = useGetNotifcationsQuery(`${userId}`);
  console.log(notificationData, error);
  console.log(isSuccess, isError);

  const UserNotifications = notificationData?.result
    ? [...notificationData.result].reverse()
    : [];

  useEffect(() => {
    if (notificationData?.result && isSuccess) {
      const notificationIds = notificationData?.result.map(
        (notification) => notification.id,
      );
      dispatch(handleGetNotifications(notificationIds));
    }
  }, [dispatch, isSuccess, notificationData]);

  return (
    <FeatureScreen>
      <main className={styles.Notifications}>
        <header>
          <h1>Notifications</h1>
        </header>
        {isLoading ? (
          <div className={styles.LoadingWrap}>
            {' '}
            <Spinner />{' '}
          </div>
        ) : notificationData?.result.length === 0 ||
          !notificationData ||
          isError ? (
          <section>
            <div className={styles.notFoundImg}>
              <img src={notFound} alt="" />
              <p>You have no new general notifications.</p>
            </div>
          </section>
        ) : (
          <div className={styles.NotificationsWrap}>
            {UserNotifications.map((notification) => {
              const existingNotification = readNotifications?.find(
                (id) => id === notification.id,
              );
              return (
                <NotificationItem
                  key={notification?.id}
                  notificationData={notification}
                  hasBeenRead={!!existingNotification}
                />
              );
            })}
          </div>
        )}
      </main>
    </FeatureScreen>
  );
}

export default Notifications;

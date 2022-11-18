import { nanoid } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';
import moment from 'moment';
import styles from './UserEventsList.module.scss';
import userEventImage from '../../../assets/images/userEventImage.jpg';
// import { ReactComponent as Bookmark } from '../../../assets/icons/bookmark.svg';
import { useAppSelector } from '../../../redux/hooks';
import { Event } from '../../../constants/types';

type Props = {
  isLoading?: boolean;
  data?: Event[];
  eventOwner?: string;
};

function UserEvent({
  eventName,
  hostName,
  image,
  date,
}: {
  eventName: string;
  hostName: string;
  image: string;
  date: string;
}) {
  const user = useAppSelector(
    (state: import('../../../redux/store').RootState) => state.auth.user,
  );
  let nameOfHost;
  if (hostName === user?.username) {
    nameOfHost = 'You';
  } else {
    nameOfHost = hostName;
  }
  return (
    <div
      style={{
        backgroundImage:
          image !== undefined
            ? `linear-gradient(180deg, rgba(0, 0, 0, 0) 62.96%, rgba(0, 0, 0, 0.4) 76.67%), url(${image})`
            : `url(${userEventImage})`,
      }}
      className={styles.UserEvent}
    >
      <div className={styles.OverflowInfo}>
        <span>
          {moment(date, 'YYYY-MM-DDTHH:mm:ss.sssZ').format('DD-MM-YY, ha')}
        </span>
      </div>
      <div className={styles.Info}>
        <h3 id={styles.Name}>{nameOfHost}</h3>
        <div className={styles.EventDetails}>
          <h2 id={styles.EventName}>{eventName}</h2>
        </div>
      </div>
    </div>
  );
}

function UserEventsList({ isLoading, data, eventOwner = 'You' }: Props) {
  return (
    <div className={styles.UserEventsList}>
      {isLoading
        ? 'loading'
        : data?.map((event) => (
            <Link key={nanoid()} to={`/event/${event.event_code}`}>
              <UserEvent
                date={event.start_date}
                eventName={event.name}
                image={event.image}
                hostName={eventOwner}
              />
            </Link>
          ))}
    </div>
  );
}

export default UserEventsList;

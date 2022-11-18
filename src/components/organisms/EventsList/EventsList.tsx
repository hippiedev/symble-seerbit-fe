import { Skeleton } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';
import styles from './EventsList.module.scss';
import { ReactComponent as RightArrow } from '../../../assets/icons/rightArrow.svg';
import { ReactComponent as Eye } from '../../../assets/icons/liveEye.svg';
// import { ReactComponent as Bookmark } from '../../../assets/icons/bookmark.svg';
import eventImage from '../../../assets/images/EventsImage.jpg';
import { Event } from '../../../constants/types';

type Props = {
  title?: string;
  data?: Event[];
  loading?: boolean;
};

export function EventsListItem({
  hostName,
  eventName,
  tags,
  image,
  status,
  participantCount,
}: {
  hostName?: string;
  eventName?: string;
  tags?: string[];
  image: string | undefined;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  participantCount: number;
}) {
  return (
    <div className={styles.ListItem}>
      <div
        style={{
          backgroundImage:
            image !== undefined
              ? `linear-gradient(180deg, rgba(0, 0, 0, 0) 62.96%, rgba(0, 0, 0, 0.4) 76.67%), url(${image})`
              : `url(${eventImage})`,
        }}
        className={styles.Media}
      >
        <div className={styles.OverflowInfo}>
          {status.toLowerCase() === 'active' ? (
            <span>
              Live | <Eye /> {participantCount}
            </span>
          ) : null}
        </div>
        <div className={styles.Info}>
          <h3 id={styles.Name}>{hostName}</h3>
          <div className={styles.EventDetails}>
            <h2 id={styles.EventName}>{eventName}</h2>
          </div>
        </div>
      </div>
      <div className={styles.TagsWrap}>
        {tags?.map((tag) => (
          <span key={nanoid()}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export function ItemsWrapper({ loading, data }: Props) {
  return (
    <div className={styles.ItemWrapper}>
      {loading ? (
        <>
          <Skeleton variant="rectangular" width={190} height={270} />
          <Skeleton variant="rectangular" width={190} height={270} />
        </>
      ) : (
        data?.map((event) => (
          <Link key={nanoid()} to={`/event/${event?.event_code}`}>
            <EventsListItem
              hostName={event?.owner?.username}
              eventName={event.name}
              tags={event.tags}
              image={event.image === null ? eventImage : event.image}
              status={event.status}
              participantCount={event.participantCount}
            />
          </Link>
        ))
      )}
    </div>
  );
}

export function SearchEventWrapper({ loading, data }: Props) {
  return (
    <div className={styles.SearchItemWrapper}>
      {loading ? (
        <>
          <Skeleton variant="rectangular" width={190} height={270} />
          <Skeleton variant="rectangular" width={190} height={270} />
        </>
      ) : (
        data?.map((event) => (
          <Link key={nanoid()} to={`/event/${event?.event_code}`}>
            <EventsListItem
              hostName={event?.owner?.username}
              eventName={event.name}
              tags={event.tags}
              image={event.image}
              status={event.status}
              participantCount={event.participantCount}
            />
          </Link>
        ))
      )}
    </div>
  );
}

function EventsList({ title, data, loading }: Props) {
  return (
    <div className={styles.EventsList}>
      <div className={styles.ListHeader}>
        <h3>{title}</h3>
        <RightArrow />
      </div>
      <div className={styles.EventsWrapper}>
        {data?.length === 0 ? (
          <p className={styles.EmptyEventsMessage}>
            No events to show here yet
          </p>
        ) : (
          <ItemsWrapper data={data} loading={loading} />
        )}
      </div>
    </div>
  );
}

export default EventsList;

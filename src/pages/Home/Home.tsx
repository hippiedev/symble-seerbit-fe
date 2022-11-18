import { useSearchParams } from 'react-router-dom';
import Header from '../../components/organisms/Header/Header';
import styles from './Home.module.scss';
import EventsList from '../../components/organisms/EventsList/EventsList';
import { useGetEventsQuery } from '../../redux/feature/events/eventsApiSlice';
import Popup from '../../components/UI/molecules/Popup/Popup';
import Button from '../../components/UI/atoms/Button/Button';
import { setShowCreateEventsDrawer } from '../../redux/feature/events/eventsSlice';
import { useAppDispatch } from '../../redux/hooks';

function Home() {
  const [params] = useSearchParams();
  const categoryParam = params.get('category');
  console.log(categoryParam);
  const dispatch = useAppDispatch();
  const {
    data: events,
    isLoading,
    isSuccess,
    error,
    isError,
    isFetching,
  } = useGetEventsQuery(undefined, {
    refetchOnReconnect: true,
  });
  const filteredEvents = categoryParam
    ? events?.data.filter((event) => event.category === categoryParam)
    : events?.data;
  const liveEventsList = filteredEvents?.filter(
    (event) => event.status.toLowerCase() === 'active',
  );
  const upcomingEventsList = filteredEvents?.filter(
    (event) => event.status.toLowerCase() === 'pending',
  );
  console.log(filteredEvents);
  console.log(events, `loading${isLoading}`, `success${isSuccess}`, error);
  return (
    <>
      <Popup
        show={isError}
        variant={isError ? 'error' : undefined}
        message={
          isError
            ? (
                error as {
                  status: number;
                  data: { code: number; message: string };
                }
              ).data?.message ||
              (
                error as {
                  status: number;
                  data: string;
                }
              ).data
            : undefined
        }
      />
      <div className={styles.Home}>
        <Header />
        <div className={styles.Wrapper}>
          {filteredEvents?.length !== 0 ? (
            <>
              <p className={styles.ContentDescription}>
                Based on your preferences
              </p>
              <div className={styles.EventsWrapper}>
                <EventsList
                  loading={isLoading || isFetching}
                  data={liveEventsList}
                  title="Live Events"
                />
                <EventsList
                  loading={isLoading || isFetching}
                  data={upcomingEventsList}
                  title="Upcoming Events"
                />
              </div>
            </>
          ) : (
            <div className={styles.NoEvent}>
              <p>
                Oops....No events available for this category. Be the first to
                create an event here.
              </p>
              <Button clicked={() => dispatch(setShowCreateEventsDrawer())}>
                Create event
              </Button>
            </div>
          )}
        </div>
        {/* {filteredEvents?.length !== 0 ? (
          <div onClick={() => setShow(true)} className={styles.AddIcon}>
            <AddIcon />
          </div>
        ) : null} */}
      </div>
    </>
  );
}

export default Home;

import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import moment from 'moment';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import styles from './PublicEvent.module.scss';
import eventImage from '../../assets/images/ActiveEventImage.jpg';
import { ReactComponent as Forward } from '../../assets/icons/forwardIcon.svg';
import Button from '../../components/UI/atoms/Button/Button';
import {
  useEventRoomInteractionMutation,
  useGetPublicEventQuery,
  useSubscribeToEventMutation,
} from '../../redux/feature/events/eventsApiSlice';
import Spinner from '../../components/UI/atoms/Spinner/Spinner';
import Popup from '../../components/UI/molecules/Popup/Popup';
import UpComingEvent from '../UpcomingEvent/UpComingEvent';
import { User } from '../../constants/types';
import EventProducts from '../../components/organisms/EventProducts/EventProducts';
import ActionModal from '../../components/UI/molecules/ActionModal/ActionModal';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  handleJoinEvent,
  handleSubscribedEvents,
} from '../../redux/feature/events/eventsSlice';
import { handleShowEnterPinDrawer } from '../../redux/feature/user/userSlice';
import { RootState } from '../../redux/store';

function PublicEvent() {
  const params = useParams();
  const {
    data: event,
    isLoading,
    isSuccess,
    error,
    isError,
    refetch,
  } = useGetPublicEventQuery(`${params.eventCode}`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useAppDispatch();
  const message = useAppSelector(
    (state: import('../../redux/store').RootState) => state.events.message,
  );
  const userSubscribedEvents = useAppSelector(
    (state: RootState) => state.events.subscribedEvents,
  );
  const user = useAppSelector(
    (state: import('../../redux/store').RootState) => state.user.user,
  );
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isSubscribedToEvent, setIsSubscribedToEvent] =
    useState<boolean>(false);
  const [subscribedEvents, setSubscribedEvents] = useState<string[] | []>([]);
  const [
    joinEventRoom,
    {
      isSuccess: onJoinSuccess,
      isLoading: loading,
      isError: onJoinError,
      error: joinError,
    },
  ] = useEventRoomInteractionMutation();
  const [
    subscribeToEvent,
    {
      isLoading: subscribeLoading,
      isSuccess: subscribeSuccess,
      isError: hasSubscribeError,
      error: subscribeError,
    },
  ] = useSubscribeToEventMutation();
  const handleSubscribeToEvent = async () => {
    console.log('click');
    try {
      const response = await subscribeToEvent(`${event?.id}`).unwrap();
      dispatch(handleJoinEvent(response));
      dispatch(handleSubscribedEvents(response.data.subscribed_events));
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...user,
          subscribed_events: response.data.subscribed_events,
        }),
      );
      setSubscribedEvents(response.data.subscribed_events);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const existingSubscribedEvent = subscribedEvents.find(
      (subscribedEvent) => subscribedEvent === event?.id,
    );
    console.log(existingSubscribedEvent, subscribedEvents);
    if (existingSubscribedEvent && subscribeSuccess) {
      console.log('wtf bro');
      setIsSubscribedToEvent(true);
    } else if (!existingSubscribedEvent) {
      setIsSubscribedToEvent(false);
    }
  }, [subscribeSuccess, subscribedEvents]);
  useEffect(() => {
    const isExistingEvent = event?.subscribers.find(
      (subscriberId) => user?.id === subscriberId,
    );
    console.log(isExistingEvent);
    if (isExistingEvent) {
      setIsSubscribedToEvent(true);
    }
  }, [event]);
  let isParticipant;
  const joinEventHandler = async () => {
    try {
      const res = await joinEventRoom({
        action: 'JOIN',
        event_code: `${event?.event_code || ''}`,
      }).unwrap();
      console.log(res);
      dispatch(handleJoinEvent(res));
      if (event?.status.toLowerCase() === 'active') {
        navigate(`/event/live/${event?.event_code}`);
      } else if (event?.status.toLowerCase() === 'pending') {
        await handleSubscribeToEvent();
        refetch();
      }
      isParticipant = true;
    } catch (e) {
      console.log(e);
    }
  };
  const [isAuthUserEvent, setIsAuthUserEvent] = useState<boolean>(false);
  console.log(isAuthUserEvent);
  console.log(event);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useLayoutEffect(() => {
    if (user && event) {
      const existingUserEvent = (user as User).events.find(
        (userEvent) => userEvent.id === event.id,
      );
      console.log(existingUserEvent);
      console.log(event?.owner?.id === (user as User).id);
      if (existingUserEvent || event?.owner?.id === (user as User).id) {
        setIsAuthUserEvent(true);
      }
    }
  }, [event, isAuthUserEvent, user]);

  if (event?.participants) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < event?.participants?.length; i++) {
      if (event?.participants[i]?.user_id?.id === user?.id) {
        isParticipant = true;
      }
    }
  }
  useEffect(() => {
    const existingSubscribedEvent = userSubscribedEvents?.find(
      (subscribedEvent) => subscribedEvent === event?.id,
    );
    if (existingSubscribedEvent) {
      setIsSubscribedToEvent(true);
    } else if (!existingSubscribedEvent) {
      setIsSubscribedToEvent(false);
    }
  }, []);
  console.log(isParticipant, isSubscribedToEvent);
  let eventButtonCTA = (
    <Button
      disabled={loading || subscribeLoading}
      clicked={handleSubscribeToEvent}
      buttonStyles={{ marginTop: '58px', marginBottom: '50px' }}
    >
      {isSubscribedToEvent ? 'Unsubscribe' : 'Subscribe'}
    </Button>
  );

  if (
    event?.class.toLowerCase() === 'free' &&
    event?.status.toLowerCase() === 'active'
  ) {
    eventButtonCTA = (
      <Button
        disabled={loading}
        clicked={joinEventHandler}
        buttonStyles={{ marginTop: '58px', marginBottom: '50px' }}
      >
        Join now for free
      </Button>
    );
  } else if (
    event?.class.toLowerCase() === 'free' &&
    event?.status.toLowerCase() === 'pending'
  ) {
    eventButtonCTA = (
      <Button
        disabled={loading || subscribeLoading}
        clicked={handleSubscribeToEvent}
        buttonStyles={{ marginTop: '58px', marginBottom: '50px' }}
      >
        {isSubscribedToEvent ? 'Unsubscribe' : 'Subscribe'}
      </Button>
    );
  } else if (
    event?.class.toLowerCase() === 'free' &&
    event?.status.toLowerCase() === 'completed'
  ) {
    eventButtonCTA = (
      <Button
        disabled={loading}
        buttonStyles={{ marginTop: '58px', marginBottom: '50px' }}
      >
        Watch recording for free
      </Button>
    );
  } else if (
    event?.class.toLowerCase() === 'paid' &&
    event?.status.toLowerCase() === 'active'
  ) {
    if (isParticipant) {
      eventButtonCTA = (
        <Button
          disabled={loading}
          clicked={joinEventHandler}
          buttonStyles={{ marginTop: '58px', marginBottom: '50px' }}
        >
          Join event
        </Button>
      );
    } else {
      eventButtonCTA = (
        <Button
          disabled={loading}
          clicked={() => setShowPrompt(true)}
          buttonStyles={{ marginTop: '58px', marginBottom: '50px' }}
        >
          Pay and join event
        </Button>
      );
    }
  } else if (
    event?.class.toLowerCase() === 'paid' &&
    event?.status.toLowerCase() === 'pending'
  ) {
    eventButtonCTA = (
      <Button
        clicked={() => {
          if (!isSubscribedToEvent && !isParticipant) {
            setShowPrompt(true);
          } else {
            handleSubscribeToEvent();
          }
        }}
        disabled={loading || subscribeLoading}
        buttonStyles={{ marginTop: '58px', marginBottom: '50px' }}
      >
        {isSubscribedToEvent && isParticipant
          ? 'Unsubscribe'
          : isParticipant && !isSubscribedToEvent
          ? 'Subscribe'
          : 'Pay and subscribe'}
      </Button>
    );
  }

  return isLoading ? (
    <div className={styles.LoadingWrap}>
      <Spinner />
    </div>
  ) : isSuccess ? (
    isAuthUserEvent ? (
      <UpComingEvent event={event} />
    ) : (
      <>
        <ActionModal
          showActionModal={showPrompt}
          closeModal={() => setShowPrompt(false)}
          message={
            <p>
              Are you sure you want to pay{' '}
              <span style={{ fontWeight: '700' }}>
                &#8358;{event.access_fee || 0}
              </span>{' '}
              to attend this event?{' '}
              <span style={{ fontWeight: '700' }}>
                &#8358;{event.access_fee || 0}
              </span>{' '}
              will be debited from your wallet.
            </p>
          }
          acceptFn={() => joinEventHandler()}
        />
        <FeatureScreen>
          <div className={styles.PublicEvent}>
            <div className={styles.Wrapper}>
              <div
                className={styles.EventImage}
                style={{
                  backgroundImage: event?.image
                    ? `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${event?.image})`
                    : `url(${eventImage})`,
                }}
              >
                <div className={styles.OverflowInfo}>
                  {/* <span>Live | <Eye/> 5.3k</span> */}
                  <span>
                    {moment(
                      event?.start_date,
                      'YYYY-MM-DDTHH:mm:ss.sssZ',
                    ).format('DD-MM-YY, ha')}
                  </span>
                </div>
                <div className={styles.Info}>
                  <h2>{event?.name}</h2>
                  <span>&#8226;</span>
                  {event?.class?.toLowerCase() === 'free' ? (
                    <span> Free</span>
                  ) : (
                    <span>{event?.access_fee}</span>
                  )}
                </div>
              </div>
              <div className={styles.SubWrap}>
                <div className={styles.TagsWrap}>
                  {event?.tags.map((tag) => (
                    <span key={nanoid()}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.UserDetails}>
              <div className={styles.Wrapper}>
                <img
                  onClick={() => navigate(`/${event?.owner?.username}`)}
                  id={styles.avatar}
                  src={event?.owner?.avatar}
                  alt=""
                />
                <span onClick={() => navigate(`/${event?.owner?.username}`)}>
                  <h2>{event?.owner?.username}</h2>
                  <Forward />
                </span>
              </div>
              <p id={styles.bio}>"{event?.owner?.bio}"</p>
            </div>
            <div className={styles.EventInfoWrap}>
              <div className={styles.InfoItem}>
                <h4>Event Description</h4>
                <p>{event?.description}</p>
              </div>
              {event?.class.toLowerCase() === 'free' ? null : (
                <div className={styles.InfoItem}>
                  <h4>Event access fee</h4>
                  <p>&#8358;{event?.access_fee.toLocaleString()}</p>
                </div>
              )}
              <div className={styles.InfoItem}>
                <h4>Time and date</h4>
                <p>
                  {moment(event?.start_date, 'YYYY-MM-DDTHH:mm:ss.sssZ').format(
                    'h:mm a, Do MMMM, YYYY.',
                  )}
                </p>
              </div>
            </div>

            {eventButtonCTA}

            {event?.products?.length !== 0 ? (
              <EventProducts products={event?.products} />
            ) : null}
          </div>
        </FeatureScreen>
        <Popup
          show={onJoinError || onJoinSuccess || hasSubscribeError}
          variant={
            onJoinSuccess
              ? 'success'
              : onJoinError || hasSubscribeError
              ? 'error'
              : undefined
          }
          message={
            onJoinSuccess
              ? message || undefined
              : onJoinError || hasSubscribeError
              ? (
                  joinError as {
                    status: number;
                    data: { code: number; message: string };
                  }
                )?.data?.message ||
                (
                  joinError as {
                    status: number;
                    data: string;
                  }
                )?.data ||
                (
                  subscribeError as {
                    status: number;
                    data: { code: number; message: string };
                  }
                )?.data?.message ||
                (
                  subscribeError as {
                    status: number;
                    data: string;
                  }
                )?.data
              : message || undefined
          }
        />
      </>
    )
  ) : (
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
  );
}

export default PublicEvent;

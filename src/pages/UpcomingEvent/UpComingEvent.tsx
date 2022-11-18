import { useLayoutEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import styles from './UpcomingEvent.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
// import { ReactComponent as PencilIcon } from '../../assets/icons/pencilIcon.svg';
import activeEventImage from '../../assets/images/ActiveEventImage.jpg';
import Button from '../../components/UI/atoms/Button/Button';
// import Drawer from '../../components/UI/molecules/Drawer/Drawer';
// import { ReactComponent as ShareIcon } from '../../assets/icons/shareIcon.svg';
import {
  useCancelEventMutation,
  useStartEventMutation,
} from '../../redux/feature/events/eventsApiSlice';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import Popup from '../../components/UI/molecules/Popup/Popup';
import { Event } from '../../constants/types';
import EventProducts from '../../components/organisms/EventProducts/EventProducts';
import {
  handleStartEvent,
  setActiveEventData,
} from '../../redux/feature/events/eventsSlice';

function UpComingEvent({ event }: { event?: Event }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [
    startEvent,
    {
      isLoading: startEventLoading,
      isSuccess: startEventSuccess,
      isError: hasStartEventError,
      error: startEventError,
    },
  ] = useStartEventMutation();
  const { message } = useAppSelector(
    (state: import('../../redux/store').RootState) => state.events,
  );
  const eventData = event;
  console.log(eventData);
  // const [openQRDrawer, setOpenQRDrawer] = useState(false);
  const [cancelEvent, { isLoading, isSuccess, error, isError }] =
    useCancelEventMutation();

  const cancelEventHandler = async () => {
    try {
      const res = await cancelEvent(`${event?.id}`).unwrap();
      dispatch(setActiveEventData(res));
      navigate(-1);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goLiveHandler = async (eventCode) => {
    try {
      const response = await startEvent(`${eventCode}`).unwrap();
      dispatch(handleStartEvent(response));
      console.log(response);
      navigate(`/event/live/${eventCode}`);
    } catch (e) {
      console.log(e, startEventError);
    }
  };

  return (
    <>
      <Popup
        show={isSuccess || isError || hasStartEventError || startEventSuccess}
        variant={
          isSuccess || startEventSuccess
            ? 'success'
            : isError
            ? 'error'
            : hasStartEventError
            ? 'notification'
            : undefined
        }
        message={
          isSuccess || startEventSuccess
            ? message || undefined
            : isError || hasStartEventError
            ? (
                error as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message ||
              (
                startEventError as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message
            : undefined
        }
      />
      <FeatureScreen>
        <div className={styles.UpcomingEvent}>
          <div className={styles.HeadingWrap}>
            <h2>Event details</h2>
            {event?.status.toLowerCase() !== 'completed' ? (
              <span
                style={{ color: isLoading ? 'grey' : '#D82B2B' }}
                onClick={() => cancelEventHandler()}
              >
                Cancel event
              </span>
            ) : null}
          </div>
          <p className={styles.Info}>
            You can access this in your notifications - upcoming events.
          </p>
          <div className={styles.ImageWrapper}>
            {/* <div id={styles.edit}>
              <span>Edit</span>
              <PencilIcon />{' '}
            </div> */}
            <img src={eventData?.image || activeEventImage} alt="" />
          </div>
          <div className={styles.Details}>
            <div>
              <h4>Event name:</h4> <span>{eventData?.name}</span>
            </div>
            <div>
              <h4>Event type:</h4> <span>{eventData?.type}</span>
            </div>
            {eventData?.type.toLowerCase() === 'private' ? (
              <div>
                <h4>Passcode:</h4> <span>{eventData?.event_code}</span>
              </div>
            ) : null}
            <div>
              <h4>Date and time:</h4>{' '}
              <span>
                {moment(
                  eventData?.start_date,
                  'YYYY-MM-DDTHH:mm:ss.sssZ',
                ).format('h:mm a, Do MMMM, YYYY.')}
              </span>
            </div>
            {eventData?.access_fee &&
            !(eventData?.class.toLowerCase() === 'free') ? (
              <div>
                <h4>Event fee:</h4>{' '}
                <span>
                  &#8358;
                  {eventData?.access_fee
                    ? eventData?.access_fee?.toLocaleString()
                    : 0}
                </span>
                <span>
                  {eventData?.access_fee &&
                  !(eventData?.class.toLowerCase() === 'free')
                    ? null
                    : '(this is a free event)'}
                </span>
              </div>
            ) : null}
            <div>
              <h4>Event URL:</h4> <span>{eventData?.url}</span>
            </div>
            {/* <div>
              <h4>Co-hosts:</h4> <span>hello</span>
            </div> */}
          </div>
          <div className={styles.ButtonWrap}>
            <Button
              disabled={
                eventData?.status.toLowerCase() === 'cancelled' ||
                eventData?.status.toLowerCase() === 'completed' ||
                startEventLoading
              }
              clicked={() => goLiveHandler(eventData?.event_code)}
            >
              Go live!
            </Button>
          </div>
          {eventData?.products?.length !== 0 ? (
            <EventProducts products={eventData?.products} />
          ) : null}
        </div>
      </FeatureScreen>
      {/* <Drawer show={openQRDrawer} closeDrawer={() => setOpenQRDrawer(false)}>
        <div className={styles.ViewQR}>
          <h3>Event QR Code</h3>
          <img src={eventData?.qrcode} alt="" />
          <div className={styles.Share}>
            <div>
              <ShareIcon /> <span>Share</span>
            </div>
          </div>
        </div>
      </Drawer> */}
    </>
  );
}

export default UpComingEvent;

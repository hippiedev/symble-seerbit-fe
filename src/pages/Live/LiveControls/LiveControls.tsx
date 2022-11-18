import React, { useCallback, useEffect, useState } from 'react';
import {
  DeviceType,
  selectHMSMessages,
  selectIsConnectedToRoom,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectPeerCount,
  useCustomEvent,
  useDevices,
  useHMSActions,
  useHMSStore,
} from '@100mslive/react-sdk';
import { useSwipeable } from 'react-swipeable';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './LiveControls.module.scss';
import { ReactComponent as MoneyIcon } from '../../../assets/icons/cil_money.svg';
import { ReactComponent as HeartIcon } from '../../../assets/icons/heartIcon.svg';
import { ReactComponent as ShoppingBagIcon } from '../../../assets/icons/shoppingBagIcon.svg';
import { ReactComponent as CameraSwitchIcon } from '../../../assets/icons/cameraSwitchIcon.svg';
import { ReactComponent as CameraOffIcon } from '../../../assets/icons/CameraOffIcon.svg';
import { ReactComponent as CameraOnIcon } from '../../../assets/icons/CameraOnIcon.svg';
import { ReactComponent as MicOnIcon } from '../../../assets/icons/micOnIcon.svg';
import { ReactComponent as MicOffIcon } from '../../../assets/icons/MicOffIcon.svg';
import { useAppSelector } from '../../../redux/hooks';
import Drawer from '../../../components/UI/molecules/Drawer/Drawer';
import Button from '../../../components/UI/atoms/Button/Button';
import LiveMessages from '../../../components/UI/molecules/LiveMessages/LiveMessages';
import { LiveVideoInput } from '../../../components/UI/atoms/Input/Input';
import Likes from '../../../components/UI/molecules/Likes/Likes';
import {
  useEndEventMutation,
  useSprayMoneyMutation,
} from '../../../redux/feature/events/eventsApiSlice';
import { RootState } from '../../../redux/store';
import { EventRoom } from '../../../constants/types';
import SpraySettings from '../../../components/organisms/SpraySettings/SpraySettings';
import LiveProducts from '../../../components/organisms/LiveProducts/LiveProducts';
import Spinner from '../../../components/UI/atoms/Spinner/Spinner';

function LiveControls({
  children,
  isOwner = false,
  roomData,
}: {
  children: React.ReactNode;
  isOwner: boolean;
  roomData: EventRoom | undefined;
}) {
  const user = useAppSelector(
    (state: import('../../../redux/store').RootState) => state.auth.user,
  );
  // const [messages, setMessages] = useState<
  //   { senderName: string; text: string; senderId: string }[] | []
  // >([]);
  const [likes, setLikes] = useState<string[] | []>([]);
  const allMessages = useHMSStore(selectHMSMessages);
  const { selectedDeviceIDs, updateDevice } = useDevices();
  console.log('devices', selectedDeviceIDs);
  const hmsActions = useHMSActions();
  console.log(allMessages);

  const [sprayAmounts, setSprayAmounts] = useState<number[]>([]);
  const [timesSprayed, setTimesSprayed] = useState<number>(0);
  const spraySettings = useAppSelector(
    (state: RootState) => state.events.liveSpraySettings,
  );
  const [
    sprayMoney,
    {
      isSuccess: spraySuccess,
      isError: hasSprayError,
      isLoading: sprayLoading,
    },
  ] = useSprayMoneyMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location as { state: { from: { pathname: string } } }).state?.from
      ?.pathname || '/';
  // const [message, setMessage] = useState<string>('')

  const leaveMeeting = async () => {
    // setJoined(false);
    if (spraySettings && !spraySuccess) {
      const sprayAmount = sprayAmounts.reduce(
        (total, currAmount) => total + currAmount,
        0,
      );
      try {
        const response = await sprayMoney({
          sprayAmount,
          eventCode: roomData?.event?.event_code || '',
        }).unwrap();
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }
    hmsActions.leave();
    navigate(-1);
  };
  const [endEvent, { isLoading: isEnding, isSuccess: endEventSuccess }] =
    useEndEventMutation();
  console.log(endEventSuccess);
  const endMeeting = async () => {
    // setJoined(false);

    if (!endEventSuccess) {
      try {
        const response = await endEvent(
          `${roomData?.event.event_code}`,
        ).unwrap();
        console.log(response);
        try {
          const lock = true; // set to true to disallow rejoins
          const reason = 'live has ended';
          await hmsActions.endRoom(lock, reason);
        } catch (error) {
          // Permission denied or not connected to room
          console.error(error);
        }
        navigate(from, { replace: true });
      } catch (e) {
        console.log(e);
      }
    }
  };
  console.log(spraySuccess, hasSprayError);

  useEffect(() => {
    window.onunload = () => {
      hmsActions.leave();
    };
  }, [hmsActions]);

  // const [hasEndedMessage, setHasEndedMessage] = useState<string | undefined>();
  const [showDrawer, setShowDrawer] = useState<'products' | 'spray' | null>(
    null,
  );
  const [participantMessage, setParticipantMessage] = useState<string>('');
  const [showSprayFeedback, setShowSprayFeedback] = useState<boolean>(false);
  useEffect(() => {
    if (sprayAmounts.length !== 0) {
      setShowSprayFeedback(true);
      setTimeout(() => setShowSprayFeedback(false), 1000);
    }

    console.log('sprayed', sprayAmounts);
    return () => setShowSprayFeedback(false);
  }, [sprayAmounts]);
  const handleMessage = (e) => {
    e.preventDefault();
    setParticipantMessage(e.target.value);
  };
  const handleSendMessage = () => {
    if (participantMessage.trim().length > 0) {
      hmsActions.sendBroadcastMessage(participantMessage);
      setParticipantMessage('');
    }
  };
  const onEventChange = useCallback((msg: { like: string }) => {
    console.log(msg);
    setLikes((prevLikes) => [...prevLikes, msg.like]);
  }, []);
  const { sendEvent } = useCustomEvent({
    type: 'LIKE',
    onEvent: onEventChange,
  });
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && participantMessage) {
      handleSendMessage();
    }
  };
  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (spraySettings && timesSprayed < spraySettings.numberOfSprays) {
        setSprayAmounts((prevSprays) => [
          ...prevSprays,
          spraySettings.singleSprayAmount,
        ]);
        setTimesSprayed((prevState) => prevState + 1);
      } else if (timesSprayed >= (spraySettings?.numberOfSprays || 0)) {
        console.log('nope');
      }
    },
    swipeDuration: 400,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });
  const handleShowDrawer = (arg: 'products' | 'spray') => {
    setShowDrawer(arg);
  };
  let drawerContent;
  switch (showDrawer) {
    case 'products':
      drawerContent = (
        <LiveProducts
          user={roomData?.event.owner.id}
          products={roomData?.event.products || []}
        />
      );
      break;
    case 'spray':
      drawerContent = <SpraySettings closeDrawer={() => setShowDrawer(null)} />;
      break;
    default:
      drawerContent = undefined;
  }
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const peerCount = useHMSStore(selectPeerCount);
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  useEffect(() => {
    window.onunload = () => {
      if (isOwner) {
        endMeeting();
      } else {
        leaveMeeting();
      }
    };
  }, [hmsActions, isOwner]);

  return (
    <div {...handlers}>
      {!isConnected ? (
        <div className={styles.Loading}>
          <Spinner />
        </div>
      ) : null}
      <Drawer
        show={Boolean(showDrawer)}
        closeDrawer={() => setShowDrawer(null)}
      >
        {drawerContent}
      </Drawer>
      <section className={styles.LiveHeader}>
        <div
          style={{ opacity: showSprayFeedback ? 1 : 0 }}
          className={styles.FeedbackWrap}
        >
          <div className={styles.SprayFeedback}>
            You are making it rain with {spraySettings?.singleSprayAmount}
          </div>
          <span>+ {sprayAmounts.length}</span>
        </div>
        <div className={styles.LiveHeaderDetails}>
          <div className={styles.Heading}>
            <img src={user?.avatar || ''} alt={roomData?.event.name} />
            <h1>{roomData?.event.name}</h1>
          </div>
          <div className={styles.Details}>
            <p>by {roomData?.event.owner.username}</p>
            <p>{peerCount} views</p>
          </div>
        </div>
        <div className={styles.leaveButton}>
          <div className={styles.ControlsWrapper}>
            <Button
              type="submit"
              clicked={!isOwner ? leaveMeeting : endMeeting}
              buttonStyles={{
                backgroundColor: '#D82B2B',
                height: '39px',
                borderRadius: '10px',
                padding: '10px 26.5px',
              }}
            >
              {sprayLoading && !isOwner
                ? 'Leaving...'
                : isOwner && isEnding
                ? 'Ending...'
                : isOwner
                ? 'End'
                : 'Leave'}
            </Button>
            {isOwner ? (
              <div className={styles.Controls}>
                <CameraSwitchIcon
                  onClick={() => {
                    updateDevice({
                      deviceId: selectedDeviceIDs[0],
                      deviceType: DeviceType.videoInput,
                    });
                  }}
                  id={styles.Control}
                />
                {videoEnabled ? (
                  <CameraOnIcon
                    onClick={() => hmsActions.setLocalVideoEnabled(false)}
                    id={styles.Control}
                  />
                ) : (
                  <CameraOffIcon
                    onClick={() => hmsActions.setLocalVideoEnabled(true)}
                    id={styles.Control}
                  />
                )}

                {audioEnabled ? (
                  <MicOnIcon
                    onClick={() => hmsActions.setLocalAudioEnabled(false)}
                    id={styles.Control}
                  />
                ) : (
                  <MicOffIcon
                    onClick={() => hmsActions.setLocalAudioEnabled(true)}
                    id={styles.Control}
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <section className={styles.LiveFooter}>
        <LiveMessages
          ownerId={roomData?.event.owner.id || ''}
          messages={allMessages}
        />
        <div className={styles.LiveInput}>
          <LiveVideoInput
            onChange={handleMessage}
            value={participantMessage}
            clickAdornment={handleSendMessage}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.liveActions}>
          <Likes likes={likes} />
          <div
            onClick={() => sendEvent({ like: user?.id || '' })}
            className={styles.Action}
          >
            <HeartIcon />
          </div>
          <div className={styles.Action}>
            <MoneyIcon onClick={() => handleShowDrawer('spray')} />
          </div>
          <div className={styles.Action}>
            <ShoppingBagIcon onClick={() => handleShowDrawer('products')} />
          </div>
        </div>
      </section>
      {children}
    </div>
  );
}
export default LiveControls;

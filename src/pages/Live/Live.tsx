import React, { useEffect } from 'react';
import {
  useHMSStore,
  selectPeers,
  useHMSActions,
  useVideo,
  selectPeersByRole,
} from '@100mslive/react-sdk';
import { useParams } from 'react-router-dom';
import { useGetEventRoomQuery } from '../../redux/feature/events/eventsApiSlice';
import LiveControls from './LiveControls/LiveControls';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import styles from './Live.module.scss';
import Spinner from '../../components/UI/atoms/Spinner/Spinner';

function LiveRoom() {
  const user = useAppSelector((state: RootState) => state.user.user);
  const { eventCode } = useParams();
  const hmsActions = useHMSActions();
  const peers = useHMSStore(selectPeers);
  const broadcaster = useHMSStore(selectPeersByRole('broadcaster'));
  const {
    data: roomData,
    isSuccess,
    isError,
    error,
    isLoading,
  } = useGetEventRoomQuery(`${eventCode}`);
  console.log(peers);
  console.log(isError, error);
  const startLiveShit = async () => {
    await hmsActions.join({
      userName: user?.username || '',
      authToken: `${roomData?.participantData.token}` || '',
    });
  };
  console.log(roomData?.participantData.token);
  useEffect(() => {
    if (isSuccess && roomData) {
      startLiveShit();
    }
  }, [isSuccess]);

  const { videoRef } = useVideo({
    trackId: broadcaster[0]?.videoTrack || '',
  });
  console.log(broadcaster);

  return (
    <div className={styles.Live}>
      {isLoading ? (
        <div className={styles.Loading}>
          <Spinner />
        </div>
      ) : (
        <LiveControls
          isOwner={roomData?.participantData.role === 'owner'}
          roomData={roomData}
        >
          <video
            style={{
              zIndex: 0,
              height: '100%',
              width: '100%',
              objectFit: 'cover',
            }}
            ref={videoRef || ''}
            autoPlay
            muted
            playsInline
          />
        </LiveControls>
      )}
    </div>
  );
}

export default LiveRoom;

import React, { useEffect } from 'react';
import {
  useHMSStore,
  selectPeers,
  useHMSActions,
  useVideo,
} from '@100mslive/react-sdk';
import { useParams } from 'react-router-dom';
import {
  useGetEventRoomQuery,
  useStartEventMutation,
} from '../../../redux/feature/events/eventsApiSlice';

function LiveRoom() {
  const { eventCode } = useParams();
  const hmsActions = useHMSActions();
  const peers = useHMSStore(selectPeers);
  const {
    data: roomData,
    isSuccess,
    isError,
    error,
  } = useGetEventRoomQuery(`${eventCode}`);
  const [startEvent, { isSuccess: startEventSuccess }] =
    useStartEventMutation();
  console.log('success', isSuccess, 'fail', isError, error);
  console.log(roomData);
  console.log(peers);
  const startLiveShit = async () => {
    if (roomData?.participantData.role === 'owner') {
      try {
        const response = await startEvent(`${eventCode}`).unwrap();

        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }
    await hmsActions.join({
      userName: roomData?.participantData.role || '',
      authToken: `${roomData?.participantData.token}` || '',
    });
  };
  console.log(roomData?.participantData.token);
  console.log(startEventSuccess);
  useEffect(() => {
    if (isSuccess && roomData) {
      startLiveShit();
    }
  }, [isSuccess]);

  const { videoRef } = useVideo({
    trackId:
      roomData?.participantData.role === 'owner'
        ? peers[0]?.videoTrack
        : peers[peers.length - 1]?.videoTrack || '',
  });

  return (
    <div>
      <video
        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        ref={videoRef || ''}
        autoPlay
        muted
        playsInline
      />
    </div>
  );
}

export default LiveRoom;

/* eslint-disable import/no-extraneous-dependencies */
import { HMSMessage } from '@100mslive/react-sdk';
import { nanoid } from '@reduxjs/toolkit';
import { useEffect, useRef } from 'react';
import styles from './LiveMessages.module.scss';

function LiveMessages({
  messages,
  ownerId,
}: {
  messages: HMSMessage[];
  ownerId: string;
}) {
  const messageRef = useRef<HTMLDivElement>(null);
  console.log(messageRef);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messages]);

  return messages.length !== 0 ? (
    <div ref={messageRef} className={styles.LiveMessages}>
      {messages.map((message) => {
        return (
          <div key={nanoid()} className={styles.Message}>
            <div className={styles.MessageHead}>
              <h5>{message.senderName}</h5>
              {ownerId === message.senderUserId ? <span>Host</span> : null}
            </div>
            <p id={styles.message}>{message.message}</p>
          </div>
        );
      })}
    </div>
  ) : null;
}

export default LiveMessages;

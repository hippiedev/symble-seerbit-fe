import React from 'react';
import moment from 'moment';
import styles from './WalletTransaction.module.scss';
import SendFunds from '../../../../assets/icons/SendFunds.svg';
import WithdrawRed from '../../../../assets/icons/WithdrawRed.svg';
import FundedGreen from '../../../../assets/icons/FundedGreen.svg';
import eventIcon from '../../../../assets/icons/liveTV.svg';

function WalletTransaction({
  type,
  amount,
  date,
  description,
}: {
  type: 'FUND' | 'SEND' | 'REDEEM' | 'RECEIVED' | 'EVENT';
  amount?: number;
  date?: string;
  description?: string;
}) {
  let color: string;
  let message: JSX.Element;
  let transactionIcon: JSX.Element | JSX.Element[];
  switch (type) {
    case 'SEND':
      color = '#F18902';
      message = <p>Sent</p>;
      transactionIcon = (
        <div className={styles.transactionIcon}>
          <img src={SendFunds} alt="" />{' '}
        </div>
      );
      break;
    case 'REDEEM':
      color = '#D82B2B';
      message = <p>Withdrawn</p>;
      transactionIcon = (
        <div className={styles.transactionIcon}>
          <img src={WithdrawRed} alt="" />
        </div>
      );
      break;
    case 'FUND':
      color = '#26AA6B';
      message = <p>Wallet funded</p>;
      transactionIcon = (
        <div className={styles.transactionIcon}>
          <img src={FundedGreen} alt="" />{' '}
        </div>
      );
      break;
    case 'RECEIVED':
      color = '#26AA6B';
      message = <p>Received</p>;
      transactionIcon = (
        <div className={styles.transactionIcon}>
          <img style={{ transform: 'rotate(90deg)' }} src={SendFunds} alt="" />{' '}
        </div>
      );
      break;
    case 'EVENT':
      color = '#7546f6';
      message = <p>Event</p>;
      transactionIcon = (
        <div className={styles.transactionIcon}>
          <img src={eventIcon} alt="" />{' '}
        </div>
      );
      break;
    default:
      return null;
  }
  return (
    <div className={styles.WalletTransaction}>
      <div>{transactionIcon}</div>
      <div className={styles.walletContent}>
        <div className={styles.walletContentFlex}>
          <h6>&#8358;{amount}</h6>
          <p className={styles.contentGrey}>{description}</p>
        </div>
        <div className={styles.walletContentFlex}>
          <div
            style={{
              color,
            }}
          >
            {message}
          </div>
          <div>
            <p className={styles.contentGrey}>
              {moment(date, 'dddd, MMMM DD, YYYY h:mm A').format('DD-MM-YYYY')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletTransaction;

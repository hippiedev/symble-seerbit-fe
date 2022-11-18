import React, { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './Wallet.module.scss';
import profilePicture from '../../assets/images/profilePicture.png';
import { ReactComponent as FundWalletIcon } from '../../assets/icons/FundWallet.svg';
import { ReactComponent as SendFundsIcon } from '../../assets/icons/SendFunds.svg';
import { ReactComponent as Withdraw } from '../../assets/icons/Withdraw.svg';
import { ReactComponent as AddCard } from '../../assets/icons/AddCard.svg';
import { ReactComponent as ComingSoon } from '../../assets/icons/ComingSoon.svg';
import Drawer from '../../components/UI/molecules/Drawer/Drawer';
import { useGetUserWalletQuery } from '../../redux/feature/wallet/walletApiSplice';
import FundWallet from './FundWallet/FundWallet';
import WalletTransaction from '../../components/UI/molecules/WalletTransaction/WalletTransaction';
import SendFunds from './SendFunds/SendFunds';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import Popup from '../../components/UI/molecules/Popup/Popup';
import Button from '../../components/UI/atoms/Button/Button';
import { handleGetWallet } from '../../redux/feature/wallet/walletSplice';

function Wallet() {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const {
    data: walletData,
    error: getWalletError,
    isLoading: walletDataLoading,
    isError,
    isSuccess,
  } = useGetUserWalletQuery(undefined, {
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(handleGetWallet(walletData));
    }
  }, [dispatch, isSuccess, walletData]);
  const navigate = useNavigate();

  const walletTransactions = walletData?.transactions
    ? // eslint-disable-next-line no-unsafe-optional-chaining
      [...walletData?.transactions]?.reverse()
    : [];

  console.log(walletTransactions, getWalletError);

  const [showWalletDrawer, setShowWalletDrawer] = useState<
    'fundWallet' | 'sendFunds' | 'withdraw' | 'addCard' | null
  >(null);

  const handleShowWalletDrawer = (
    transactionType: 'fundWallet' | 'sendFunds' | 'withdraw' | 'addCard',
  ) => {
    setShowWalletDrawer(transactionType);
  };

  // if (topupSuccess) {
  //   window.open(response.data.authorization_url);
  // }

  let walletDrawerDisplay;

  switch (showWalletDrawer) {
    case 'fundWallet':
      walletDrawerDisplay = <FundWallet />;
      break;
    case 'sendFunds':
      walletDrawerDisplay = (
        <SendFunds closeDrawer={() => setShowWalletDrawer(null)} />
      );
      break;
    default:
      walletDrawerDisplay = (
        <div className={styles.ComingSoon}>
          <ComingSoon id={styles.icon} />
          <h5>Coming Soon...</h5>
        </div>
      );
  }

  return user?.is_verified ? (
    <>
      <Popup
        show={isError}
        variant={isError ? 'error' : undefined}
        message={
          isError
            ? (
                getWalletError as {
                  status: number;
                  data: { code: number; message: string };
                }
              ).data?.message ||
              (
                getWalletError as {
                  status: number;
                  data: string;
                }
              ).data
            : undefined
        }
      />
      <main className={styles.Wallet}>
        {/* header */}
        {walletDataLoading ? (
          <>
            <Skeleton variant="rounded" height={206} />
            <div
              style={{
                marginTop: '23px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}
            >
              <Skeleton variant="circular" width={41} height={41} />
              <Skeleton variant="circular" width={41} height={41} />
              <Skeleton variant="circular" width={41} height={41} />
              <Skeleton variant="circular" width={41} height={41} />
            </div>
          </>
        ) : (
          <>
            <header className={styles.WalletHeader}>
              <div className={styles.walletProfilePictureAndName}>
                <img
                  src={walletData?.user.avatar || profilePicture}
                  className={styles.profilePicture}
                  alt=""
                  referrerPolicy="no-referrer"
                />
                <p>Hi, {walletData?.user.username}!</p>
              </div>
              <div className={styles.Balance}>
                <p>Balance ({walletData?.currency})</p>
                <h1>
                  {walletData?.currency.toLowerCase() === 'ngn' ? (
                    <span>&#8358;</span>
                  ) : (
                    walletData?.currency
                  )}

                  {Number(walletData?.balance).toFixed(2)}
                </h1>
              </div>
            </header>

            <section className={styles.walletActions}>
              <div className={styles.walletAction}>
                <div
                  onClick={() => handleShowWalletDrawer('fundWallet')}
                  className={styles.actionIcon}
                >
                  <FundWalletIcon />
                </div>
                <p>Fund wallet</p>
              </div>
              <div className={styles.walletAction}>
                <div
                  onClick={() => handleShowWalletDrawer('sendFunds')}
                  className={styles.actionIcon}
                >
                  <SendFundsIcon />
                </div>
                <p>Send funds</p>
              </div>
              <div className={styles.walletAction}>
                <div
                  onClick={() => handleShowWalletDrawer('withdraw')}
                  className={styles.actionIcon}
                >
                  <Withdraw />
                </div>
                <p>Withdraw</p>
              </div>
              <div className={styles.walletAction}>
                <div
                  onClick={() => handleShowWalletDrawer('addCard')}
                  className={styles.actionIcon}
                >
                  <AddCard />
                </div>
                <p>Add a card</p>
              </div>
            </section>

            <div className={styles.Transactions}>
              <h2>Latest Transactions</h2>
              {isSuccess && walletTransactions.length === 0 ? (
                <div
                  style={{ marginTop: '74px' }}
                  className={styles.NoTransactions}
                >
                  <p>
                    You have no recent transactions. Fund your wallet to get
                    started!
                  </p>
                  <Button clicked={() => handleShowWalletDrawer('fundWallet')}>
                    Fund wallet
                  </Button>
                </div>
              ) : (
                walletTransactions.slice(0, 3).map((transaction) => {
                  return (
                    <WalletTransaction
                      key={transaction.id}
                      date={transaction.date}
                      type={
                        transaction.description.includes(user.username) &&
                        !(transaction.type === 'FUND')
                          ? 'RECEIVED'
                          : transaction.type
                      }
                      amount={transaction.amount}
                      description={
                        transaction.description.includes(user.username) &&
                        !(transaction.type === 'FUND')
                          ? `You received ${transaction.currency}${transaction.amount}`
                          : transaction.description
                      }
                    />
                  );
                })
              )}
              {walletTransactions.length > 3 ? (
                <Button
                  clicked={() => navigate('transactions')}
                  buttonStyles={{ color: '#7546f6' }}
                  variant="text"
                >
                  See all transactions
                </Button>
              ) : null}
            </div>
          </>
        )}
      </main>

      <Drawer
        show={Boolean(showWalletDrawer)}
        closeDrawer={() => setShowWalletDrawer(null)}
      >
        {walletDrawerDisplay}
      </Drawer>
    </>
  ) : (
    <div className={styles.UnverifiedMessage}>
      <p>Check your mail and verify your account to access your wallet</p>
    </div>
  );
}

export default Wallet;

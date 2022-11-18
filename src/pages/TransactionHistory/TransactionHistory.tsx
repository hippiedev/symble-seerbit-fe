import React from 'react';
import { useMount } from 'react-use';
import styles from './TransactionHistory.module.scss';
import WalletTransaction from '../../components/UI/molecules/WalletTransaction/WalletTransaction';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import { useGetUserWalletQuery } from '../../redux/feature/wallet/walletApiSplice';
import Spinner from '../../components/UI/atoms/Spinner/Spinner';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

function TransactionHistory() {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const {
    data: walletData,
    isLoading,
    isSuccess,
    error,
  } = useGetUserWalletQuery(undefined);
  useMount(() => window.scrollTo(0, 0));
  console.log(error);
  const walletTransactions = walletData?.transactions
    ? // eslint-disable-next-line no-unsafe-optional-chaining
      [...walletData?.transactions]?.reverse()
    : [];
  return (
    <FeatureScreen>
      <div className={styles.TransactionHistory}>
        <h1>Transaction History</h1>
        {isLoading ? (
          <div className={styles.LoadingWrap}>
            {' '}
            <Spinner />
          </div>
        ) : walletTransactions.length === 0 ? (
          <p style={{ fontSize: '14px', marginTop: '40px' }}>
            You have no transactions
          </p>
        ) : (
          isSuccess &&
          walletTransactions?.map((transaction) => {
            return (
              <div key={transaction.id} className={styles.walletTransaction}>
                <WalletTransaction
                  date={transaction.date}
                  type={
                    transaction.description.includes(user?.username || '') &&
                    !(transaction.type === 'FUND')
                      ? 'RECEIVED'
                      : transaction.type
                  }
                  amount={transaction.amount}
                  description={
                    transaction.description.includes(user?.username || '') &&
                    !(transaction.type === 'FUND')
                      ? `You received ${transaction.currency}${transaction.amount}`
                      : transaction.description
                  }
                />
              </div>
            );
          })
        )}
      </div>
    </FeatureScreen>
  );
}

export default TransactionHistory;

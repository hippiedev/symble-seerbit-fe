import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import Button from '../../../components/UI/atoms/Button/Button';
import {
  // NumberInput,
  TextInput,
} from '../../../components/UI/atoms/Input/Input';
import { useTopupWalletMutation } from '../../../redux/feature/wallet/walletApiSplice';
import styles from './FundWallet.module.scss';

function FundWallet() {
  const [
    topupWallet,
    {
      isLoading: topupLoading,
      isSuccess: topupSuccess,
      isError: hasTopupError,
      error: topupError,
    },
  ] = useTopupWalletMutation();
  const [amountValue, setAmountValue] = useState<string>('');
  const handleAmountChange = (values) => {
    setAmountValue(values.value);
  };
  console.log(amountValue);
  console.log(topupSuccess, hasTopupError);

  const handleTopupWallet = async (amount) => {
    try {
      const response = await topupWallet({ amount }).unwrap();
      window.location.assign(response.payments.redirectLink);
      console.log(response);
    } catch (e) {
      console.log(e, topupError);
    }
  };
  return (
    <div className={styles.FundWallet}>
      <h2>Fund Wallet</h2>
      <p>Enter the amount you wish to fund your wallet with:</p>
      <div className={styles.Wrapper}>
        <NumericFormat
          prefix="&#8358;"
          thousandSeparator=","
          customInput={TextInput}
          onValueChange={handleAmountChange}
          inputMode="decimal"
          decimalScale={2}
        />
        <Button
          disabled={topupLoading}
          clicked={() => handleTopupWallet(Number(amountValue))}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
}

export default FundWallet;

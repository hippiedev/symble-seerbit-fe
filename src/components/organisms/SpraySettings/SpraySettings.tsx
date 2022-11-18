import { NumericFormat } from 'react-number-format';
import { useState } from 'react';
import styles from './SpraySettings.module.scss';
import { TextInput } from '../../UI/atoms/Input/Input';
import Button from '../../UI/atoms/Button/Button';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { handleSetSpraySettings } from '../../../redux/feature/events/eventsSlice';
import { RootState } from '../../../redux/store';
import { handleShowEnterPinDrawer } from '../../../redux/feature/user/userSlice';

function SpraySettings({ closeDrawer }: { closeDrawer: () => void }) {
  const dispatch = useAppDispatch();
  const spraySettings = useAppSelector(
    (state: RootState) => state.events.liveSpraySettings,
  );
  const [totalSprayAmount, setTotalSprayAmount] = useState<string>('');
  const [numberOfSprays, setNumberOfSprays] = useState<string>('');

  const singleSprayAmount = (
    parseFloat(totalSprayAmount) / parseFloat(numberOfSprays)
  ).toFixed(2);

  const handleSprayAmount = ({ value }) => {
    setTotalSprayAmount(value);
  };

  const handleNumberOfSprays = ({ value }) => {
    setNumberOfSprays(value);
  };

  const handleSubmit = () => {
    const submitValues = {
      totalSprayAmount: parseFloat(totalSprayAmount),
      numberOfSprays: Number(numberOfSprays),
      singleSprayAmount: Number(singleSprayAmount),
    };
    dispatch(handleSetSpraySettings(submitValues));
    console.log(spraySettings);
    if (spraySettings) {
      dispatch(handleShowEnterPinDrawer({}));
      closeDrawer();
    }
  };

  const walletBalance = useAppSelector(
    (state: RootState) => state.wallet.wallet?.balance,
  );
  console.log(Number(totalSprayAmount) > (walletBalance || 0));
  const hasSprayError: boolean = walletBalance
    ? Number(totalSprayAmount) > (walletBalance || 0)
    : false;
  return (
    <div className={styles.SpraySettings}>
      <h2>Spray Settings</h2>
      <p className={styles.Details}>
        Set your spray settings now, to start spraying by simply swiping up!
      </p>
      <div className={styles.InputContainer}>
        <div className={styles.InputWrap}>
          <NumericFormat
            customInput={TextInput}
            inputName="Total amount to be sprayed"
            thousandSeparator=","
            prefix="&#8358;"
            onValueChange={handleSprayAmount}
            decimalScale={2}
            error={hasSprayError}
          />
          {hasSprayError ? (
            <p id={styles.Error}>Total spray amount exceeds wallet balance</p>
          ) : null}
        </div>
        <div className={styles.InputWrap}>
          <NumericFormat
            customInput={TextInput}
            inputName="Number of sprays"
            onValueChange={handleNumberOfSprays}
            suffix=" times"
          />
        </div>
      </div>
      <div className={styles.Button}>
        <Button
          disabled={!Number(singleSprayAmount) || hasSprayError}
          buttonStyles={{ padding: '13px 50px' }}
          clicked={handleSubmit}
        >
          Done
        </Button>
      </div>

      {Number(singleSprayAmount) ? (
        <p className={styles.Summary}>
          The value of a single spray will be:{' '}
          <span>&#8358;{singleSprayAmount}</span>
        </p>
      ) : null}
    </div>
  );
}

export default SpraySettings;

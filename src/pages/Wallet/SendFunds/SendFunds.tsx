import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import Button from '../../../components/UI/atoms/Button/Button';
import {
  SeperatedInputs,
  TextInput,
} from '../../../components/UI/atoms/Input/Input';
import styles from './SendFunds.module.scss';
import { ReactComponent as ConfirmIcon } from '../../../assets/icons/Question.svg';
import { useSendFundMutation } from '../../../redux/feature/wallet/walletApiSplice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { handleSendFund } from '../../../redux/feature/wallet/walletSplice';
import Popup from '../../../components/UI/molecules/Popup/Popup';
import { RootState } from '../../../redux/store';

function SendFunds({ closeDrawer }: { closeDrawer: () => void }) {
  const { message } = useAppSelector((state: RootState) => state.wallet);
  const [sendFund, { isLoading, isError, isSuccess, error }] =
    useSendFundMutation();
  const dispatch = useAppDispatch();
  const [screen, setScreen] = useState<'main' | 'confirm' | 'enter-pin'>(
    'main',
  );
  const handleScreen = (nextScreen: 'main' | 'confirm' | 'enter-pin') => {
    setScreen(nextScreen);
  };
  const [username, setUsername] = useState<string>('');
  const [amountValue, setAmountValue] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  console.log(amountValue);
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleAmountChange = (values) => {
    setAmountValue(values.value);
  };
  const handlePinChange = (value) => {
    setPin(value);
  };
  const handleSendFunds = async () => {
    const submitValue = {
      to: username.trim(),
      amount: Number(amountValue),
      pin,
    };
    try {
      const response = await sendFund(submitValue).unwrap();
      dispatch(handleSendFund(response));
      closeDrawer();
      console.log(response);
    } catch (e) {
      console.log(e, isError);
    }
  };
  console.log(pin);
  return (
    <>
      <div className={styles.SendFunds}>
        <div
          className={styles.ScreenContainer}
          style={{
            transform:
              screen === 'main' ? 'translateX(0)' : 'translateX(-200%)',
          }}
        >
          <h2>Send money</h2>
          <div className={styles.Wrapper}>
            <div className={styles.InputWrap}>
              <TextInput
                value={username}
                onChange={handleUsernameChange}
                name="username"
                inputName="Recipient's username"
              />
            </div>
            <div className={styles.InputWrap}>
              <NumericFormat
                prefix="&#8358;"
                thousandSeparator=","
                customInput={TextInput}
                onValueChange={handleAmountChange}
                inputMode="decimal"
                decimalScale={2}
                inputName="Enter amount"
              />
            </div>
            <Button
              disabled={!(amountValue && username)}
              clicked={() => handleScreen('confirm')}
              buttonStyles={{ marginTop: '27px' }}
            >
              Send
            </Button>
          </div>
        </div>
        <div
          style={{
            transform:
              screen === 'confirm' ? 'translateX(0)' : 'translateX(-200%)',
          }}
          className={styles.ScreenContainer}
        >
          <div className={styles.ConfirmWrap}>
            <ConfirmIcon />
            <p>
              Are you sure you want to send{' '}
              <span>&#8358;{amountValue.toLocaleString()}</span> to{' '}
              <span>{username}</span>?
            </p>
            <div className={styles.ButtonsWrap}>
              <Button clicked={closeDrawer} variant="outlined">
                No, thanks
              </Button>
              <Button clicked={() => handleScreen('enter-pin')}>Sure!</Button>
            </div>
          </div>
        </div>
        <div
          className={styles.ScreenContainer}
          style={{
            transform:
              screen === 'enter-pin' ? 'translateX(0)' : 'translateX(-200%)',
          }}
        >
          <div className={styles.EnterPin}>
            <h2>Enter pin</h2>
            <p>To complete this transaction, enter your symble pin</p>
            <SeperatedInputs
              autoFocus={screen === 'enter-pin'}
              value={pin}
              onChange={handlePinChange}
              length={4}
            />
            <Button
              disabled={!(pin.length === 4) || isLoading}
              buttonStyles={{ marginTop: '50px' }}
              clicked={handleSendFunds}
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
      <Popup
        show={isSuccess || isError || !!message}
        variant={
          isSuccess
            ? 'success'
            : isError
            ? 'error'
            : message
            ? 'success'
            : undefined
        }
        message={
          isSuccess
            ? message || undefined
            : isError
            ? (
                error as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message ||
              (
                error as {
                  status: number;
                  data: string;
                }
              ).data
            : message || undefined
        }
      />
    </>
  );
}

export default SendFunds;

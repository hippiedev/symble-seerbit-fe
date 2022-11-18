import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TransactionPin.module.scss';
import AuthScreen from '../../components/template/AuthScreen/AuthScreen';
import { SeperatedInputs } from '../../components/UI/atoms/Input/Input';
import Button from '../../components/UI/atoms/Button/Button';
import ModalPrompt from '../../components/UI/molecules/ModalPrompt/ModalPrompt';
import { useUpdateUserMutation } from '../../redux/feature/user/userApiSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { onSetPin } from '../../redux/feature/user/userSlice';
import Popup from '../../components/UI/molecules/Popup/Popup';

type Props = {
  screenStyles?: import('react').CSSProperties;
  handleScreen: (nextScreen: string) => void;
  handleConfirmPin?: () => void;
  handleChange?: (value: string) => void;
  value?: string;
  handleSubmit?: () => void;
  isLoading?: boolean;
};

function SetTransactionPin({
  screenStyles,
  handleScreen,
  value,
  handleChange,
}: Props) {
  return (
    <div style={screenStyles} className={styles.TransactionPin}>
      <p className={styles.Text}>
        This pin will be required for all transactions
      </p>
      <div className={styles.InputWrap}>
        <SeperatedInputs value={value} onChange={handleChange} length={4} />
      </div>
      <Button
        clicked={() => handleScreen('second-screen')}
        buttonStyles={{ marginTop: '64px' }}
      >
        Next
      </Button>
    </div>
  );
}
function ConfirmPin({
  screenStyles,
  value,
  handleChange,
  handleSubmit,
  isLoading,
}: Props) {
  return (
    <div style={screenStyles} className={styles.TransactionPin}>
      <p className={styles.Text}>Retype the PIN you set</p>
      <div className={styles.InputWrap}>
        <SeperatedInputs value={value} onChange={handleChange} length={4} />
      </div>
      <Button
        disabled={isLoading}
        buttonStyles={{ marginTop: '64px' }}
        clicked={handleSubmit}
      >
        Set PIN
      </Button>
    </div>
  );
}

function TransactionPin() {
  const [transactionPin, setTransactionPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [setPin, { isLoading, error, isError }] = useUpdateUserMutation();
  const dispatch = useAppDispatch();

  const handleTransactionPin = (value: string) => {
    setTransactionPin(value);
  };
  const handleConfirmPin = (value: string) => {
    setConfirmPin(value);
  };

  const [currentScreen, setCurrentScreen] = useState('first-screen');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async () => {
    const submitValue = {
      username: user ? user.username : '',
      pin: parseInt(confirmPin, 10),
    };
    console.log(submitValue);
    if (transactionPin === confirmPin) {
      try {
        const response = await setPin({
          updateData: submitValue,
          username: `${user?.username}`,
        }).unwrap();
        dispatch(onSetPin(response));
        setShowModal(true);
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    } else {
      setErrorMsg('PIN does not match');
      console.log(errorMsg);
    }
  };
  console.log(transactionPin, confirmPin);

  const handleScreenDisplay = (nextScreen: string) => {
    // receive nextSection argument from handleScreen prop and set current section to it
    setCurrentScreen(nextScreen);
  };

  const handleShowModal = () => {
    setShowModal(false);
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <>
      <Popup
        show={isError}
        variant={isError ? 'error' : undefined}
        message={
          isError
            ? (
                error as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message
            : undefined
        }
      />
      <AuthScreen
        title={
          currentScreen === 'first-screen'
            ? 'One more thing...'
            : 'Almost done...'
        }
        description={
          <p style={{ color: '#6B9AC4' }}>
            {currentScreen === 'first-screen'
              ? 'Set transaction PIN'
              : 'Confirm PIN'}
          </p>
        }
      >
        <SetTransactionPin
          handleScreen={(nextScreen) => handleScreenDisplay(nextScreen)}
          value={transactionPin}
          handleChange={handleTransactionPin}
          screenStyles={{
            transform:
              currentScreen === 'first-screen'
                ? 'translateX(0)'
                : 'translateX(-200%)',
          }}
        />
        <ConfirmPin
          handleScreen={(nextScreen) => handleScreenDisplay(nextScreen)}
          handleConfirmPin={() => setShowModal(true)}
          value={confirmPin}
          handleChange={handleConfirmPin}
          handleSubmit={onSubmit}
          isLoading={isLoading}
          screenStyles={{
            transform:
              currentScreen === 'second-screen'
                ? 'translateX(0)'
                : 'translateX(-200%)',
          }}
        />
        {errorMsg ? <p className={styles.Error}>{errorMsg}</p> : null}
      </AuthScreen>

      <ModalPrompt showModal={showModal} clicked={handleShowModal} />
    </>
  );
}

export default TransactionPin;

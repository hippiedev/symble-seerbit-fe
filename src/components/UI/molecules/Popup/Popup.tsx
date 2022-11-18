import { useEffect, useState, memo } from 'react';
import styles from './Popup.module.scss';
import { ReactComponent as Error } from '../../../../assets/icons/Error.svg';
import { ReactComponent as Success } from '../../../../assets/icons/Success.svg';
import { ReactComponent as Warning } from '../../../../assets/icons/Warning.svg';
import { ReactComponent as Notification } from '../../../../assets/icons/Notification.svg';

type Props = {
  show: boolean;
  variant?: 'success' | 'error' | 'warning' | 'notification';
  message?: string;
};

function Popup({ show, variant, message }: Props) {
  const [showPopup, setShowPopup] = useState<boolean>(show);

  useEffect(() => {
    setShowPopup(show);
  }, [show]);

  useEffect(() => {
    if (showPopup) {
      setTimeout(() => {
        setShowPopup(false);
      }, 6000);
    }
  }, [showPopup, show]);

  let variantStyle: string;
  let variantIcon: JSX.Element;
  let variantMessage;
  switch (variant) {
    case 'success':
      variantStyle = 'Success';
      variantIcon = <Success />;
      variantMessage = 'Success!';
      break;
    case 'error':
      variantStyle = 'Error';
      variantIcon = <Error />;
      variantMessage = 'E don burst';
      break;
    case 'warning':
      variantStyle = 'Warning';
      variantIcon = <Warning />;
      variantMessage = 'You are moving risky';
      break;
    case 'notification':
      variantStyle = 'Notification';
      variantIcon = <Notification />;
      variantMessage = "Something just happened. It's a secret.";
      break;
    default:
      variantStyle = 'Notification';
      variantIcon = <Notification />;
      variantMessage = "Something just happened. It's a secret.";
  }
  return (
    <div
      style={{
        transform: showPopup
          ? 'translate(-50%, -50%)'
          : 'translate(-50%, -300%)',
      }}
      className={`${styles[variantStyle]} ${styles.Popup} `}
    >
      {variantIcon}
      {message || variantMessage}
    </div>
  );
}

export default memo(Popup);

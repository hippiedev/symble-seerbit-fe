import Modal from '../Modal/Modal';
import styles from './ActionModal.module.scss';
import { ReactComponent as Question } from '../../../../assets/icons/Question.svg';
import { ReactComponent as Warning } from '../../../../assets/icons/WarningBig.svg';
import Button from '../../atoms/Button/Button';

type Props = {
  message?: React.ReactNode;
  acceptFn: () => void;
  closeModal: () => void;
  showActionModal: boolean;
  variant?: 'warning' | 'question';
};

function ActionModal({
  message,
  acceptFn,
  closeModal,
  showActionModal,
  variant = 'question',
}: Props) {
  let icon;
  switch (variant) {
    case 'question':
      icon = <Question className={styles.Icon} />;
      break;
    case 'warning':
      icon = <Warning className={styles.Icon} />;
      break;
    default:
      icon = <Question className={styles.Icon} />;
  }
  return (
    <Modal show={showActionModal} closeModal={closeModal}>
      <div className={styles.ActionModal}>
        {icon}
        {message}
        <div className={styles.ButtonsWrap}>
          <Button variant="outlined" clicked={closeModal}>
            No, thanks
          </Button>
          <Button
            clicked={() => {
              acceptFn();
              closeModal();
            }}
          >
            Sure
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ActionModal;

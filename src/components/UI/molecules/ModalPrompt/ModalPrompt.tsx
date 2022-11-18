import Modal from '../Modal/Modal';
import styles from './ModalPrompt.module.scss';
import { ReactComponent as CancelIcon } from '../../../../assets/icons/x.svg';
import SuccessIcon from '../../../../assets/icons/successIcon.svg';
import WarningIcon from '../../../../assets/icons/warningIcon.svg';

type Props = {
  variant?: string;
  message?: String;
  clicked: () => void;
  showModal: boolean;
};

function ModalPrompt({
  showModal,
  clicked,
  variant,
  message = 'Pin set successfully',
}: Props) {
  let variantIcon: string;
  let variantTitle: string | null;
  switch (variant) {
    case 'success':
      variantIcon = SuccessIcon;
      variantTitle = 'Success';
      break;
    case 'warning':
      variantIcon = WarningIcon;
      variantTitle = 'Warning';
      break;
    default:
      variantIcon = SuccessIcon;
      variantTitle = 'Success!';
  }
  return (
    <Modal show={showModal} closeModal={clicked}>
      <div className={styles.ModalPrompt}>
        <CancelIcon onClick={clicked} id={styles.CancelIcon} />
        <img src={variantIcon} alt="" id={styles.variantIcon} />
        <p className={styles.VariantTitle}>{variantTitle}</p>
        <p className={styles.Message}>{message}</p>
      </div>
    </Modal>
  );
}

export default ModalPrompt;

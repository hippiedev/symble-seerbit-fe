import Backdrop from '../../atoms/Backdrop/Backdrop';
import styles from './Modal.module.scss';

type Props = {
  children: React.ReactNode;
  closeModal?: () => void;
  show: boolean | undefined;
};

function Modal({ closeModal, show, children }: Props) {
  return (
    <>
      <Backdrop clicked={closeModal} show={show} />
      <div
        className={styles.Modal}
        style={{
          transform: show ? 'translateY(0)' : 'translateY(200%)',
          opacity: show ? '1' : '0',
          zIndex: show ? 1000 : -1,
        }}
      >
        {children}
      </div>
    </>
  );
}

export default Modal;

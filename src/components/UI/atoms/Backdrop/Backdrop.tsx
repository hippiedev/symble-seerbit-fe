import styles from './Backdrop.module.scss';

type Props = {
  clicked?: () => void;
  show: boolean | undefined;
};

function Backdrop({ clicked, show }: Props) {
  return show ? <div className={styles.Backdrop} onClick={clicked} /> : null;
}

export default Backdrop;

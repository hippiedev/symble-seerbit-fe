import { CSSProperties } from 'react';
import Backdrop from '../../atoms/Backdrop/Backdrop';
import styles from './Drawer.module.scss';
import { ReactComponent as CancelIcon } from '../../../../assets/icons/x.svg';

type Props = {
  children: React.ReactNode;
  closeDrawer: () => void;
  show: boolean;
  drawerStyles?: CSSProperties;
};

function Drawer({ closeDrawer, show, children, drawerStyles }: Props) {
  return (
    <>
      <Backdrop clicked={closeDrawer} show={show} />
      <div
        style={{
          transform: show ? 'translateY(0)' : 'translateY(200%)',
          opacity: show ? '1' : '0',
          zIndex: show ? 1000 : -1,
          ...drawerStyles,
        }}
        className={styles.Drawer}
      >
        <CancelIcon id={styles.cancel} onClick={closeDrawer} />
        {children}
      </div>
    </>
  );
}

export default Drawer;

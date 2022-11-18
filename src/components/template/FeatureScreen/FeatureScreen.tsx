import { useNavigate } from 'react-router-dom';
import styles from './FeatureScreen.module.scss';
import { ReactComponent as CancelIcon } from '../../../assets/icons/x.svg';
import Drawer from '../../UI/molecules/Drawer/Drawer';

type Props = {
  children: React.ReactNode;
};

function FeatureScreen({ children }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.FeatureScreen}>
        <CancelIcon onClick={() => navigate(-1)} id={styles.cancelIcon} />
        {children}
      </div>
      <Drawer show={false} closeDrawer={() => console.log('yeah')}>
        <p>dksdjs</p>
      </Drawer>
    </>
  );
}

export default FeatureScreen;

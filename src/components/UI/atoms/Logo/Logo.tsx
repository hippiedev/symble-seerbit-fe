import styles from './Logo.module.scss';
import { ReactComponent as LogoIcon } from '../../../../assets/icons/logo.svg';

function Logo() {
  return <LogoIcon className={styles.Logo} />;
}

export default Logo;

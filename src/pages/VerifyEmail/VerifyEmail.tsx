import AuthScreen from '../../components/template/AuthScreen/AuthScreen';
import Button from '../../components/UI/atoms/Button/Button';
import { useAppSelector } from '../../redux/hooks';
import styles from './VerifyEmail.module.scss';

function VerifyEmail() {
  const message = useAppSelector(
    (state: import('../../redux/store').RootState) => state.auth.message,
  );
  return (
    <AuthScreen title="One more step...">
      <div className={styles.VerifyEmail}>
        <p>{message}</p>
        <a rel="noreferrer" target="_blank" href="https://mail.google.com">
          <Button>Open mail app</Button>
        </a>
      </div>
    </AuthScreen>
  );
}

export default VerifyEmail;

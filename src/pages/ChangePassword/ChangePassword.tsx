import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePassword.module.scss';
import { TextInput } from '../../components/UI/atoms/Input/Input';
import Button from '../../components/UI/atoms/Button/Button';
import prev from '../../assets/icons/prev.svg';

function ChangePassword() {
  const navigate = useNavigate();
  return (
    <main className={styles.ChangePassword}>
      <header>
        <div className={styles.prev} onClick={() => navigate(-1)}>
          <img src={prev} alt="prev" className={styles.prev} />
        </div>
        <h2 className={styles.titleText}>Change Password</h2>
      </header>
      <form>
        <div className={styles.currentPassword}>
          <TextInput inputName="Current password" />
          <p onClick={() => navigate('/forgot-password')}>Forgot password?</p>
        </div>
        <div className={styles.inputWrapper}>
          <TextInput inputName="New password" />
        </div>
        <div className={styles.inputWrapper}>
          <TextInput inputName="Confirm password" />
        </div>
        <Button
          disabled
          variant="text"
          buttonStyles={{ margin: '0 auto', width: '225px', height: '45px' }}
        >
          Change password
        </Button>
      </form>
    </main>
  );
}

export default ChangePassword;

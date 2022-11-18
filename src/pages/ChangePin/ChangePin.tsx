import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePin.module.scss';
import { SeperatedInputs } from '../../components/UI/atoms/Input/Input';
import Button from '../../components/UI/atoms/Button/Button';
import prev from '../../assets/icons/prev.svg';

function ChangePin() {
  const navigate = useNavigate();
  return (
    <main className={styles.ChangePin}>
      <header>
        <div className={styles.prev}>
          <img
            src={prev}
            alt="prev"
            className={styles.prev}
            onClick={() => navigate(-1)}
          />
        </div>
        <h2 className={styles.titleText}>Change Pin</h2>
      </header>
      <div className={styles.inputWrapper}>
        <p>Enter current pin</p>
        <SeperatedInputs length={4} />
      </div>
      <div className={styles.inputWrapper}>
        <p>Enter new pin</p>
        <SeperatedInputs length={4} />
      </div>
      <div className={styles.inputWrapper}>
        <p>Confirm new pin</p>
        <SeperatedInputs length={4} />
      </div>
      <Button
        disabled
        variant="text"
        buttonStyles={{ margin: '0 auto', width: '225px', height: '45px' }}
      >
        Change pin
      </Button>
    </main>
  );
}

export default ChangePin;

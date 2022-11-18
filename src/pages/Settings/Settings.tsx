import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.scss';
import create from '../../assets/icons/create.svg';
// import youtube from '../../assets/icons/youtube.svg';
import CloseAccount from '../../assets/icons/CloseAccount.svg';
import Cart from '../../assets/icons/Cart.svg';
import lock from '../../assets/icons/lock.svg';
import accordionDown from '../../assets/icons/accordionDown.svg';
import accordionUp from '../../assets/icons/accordionUp.svg';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import ActionModal from '../../components/UI/molecules/ActionModal/ActionModal';
import { useCloseAccountMutation } from '../../redux/feature/user/userApiSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { logoutUser } from '../../redux/feature/auth/authSlice';

function Settings() {
  const user = useAppSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const [closeAccount, { isSuccess, isLoading }] = useCloseAccountMutation();
  const [showSecurity, setShowSecurity] = useState(false);
  const [showPropmt, setShowPrompt] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleShowSecurity = () => {
    setShowSecurity(!showSecurity);
  };
  useEffect(() => {
    if (isSuccess) {
      dispatch(logoutUser('Your account has been successfully closed'));
    }
  }, [isSuccess]);
  const handleCloseAccount = async () => {
    try {
      const response = await closeAccount({
        id: `${user?.id}`,
      }).unwrap();
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <ActionModal
        showActionModal={showPropmt}
        closeModal={() => setShowPrompt(false)}
        variant="warning"
        acceptFn={handleCloseAccount}
        message="Are you sure you want to close your account? I hope you emptied your wallet first."
      />
      <FeatureScreen>
        <main className={styles.Settings}>
          <header>
            <h2 className={styles.titleText}>Settings</h2>
          </header>
          <section>
            <div
              className={styles.SettingItem}
              onClick={() => navigate('/profile/edit')}
            >
              <img src={create} alt="" />
              <p>Edit profile</p>
            </div>
            <div
              className={styles.SettingItem}
              onClick={() => navigate('/products')}
            >
              <img src={Cart} alt="" />
              <p>Products for live commerce</p>
            </div>
            <div className={styles.SettingItem} onClick={handleShowSecurity}>
              <img src={lock} alt="" />
              <p>Password and security</p>
              {!showSecurity ? (
                <img src={accordionDown} alt="" />
              ) : (
                <img src={accordionUp} alt="" />
              )}
            </div>
            {showSecurity && (
              <div className={styles.changePasswordAndPin}>
                <span onClick={() => navigate('/change-password')}>
                  Change password
                </span>
                <span onClick={() => navigate('/change-pin')}>Change pin</span>
              </div>
            )}
            <div className={styles.SettingItem}>
              <img src={CloseAccount} alt="" />
              <p
                style={{ color: isLoading ? '#999999' : '#D82B2B' }}
                className={styles.closeAccount}
                onClick={() => setShowPrompt(true)}
              >
                Close account
              </p>
            </div>
          </section>
        </main>
      </FeatureScreen>
    </>
  );
}

export default Settings;

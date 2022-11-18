import { NavLink, useLocation } from 'react-router-dom';
import styles from './NavBar.module.scss';
import { ReactComponent as HomeIcon } from '../../../../assets/icons/homeIcon.svg';
import { ReactComponent as SearchIcon } from '../../../../assets/icons/searchIcon.svg';
import { ReactComponent as WalletIcon } from '../../../../assets/icons/walletIcon.svg';
import homeIcon2 from '../../../../assets/icons/homeIcon2.svg';
import search2 from '../../../../assets/icons/search2.svg';
import { ReactComponent as ProfileIcon } from '../../../../assets/icons/profileIcon.svg';
import { ReactComponent as CreateEvent } from '../../../../assets/icons/CreateEvent.svg';
import { useAppDispatch } from '../../../../redux/hooks';
import { setShowCreateEventsDrawer } from '../../../../redux/feature/events/eventsSlice';

function NavBar() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  return (
    <div className={styles.NavBar}>
      <div className={styles.Wrapper}>
        <NavLink to="/">
          {location.pathname === '/' ? (
            <img src={homeIcon2} alt="something" />
          ) : (
            <HomeIcon id="icon" />
          )}
        </NavLink>
        <NavLink to="/search">
          {location.pathname === '/search' ? (
            <img src={search2} alt="something" />
          ) : (
            <SearchIcon id="strokeIcon" stroke="#323232" />
          )}
        </NavLink>
        <CreateEvent
          onClick={() => dispatch(setShowCreateEventsDrawer())}
          id={styles.CreateEvent}
        />
        <NavLink to="/wallet">
          <WalletIcon id="icon" />
        </NavLink>
        <NavLink to="/profile">
          <ProfileIcon id="icon" />
        </NavLink>
      </div>
    </div>
  );
}

export default NavBar;

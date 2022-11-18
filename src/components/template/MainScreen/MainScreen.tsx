import { createSearchParams, Outlet, useNavigate } from 'react-router-dom';
import styles from './MainScreen.module.scss';
import NavBar from '../../UI/molecules/NavBar/NavBar';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { closeEventsDrawer } from '../../../redux/feature/events/eventsSlice';
import { ReactComponent as InstantLiveEvents } from '../../../assets/icons/InstantLiveEvent.svg';
import { ReactComponent as ScheduledLiveEvents } from '../../../assets/icons/ScheduledLiveEvent.svg';
import Drawer from '../../UI/molecules/Drawer/Drawer';

function MainScreen() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleCreateEventOption = (param) => {
    navigate({
      pathname: '/create-event',
      search: createSearchParams({
        event_type: param,
      }).toString(),
    });
    dispatch(closeEventsDrawer());
  };
  const showCreateEventsDrawer = useAppSelector(
    (state: RootState) => state.events.showCreateEventsDrawer,
  );
  return (
    <div className={styles.MainScreen}>
      <Outlet />
      <NavBar />
      <Drawer
        show={showCreateEventsDrawer}
        closeDrawer={() => dispatch(closeEventsDrawer())}
      >
        <div
          style={{
            height: 'fit-content',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '33px',
            // paddingTop: '26px',
          }}
        >
          <h3 style={{ fontSize: '24px', fontWeight: 700 }}>
            Create a new event
          </h3>
          <InstantLiveEvents
            onClick={() => handleCreateEventOption('instant')}
            style={{ cursor: 'pointer' }}
          />
          <ScheduledLiveEvents
            onClick={() => handleCreateEventOption('scheduled')}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </Drawer>
    </div>
  );
}

export default MainScreen;

import { useNavigate } from 'react-router-dom';
import styles from './EmptyEvents.module.scss';
import { ReactComponent as Camera } from '../../../../assets/icons/Vector.svg';
import { ReactComponent as RightArrow } from '../../../../assets/icons/blueRightArrow.svg';

function EmptyEvents({
  mainText = "You don't have any events yet",
  ctaText = 'Create an event now',
  action,
  isAuthUser,
}: {
  mainText?: string;
  ctaText?: string;
  action?: () => void;
  isAuthUser: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className={styles.Wrapper}>
      <div className={styles.EmptyDisplay}>
        <Camera />
        <div>
          <p>{isAuthUser ? mainText : 'User has no events here'}</p>
          {isAuthUser ? (
            <div
              onClick={() => (action ? action() : navigate('/create-event'))}
              className={styles.EmptyCTA}
            >
              <span>{ctaText}</span>
              <RightArrow style={{ position: 'relative', top: '2px' }} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default EmptyEvents;

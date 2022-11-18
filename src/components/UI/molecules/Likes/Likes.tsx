/* eslint-disable react/no-array-index-key */
import { memo } from 'react';
import styles from './Likes.module.scss';
import { ReactComponent as Like } from '../../../../assets/icons/likes.svg';
import { useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';

function Likes({ likes }: { likes: string[] | [] }) {
  const userAvatar = useAppSelector(
    (state: RootState) => state.user.user?.avatar,
  );
  const userId = useAppSelector((state: RootState) => state.user.user?.id);
  return (
    <div className={styles.Likes}>
      {likes.map((like, index) => {
        let isAuthUser = false;
        if (like === userId) {
          isAuthUser = true;
        }
        return isAuthUser ? (
          <img
            className={styles.Avatar}
            id={styles.Like}
            src={userAvatar}
            alt=""
            key={index}
            referrerPolicy="no-referrer"
          />
        ) : (
          <Like key={index} id={styles.Like} />
        );
      })}
    </div>
  );
}

export default memo(Likes);

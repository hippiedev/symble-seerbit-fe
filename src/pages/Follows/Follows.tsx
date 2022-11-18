import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
// import Button from '../../components/UI/atoms/Button/Button';
import Spinner from '../../components/UI/atoms/Spinner/Spinner';
import {
  useFollowUserMutation,
  useGetAuthUserQuery,
  useGetUserQuery,
} from '../../redux/feature/user/userApiSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from './Follows.module.scss';
import { handleFollowUser } from '../../redux/feature/user/userSlice';

function Follows({
  isAuthUser = false,
  display,
}: {
  isAuthUser: boolean;
  display: 'followers' | 'following';
}) {
  const dispatch = useAppDispatch();
  const { user: authUser } = useAppSelector(
    (state: import('../../redux/store').RootState) => state.user,
  );
  console.log(authUser);
  const [followUser, { isSuccess: followSuccess, isError: followError }] =
    useFollowUserMutation();
  const { username } = useParams();
  const {
    data: authUserData,
    isSuccess,
    isLoading,
  } = useGetAuthUserQuery(undefined, {
    refetchOnReconnect: true,
    skip: !isAuthUser,
  });
  const {
    data: user,
    isLoading: userLoading,
    isSuccess: getUserSuccess,
  } = useGetUserQuery(`${username}`, {
    refetchOnReconnect: true,
    skip: isAuthUser,
  });
  const userData = isAuthUser ? authUserData : user;
  console.log(userData);
  const navigate = useNavigate();
  const follows =
    display === 'followers'
      ? userData?.followers
      : display === 'following'
      ? userData?.following
      : [];

  const followUserHandler = async (userUsername: string) => {
    try {
      const response = await followUser(userUsername).unwrap();
      dispatch(handleFollowUser({ data: { ...authUser, ...response.data } }));
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  console.log(followSuccess, followError);
  const [loadingFollow, setIsLoadingFollow] = useState<string | null>(null);

  return userLoading || isLoading ? (
    <div className={styles.LoadingWrap}>
      <Spinner />
    </div>
  ) : isSuccess || getUserSuccess ? (
    <FeatureScreen>
      <div className={styles.Follows}>
        <h2>{display}</h2>
        <div className={styles.Wrapper}>
          {follows?.map((follow) => {
            let isAuthUserFollow: boolean = false;
            if (authUser) {
              if (follow.id === authUser?.id) {
                isAuthUserFollow = true;
              } else {
                isAuthUserFollow = false;
              }
            }
            console.log(isAuthUserFollow);
            let isAuthUserFollowing;
            if (authUser?.following?.length !== (0 || undefined)) {
              // eslint-disable-next-line no-plusplus
              for (let i = 0; i < authUser?.following?.length; i++) {
                if (
                  follow?.id ===
                  (authUser?.following[i].id || authUser.following[i])
                ) {
                  isAuthUserFollowing = true;
                  break;
                } else {
                  isAuthUserFollowing = false;
                }
              }
            }
            let isUserFollowing;
            if (authUser?.followers?.length !== (0 || undefined)) {
              // eslint-disable-next-line no-plusplus
              for (let i = 0; i < authUser?.followers?.length; i++) {
                if (
                  follow?.id ===
                  (authUser?.followers[i].id || authUser.followers[i])
                ) {
                  isUserFollowing = true;
                  break;
                } else {
                  isUserFollowing = false;
                }
              }
            }
            const asyncFollowUser = async (userToBeFollowed: string) => {
              setIsLoadingFollow(userToBeFollowed);
              await followUserHandler(userToBeFollowed);
              setIsLoadingFollow(null);
            };
            return (
              <div key={follow.id} className={styles.FollowItem}>
                <span
                  onClick={() =>
                    !isAuthUserFollow
                      ? navigate(`/${follow.username}`)
                      : navigate('/profile')
                  }
                >
                  <img
                    src={follow.avatar}
                    alt={follow.username}
                    referrerPolicy="no-referrer"
                  />
                  <span id={styles.UserInfo}>
                    <h3 id={styles.Username}>
                      {follow.username} {isAuthUserFollow ? '(you)' : null}
                    </h3>
                    <h4 id={styles.FollowsYou}>
                      {isUserFollowing ? 'follows you' : null}
                    </h4>
                  </span>
                </span>
                <button
                  disabled={
                    loadingFollow === follow.username || isAuthUserFollow
                  }
                  type="button"
                  onClick={async () => asyncFollowUser(follow.username)}
                >
                  {isAuthUserFollowing
                    ? 'Unfollow'
                    : display === 'followers' && isUserFollowing
                    ? 'Follow Back'
                    : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </FeatureScreen>
  ) : null;
}

export default Follows;

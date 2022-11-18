/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
// import { nanoid } from '@reduxjs/toolkit';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Profile.module.scss';
// import upcomingEventPicture from '../../assets/images/upcomingEventPicture.png';
import ProfileCover from '../../assets/images/ProfileCover.svg';
import { ReactComponent as PeopleIcon } from '../../assets/icons/people.svg';
import { ReactComponent as LocationMarker } from '../../assets/icons/Location.svg';
import { ReactComponent as ProfileNav } from '../../assets/icons/profileNavButton.svg';
import { ReactComponent as ShoppingBagIcon } from '../../assets/icons/BagIcon.svg';
// import dots from '../../assets/icons/dots.svg';

// import edit from '../../assets/icons/edit.svg';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutAsync } from '../../redux/feature/auth/authSlice';
import {
  useFollowUserMutation,
  useGetAuthUserQuery,
  useGetUserQuery,
} from '../../redux/feature/user/userApiSlice';
import Spinner from '../../components/UI/atoms/Spinner/Spinner';
import UserEventsList from '../../components/organisms/UserEventsList/UserEventsList';
import Popup from '../../components/UI/molecules/Popup/Popup';
// import { ReactComponent as RightArrow } from '../../assets/icons/blueRightArrow.svg';
// import productImagePlaceholder from '../../assets/icons/productImagePlaceholder.svg';

// import { ReactComponent as AddProduct } from '../../assets/icons/addProduct.svg';
import { onGetUser } from '../../redux/feature/user/userSlice';
import EmptyEvents from '../../components/UI/molecules/EmptyEvents/EmptyEvents';
import ProductBookmark from '../../components/UI/molecules/ProductBookmark/ProductBookmark';
// import { User } from '../../constants/types';
import { RootState } from '../../redux/store';
import Button from '../../components/UI/atoms/Button/Button';
import { setShowCreateEventsDrawer } from '../../redux/feature/events/eventsSlice';

function Profile({ isAuthUser = false }: { isAuthUser: boolean }) {
  const { user: authUser } = useAppSelector((state: RootState) => state.auth);
  const { username } = useParams();
  const {
    data: authUserData,
    isSuccess,
    isLoading,
    error,
    isError,
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

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [followUser, { isLoading: followUserLoading }] =
    useFollowUserMutation();
  const [option, setOption] = useState(false);
  // const [showTop, setShowTop] = useState(true);
  const [userDisplay, setUserDisplay] = useState('events');
  const userEvents = userData?.events ? [...userData?.events].reverse() : [];
  console.log(userData);
  let isAuthUserFollowing = false;
  if (userData?.followers?.length !== (0 || undefined) && userData) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < userData?.followers?.length; i++) {
      if (authUser?.id === userData?.followers[i].id) {
        isAuthUserFollowing = true;
        break;
      }
    }
  }
  useEffect(() => {
    if (authUserData) {
      dispatch(onGetUser(authUserData));
    }
  }, [authUserData, isSuccess]);

  // window.addEventListener('scroll', function () {
  //   const element: any = document.querySelector('#main-container');
  //   const position = element.getBoundingClientRect();

  //   // checking for partial visibility
  //   if (position.top < window.innerHeight && position.bottom >= 0) {
  //     console.log('Element is partially visible in screen');
  //     setShowTop(true);
  //   }
  //   if (position.top < window.innerHeight && position.bottom < 0) {
  //     console.log('e don be');
  //     setShowTop(false);
  //   }
  //   if (position.top > window.innerHeight && position.bottom > 0) {
  //     console.log('Element is partially visible in screen');
  //     setShowTop(true);
  //   }
  // });
  // useEffect(() => {}, [showTop]);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate('/sign-in');
  };
  const handleFollowUser = async () => {
    try {
      const response = await followUser(`${userData?.username}`).unwrap();
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (userData?.id === authUser?.id && userData) {
      dispatch(onGetUser(userData));
    }
  }, [dispatch, userData]);

  let displayData: any[] | undefined = [];

  let onEmptyDisplay = (
    <EmptyEvents
      isAuthUser={isAuthUser}
      action={() => dispatch(setShowCreateEventsDrawer())}
    />
  );

  switch (userDisplay) {
    case 'events':
      displayData = userEvents;
      break;
    case 'subscribed':
      displayData = userData?.subscribed_events;
      onEmptyDisplay = (
        <EmptyEvents
          isAuthUser={isAuthUser}
          ctaText="Check out events"
          action={() => navigate('/')}
          mainText="You don't have any subscriptions"
        />
      );
      break;
    case 'bookmarked':
      displayData = userData?.bookmarks.products;
      onEmptyDisplay = (
        <div className={styles.EmptyWrapper}>
          <ShoppingBagIcon
            id={styles.BagIcon}
            stroke="#000000"
            style={{ stroke: '#000000' }}
          />
          <p id={styles.EmptyBookmarks}>You have no bookmarked products</p>
        </div>
      );
      break;
    default:
      displayData = userData?.events;
  }
  return isLoading || userLoading ? (
    <div className={styles.LoadingWrap}>
      <Spinner />
    </div>
  ) : isSuccess || getUserSuccess ? (
    <main className={styles.profile}>
      <header className={styles.profileHeader} id="main-container">
        <section className={styles.profileImagesContainer}>
          <img
            src={ProfileCover}
            className={styles.profileCover}
            onClick={() => setOption(!option)}
            alt=""
          />
          {!isAuthUser ? (
            <ProfileNav onClick={() => navigate(-1)} id={styles.ProfileNav} />
          ) : null}
          <img
            className={styles.ProfilePicture}
            src={userData?.avatar}
            alt="profilePicture"
            referrerPolicy="no-referrer"
          />
          {option && isAuthUser ? (
            <div className={styles.profileHeaderOption}>
              <h4 onClick={() => navigate('/settings')}>Settings</h4>
              {/* <h4 className={styles.closeAccount}>Close account</h4> */}
              <h4 onClick={handleLogout}>Log out</h4>
            </div>
          ) : option ? (
            <div className={styles.profileHeaderOption}>
              <h4>Block user</h4>
            </div>
          ) : null}
        </section>
        <div className={styles.UserInfo}>
          {(isAuthUser && authUserData?.name.full === 'undefined undefined') ||
          authUserData?.name.full === undefined ? null : (
            <h2 className={styles.Fullname}>{authUserData?.name.full}</h2>
          )}
          <h3>@{userData?.username}</h3>
          <div className={styles.profileLocationAndViews}>
            {userData?.country ? (
              <div>
                <LocationMarker />
                <span>{userData?.country}</span>
              </div>
            ) : null}
            <div
              onClick={() => {
                if (userData?.followersCount && userData?.followersCount > 0) {
                  navigate(
                    `/${isAuthUser ? 'profile' : userData?.username}/followers`,
                  );
                }
              }}
            >
              <PeopleIcon />
              <span>
                {userData?.followersCount}{' '}
                {userData?.followersCount === 1 ? 'follower' : 'followers'}
              </span>
            </div>
            <div
              onClick={() => {
                if (userData?.followingCount && userData.followingCount > 0) {
                  navigate(
                    `/${isAuthUser ? 'profile' : userData?.username}/following`,
                  );
                }
              }}
            >
              <PeopleIcon />
              <span>{userData?.followingCount} following</span>
            </div>
          </div>
        </div>
        <p>{userData?.bio}</p>
        {!isAuthUser ? (
          <Button
            buttonStyles={{
              position: 'relative',
              top: '-15px',
              padding: '10px 32px',
            }}
            clicked={handleFollowUser}
            disabled={followUserLoading}
          >
            {isAuthUserFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        ) : null}
      </header>
      {/* {!showTop && (
        <section className={styles.stickyProfileDetails}>
          <div className={styles.stickyProfileImage}>
            <img
              className={styles.smallProfilePicture}
              src={userData?.avatar}
              alt="profilePicture"
              referrerPolicy="no-referrer"
            />
            <p>John Doe</p>
          </div>
          <img src={dots} alt="" />
        </section>
      )} */}
      {/* {userData?.data?.events.length === 0 ? null : (
        <section className={styles.profileUpcomingEvents}>
          <h6>Your upcoming event </h6>
          <div className={styles.Wrap}>
            <img
              id={styles.UpcomingEventImage}
              src={
                userData?.events[userData?.events?.length - 1]?.image ||
                upcomingEventPicture
              }
              alt=""
            />

            <div>
              <p>6pm on 6th Sept. 2022</p>
              <h6>{userData?.events[userData?.events?.length - 1]?.name}</h6>
            </div>
          </div>
        </section>
      )} */}

      {/* <section
        style={{ marginTop: '20px' }}
        className={styles.profileUpcomingEvents}
      >
        <h6>Your products</h6>
        <div className={styles.Wrap}>
          {userData?.products.length === 0 ? (
            <div className={styles.Content}>
              <AddIcon />{' '}
              <p
                onClick={() => navigate('/add-product')}
                id={styles.EmptyProductText}
              >
                Add a product for live commerce
              </p>
            </div>
          ) : (
            <>
              <div className={styles.ImageWrap}>
                {userData?.products.slice(0, 3).map((product) => (
                  <img
                    key={nanoid()}
                    src={product.images[0] || productImagePlaceholder}
                    alt=""
                  />
                ))}
              </div>
              <p onClick={() => navigate('/products')} id={styles.text}>
                View all your products
              </p>
              <RightArrow style={{ position: 'relative', top: '1.5px' }} />
            </>
          )}
        </div>
      </section> */}
      <section className={styles.UserEventsWrap}>
        <div className={styles.Tab}>
          <span
            role="tab"
            style={{
              borderBottom:
                userDisplay === 'events'
                  ? '1px solid #323232'
                  : '1px solid #cccccc',
              color: userDisplay === 'events' ? '#323232' : '#cccccc',
            }}
            onClick={() => setUserDisplay('events')}
          >
            Events
          </span>
          <span
            role="tab"
            style={{
              borderBottom:
                userDisplay === 'subscribed'
                  ? '1px solid #323232'
                  : '1px solid #cccccc',
              color: userDisplay === 'subscribed' ? '#323232' : '#cccccc',
            }}
            onClick={() => setUserDisplay('subscribed')}
          >
            Subscribed
          </span>
          {isAuthUser ? (
            <span
              role="tab"
              style={{
                borderBottom:
                  userDisplay === 'bookmarked'
                    ? '1px solid #323232'
                    : '1px solid #cccccc',
                color: userDisplay === 'bookmarked' ? '#323232' : '#cccccc',
              }}
              onClick={() => setUserDisplay('bookmarked')}
            >
              Products
            </span>
          ) : null}
        </div>
        <div className={styles.UserDisplay}>
          {displayData?.length !== 0 ? (
            userDisplay === 'bookmarked' ? (
              <div className={styles.BookmarksWrap}>
                {displayData?.map((bookmark) => (
                  <ProductBookmark key={bookmark.id} product={bookmark} />
                ))}
              </div>
            ) : (
              <UserEventsList
                eventOwner={isAuthUser ? 'You' : userData?.username}
                isLoading={isLoading}
                data={displayData}
              />
            )
          ) : (
            onEmptyDisplay
          )}
        </div>
      </section>
    </main>
  ) : isError ? (
    <Popup
      show={isError}
      variant={isError ? 'error' : undefined}
      message={
        isError
          ? (
              error as {
                status: number;
                data: { code: number; message: string };
              }
            )?.data?.message ||
            (
              error as {
                status: number;
                data: string;
              }
            ).data
          : undefined
      }
    />
  ) : null;
}

export default Profile;

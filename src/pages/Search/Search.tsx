// import { useEffect, useState } from 'react';
// import {
//   createSearchParams,
//   Link,
//   // Link,
//   useNavigate,
//   useSearchParams,
// } from 'react-router-dom';
// import styles from './Search.module.scss';
// import { TextInput } from '../../components/UI/atoms/Input/Input';
// import search from '../../assets/icons/search.svg';
// import upcoming from '../../assets/icons/upcoming.svg';
// import Live from '../../assets/icons/Live.svg';
// import altevent from '../../assets/images/altevent.png';
// import { useGetEventsQuery } from '../../redux/feature/events/eventsApiSlice';
// import {
//   useFollowUserMutation,
//   useGetAllUsersQuery,
//   useGetAuthUserQuery,
// } from '../../redux/feature/user/userApiSlice';
// // import { SearchEventWrapper } from '../../components/organisms/EventsList/EventsList';
// import { useAppDispatch, useAppSelector } from '../../redux/hooks';
// import { handleFollowUser } from '../../redux/feature/user/userSlice';

// function Search() {
//   const { user: authUser } = useAppSelector(
//     (state: import('../../redux/store').RootState) => state.user,
//   );
//   const {
//     data: events,
//     isLoading,
//     isSuccess,
//     error,
//   } = useGetEventsQuery(undefined);
//   const [followUser, { isSuccess: followSuccess, isError: followError }] =
//     useFollowUserMutation();
//   const dispatch = useAppDispatch();
//   const followUserHandler = async (userUsername: string) => {
//     try {
//       const response = await followUser(userUsername).unwrap();
//       dispatch(handleFollowUser({ data: { ...authUser, ...response.data } }));
//       console.log(response);
//     } catch (e) {
//       console.log(e);
//     }
//   };
//   console.log(followSuccess, followError);
//   const [loadingFollow, setIsLoadingFollow] = useState<string | null>(null);
//   const {
//     data: usersData,
//     isLoading: loading,
//     isSuccess: success,
//     error: getAllUsersError,
//   } = useGetAllUsersQuery(undefined);
//   console.log(
//     usersData,
//     `loading${loading}`,
//     `success${success}`,
//     getAllUsersError,
//   );
//   const {
//     data: authUserData,
//     isSuccess: authUserSuccess,
//     isLoading: authUserLoading,
//     error: authUserError,
//     isError: authUserIsError,
//   } = useGetAuthUserQuery(undefined);
//   console.log(
//     authUserData?.id,
//     authUserSuccess,
//     authUserLoading,
//     authUserError,
//     authUserIsError,
//   );

//   console.log(typeof events);
//   console.log(events, `loading${isLoading}`, `success${isSuccess}`, error);
//   console.log(events?.data);
//   console.log(events?.data?.[0].category, 'hell no');
//   // eslint-disable-next-line no-unsafe-optional-chaining
//   console.log(events?.data?.[events?.data?.length - 1].name);
//   const [filteredData, setFilteredData]: any = useState([]);
//   const [wordEntered, setWordEntered] = useState('');
//   // const [wordEntered, setWordEntered] = useState('');
//   const [searchParams, setSearchParams] = useState('');
//   const [isCurrentTab, setIsCurrentTab] = useState('Top');
//   const [test, setTest] = useState(false);
//   // const [searchResult]: any = useState([]);
//   const [inputValue] = useState<string>('');
//   const navigate = useNavigate();
//   const [params] = useSearchParams();
//   const handleSearchParam = () => {
//     navigate({
//       pathname: '/search',
//       search: createSearchParams({
//         q: inputValue,
//       }).toString(),
//     });
//     console.log(inputValue);
//   };
//   useEffect(() => {
//     setSearchParams(params.get('q') || '');
//     console.log(searchParams);
//   }, [params, setSearchParams]);

//   const handleFilter = (event) => {
//     const searchWord = event.target.value;
//     setWordEntered(searchWord);
//     const newFilter: any = events?.data.filter((value) => {
//       const { owner } = value;
//       return (
//         value.name.toLowerCase().includes(searchWord.toLowerCase()) ||
//         owner?.username.toLowerCase().includes(searchWord.toLowerCase())
//       );
//     });
//     setFilteredData(newFilter);
//   };
//   const foofoo: any = usersData?.data.filter((value) => {
//     return value.username.toLowerCase().includes(wordEntered.toLowerCase());
//   });
//   console.log(foofoo);
//   // const handleUserFilter = () => {
//   //   const userFilters = usersData?.data.filter((userFilter) => {
//   //     return(
//   //       userFilter.us
//   //     )
//   //   });
//   // }
//   // const searchResult = events?.data.filter(
//   //   (event) =>
//   //     event.name === searchParams ||
//   //     event?.owner?.username === searchParams ||
//   //     usersData?.data.username,
//   // );
//   // console.log(searchResult, 'yes');
//   useEffect(() => {}, []);
//   console.log(isCurrentTab);
//   console.log(test);
//   const focusing = () => {
//     setIsCurrentTab('Top');
//     setTest(true);
//   };
//   return (
//     <main className={styles.Search}>
//       <section className={styles.SearchboxContainer}>
//         <form className={styles.SearchboxContainer} onClick={() => focusing}>
//           <TextInput
//             onChange={handleFilter}
//             value={wordEntered}
//             inputStyle={{
//               borderRadius: '25px',
//               background: '#EFF2F1',
//               padding: '10px 18px',
//               fontSize: '14px',
//               border: 'none',
//             }}
//             placeholder="Search"
//           />
//         </form>
//         <img src={search} alt="" onClick={handleSearchParam} />
//       </section>
//       {wordEntered.length !== 0 && (
//         <section className={styles.tab}>
//           <span
//             style={{
//               color: isCurrentTab === 'Top' ? '#4059AD' : '#cccccc',
//             }}
//             onClick={() => setIsCurrentTab('Top')}
//           >
//             Top
//           </span>
//           <span
//             style={{
//               color: isCurrentTab === 'Users' ? '#4059AD' : '#cccccc',
//             }}
//             onClick={() => setIsCurrentTab('Users')}
//           >
//             Users
//           </span>
//           <span
//             style={{
//               color: isCurrentTab === 'Live' ? '#4059AD' : '#cccccc',
//             }}
//             onClick={() => setIsCurrentTab('Live')}
//           >
//             Live
//           </span>
//           <span
//             style={{
//               color: isCurrentTab === 'Upcoming' ? '#4059AD' : '#cccccc',
//             }}
//             onClick={() => setIsCurrentTab('Upcoming')}
//           >
//             Upcoming
//           </span>
//         </section>
//       )}
//       {wordEntered && <br />}
//       {wordEntered.length !== 0 &&
//         isCurrentTab === 'Users' &&
//         foofoo?.map((data) => {
//           const { id, avatar, username } = data;
//           let isAuthUserFollow: boolean = false;
//           if (authUser) {
//             if (id === authUser?.id) {
//               isAuthUserFollow = true;
//             } else {
//               isAuthUserFollow = false;
//             }
//           }
//           console.log(isAuthUserFollow);
//           let isAuthUserFollowing;
//           if (authUser?.following?.length !== (0 || undefined)) {
//             // eslint-disable-next-line no-plusplus
//             for (let i = 0; i < authUser?.following?.length; i++) {
//               if (id === (authUser?.following[i].id || authUser.following[i])) {
//                 isAuthUserFollowing = true;
//                 break;
//               } else {
//                 isAuthUserFollowing = false;
//               }
//             }
//           }
//           let isUserFollowing;
//           if (authUser?.followers?.length !== (0 || undefined)) {
//             // eslint-disable-next-line no-plusplus
//             for (let i = 0; i < authUser?.followers?.length; i++) {
//               if (id === (authUser?.followers[i].id || authUser.followers[i])) {
//                 isUserFollowing = true;
//                 break;
//               } else {
//                 isUserFollowing = false;
//               }
//             }
//           }
//           const asyncFollowUser = async (userToBeFollowed: string) => {
//             setIsLoadingFollow(userToBeFollowed);
//             await followUserHandler(userToBeFollowed);
//             setIsLoadingFollow(null);
//           };
//           return (
//             <div key={id} className={styles.User}>
//               <span
//                 onClick={() =>
//                   !isAuthUserFollow
//                     ? navigate(`/${username}`)
//                     : navigate('/profile')
//                 }
//               >
//                 <img src={avatar} alt={username} referrerPolicy="no-referrer" />
//                 <span id={styles.UserInfo}>
//                   <h3 id={styles.Username}>
//                     {username} {isAuthUserFollow ? '(you)' : null}
//                   </h3>
//                   <h4 id={styles.FollowsYou}>
//                     {isUserFollowing ? 'follows you' : null}
//                   </h4>
//                 </span>
//               </span>
//               <button
//                 disabled={loadingFollow === username || isAuthUserFollow}
//                 type="button"
//                 onClick={async () => asyncFollowUser(username)}
//               >
//                 {isAuthUserFollowing
//                   ? 'Unfollow'
//                   : isUserFollowing
//                   ? 'Follow Back'
//                   : 'Follow'}
//               </button>
//             </div>
//           );
//         })}
//       {wordEntered.length !== 0 &&
//         !wordEntered.includes(foofoo) &&
//         isCurrentTab === 'Top' && (
//           <p className={styles.topHeaderStyle}>Users</p>
//         )}
//       {wordEntered.length !== 0 &&
//         wordEntered.includes(foofoo) &&
//         isCurrentTab === 'Top' && (
//           <p className={styles.topHeaderStyle}>No search result</p>
//         )}
//       {wordEntered.length !== 0 &&
//         wordEntered.includes(filteredData) &&
//         (isCurrentTab === 'Users' ||
//           isCurrentTab === 'Upcoming' ||
//           isCurrentTab === 'Live') && (
//           <p className={styles.topHeaderStyle}>No search result</p>
//         )}
//       {wordEntered.length !== 0 && isCurrentTab === 'Top'
//         ? foofoo?.slice(0, 4).map((data) => {
//             // eslint-disable-next-line @typescript-eslint/naming-convention
//             const { id, avatar, username } = data;
//             let isAuthUserFollow: boolean = false;
//             if (authUser) {
//               if (id === authUser?.id) {
//                 isAuthUserFollow = true;
//               } else {
//                 isAuthUserFollow = false;
//               }
//             }
//             console.log(isAuthUserFollow);
//             let isAuthUserFollowing;
//             if (authUser?.following?.length !== (0 || undefined)) {
//               // eslint-disable-next-line no-plusplus
//               for (let i = 0; i < authUser?.following?.length; i++) {
//                 if (
//                   id === (authUser?.following[i].id || authUser.following[i])
//                 ) {
//                   isAuthUserFollowing = true;
//                   break;
//                 } else {
//                   isAuthUserFollowing = false;
//                 }
//               }
//             }
//             let isUserFollowing;
//             if (authUser?.followers?.length !== (0 || undefined)) {
//               // eslint-disable-next-line no-plusplus
//               for (let i = 0; i < authUser?.followers?.length; i++) {
//                 if (
//                   id === (authUser?.followers[i].id || authUser.followers[i])
//                 ) {
//                   isUserFollowing = true;
//                   break;
//                 } else {
//                   isUserFollowing = false;
//                 }
//               }
//             }
//             const asyncFollowUser = async (userToBeFollowed: string) => {
//               setIsLoadingFollow(userToBeFollowed);
//               await followUserHandler(userToBeFollowed);
//               setIsLoadingFollow(null);
//             };
//             return (
//               <div key={id} className={styles.User}>
//                 <span
//                   onClick={() =>
//                     !isAuthUserFollow
//                       ? navigate(`/${username}`)
//                       : navigate('/profile')
//                   }
//                 >
//                   <img
//                     src={avatar}
//                     alt={username}
//                     referrerPolicy="no-referrer"
//                   />
//                   <span id={styles.UserInfo}>
//                     <h3 id={styles.Username}>
//                       {username} {isAuthUserFollow ? '(you)' : null}
//                     </h3>
//                     <h4 id={styles.FollowsYou}>
//                       {isUserFollowing ? 'follows you' : null}
//                     </h4>
//                   </span>
//                 </span>
//                 <button
//                   disabled={loadingFollow === username || isAuthUserFollow}
//                   type="button"
//                   onClick={async () => asyncFollowUser(username)}
//                 >
//                   {isAuthUserFollowing
//                     ? 'Unfollow'
//                     : isUserFollowing
//                     ? 'Follow Back'
//                     : 'Follow'}
//                 </button>
//               </div>
//             );
//           })
//         : null}

//       {wordEntered.length !== 0 && isCurrentTab === 'Live'
//         ? filteredData.map((data) => {
//             // eslint-disable-next-line @typescript-eslint/naming-convention
//             const { id, status, image, owner, name } = data;
//             return (
//               status === 'ACTIVE' && (
//                 <div key={id}>
//                   <Link
//                     to={`/event/${data.event_code}`}
//                     style={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       marginBottom: '20px',
//                     }}
//                   >
//                     <main style={{ display: 'flex', gap: '18px' }}>
//                       <img
//                         src={image || altevent}
//                         alt=""
//                         style={{
//                           width: '71px',
//                           height: '69px',
//                           borderRadius: '4px',
//                           overflow: 'hidden',
//                           objectFit: 'cover',
//                         }}
//                       />
//                       <div className={styles.eventAlignment}>
//                         <p style={{ fontSize: '14px', fontWeight: '400' }}>
//                           {name}
//                         </p>
//                         <p style={{ fontSize: '12px', color: '#999999' }}>
//                           @ {owner?.username}
//                         </p>
//                         <p
//                           style={{
//                             color: ' #4059AD',
//                             fontSize: '14px',
//                             fontWeight: '400',
//                             marginTop: '4px',
//                           }}
//                         >
//                           {data?.class === 'FREE' ? 'Free' : 'Paid'}
//                         </p>
//                       </div>
//                     </main>
//                     <img
//                       src={Live}
//                       alt=""
//                       style={{ overflow: 'hidden', objectFit: 'cover' }}
//                     />
//                   </Link>
//                 </div>
//               )
//             );
//           })
//         : null}
//       {wordEntered.length !== 0 && isCurrentTab === 'Upcoming'
//         ? filteredData.map((data) => {
//             // eslint-disable-next-line @typescript-eslint/naming-convention
//             const { id, status, image, owner, name } = data;
//             return (
//               status === 'PENDING' && (
//                 <div key={id}>
//                   <Link
//                     to={`/event/${data.event_code}`}
//                     style={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       marginBottom: '20px',
//                     }}
//                   >
//                     <main key={id} style={{ display: 'flex', gap: '18px' }}>
//                       <img
//                         src={image}
//                         alt=""
//                         style={{
//                           width: '71px',
//                           height: '69px',
//                           borderRadius: '4px',
//                           overflow: 'hidden',
//                           objectFit: 'cover',
//                         }}
//                       />
//                       <div className={styles.eventAlignment}>
//                         <p style={{ fontSize: '14px', fontWeight: '400' }}>
//                           {name}
//                         </p>
//                         <p style={{ fontSize: '12px', color: '#999999' }}>
//                           @ {owner?.username}
//                         </p>

//                         <p
//                           style={{
//                             color: ' #4059AD',
//                             fontSize: '14px',
//                             fontWeight: '400',
//                             marginTop: '4px',
//                           }}
//                         >
//                           {data?.class === 'FREE' ? 'Free' : 'Paid'}
//                         </p>
//                       </div>
//                     </main>
//                     <img src={upcoming} alt="" />
//                   </Link>
//                 </div>
//               )
//             );
//           })
//         : null}
//       <section>
//         {/* {events?.map((eventss: any) => {
//           return (
//             <EventsListItem
//               hostName={eventss.owner}
//               eventName={eventss.name}
//               tags={eventss.tags}
//               image={eventss.image}
//             />
//           );
//         })} */}
//         {/* {eventResults?.filter((eventResult: any) => {
//           const { name } = eventResult;
//           console.log(name, 'tomiwa');

//           return name;
//         })} */}
//         {/* <EventsList1 loading={isLoading} data={events?.data} /> */}
//         {/* {!wordEntered && (
//           <SearchEventWrapper
//             data={searchResult?.length === 0 ? events?.data : searchResult}
//           />
//         )} */}
//         {!wordEntered && (
//           <div className={styles.searchBase}>
//             {events?.data.map((live) => {
//               const { name, image, owner, id } = live;
//               return (
//                 <div className={styles.searchGridItem} key={id}>
//                   <Link to={`/event/${live.event_code}`}>
//                     <img
//                       src={image || altevent}
//                       alt=""
//                       style={{ overflow: 'hidden', objectFit: 'cover' }}
//                     />
//                     <div className={styles.topLiveText}>
//                       <p>{name}</p>
//                       <p>{owner?.username}</p>
//                     </div>
//                   </Link>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//         {/* data={searchResult?.length === 0 ? events?.data : searchResult} */}
//       </section>
//       {wordEntered.length !== 0 &&
//         !wordEntered.includes(foofoo) &&
//         isCurrentTab === 'Top' && (
//           <p className={styles.topHeaderStyle}>Live Streaming</p>
//         )}
//       {wordEntered.length !== 0 && isCurrentTab === 'Top' && (
//         <div className={styles.topLiveWrapper}>
//           {filteredData.map((live) => {
//             const { name, image, owner, id, status } = live;
//             return (
//               status === 'ACTIVE' && (
//                 <div className={styles.topLive} key={id}>
//                   <Link to={`/event/${live.event_code}`}>
//                     <img
//                       src={image || altevent}
//                       alt=""
//                       style={{ overflow: 'hidden', objectFit: 'cover' }}
//                     />
//                     <div className={styles.topLiveText}>
//                       <p>{name}</p>
//                       <p>{owner?.username}</p>
//                     </div>
//                   </Link>
//                 </div>
//               )
//             );
//           })}
//         </div>
//       )}
//     </main>
//   );
// }

// export default Search;
import styles from './Search.module.scss';
import { ReactComponent as ComingSoon } from '../../assets/icons/ComingSoon.svg';

function Search() {
  // comment
  return (
    <div>
      <div className={styles.ComingSoon}>
          <ComingSoon id={styles.icon} />
          <h5>Coming Soon...</h5>
        </div>
    </div>
  )
}

export default Search
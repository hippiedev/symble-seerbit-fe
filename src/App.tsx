import { Routes, Route } from 'react-router-dom';
import Pusher from 'pusher-js';
import { useLayoutEffect, useState, useEffect } from 'react';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import ForgotPass from './pages/ForgotPassword/ForgotPassword';
import Categories from './pages/Categories/Categories';
import TransactionPin from './pages/TransactionPin/TransactionPin';
import PrivateRoutes from './PrivateRoutes';
import MainScreen from './components/template/MainScreen/MainScreen';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Wallet from './pages/Wallet/Wallet';
import Notifications from './pages/Notifications/Notifications';
import Profile from './pages/Profile/Profile';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import CreateEvent from './pages/CreateEvent/CreateEvent';
import EditProfile from './pages/EditProfile/EditProfile';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import ChangePin from './pages/ChangePin/ChangePin';
import UpComingEvent from './pages/UpcomingEvent/UpComingEvent';
import TransactionHistory from './pages/TransactionHistory/TransactionHistory';
import Live from './pages/Live/Live';
import Shop from './pages/Shop/Shop';
import PublicEvent from './pages/PublicEvent/PublicEvent';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import Checkout from './pages/Checkout/Checkout';
import Products from './pages/Products/Products';
import AddProduct from './pages/AddProduct/AddProduct';
import Settings from './pages/Settings/Settings';
import AddYoutubeVideo from './pages/AddYoutubeVideo/AddYoutubeVideo';
import Follows from './pages/Follows/Follows';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import EnterPin from './components/organisms/EnterPin/EnterPin';
import { handleCloseEnterPinDrawer } from './redux/feature/user/userSlice';
import Popup from './components/UI/molecules/Popup/Popup';
import { Notification } from './constants/types';
import LiveRoom from './pages/Live/LiveRoom/LiveRoom';

function App() {
  const user = useAppSelector((state: RootState) => state.user.user);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  useEffect(() => {
    if (showPopup) {
      setTimeout(() => setShowPopup(false), 6000);
    }
  }, [showPopup]);
  const updateNotifications = (data: Notification) => {
    console.log('new shitt');
    console.log(data);
    const newArray = notifications.slice(0);
    newArray.unshift(data);
    setNotifications(newArray);
    setShowPopup(true);
  };
  useLayoutEffect(() => {
    const pusher = new Pusher('14396d60e466962a3fbd', {
      cluster: 'eu',
    });
    const channel = pusher.subscribe('notification');
    channel.bind(`event-created-${user?.id}`, updateNotifications);
    channel.bind(`event-instant-${user?.id}`, updateNotifications);
    channel.bind(`event-start-${user?.id}`, updateNotifications);
    channel.bind(`event-live-${user?.id}`, updateNotifications);
    channel.bind(`event-subscription-${user?.id}`, updateNotifications);
    channel.bind(`event-reminder-${user?.id}`, updateNotifications);
    channel.bind(`user-follow-${user?.id}`, updateNotifications);
  }, []);
  console.log(notifications);
  const { showEnterPinDrawer, nextEnterPinAction } = useAppSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useAppDispatch();
  return (
    <div className="App">
      <Popup
        show={showPopup}
        message={notifications[0]?.message}
        variant="notification"
      />
      <EnterPin
        show={showEnterPinDrawer}
        action={nextEnterPinAction}
        closeDrawer={() => dispatch(handleCloseEnterPinDrawer())}
      />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/">
            <Route path="event/testroom/:eventCode" element={<LiveRoom />} />
            <Route path="event/live/:eventCode" element={<Live />} />
            <Route path="categories" element={<Categories />} />

            <Route path="settings" element={<Settings />} />
            <Route path="set-transaction-pin" element={<TransactionPin />} />
          </Route>
          <Route path="/" element={<MainScreen />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path=":username" element={<Profile isAuthUser={false} />} />
            <Route
              path=":username/followers"
              element={<Follows display="followers" isAuthUser={false} />}
            />
            <Route
              path="/profile/followers"
              element={<Follows display="followers" isAuthUser />}
            />
            <Route
              path="/profile/following"
              element={<Follows display="following" isAuthUser />}
            />
            <Route
              path=":username/following"
              element={<Follows display="following" isAuthUser={false} />}
            />
            <Route path="wallet" element={<Wallet />} />
            <Route
              path="/wallet/transactions"
              element={<TransactionHistory />}
            />
            <Route path="notifications" element={<Notifications />} />

            <Route path="profile" element={<Profile isAuthUser />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="change-pin" element={<ChangePin />} />
            <Route path="cart" element={<Checkout />} />
            <Route path="add-youtube-video" element={<AddYoutubeVideo />} />
          </Route>
          <Route path="products" element={<Products />} />
          <Route path="shop" element={<Shop />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="product/edit/:productId" element={<AddProduct edit />} />
          <Route path="/event/:eventCode" element={<PublicEvent />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="upcoming-event" element={<UpComingEvent />} />
        </Route>
        <Route path="/">
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPass />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;

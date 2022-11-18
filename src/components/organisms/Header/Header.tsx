import { useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import styles from './Header.module.scss';
import { ReactComponent as RightArrow } from '../../../assets/icons/rightArrow.svg';
import { ReactComponent as LiveTV } from '../../../assets/icons/liveTV.svg';
import { ReactComponent as PartyIcon } from '../../../assets/icons/partyIcon.svg';
import { ReactComponent as PartyBalloon } from '../../../assets/icons/partyBalloon.svg';
import { ReactComponent as Podcasts } from '../../../assets/icons/microphone.svg';
import { ReactComponent as AuctionLine } from '../../../assets/icons/auctionLine.svg';
import { ReactComponent as MarketingIcon } from '../../../assets/icons/marketingIcon.svg';
import { ReactComponent as CharityIcon } from '../../../assets/icons/charityIcon.svg';
import { ReactComponent as AdvertIcon } from '../../../assets/icons/adsClick.svg';
import { ReactComponent as LiveCommerce } from '../../../assets/icons/shopOutline.svg';
import { ReactComponent as Comedy } from '../../../assets/icons/theaterComedy.svg';
import { ReactComponent as Education } from '../../../assets/icons/educationIcon.svg';

function NavItems() {
  const [activeCategoryItem, setActiveCategoryItem] = useState('all');
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const handleSearchParam = (param: string) => {
    navigate({
      pathname: '/',
      search: createSearchParams({
        category: param,
      }).toString(),
    });
    setActiveCategoryItem(param);
  };

  useEffect(() => {
    setActiveCategoryItem(params.get('category') || 'all');
  }, [params]);

  return (
    <div className={styles.NavItems}>
      <div
        onClick={() => {
          navigate('/');
          setActiveCategoryItem('all');
        }}
        className={`${activeCategoryItem === 'all' ? styles.active : null}`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div id={styles.NavIcon}>
            <LiveTV />
          </div>
          <h5 id={styles.NavText}>All</h5>
        </div>
      </div>
      <div
        onClick={() => handleSearchParam('concert')}
        className={`${activeCategoryItem === 'concert' ? styles.active : null}`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div className={styles.NavIcon} id={styles.NavIcon}>
            <PartyIcon />
          </div>
          <h5 id={styles.NavText}>Concert</h5>
        </div>
      </div>
      <div
        onClick={() => handleSearchParam('parties')}
        className={`${activeCategoryItem === 'parties' ? styles.active : null}`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div className={styles.NavIcon} id={styles.NavIcon}>
            <PartyBalloon />
          </div>
          <h5 id={styles.NavText}>Parties</h5>
        </div>
      </div>
      <div
        onClick={() => handleSearchParam('podcasts')}
        className={`${
          activeCategoryItem === 'podcasts' ? styles.active : null
        }`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div className={styles.NavIcon} id={styles.NavIcon}>
            <Podcasts />
          </div>
          <h5 id={styles.NavText}>Podcasts</h5>
        </div>
      </div>
      <div
        onClick={() => handleSearchParam('auctions')}
        className={`${
          activeCategoryItem === 'auctions' ? styles.active : null
        }`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div className={styles.NavIcon} id={styles.NavIcon}>
            <AuctionLine />
          </div>
          <h5 id={styles.NavText}>Auctions</h5>
        </div>
      </div>
      <div
        onClick={() => handleSearchParam('marketing')}
        className={`${
          activeCategoryItem === 'marketing' ? styles.active : null
        }`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div className={styles.NavIcon} id={styles.NavIcon}>
            <MarketingIcon />
          </div>
          <h5 id={styles.NavText}>Marketing</h5>
        </div>
      </div>
      <div
        onClick={() => handleSearchParam('charity donations')}
        className={`${
          activeCategoryItem === 'charity donations' ? styles.active : null
        }`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div className={styles.NavIcon} id={styles.NavIcon}>
            <CharityIcon />
          </div>
          <h5 id={styles.NavText}>Charity</h5>
        </div>
      </div>
      <div
        onClick={() => handleSearchParam('adverts')}
        className={`${activeCategoryItem === 'adverts' ? styles.active : null}`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div className={styles.NavIcon} id={styles.NavIcon}>
            <AdvertIcon />
          </div>
          <h5 id={styles.NavText}>Adverts</h5>
        </div>
      </div>
      <div
        onClick={() => handleSearchParam('live commerce')}
        className={`${
          activeCategoryItem === 'live commerce' ? styles.active : null
        }`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div className={styles.NavIcon} id={styles.NavIcon}>
            <LiveCommerce />
          </div>
          <h5 id={styles.NavText}>Live Commerce</h5>
        </div>
      </div>
      <div
        onClick={() => handleSearchParam('comedy')}
        className={`${activeCategoryItem === 'comedy' ? styles.active : null}`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div className={styles.NavIcon} id={styles.NavIcon}>
            <Comedy />
          </div>
          <h5 id={styles.NavText}>Comedy</h5>
        </div>
      </div>
      <div
        onClick={() => handleSearchParam('education')}
        className={`${
          activeCategoryItem === 'education' ? styles.active : null
        }`}
      >
        <div id={styles.NavItem} className={styles.NavItem}>
          <div className={styles.NavIcon} id={styles.NavIcon}>
            <Education />
          </div>
          <h5 id={styles.NavText}>Education</h5>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  return (
    <header className={styles.Header}>
      <div className={styles.TopHeader}>
        <span>
          <h2>Categories</h2>
          <RightArrow style={{ marginTop: '3px' }} />
        </span>
      </div>
      <div className={styles.NavWrap}>
        <NavItems />
      </div>
    </header>
  );
}

export default Header;

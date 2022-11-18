import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Shop.module.scss';
import shopDress from '../../assets/images/shopDress.png';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import Product from '../../components/organisms/Product/Product';
import Button from '../../components/UI/atoms/Button/Button';

function Shop() {
  const navigate = useNavigate();
  return (
    <FeatureScreen>
      <main className={styles.Shop}>
        <header className={styles.ShopHeader}>
          <h2 className={styles.titleText}>Shop</h2>
          <p className={styles.subText}>Select all the items you wish to buy</p>
        </header>
        <section>
          <Product
            image={shopDress}
            productName="Shiny pink dress"
            productPrice="25 coins"
            productLeft="5 units left"
            shop
          />
          <Product
            image={shopDress}
            productName="Shiny pink dress"
            productPrice="25 coins"
            productLeft="5 units left"
            shop
          />
          <Product
            image={shopDress}
            productName="Shiny pink dress"
            productPrice="25 coins"
            productLeft="5 units left"
            shop
          />
        </section>
        <div className={styles.Button}>
          <Button clicked={() => navigate('/cart')}>View cart</Button>
        </div>
      </main>
    </FeatureScreen>
  );
}

export default Shop;

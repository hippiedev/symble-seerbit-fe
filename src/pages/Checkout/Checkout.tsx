import React, { useState } from 'react';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import Button from '../../components/UI/atoms/Button/Button';
import { TextArea, TextInput } from '../../components/UI/atoms/Input/Input';
import styles from './Checkout.module.scss';
import ShopDress from '../../assets/images/shopDress.png';
import x from '../../assets/icons/x.svg';
import editPurple from '../../assets/icons/editPurple.svg';

function Checkout() {
  const [checkout, setCheckout] = useState(0);
  const [hasDeliveryDetails, setHasDeliveryDetails] = useState(true);

  const NextCheckout = () => {
    setCheckout(checkout + 1);
  };
  if (checkout === 0) {
    return (
      <FeatureScreen>
        <main className={styles.Checkout}>
          <header className={styles.CheckoutHeader}>
            <h1>Cart</h1>
            <p>Items in cart</p>
          </header>
          <section>
            <div className={styles.checkoutItemContainer}>
              <div className={styles.checkoutItem}>
                <img
                  src={ShopDress}
                  className={styles.checkoutItemImage}
                  alt=""
                />
                <div>
                  <h6>Shiny pink dress</h6>
                  <p>N25000</p>
                </div>
              </div>
              <div>
                <img src={x} alt="" />
              </div>
            </div>
          </section>
          <p className={styles.total}>Total: N8500</p>
          <div className={styles.Button}>
            <Button clicked={NextCheckout}>Checkout</Button>
          </div>
        </main>
      </FeatureScreen>
    );
  }
  return (
    <FeatureScreen>
      <main className={styles.Checkout}>
        <header className={styles.CheckoutHeader}>
          <h1>Checkout</h1>
          {hasDeliveryDetails ? (
            <p>Kindly confirm your delivery information or edit it.</p>
          ) : (
            <p>
              Kindly share your delivery/shipping information with us to get
              your ordered products
            </p>
          )}
        </header>
        <section>
          {hasDeliveryDetails ? (
            <div className={styles.phoneNumber}>
              <span>Delivery address</span>
              <p>Lorem ipcum dolor sit amet test test address</p>
            </div>
          ) : (
            <TextArea
              inputName="Delivery address"
              inputStyle={{ marginBottom: '15px' }}
            />
          )}
          {hasDeliveryDetails ? (
            <div className={styles.countryprovinceflex1}>
              <div className={styles.phoneNumber}>
                <span>Country</span>
                <p>Nigeria</p>
              </div>

              <div className={styles.phoneNumber}>
                <span>State/Province</span>
                <p>Lagos</p>
              </div>
            </div>
          ) : (
            <div className={styles.countryprovinceflex}>
              <div>
                <TextInput
                  inputName="Country"
                  inputStyle={{ width: '164.84px' }}
                />
              </div>
              <div>
                <TextInput
                  inputName="State/Province"
                  inputStyle={{ width: '138.25px' }}
                />
              </div>
            </div>
          )}
          {hasDeliveryDetails ? (
            <div className={styles.phoneNumber}>
              <span>Phone number (with country code)</span>
              <p>+234 444 ISA META4</p>
            </div>
          ) : (
            <TextInput
              inputName="Phone number (with country code)"
              placeholder="e.g. +(234)81234750"
              // inputStyle={{marginBottom:"22px"}}
            />
          )}
          <div className={styles.checkbox}>
            {hasDeliveryDetails ? (
              <div
                className={styles.checkbox}
                onClick={() => setHasDeliveryDetails(false)}
              >
                <img src={editPurple} alt="" />
                <p>Edit delivery information</p>
              </div>
            ) : (
              <>
                <input type="checkbox" />
                <p>Save delivery details</p>
              </>
            )}
          </div>
        </section>
        <div className={styles.Button}>
          <Button>Buy 2 items</Button>
        </div>
      </main>
    </FeatureScreen>
  );
}

export default Checkout;

import React from 'react';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import Button from '../../components/UI/atoms/Button/Button';
import { TextInput } from '../../components/UI/atoms/Input/Input';
import styles from './EditProduct.module.scss';
import ShopDress from '../../assets/images/shopDress.png';

function EditProduct() {
  return (
    <FeatureScreen>
      <main className={styles.EditProduct}>
        <header className={styles.EditProductHeader}>
          <h1>Edit product</h1>
        </header>
        <section>
          <div className={styles.EditProductImage}>
            <img src={ShopDress} alt="" />
            <p>Change product image</p>
          </div>
        </section>
        <section>
          <div className={styles.InputStyle}>
            <TextInput inputName="Product name" />
          </div>
          <div className={styles.InputStyle}>
            <TextInput
              inputName="Product amount"
              inputStyle={{ width: '158px' }}
            />
          </div>
          <div className={styles.InputStyle}>
            <TextInput
              inputName="Units available (e.g. 1,2,3 etc.)"
              inputStyle={{ width: '178px' }}
            />
          </div>
        </section>
        <div className={styles.Button}>
          <Button>Save</Button>
        </div>
      </main>
    </FeatureScreen>
  );
}

export default EditProduct;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import styles from './Products.module.scss';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import Product from '../../components/organisms/Product/Product';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { useGetUserProductsQuery } from '../../redux/feature/user/userApiSlice';
import productImagePlaceholder from '../../assets/icons/productImagePlaceholder.svg';
import Spinner from '../../components/UI/atoms/Spinner/Spinner';
import Button from '../../components/UI/atoms/Button/Button';

function Products() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const {
    data: products,
    isSuccess,
    isLoading,
  } = useGetUserProductsQuery(`${user?.username}`);
  console.log(products);
  if (products?.length === 0) {
    return (
      <FeatureScreen>
        <main className={styles.Products}>
          <header className={styles.ProductsHeader}>
            <h1>Your products</h1>
          </header>
          <section className={styles.ProductsEmpty}>
            <h6>You have no products added</h6>
            <p onClick={() => navigate('/add-product')}>+ Add new product</p>
          </section>
        </main>
      </FeatureScreen>
    );
  }
  return (
    <FeatureScreen>
      <main className={styles.Products}>
        <header className={styles.ProductsHeader}>
          <h1>Your products</h1>
        </header>
        <section>
          <Button clicked={() => navigate('/add-product')} variant="text">
            + Add new product
          </Button>
        </section>
        <section>
          {isLoading ? (
            <div className={styles.LoadingWrap}>
              <Spinner />
            </div>
          ) : isSuccess ? (
            products.map((product) => (
              <div key={nanoid()} className={styles.Wrapper}>
                <Product
                  id={product.id}
                  image={
                    product.images ? product.images[0] : productImagePlaceholder
                  }
                  productName={product.name}
                  productPrice={`${Number(
                    product.price.$numberDecimal,
                  ).toLocaleString()}`}
                  productLeft={`${product.quantity} units left`}
                  products
                />
              </div>
            ))
          ) : null}
        </section>
        {/* <div className={styles.Button}>
                    <Button>Checkout</Button>
                </div> */}
      </main>
    </FeatureScreen>
  );
}

export default Products;

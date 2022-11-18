import { nanoid } from '@reduxjs/toolkit';
import styles from './EventProducts.module.scss';

function Product({
  images,
  name,
  price,
}: {
  name: string;
  images: string[];
  price: string;
}) {
  return (
    <div className={styles.Product}>
      <img src={images[0]} alt={name} />
      <p id={styles.ProductName}>{name}</p>
      <p id={styles.ProductPrice}>{`&#8358;${Number(
        price,
      ).toLocaleString()}`}</p>
    </div>
  );
}

function EventProducts({
  products,
}: {
  products?: {
    images: string[];
    name: string;
    quantity: number;
    price: { $numberDecimal: string };
  }[];
}) {
  return (
    <div className={styles.Products}>
      <div className={styles.Heading}>
        <h2>Event Products</h2>
        <p>These are the products you selected to be displayed and sold</p>
      </div>
      <div className={styles.ProductsWrap}>
        {products?.map((product) => (
          <Product
            key={nanoid()}
            name={product.name}
            price={product.price.$numberDecimal}
            images={product.images}
          />
        ))}
      </div>
    </div>
  );
}

export default EventProducts;

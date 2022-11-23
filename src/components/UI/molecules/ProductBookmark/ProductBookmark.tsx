import { Product } from '../../../../constants/types';
import Button from '../../atoms/Button/Button';
import styles from './ProductBookmark.module.scss';

function ProductBookmark({ product }: { product: Product }) {
  return (
    <div className={styles.ProductBookmark}>
      <div
        className={styles.Media}
        style={{ backgroundImage: `url(${product?.images[0]})` }}
      >
        <span className={styles.PriceTag}>
          &#8358;{Number(product?.price.$numberDecimal).toLocaleString()}
        </span>
      </div>
      <p className={styles.ProductName}>{product?.name}</p>
      <a href={product.paymentLinkUrl} target="__blank">
        <Button buttonStyles={{ padding: '8px 22px', fontSize: '12px' }}>
          Buy now
        </Button>
      </a>
    </div>
  );
}

export default ProductBookmark;

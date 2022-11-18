import { useEffect, useState } from 'react';
import styles from './LiveProducts.module.scss';
import { Product } from '../../../constants/types';
import Button from '../../UI/atoms/Button/Button';
import { ReactComponent as BookmarkIcon } from '../../../assets/icons/bookmark.svg';
import { ReactComponent as BookmarkIconFill } from '../../../assets/icons/bookmarkFill.svg';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { useBookmarkProductMutation } from '../../../redux/feature/shop/shopApiSlice';
import { productBookmarkHandler } from '../../../redux/feature/user/userSlice';
// import { onEditProfile } from '../../../redux/feature/user/userSlice';

export function LiveProduct({
  product,
  id,
}: {
  product: Product;
  id: String | undefined;
}) {
  const dispatch = useAppDispatch();
  const bookmarkedProducts = useAppSelector(
    (state: RootState) => state.user.bookmarkedProducts,
  );
  const [bookmarkProduct, { isSuccess, isLoading, error }] =
    useBookmarkProductMutation();
  const { user: owner } = useAppSelector((state: RootState) => state.user);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  let isProductBookmarked;
  const isProductExisting = bookmarkedProducts.find(
    (productId) => product.id === productId,
  );
  if (isProductExisting) {
    isProductBookmarked = true;
    console.log('yeah');
  } else {
    isProductBookmarked = false;
    console.log('nope');
  }

  // const [
  //   deleteProductBookmark,
  //   { isSuccess: onSuccess, isLoading: onLoading, error: deleteError },
  // ] = useDeleteProductBookmarkMutation();
  console.log(bookmarkedProducts);
  const handleBookMarkProduct = async () => {
    console.log(product.id);
    try {
      const response = await bookmarkProduct({
        user: id,
        productId: product.id,
      }).unwrap();
      dispatch(productBookmarkHandler(response.products));
      console.log(response, isSuccess);
    } catch (e) {
      console.log(e, error, isLoading);
    }
  };

  useEffect(() => {
    if (isSuccess && !bookmarked && !isProductExisting) {
      setBookmarked(true);
    } else {
      setBookmarked(false);
    }
  }, [isSuccess]);

  // const handleDeleteProductBookmark = async () => {
  //   try {
  //     const response = await deleteProductBookmark({
  //       user,
  //       productId: product.id,
  //     }).unwrap();
  //     //   dispatch(onEditProfile(response));
  //     console.log(response, onSuccess);
  //     setBookmarked(false);
  //   } catch (e) {
  //     console.log(e, deleteError, onLoading);
  //   }
  // };

  // const handleUpdateBookmark = () => {
  //   const isBookmarked = user?.bookmarks.products.find(
  //     (productItem) => productItem.id === product.id,
  //   );
  //   if (isBookmarked) {
  //     handleDeleteProductBookmark();
  //   } else {
  //     handleBookMarkProduct();
  //   }
  // };
  console.log(isLoading, product.id);
  return (
    <div className={styles.Product}>
      <div
        className={styles.Media}
        style={{ backgroundImage: `url(${product.images[0]})` }}
      >
        {isProductBookmarked ? (
          <BookmarkIconFill
            className={styles.Bookmark}
            onClick={!isLoading ? () => handleBookMarkProduct() : undefined}
          />
        ) : id !== owner?.id ? (
          <BookmarkIcon
            onClick={!isLoading ? () => handleBookMarkProduct() : undefined}
            className={styles.Bookmark}
          />
        ) : null}
        <span className={styles.PriceTag}>
          &#8358;{Number(product.price.$numberDecimal).toLocaleString()}
        </span>
      </div>
      <p>{product.name}</p>
      <a href={product.url} target="__blank">
        <Button
          buttonStyles={{
            backgroundColor: '#24164C',
            padding: '8px 22px',
            fontSize: '12px',
            width: '100%',
          }}
        >
          Buy now
        </Button>
      </a>
    </div>
  );
}

function LiveProducts({
  products,
  user,
}: {
  products: Product[] | [];
  user: string | undefined;
}) {
  return (
    <div className={styles.LiveProducts}>
      <h2 className={styles.Heading}>Shop</h2>
      <div className={styles.ProductsWrapper}>
        {products.map((productItem) => {
          return (
            <LiveProduct key={productItem.id} id={user} product={productItem} />
          );
        })}
      </div>
    </div>
  );
}

export default LiveProducts;

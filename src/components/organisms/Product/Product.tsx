import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../UI/atoms/Button/Button';
import styles from './Product.module.scss';
import edit from '../../../assets/icons/editGold.svg';
import deleteRed from '../../../assets/icons/deleteRed.svg';
import { useDeleteProductMutation } from '../../../redux/feature/shop/shopApiSlice';
import Spinner from '../../UI/atoms/Spinner/Spinner';
import ActionModal from '../../UI/molecules/ActionModal/ActionModal';

function Product({
  productName,
  productPrice,
  image,
  id,
  shop,
  products,
  productLeft,
}: {
  productName: string;
  productPrice: string;
  products?: boolean;
  image: string;
  shop?: boolean;
  productLeft: string;
  id?: string;
}) {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [deleteProduct, { isLoading, isSuccess, isError, error }] =
    useDeleteProductMutation();
  const handleDeleteProduct = async () => {
    try {
      const response = await deleteProduct(`${id}`).unwrap();
      console.log(response, isSuccess);
    } catch (e) {
      console.log(e, isError, error);
    }
  };
  return (
    <>
      <ActionModal
        showActionModal={showPrompt}
        variant="warning"
        acceptFn={handleDeleteProduct}
        closeModal={() => setShowPrompt(false)}
        message={<p>Are you sure you want to delete this product?</p>}
      />
      <main className={styles.Product}>
        <img className={styles.ProductImage} src={image} alt="" />
        <div className={styles.productDetails}>
          <p id={styles.productName}>{productName}</p>
          <p id={styles.productPrice}>&#8358;{productPrice}</p>
          <p className={styles.productLeft}>{productLeft}</p>
          {shop && (
            <div>
              <Button
                buttonStyles={{
                  backgroundColor: '#24164C',
                  color: '#EFF2F1',
                  padding: '8px 13px',
                }}
              >
                Add to cart
              </Button>
            </div>
          )}
          {products && (
            <div className={styles.deleteEdit}>
              <div
                onClick={() => navigate(`/product/edit/${id}`)}
                className={styles.Edit}
              >
                <img src={edit} alt="" />
                <p>Edit</p>
              </div>
              {isLoading ? (
                <Spinner />
              ) : (
                <div
                  onClick={() => setShowPrompt(true)}
                  className={styles.Delete}
                >
                  <img src={deleteRed} alt="" />
                  <p>Delete</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Product;

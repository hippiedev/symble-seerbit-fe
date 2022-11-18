import { useRef, useState, useEffect } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios, { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import Button from '../../components/UI/atoms/Button/Button';
import { TextInput } from '../../components/UI/atoms/Input/Input';
import styles from './AddProduct.module.scss';
import productImagePlaceholder from '../../assets/icons/productImagePlaceholder.svg';
import Spinner from '../../components/UI/atoms/Spinner/Spinner';
import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from '../../redux/feature/shop/shopApiSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { onCreateProduct } from '../../redux/feature/shop/shopSlice';
import Popup from '../../components/UI/molecules/Popup/Popup';
import { RootState } from '../../redux/store';

function AddProduct({ edit }: { edit?: boolean }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    data: product,
    isLoading: loading,
    isSuccess: success,
  } = useGetProductQuery(`${productId}`, { skip: !edit });
  console.log(`success: ${success}`);
  console.log(product);
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [price, setPrice] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<unknown>();
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [createProduct, { isLoading, isSuccess, error, isError }] =
    useCreateProductMutation();
  const [
    editProduct,
    {
      isLoading: editLoading,
      isError: hasEditError,
      error: editError,
      isSuccess: editSuccess,
    },
  ] = useUpdateProductMutation();
  const dispatch = useAppDispatch();
  const message = useAppSelector((state: RootState) => state.shop.message);
  console.log(edit);
  const initialValues = {
    name: edit && success ? product.name : '',
    quantity: edit && success ? `${product.quantity}` : '',
    url: edit && success ? `${product.url}` : '',
  };
  const validationSchema = Yup.object({
    name: Yup.string().required('This is a required field'),
    url: Yup.string().required('This is a required field'),
    quantity: Yup.number().required('This is a required field'),
  });

  const handlePriceInput = (values) => {
    setPrice(values.value);
  };

  const onSubmit = async (values) => {
    const submitValues = {
      ...values,
      images: imageUrl ? [imageUrl] : product?.images ? product?.images : null,
      price: price || product?.price,
    };
    if (edit && success) {
      const toEditSubmitValues = { ...submitValues, id: product?.id };
      try {
        const response = await editProduct(toEditSubmitValues).unwrap();
        dispatch(onCreateProduct(response));
        console.log(response);
        navigate(-1);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const response = await createProduct(submitValues).unwrap();
        dispatch(onCreateProduct(response));
        navigate(-1);
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }
  };
  console.log(
    product?.price.$numberDecimal,
    price,
    price !== product?.price.$numberDecimal,
  );
  const clickInput = () => {
    if (fileInputRef.current === null) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };
  console.log(image);
  const uploadImage = async (imageValue) => {
    const formData = new FormData();
    if (imageValue) {
      formData.append('file', imageValue);
      formData.append('upload_preset', 'fcu6qtja');
    }
    try {
      setIsImageLoading(true);
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/Spray/upload/',
        formData,
      );
      console.log(res.data);
      setImageUrl(res?.data.secure_url);
      setIsImageLoading(false);
    } catch (axiosError) {
      setIsImageLoading(false);
      const err = axiosError as AxiosError;
      setUploadError(err.message || (err?.response?.data as string));
    }
  };

  useEffect(() => {
    if (image && !imageUrl) {
      uploadImage(image);
    }
  }, [image]);

  return (
    <>
      <Popup
        show={
          isSuccess ||
          isError ||
          (uploadError as boolean) ||
          hasEditError ||
          editSuccess
        }
        variant={
          isSuccess || editSuccess
            ? 'success'
            : isError || (uploadError as boolean) || hasEditError || editSuccess
            ? 'error'
            : undefined
        }
        message={
          isSuccess || editSuccess
            ? message || undefined
            : isError || (uploadError as boolean)
            ? (
                error as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message ||
              (
                editError as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message
            : undefined
        }
      />
      {edit && loading ? (
        <div className={styles.LoadingWrap}>
          <Spinner />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ values, handleChange, handleBlur, touched, errors, dirty }) => (
            <Form>
              <FeatureScreen>
                <main className={styles.EditProduct}>
                  <header className={styles.EditProductHeader}>
                    <h1>Add product</h1>
                  </header>
                  <section>
                    <div className={styles.EditProductImage}>
                      <img
                        src={
                          imageUrl || product?.images
                            ? imageUrl || product?.images[0]
                            : imageUrl || productImagePlaceholder
                        }
                        alt=""
                      />
                      <input
                        style={{ display: 'none' }}
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        id="image"
                        name={image?.name}
                      />
                      <span onClick={clickInput}>Select product image</span>
                      {isImageLoading ? <Spinner /> : null}
                    </div>
                  </section>
                  <section>
                    <div className={styles.InputStyle}>
                      <TextInput
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id="name"
                        name="name"
                        inputName="Product name"
                        error={touched.name && errors.name}
                      />
                      {touched.name && errors.name ? (
                        <p id={styles.error}>{errors.name}</p>
                      ) : null}
                    </div>
                    <div className={styles.InputStyle}>
                      <TextInput
                        inputName="External link to product"
                        extraLabelText="e.g: https://example.com/my-product"
                        id="url"
                        value={values.url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="url"
                        type="url"
                        error={touched.url && errors.url}
                      />
                      {touched.url && errors.url ? (
                        <p id={styles.error}>{errors.url}</p>
                      ) : null}
                    </div>
                    <div className={styles.InputStyle}>
                      <NumericFormat
                        prefix="&#8358;"
                        thousandSeparator=","
                        customInput={TextInput}
                        decimalScale={2}
                        value={product?.price.$numberDecimal}
                        valueIsNumericString
                        inputName="Product price"
                        extraLabelText="required"
                        inputStyle={{ width: '158px' }}
                        onValueChange={handlePriceInput}
                        name="price"
                        id="price"
                        inputMode="decimal"
                      />
                    </div>
                    <div className={styles.InputStyle}>
                      <NumericFormat
                        customInput={TextInput}
                        inputName="Units available"
                        extraLabelText="e.g. 1,2,3 etc."
                        inputStyle={{ width: '178px' }}
                        id="quantity"
                        value={values.quantity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        inputMode="numeric"
                        name="quantity"
                        error={touched.quantity && errors.quantity}
                      />
                      {touched.quantity && errors.quantity ? (
                        <p id={styles.error}>{errors.quantity}</p>
                      ) : null}
                    </div>
                  </section>
                  <div className={styles.Button}>
                    <Button
                      disabled={
                        isLoading ||
                        isImageLoading ||
                        editLoading ||
                        ((edit && product?.price && price
                          ? product?.price.$numberDecimal === price
                          : true) &&
                          !dirty &&
                          (!imageUrl || !product?.images[0])) ||
                        (!imageUrl && !product?.images[0])
                      }
                      type="submit"
                    >
                      {edit && success ? 'Edit' : 'Add'}
                    </Button>
                  </div>
                </main>
              </FeatureScreen>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}

export default AddProduct;

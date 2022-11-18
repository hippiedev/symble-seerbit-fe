import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { SelectChangeEvent } from '@mui/material';
import { useLocalStorage } from 'react-use';
import { NumericFormat } from 'react-number-format';
import styles from './CreateEvent.module.scss';
import {
  DateInput,
  DropdownInput,
  FileInput,
  RadioButtons,
  TagsInputWrap,
  TextArea,
  TextInput,
  TimeInput,
} from '../../components/UI/atoms/Input/Input';
import { ReactComponent as DropdownIcon } from '../../assets/icons/dropdownIcon.svg';
import { ReactComponent as RemoveIcon } from '../../assets/icons/smallX.svg';
import Button from '../../components/UI/atoms/Button/Button';
import categories from '../../constants/categories-data';
import {
  useCreateEventsMutation,
  useStartEventMutation,
} from '../../redux/feature/events/eventsApiSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  handleStartEvent,
  setActiveEventData,
} from '../../redux/feature/events/eventsSlice';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import { ReactComponent as BackIcon } from '../../assets/icons/backIcon.svg';
import { ReactComponent as Settings } from '../../assets/icons/CreateEventSettings.svg';
import { RootState } from '../../redux/store';
import Popup from '../../components/UI/molecules/Popup/Popup';
import { useGetUserProductsQuery } from '../../redux/feature/user/userApiSlice';
import ProgressBar from '../../components/UI/atoms/ProgressBar/ProgressBar';
import Modal from '../../components/UI/molecules/Modal/Modal';

function CreateEvent() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const eventType = params.get('event_type') || 'instant';
  const [currentSection, setCurrentSection] = useState('first-section');

  const handleScreenNavigation = () => {
    if (currentSection === 'second-section') setCurrentSection('first-section');
    else if (currentSection === 'third-section')
      setCurrentSection('second-section');
  };

  const [accessFee, setAccessFee] = useState<string>('');

  const [cloudinaryImage, setCloudinaryImage] = useState<string | null>(null);

  const [uploadError, setUploadError] = useState<unknown>();

  const dispatch = useAppDispatch();

  const user = useAppSelector((state: RootState) => state.user.user);

  const { message, eventData } = useAppSelector(
    (state: RootState) => state.events,
  );

  const [
    startEvent,
    {
      isLoading: startLoading,
      isSuccess: onStartSuccess,
      isError: onStartError,
      error: startError,
    },
  ] = useStartEventMutation();

  const [createEvents, { isLoading, isSuccess, isError, error }] =
    useCreateEventsMutation();

  const [product, setProduct] = useState<string>('');

  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const [products, setProducts] = useState<
    import('../../constants/types').Product[] | undefined
  >([]);

  console.log(product, products);

  const { data: userProducts, isLoading: loading } = useGetUserProductsQuery(
    `${user?.username}`,
  );

  const productsOptions = userProducts?.map((productItem) => productItem.name);

  const [isUserEvent, setIsUserEvent] = useLocalStorage('isUserEvent', false);

  const [dateValue, setDateValue] = useState<Date | null>(new Date());

  const [timeValue, setTimeValue] = useState<Date | null>(dateValue);

  const [tags, settags] = useState<string[]>([]);

  const [cohostTags, setCohostTags] = useState<string[]>([]);

  const handleAccessFeeInput = (values) => {
    setAccessFee(values.value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);
  const initialValues: {
    name: string;
    description: string;
    category: string;
    isFree: string;
    isScheduled: string;
    address: string;
  } = {
    name: '',
    description: '',
    category: '',
    isFree: '',
    isScheduled: '',
    address: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Please enter the name of the event'),
    description: Yup.string().required("Please enter the event's description"),
    category: Yup.string().required('Please choose a category'),
    isFree: Yup.string(),
    address: Yup.string(),
  });

  const onSubmit = async (values) => {
    console.log('yeah');
    const submitValues = {
      ...values,
      isFree: eventType === 'instant' || values.isFree === 'Free',
      isScheduled: eventType !== 'instant',
      isPublic: true,
      scheduledDate: eventType === 'instant' ? null : timeValue,
      image: cloudinaryImage,
      tags,
      products: products?.map((productItem) => productItem.id),
      fee: values.isFree === 'Free' ? 0 : Number(accessFee),
    };
    console.log(submitValues);
    try {
      const response = await createEvents(submitValues).unwrap();
      dispatch(setActiveEventData(response));
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    setIsUserEvent(true);
    const startEventHandler = async () => {
      if (eventType === 'instant' && isSuccess) {
        try {
          const res = await startEvent(`${eventData?.event_code}`).unwrap();
          dispatch(handleStartEvent(res));
          navigate(`/event/live/${eventData?.event_code}`, { replace: true });
        } catch (e) {
          console.log(e);
        }
      }
    };
    startEventHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setIsUserEvent,
    isUserEvent,
    eventType,
    startEvent,
    eventData?.event_code,
    dispatch,
    navigate,
  ]);
  useEffect(() => {
    if (isSuccess && isUserEvent && eventType === 'scheduled') {
      navigate(`/event/${eventData?.event_code}`, { replace: true });
    }
  }, [isUserEvent, isSuccess, navigate, eventData?.event_code]);

  const handleSectionDisplay = (nextSection: string) => {
    // receive nextSection argument from handleSection prop and set current section to it
    setCurrentSection(nextSection);
  };

  const addProductTag = (prevTags, tagToAdd) => {
    // check if category has already been selected
    const existingTag = prevTags.find(
      (productItem) => productItem.id === tagToAdd.id,
    );

    if (existingTag) return;

    return [...prevTags, tagToAdd];
  };
  const removeProductTag = (prevTags, tagToRemove) => {
    const existingTag = prevTags.find(
      (productItem) => productItem.id === tagToRemove?.id,
    );

    if (existingTag) {
      return prevTags.filter((tag) => tag.id !== tagToRemove?.id);
    }
  };

  useEffect(() => {
    if (products?.length === 0 || !products) {
      setProduct('');
    }
  }, [products]);

  const [image, setImage] = useState<File>();

  const handleTimeChange = (newTime) => {
    setTimeValue(newTime);
  };

  const handleDateChange = (newDate) => {
    setDateValue(newDate);
    handleTimeChange(newDate);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleProductInput = (e: SelectChangeEvent) => {
    setProduct(e.target.value);
    console.log('state');
    setProducts(
      addProductTag(
        products,
        userProducts?.find(
          (productItem) => productItem.name === e.target.value,
        ),
      ),
    );
  };

  const uploadImage = async () => {
    setIsImageLoading(true);
    const formData = new FormData();
    if (image) {
      formData.append('file', image);
      formData.append('upload_preset', 'fcu6qtja');
    }
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/Spray/upload/',
        formData,
      );
      console.log(res.data);
      setCloudinaryImage(res?.data.secure_url);
      setIsImageLoading(false);
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      setUploadError(err.message || (err?.response?.data as string));
      setIsImageLoading(false);
    }
  };

  useEffect(() => {
    if (eventType === 'instant' && image) {
      uploadImage();
    }
  }, [image]);

  const handleCreateInstantEvent = () => {
    if (eventType !== 'instant') {
      if (image) {
        uploadImage();
      }
      handleSectionDisplay('second-section');
    }
  };

  const handletags = (e) => {
    settags(e);
  };
  const handleCohostTags = (e) => {
    setCohostTags(e);
  };
  const categoryOptions = categories.map((category) => category.name);
  const isFreeOptions = [
    { key: 'Free', value: 'Free' },
    { key: 'Paid', value: 'Paid' },
  ];

  return (
    <>
      <Popup
        show={
          isError || (uploadError as boolean) || onStartSuccess || onStartError
        }
        variant={
          isSuccess || onStartSuccess
            ? 'success'
            : isError || (uploadError as boolean) || onStartError
            ? 'error'
            : undefined
        }
        message={
          isSuccess
            ? message || undefined
            : isError || (uploadError as boolean)
            ? (
                error as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message ||
              (uploadError as string) ||
              (
                startError as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message
            : undefined
        }
      />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form>
            <FeatureScreen>
              <div className={styles.CreateEvent}>
                <div className={styles.Title}>
                  {currentSection === 'first-section' ? null : (
                    <BackIcon
                      id={styles.PrevIcon}
                      onClick={handleScreenNavigation}
                    />
                  )}
                  <h1>
                    {eventType === 'instant'
                      ? 'Instant event'
                      : 'Schedule event'}
                  </h1>
                </div>

                {eventType === 'instant' ||
                currentSection === 'third-section' ? null : (
                  <ProgressBar
                    progress={
                      currentSection === 'first-section'
                        ? '50%'
                        : currentSection === 'second-section'
                        ? '100%'
                        : '0%'
                    }
                  />
                )}
                <div
                  style={{
                    transform:
                      currentSection === 'first-section'
                        ? 'translateX(0)'
                        : 'translateX(-200%)',
                    marginTop: eventType === 'instant' ? '0px' : '31px',
                  }}
                  className={styles.FormSection}
                >
                  <div className={styles.Form}>
                    <div className={styles.InputWrap}>
                      <TextInput
                        name="name"
                        id="name"
                        value={values.name}
                        extraLabelText="required"
                        inputName="Event title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && errors.name}
                      />
                      {touched.name && errors.name ? (
                        <p id={styles.error}>{errors.name}</p>
                      ) : null}
                    </div>
                    <div className={styles.InputWrap}>
                      <TextArea
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        extraLabelText="required"
                        inputName="Description"
                        error={touched.description && errors.description}
                      />
                      {touched.description && errors.description ? (
                        <p id={styles.error}>{errors.description}</p>
                      ) : null}
                    </div>
                    <DropdownInput
                      iconComponent={DropdownIcon}
                      inputName="category"
                      extraLabelText="required"
                      options={categoryOptions}
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="category"
                      id="category"
                      error={!!(touched.category && errors.category)}
                    />
                    {touched.category && errors.category ? (
                      <p id={styles.error}>{errors.category}</p>
                    ) : null}
                    {values.category.toLowerCase() === 'live commerce' ? (
                      <>
                        <DropdownInput
                          iconComponent={DropdownIcon}
                          inputName="Products to be sold"
                          extraLabelText="required"
                          options={productsOptions}
                          value={product}
                          onChange={handleProductInput}
                          isLoading={loading}
                          name="product"
                          id="product"
                        />
                        {products?.length !== 0 ? (
                          <div className={styles.TagsWrap}>
                            {products?.map((productItem) => (
                              <span key={productItem?.id} id={styles.tag}>
                                <span>{productItem?.name}</span>
                                <RemoveIcon
                                  id={styles.removeIcon}
                                  onClick={() =>
                                    setProducts(
                                      removeProductTag(products, productItem),
                                    )
                                  }
                                />
                              </span>
                            ))}
                          </div>
                        ) : null}
                        {/* {touched.category && errors.category ? (
                      <p id={styles.error}>{errors.category}</p>
                    ) : null} */}
                      </>
                    ) : null}

                    <FileInput
                      name="image"
                      id="image"
                      fileName={image?.name}
                      onChange={handleFileChange}
                      inputName="Image"
                    />
                    <Button
                      disabled={
                        !!(
                          errors.name ||
                          isLoading ||
                          isImageLoading ||
                          errors.description ||
                          errors.category ||
                          values.name.length === 0
                        )
                      }
                      type={eventType === 'instant' ? 'submit' : 'button'}
                      clicked={() => {
                        if (eventType !== 'instant') {
                          handleCreateInstantEvent();
                        }
                      }}
                      buttonStyles={{ marginTop: '26px' }}
                    >
                      {eventType === 'instant' ? 'Go live!' : 'Next'}
                    </Button>
                    {(errors.name && touched.name) ||
                    (errors.description && touched.description) ||
                    (errors.category && touched.category) ? (
                      <p id={styles.errorsWrap}>
                        {Object.values(errors)
                          .slice(0, 1)
                          .map((errorItem) => (
                            <span key={nanoid()}>{errorItem}</span>
                          ))}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div
                  style={{
                    transform:
                      currentSection === 'second-section'
                        ? 'translateX(0)'
                        : 'translateX(-200%)',
                    marginTop: eventType === 'instant' ? '0px' : '31px',
                  }}
                  className={styles.FormSection}
                >
                  <div className={styles.RadioForm}>
                    <div className={styles.RadioWrap}>
                      <p>Set date and time</p>
                      <div className={styles.Wrapper}>
                        <DateInput
                          inputName="Event Date"
                          value={dateValue}
                          onChange={handleDateChange}
                        />
                        <TimeInput
                          inputName="Time"
                          value={timeValue}
                          onChange={handleTimeChange}
                        />{' '}
                      </div>
                    </div>
                    <div className={styles.RadioWrap}>
                      <RadioButtons
                        label="Is this event free or paid?"
                        name="isFree"
                        options={isFreeOptions}
                      />
                      {values.isFree === 'Paid' ? (
                        <div className={styles.InputWrap}>
                          <NumericFormat
                            customInput={TextInput}
                            prefix="&#8358;"
                            decimalScale={2}
                            thousandSeparator=","
                            valueIsNumericString
                            inputName="Event Fee"
                            name="access fee"
                            id="accessFee"
                            onValueChange={handleAccessFeeInput}
                            onBlur={handleBlur}
                            placeholder="Enter event fee"
                            inputMode="decimal"
                          />
                        </div>
                      ) : null}
                    </div>
                    <div
                      onClick={() => handleSectionDisplay('third-section')}
                      className={styles.AdditionalSettings}
                    >
                      <Settings />
                      <p>Additional settings</p>
                    </div>
                    <Button
                      disabled={isImageLoading || isLoading}
                      type={eventType !== 'instant' ? 'submit' : 'button'}
                      buttonStyles={{ marginTop: '26px' }}
                    >
                      Create Event
                    </Button>
                  </div>
                </div>

                <div
                  style={{
                    transform:
                      currentSection === 'third-section'
                        ? 'translateX(0)'
                        : 'translateX(-200%)',
                    marginTop: eventType === 'instant' ? '0px' : '31px',
                    top: eventType === 'instant' ? '110px' : '70px',
                  }}
                  className={styles.FormSection}
                >
                  <div className={styles.Form}>
                    <div className={styles.InputWrap}>
                      <TextArea
                        inputName="Physical location addess"
                        extraLabelText="if applicable"
                        name="address"
                        id="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address && errors.address}
                      />
                    </div>
                    <TagsInputWrap
                      value={tags}
                      onChange={handletags}
                      inputName="tags"
                      extraLabelText="use comma to seperate tags"
                    />
                    <TagsInputWrap
                      value={cohostTags}
                      onChange={handleCohostTags}
                      inputName="Add co-host"
                      extraLabelText="if applicable"
                    />
                    <Button
                      disabled={isLoading}
                      type={eventType !== 'instant' ? 'submit' : 'button'}
                      buttonStyles={{ marginTop: '10px' }}
                    >
                      Create Event
                    </Button>
                  </div>
                </div>
              </div>
            </FeatureScreen>
          </Form>
        )}
      </Formik>
      <Modal show={startLoading}>
        <p>Starting event...</p>
      </Modal>
    </>
  );
}

export default CreateEvent;

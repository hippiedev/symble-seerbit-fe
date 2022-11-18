import React, { useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import axios, { AxiosError } from 'axios';
import { NumericFormat } from 'react-number-format';
import Button from '../../components/UI/atoms/Button/Button';
import { TextArea, TextInput } from '../../components/UI/atoms/Input/Input';
import styles from './EditProfile.module.scss';
import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import {
  useGetAuthUserQuery,
  useUpdateUserMutation,
} from '../../redux/feature/user/userApiSlice';
import { onEditProfile } from '../../redux/feature/user/userSlice';
import Popup from '../../components/UI/molecules/Popup/Popup';
import Spinner from '../../components/UI/atoms/Spinner/Spinner';
import { onEditAuthUser } from '../../redux/feature/auth/authSlice';
import { ReactComponent as ArrowIcon } from '../../assets/icons/rightArrow.svg';

function EditProfile() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<unknown>();
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [showGeneralInfo, setShowGeneralInfo] = useState<boolean>(true);
  const [showPersonInfo, setShowPersonalInfo] = useState<boolean>(false);
  const {
    isLoading: getUserLoading,
    isSuccess: getUserSuccess,
    data: user,
  } = useGetAuthUserQuery(undefined);
  console.log(user);
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [updateUser, { isSuccess, error, isLoading, isError }] =
    useUpdateUserMutation();
  const dispatch = useAppDispatch();
  const message = useAppSelector((state: RootState) => state.user.message);
  const initialValues: {
    username: string;
    bio: string;
    country: string;
    email: string;
    phone: string;
    firstname: string;
    lastname: string;
  } = {
    username: user?.username || '',
    bio: user?.bio || '',
    country: user?.country || '',
    email: user?.email || '',
    phone: user?.phone || '',
    firstname: user?.name.first || '',
    lastname: user?.name.last || '',
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

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

  const onSubmit = async (values) => {
    console.log({ ...values, imageUrl });
    const submitValues = {
      ...values,
      avatar: !imageUrl ? user?.avatar : imageUrl,
      name: { first: values.firstname, last: values.lastname },
    };
    console.log(submitValues);
    try {
      const response = await updateUser({
        updateData: submitValues,
        username: `${user?.username}`,
      }).unwrap();
      console.log(response);
      dispatch(onEditProfile(response));
      dispatch(onEditAuthUser(response.data));
    } catch (e) {
      console.log(e);
    }
  };
  const clickInput = () => {
    if (fileInputRef.current === null) return;
    fileInputRef.current.click();
  };
  return getUserLoading ? (
    <div className={styles.LoadingWrap}>
      {' '}
      <Spinner />
    </div>
  ) : getUserSuccess ? (
    <>
      <Popup
        show={isSuccess || isError || (uploadError as boolean)}
        variant={
          isSuccess
            ? 'success'
            : isError || (uploadError as boolean)
            ? 'error'
            : undefined
        }
        message={
          isSuccess
            ? message || undefined
            : isError || uploadError
            ? (
                error as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message ||
              (
                uploadError as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message
            : undefined
        }
      />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, handleChange, dirty }) => (
          <Form>
            <FeatureScreen>
              <main className={styles.editprofile}>
                <h2 className={styles.Title}>Edit profile</h2>
                <section className={styles.generalInformation}>
                  <div className={styles.SectionHeader}>
                    <h3>General Information</h3>
                    <ArrowIcon
                      onClick={() => setShowGeneralInfo(!showGeneralInfo)}
                      style={{
                        transform: showGeneralInfo
                          ? 'rotate(-90deg)'
                          : 'rotate(90deg)',
                      }}
                      id={styles.arrowIcon}
                    />
                  </div>
                  <div
                    style={{ height: showGeneralInfo ? 'fit-content' : 0 }}
                    className={styles.EditSection}
                  >
                    <div className={styles.Avatar}>
                      <img src={imageUrl || user?.avatar} alt={user.username} />
                      <input
                        style={{ display: 'none' }}
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        id="image"
                        name={image?.name}
                      />
                      <Button
                        disabled={isImageLoading}
                        clicked={clickInput}
                        variant="text"
                      >
                        Change profile picture
                      </Button>
                      {isImageLoading ? <Spinner /> : null}
                    </div>
                    <div className={styles.inputWrapper}>
                      <TextInput
                        id="username"
                        name="username"
                        placeholder="Enter username"
                        onChange={handleChange}
                        value={values.username}
                        inputName="Username"
                      />
                    </div>
                    <p>
                      This is the name everyone who views your events will see.
                    </p>
                    <div className={styles.inputWrapper}>
                      <TextInput
                        id="firstname"
                        name="firstname"
                        placeholder="Enter first name"
                        onChange={handleChange}
                        value={values.firstname}
                        inputName="First name"
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <TextInput
                        id="lastname"
                        name="lastname"
                        placeholder="Enter last name"
                        onChange={handleChange}
                        value={values.lastname}
                        inputName="Last name"
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <TextArea
                        id="bio"
                        name="bio"
                        value={values.bio}
                        onChange={handleChange}
                        inputName="Bio"
                        placeholder="Enter bio"
                      />
                    </div>
                    <div style={{ marginBottom: '42px' }}>
                      <TextInput
                        id="country"
                        name="country"
                        value={values.country}
                        onChange={handleChange}
                        inputName="Location"
                        placeholder="Enter location"
                      />
                    </div>
                  </div>
                </section>
                <section className={styles.personalInformation}>
                  <div className={styles.SectionHeader}>
                    <h3>Personal Information</h3>
                    <ArrowIcon
                      onClick={() => setShowPersonalInfo(!showPersonInfo)}
                      style={{
                        transform: showPersonInfo
                          ? 'rotate(-90deg)'
                          : 'rotate(90deg)',
                      }}
                      id={styles.arrowIcon}
                    />
                  </div>

                  <div
                    style={{ height: showPersonInfo ? 'fit-content' : 0 }}
                    className={styles.EditSection}
                  >
                    <p>This will not be available to the general public.</p>
                    <div className={styles.InputWrapper}>
                      <TextInput
                        name="email"
                        id="email"
                        value={values.email}
                        onChange={handleChange}
                        inputName="Email address"
                        placeholder="Enter email"
                      />
                    </div>
                    <div
                      style={{ marginTop: '33px' }}
                      className={styles.InputWrapper}
                    >
                      <NumericFormat
                        customInput={TextInput}
                        prefix="+"
                        decimalScale={0}
                        name="phone"
                        id="phone"
                        value={values.phone}
                        onChange={handleChange}
                        inputName="Phone number with country code"
                        extraLabelText="e.g. +2344563321443"
                        type="tel"
                        inputMode="tel"
                      />
                    </div>
                  </div>
                </section>
                <div className={styles.editProfileButton}>
                  <Button
                    disabled={
                      isLoading || (!dirty && !imageUrl) || isImageLoading
                    }
                    type="submit"
                    buttonStyles={{ margin: '0 auto', width: '225px' }}
                  >
                    Save changes
                  </Button>
                </div>
              </main>
            </FeatureScreen>
          </Form>
        )}
      </Formik>
    </>
  ) : null;
}

export default EditProfile;

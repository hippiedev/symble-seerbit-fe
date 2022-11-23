import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, Navigate } from 'react-router-dom';
import { gapi } from 'gapi-script';
import GoogleLogin from 'react-google-login';
import styles from './SignUp.module.scss';
import Button from '../../components/UI/atoms/Button/Button';
import AuthScreen from '../../components/template/AuthScreen/AuthScreen';
import { TextInput } from '../../components/UI/atoms/Input/Input';
import eyeSlashed from '../../assets/icons/eyeSlashed.svg';
import line from '../../assets/icons/Line.svg';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { onGoogleSignUp, onSignUp } from '../../redux/feature/auth/authSlice';
import eyeOpen from '../../assets/icons/eyeOpen.svg';
import {
  useGoogleSignUpMutation,
  useSignUpMutation,
} from '../../redux/feature/auth/authApiSlice';
import Popup from '../../components/UI/molecules/Popup/Popup';
import { ReactComponent as GoogleLogo } from '../../assets/icons/googleLogo.svg';
import Spinner from '../../components/UI/atoms/Spinner/Spinner';

function SignIn() {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [
    googleSignUp,
    {
      isLoading: googleLoading,
      isSuccess: googleSuccess,
      isError: hasGoogleError,
      error: googleError,
    },
  ] = useGoogleSignUpMutation();
  const { message } = useAppSelector(
    (state: import('../../redux/store').RootState) => state.auth,
  );

  const [signUp, { isLoading, isSuccess, isError, error }] =
    useSignUpMutation();

  // initial input values
  const initialValues = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  const onSubmit = async (values: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    const submitValues = {
      email: values.email,
      username: values.username,
      password: values.password,
    };
    console.log(submitValues);
    try {
      const response = await signUp(submitValues).unwrap();
      dispatch(onSignUp(response));
    } catch (e) {
      console.log(e);
    }
  };

  // define validation schema for input fields
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('This is a required field'),
    username: Yup.string()
      .required('This is a required field')
      .max(15, 'username must be less than or equal to 15 characters long'),
    password: Yup.string()
      .required('No password provided.')
      .min(10, 'must be at least 8 characters')
      .matches(/[A-Z]/, 'must contain at least one uppercase letter')
      .matches(/[a-z]/, 'must contain at least one lowercase letter')
      .matches(/[0-9]/, 'must contain at least one number')
      .matches(/[@$!%*#?&]/, 'must contain a special character'),
    confirmPassword: Yup.string()
      .required('This is a required field')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: '',
      });
    };
    gapi.load('client:auth2', initClient);
  });

  const handleSocialSignUp = async (googleData) => {
    if (googleData.tokenId) {
      try {
        const res = await googleSignUp({ token: googleData.tokenId }).unwrap();
        console.log(googleData);
        console.log(res);
        dispatch(onGoogleSignUp(res));
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <Popup
        show={isSuccess || isError || googleSuccess || hasGoogleError}
        variant={
          isSuccess || googleSuccess
            ? 'success'
            : isError || hasGoogleError
            ? 'error'
            : message
            ? 'success'
            : undefined
        }
        message={
          isSuccess || googleSuccess
            ? message || undefined
            : isError || hasGoogleError
            ? (
                error as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message ||
              (
                error as {
                  status: number;
                  data: string;
                }
              )?.data ||
              (
                googleError as {
                  status: number;
                  data: { code: number; message: string };
                }
              )?.data?.message ||
              (
                googleError as {
                  status: number;
                  data: string;
                }
              )?.data
            : message || undefined
        }
      />
      <AuthScreen
        title="Sign Up"
        description={
          <p>
            Already have an account?{' '}
            <Link to="/">
              <span>Sign in</span>
            </Link>
          </p>
        }
      >
        {isSuccess ? (
          <Navigate to="/verify-email" replace />
        ) : googleSuccess ? (
          <Navigate to="/sign-in" />
        ) : null}

        <div className={styles.SignUp}>
          <div className={styles.Form}>
            <div className={styles.InputWrap}>
              <TextInput
                type="email"
                inputName="Email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="email"
                error={formik.touched.email && formik.errors.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <p id={styles.error}>{formik.errors.email}</p>
              ) : null}
            </div>
            <div className={styles.InputWrap}>
              <TextInput
                inputName="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="username"
                error={formik.touched.username && formik.errors.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <p id={styles.error}>{formik.errors.username}</p>
              ) : null}
            </div>
            <div className={styles.InputWrap}>
              <TextInput
                inputName="Password"
                type={isVisible ? 'text' : 'password'}
                name="password"
                inputAdornment={isVisible ? eyeSlashed : eyeOpen}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                clickAdornment={() => setIsVisible(!isVisible)}
                error={formik.touched.password && formik.errors.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <p id={styles.error}>{formik.errors.password}</p>
              ) : null}
            </div>
            <div className={styles.InputWrap}>
              <TextInput
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                inputName="Confirm Password"
                inputAdornment={isConfirmPasswordVisible ? eyeSlashed : eyeOpen}
                value={formik.values.confirmPassword}
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                clickAdornment={() =>
                  setConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
                error={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <p id={styles.error}>{formik.errors.confirmPassword}</p>
              ) : null}
            </div>
            <Button
              disabled={isLoading}
              clicked={formik.handleSubmit}
              type="submit"
            >
              Sign up
            </Button>
          </div>
          <div className={styles.SocialAuth}>
            <div>
              <img src={line} alt="" />
              <span>or sign up with</span>
              <img src={line} alt="" />
            </div>
            <div>
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
                render={(renderProps) => (
                  <button
                    type="button"
                    disabled={renderProps.disabled}
                    onClick={renderProps.onClick}
                    className={styles.GoogleAuth}
                  >
                    <GoogleLogo />{' '}
                    {renderProps.disabled || googleLoading ? (
                      <Spinner />
                    ) : (
                      'Google'
                    )}
                  </button>
                )}
                buttonText="Sign up with Google"
                onSuccess={handleSocialSignUp}
                onFailure={handleSocialSignUp}
                autoLoad={false}
                cookiePolicy="single_host_origin"
              />
            </div>
          </div>
        </div>
      </AuthScreen>
    </>
  );
}

export default SignIn;

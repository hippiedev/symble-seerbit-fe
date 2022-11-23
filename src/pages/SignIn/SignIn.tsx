/* eslint-disable no-useless-escape */
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";
import styles from "./SignIn.module.scss";
import Button from "../../components/UI/atoms/Button/Button";
import AuthScreen from "../../components/template/AuthScreen/AuthScreen";
import { TextInput } from "../../components/UI/atoms/Input/Input";
import eyeSlashed from "../../assets/icons/eyeSlashed.svg";
import line from "../../assets/icons/Line.svg";
import { ReactComponent as GoogleLogo } from "../../assets/icons/googleLogo.svg";
// import facebookLogo from '../../assets/icons/facebookLogo.png';
// import twitterLogo from '../../assets/icons/twitterLogo.png';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { onLogin, onGoogleLogin } from "../../redux/feature/auth/authSlice";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import {
  useGoogleSignInMutation,
  useLoginMutation,
} from "../../redux/feature/auth/authApiSlice";
import Popup from "../../components/UI/molecules/Popup/Popup";
import Spinner from "../../components/UI/atoms/Spinner/Spinner";
// import { BASE_URL } from '../../constants/values';
// import { apiInstance } from '../../services/apiInstance';

function SignIn() {
  const dispatch = useAppDispatch();
  const [login, { isLoading, isSuccess, error, isError }] = useLoginMutation();
  const [isVisible, setIsVisible] = useState(false);
  const [
    googleSignIn,
    {
      isLoading: googleLoading,
      isSuccess: googleSuccess,
      isError: hasGoogleError,
      error: googleError,
    },
  ] = useGoogleSignInMutation();

  // select values from the auth splice
  const { hasPin, message, isAuthenticated } = useAppSelector(
    (state: import("../../redux/store").RootState) => state.auth
  );

  // initial input values
  const initialValues = {
    email: "",
    password: "",
  };
  const onSubmit = async (values: { email: string; password: string }) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let submitValues;
    if (emailRegex.test(values.email)) {
      submitValues = { email: values.email, password: values.password };
    } else {
      submitValues = {
        username: values.email,
        password: values.password,
      };
    }
    try {
      const response = await login(submitValues).unwrap();
      dispatch(onLogin(response));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId:
          "46102556524-sb6bo0sbjrvavu8jc77mj7hem6tfnj8l.apps.googleusercontent.com",
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  const handleSocialLogin = async (googleData) => {
    if (googleData.tokenId) {
      try {
        const res = await googleSignIn({ token: googleData.tokenId }).unwrap();
        console.log(googleData);
        console.log(res);
        dispatch(onGoogleLogin(res));
      } catch (e) {
        console.log(e);
      }
    }
  };

  // define validation schema for input fields
  const validationSchema = Yup.object({
    email: Yup.string().required("This is a required field"),
    password: Yup.string().required("This is a required field"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  if (isSuccess || isAuthenticated) {
    if (!hasPin) {
      window.location.replace("/categories");
    } else {
      window.location.replace("/");
    }
  }

  return (
    <>
      <Popup
        show={isSuccess || isError || googleSuccess || hasGoogleError || !!message}
        variant={
          isSuccess || googleSuccess
            ? "success"
            : isError || hasGoogleError
            ? "error"
            : message
            ? "success"
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
        title="Let's sign in"
        description={
          <p>
            Don’t have an account?{" "}
            <Link to="/sign-up">
              <span>Sign up</span>
            </Link>
          </p>
        }
      >
        <div className={styles.SignIn}>
          <div className={styles.Form}>
            <div className={styles.InputWrap}>
              <TextInput
                id="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
                name="email"
                type="email"
                inputName="Email Address/username"
              />
              {formik.touched.email && formik.errors.email ? (
                <p id={styles.error}>{formik.errors.email}</p>
              ) : null}
            </div>
            <div className={styles.InputWrap}>
              <TextInput
                type={isVisible ? "text" : "password"}
                id="password"
                inputName="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
                name="password"
                inputAdornment={isVisible ? eyeSlashed : eyeOpen}
                clickAdornment={() => setIsVisible(!isVisible)}
              />
              {formik.touched.password && (
                <p id={styles.error}>{formik.errors.password}</p>
              )}
              <p className={styles.ForgotPassword}>
                <Link to="/forgot-password">Forgot password?</Link>
              </p>
            </div>
            <Button
              clicked={formik.handleSubmit}
              disabled={isLoading}
              type="submit"
            >
              Continue
            </Button>
          </div>
          <div className={styles.SocialAuth}>
            <div>
              <img src={line} alt="" />
              <span>or sign in with</span>
              <img src={line} alt="" />
            </div>
            <div>
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
                render={(renderProps) => (
                  <button
                    type="button"
                    disabled={renderProps.disabled}
                    onClick={renderProps.onClick}
                    className={styles.GoogleAuth}
                  >
                    <GoogleLogo />{" "}
                    {renderProps.disabled || googleLoading ? (
                      <Spinner />
                    ) : (
                      "Google"
                    )}
                  </button>
                )}
                buttonText="Log in with Google"
                onSuccess={handleSocialLogin}
                onFailure={handleSocialLogin}
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

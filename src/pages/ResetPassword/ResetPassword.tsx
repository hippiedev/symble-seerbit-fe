import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Navigate, useSearchParams } from 'react-router-dom';
import AuthScreen from '../../components/template/AuthScreen/AuthScreen';
import { TextInput } from '../../components/UI/atoms/Input/Input';
import styles from './ResetPassword.module.scss';
import eyeOpen from '../../assets/icons/eyeOpen.svg';
import eyeSlashed from '../../assets/icons/eyeSlashed.svg';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Button from '../../components/UI/atoms/Button/Button';
import { useResetPasswordMutation } from '../../redux/feature/auth/authApiSlice';
import { resetPassword } from '../../redux/feature/auth/authSlice';
import Popup from '../../components/UI/molecules/Popup/Popup';

function ResetPassword() {
  const [params] = useSearchParams();
  const [resetPasswordAsync, { isSuccess, isLoading, isError, error }] =
    useResetPasswordMutation();

  console.log(params.get('token'));
  const { message } = useAppSelector(
    (state: import('../../redux/store').RootState) => state.auth,
  );
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const onSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    const submitValues = {
      token: params.get('token'),
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    try {
      const response = await resetPasswordAsync(submitValues).unwrap();
      dispatch(resetPassword(response));
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  // define validation schema for input fields
  const validationSchema = Yup.object({
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
  return (
    <>
      <Popup
        show={isSuccess || isError || !!message}
        variant={
          isSuccess
            ? 'success'
            : isError
            ? 'error'
            : message
            ? 'success'
            : undefined
        }
        message={
          isSuccess
            ? message || undefined
            : isError
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
              ).data
            : message || undefined
        }
      />
      <AuthScreen title="Reset Password">
        <div className={styles.ResetPassword}>
          {isSuccess ? <Navigate to="/sign-in" /> : null}
          <div className={styles.Form}>
            <div className={styles.InputWrap}>
              <TextInput
                inputName="New Password"
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
              type="submit"
              clicked={formik.handleSubmit}
            >
              Reset Password
            </Button>
            {message === 'Success' ? (
              <p className={styles.SuccessMessage}>{message as string}</p>
            ) : null}
          </div>
        </div>
      </AuthScreen>
    </>
  );
}

export default ResetPassword;

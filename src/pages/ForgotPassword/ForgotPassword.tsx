import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './ForgotPassword.module.scss';
import Button from '../../components/UI/atoms/Button/Button';
import AuthScreen from '../../components/template/AuthScreen/AuthScreen';
import { TextInput } from '../../components/UI/atoms/Input/Input';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { forgotPasswordAsync } from '../../redux/feature/auth/authSlice';
import { RootState } from '../../redux/store';

function SignIn() {
  const initialValues = {
    email: '',
  };

  const { message, loading } = useAppSelector((state: RootState) => state.auth);

  const dispatch = useAppDispatch();

  const onSubmit = (values: { email: string }) => {
    // submit pin
    const { email } = values;
    dispatch(forgotPasswordAsync(email));
  };

  console.log(message);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('This is a required field')
      .email('Invalid email format'),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  return (
    <AuthScreen
      title="Forgot Password"
      description={
        <p>
          No worries, we’ll help you. We’ll send a password reset link to your
          inbox
        </p>
      }
    >
      <div className={styles.ForgotPassword}>
        <div className={styles.Form}>
          <TextInput
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            id="email"
            name="email"
            inputName="Email address"
            error={formik.errors.email}
          />
          <Button
            disabled={loading}
            clicked={formik.handleSubmit}
            type="submit"
          >
            Send Email
          </Button>
          <p className={styles.SuccessMessage}>{message && message}</p>
        </div>
      </div>
    </AuthScreen>
  );
}

export default SignIn;

import Logo from '../../UI/atoms/Logo/Logo';
import styles from './AuthScreen.module.scss';

type Props = {
  children: React.ReactNode;
  title?: string | undefined;
  description?: JSX.Element;
};

function AuthScreen({ children, title, description }: Props) {
  return (
    <div className={styles.AuthScreen}>
      <div className={styles.Logo}>
        <Logo />
      </div>
      <div className={styles.PageHeading}>
        <h1>{title}</h1>
        {description}
      </div>
      {children}
    </div>
  );
}

export default AuthScreen;

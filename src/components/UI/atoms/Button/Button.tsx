/* eslint-disable react/button-has-type */
import React from 'react';
import styles from './Button.module.scss';

type Props = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
  clicked?: () => void;
  buttonStyles?: import('react').CSSProperties;
  variant?: 'outlined' | 'text' | undefined;
  disabled?: boolean;
};

function Button({
  children,
  variant,
  disabled,
  type = 'button',
  clicked,
  buttonStyles,
}: Props) {
  return (
    <button
      disabled={disabled}
      className={`${styles.Button} ${
        variant === 'outlined' ? styles.Outlined : null
      } ${variant === 'text' ? styles.TextButton : null}`}
      type={type}
      style={{ ...buttonStyles }}
      onClick={clicked}
    >
      {children}
    </button>
  );
}

export default Button;

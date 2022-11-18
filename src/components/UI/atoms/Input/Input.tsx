/* eslint-disable react/jsx-props-no-spreading */
import VerificationInput, {
  VerificationInputProps,
} from 'react-verification-input';
import React, {
  ChangeEvent,
  ChangeEventHandler,
  CSSProperties,
  ElementType,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  useRef,
} from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TagsInput, TagsInputProps } from 'react-tag-input-component';
import { ErrorMessage, Field } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { ReactComponent as CancelIcon } from '../../../../assets/icons/x.svg';
import { ReactComponent as ImageIcon } from '../../../../assets/icons/imageIcon.svg';
import styles from './Input.module.scss';
import Spinner from '../Spinner/Spinner';
import { ReactComponent as SendIcon } from '../../../../assets/icons/akar-icons_send.svg';

type Props = {
  type?: HTMLInputTypeAttribute;
  value?: string | undefined;
  disabled?: boolean;
  placeholder?: string | undefined;
  name?: string | undefined;
  inputAdornment?: string | undefined;
  iconComponent?: ElementType;
  onChange?: ChangeEventHandler;
  onBlur?: FocusEventHandler;
  onFocus?: () => void;
  onKeyDown?: (e: any) => void;
  ref?: () => void;
  clickAdornment?: () => void;
  autoFocus?: boolean;
  codeLength?: number | undefined;
  id?: string | undefined;
  error?: string | boolean | undefined;
  inputName?: string;
  extraLabelText?: string | undefined;
  inputStyle?: CSSProperties;
  fileName?: string | undefined;
  options?: string[];
  adornmentStyle?: CSSProperties;
  inputMode?:
    | 'email'
    | 'search'
    | 'tel'
    | 'text'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
    | undefined;
};

export function TextInput({
  name,
  type = 'text',
  value,
  disabled = false,
  onChange,
  onBlur,
  onFocus,
  ref,
  id,
  placeholder,
  inputAdornment,
  error,
  inputName,
  extraLabelText,
  inputStyle,
  inputMode,
  clickAdornment,
  adornmentStyle,
}: Props) {
  let inputErrorStyles: CSSProperties = {};

  if (error) {
    inputErrorStyles = {
      border: '1px solid #D82B2B',
      borderRight: inputAdornment
        ? '1px solid transparent'
        : '1px solid #D82B2B',
    };
  } else {
    inputErrorStyles = {
      borderRight: inputAdornment ? 'none' : '1px solid #CCCCCC',
    };
  }
  return (
    <div className={styles.InputContainer}>
      <label htmlFor={inputName}>
        <span>{inputName} </span>{' '}
        {extraLabelText && (
          <span id={styles.extraLabelText}>({extraLabelText})</span>
        )}
      </label>
      <span
        className={`${styles.InputWrap}  ${
          !inputAdornment ? styles.withoutAdornment : null
        }`}
      >
        <input
          style={{
            ...inputErrorStyles,
            ...inputStyle,
          }}
          disabled={disabled}
          type={type}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          ref={ref}
          value={value}
          placeholder={placeholder}
          name={name}
          id={id}
          inputMode={inputMode}
        />
        {inputAdornment ? (
          <span
            style={{
              border: error ? '1px solid #D82B2B' : '1px solid #CCCCCC',
              borderLeft: error ? 'none' : 'initial',
              ...adornmentStyle,
            }}
            onClick={clickAdornment}
          >
            <img src={inputAdornment} alt="" />
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function SeperatedInputs({
  length,
  onChange,
  autoFocus,
  value,
}: VerificationInputProps) {
  return (
    <VerificationInput
      length={length}
      inputProps={{ inputMode: 'numeric' }}
      placeholder=""
      value={value}
      onChange={onChange}
      validChars="0-9"
      autoFocus={autoFocus}
      removeDefaultStyles
      classNames={{
        container: styles.VerificationInputContainer,
        character: styles.VerificationInputChar,
        characterInactive: styles.CharInactive,
        characterSelected: styles.CharSelected,
      }}
    />
  );
}

export function TextArea({
  extraLabelText,
  inputAdornment,
  inputName,
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  ref,
  id,
  placeholder,
  error,
  inputStyle,
}: Props) {
  let inputErrorStyles: CSSProperties = {};

  if (error) {
    inputErrorStyles = {
      border: '1px solid #D82B2B',
      borderRight: inputAdornment
        ? '1px solid transparent'
        : '1px solid #D82B2B',
    };
  } else {
    inputErrorStyles = {
      borderRight: inputAdornment ? 'none' : '1px solid #CCCCCC',
    };
  }
  return (
    <div className={styles.InputContainer}>
      <label htmlFor={inputName}>
        <span>{inputName} </span>{' '}
        {extraLabelText && (
          <span id={styles.extraLabelText}>({extraLabelText})</span>
        )}
      </label>
      <span
        className={`${styles.InputWrapper}  ${
          !inputAdornment ? styles.withoutAdornment : null
        }`}
      >
        <textarea
          style={{
            ...inputErrorStyles,
            ...inputStyle,
          }}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          ref={ref}
          value={value}
          placeholder={placeholder}
          name={name}
          id={id}
        />
      </span>
    </div>
  );
}

export function DropdownInput({
  iconComponent,
  extraLabelText,
  inputName,
  options,
  value,
  onChange,
  onBlur,
  name,
  isLoading = false,
  id,
  error,
}: {
  iconComponent?: ElementType;
  onChange?: {
    (e: ChangeEvent<any>): void;
    <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
      ? void
      : (e: string | ChangeEvent<any>) => void;
  };
  onBlur?: FocusEventHandler;
  inputName?: string;
  extraLabelText?: string | undefined;
  options?: string[];
  value: string | undefined;
  name: string;
  id: string;
  error?: boolean;
  isLoading?: boolean;
}) {
  return (
    <FormControl error={error} size="medium" className={styles.InputContainer}>
      <label htmlFor={inputName}>
        <span>{inputName} </span>{' '}
        {extraLabelText && (
          <span id={styles.extraLabelText}>({extraLabelText})</span>
        )}
      </label>

      <Select
        className={styles.SelectInput}
        style={{
          fontFamily: 'Lato',
          fontWeight: 400,
          fontSize: '12px',
          outline: 'none',
        }}
        variant="outlined"
        IconComponent={iconComponent}
        inputProps={{ 'aria-label': 'Without label' }}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        {isLoading ? (
          <MenuItem>
            <Spinner />
          </MenuItem>
        ) : options?.length === 0 && isLoading === false ? (
          <MenuItem
            style={{
              fontFamily: 'Lato',
              fontWeight: 400,
              fontSize: '12px',
              textTransform: 'capitalize',
            }}
          >
            You have no product created
          </MenuItem>
        ) : (
          options?.map((option) => {
            return (
              <MenuItem
                id={styles.SelectLabel}
                key={Math.random()}
                value={option}
                style={{
                  fontFamily: 'Lato',
                  fontWeight: 400,
                  fontSize: '12px',
                }}
              >
                {option}
              </MenuItem>
            );
          })
        )}
      </Select>
    </FormControl>
  );
}

export function FileInput({
  onChange,
  extraLabelText,
  inputName,
  fileName,
  name,
  id,
}: Props) {
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const clickInput = () => {
    if (fileInputRef.current === null) return;
    fileInputRef.current.click();
  };
  const resetInput = () => {
    if (fileInputRef.current === null) return;
    fileInputRef.current.value = '';
  };
  return (
    <div className={styles.InputContainer}>
      <label htmlFor={inputName}>
        <span>{inputName} </span>{' '}
        {extraLabelText && (
          <span id={styles.extraLabelText}>({extraLabelText})</span>
        )}
      </label>
      <input
        style={{ display: 'none' }}
        type="file"
        onChange={onChange}
        ref={fileInputRef}
        id={id}
        name={name}
      />
      <div className={styles.FileInputWrap}>
        <ImageIcon />
        <button type="button" onClick={clickInput}>
          Upload media
        </button>
        <label htmlFor={inputName}>
          {fileName && (
            <>
              <CancelIcon onClick={resetInput} />
              <span>{fileName}</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
}

export function RadioButtons({
  label,
  name,
  options,
}: {
  label?: string;
  name: string;
  options: { key: string; value: string }[];
}) {
  return (
    <div className={styles.Radio}>
      <p>{label}</p>
      <div className={styles.Wrapper}>
        <Field name={name}>
          {({ field }) => {
            return options.map((option) => {
              return (
                <div className={styles.RadioWrap} key={option.key}>
                  <input
                    type="radio"
                    id={option.value}
                    {...field}
                    value={option.value}
                    checked={field.value === option.value}
                  />
                  <label htmlFor={option.value}>{option.key}</label>
                </div>
              );
            });
          }}
        </Field>
      </div>

      <ErrorMessage component="Hlello" name={name} />
    </div>
  );
}

export function TagsInputWrap({
  value,
  onChange,
  onBlur,
  inputName,
  extraLabelText,
}: TagsInputProps & { extraLabelText?: string; inputName?: string }) {
  return (
    <div className={styles.InputContainer}>
      <label htmlFor={inputName}>
        <span>{inputName} </span>{' '}
        {extraLabelText && (
          <span id={styles.extraLabelText}>({extraLabelText})</span>
        )}
      </label>
      <TagsInput
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        seprators={['Enter', ' ', ',']}
      />
    </div>
  );
}

export function TimeInput({
  onChange,
  value,
  inputName,
  extraLabelText,
}: {
  onChange: (
    value: string | null,
    keyboardInputValue: string | undefined,
  ) => void;
  value: Date | null;
  inputName?: string;
  extraLabelText?: string;
}) {
  return (
    <div className={styles.InputContainer}>
      <label htmlFor={inputName}>
        <span>{inputName} </span>{' '}
        {extraLabelText && (
          <span id={styles.extraLabelText}>({extraLabelText})</span>
        )}
      </label>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileTimePicker
          className={styles.DateTimeInput}
          value={value}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
}
export function DateInput({
  onChange,
  value,
  inputName,
  extraLabelText,
}: {
  onChange: (
    value: string | null,
    keyboardInputValue: string | undefined,
  ) => void;
  value: Date | null;
  inputName?: string;
  extraLabelText?: string;
}) {
  return (
    <div className={styles.InputContainer}>
      <label htmlFor={inputName}>
        <span>{inputName} </span>{' '}
        {extraLabelText && (
          <span id={styles.extraLabelText}>({extraLabelText})</span>
        )}
      </label>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          disablePast
          className={styles.DateTimeInput}
          value={value}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
}

export function LiveVideoInput({
  onChange,
  onBlur,
  value,
  clickAdornment,
  onFocus,
  onKeyDown,
  ref,
}: Props) {
  return (
    <div className={styles.LiveInputWrapper}>
      <input
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder="Type something"
        value={value}
        ref={ref}
        onKeyDown={onKeyDown}
      />
      <span onClick={clickAdornment}>
        <SendIcon />
      </span>
    </div>
  );
}

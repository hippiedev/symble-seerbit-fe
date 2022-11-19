import { CSSProperties, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import Button from "../../UI/atoms/Button/Button";
import { SeperatedInputs } from "../../UI/atoms/Input/Input";
import styles from "./EnterPin.module.scss";
import Backdrop from "../../UI/atoms/Backdrop/Backdrop";
import { ReactComponent as CancelIcon } from "../../../assets/icons/x.svg";
import Popup from "../../UI/molecules/Popup/Popup";
import { useValidatePinMutation } from "../../../redux/feature/user/userApiSlice";

type Props = {
  closeDrawer: () => void;
  show: boolean;
  drawerStyles?: CSSProperties;
  action: (() => Promise<void>) | undefined;
};

function EnterPin({ closeDrawer, show, drawerStyles, action }: Props) {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [validatePin, { isSuccess, isLoading }] = useValidatePinMutation();
  const handlePinChange = (value) => {
    setError("");
    setPin(value);
  };
  const handleProceed = async () => {
    try {
      const response = await validatePin(pin).unwrap();
      console.log(response);
      if (action) {
        action();
      }
      closeDrawer();
      setPin("");
    } catch (e) {
      setError("incorrect pin");
      setPin("");
      console.log(e);
    }
  };
  return (
    <>
      <Backdrop clicked={closeDrawer} show={show} />
      <div
        style={{
          transform: show ? "translateY(0)" : "translateY(200%)",
          opacity: show ? "1" : "0",
          zIndex: show ? 1000 : -1,
          ...drawerStyles,
        }}
        className={styles.Drawer}
      >
        <Popup show={!!error} variant="error" message={error} />
        <CancelIcon id={styles.cancel} onClick={closeDrawer} />
        <div className={styles.EnterPin}>
          <h2>Enter pin</h2>
          <p>To complete this transaction, enter your symble pin</p>
          <SeperatedInputs
            autoFocus={show || !!error}
            value={pin}
            onChange={handlePinChange}
            length={4}
          />
          <Button
            disabled={pin.length !== 4 || !!error}
            buttonStyles={{ marginTop: "50px" }}
            clicked={handleProceed}
          >
            Proceed
          </Button>
        </div>
      </div>
    </>
  );
}

export default EnterPin;

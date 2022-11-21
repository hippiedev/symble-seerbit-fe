import { Box, HStack } from "@chakra-ui/react";
import styles from "./Toast.module.scss";

function Toast({
  message,
  sprayAmounts,
}: {
  message: React.ReactNode;
  sprayAmounts?: number[];
}) {
  return (
    <HStack spacing="24px" className={styles.FeedbackWrap}>
      <div className={styles.Toast}>{message}</div>
      {sprayAmounts && sprayAmounts?.length > 0 ? (
        <span>+ {sprayAmounts?.length}</span>
      ) : null}
    </HStack>
  );
}

export default Toast;

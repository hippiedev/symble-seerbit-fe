import styles from './ProgressBar.module.scss';

function ProgressBar({ progress }: { progress: string }) {
  return (
    <div className={styles.ProgressBar}>
      <div className={styles.Bar} style={{ width: progress }} />
    </div>
  );
}

export default ProgressBar;

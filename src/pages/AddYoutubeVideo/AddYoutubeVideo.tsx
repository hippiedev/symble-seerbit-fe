import FeatureScreen from '../../components/template/FeatureScreen/FeatureScreen';
import styles from './AddYoutubeVideo.module.scss';
import youtubeThumbnail from '../../assets/images/youtubeThumbnail.png';
import Button from '../../components/UI/atoms/Button/Button';

function AddYoutubeVideo() {
  return (
    <FeatureScreen>
      <main className={styles.AddYoutubeVideo}>
        <header>
          <h2 className={styles.titleText}>Add youtube videos</h2>

          <p className={styles.headerDesc}>
            Select the youtube videos you want to link with Symble
          </p>
        </header>
        <section>
          <div className={styles.noContent}>
            <p className={styles.noContentHeader}>You have no youtube videos</p>
            <p className={styles.syncYoutube}>Sync your youtube to Symble </p>
          </div>
        </section>
        <section>
          <div className={styles.youtubeVideo}>
            <img src={youtubeThumbnail} alt="" />
            <div>
              <p className={styles.youtubeVideoTittle}>A Random Video 1</p>
              <p className={styles.youtubeVideoDesc}>
                Hit the subscribe button to watch my lit events and connect with
                people...
              </p>
            </div>
            <input type="checkbox" />
          </div>
        </section>
        <div className={styles.Button}>
          <Button buttonStyles={{ margin: '0 auto', width: '315px' }}>
            Save
          </Button>
        </div>
      </main>
    </FeatureScreen>
  );
}

export default AddYoutubeVideo;

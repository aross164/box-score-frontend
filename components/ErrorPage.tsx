import styles from '../styles/ErrorPage.module.css';

export default function ErrorPage() {
    return (
        <div className={styles.container}>
            <h1>Error fetching data</h1>
            <p className={styles.details}>Make sure the server is running, and try refreshing the page</p>
        </div>
    );
}
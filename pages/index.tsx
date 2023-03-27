import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Box Scores</title>
                <meta name="description" content="Sports box scores"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Box Scores
                </h1>

                <div className={styles.grid}>
                    <Link href="/mlb" className={styles.card}>
                        <h2>MLB Box Score</h2>
                        <p>Navigate to MLB box score</p>
                    </Link>

                    <Link href="/nba" className={styles.card}>
                        <h2>NBA Box Score</h2>
                        <p>Navigate to NBA box score</p>
                    </Link>
                </div>
            </main>
        </div>
    );
}

import MlbBoxScore from '../components/MlbBoxScore';
import Head from 'next/head';

export default function MlbPage() {
    return (
        <>
            <Head>
                <title>Box Score</title>
                <meta name="description" content="A simple box score" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MlbBoxScore/>
        </>
    );
}
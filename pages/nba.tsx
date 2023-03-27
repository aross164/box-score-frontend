import NbaBoxScore from '../components/NbaBoxScore';
import Head from 'next/head';

export default function NbaPage() {
    return (
        <>
            <Head>
                <title>Box Score</title>
                <meta name="description" content="A simple box score"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <NbaBoxScore/>
        </>
    );
}
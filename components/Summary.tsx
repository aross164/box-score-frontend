import styles from '../styles/BoxScore.module.css';
import {SummaryType} from '../types/utilTypes';

type Props = {
    league: string;
    awaySummary: SummaryType;
    homeSummary: SummaryType;
}

export default function Summary({league, awaySummary, homeSummary}: Props) {
    return (
        <div className={styles.summary}>
            <div className={styles.topRow}><p>{league === 'mlb' ? 'R' : 'T'}</p></div>
            {
                league === 'mlb' ?
                    <>
                        <div className={styles.topRow}><p>H</p></div>
                        <div className={styles.topRow}><p>E</p></div>
                    </>
                    : null
            }
            <p>{awaySummary.score}</p>
            {
                league === 'mlb' ?
                    <>
                        <p>{awaySummary.hits}</p>
                        <p>{awaySummary.errors}</p>
                    </>
                    : null
            }
            <p>{homeSummary.score}</p>
            {
                league === 'mlb' ?
                    <>
                        <p>{homeSummary.hits}</p>
                        <p>{homeSummary.errors}</p>
                    </>
                    : null
            }
        </div>
    );
}
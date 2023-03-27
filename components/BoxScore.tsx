import styles from '../styles/BoxScore.module.css';
import {useEffect, useState} from 'react';
import {SummaryType, TeamName} from '../types/utilTypes';
import Summary from './Summary';

type TeamColors = {
    background: string;
    text: string;
}

type Props = {
    league: string;
    gameData: {
        away_period_scores: number[];
        home_period_scores: number[];
        away_team: TeamName;
        home_team: TeamName;
    };
    awaySummary: SummaryType;
    homeSummary: SummaryType;
    periods: (number | string)[];
    currentSide: string;
    currentPeriod: string;
    awayColors: TeamColors;
    homeColors: TeamColors;
}

export default function BoxScore({
                                     league,
                                     gameData,
                                     awaySummary,
                                     homeSummary,
                                     periods,
                                     currentSide,
                                     currentPeriod,
                                     awayColors,
                                     homeColors
                                 }: Props) {
    const [homeScores, setHomeScores] = useState<number[]>([]);
    const [awayScores, setAwayScores] = useState<number[]>([]);
    const [homeTeam, setHomeTeam] = useState({name: '', abbrev: '', background: 'lightgray', text: 'black'});
    const [awayTeam, setAwayTeam] = useState({name: '', abbrev: '', background: 'lightgray', text: 'black'});

    useEffect(() => {
        if(!gameData) {
            return;
        }

        setHomeScores([...gameData.home_period_scores]);
        setAwayScores([...gameData.away_period_scores]);
        setHomeTeam({
            name: gameData.home_team.last_name,
            abbrev: gameData.home_team.abbreviation,
            background: homeColors.background,
            text: homeColors.text
        });
        setAwayTeam({
            name: gameData.away_team.last_name,
            abbrev: gameData.away_team.abbreviation,
            background: awayColors.background,
            text: awayColors.text
        });
    }, [gameData, awayColors, homeColors]);

    return (
        <div className={styles.pageContainer}>
            <div className={`${styles.boxScore} ${styles[league]}`}>
                <div className={styles.gameInfo}>
                    <div className={styles.teams}>
                        <div className={styles.topRow} style={{height: '100%'}}></div>
                        <p className={styles.team}>{awayTeam.abbrev}</p>
                        <p className={styles.team}>{homeTeam.abbrev}</p>
                    </div>
                    <div className={styles.gameDetails}>
                        <div className={`${styles.periods} ${styles.row}`}>
                            {periods.map(period =>
                                <div key={period} className={styles.topRow}><p>{period}</p></div>
                            )}
                        </div>
                        <div className={`${styles.runs} ${styles.row}`}>
                            {awayScores.map((score, index) =>
                                <p key={index}>{score}</p>
                            )}
                        </div>
                        <div className={`${styles.runs} ${styles.row}`}>
                            {homeScores.map((score, index) =>
                                <p key={index}>{score}</p>
                            )}
                        </div>
                    </div>
                    <Summary league={league} awaySummary={awaySummary} homeSummary={homeSummary}/>
                </div>
                <div>
                    <div className={styles.details}>
                        <div className={styles.team}
                             style={{backgroundColor: awayTeam.background, color: awayTeam.text}}>
                            <p>
                                <strong>{awayTeam.name}</strong> <small>{awayTeam.abbrev}</small>
                            </p>
                        </div>
                        <div className={styles.inning}>
                            <div>
                                <p>
                                    <strong>{currentSide}</strong>
                                </p>
                                <p>
                                    <strong>{currentPeriod}</strong>
                                </p>
                            </div>
                        </div>
                        <div className={styles.team}
                             style={{backgroundColor: homeTeam.background, color: homeTeam.text}}>
                            <p>
                                <strong>{homeTeam.name}</strong> <small>{homeTeam.abbrev}</small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
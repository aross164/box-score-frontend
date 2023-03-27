import {useEffect, useState} from 'react';
import {getNbaColor} from '../js/utils';
import BoxScore from './BoxScore';
import {TeamName} from '../types/utilTypes';
import ErrorPage from './ErrorPage';

type NbaPlayer = {
    minutes: number;
}

type NbaTotals = {
    minutes: number;
    points: number;
}

type NbaData = {
    away_team: TeamName;
    home_team: TeamName;
    away_period_scores: number[];
    home_period_scores: number[];
    away_stats: NbaPlayer[];
    home_stats: NbaPlayer[];
    away_totals: NbaTotals;
    home_totals: NbaTotals;
    event_information: {
        status: string
    };
}

export default function NbaBoxScore() {
    const [showError, setShowError] = useState(false);
    const [quarters, setQuarters] = useState<(number | string)[]>([1, 2, 3, 4]);
    const [homeColors, setHomeColors] = useState({background: '', text: ''});
    const [awayColors, setAwayColors] = useState({background: '', text: ''});
    const [homeSummary, setHomeSummary] = useState({score: 0});
    const [awaySummary, setAwaySummary] = useState({score: 0});
    const [currentSide, setCurrentSide] = useState('');
    const [currentPeriod, setCurrentPeriod] = useState('');
    const [data, setData] = useState<NbaData>({
        away_period_scores: [],
        home_period_scores: [],
        away_team: {
            last_name: '',
            abbreviation: ''
        },
        home_team: {
            last_name: '',
            abbreviation: ''
        },
        away_stats: [],
        home_stats: [],
        away_totals: {
            minutes: 0,
            points: 0
        },
        home_totals: {
            minutes: 0,
            points: 0
        },
        event_information: {
            status: ''
        }
    });

    useEffect(() => {
        (async () => {
            let error = false;
            let data;
            try {
                const {protocol, hostname} = window.location;
                const response = await fetch(`${protocol}//${hostname}:3001/nba`, {
                    method: 'GET',
                    mode: 'cors'
                });
                if(!response.ok) {
                    throw new Error();
                }
                data = (await response.json())?.[0];
            } catch (e) {
                error = true;
            }
            // assuming if we get any data it has the proper fields
            if(error || !data) {
                setShowError(true);
                return;
            }
            setShowError(false);
            setData(data);

            updateQuarters(data);
            updateCurrentNbaPeriod(data, data.away_period_scores);
            setAwayColors(getNbaColor(data.away_team.abbreviation));
            setHomeColors(getNbaColor(data.home_team.abbreviation));
            setAwaySummary({score: data.away_totals.points});
            setHomeSummary({score: data.home_totals.points});
        })();
    }, []);

    function updateQuarters(data: NbaData) {
        let newQuarters;
        newQuarters = [1, 2, 3, 4];
        if(data.away_period_scores.length > 4) {
            newQuarters = [];
            for (let i = 1; i <= data.away_period_scores.length; i++) {
                if(i <= 4) {
                    newQuarters.push(i);
                } else {
                    const otPeriod = i - 4;
                    newQuarters.push(`${otPeriod > 1 ? otPeriod : ''}OT`);
                }
            }
        }

        setQuarters(newQuarters);
    }

    function updateCurrentNbaPeriod(data: NbaData, awayPeriodScores: number[]) {
        const minutesPerQuarter = 12 * 5;
        const quartersPerGame = 4;
        const regMinutes = minutesPerQuarter * quartersPerGame;
        if(data.event_information.status === 'completed') {
            setCurrentSide('');
            if(awayPeriodScores.length > quartersPerGame) {
                const otPeriods = awayPeriodScores.length - quartersPerGame;
                const otPeriodsDisplay = otPeriods > 1 ? otPeriods : '';
                setCurrentPeriod(`F/${otPeriodsDisplay}OT`);
            } else {
                setCurrentPeriod('F');
            }
        } else if(data.event_information.status === 'pregame') {
            setCurrentSide('');
            setCurrentPeriod('Pre');
        } else {
            // skipping time because seconds don't appear to be in the data
            setCurrentSide('Qtr');
            const minutes = data.away_totals.minutes;
            if(minutes > regMinutes) {
                const otMinutes = minutes - regMinutes;
                const otLength = 5;
                const otPeriod = Math.floor(otMinutes / otLength) + 1;
                setCurrentPeriod(`${otPeriod > 1 ? 1 : ''}OT`);
            } else {
                // doesn't account for halftime, end 1st, etc
                setCurrentPeriod(String(Math.floor(minutes / minutesPerQuarter) + 1));
            }
        }
    }

    if(showError) {
        return <ErrorPage/>;
    }

    return <BoxScore league="nba" gameData={data} awaySummary={awaySummary} homeSummary={homeSummary} periods={quarters}
                     currentSide={currentSide}
                     currentPeriod={currentPeriod} awayColors={awayColors} homeColors={homeColors}/>;
}
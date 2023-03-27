import {useEffect, useState} from 'react';
import {getMlbColor} from '../js/utils';
import BoxScore from './BoxScore';
import {TeamName} from '../types/utilTypes';
import ErrorPage from './ErrorPage';

type Pitcher = {
    innings_pitched: number;
}

type MlbTotals = {
    runs: number;
    hits: number;
}

type MlbData = {
    home_team: TeamName;
    away_team: TeamName;
    away_period_scores: number[];
    home_period_scores: number[];
    away_pitchers: Pitcher[];
    home_pitchers: Pitcher[];
    away_batter_totals: MlbTotals;
    home_batter_totals: MlbTotals;
    event_information: {
        status: string
    };
}
export default function MlbBoxScore() {
    const [showError, setShowError] = useState(false);
    const [innings, setInnings] = useState<(number | string)[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [homeColors, setHomeColors] = useState({background: '', text: ''});
    const [awayColors, setAwayColors] = useState({background: '', text: ''});
    const [homeSummary, setHomeSummary] = useState({score: 0, hits: 0, errors: 0});
    const [awaySummary, setAwaySummary] = useState({score: 0, hits: 0, errors: 0});
    const [currentSide, setCurrentSide] = useState('');
    const [currentInning, setCurrentInning] = useState('');
    const [data, setData] = useState<MlbData>({
        home_team: {
            last_name: '',
            abbreviation: ''
        },
        away_team: {
            last_name: '',
            abbreviation: ''
        },
        away_period_scores: [],
        home_period_scores: [],
        away_pitchers: [],
        home_pitchers: [],
        away_batter_totals: {
            runs: 0,
            hits: 0
        },
        home_batter_totals: {
            runs: 0,
            hits: 0
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
                const response = await fetch(`${protocol}//${hostname}:3001/mlb`, {
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

            updateInnings(data);
            updateCurrentMlbPeriod(data);
            const awayColors = getMlbColor(data.away_team.abbreviation);
            const homeColors = getMlbColor(data.home_team.abbreviation);
            setHomeColors({
                background: homeColors.background,
                text: homeColors.text
            });
            setAwayColors({
                background: awayColors.background,
                text: awayColors.text
            });
            setAwaySummary({
                score: data.away_batter_totals.runs,
                hits: data.away_batter_totals.hits,
                errors: data.away_errors
            });
            setHomeSummary({
                score: data.home_batter_totals.runs,
                hits: data.home_batter_totals.hits,
                errors: data.home_errors
            });
            setData(data);
        })();
    }, []);

    function updateInnings(data: MlbData) {
        let newPeriods;
        newPeriods = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        if(data.away_period_scores.length > 9) {
            newPeriods = [];
            for (let i = 1; i <= data.away_period_scores.length; i++) {
                newPeriods.push(i);
            }
        }

        setInnings(newPeriods);
    }

    function updateCurrentMlbPeriod(data: MlbData) {
        const awayOuts = data.away_pitchers.reduce(countOuts, 0);
        const homeOuts = data.home_pitchers.reduce(countOuts, 0);
        const total = awayOuts + homeOuts;
        const outsPerInning = 6;
        const completedInnings = Math.floor(total / outsPerInning);
        const mod = total % outsPerInning; // get num innings
        if(data.event_information.status === 'completed') {
            setCurrentSide('');
            if(total > outsPerInning * 9) {
                setCurrentInning(`F/${completedInnings + (mod ? 1 : 0)}`);
            } else {
                setCurrentInning('F');
            }
        } else if(data.event_information.status === 'pregame') {
            setCurrentSide('');
            setCurrentInning('Pre');
        } else {
            if([0, 1, 2].includes(mod)) {
                setCurrentSide('Top');
            } else {
                setCurrentSide('Btm');
            }
            setCurrentInning(String(completedInnings + 1));
        }

        function countOuts(total: number, curPitcher: Pitcher) {
            const numInnings = curPitcher.innings_pitched;
            let outs;
            if(Number.isInteger(numInnings)) { // 6.0, 7.0, etc
                outs = numInnings * 3;
            } else if(numInnings > 1) { // 1.2, 4.1, etc
                const [wholeInnings, partialInnings] = numInnings.toString().split('.');
                outs = Number(wholeInnings) * 3 + Number(partialInnings);
            } else { // 0.0, 0.1, or 0.2
                outs = numInnings * 10;
            }
            return total + outs;
        }
    }

    if(showError) {
        return <ErrorPage/>;
    }

    return (<BoxScore league="mlb" gameData={data} awaySummary={awaySummary} homeSummary={homeSummary} periods={innings}
                      currentSide={currentSide} currentPeriod={currentInning} awayColors={awayColors}
                      homeColors={homeColors}/>);
}
export function getMlbColor(abbrev: string) {
    switch (abbrev) {
        case 'LAA':
            return {background: '#ba0021', text: 'white'};
        case 'SEA':
            return {background: '#005c5c', text: 'white'};
        // would add other teams in real app
        default: {
            return {background: 'lightgray', text: 'black'};
        }
    }
}

export function getNbaColor(abbrev: string) {
    switch (abbrev) {
        case 'MIA':
            return {background: '#98002E', text: 'white'};
        case 'OKC':
            return {background: '#007AC1', text: 'white'};
        // would add other teams in real app
        default: {
            return {background: 'lightgray', text: 'black'};
        }
    }
}
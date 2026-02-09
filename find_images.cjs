const https = require('https');

const url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

const searchTerms = [
    'Pushdown', 'Triceps'
];

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const exercises = JSON.parse(data);
            console.log('Total exercises:', exercises.length);

            searchTerms.forEach(term => {
                const matches = exercises.filter(e => e.name.toLowerCase().includes(term.toLowerCase()));
                if (matches.length > 0) {
                    console.log(`\nMatches for "${term}":`);
                    matches.forEach(m => {
                        console.log(`- ${m.name}: ${m.images[0]}`);
                    });
                } else {
                    console.log(`\nNo match for "${term}"`);
                }
            });
        } catch (e) {
            console.error(e);
        }
    });
}).on('error', (err) => {
    console.error('Error: ' + err.message);
});

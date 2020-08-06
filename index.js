const scrape = require('./scrapeData').scrape;
const fs = require('fs')
const express = require('express');
const path = require("path");

const argv = require('yargs')
    .option('file', {
        alias: 'f',
        type: 'String',
        required: true,
        description: 'The directory of the file with names seperated by a new line'
    })
    .option('key', {
        alias: 'k',
        type: 'String',
        required: true,
        description: 'The google api key'
    })
    .option('timeout', {
        alias: 't',
        type: 'Int',
        required: false,
        description: 'The timeout between each request to hitta.se'
    })
    .option('port', {
        alias: 'p',
        type: 'Int',
        required: false,
        default : 3000,
        description: 'The port to run the server on'
    })
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2020')
    .argv;

const listString = fs.readFileSync(argv.file, 'utf8');
const nameList = listString.split(/\r?\n/g);
const port = argv.port;
const apiKey = argv.key;
const timeout = argv.timeout || 1000;
const app = express();

let peoples = [];
scrape(nameList, timeout).then(p => {
    peoples = p;
    app.listen(port, () => console.log(`Visit http://localhost:${port} to see the heatmap`))
}).catch(console.log);


app.set('view engine','hbs');
app.use(express.static( path.join(__dirname, "public")));
app.get('/data', (req, res) => res.json(peoples));
app.get('/',(req,res) => res.render('index.hbs', {
    key : apiKey,
}));
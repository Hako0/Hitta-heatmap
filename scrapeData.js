const fetch = require('node-fetch');
const HTMLParser = require('node-html-parser');

const timeout = (ms) => {
    return new Promise(res => setTimeout(res, ms));
}

/**
 * Parses the html and gets the embedded data
 * @param content is the body of the request
 * @returns {[]|*[]} is a list of people objects
 */
const getPersonData = (content) => {
    const json = JSON.parse(HTMLParser.parse(content, {script: true}).querySelector('#__NEXT_DATA__').innerHTML);
    const peoples = [];
    try {
        json.query.searchResult.result.persons.person.forEach(person => {
            if(person.address){
                peoples.push({
                    age: person.age,
                    address: person.address,
                    gender: person.attribute.find(t => t.name === "gender" ).value,
                });
            }
        });
        return peoples;
    } catch (err) {
        return [];
    }
}

/**
 * Scrapes hitta.se for the data
 * @param nameList is a list of names
 * @param timeoutTime is the timeout between each requests
 * @returns {Promise<[]>}
 */

const scrape = async (nameList, timeoutTime) => {
    let peoples = [];
    for (const name of nameList) {
        console.log("Doing search for " + name);
        let pageNum = 1;
        let finished = false;
        while (!finished) {
            await fetch(`https://www.hitta.se/s%C3%B6k?vad=%22${name}%22&typ=prv&sida=${pageNum}`)
                .then(res => res.text())
                .then(body => {
                    console.log(`Retreived page ${pageNum}`)
                    const people = getPersonData(body);
                    finished = people.length < 25;
                    peoples = peoples.concat(people);
                })
            pageNum++;
            // artificial rate limit
            await timeout(timeoutTime);
        }
    }
    return peoples;
}

module.exports.scrape = scrape;
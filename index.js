
'use strict';

const apiKey = 'NseftDiMJi8MAGYlzITQbCrWr5ZDpWNYGDYswbgg'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${params[key]}`)
    return queryItems.join('&');
};

function getNationalParks(query, maxResults=10) {
  const params = {
    limit: maxResults,
    api_key: apiKey,
    stateCode: query
  };
//   const state = "" // 'stateCode=' + query + '&';
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  
  console.log(url);

  fetch(url)
    .then (response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
        console.log(err)
        $('#results').removeClass('hidden');
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
};

function displayResults(responseJson) {
    console.log(responseJson)
    $('#results-list').empty();
    $('#results').removeClass('hidden');
    for (let i = 0; i < responseJson.data.length; i++) {
        let address = "No address provided.";
        if (responseJson.data[i].addresses[0]) {
            address = `${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode}, ${responseJson.data[i].addresses[0].postalCode}`
        }
        let image = "No image provided."
        if (responseJson.data[i].images[0]) {
            image = `<img src="${responseJson.data[i].images[0].url}">`
        }
        $('#results-list').append(
            `<li><h3><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].fullName}</a></h3>
            <p>${address}</p>
            ${image}
            <p>${responseJson.data[i].description}</p>`
        )
    }
        
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        //need to grab the value of up to both state selections and make them a single string seperated by comma//
        let stateOne = $('#state-one').val(); 
        const stateTwo = $('#state-two').val(); 
        const maxResults = $('#js-max-results').val();
        if (stateTwo) {
            stateOne += ',' + stateTwo
        }
    
        console.log(maxResults);
        console.log(stateOne);
        getNationalParks(stateOne, maxResults);
    });
};

$(function() {
    console.log("App loaded! Waiting for user input and submit.");
    watchForm();
});
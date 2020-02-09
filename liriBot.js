// Commands to make:
// * `concert-this`

// * `spotify-this-song`

// * `movie-this`

// * `do-what-it-says`

require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('file-system');
var spotify = new Spotify(keys.spotify);
var toggleAxios;

var userInput = [];

if(process.argv.length > 2){
    for(let i = 2; i < process.argv.length; i++){
        userInput.push(process.argv[i]);
    }
} else {
    console.log("Please use the command line to enter arguments!");
}

function axiosCall(queryURL){
    axios.get(queryURL).then(
        function(response) {
            console.log(response.data);
            console.log(queryURL);
            if(toggleAxios == "omdb"){
                console.log("-----------------------------OMDB Call-----------------------------");
                console.log(`\nMovie: ${response.data.Title}\nYear: ${response.data.Year}\nIMDB Rating: ${response.data.imdbRating}\nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nActors: ${moment(response.data.Actors, "MM-DD-YYYY")}\n`)
                console.log("-------------------------------------------------------------------");
            } else if (toggleAxios == "bands"){
                console.log(`-----------------------------Bands Call-----------------------------`);
                for(let i = 0; i < response.data.length; i++){
                    let date = moment(response.data[i].datetime).format("MM/DD/YYYY")
                    console.log(`\nVenue Name: ${response.data[i].venue.name}\nVenue Location: ${response.data[i].venue.country}, ${response.data[i].venue.city}\nVenue Date: ${date}`)
                }
                console.log("--------------------------------------------------------------------");
            }
        }, function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
    });
}

function runAxios(user_input_array){
    var omdbKey = "8610c9de";
    var title = "Mr. Nobody";
    
    if(user_input_array.length > 1){
        title = user_input_array[1];
    }
    var omdbURL = `http://www.omdbapi.com/?apikey=${omdbKey}&t=${title}`
    axiosCall(omdbURL);
}

function runSpotify(user_input_array){
    var song = "The Sign";
    if(user_input_array.length > 1){
        song = user_input_array[1];
    }
    spotify.search({ 
        type: 'track', 
        query: song, 
        limit: 3
    }).then(function(response) {
        console.log("-----------------------------Spotify Call-----------------------------");
        let artistArray = []
        for(let i = 0; i < response.tracks.items.length; i++){
            for(let j = 0; j < response.tracks.items[i].artists.length; j++){
                if(!artistArray.includes(response.tracks.items[i].artists[j].name)){
                    artistArray.push(response.tracks.items[i].artists[j].name);
                }
            }
            console.log(`\nArtists: ${artistArray}\nSong Name: ${response.tracks.items[i].name}\nPreview URL: ${response.tracks.items[i].preview_url}\nAlbum Name: ${response.tracks.items[i].album.name}`)
        }
        console.log("---------------------------------------------------------------------");
        
      }).catch(function(err) {
        console.log(err);
    });
}

function runBands(user_input_array){
    let band = [];            
    if(user_input_array.length > 1){
        for(let i = 1; i < user_input_array.length; i++){
            band.push(user_input_array[i]);
        }   
    }
    tempBand = band.toString();
    tempBand = tempBand.replace(",", "+"); //Accounts for spaces within parameters
    var bandURL = `https://rest.bandsintown.com/artists/${tempBand}/events?app_id=codingbootcamp`
    axiosCall(bandURL);
}

if(userInput.length > 0){
    if(userInput[0].startsWith("m")){
        toggleAxios = "omdb";
        runAxios(userInput);
    } else if(userInput[0].startsWith("s")){
        runSpotify(userInput);
    } else if(userInput[0].startsWith("c")){
        toggleAxios = "bands";
        runBands(userInput);
    } else if(userInput[0].startsWith("d")){
        
    } else {
        console.log("Please enter a proper command!");
    }
}
require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var omdbApi = require("omdb-client");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userCommand = process.argv[2];

if (userCommand === "my-tweets"){
    var params = {
        screen_name: 'frito_pie55',
        count: "20",
        trim_user:true
    };
    client.get("statuses/user_timeline", params, function(error, tweets, response){
        if (!error){
            for (var i=0; i<tweets.length; i++){
                console.log(tweets[i].text);
            }
        }
    });
};

var song;
if (userCommand === "spotify-this-song"){
    if (!process.argv[3]){
        song = "ace of base";  
        gotSong(song);
    }
    else {
        song = process.argv[3];
        gotSong(song);
    }
};

function gotSong(song){
    spotify.search({
        type: 'track', 
        query: song, 
        limit: 1 
    }, function(error, data){
        if (error){
            return console.log(error);
        }
        else{
            var location = data.tracks.items[0];
            // console.log(location);
            
            console.log("Song title: "+location.name);
            console.log("Album: " +location.album.name);
            console.log("Artist: "+location.artists[0].name);
            console.log("Preview: "+location.external_urls.spotify);
}})
};

var movie;
if (userCommand === "movie-this"){
    if (!process.argv[3]){
        movie = "Mr. Nobody";  
        gotMovie(movie);
    }
    else {
        movie = process.argv[3];
        gotMovie(movie);
    }
}

function gotMovie(movie){
    var params = {
        apiKey: "trilogy",
        title: movie
    }

    omdbApi.get(params,function(error, data){
        // console.log(data);
        console.log("Title: "+data.Title);
        console.log("Year: "+data.Year);
        console.log("IMDB rating: "+data.Ratings[0].Value);
        console.log("Rotten Tomatoes rating: "+data.Ratings[1].Value);
        console.log("Producing country: "+data.Country);
        console.log("Language: "+data.Language);
        console.log("Plot: "+data.Plot);
        console.log("Actors: "+data.Actors);
    });
};
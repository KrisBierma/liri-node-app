require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var omdbApi = require("omdb-client");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userCommand = process.argv[2];
var song;
var movie;


if (userCommand === "my-tweets"){
    var params = {
        screen_name: 'frito_pie55',
        count: "20",
        trim_user:true
    };
    client.get("statuses/user_timeline", params, function(error, tweets, response){
        if (!error){
            logIt("my-tweets: ");
            for (var i=0; i<tweets.length; i++){
                console.log(tweets[i].text);
                var dataToApp = tweets[i].text;
                logIt("\n"+dataToApp);
            }
            console.log("Data logged to log.txt.");
        }
    });
}

else if (userCommand === "spotify-this-song"){
    if (!process.argv[3]){
        song = "ace of base";  
        gotSong(song);
    }
    else {
        song = process.argv[3];
        gotSong(song);
    }
}

else if (userCommand === "movie-this"){
    if (!process.argv[3]){
        movie = "Mr. Nobody";  
        gotMovie(movie);
    }
    else {
        movie = process.argv[3];
        gotMovie(movie);
    }
}

else if (userCommand === "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) return error;
        var randomArr = data.split(",");
        song = randomArr[1];
        userCommand = randomArr[0];
        logIt("do-what-it-says");
        gotSong(song);
    })
}

else {
    console.log("Please type in a command: \n my-tweets \n spotify-this-song 'song name here' \n movie-this 'song name here' \n do-what-it-says");
}

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
            console.log("Song title: "+location.name);
            console.log("Album: " +location.album.name);
            console.log("Artist: "+location.artists[0].name);
            console.log("Preview: "+location.external_urls.spotify);
            var space = ", ";
            dataToApp=("\n"+"spotify-this-song: "+location.name+space+location.album.name+space+location.artists[0].name+space+location.external_urls.spotify);
            logIt(dataToApp);
            console.log("Data logged to log.txt.");
    }})
};

function gotMovie(movie){
    var params = {
        apiKey: "trilogy",
        title: movie
    }

    omdbApi.get(params,function(error, data){
        console.log("Title: "+data.Title);
        console.log("Year: "+data.Year);
        console.log("IMDB rating: "+data.Ratings[0].Value);
        console.log("Rotten Tomatoes rating: "+data.Ratings[1].Value);
        console.log("Producing country: "+data.Country);
        console.log("Language: "+data.Language);
        console.log("Plot: "+data.Plot);
        console.log("Actors: "+data.Actors);
        var space = ", ";
        dataToApp=("\n"+"movie-this: "+data.Title+ space+data.Year+space+data.Ratings[0].Value+space+data.Ratings[1].Value+space+data.Country+space+data.Language+space+data.Plot+data.Actors);
        logIt(dataToApp);
        console.log("Data logged to log.txt.");
    });
};

function logIt(dataToAppend){
    fs.appendFile("log.txt", dataToAppend, function(err){if (err) return err;
    });
}
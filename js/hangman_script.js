var wordList = ["orange", "old", "happy"];
var word = "";
var errorCount = 0;
var correct = "";
var countLetters = 0;
var table = "";
var alreadyGuessed = "";
var gamesWon = 0;

var guess = "";
var match = "";

/*var track;
var tracks = [new Audio("sounds/jeopardy.mp3"), new Audio("sounds/rocky_theme.mp3")];
*/
var track = new Audio("sounds/jeopardy.mp3");
track.loop= true;
var correctSounds = [new Audio("sounds/correct1.mp3"), new Audio("sounds/correct2.mp3")];
var incorrect = new Audio("sounds/incorrect.mp3");
var success = new Audio("sounds/you_win.mp3");
var fail = new Audio("sounds/you_lose.mp3");

/**
* Loads an array with words from a given fileCreatedDate
*/
function loadList() {
	
}

/**
* Chooses a word from the array of words
*/
function chooseWord() {
	correctCount = 0;
	errorCount = 0;
	alreadyGuessed = "";
	correct = "";
	showMessage("");
	$("#letterGuess").val("");
	$("#letterGuess").removeAttr("disabled");
	$("#hangmanImage").attr("src", "images/hang0.png");
	$("#lettersGuessed").html("");
	$("#messageBox").val("");
	//track = tracks[Math.floor(Math.random()*2)];
	//track.loop = true;
	track.play()
	var listIndex = Math.floor(Math.random() * wordList.length);
	word = wordList[listIndex];
	table = "<table border='1' ><tr>";
	for(var index in word) {
		(function(x) {
			x=index;
			table += "<td id=col"+x+"><u>_</u></td>";
		})();
	}
	table += "</tr></table>";
	$("#guessedSoFar").html(table);
}

/**
* Validates the user's guess upon submission
*/
function validateGuess() {
	guess = $("#letterGuess").val(); 
	
	match = new RegExp("["+guess+"]");
	if(guess.length > 1 && guess != word) {
			showMessage("Sorry! The word is not " + guess + ".");
	}
	else {
		if(!alreadyGuessed.includes(guess)) {
			alreadyGuessed += guess;
			if(match.test(word)) {			
				if(guess.length != word.length)
				{
					showMessage("Correct! The word contains the letter " + guess + ".");
					correctSounds[Math.floor(Math.random()*2)].play();	
				}
				placeLetters(guess);
				
				//Check if full word was guessed
				correct = "";
				for(var index = 0; index < word.length; index++) {
					correct += $("#col" + index + ">u").html();
				}
				if(correct == word) {
					$("#letterGuess").attr("disabled", "disabled");
					showMessage("That's right! You guessed the word! New game?");
					track.pause();
					success.play();
					gamesWon++;
					$("#streak").html(gamesWon);
				}
			}
			else {
				showMessage("Sorry, there is no \"" + guess + "\" in the word.");
				incorrect.play();
				errorCount++;
				updateDisplay();
				if(errorCount >= 9) {
					$("#letterGuess").attr("disabled", "disabled");
					track.pause();
					fail.play();
					showMessage("Sorry! You lost. New game?");
					
				}
			}
		}
		else {
			showMessage("You already guessed \"" + guess + "\"");
		}
	}
}

/**
* Displays a message based on the user's input
* {String} message - the message to be displayed based on user input
*/
function showMessage(message) {
	$("#messageBox").html(message);
}

/**
* Places all the correct letters in the table
* {String} guess - the letter or word guessed
*/
function placeLetters(guess) {
	if(guess.length == word.length) {
		for(var index in guess) {
			$("#col"+index+">u").html(guess[index]);
		}
	}
	else {
		for(var index in word) {
			if(word[index] == guess) 
				$("#col" + index + ">u").html(guess);
		}
	}
}
/**
* Changes the image of the hanged man for each incorrect guess and displays the letters already guessed
*/
function updateDisplay() {
	$("#hangmanImage").attr("src", "images/hang" + errorCount + ".png");
	$("#lettersGuessed").html($("#lettersGuessed").html() + guess + " ");
}

/**
* Set the volume of the main track and sound effects
*/
function changeVolume() {
	var volume_image;
	var volume = $("#volume").val() / 10;
	//Set volume
	track.volume = volume;
	//Set volume image
	if(track.volume == 0)
		volume_image = "fa fa-volume-off";
	else if(track.volume > 0 && track.volume < 0.8)
		volume_image = "fa fa-volume-down";
	else
		volume_image = "fa fa-volume-up";
	$("#vol_img").attr("class", volume_image);
	//Set sound effects volume
	success.volume = volume;
	fail.volume = volume;
	incorrect.volume = volume;
	correctSounds[0].volume = volume;
	correctSounds[1].volume = volume;
}

/**
* Allows user to submit input upon pressing the enter key
* {Object} event - the enter key press event
*/
function checkKey(event) {
	if(event.keyCode == 13)
		validateGuess();
}
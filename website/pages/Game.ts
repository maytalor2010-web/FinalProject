import type { User } from "types";
import { send } from "clientUtilities";
import { create } from "componentUtilities";

var StartButton = document.querySelector<HTMLButtonElement>("#startButton")!;
var FishSpawnDiv = document.querySelector<HTMLDivElement>("#fishSpawnDiv")!;

var HeartCount = 0;
var FishClickedCount = 0;
var ScoreCount = 0;

StartButton.onclick = function () {
    StartButton.style.display = "none"
    HeartCount = 3;
    var SpawnFishInterval = setInterval(CreateFish, 1500);

    
}



function CreateFish () {
    var Fish = create("div", { className: "Fish"})!;
    var decideType = Math.random();
    var decideDirection = Math.floor(Math.random()*2);
    if (decideType <= 0.75 && decideDirection == 0) { //normal fish face right
        Fish.style.backgroundImage = "url('website/image/normal-fish-face-right.png')";
        Fish.style.animation = "slideLtoR"
        Fish.style.animationDuration = "3s"
        Fish.style.transform = "TranslateY(" + (Math.random()*100).toString() + "%)";
    }
    else if (decideType <= 0.75 && decideDirection == 1) { //normal fish face left
        Fish.style.backgroundImage = "url('website/image/normal-fish-face-left.png')";
        Fish.style.animation = "slideRtoL"
        Fish.style.animationDuration = "3s"
    }
    else if (0.875 < decideType && decideType <= 0.76 && decideDirection == 0) { //gold fish face right
        Fish.style.backgroundImage = "url('website/image/gold-fish-face-right.png')";
        Fish.style.animation = "slideLtoR"
        Fish.style.animationDuration = "3s"
    }
    else if (0.875 < decideType && decideType <= 0.76 && decideDirection == 1) { //gold fish face left
        Fish.style.backgroundImage = "url('website/image/gold-fish-face-left.png')";
        Fish.style.animation = "slideRtoL"
        Fish.style.animationDuration = "3s"
    }
    else if (1 < decideType && decideType <= 0.76 && decideDirection == 0) { //pufferfish face right
        Fish.style.backgroundImage = "url('website/image/pufferfish-face-right.png')";
        Fish.style.height = "auto";
        Fish.style.width = "auto";
        Fish.style.animation = "slideLtoR"
        Fish.style.animationDuration = "3s"
    }
    else if (1 < decideType && decideType <= 0.875 && decideDirection == 1) { //pufferfish face left
        Fish.style.backgroundImage = "url('website/image/pufferfish-face-left.png')";
        Fish.style.animation = "slideRtoL"
        Fish.style.animationDuration = "3s"
    }
    FishSpawnDiv.append(Fish);
    console.log("Fish created")

    Fish.onclick = function () {
        Fish.addEventListener("animationend", (event) => {HeartCount -= 1; Fish.style.display = "none";})
        Fish.style.display = "none";
        FishClickedCount += 1;
    }
}


// var intervalId = setInterval(function() {
//     console.log("sga");
// }, 3000);

// clearInterval(intervalId);



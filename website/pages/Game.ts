import type { User } from "types";
import { send } from "clientUtilities";
import { create } from "componentUtilities";

var StartButton = document.querySelector<HTMLButtonElement>("#startButton")!;
var FishSpawnDiv = document.querySelector<HTMLDivElement>("#fishSpawnDiv")!;

var HeartCount = 0;
var FishClickedCount = 0;
var ScoreCount = 0;
var Fish = create("div")!;

StartButton.onclick = function () {
    StartButton.style.display = "none";
    FishSpawnDiv.style.display = "block";
    HeartCount = 3;
    var SpawnFishInterval = setInterval(CreateFish, 1500);


}



function CreateFish() {
    var decideType = Math.random();
    var decideDirection = Math.floor(Math.random() * 2);
    let seconds = 0;
    if (decideType <= 0.75 && decideDirection == 0) { //normal fish face right
        Fish = create("div", { className: "NormalFishFaceRight" })!;
    }
    else if (decideType <= 0.75 && decideDirection == 1) { //normal fish face left
        Fish = create("div", { className: "NormalFishFaceLeft" })!;
    }
    else if (decideType < 0.875 && decideDirection == 0) { //gold fish face right
        Fish = create("div", { className: "GoldFishFaceRight" })!;
    }
    else if (decideType < 0.875 && decideDirection == 1) { //gold fish face left
        Fish = create("div", { className: "GoldFishFaceLeft" })!;
    }
    else if (decideDirection == 0) { //pufferfish face right
        Fish = create("div", { className: "PufferfishFaceRight" })!;
    }
    else if (decideDirection == 1) { //pufferfish face left
        Fish = create("div", { className: "PufferfishFaceLeft" })!;
    }
    console.log(seconds);
    setTimeout(function () {
        console.log('Animation has finished!');
        Fish.style.display = "none";
        HeartCount -= 1;
    }, seconds * 1000);


    Fish.onclick = function () {
        Fish.style.display = "none";
        FishClickedCount += 1;
    };

    FishSpawnDiv.append(Fish);
    console.log("Fish created")


}


// var intervalId = setInterval(function() {
//     console.log("sga");
// }, 3000);

// clearInterval(intervalId);



import type { User, UScore } from "types";
import { send } from "clientUtilities";
import { create } from "componentUtilities";


let SpawnFishInterval: number;
const Token = localStorage.getItem("token");
var user = await send<User | null>("getUser", Token);

//User Info HERE:

let LogOutButton = document.querySelector<HTMLButtonElement>("#logOutButton")!;

LogOutButton.onclick = function () {
    localStorage.removeItem("token");
    window.location.replace("index.html");
}

//Leaderboard Setup HERE:

let Top10Users = await send<User[]>("getTop10");
let LeaderboardDiv = document.querySelector<HTMLDivElement>("#leaderboardDiv")!;

for (let i = 0; i<Top10Users.length; i++)
{
    LeaderboardDiv.append(
        create("div", {className: "LDBUser"}, 
            create("div", {className: "LDBUserInfo", innerText: (i+1).toString() + ". " + Top10Users[i].username}), //Rank and Username
            create("div", {className: "LDBUserInfo", innerText: Top10Users[i].highScore.toString()}) //Score
        )
    )
}

let UserPlacement = await send("getPlacement", Token);
if (UserPlacement == null) {
    console.log("the user is unranked. ")
}
else {
    console.log(UserPlacement.toString() + ". " + user!.username)
}


//Game Code HERE:

let StartButton = document.querySelector<HTMLButtonElement>("#startButton")!;
let TryAgainButton = document.querySelector<HTMLButtonElement>("#tryAgainButton")!;
let FishSpawnDiv = document.querySelector<HTMLDivElement>("#fishSpawnDiv")!;
let HeartAmountP = document.querySelector<HTMLParagraphElement>("#heartAmountP")!;
let ScoreP = document.querySelector<HTMLParagraphElement>("#scoreP")!;

const HeartAmount = 3;           //the amount of hearts every game starts with
let FishClickedCount = 0;     //resets every game
let ScoreCount = 0;           //resets every game
let FishScoreAdd = 0;         //the amount of points a fish adds to the total score (ScoreCount). Varies per fish. 

localStorage.setItem("score", ScoreCount.toString());

StartButton.onclick = function () {
    StartButton.style.display = "none";
    FishSpawnDiv.style.display = "block";
    ScoreCount = 0;
    localStorage.setItem("score", ScoreCount.toString());
    ScoreP.innerText = "Score: " + ScoreCount.toString();
    FishClickedCount = 0;
    localStorage.setItem("heartCount",  HeartAmount.toString());
    SpawnFishInterval = setInterval(async function() {
        let CurrentHearts = parseInt(localStorage.getItem("heartCount")!);
        HeartAmountP.innerText = "Hearts: " + CurrentHearts;
        //only creates fish if there are more than 0 hearts. 
        if(CurrentHearts > 0) {
            CreateFish();
        }
        else {
            user = await send<User | null>("getUser", Token);
            HeartAmountP.innerText = "Game over. ";
            var FinalGameScore = parseInt(localStorage.getItem("score")!);
            if (user == null) {
                window.location.replace("index.html");
            }
            else {
                console.log("User is not null");//DO CLEAR INTERVAL
                await send("submitScore", [localStorage.getItem("token"), FinalGameScore]); //if null, user not found. 
                clearInterval(SpawnFishInterval);
            }
            
        }
    }, 1500);
}




function CreateFish() {
    
    let Fish = create("div")!;
    var decideType = Math.random();
    var decideDirection = Math.floor(Math.random() * 2);
    let seconds = 0;
    if (decideType <= 0.75 && decideDirection == 0) { //normal fish face right
        Fish = create("div", { className: "NormalFishFaceRight" })!;
        Fish.style.top = Math.random()*90 + "%";
        seconds = 3;
        FishScoreAdd = 5;

    }
    else if (decideType <= 0.75 && decideDirection == 1) { //normal fish face left
        Fish = create("div", { className: "NormalFishFaceLeft" })!;
        Fish.style.top = Math.random()*90 + "%";
        seconds = 3;
        FishScoreAdd = 5;
    }
    else if (decideType < 0.875 && decideDirection == 0) { //gold fish face right
        Fish = create("div", { className: "GoldFishFaceRight" })!;
        Fish.style.top = Math.random()*90 + "%";
        seconds = 1.5;
        FishScoreAdd = 10;
    }
    else if (decideType < 0.875 && decideDirection == 1) { //gold fish face left
        Fish = create("div", { className: "GoldFishFaceLeft" })!;
        Fish.style.top = Math.random()*90 + "%";
        seconds = 1.5;
        FishScoreAdd = 10;
    }
    else if (decideDirection == 0) { //pufferfish face right
        Fish = create("div", { className: "PufferfishFaceRight" })!;
        Fish.style.top = Math.random()*90 + "%";
        seconds = 3;
        FishScoreAdd = 0;
    }
    else if (decideDirection == 1) { //pufferfish face left
        Fish = create("div", { className: "PufferfishFaceLeft" })!;
        Fish.style.top = Math.random()*90 + "%";
        seconds = 3;
        FishScoreAdd = 0;
        
    }
    console.log(seconds);
    // setTimeout(function () {
    //     Fish.remove();
    //     console.log('Fish removed!');
    //     if (Fish.classList.contains('NormalFishFaceRight') || Fish.classList.contains('NormalFishFaceLeft') || Fish.classList.contains('GoldFishFaceRight') || Fish.classList.contains('GoldFishFaceLeft'))
    //     {
    //         HeartCount -= 1;
    //         localStorage.setItem("heartCount", HeartCount.toString());
    //     }
    // }, seconds * 1000);

    Fish.addEventListener('animationend', function () {
        Fish.remove();
        console.log('Fish removed!');
        if (Fish.classList.contains('NormalFishFaceRight') || Fish.classList.contains('NormalFishFaceLeft') && parseInt(localStorage.getItem("heartCount")!) > 0)
        {
            LoseHeart();
        }
        else if (parseInt(localStorage.getItem("heartCount")!) < 0)
        {
            return;
        }
    })
  

    Fish.onclick = function () {
        Fish.removeEventListener('animationend', function () {
        Fish.remove();
        console.log('Fish removed!');
        if (Fish.classList.contains('NormalFishFaceRight') || Fish.classList.contains('NormalFishFaceLeft') && parseInt(localStorage.getItem("heartCount")!) > 0)
        {
            LoseHeart();
        }
        else if (parseInt(localStorage.getItem("heartCount")!) < 0)
        {
            return;
        }
    })
        console.log('Fish clicked!');
        if (Fish.classList.contains('PufferfishFaceLeft') || Fish.classList.contains('PufferfishFaceRight') && parseInt(localStorage.getItem("heartCount")!) > 0) {
            FishClickedCount += 1;
            LoseHeart();
        }
        
        else if ((Fish.classList.contains('NormalFishFaceRight') || Fish.classList.contains('NormalFishFaceLeft') || Fish.classList.contains('GoldFishFaceRight') || Fish.classList.contains('GoldFishFaceLeft')) && parseInt(localStorage.getItem("heartCount")!) > 0) {
            FishClickedCount += 1
            ScoreCount += FishScoreAdd;
            localStorage.setItem("score", ScoreCount.toString());
            ScoreP.innerText = "Score: " + ScoreCount.toString();
        }
        else {
            return;
        }
        Fish.remove();
        
    };

    FishSpawnDiv.append(Fish);
    console.log("Fish created")


}

function LoseHeart() {
    let Hearts = parseInt(localStorage.getItem("heartCount")!);
    Hearts -= 1;
    localStorage.setItem("heartCount", Hearts.toString());

    if (Hearts > 0) {
        HeartAmountP.innerText = "Hearts: " + Hearts;
    } else {
        StartButton.innerText = "Try Again";
        StartButton.style.display = "block";
        HeartAmountP.innerText = "Game over.";
    }
}


// var intervalId = setInterval(function() {
//     console.log("sga");
// }, 3000);

// clearInterval(intervalId);



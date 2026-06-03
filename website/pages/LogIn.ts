import type { User } from "types";
import { send } from "clientUtilities";
import { create } from "componentUtilities";


var UserNameInput = document.querySelector<HTMLInputElement>("#username")!;
var PasswordInput = document.querySelector<HTMLInputElement>("#password")!;
var LoginButton = document.querySelector<HTMLButtonElement>("#login")!;
var ErrorDiv = document.querySelector<HTMLButtonElement>("#errorDiv")!;

LoginButton.onclick = async function () {
    var token = await send<string | null>("logIn", UserNameInput.value, PasswordInput.value);
    if(token == null) {
        ErrorDiv.innerText = "The username or the password is incorrect";
        return;
    }

    localStorage.setItem("token", token);
    location.href = "Game.html";

}
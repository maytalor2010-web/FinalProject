import type { User } from "types";
import { send } from "clientUtilities";
import { create, get } from "componentUtilities";

var UserNameInput = document.querySelector<HTMLInputElement>("#username")!;
var PasswordInput = document.querySelector<HTMLInputElement>("#password")!;
var ConfirmInput = document.querySelector<HTMLInputElement>("#confirm")!;
var SignupButton = document.querySelector<HTMLButtonElement>("#signup")!;
var errorDiv = get("div", "errorDiv");

var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890._";
var validCount = 0;

SignupButton.onclick = async function() {

    var validCount = 0;
    errorDiv.innerText = "";

    if (PasswordInput.value == ConfirmInput.value) {
        

        // validCount is the amount of valid characters in the Username. 
        for(var i = 0; i<UserNameInput.value.length; i++) {
            for(var k = 0; k<validChars.length; k++) {
                if (UserNameInput.value[i] == validChars[k]) {
                    validCount += 1;
                }
            }
        }

        if (validCount != UserNameInput.value.length) {
            errorDiv.innerText = "Certain characters are invalid. Remove them and try again. ";
            return;
        }
        
        if (UserNameInput.value.length < 3) {
            errorDiv.innerText = "The Username is too short. ";
            return;
        }
        else if (UserNameInput.value.length > 15) {
            errorDiv.innerText = "The Username is too long. "
            return;
        }
        
        var token = await send<string | null>("signUp", UserNameInput.value, PasswordInput.value);
        
        if (token == null) {
            errorDiv.innerText = "The username already exists.";
            return;
        }
        
        localStorage.setItem("token", token);
        location.href = "Game.html";
    }
    else {
        errorDiv.innerText = "Passwords don't match. Please try again.";
        return;
    }
}
import type { Item } from "types";
import { send } from "clientUtilities";
import { create, get } from "componentUtilities";

var UserNameInput = document.querySelector<HTMLInputElement>("#username")!;
var PasswordInput = document.querySelector<HTMLInputElement>("#password")!;
var ConfirmInput = document.querySelector<HTMLInputElement>("#confirm")!;
var SignupButton = document.querySelector<HTMLButtonElement>("#signup")!;
var errorDiv = get("div", "errorDiv");

SignupButton.onclick = async function() {
    if (PasswordInput.value == ConfirmInput.value) {
        var token = await send<string | null>("signUp", UserNameInput.value, PasswordInput.value);
        
        if (token == null) {
            errorDiv.innerText = "The username already exists.";
            return;
        }
        
        localStorage.setItem("token", token);
        location.href = "index.html";
    }
    else {
        errorDiv.innerText = "Passwords don't match. Please try again.";
    }
}
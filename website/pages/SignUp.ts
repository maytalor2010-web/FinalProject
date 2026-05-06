import type { Item } from "types";
import { send } from "clientUtilities";
import { create } from "componentUtilities";

var UserNameInput = document.querySelector<HTMLInputElement>("#username")!;
var PasswordInput = document.querySelector<HTMLInputElement>("#password")!;
var ConfirmInput = document.querySelector<HTMLInputElement>("#confirm")!;
var SignupButton = document.querySelector<HTMLButtonElement>("#signup")!;

SignupButton.onclick = async function() {
    if (PasswordInput == ConfirmInput) {
        await send("addItem", UserNameInput, PasswordInput);
    }
    else {
        console.log("Passwords don't match. Please try again");
        location.reload()
    }
}
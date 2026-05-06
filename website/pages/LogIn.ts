import type { Item } from "types";
import { send } from "clientUtilities";
import { create } from "componentUtilities";

var UserNameInput = document.querySelector<HTMLInputElement>("#username")!;
var PasswordInput = document.querySelector<HTMLInputElement>("#password")!;
var LoginButton = document.querySelector<HTMLButtonElement>("#login")!;

var items = await send<Item[]>("getItems");

LoginButton.onclick = function() {
    for (var i = 0; i<items.length; i++) {
        
    }
}
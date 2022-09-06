import { onCurrencySelectClick, populateSelect } from "./src/uiLogic.js";
import { getLoadStrategy } from "./src/utils.js";

var jQueryScript = document.createElement('script');
jQueryScript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js');
document.head.appendChild(jQueryScript);

document.getElementById("currencySelect").onclick = (e) => onCurrencySelectClick(e.currentTarget);

const onAppStart = () => {
    const loadStrategy = getLoadStrategy();

    populateSelect();
    loadStrategy();
};

window.onload = onAppStart;

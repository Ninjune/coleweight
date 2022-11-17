/*
Created 11/11/2022 by Ninjune.
*/
export function addCommas(num) {
    try {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } catch (error) {
        return 0;
    }
}// credit to senither for the regex, just don't care to make my own lol
const prevBtn = document.querySelector("#btn-prev");
const nextBtn = document.querySelector("#btn-next");
const Planner = document.querySelector("#hourcontainer");
const currentDate = document.querySelector("#currentDay");
const savecontents = document.querySelector("#savecontents");
const deleteAll = document.querySelector("#delete");
const createDateBlock = (date) => {

currentDate.innerText = date.format("dddd Do MMM YYYY");
var dateData = document.createElement("div");
dateData.classList.add("planner-container");

//local storage search
var storedData = localStorage.getItem("StoredPData");
storedData = JSON.parse(storedData);

//If in local storage check hours
 if (!storedData) { storedData = {} };

for (let i = 0; i <= 12; i++) {
//creating dynamic elements to create rows for each hour (starting at 7am)
let dynamicDate = date.hour(i+7);

 //creating row div
let hourRow = document.createElement("div");
hourRow.classList.add("row");

//creating row hour label div
let hourLabel = document.createElement("div");
hourLabel.classList.add("hour", "col-2");
//formats hour correctly
hourLabel.innerText = dynamicDate.format("h a");

//creates entry sections div
let hourEntry = document.createElement("div");
hourEntry.classList.add("entry", "col-8");
hourEntry.setAttribute("contenteditable", true);
hourEntry.setAttribute("data-hour", i);
//assigning class based on if the time is in the past present or future based on hour
let timeClass = dynamicDate.isBefore(moment(), 'hour') ?
"past" :
dynamicDate.isSame(moment(), 'hour') ?
"present" :
"future";
hourEntry.classList.add(timeClass);

//Check for entry
if (storedData[date.format("YYYY-MM-DD")]) {
    if (storedData[date.format("YYYY-MM-DD")][i]) {

//Adding entry
hourEntry.innerText = storedData[date.format("YYYY-MM-DD")][i];
}}
 //Event for save button for each hour
let hourSave = document.createElement("button");
hourSave.style.fontSize = "10px";
hourSave.innerText = "Save";
hourSave.classList.add("hourSave");
hourSave.setAttribute("data-hour", i);
hourSave.addEventListener("click", saveData);
hourRow.appendChild(hourLabel);
hourRow.appendChild(hourEntry);
hourRow.appendChild(hourSave);
dateData.appendChild(hourRow);
}
return dateData;

}
//property sets whether an animation should play and which direction
const removeBlock = (node, direction) => {
    node.classList.add("animation" + direction);
    setTimeout(() => {
        node.parentNode.removeChild(node);
    }, 360);
}
const slideBlock = (direction) => {
    newDateDiv = createDateBlock(displayDate);
    directionClass = "animation" + direction;
    newDateDiv.classList.add(directionClass);
    Planner.appendChild(newDateDiv);
    setTimeout(() => {
        newDateDiv.classList.remove(directionClass);
    }, 360);
    return newDateDiv;
}

//Save data
const saveData = (event) => {

    event.preventDefault();

//load data from local storage and convert from string to object
let savedData = localStorage.getItem("StoredPData");
savedData = JSON.parse(savedData);

//finds the div text to save based on the button data attribute
let dataToSave = document.querySelector(`div[data-hour="${event.currentTarget.dataset.hour}"]`).innerText;

//if no data in local storage initialise object
if (!savedData) {
        savedData = {};
}
if (!savedData[displayDate.format("YYYY-MM-DD")]) {
        savedData[displayDate.format("YYYY-MM-DD")] = [];
}

savedData[displayDate.format("YYYY-MM-DD")][event.currentTarget.dataset.hour] = dataToSave;
savedData = JSON.stringify(savedData);
localStorage.setItem("StoredPData", savedData);
}
//Shows current date
let displayDate = moment();
let current = createDateBlock(displayDate);
Planner.appendChild(current);

//All main buttons
prevBtn.addEventListener("click", (e) => {
    //changes date by -1
    displayDate.subtract(1, 'd');
    removeBlock(current, "right");
    current = slideBlock("left");
});
nextBtn.addEventListener("click", (e) => {
    //changes date by 1
    displayDate.add(1, 'd');
    removeBlock(current, "left");
    current = slideBlock("right");
});
savecontents.addEventListener("click", function(e) {
    //How can I get all of the entries to save at once?
    $("#hourcontainer .row").each(function() {
        $(".hourSave", this).click();
    });

});
deleteAll.addEventListener("click", function(){
    window.localStorage.removeItem("StoredPData");
    location.reload();
    });
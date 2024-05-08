//Functionality for pushing through pages of form
let currentTab = 0;
const backBtn = document.querySelector('.nav-btns > .go-back');
const nextBtn = document.querySelector('.nav-btns > .go-next');
const fullForm = document.getElementById('fullForm')
const initializePage = () => {
    //Logic for everything that happens on page load
    backBtn.addEventListener ('click', () => {nextPrev(-1)});
    nextBtn.addEventListener ('click', () => {nextPrev(1)});
    displayTab(currentTab);
}
//List of the tabs in the form tabs
const tabList = document.querySelectorAll('form >.form-container');
const displayTab = (n) => {
    tabList[n].style.display = "block";
    //Hide back button if on first page
    if (n == 0) {
        backBtn.style.visibility = "hidden";
    } else {
        backBtn.style.visibility = "visible";
    }
    //Change button to Confirm if on last page
    if (n == (tabList.length -1)) {
        nextBtn.textContent = "Confirm";
    } else {
        nextBtn.textContent = "Next Step";
    }
    //Update step indicator
    updateStepIndicator(n);
}

const nextPrev = (x) => {
    //Dont go next if any input is invalid
    //if (x == 1 && !validateForm()) return false;
    //Hide current tab
    tabList[currentTab].style.display = "none";
    //Go back or forward based on x
    currentTab += x;
    //if you're on last page of form, submit it and move to splash page
    if (currentTab >= tabList.length) {
        fullForm.requestSubmit();
        //Hide buttons
        document.querySelector('.nav-btns').style.display = "none";
        //Show final page
        document.getElementById('5Thanks').style.display = "block";
    }
    //Update page
    displayTab(currentTab);
}

const validateForm = () => {
    //Check if all the inputs are valid
    //TODO CHECK VALIDATION OF ALL INPUTS
    let x, y, i, valid = true;
    const inputList = tabList[currentTab]

    //Check if they're actually required
}

const updateStepIndicator = (n) => {
    //Change which number is active
    let stepList = document.getElementsByClassName("step-number");
    //Remove active from all steps
    for (let index = 0; index < stepList.length; index++) {
        stepList[index].className = stepList[index].className.replace(" active-step", "");
    }
    //and add it to currentTab's step
    stepList[n].className += " active-step";
}

initializePage();
//Show first Tab


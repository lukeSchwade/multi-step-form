let currentTab = 0;
const tabList = document.querySelectorAll('form >.form-container');
let yearlyPlan = false;
const intervalCheckbox = document.querySelector("input[name=payment-plan");
let totalCharge = 0;
let addonsTotal = 0
const backBtn = document.querySelector('.nav-btns > .go-back');
const nextBtn = document.querySelector('.nav-btns > .go-next');
const fullForm = document.getElementById('fullForm')
const initializePage = () => {
    //Logic for everything that happens on page load
    backBtn.addEventListener ('click', () => {nextPrev(-1)});
    nextBtn.addEventListener ('click', () => {nextPrev(1)});
    intervalCheckbox.addEventListener('change', function() {
        //Change whether yearly plan is selected or not
        if(this.checked){
            yearlyPlan = true;
            console
        } else {
            yearlyPlan = false;
        }
        refreshIntervals();
    });
    document.querySelectorAll('.add-on-checkbox').forEach((el) => {
        el.addEventListener ('change', includeAddOn);
    });
    
    displayTab(currentTab);
}
//List of the tabs in the form tabs


//Functionality for pushing through pages of form
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
    if (x == 1 && !validateForm()) return false;
    //Hide current tab
    tabList[currentTab].style.display = "none";
    //Go back or forward based on x
    currentTab += x;
    //if you're on last page of form, submit it and move to splash page
    if (currentTab >= tabList.length) {
        //fullForm.requestSubmit();
        //Hide buttons
        document.querySelector('.nav-btns').style.display = "none";
        //Show final page
        document.getElementById('Thanks5').style.display = "block";
    } else if (tabList[currentTab].id =="Summary4") {
        updateSummary();
        displayTab(currentTab);
    } else {
        displayTab(currentTab);
    } 
}

const validateForm = () => {
    //Check if all the inputs are valid
    let valid = true;
    //Get list of inputs
    const inputList = tabList[currentTab].getElementsByTagName("input");
     //Loop through the inputs on page
    for (let index = 0; index < inputList.length; index++) {
        const elem = inputList[index];
        //if input has required and check validity fails, break loop
        if (elem.hasAttribute('required') && !elem.checkValidity()) {
            valid = false;
            elem.className += " invalid";
            elem.focus();
            break;
        }
    }
    return valid;
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
//End step functionality


const refreshIntervals = () => {
    //Check every page for any elements with class rateAbbrev
    const intervalAbbrevList = fullForm.querySelectorAll(".rateAbbrev");


    //Check for every element with rateAbbrev, and change it to it to /yr or /mo
    if (yearlyPlan) {
        intervalAbbrevList.forEach(el => {
            const price = (parseInt(extractNumFromStr(el.textContent)) * 10);
            el.textContent = `$${price}/yr`;
        });
    } else {
        intervalAbbrevList.forEach(el => {
            const price = (parseInt(extractNumFromStr(el.textContent)) / 10);
            el.textContent = `$${price}/mo`;
        });
            

    }

}

const updateSummary =  () => {
    //Update the totals and Which Plan whenever Page 4 is entered
    const planName = document.querySelector('input[name="planType"]:checked').value;
    const planFull = document.querySelector('.plan-name');
    planFull.textContent = `${planName} (monthly)`;
    const intervalFullList = tabList[currentTab].querySelectorAll(".rateFull");
    const planPriceEl = document.querySelector('.plan-total');
    let planPrice = determinePlanPrice(planName);
    if (yearlyPlan) {
        planPrice *= 10;
        intervalFullList.forEach(el => {
            el.textContent.replace('month', 'year');
        });
    } else {
        intervalFullList.forEach(el => {
            el.textContent.replace('year', 'month');
        });
    }
    planPriceEl.textContent = planPriceEl.textContent.replace(numberRegex, planPrice)

    calculateTotal();
}

const includeAddOn = (evt) => {
    const addonPriceRow = document.querySelector(`.price-row.${evt.target.name}`);
    //If an Add-on is active, show it's price file on page 4
    if (!evt.target.checked && !addonPriceRow.classList.contains('hide')){
        addonPriceRow.classList.add('hide');
        //remove price from addons total
        addonsTotal -= parseInt(evt.target.value);
    } else if (evt.target.checked){
        addonPriceRow.classList.remove('hide');
        //add addons to Addons total
        addonsTotal += parseInt(evt.target.value);
    }
}

const determinePlanPrice = (planType) => {
    //Return a number for types of prices
    switch (planType) {
        case 'Arcade':
            return 9;
        case 'Advanced':
            return 12;
        case 'Pro':
            return 15;
        default:
            return 5;
    }
}
const calculateTotal = () => {
    //Get Plan Price
    let totalPrice = parseInt(totalCharge);
    const plan = document.querySelector('input[name="planType"]:checked').value;
    totalPrice += parseInt(determinePlanPrice(plan));
    //Get total of addons
    totalPrice += addonsTotal;
    if (yearlyPlan) {
        totalPrice *= 10; 
    }
    const newPrice = document.querySelector('.final-charge').textContent.replace(numberRegex, totalPrice);
    document.querySelector('.final-charge').textContent = newPrice;
}

initializePage();
//Show first Tab

const extractNumFromStr = (str) => {
    return str.match(/(\d+)/);
}

const numberRegex = /(\d+)/;

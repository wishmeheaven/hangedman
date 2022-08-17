'use strict';

import animals from "./animals.js";
    
const reg = new RegExp(/^[A-Za-z]+$/);
let animalsArr = [];

const animalsArrInit = () =>  {

    const animalString = animals.toString();
    let animalsOrigin = animalString.split(',');
    let stringOfAnimals = animalsOrigin[0].substring(9,3565);
    // console.log(stringOfAnimals);
    let prev = 0;

    for (let i = 0; i < stringOfAnimals.length ; i++)
    { 
        if(!reg.test(stringOfAnimals.charAt(i)))
        {   
            let str = stringOfAnimals.substring(prev,i);

            if (reg.test(str.trim())){
            animalsArr.push(str);}
            
            prev = i ;
        }
    }
}


const pickRandomAnimal = () => {

    animalsArrInit();
    let randomNum = Math.floor(Math.random()*animalsArr.length);
    return animalsArr[randomNum];
}


const randomAnimal = pickRandomAnimal().trim().toLowerCase();
console.log("hidden word is: " + randomAnimal);
const wordArr = randomAnimal.split('');
let hiddenWordArr = [];
let turn = 10;
let totalGuesses = 10;
let input = document.getElementById("guessletter");
let guessBtn = document.getElementById("guessbtn");
let trueLetters = [];
let falseLetters = [];
let isLetterExists = false;
let charIndexes = [];
let isEndGame = false;
let isHappyEnd = false;
let isHiddenArr = false;
let isEnterClicked = false;
let animalPhotoPart1 = "https://www.google.com/search?q=%22";
let animalPhotoPart2 = "%22&tbm=isch&tbs=ic:color,tbs=isz:lt,islt:qsvga,islt:4mp,itp:face,isg:to";


const fragment = document.createDocumentFragment();
const lettersList = document.querySelector('#truecharlist');
const falseletterList = document.querySelector('#falsecharlist');
const wrongGuessHeader = document.querySelector('#headfalse');
const endFace = document.querySelector('#endface');
let animalImage = document.getElementById('endgamephotos');
    animalImage.style.display = "none";
wrongGuessHeader.textContent = `You've have ${totalGuesses} guesses. Good Luck!`;

    input.addEventListener("keypress", (event) => {

        if (event.key === "Enter") {
            guessBtn.style.background = "rgb(172, 17, 53)";
            guessBtn.style.color = "#fff";
            isEnterClicked = true;
                    guessBtn.click();
            }
     });
        
      guessBtn.addEventListener("click", async function() {
                    checkValidInput(input.value);
                    input.value = "";

                    if(isEnterClicked)
                    {
                        await delay(0.2);
                        guessBtn.style.background = "#fff";
                        guessBtn.style.color = "rgb(172, 17, 53)";
                        isEnterClicked = false;
                    } else {
                        guessBtn.style.background = "rgb(172, 17, 53)";
                        guessBtn.style.color = "#fff";
                        await delay(0.1);
                        guessBtn.style.background = "#fff";
                        guessBtn.style.color = "rgb(172, 17, 53)";
                    }
    });

    function delay(n){
        return new Promise(function(resolve){
            setTimeout(resolve,n*1000);
        });
    }


    const visualgenerator = (char,index) => {

        if(isHiddenArr){
            const newletter = document.createElement('li');
            newletter.textContent = "*";
            fragment.append(newletter);
            newletter.setAttribute("id", "char"+index);
        } else {
            const falseletter = document.createElement('li');
            falseletter.textContent = char;
            fragment.append(falseletter);
            falseletter.setAttribute("id", "fchar"+char);
            falseletterList.append(fragment);   
        }
    }

    const photoGenerator = () => {
        let imageSource = animalPhotoPart1 + randomAnimal + animalPhotoPart2 +`">`;
        let imageTitle = `Click here to some ${randomAnimal} pictures</a>`;
         let linkToPhoto = `<a target='_blank' href=${imageSource}${imageTitle}</a>`;
        animalImage.innerHTML = linkToPhoto;
        animalImage.style.display = "block";
        console.log("linkToPhoto - " + linkToPhoto);
    }



const hiddenWordGeneretor = (arr, char) => {

    let i = 0;
   
        if (arr === charIndexes) {
         
            while(i < charIndexes.length)
            {
                hiddenWordArr.splice(charIndexes[i],1,char);

                document.getElementById("char"+charIndexes[i]).textContent = char;
                
                i++;

            }
        } else if (arr === hiddenWordArr) {

            isHiddenArr = true;

            while(i < wordArr.length)
            {        
                        hiddenWordArr.push("*");  
                        visualgenerator(char,i);
                        i++;
                        if( i == wordArr.length ) {
                            lettersList.append(fragment);
                         }
            }

            isHiddenArr = false;
        } 
            console.log("hiddenWordArr in func: " + hiddenWordArr);
}

const isAlreadyGuessed = (char, arr) => {

    if ((trueLetters.indexOf(char) != -1) || (falseLetters.indexOf(char) != -1))
    {
        isLetterExists = true;
    }

    if(!isLetterExists){
    if (arr.indexOf(char) != -1)
    {
        for (let i = arr.indexOf(char) ; i < arr.length ; i ++)
         {

            if(char == arr[i]) {
                            charIndexes.push(i);
                            console.log("arr.lastIndexOf(char): "+ arr.lastIndexOf(char));
                            
                     if (arr.lastIndexOf(char) > i) {
                        continue;
                 } else break;
            }
        }     
    }
}
    if (isLetterExists) { 
        isLetterExists = false; 
        return true;
        } else return false;
}

const trueOrFalseCharFilter = (char) => {

    if (randomAnimal.indexOf(char) != -1) {

            if (!isAlreadyGuessed(char,wordArr)) {
                    trueLetters.push(char);
                    hiddenWordGeneretor(charIndexes, char);
                    charIndexes = [];
                    turn--;
                }
            else {
                return alert(`The letter - ${char} - has already been guessed`);}
    } else {
             if (!isAlreadyGuessed(char,wordArr)) {
                falseLetters.push(char);
                visualgenerator(char);
                turn--;
             }  else {
                return alert(`The letter - ${char} - has already been guessed`);}    
    }   
    checkEndGame();
    if(isEndGame){
        input.disabled = true;
        guessBtn.disabled = true;
    }
}

    
const checkValidInput = (char) => {
    checkEndGame();
    if(char.length > 1) {
        checkValidInput(prompt("Please enter a valid SINGLE letter:"));
        }
        else if (!(reg.test(char)) || (char === null)) {
            checkValidInput(prompt("Please enter a VALID single letter:"));
        } else {
            return trueOrFalseCharFilter(char.toLowerCase());
        }
}

const endFaceGeneretor = (isHappy) => {

    if (isHappy){
        endface.setAttribute("src","img/happyface.png");
    } else {
        endface.setAttribute("src","img/sadface.png");
    }
    

}

const checkEndGame = () => {

    console.log("True Letters Array: " + trueLetters);
    console.log("False Letters Array " + falseLetters);
    console.log("endgame check hiddenWordArr " + hiddenWordArr);
        if (hiddenWordArr.indexOf("*") == -1) {
        isEndGame = true;
        wrongGuessHeader.textContent = `You've made it!\n (within ${totalGuesses-turn} guesses)`;
        input.style.display = "none";
        endFace.style.display = "block";
        endFaceGeneretor(!isHappyEnd);
        falseletterList.style.display = "none";
        photoGenerator();
        guessBtn.style.display = "none";
        }
        else if(turn > 1) {
        isEndGame = false;
        wrongGuessHeader.textContent = `You've ${turn} more guesses left...`
        }
        else if (turn == 1) {
        isEndGame = false;
        wrongGuessHeader.textContent = `You have one last guess...`
        }  else if (turn == 0) {
        isEndGame = true;
        wrongGuessHeader.textContent = `GAME OVER! (The word was: ${randomAnimal})`;
        input.style.display = "none";
        endFace.style.display = "block";
        endFaceGeneretor(isHappyEnd);
        guessBtn.style.display = "none";
        photoGenerator();
        }
}

hiddenWordGeneretor(hiddenWordArr);
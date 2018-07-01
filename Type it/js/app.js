function changePosition(wroth, unwroth,key){
    wroth.innerHTML += key;
    unwroth.innerHTML = unwroth.innerText.slice(1);
}
function wrongWord (word){
    return '<span class="text-danger"> '+word+" </span>";
}
/*
*   NEEDED VARIABLES :
*      I- INPUT WHERE THE USER TYPING
*      II - DOM ELEMENT TO ADD WROTH WORDS
*      III - DOM ELEMENT OF TEXT TO WRITE
*      IV - TYPING WRONGS
*      V - LIST OF WORDS TO WRITE
*      VI - STORAGE OF CORRECT TYPED LETTERS
*
**/
var screen = document.querySelector(".textToWrite"),
    input  = document.querySelector(".typing"),
    wroth = document.querySelector(".writed"),
    unwroth = document.querySelector(".unwrited"),
    unwrothWords = unwroth.innerText.split(" "),
    correctLetterOfWord = "";
    correctTypedWord = 0;
    HScroll = 0 ;
    wrong = [];
screen.scrollTop = 0 ;
/*
*  [CORE ALGORITHM]
*  [EVENT] => WHEN USER PRESS ENY KEYBOARD BUTTON
*       1- IF THE TYPED LETTER INCORRECT ADD DANGER CLASS TO THE INPUT
*       2- IF USER JUMP TO NEXT WORD (press space button )
*           2-1) IF TYPED WORD INCORRECT ADD IT TO WROTH TEXT WITH RED COLOR AND ADD THIS WORD TO LIST OF WRONG TYPED WORD
*           2-2) IF TYPED WORD CORRECT ADD IT TO MARK ELEMENT
*           [EVENT] => WHEN WROTH ELEMENT TAKE ALL SIZE OF THE TOOL
*                           1- SCROLL TO THE NEXT SCREEN TO WRITE
*       3- IF USER TYPE CORRECT LETTER ADD IT TO wroth ELEMENT WHIT GREEN COLOR
*
*
* */
input.addEventListener("keyup",function(e) {

    if (e.key == " ") {
        /*
        * when user want to jump into the next word ;
        * */
        if (unwrothWords[0] + " " == input.value) {
            // WHEN TYPED WORD IS CORRECT
            wroth.innerHTML += " ";
        }else{
            // WHEN TYPED WORD IS INCORRECT
            //      REMOVE REST OF THE INCORRECT WORD
            unwroth.innerText = unwroth.innerText.slice(unwrothWords[0].length - correctLetterOfWord.length);

            //      REMOVE EXESTED CORRECT LETTER FROM THE WROTH SPAN
            wroth.innerHTML = wroth.innerHTML.replace(new RegExp(correctLetterOfWord+"$"),"");

            //      ADD THE WORD AS INCORRECT WORD WITH RED COLOR
            wroth.innerHTML += wrongWord(unwrothWords[0]);
            wrong.push(unwrothWords[0]);

        }

        // RESTART VARIABLES
        correctLetterOfWord = "";
        unwrothWords.shift();
        input.value = "";
        input.placeholder = unwrothWords[0];
        input.classList.remove("text-danger");

        // SCROLL IF THE WROTH TAKE ALL HEIGHT
        if(wroth.offsetHeight > screen.offsetHeight*(HScroll+1)+7){
            screen.scrollTop = unwroth.offsetTop ;
            HScroll += 1;
        }
    }else if(e.key === unwroth.innerText.charAt(0)){
        /*
        * WHEN USER TAPE A CORRECT LETTER ;
        * */

        changePosition(wroth,unwroth, e.key);
        correctLetterOfWord += e.key ;
        correctTypedWord +=1;
        if(input.classList.contains("text-danger")){
            console.log(input.value , unwrothWords[0].slice(0,input.value.length));
            if(input.value == unwrothWords[0].slice(0,input.value.length)){
                input.classList.remove("text-danger");
            }
        }
    }else if(e.key != unwroth.innerText.charAt(0)){
        input.classList.add("text-danger");
    }
});


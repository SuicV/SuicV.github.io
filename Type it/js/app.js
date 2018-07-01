function changePosition(wroth, unwroth,key){
    wroth.innerHTML += key;
    unwroth.innerHTML = unwroth.innerText.slice(1);
}

function wrongWord (word){
    return '<span class="text-danger"> '+word+" </span>";
}
var showCPM = function(){
    if(correctTypedLetter*60 > HightCPM && correctTypedLetter*60 < 300){
        HightCPM = correctTypedLetter *60 ;
    }
    if(document.querySelector("#CPM span")){
        document.querySelector("#CPM span").innerText = correctTypedLetter*60 ;
        correctTypedLetter = 0 ;
    }
};
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
    correctLetterOfWord = "",
    correctTypedLetter = 0,
    HScroll = 0 ,
    started = false ,
    wrong = [],
    HightCPM = 0,
    correctTypedWord = 0 ;
input.value = "";
screen.scrollTop = 0 ;
/*
*  [CORE ALGORITHM]
*  [EVENT] => WHEN USER PRESS ENY KEYBOARD BUTTON
*       1- IF THE TYPED LETTER INCORRECT ADD DANGER CLASS TO THE INPUT
*       2- IF USER JUMP TO NEXT WORD (press space button ) AND WORDS TO WRITE EXIST
*           2-1) IF TYPED WORD INCORRECT ADD IT TO WROTH TEXT WITH RED COLOR AND ADD THIS WORD TO LIST OF WRONG TYPED WORD
*           2-2) IF TYPED WORD CORRECT ADD IT TO MARK ELEMENT
*           [EVENT] => WHEN WROTH ELEMENT TAKE ALL SIZE OF THE TOOL
*                           1- SCROLL TO THE NEXT SCREEN TO WRITE
*       3- IF USER TYPE CORRECT LETTER ADD IT TO wroth ELEMENT WHIT GREEN COLOR
*  [EVENT] => WHEN USER START TYPING RUN COUNTING TIME AND STATISTICS COUNTERS
*
* */
input.addEventListener("keyup",function(e) {
    if(!started){
        setTimeout(function(){
            clearInterval(showCPM);
            input.disabled = true;
            document.querySelector("#resultes").innerHTML = '<span class="alert bg-danger d-block" role="alert">' +
            '<i class="fas fa-clock"></i> Time Up' +
            '</span>' +
            '<p><strong>High CPM : </strong>'+HightCPM+'</p>'+
            '<p><strong>wrongs : </strong>'+wrong.join(" | ")+
            "<p><strong>Correct words in 60 seconds :</strong>"+correctTypedWord+"</p>"
            +"<p>Thank you for playing .</p>";
            document.querySelector(".tool").remove();
        },60000);
        setInterval(showCPM,1000);

        started = true ;

    }
    if (e.key == " ") {

        //  IF WORDS TO WRITE EXIST
            /*
             * when user want to jump into the next word ;
             * */
        //      REMOVE REST OF THE INCORRECT WORD
        unwroth.innerText = unwroth.innerText.replace(new RegExp("^"+unwrothWords[0].slice(correctLetterOfWord.length)), " ");


        if (unwrothWords[0] + " " == input.value) {
            // WHEN TYPED WORD IS CORRECT
            wroth.innerHTML += " ";
            correctTypedWord += 1;
        }else{
            // WHEN TYPED WORD IS INCORRECT

            //      ADD THE WORD AS INCORRECT WORD WITH RED COLOR
            //      REMOVE EXESTED CORRECT LETTER FROM THE WROTH SPAN
            wroth.innerHTML = wroth.innerHTML.replace(new RegExp(correctLetterOfWord+"$"),"");

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
            screen.scrollTop = screen.offsetHeight*(HScroll +1)-24 ;
            HScroll += 1;
        }
    }else if(e.key === unwroth.innerText.charAt(0)){
        /*
        * WHEN USER TAPE A CORRECT LETTER ;
        * */
        if(input.value.length <= unwrothWords[0].length){
            changePosition(wroth,unwroth, e.key);
            correctLetterOfWord += e.key ;
            correctTypedLetter +=1;
        }
        if(input.classList.contains("text-danger")){
            if(input.value == unwrothWords[0].slice(0,input.value.length)){
                input.classList.remove("text-danger");
            }
        }

    }else if(e.key != unwroth.innerText.charAt(0)){
        /*
        * WHEN USER PRESS THE WRONG KEY
        * */
        input.classList.add("text-danger");
    }
});

(function(){

    /*
     *
     * THIS GAME CODED BY SUICV AT 2018/7/20
     * THE SOURCE CODE UNDER GNU PUBLIC LICENSE GPL
     * V 1.0
     **/
    var gameCore;
    gameCore = {

        bag: null,
        chickens: null,
        eggs: [],
        score: 0,
        crashedEggs: 0,
        gameScreen: null,
        timeBetwenDrop: 3000,
        timeDrop: 1000,
        elScore: null,
        elCrashedEgg: null,
        incrNumb: 5,
        timers: {
            eggDown: null,
            dropEgg: null
        },
        init: function (conf) {
            this.bag = conf.bag;
            this.chickens = conf.chicks;
            this.gameScreen = conf.screen;
            this.menu = conf.mn;
            this.elScore = conf.elScore;
            this.elCrashedEgg = conf.elCrashedEgg;
            this.timeOuts.setTimeOuts();
            setInterval(this.checkEggOnBag, 50);
        },
        timeOuts : {
            /**
             *  function to clear set intervals
             **/
            clearTimeOuts: function () {
                clearInterval(gameCore.timers.dropEgg);
                clearInterval(gameCore.timers.eggDown);
            },
            /**
             *  fuction to set intervals
             * */
            setTimeOuts: function () {
                console.log("egg speed 50px/" + gameCore.timeDrop + "ms");
                console.log("time between egg drop " + gameCore.timeBetwenDrop + "ms");
                gameCore.timers.dropEgg = setInterval(gameCore.dropEgg, gameCore.timeBetwenDrop);
                gameCore.timers.eggDown = setInterval(gameCore.eggDown, gameCore.timeDrop);
            },
            /**
             *  function to update timeouts
             * */
            updateTimeOuts: function () {
                this.clearTimeOuts();
                this.setTimeOuts();
            }
        },
        /**
         * function to add chicken
         *
         * */

         addChicken : function (){
            var chickensDiv = document.querySelector(".chicken-row");
            var chicken = document.createElement("img");
            chicken.src = "img/chicken.svg";
            chicken.classList.add("chicken");
            chickensDiv.appendChild(chicken);
            this.chickens = document.querySelectorAll(".chicken");
        },
        /**
         *
         *   function to select a chicken to drop egg
         *   @param {number} numberChicken - the number of chicken on the game
         **/
        randomChickenToDropEgg: function (numberChicken) {
            return Math.round(Math.random() * (numberChicken - 1));
        },

        /**
         * function to show score
         * */
        showScore: function () {
            this.elScore.innerText = this.score;
            this.elCrashedEgg.innerText = this.crashedEggs;
        },
        /**
        *
        *  function to up dropping speed and egg speed
        * */
        speedup: function () {
            if (this.timeBetwenDrop > 600 || this.timeDrop > 200) {
                if (this.score / 100 == this.incrNumb) {
                    this.timeDrop -= 200;
                    this.timeBetwenDrop -= 600;
                    this.incrNumb += 5;
                    this.timeOuts.updateTimeOuts();
                }
                if(this.score/100 == 10 || this.score/100 == 20){
                    this.addChicken();
                }
            }
            if(this.timeBetwenDrop <=600 && this.timeBetwenDrop>500){
                this.timeBetwenDrop -= 100 ;
                this.timeOuts.updateTimeOuts();
            }
            if(this.timeDrop <=200 && this.timeDrop > 100){
                this.timeDrop -= 10 ;
            }
        },

        addEgg :function(cordChicken){
            var egg = document.createElement("img");
            egg.classList.add("egg");
            egg.style.position = "absolute";
            egg.style.top = cordChicken.height + "px";
            egg.style.left = cordChicken.x + egg.width / 2 + "px";
            egg.style.transitionProperty = "all";
            egg.style.transitionDuration = this.timeDrop + "ms";
            egg.src = "img/egg.jpg";
            this.eggs.push(egg);
            return egg ;
        },

        /**
         *   function to drop egg by selecting a random chicken and create new egg img have cord
         * of this chicken
         * */
        dropEgg: function () {
            var chickenToDrop = gameCore.randomChickenToDropEgg(gameCore.chickens.length),
                cordChicken = gameCore.chickens[chickenToDrop].getBoundingClientRect();
            gameCore.gameScreen.appendChild(gameCore.addEgg(cordChicken));
        },
        /**
         *   function to move the egg down
         * */
        eggDown: function () {

            for (var egg = 0; egg < gameCore.eggs.length && gameCore.eggs[egg] != ""; egg++) {
                var eggElement = gameCore.eggs[egg],
                    eggCord = eggElement.getBoundingClientRect();
                // Move Egg DOWN
                eggElement.style.top = eggCord.top + 50 + "px";
            }

        },

        /**
         *    function to remove specific egg
         *   @param {number} eggId index of the egg on gameCore.eggs
         *   @param {HTMLElement} eggElement the egg element
         * */
        removeEgg: function (eggId, eggElement) {
            eggElement.remove();
            this.eggs.splice(eggId, 1, "");

            var nullIndex = this.eggs.indexOf("");

            if (nullIndex != -1) {
                gameCore.eggs.splice(nullIndex, 1);
            }
        },
        /**
         *  function to return reset the number of chickens to 3 chickens
         * */
        removeAddedChickens : function(){
            var chickens = this.chickens ;
            for(var chicken = 0 ; chicken < chickens.length && chickens.length > 3; chicken++){
                chickens[chicken].remove();
                chickens =  document.querySelectorAll(".chicken");
            }
            this.chickens = chickens;
        },
         /**
         *  function called to end the game
         * */
        end: function () {
            this.timeOuts.clearTimeOuts();
            document.querySelector("#high-score").textContent = this.score+"pts";
            this.score = 0;
            this.crashedEggs = 0;
            this.timeDrop = 1000;
            this.timeBetwenDrop = 3000;
            this.menu.style.display = "block";
            this.removeAllEggs();
            this.showScore();
            document.querySelector("#game-over").style.display = "block";
            this.removeAddedChickens();
        },

        /**
         * function to remove all existed eggs on the screen game
         * */
        removeAllEggs: function () {
            var eggs = document.querySelectorAll(".egg");
            for (var egg = 0; egg < eggs.length; egg++) {
                eggs[egg].remove();
            }
            this.eggs = [];
        },
        /**
         * function to check if the egg on the bag
         * @param {object} cordEgg contain cord of the egg
         * @return {bool}
         * */
        isEggOnBag: function (cordEgg) {
            var bagCord = this.bag.getBoundingClientRect();
            var eggMidle = {
                x: cordEgg.x + cordEgg.width / 2,
                y: cordEgg.y + cordEgg.height / 2
            };
            var onBagFromX = eggMidle.x >= bagCord.x && eggMidle.x <= bagCord.x + bagCord.width;
            var onBagFromY = eggMidle.y >= bagCord.y && eggMidle.y <= bagCord.y + bagCord.height;
            return (onBagFromX && onBagFromY);

        },
        /**
         * function to check if the egg on the ground
         * @param {object} cordEgg contain cord of the egg
         * @return {bool}
         **/
        isEggOnGround: function (cordEgg) {
            var cordBag = this.bag.getBoundingClientRect();
            return cordEgg.top + cordEgg.height >= cordBag.top + cordBag.height;

        },
        /**
         * function used for update score when the egg on bottom of the page
         * and removing egg which on bottom of the page
         * */
        checkEggOnBag: function () {
            for (var egg = 0; egg < gameCore.eggs.length && egg[egg] != ""; egg++) {
                var eggCord = gameCore.eggs[egg].getBoundingClientRect();
                if (gameCore.isEggOnGround(eggCord)) {
                    gameCore.crashedEggs += 1;
                    gameCore.removeEgg(egg, gameCore.eggs[egg]);
                    gameCore.addCrushedEgg(eggCord);
                } else if (gameCore.isEggOnBag(eggCord)) {
                    gameCore.speedup();
                    gameCore.score += 100;
                    gameCore.removeEgg(egg, gameCore.eggs[egg]);
                }
            }
            if (gameCore.crashedEggs > 4) {
                gameCore.gameScreen.style.display = "none";
                gameCore.end();
            }

            gameCore.showScore();
        },
        /**
         * function to add crushed egg when a dropped egg on the ground
         * @param {Object} cordCrushedEgg domrect object contain coordination of crushed egg
         * */
        addCrushedEgg : function(cordCrushedEgg){
            var crushedEgg = document.createElement("img");
            crushedEgg.classList.add("crushedEgg");
            crushedEgg.src = "img/cegg.png";
            crushedEgg.style.left = Math.round(cordCrushedEgg.x)+"px";
            crushedEgg.style.top = Math.round(cordCrushedEgg.y)+"px";
            this.gameScreen.appendChild(crushedEgg);
            setTimeout(function(crushedeggElement){
                crushedeggElement.remove();
            },500,crushedEgg)
        }
    };
    //  END GAMECORE OBJECT  ;


    document.querySelector("#stargame-btn").onclick = function(e){
        document.querySelector("#how-to-play").style.display = "none";
        document.querySelector("#game-over").style.display ="none";
        e.target.parentNode.style.display = "none";
        /*
         *
         *  WHEN MOUSE MOVE ON BODY ELEMENT
         *
         **/

        document.querySelector("body").onmousemove = function(e){
            // MOVE BAG WITH THE MOSE MOVE
            gameCore.bag.style.left = e.clientX - 150/2+"px";
        };
        document.querySelector("#game-screen").style.display = "block";
        gameCore.init({
            bag : document.querySelector(".bag"),
            chicks : document.querySelectorAll(".chicken"),
            screen : document.querySelector("#game-screen"),
            mn : e.target.parentNode,
            elScore : document.querySelector("#score"),
            elCrashedEgg : document.querySelector("#crashed-eggs")

        });
    };
    document.querySelector("#rulesgame-btn").onclick = function(){
        document.querySelector("#how-to-play").style.display = "block";
    };
})();

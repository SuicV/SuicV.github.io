/*
* SLIDE MENU JS CODE
*
**/
(function(){
    /**
     * @var slideMenu OBJECT
     * */
    var slideMenu  =
    {
        slideMenu : null ,
        animationDuration : null ,
        idElToShow : null ,
        closeBtn : null ,
        /**
         *  @function init this method used to set config of this object
         *  @param  conf object contain configurations
         **/
        init : function(conf){
            this.slideMenu = conf.el ;
            this.animationDuration = conf.animDuration ;
            this.navBtns = conf.navBtns ;
            this.closeBtn = conf.closeBtn ;
            this.addClickEvent();
            this.addCloseSlideMenuEvent();
        },

        /**
         *  @method restAnimationDuration method for calculating the rest time of translate animation
         **/
        restAnimationDuration : function(){
            var cordSlideMenu = this.slideMenu.getBoundingClientRect() ;
            var restWidth = cordSlideMenu.width - Math.abs(cordSlideMenu.x);
            return (Math.ceil(restWidth*this.animationDuration/cordSlideMenu.width));
        },

        /**
         *  @method showElSlideMenu method to show slide menu
         **/
        showElSlideMenu : function(){
            slideMenu.slideMenu.classList.add("show-slid-bar");
        },

        /**
         *  @method hideElSlideMenu method to hide slide menu
         **/
        hideElSlideMenu : function () {
            slideMenu.slideMenu.classList.remove("show-slid-bar");
        },

        isDisplayed : function () {
            if(this.slideMenu.classList.contains("show-slid-bar")){
                return true;
            }
            return false ;
        },
        /**
         *  @method hideAllElSlideMenu method to hide all navigations ul element of slide menu
         **/
        hideAllElSlideMenu : function(){
            var displayedEls = this.slideMenu.querySelectorAll("nav .d-block");
            for(var disEl = 0 ; disEl < displayedEls.length ; disEl++){
                displayedEls[disEl].classList.remove("d-block");
                displayedEls[disEl].classList.add("d-none");
            }
        },
        showMenuById : function () {
            if(slideMenu.idElToShow){
                slideMenu.hideAllElSlideMenu();
                var kk = slideMenu.slideMenu.querySelector("#"+slideMenu.idElToShow);
                kk.classList.remove("d-none");
                kk.classList.add("d-block");
            }
        },
        /**
         *  @method addClickEvent method to attache click event to navigations btns
         **/
        addClickEvent : function(){
            for(var btn = 0  ; btn < this.navBtns.length ; btn++){
                this.navBtns[btn].addEventListener("click",function(e){
                    e.preventDefault();
                    document.body.style.overflow = "hidden";
                    slideMenu.idElToShow = e.target.textContent.trim() ;
                    if(slideMenu.isDisplayed()){
                        slideMenu.hideElSlideMenu();
                        setTimeout(slideMenu.showElSlideMenu, slideMenu.restAnimationDuration());
                    }else{
                        slideMenu.showElSlideMenu();
                    }
                    setTimeout(slideMenu.showMenuById ,slideMenu.restAnimationDuration());
                });
            }
            var navLinks = this.slideMenu.querySelectorAll("a") ;
            for(var link = 0 ; link < navLinks.length ; link++){
                navLinks[link].addEventListener("click",function(e){
                    slideMenu.hideAllElSlideMenu();
                    slideMenu.hideElSlideMenu();
                    document.body.style.overflow = "auto";
                });
            }
        },
        addCloseSlideMenuEvent : function(){
            this.closeBtn.addEventListener("click",function(){
                slideMenu.hideElSlideMenu();
                slideMenu.hideAllElSlideMenu();
                document.body.style.overflow = "visible";
            });
        }
    };

    slideMenu.init({
        el : document.querySelector("#slide-menu"),
        navBtns : document.querySelectorAll("header .nav-link"),
        animDuration : 1000,
        closeBtn : document.querySelector("#closeBtn")
    });

    /*
    *
    *   CONFIG SELECTING PRICES  ;
    *
    */

    function setPrice (resultDiv, maxValue, minValue){
        if(parseInt(maxValue) >= parseInt(minValue)){
            resultDiv.innerHTML = "<p class='mb-0'>max price : <span class='badge badge-primary'>"+maxValue+" DH</span></p>" +
            "<p class='mb-0'> Min price : <span class='badge badge-primary'>"+minValue+" DH</span></p>" ;
            oldMaxPric = parseInt(maxValue) ;
            oldMinPric = parseInt(minValue) ;
        }else{
            rangeInputs.inpPricMax.value = oldMaxPric;
            rangeInputs.inpPricMin.value = oldMinPric ;
        }
    }
    var rangeInputs  = {
        inpPricMax : document.getElementById("max-price"),
        inpPricMin : document.getElementById("min-price")
        };
    var oldMaxPric = parseInt(rangeInputs.inpPricMax.value) ,
        oldMinPric = parseInt(rangeInputs.inpPricMin.value) ;

    for(var key in rangeInputs){
        if(rangeInputs.hasOwnProperty(key)){
            rangeInputs[key].onchange = function(e){
                setPrice(document.getElementById("range-price"),rangeInputs.inpPricMax.value , rangeInputs.inpPricMin.value);
            };
        }
    }

    /*
    *
    * AUTOCOMPITION SYSTEM
    *
    **/
    var atoComplitionSys = {

        previousReq : null ,
        currentReq : null ,
        input : null,
        resultsDiv : null ,
        init : function(conf){
            this.input = conf.el ;
            this.resultsDiv = conf.resDiv ;
            this.input.addEventListener("keyup",function(e){
                if(e.target.value != ""){
                    atoComplitionSys.getResults(e.target.value);
                }else{
                    if(document.getElementById("search-results").firstElementChild){
                        document.getElementById("search-results").firstElementChild.remove();
                    }
                }
            });
        },

        getResults : function(productName){
            if(productName != ""){
                /*
                * IGNORE INCOMPLETE REQUEST
                * */
                if(this.previousReq != null){
                    if(this.previousReq.readyState < this.previousReq.DONE){
                        this.previousReq.abort();
                    }
                }
                /*
                * SET NEW REQUSET
                * */
                this.currentReq = new XMLHttpRequest();
                this.previousReq = this.currentReq ;
                this.currentReq.open("GET","products.json");
                this.currentReq.onreadystatechange = function(e){
                    if(e.target.readyState == e.target.DONE ){
                        if(e.target.status == 200){
                            var jsonResponse = JSON.parse(e.target.responseText);
                            var results = atoComplitionSys.searchResultsFromResp(jsonResponse,productName);
                            atoComplitionSys.showResults(results);
                        }else{
                            console.log("error");
                        }
                    }
                };
                this.currentReq.send();
            }

        },
        searchResultsFromResp : function(response, value){
            var results= {} ;
            for(var product in response ){
                if(product.search(new RegExp("^"+value,"i")) != -1){
                    results[product] = response[product];
                }
            }
            return results ;
        },
        showResults : function(Results){
            if(Object.keys(Results).length >= 1){
                var resultsDiv = document.querySelector("#search-results");
                if(resultsDiv.firstElementChild){
                    resultsDiv.firstElementChild.remove();
                }
                var htmlToAdd = "<div style='height: 150px; overflow: scroll;'>";
                for(var product in Results){
                    if(Results.hasOwnProperty(product)){
                        var currentProduct = Results[product];
                        htmlToAdd += "<div style='border-bottom: 3px solid black;'>";
                        htmlToAdd +="<h3>"+product+"</h3>";
                        htmlToAdd += "<ul>";
                        for(var feature in currentProduct){
                            if(currentProduct.hasOwnProperty(feature)){
                                htmlToAdd += "<li>"+feature+" : "+currentProduct[feature]+"</li>";
                            }
                        }
                        htmlToAdd += "</ul>";
                        htmlToAdd += "</div>";
                    }
                }
                htmlToAdd += "</div>";
                resultsDiv.innerHTML = htmlToAdd ;
            }

        }
    };
    atoComplitionSys.init({
        el : document.querySelector(".search-product-form input[type='search']"),
        resDiv : document.querySelector(".dd")

    });

    /*
    *
    *   scroll top btn
    *
    **/
    document.body.onscroll = function(e) {
        var scrollbtn = document.querySelector("#scroll-top");
        if(e.pageY > 200){
            if(scrollbtn.classList.contains("d-none")){
                scrollbtn.classList.remove("d-none");
                scrollbtn.classList.add("d-block");

            }
        }else{
            if(scrollbtn.classList.contains("d-block")){
                scrollbtn.classList.remove("d-block");
                scrollbtn.classList.add("d-none");

            }
        }
    };
    document.querySelector("#scroll-top").addEventListener("click",function(){
        window.scrollTo(0,0);
    });

})();

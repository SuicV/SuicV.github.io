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
         *  @method init this method used to set config of this object
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
    function setPrice (resultDiv){
        if(typeof oldMaxPric == "undefined"){
            oldMaxPric = rangeInputs.inpPricMax.value ;
        }
        if(typeof oldMinPric == "undefined"){
            oldMinPric = rangeInputs.inpPricMin.value ;
        }
        if(rangeInputs.inpPricMax.value > rangeInputs.inpPricMin.value){
            resultDiv.innerText = "max price : "+rangeInputs.inpPricMax.value+" Min price : "+rangeInputs.inpPricMin.value ;
        }else{
            rangeInputs.inpPricMax.value = oldMaxPric;
            rangeInputs.inpPricMin = oldMinPric ;
        }
    }
    var rangeInputs  = {
        inpPricMax : document.getElementById("max-price"),
        inpPricMin : document.getElementById("min-price")
        };
    var oldMaxPric, oldMinPric ;
    for(key in rangeInputs){
        rangeInputs[key].onchange = function(){
            setPrice(document.getElementById("range-price"));
        };
        rangeInputs[key].onclick = function(e){
            console.log(e.target);
            if(e.target == "max-price"){
                oldMaxPric = rangeInputs.inpPricMax.value ;
            }
            if(e.target=="min-price"){
                oldMinPric = rangeInputs.inpPricMin.value ;
            }
        };
    }
})();
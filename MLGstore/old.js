
(function(){

    function slideMenuSetContent(slideMenu , idElement){
        if(idElement != ""){
            var to_show = document.querySelector("#"+idElement);
            if(to_show.classList.contains("d-none")){
                to_show.classList.remove("d-none");
                to_show.classList.add("d-block");
            }
        }
    }

    function slideMenuHideAllContents(){
        var displayed_Element = document.querySelectorAll("#slide-menu .d-block");
        if(displayed_Element){
            console.log(displayed_Element);
            for(var k = 0 ; k < displayed_Element.length ; k++){

                displayed_Element[k].classList.remove("d-block");
                displayed_Element[k].classList.add("d-none");
            }
        }
    }
    function getTranslateDuration(cord, duration){
        var restWidth = cord.width - Math.abs(cord.x);
        console.log(Math.round(duration*(restWidth/cord.width)));
        return Math.round(duration*(restWidth/cord.width));

    }

    var nav_item = document.querySelectorAll("header .nav-link"),
        slide_menu = document.querySelector("#slide-menu");
    for(var i = 0 ; i < nav_item.length ; i++){
        nav_item[i].addEventListener("click",function(e){
            e.preventDefault();
            slideMenuHideAllContents();
            setTimeout(function(){
            if(slide_menu.classList.contains("show-slid-bar")){
                slide_menu.classList.remove("show-slid-bar");
                slide_menu.classList.add("show-slid-bar");
            }else{
                slide_menu.classList.add("show-slid-bar");
            }

            slideMenuSetContent(slide_menu , e.target.innerText.trim())

        },getTranslateDuration(slide_menu.getBoundingClientRect(),1000));

        });
    }
})();
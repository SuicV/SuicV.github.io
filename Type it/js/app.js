(function(){
    var tool ={
        start : false ,
        unwroth_words : [],
        rested_time : 60 ,
        cursor_word : 0 ,
        cps : 0 ,
        HScroll : 1,
        first_offset_height : 0,
        dom_elements :
        {
            all_screen : document.querySelector(".textToWrite"),
            input : document.querySelector(".typing"),
            screen : document.querySelector(".unwrited"),
            update_wroth : function (){
                this.word_to_write = document.querySelector(".unwrited mark");
                this.wroth_letter  = document.querySelector(".correct_wroth_ltr");
            },
            word_to_write : null ,
            wroth_letter : null ,
            statistics : document.querySelector(".statistics"),
            tool_div : document.querySelector(".tool"),
            results_div : document.querySelector("#results")

        },
        statistics :
        {
            h_cpm : 0 ,
            typing_wrongs : [],
            correct_typed_words:0

        },
        random_article : function(maxArticle,minArticle){
            return "Article"+Math.round(Math.random()*(maxArticle - minArticle)+minArticle);
        },
        setArticles : function(){
            var xhr = new XMLHttpRequest();
            xhr.open("GET","/Type it/articles.json");
            xhr.send();
            xhr.onreadystatechange = function(){
                if(this.readyState ==  this.DONE){
                    if(this.status === 200){
                        var article = JSON.parse(this.response)[tool.random_article(1,1)] ;
                        tool.dom_elements.screen.innerHTML = article;
                        tool.unwroth_words = tool.dom_elements.screen.innerText.split(" ");
                        tool.dom_elements.update_wroth();
                        tool.first_offset_height = tool.dom_elements.word_to_write.offsetTop ;
                    }else{
                        tool.dom_elements.screen.innerHTML = '<div class="alert alert-danger" role="alert">Error in getting articles</div>'
                    }
                }else if(this.readyState == this.LOADING){
                   tool.dom_elements.screen.innerHTML = '<div class="alert alert-info">Loading articles ...</div>'
                }
            };
        },
        show_results : function (){
            this.dom_elements.tool_div.remove();
            this.dom_elements.results_div.innerHTML =
                '<div class="alert alert-danger" role="alert"><i class="fas fa-clock"></i> Time up</div>' +
                '<p><strong>typing wrongs : </strong>'+tool.statistics.typing_wrongs.join(" | ")+'</p>'+
                '<p><strong>correct typed words : </strong>'+tool.statistics.correct_typed_words+'</p>'+
                '<p><strong>High CPM : </strong>'+tool.statistics.h_cpm+'</p>'+
                '<p>thank you for using this tool</p>';
        },

        show_instance_statistic : function (){
            if(tool.rested_time > 0){

                tool.rested_time -= 1 ;
                var cpm = tool.cps*60,
                    dom_element_time = tool.dom_elements.statistics.children[1].lastElementChild,
                    dom_element_cpm = tool.dom_elements.statistics.children[0].lastElementChild;
                if(cpm > tool.statistics.h_cpm ){
                    tool.statistics.h_cpm = cpm ;
                }
                if(dom_element_cpm && dom_element_time){
                    dom_element_cpm.innerText = cpm ;
                    dom_element_time.innerText = tool.rested_time ;
                }
                tool.cps = 0 ;
            }else{
                tool.show_results() ;
                clearInterval(tool.show_instance_statistic);
            }
        },

        write_letter :function(){
            tool.dom_elements.word_to_write.innerHTML =
                "<span class='text-success correct_wroth_ltr'>" + tool.unwroth_words[0].slice(0,tool.cursor_word) +
                "</span>"+tool.unwroth_words[0].slice(tool.cursor_word);
        }
    };

    tool.setArticles();
    tool.dom_elements.input.value = "";
    tool.dom_elements.all_screen.scrollTo(0,0) ;

    tool.dom_elements.input.addEventListener("keypress",function(e) {
        var pressedKey = e.key,
            inputValue = tool.dom_elements.input.value.concat(pressedKey);
        tool.dom_elements.update_wroth();

        if(!tool.start){
            setInterval(tool.show_instance_statistic,1000);

            tool.start = true ;

        }
        if (pressedKey == " ") {

            tool.dom_elements.screen.innerHTML = tool.dom_elements.screen.innerHTML.replace(
                new RegExp("<mark(:?.+)</mark> "+tool.unwroth_words[1]),
                    tool.unwroth_words[0]+" <mark class='bg-warning'><span class='text-success correct_wroth_ltr'></span>  "+tool.unwroth_words[1]+"</mark>");

            if (tool.unwroth_words[0] + " " == inputValue) {
                tool.statistics.correct_typed_words += 1;
            }else{

                tool.statistics.typing_wrongs.push(tool.unwroth_words[0]);

            }

            // RESTART VARIABLES
            tool.unwroth_words.shift();
            tool.dom_elements.input.placeholder = tool.unwroth_words[0];
            tool.dom_elements.input.classList.remove("text-danger");
            tool.cursor_word = 0 ;
        }else if(pressedKey === tool.dom_elements.word_to_write.innerText.charAt(tool.cursor_word)){
            /*
            * WHEN USER TAPE A CORRECT LETTER ;
            */

            if(inputValue.length <= tool.unwroth_words[0].length){
                tool.cursor_word +=1 ;
                tool.cps +=1 ;
                tool.write_letter();
                //correctLetterOfWord += pressedKey ;
            }
            if(tool.dom_elements.input.classList.contains("text-danger")){
                if(inputValue == tool.unwroth_words[0].slice(0,inputValue.length)){
                    tool.dom_elements.input.classList.remove("text-danger");
                }
            }

        }else if(pressedKey != tool.dom_elements.word_to_write.innerText.charAt(tool.cursor_word)){
            /*
            * WHEN USER PRESS THE WRONG KEY
            */
            tool.dom_elements.input.classList.add("text-danger");
        }
        if(typeof tool.unwroth_words[0] == "undefined"){
            console.log("game over");
            tool.show_results();
            clearTimeout(tool.show_results,1000);
            return null
        }
    });
    tool.dom_elements.input.addEventListener("keyup",function(e){
        if(e.key == " "){
            e.target.value = "";
        }
    });
})();

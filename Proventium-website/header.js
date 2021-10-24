$(document).ready(function(){
    $(window).scroll(function(){
        if($(this).scrollTop() > 0){
            $('header').addClass('header2');
            $(".logo").width(65).height(30);
        }
        else{
            $('header').removeClass('header2');
            $(".logo").width(180).height(70);
        }
    });
});

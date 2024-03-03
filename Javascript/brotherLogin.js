$(document).ready(function() {

    $('.filler').css('height', $('.nav').outerHeight() + "px");

    $("#navLogo").mouseenter(function() {
        $(this).find("img").attr('src', '../Images/crestC.png');

    });
    $("#navLogo").mouseleave(function() {
        $(this).find("img").attr('src', '../Images/crestBW.png');
    });

});
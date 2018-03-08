function getSearchTerm()
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == 'q')
        {
            return sParameterName[1];
        }
    }
}

$(document).ready(function() {

    var search_term = getSearchTerm(),
        $search_modal = $('#mkdocs_search_modal');

    if(search_term){
        $search_modal.modal();
    }

    // make sure search input gets autofocus everytime modal opens.
    $search_modal.on('shown.bs.modal', function () {
        $search_modal.find('#mkdocs-search-query').focus();
    });

    // Highlight.js
    hljs.initHighlightingOnLoad();
    $('table').addClass('table table-striped table-hover');


    // $('body').on('click', 'img', function(){
    //     window.open($(this).attr('src'));
    // });

    $('body').on('click', 'h2', function(){
        document.location.hash = $(this).attr('id');
    });


    $('body').on('click', 'a', function(e){
        var href = $(this).attr('href');
        if(href.indexOf('http') == 0) {
            $(this).attr('target', '_blank');
        }
    });

    $('body').on('submit', '#search-form', function(e){
        $('#mkdocs_search_modal').show();
        $('#mkdocs-search-query').val($('#mkdocs-search-query-input').val());
        console.log($('#mkdocs-search-query'));
        $('#mkdocs-search-query').focus().keyup();
        e.preventDefault();
    });

    $('body').on('click', '.close', function(e){
        $('#mkdocs_search_modal').hide();
    });
});


$('body').scrollspy({
    target: '.bs-sidebar',
});

/* Prevent disabled links from causing a page reload */
$("li.disabled a").click(function() {
    event.preventDefault();
});




var searches = document.location.search;


var params = {};
searches.slice(1).split('&').map(function(item){
    var kv = item.split('=');
    params[kv[0]] = typeof kv[1] !== "undefined"?kv[1]:'';
});
console.log(searches.slice(1).split('&'), params);

if(params.header === '0') {
    $('#header').hide();
}
if(params.nav === '0') {
    $('.sidebar').hide();
    $('#main').addClass('fullscreen');
}

const ACCESS_DENIED = 'You are not authorized to perform this action as a guest.';
const COLOR_LOADING = '#C0C0C0';


$ondelete = $('.icon-delete a');
$ondelete.click(function() {
    alert(ACCESS_DENIED);
})

$("#update_frag").submit(function(event) {
    event.preventDefault();
    alert(ACCESS_DENIED);
})

$("#update_clothing").submit(function(event) {
    event.preventDefault();
    alert(ACCESS_DENIED);
})

if(window.location.pathname == '/f-index') {
    $('.f-index').attr("id", "current-page");  // highlight Fragrances header text
}

if(window.location.pathname == '/c-index' || window.location.pathname == '/') {
    $('.c-index').attr("id", "current-page"); // highlight Clothing header text
}

if(window.location.pathname == '/about') {
    $('.about').attr("id", "current-page"); // highlight About header text
}

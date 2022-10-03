if(window.location.pathname == '/f-index') {
    $ondelete = $('.icon-delete a');
    $ondelete.click(function() {
        let id = $(this).attr("data-id");
        alert('You are not authorized to perform this action as a guest.');
    })
}

if(window.location.pathname == '/c-index' || window.location.pathname == '/') {
    $ondelete = $('.icon-delete a');
    $ondelete.click(function() {
        let id = $(this).attr("data-id");
        alert('You are not authorized to perform this action as a guest.');
    })
}

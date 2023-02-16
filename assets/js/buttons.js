const SERVERURL = 'https://yourwebsite.com';
const COLOR_LOADING = '#C0C0C0';

function setLoading(element) {
    let selector = '';
    if(element == '#add_clothing' || element == '#add_frag') {
        selector = '#btn-submit';
        $(selector).text('Generating Data...');
        $(selector).css('background-color', COLOR_LOADING);
    }
    else if(element == '#scan') {
        selector = '#scan';
        $(selector).html('<i class="fa fa-spinner fa-spin"></i>');
        $(selector).css('color', COLOR_LOADING);

        axios.get('/scanprices')
        .then(function (response) {
            switch(response.status) {
                case 200: 
                    alert('Scanning finished');
                    break;
                case 202: 
                    alert('All tracked items have already been scanned in the last 60 minutes');
                    break;
            }
            location.reload();
        })
        .catch(function (error) {
            if (error.response) {
                switch(error.response.status) {
                    case 429: alert('Scanning already in progress');
                }
            }
            else {
                console.error(error);
            }
        });
    }

    $(selector).prop('disabled', true);
}

$('#add_frag').submit(() => setLoading('#add_frag'));
$('#add_clothing').submit(() => setLoading('#add_clothing'));
$('#scan').click(() => setLoading('#scan'));

if(window.location.pathname == '/f-index') {
    $('.f-index').attr("id", "current-page");  // highlight Fragrances header text becaues we're on it
    $ondelete = $('.icon-delete a');
    $ondelete.click(function() {
        let id = $(this).attr("data-id");
        
        let request = {
            'url': `${SERVERURL}/api/frags/${id}`,
            'method': 'DELETE'
        }

        if(confirm('Are you sure you want to delete this fragrance?')){
            $.ajax(request).done(function(response){
                alert("Data deleted successfully.");
                location.reload();
            })
        }
    })
}

if(window.location.pathname == '/c-index' || window.location.pathname == '/') {
    $('.c-index').attr("id", "current-page"); // highlight Clothing header text becaues we're on it
    $ondelete = $('.icon-delete a');
    $ondelete.click(function() {
        let id = $(this).attr("data-id");

        let request = {
            'url': `${SERVERURL}/api/clothings/${id}`,
            'method': 'DELETE'
        }

        if(confirm('Are you sure you want to delete this clothing item?')){
            $.ajax(request).done(function(response){
                alert("Data deleted successfully.");
                location.reload();
            })
        }
    })
}

$("#update_frag").submit(function(event) {
    event.preventDefault();

    let unindexed_array = $(this).serializeArray();
    let data = {};

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })

    let request = {
        'url': `${SERVERURL}/api/frags/${data.id}`,
        'method': 'PUT',
        'data': data
    }

    $.ajax(request).done(function(response) {
        alert("Fragrance updated successfully.");
        location = '/f-index';
    })
})

$("#update_clothing").submit(function(event) {
    event.preventDefault();

    let unindexed_array = $(this).serializeArray();
    let data = {};

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })
    let request = {
        'url': `${SERVERURL}/api/clothings/${data.id}`,
        'method': 'PUT',
        'data': data
    }

    $.ajax(request).done(function(response) {
        alert("Clothing Item updated successfully.");
        location = '/c-index';
    })
})

// if path is /about
if(window.location.pathname == '/about') {
    $('.about').attr("id", "current-page"); // highlight Clothing header text becaues we're on it
}

if(window.location.pathname.includes('update-frag') 
|| window.location.pathname.includes('add-frag') 
|| window.location.pathname.includes('f-index')) {
    $('.logo').attr("src", "img/f-logo.png");  // offTracker logo in cyan
}


$('.hamburger-menu').click(() => {
    const mobileMenu = document.querySelector('.nav__mobile-menu');
    mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
})
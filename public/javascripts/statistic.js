var title = getTitle();
console.log(title);

jQuery.ajax({
    url: 'http://stat.dinonline.org:8080/api/record',
    method: 'post',
    crossDomain: true,
    data : {title: title },
    dataType : 'json',
    success : function (data, textStatus, jqXHR) {
        jQuery('.shs-count-cont').find('.number').text(data.page.count);
        jQuery('.shs-count-cont').css({display:'initial'});
    },
    error : function (data, textStatus, errorThrown) {
        console.log(errorThrown);
    }
});

function getTitle() {
    var title='';

    if (window.location.hostname === 'din.org.il'){
        title = jQuery("meta[name='twitter:title']").attr('content').trim();
    }

    if (window.location.hostname === 'dinonline.org'){
        title = jQuery("h1.single-title,h1.archive_title ").text().trim();
    }

    if(!title) {
        title=decodeURIComponent(window.location.href);
    }

    return title;
}

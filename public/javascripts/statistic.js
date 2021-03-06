var title = getTitle();

jQuery.ajax({
    url: 'http://stat.dinonline.org/api/record',
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

getVisits();

var timer = setInterval(function () {
    if(document.visibilityState === 'visible') {
        getVisits();
    }
},30000);


function getVisits() {
    if(document.visibilityState != 'visible') return;

    jQuery.ajax({
        url: 'http://stat.dinonline.org/api/cache',
        method: 'get',
        crossDomain: true,
        dataType : 'json',
        success : function (data, textStatus, jqXHR) {
            jQuery(".last-visits").fadeOut(function () {
                jQuery(".last-visits").html(visitsTable(data));
                jQuery(".last-visits").fadeIn();
            });
        },
        error : function (data, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}


function visitsTable(data) {
    var title,i;
    var html = "<table class='table table-striped table-condensed'>";
    var count = (data.length>=11) ? 11 : data.length;
    for(i = 0;i<count;i++){
        if (!data[i].title || data[i].title.indexOf('http')===0 ) continue;
        html += "<tr><td><a href='"+data[i].url+"'>"+data[i].title+"</a></td><td>" + data[i].count +
            "</td></tr>";
    }
    html += "</table>";

    return html;
}


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

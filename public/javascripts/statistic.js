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


jQuery.ajax({
    url: 'http://stat.dinonline.org:8080/api/cache',
    method: 'get',
    crossDomain: true,
    dataType : 'json',
    success : function (data, textStatus, jqXHR) {
        jQuery(".last-visits").html(visitsTable(data));
        console.log( visitsTable(data));
    },
    error : function (data, textStatus, errorThrown) {
        console.log(errorThrown);
    }
});


function visitsTable(data) {
    var row,i;
    var html = "<table class='table table-striped table-condensed'>";
    var count = (data.length>=10) ? 10 : data.length;
    for(i = 0;i<count;i++){
        html += "<tr><td><a href='"+data[i].url+"'>"+data[i].title+"</a></td></tr>";
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

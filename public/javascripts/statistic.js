jQuery.ajax({
    url: 'http://stat.dinonline.org:8080/api/record',
    method: 'post',
    crossDomain: true,
    data : {kuku: 'reku'},
    dataType : 'json',
    success : function (data, textStatus, jqXHR) {
        jQuery('.shs-count-cont').find('.number').text(data.page.count);
        jQuery('.shs-count-cont').css({display:'initial'});
    },
    error : function (data, textStatus, errorThrown) {
        console.log(errorThrown);
    }
});

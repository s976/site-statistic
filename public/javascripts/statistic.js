jQuery.ajax({
    //url: 'http://localhost:8080/api/record',
    url: 'http://stat.dinonline.org:8080/api/record',
    method: 'post',
    crossDomain: true,
    data : {kuku: 'reku'},
    dataType : 'json',
    success : function (data, textStatus, jqXHR) {
        jQuery('.shs-count-cont').find('.number').text(data.count);
        jQuery('.shs-count-cont').css({display:'initial'});
        //console.log(data);
    },
    error : function (data, textStatus, errorThrown) {
        console.log(errorThrown);
    }
});
jQuery.ajax({
    url: 'http://localhost:8080/api/record',
    method: 'post',
    crossDomain: true,
    data : {kuku: 'reku'},
    dataType : 'json',
    success : function (data, textStatus, jqXHR) {
        console.log('ura');
        console.log(data);
    },
    error : function (data, textStatus, errorThrown) {
        console.log('ne rabotaet');
        console.log(errorThrown);
    }
});
jQuery.ajax({
    //url: 'http://localhost:8080/api/record',
    url: 'http://185.14.186.110:8080/api/record',
    method: 'post',
    crossDomain: true,
    //data : {kuku: 'reku'},
    dataType : 'json',
    success : function (data, textStatus, jqXHR) {
        //console.log(data);
    },
    error : function (data, textStatus, errorThrown) {
        console.log(errorThrown);
    }
});
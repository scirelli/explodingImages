'use strict';
var cirelli = new Object();
cirelli.fileCount = 0;


function removeFile( eventObj ){
    $(this).parent().remove();
    eventObj.preventDefault();
    return false;
}

function addNewFile(){
    var fileListCont = $('div#listOfFiles');
    var subBtn,elemStr;

    cirelli.fileCount++;
    //We're gonig to add a new child the cheesy way
    elemStr = '<div id="cont_File_' + cirelli.fileCount + '" class="form-group">' + 
        '<input type="text" class="form-control url" name="file_' + cirelli.fileCount + '" id="file_' + cirelli.fileCount + '" style="width:90%; display:inline-block;" />';
    fileListCont.append( elemStr );
    subBtn = $('<input type="button" id="ffSub_'+ cirelli.fileCount +'" name="ffSub_'+ cirelli.fileCount +'" value="-" class="btn btn-danger" style="margin-left:10px; vertical-align:initial;"/> </div>');
    $('#cont_File_'+cirelli.fileCount).append(subBtn );
    subBtn.click( removeFile );
}

function getURLs(){
    var a = [];
    $('.url').each(function(){
        var $input = $(this),tmp='';
        if( tmp = $input.val() ){
            a.push(tmp);
        }
    });
    return a;
}

function defaultImages(){
    var a = ['1394382527973_20percent.jpg', '20140213_083956_603-SNOW_20percent.gif', 'DSCN1928_20percent.JPG', 'DSCN1943_20percent.JPG', 'DSCN1964_20percent.JPG', 'DSCN1997_20percent.JPG', 'DSCN2029_20percent.JPG', 'DSCN2039_20percent.JPG', 'IMG_5466b_20percent.jpg', 'IMG_8546_20percent.JPG', 'img027_350x305.jpg', 'img028_20percent.jpg'];
    for( var i=0,l=a.length; i<l; i++ ){
        a[i] = 'img/dogs/small/' + a[i];
    }
    return a;
}

function startExplode( e ){
    e.preventDefault();

    var a         = defaultImages(),
        oTmpImg   = null,
        oDiv      = null,
        aImgs     = [],
        fw        = null,
        tmp       = getURLs(),
        radioAlgs = document.body.querySelectorAll('input[name="algorithm"]'),
        algorithm = 'FireworkPics';

    Array.prototype.forEach.call(document.body.querySelectorAll('.image-frag'), function(el){
        el.remove();
    });

    for(var i=0,l=radioAlgs.length,el=null; i<l; i++){
        el = radioAlgs[i];
        if(el.checked){
            algorithm = el.value || 'FireworkPics';
            break;
        }
    }
    if( tmp.length ){
        a = tmp;
    }
    for( var i=0,l=a.length,url='',oImg=null; i<l; i++ ){
        oImg = new ParticlizeImage(a[i]);
        aImgs.push(oImg);
    }

    switch(algorithm){
        case 'RotateImage':
            aImgs = aImgs[Math.rndRangeInt(0, aImgs.length)];
    }

    fw = new window[algorithm](aImgs)
    fw.init();
    fw.start();
    return false;
};

$(document).ready(function(){
    var addButton = $('<input type="button" id="ffAdd" name="ffAdd" value="+" class="btn btn-success"/>');
    $('#submitCont').append(addButton);
    addButton.click( addNewFile );
    $('#ffSubmit').click( startExplode );
});

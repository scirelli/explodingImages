var RotateImage = (function(ParticlizeImage, window){
'use strict';
    var RADIUS    = 200;
    
    function init( div ){
        div._ix                   = div._x+((window.innerWidth/2)-div._halfImageWidth);
        div._iy                   = div._y+((window.innerHeight/2)-div._halfImageWidth);
        div._x                    = Math.rndRange( 0, window.innerWidth );
        div._y                    = Math.rndRange( 0, window.innerHeight );
        div._radius               = RADIUS;
        div._xRadius              = div._x - div._ix;
        div._yRadius              = div._y - div._iy;
        div.style.top             = div._y + 'px';
        div.style.left            = div._x + 'px';

        div.animate               = true;
        document.body.appendChild(div);
    }

    function anim(resolve, reject){
        var p = this.oParticleImg.getParticles(),
            me = this;
        
        var angle = this.angleStep*Math.PI,
            cos   = Math.cos(angle),
            sin   = Math.sin(angle);
        for( var i=0,l=p.length,div=null; i<l; i++ ){
            div = p[i];

            div._x = div._ix + cos*(div._xRadius*this.cnt);
            div._y = div._iy + sin*(div._yRadius*this.cnt);
            div.style.top = div._y + 'px';
            div.style.left = div._x + 'px';
        }
        this.cnt   -= 0.005;
        this.angleStep += 0.01;
        if( this.cnt >= 0 ){
            this.timeID = setTimeout(function(){ anim.call(me, resolve, reject); },0);
        }else{
            resolve('done');
        }
    }

    function RotateImage( sURL ){
        if( !sURL ) throw "RotateImage requires an image url.";

        if(sURL instanceof ParticlizeImage){
            this.oParticleImg = sURL;
        }else{
            this.oParticleImg = new ParticlizeImage(sURL);
        }

        this.cnt       = 2;
        this.angleStep = 0;
        this.timeID    = 0;

        ParticlizeImage.attachCommonStyles();
        this.oParticleImg.register( this );
    }

    RotateImage.prototype = {
        onInitParticle:function( oDiv ){
            init(oDiv);
        },
        init:function(){
            return this.oParticleImg.retrieveImageData();
        },
        remove:function(){
            this.oParticleImg.deleteImageDivs();
            return this;
        },
        start:function(){
            var self = this,
                promise;

            self.cnt       = 2;
            self.angleStep = 0;

            promise = new Promise(function(resolve, reject) {
                self.init().then(function(){
                    anim.call(self, resolve, reject);
                });
            });

            return promise;
        }
    }

    return RotateImage;
})(ParticlizeImage, window);

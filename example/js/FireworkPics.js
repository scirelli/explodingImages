//-------------------------------------------
// Requires ParticlizeImage
//-------------------------------------------
var FireworkPics = (function(ParticlizeImage, window, Promise){
'use strict';
    var GRAVITY              = -400;//1000
    var FRICTION             = 1800;
    var MIN_EXPLOSION_DELAY  = 3000;//in milli seconds
    var MAX_EXPLOSION_DELAY  = 3000;//in milli seconds
    var MAX_VELOCITY         = window.innerHeight*1;//window.innerHeight*1.4;//px/sec
    var MIN_VELOCITY         = window.innerHeight*0.5;//px/sec
    var MIN_FADE_RATE        = 0.1;//op/s
    var MAX_FADE_RATE        = 0.15;//opacity/s
    var div                  = document.createElement('div');
    var IMAGE_PARTICLES_WIDE = 20;//Should be an even number.
    var IMAGE_PARTICLES_HIGH = 20;//Should be an even number.
    
    function FireworkPics( aImgs, oElm ){
        this.aImgs = [];
        this.setElement(oElm || document.body);
        this.bRunning = true;

        if( aImgs ){
            this.setImages(aImgs);
        }
    };
    FireworkPics.prototype = {
        init:function(){
            ParticlizeImage.attachCommonStyles();
        },
        start:function(){
            var self = this,
                oImg = chooseAnImage.call(self);

            if(oImg) {
                oImg.retrieveImageData().then(function( oImg ){
                    var animationObj = createAnimationObject(oImg);

                    oImg.appendTo(self.getElement());
                    self.bRunning = true;
                    self.animateDivs(animationObj);
                },
                function(aFail){
                    self.bRunning = false;
                    self.getImages().splice(self.getImages().indexOf(oImg), 1);
                    self.start();
                }
            );
            }else{
                console.error(new Error('Could not find an image.'));
            }
        },
        stop:function(){
            this.bRunning = false;
            return this;
        },

        animateDivs:function( oAnimate ){
            var nNow          = window.performance.now(),
                nTotalTime    = nNow - oAnimate.nStartTime,
                self            = this,
                aFrameTimes   = oAnimate.aFrameTimes,
                nAvgFrameTime = 1000,
                nBufsz        = oAnimate.nFrameTimeBufferSz,
                iPointer      = oAnimate.nFrame%nBufsz,
                iPrevPointer  = (oAnimate.nFrame-1)%nBufsz;
            
            //optimize this avg frame time
            oAnimate.aFrameTimes[iPointer] = nNow;
            oAnimate.nFrame += 1;
            //for( var i=aFrameTimes.length-1,curFrame=oAnimate.nFrame; i>0; i-- ){
                //nAvgFrameTime += aFrameTimes[(curFrame-(i-1))%nBufsz] - aFrameTimes[(curFrame-i)%nBufsz];
                nAvgFrameTime = aFrameTimes[iPointer] - aFrameTimes[iPrevPointer];
                nAvgFrameTime *= 0.001;//Divide by 1000
            //}
            //nAvgFrameTime = (nAvgFrameTime/aFrameTimes.length)*0.001;//seconds

            if( nTotalTime <= oAnimate.nExplodeDelay ){
                for( var i=0,aDivs=oAnimate.aDivs,nGravity=oAnimate.nGravity,nFriction=oAnimate.nFriction,l=aDivs.length,oDiv=null; i<l; i++ ){
                    oDiv = aDivs[i];
                    if( oDiv._animate ){
                        //oDiv._velX      += nFriction*nAvgFrameTime;
                        oDiv._velY      += nGravity*nAvgFrameTime;
                        oDiv._x         += oDiv._velX*nAvgFrameTime;
                        oDiv._y         -= oDiv._velY*nAvgFrameTime;
                        oDiv._opVel     += oDiv._opVel*nAvgFrameTime;
                        oDiv._opacity   -= oDiv._opVel*nAvgFrameTime;
                        oDiv._rotAngel  += oDiv._rotVel*nAvgFrameTime;
                        oDiv.style.opacity = oDiv._opacity;
                        oDiv.style.webkitTransform = oDiv.style.transform = oDiv.style.msTransform = 'rotate(' + oDiv._rotAngel + 'rad)';
                        oDiv.style.left    = oDiv._x + 'px';
                        oDiv.style.top     = oDiv._y + 'px';
                        if( oDiv._x < (0 - oDiv._pw - oDiv._ph) || (oDiv._pw + oDiv._ph - oDiv._x) > window.innerWidth || oDiv._y > window.innerHeight + oDiv._imageHeight ){
                            oDiv._animate = false;
                            oAnimate.nCompleteCount++;
                        }
                    }
                }
                if( oAnimate.nCompleteCount < oAnimate.aDivs.length ){
                    setTimeout(function(){
                        self.animateDivs(oAnimate);
                    },0);
                }else{
                    this.deleteImageDivs(oAnimate);
                    this.start();
                }
            }else{
                this.explode( oAnimate, nAvgFrameTime );
            }
        },
        explode:function( oAnimate, nAvgFrameTime ){
            console.log('boom');
            oAnimate.nExplodeDelay = 9999999;
            for( var i=0,aDivs=oAnimate.aDivs,nGravity=oAnimate.nGravity,l=aDivs.length,oDiv=null; i<l; i++ ){
                oDiv = aDivs[i];
                if( oDiv._animate ){
                    oDiv._velX      += oDiv._velX0;
                    oDiv._velY      += oDiv._velY0;
                    oDiv._velY      += nGravity*nAvgFrameTime;
                    oDiv._opVel     += oDiv._opVel0;
                    oDiv._opacity   -= oDiv._opVel*nAvgFrameTime;
                    oDiv._rotVel    += oDiv._rotVel0;
                    oDiv._rotAngel  += oDiv._rotVel*nAvgFrameTime;
                    oDiv._x         += oDiv._velX*nAvgFrameTime;
                    oDiv._y         -= oDiv._velY*nAvgFrameTime;
                    oDiv.style.left  = oDiv._x + 'px';
                    oDiv.style.top   = oDiv._y + 'px';
                    oDiv.style.webkitTransform = oDiv.style.transform = oDiv.style.msTransform = 'rotate(' + oDiv._rotAngel + 'rad)';
                }
            }
            this.animateDivs( oAnimate );
        },
        deleteImageDivs:function(oAnimate){
            for( var i=0,aDivs=oAnimate.aDivs,l=aDivs.length; i<l; i++ ){
                aDivs[i].remove();
            }
            return this;
        },

        getElement:function(){
            return this.oElm;
        },
        setElement:function( oElm ){
            this.oElm = oElm;
            return this;
        },
        addImage:function( oImg ){
            if( oImg instanceof ParticlizeImage ){
                this.aImgs.push( oImg );
            }else if( oImg && oImg.src ) {
                this.addImage(new ParticlizeImage(oImg.src, IMAGE_PARTICLES_WIDE, IMAGE_PARTICLES_HIGH));
            }else if(typeof(oImg) === 'string') {
                this.addImage(new ParticlizeImage(oImg, IMAGE_PARTICLES_WIDE, IMAGE_PARTICLES_HIGH));
            }else{
                console.warn( 'Could not add image' + oImg );
            }
            return this;
        },
        clearImages:function(){
            var a = this.aImgs;
            this.aImgs = [];
            return a;
        },
        setImages:function( aImgs ){
            this.clearImages();
            if( aImgs instanceof Array ){
                for( var i=0, l=aImgs.length; i<l; i++ ){
                    this.addImage(aImgs[i]);
                }
            }else if( aImgs instanceof ParticlizeImage ){
                this.addImage(aImgs);
            }else{
                console.warn( 'Could not set image \'' + aImgs + '\'');
            }
            return this;
        },
        getImages:function(){
            return this.aImgs;
        },
        imageCount:function(){
            return this.aImgs.length;
        }
    };

    //=======================================
    // FireworkPics Private methods
    //=======================================

    function chooseAnImage() {
        return this.getImages()[Math.floor(Math.rndRange(0,this.imageCount()))];
    }

    function indexIntoArray( row, col, totalCols ){
        return row*totalCols + col;
    }

    function chooseQuadrantAngle( x, y, w, h, w2, h2 ){
        //Quad 1
        if( x >= 0 && x <= w2 && y >= 0 && y <= h2 ){
            return Math.toRadians(Math.rndRange(90,180));
        }
        //Quad 2
        if( x > w2 && x <= w && y >= 0 && y <= h2 ){
            return Math.toRadians(Math.rndRange(0,90));
        }
        //Quad 3
        if( x > w2 && x <= w && y > h2 && y <= h ){
            return Math.toRadians(Math.rndRange(360,270));
        }
        //Quad 4
        if( x >= 0 && x <= w2 && y > h2 && y <= h ){
            return Math.toRadians(Math.rndRange(180,270));
        }
        return Math.toRadians(Math.rndRange(0,360));
    }

    function createAnimationObject(oImg){
        var cx           = window.innerWidth/2,  //Center X  TODO: Make it a random point along the mid bottom of the page
            cy           = window.innerHeight,
            nExplodeDelay= Math.rndRange(MIN_EXPLOSION_DELAY,MAX_EXPLOSION_DELAY),//in ms
            nAngel       = Math.PI*0.5,
            //nVx          = Math.abs(nVel) * Math.cos(nAngel),
            //nVy          = Math.abs(nVel) * Math.sin(nAngel),
            aDivs        = [],
            nStartTime   = window.performance.now();
        
        aDivs = initImageParticles( oImg, cx, cy ).getParticles();
        nExplodeDelay = aDivs[0]._velY/0.3;
        return {
            aDivs:aDivs, 
            nCompleteCount:0,
            nExplodeDelay:nExplodeDelay,//Fuse
            nStartTime:nStartTime,
            nFrame:1,
            aFrameTimes:[nStartTime,1,1,1,1,1,1,1,],
            nFrameTimeBufferSz:10,
            nGravity:GRAVITY,
            nFriction:FRICTION
        };
    }
        
    function initImageParticles( oImg, cx, cy ){
        if(oImg instanceof ParticlizeImage === false) {
            throw new Error('oImg not a ParticlizeImage.');
        }

        var iw       = oImg.getWidth(),       //Image width
            ih       = oImg.getHeight(),      //Image height
            iw2      = iw/2,                  //half the image width
            ih2      = ih/2,                  //half the image height
            rows     = oImg.getImageRowsCnt(),//Number of rows in this image's grid
            cols     = oImg.getImageColsCnt(),//Number of columns in this image's grid
            pw       = iw/cols,               //particle width
            ph       = ih/rows,               //particle height
            pw2      = (pw*cols)/2,           //half the particle width
            ph2      = (ph*rows)/2,           //half the particle height
            nVel     = Math.rndRange(MIN_VELOCITY,MAX_VELOCITY),//init vel for all divs
            nAngel   = Math.toRadians(Math.rndRange(85,95)),
            velX     = Math.abs(nVel) * Math.cos(nAngel),
            velY     = Math.abs(nVel) * Math.sin(nAngel),
            imgDivs  = oImg.getParticles();

        for( var col=0;  col<cols; col++ ){
            for( var row=0,x=0,y=0,velX0=0,velY0=0,nOpVel=0,nRotAngel=0,nRotVel=0,oDiv=null; row<rows; row++ ){
                oDiv = imgDivs[indexIntoArray(row, col, cols)];
                x    = col*pw;
                y    = row*ph;
                //For the explosion
                nOpVel    = Math.rndRange(MIN_FADE_RATE,MAX_FADE_RATE);
                nVel      = Math.rndRange(0,MAX_VELOCITY);//init vel for all divs
                nAngel    = chooseQuadrantAngle( x, y, iw, ih, iw2, ih2 );
                velX0     = nVel * Math.cos(nAngel);
                velY0     = nVel * Math.sin(nAngel);
                nRotAngel = nAngel;
                nRotVel   = nVel * Math.cos(nRotAngel)

                oDiv._animate                  = true;
                oDiv._completeCount            = 0;
                oDiv._imageWidth               = iw;
                oDiv._imageHeight              = ih;
                oDiv._pw                       = pw;
                oDiv._ph                       = ph;
                oDiv.style.backgroundImage     = 'url(' + oImg.getURL() + ')';
                oDiv.style.width               = Math.ceil(pw) + 'px';
                oDiv.style.height              = Math.ceil(ph) + 'px';
                oDiv._x                        = (x-pw2)+cx;
                oDiv._y                        = (y)+cy;
                oDiv._opVel0                   = nOpVel;
                oDiv._opVel                    = 0;
                oDiv._opacity                  = 1;
                oDiv._rotVel0                  = nRotVel;
                oDiv._rotVel                   = 0;
                oDiv._rotAngel                 = 0;
                oDiv._velX0                    = velX0;
                oDiv._velY0                    = velY0;
                oDiv._velX                     = velX,
                oDiv._velY                     = velY,
                oDiv._angle                    = nAngel;
                oDiv.style.opacity             = 1;
                oDiv.style.left                = oDiv._x + 'px';
                oDiv.style.top                 = oDiv._y + 'px';
                //oDiv.style.backgroundPositionX = -x + 'px';
                //oDiv.style.backgroundPositionY = -y + 'px';
                oDiv.style.backgroundPosition  = -x + 'px ' + -y + 'px';
                oDiv.classList.add('image-frag');
            }
        }

        return oImg;
    }

    return FireworkPics;
})(ParticlizeImage, window, window.Promise);

//------------------------------------------------
// Determins in the parameter is a number
// @param: n - anything
// @return: boolean - true if n is a number false
//          otherwise
//------------------------------------------------
if(!Math.isNumber)
    Math.isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

//------------------------------------------------
// Generates a random number using Math.random()
// in the given range between min and max.
// @param: min - Integer; lower bounds
// @param: max - Integer; upper bounds
// @return: a random number between min and max
//------------------------------------------------
if(!Math.rndRange)
    Math.rndRange = function ( min, max ){
        if( isNaN(min) || isNaN(max) ) return NaN;
        return Math.random()*(max-min)+min;
    }

//------------------------------------------------
// Generates a random number using Math.random()
// in the given range between min and max.
// @param: min - Integer; lower bounds
// @param: max - Integer; upper bounds
// @return: a random number between min and max
//------------------------------------------------
if(!Math.rndRangeInt)
    Math.rndRangeInt = function ( min, max ){
        if( isNaN(min) || isNaN(max) ) return NaN;
        return ~~(Math.random()*(max-min)+min);
    }

//------------------------------------------------
// Converts a byte to a hex number.
// @param: n - number; a number in the range of 
//   0 to 255.
//------------------------------------------------
if(!Math.byte2Hex)
    Math.byte2Hex = function(n) {
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
    }

if(!Math.toDegrees)
    Math.toDegrees = function (angle) {
      return angle * (180 / Math.PI);
    }

if(!Math.toRadians)
    Math.toRadians = function (angle) {
      return angle * (Math.PI / 180);
    }

if(!Math.choose)
    Math.choose = function( array ){
        return array[ Math.randomRange(0,array.length-1) ];
    }

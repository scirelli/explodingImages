if( formUtils == undefined ){ var formUtils = new Object(); }

//*****************************************************
// Note from Author (Cirelli).
// I wanted these functions to not have to rely on jQuery
// But some do (Dan's script so far). So you will need
// to include jQuery
//*****************************************************

!function( formUtils ){
"use strict";//Just don't cross the streams!!
    //------------------------------------------------
    // Returns the version of Internet Explorer or a -1
    // (indicating the use of another browser).
    // TODO: Create a better way to determine IE
    // This is also implemented as a navigator extra
    //------------------------------------------------
    formUtils.getInternetExplorerVersion = function() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null){
                rv = parseFloat( RegExp.$1 );
            }
        }
        return rv;
    }

    //------------------------------------------------
    // IE Version variable
    //------------------------------------------------
    formUtils.IEVersion = formUtils.getInternetExplorerVersion();

    //------------------------------------------------
    // Returns true if it is a DOM node
    //
    //------------------------------------------------
    formUtils.isNode = function(o){
        return (
            typeof Node === "object" ? o instanceof Node : 
            typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
        );
    }

    //------------------------------------------------
    // Returns true if it is a DOM element    
    //
    //------------------------------------------------
    formUtils.isElement = function(o){
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    }

    //------------------------------------------------
    // Simple function that tests to see if the DOM node
    // passed in has the node name nodeName
    // @param: node {Object}; A DOM node.
    // @param: nodeName {String}; the name of the DOM 
    // node. 
    //------------------------------------------------
    formUtils.ieDOMNodeIs = function( node, nodeName ){
        if( formUtils.isElement(node) && node.nodeName.toLowerCase() == nodeName.toLowerCase() ){
            return true;
        }
        return false;
    }

    //------------------------------------------------
    // Returns returns a DOM element from the given
    // argument.  The argument can be the id of an element
    // or a jQuery obj. If the argument can't be determined
    // it returns the passed in argument.
    // @param: elem - {DOM Element}, {jQuery}, {string},
    //         {String}; of the form element. If argument
    //         is a string the it must be the id of the 
    //         element.
    // @param: [throwEx] {boolean}: Whether you want to throw an exception
    //    if the elem is not a DOM Element. defaults to false
    // @return: a DOM element.
    //------------------------------------------------
    formUtils.getDOMElement = function( elem, throwEx ){
        if(  elem instanceof String || typeof(elem) === 'string'){
            elem = document.getElementById(elem); 
        }else if( elem instanceof jQuery ){
            elem = elem.get(0);
        }else if( typeof(elem) === 'Element' || elem instanceof Element ){
        }else{
            if( throwEx ){
                throw 'formUtils.getDOMElement could not get a valid DOM Element for: ' + elem;
            }
        }

        return elem;
    }

    //Reimplement for IE
    if( formUtils.IEVersion > -1 && formUtils.IEVersion < 8 ){
        //------------------------------------------------
        // Returns returns a DOM element from the given
        // argument.  The argument can be the id of an element
        // or a jQuery obj. If the argument can't be determined
        // it returns the passed in argument.
        // @param: elem - {DOM Element}, {jQuery}, {string},
        //         {String}; of the form element. If argument
        //         is a string the it must be the id of the 
        //         element.
        // @param: [throwEx] {boolean}: Whether you want to throw an exception
        //    if the elem is not a DOM Element. defaults to false
        // @return: a DOM element.
        //------------------------------------------------
        formUtils.getDOMElement = function( elem, throwEx ){
            if(  elem instanceof String || typeof(elem) === 'string'){
                elem = document.getElementById(elem); 
            }else if( elem instanceof jQuery ){
                elem = elem.get(0);
            }else if( elem instanceof Object){
            }else{
                if( throwEx ){
                    throw 'formUtils.getDOMElement could not get a valid DOM Element for: ' + elem;
                }
            }

            return elem;
        }
    }

    //------------------------------------------------
    // Returns a valid select box for the given select
    // box. 
    // @param: selectBox - DOM Element, jQuery, string,
    //         String; the selectBox
    // @param: [funcName] - string; Optional string
    //    for error string.
    // @return: a DOM select Element
    //------------------------------------------------
    formUtils.validSelectbox = function( selectBox, funcName ){
        selectBox = formUtils.getDOMElement( selectBox );

        if( !formUtils.isValidSelectbox(selectBox) ){
            throw 'Not a valid select box for function ' + funcName + ' ' + this.toString();
        }
        return selectBox;
    }

    //------------------------------------------------
    // Returns true if the passed in argument is a 
    // selectBox.
    // @param: selectBox - {DOM Element}, {jQuery}, {string},
    //         {String}; the selectBox
    // @return: true if a selectBox, false otherwise 
    //------------------------------------------------
    formUtils.isValidSelectbox = function( selectBox ){
        selectBox = formUtils.getDOMElement( selectBox );

        return selectBox instanceof HTMLSelectElement;
    }

    //Reimplement for IE
    if( formUtils.IEVersion > -1 && formUtils.IEVersion < 8 ){

        formUtils.isValidSelectbox = function( selectBox ){
            selectBox = formUtils.getDOMElement( selectBox );

            return formUtils.ieDOMNodeIs(selectBox, 'select');
        }
    }

    //------------------------------------------------
    // Returns an object with the given elements data
    // @param: elem - DOM Element, jQuery, string,
    //         String; of the form element
    // @return: an object.
    //    if HTMLSelectElement { value:Array(), index:Array(), text:Array() } 
    //    if HTMLTextAreaElement { value:string }
    //    if HTMLInputElement { value:string, checked:boolean }
    //------------------------------------------------
    formUtils.getFormElementsData = function( elem ){
        var rtn = {};

        elem = formUtils.getDOMElement( elem );

        if( elem instanceof HTMLSelectElement === true ){
            var value = formUtils.getAllSelectedValuesFromSelectBox(elem),
                index = formUtils.getAllSelectedFromSelectBox(elem),
                text  = formUtils.getAllSelectedTextFromSelectBox(elem);

            rtn.index = index;
            rtn.value = value;
            rtn.text  = text;
        }else if( elem instanceof HTMLTextAreaElement === true ){
            rtn.value = elem.value;
        }else if( elem instanceof HTMLInputElement === true ){
            switch( elem.type ){
            case 'text':
            case 'button':
            case 'submit':
            case 'reset': 
            case 'password': 
            case 'hidden': 
            case 'file':
                rtn.value = elem.value;
                break;
            case 'checkbox':
            case 'radio':
                rtn.value   = elem.value;
                rtn.checked = elem.checked;
                break;

            case 'image': 
            default:
            }
        }
        return rtn;
    }

    //Reimplement for IE
    if( formUtils.IEVersion > -1 && formUtils.IEVersion < 8 ){

        //jQuery.log('We are in IE ' + formUtils.IEVersion );
        //jQuery.log('I\'m now going to replace formUtils.getFormElementsData() with an IE, less stable, version. I hate IE');

        formUtils.getFormElementsData = function( elem ){
            var rtn = {};

            elem = formUtils.getDOMElement( elem );

            //jQuery.log(elem.nodeName);
            if( formUtils.ieDOMNodeIs( elem, 'select' ) ){
                var value = formUtils.getAllSelectedValuesFromSelectBox(elem),
                    index = formUtils.getAllSelectedFromSelectBox(elem),
                    text  = formUtils.getAllSelectedTextFromSelectBox(elem);

                rtn.index = index;
                rtn.value = value;
                rtn.text  = text;
            }else if( formUtils.ieDOMNodeIs( elem, 'textarea' ) ){
                rtn.value = elem.value;
            }else if( formUtils.ieDOMNodeIs( elem, 'input' ) ){
                switch( elem.type ){
                case 'text':
                case 'button':
                case 'submit':
                case 'reset': 
                case 'password': 
                case 'hidden': 
                case 'file':
                    rtn.value = elem.value;
                    break;
                case 'checkbox':
                case 'radio':
                    rtn.value   = elem.value;
                    rtn.checked = elem.checked;
                    break;

                case 'image': 
                default:
                }
            }
            return rtn;
        }
    }

    //------------------------------------------------
    // Deslect all options in a select box 
    // select box
    // @param: selectBox - HTMLSelectBox; the selectBox
    // @return: An array of selected options values
    //------------------------------------------------
    formUtils.deselectAllinSelectBox = function( selectBox ){
        selectBox = formUtils.validSelectbox( selectBox );
        for( var i=0, options=selectBox.options, l=options.length; i<l; i++ ){
            options[i].selected = false;
        }
    }

    //------------------------------------------------
    // Selects all options in a select box, and fires
    // it's on change event. If hightlightOptions is 
    // true then it will deselect all the options.
    // @param: selectBox - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @param: hightlightOptions - Boolean; Where or not to
    //  deselect all options after selecting them all. 
    //------------------------------------------------
    formUtils.selectAllSelectBox = function( selectBox, hightlightOptions, fireChange){
        selectBox = formUtils.validSelectbox( selectBox );
        hightlightOptions = hightlightOptions === undefined ? true : hightlightOptions;
        fireChange = fireChange === undefined ? true : fireChange;

        for( var i=0, k=selectBox.options.length, opts=selectBox.options; i<k; i++ ){//clear the current list.
            opts[i].selected = true;
        }
        if(fireChange) { 
            jQuery(selectBox).change(); 
        }
        if( !hightlightOptions ){
            for( var i=0, k=selectBox.options.length, opts=selectBox.options; i<k; i++ ){//clear the current list.
                opts[i].selected = false;
            }
        }
    }

    //------------------------------------------------
    // Selects the option in a select box, and fires
    // it's on change event for the option that matches
    // the value given.
    // @param: selectBox - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @param: value - Mixed; 
    // @param: fireChange - {boolean}; fire the on change event
    // @return: returns the index of the selected item, or -1 if not found.
    //------------------------------------------------
    formUtils.selectOption = function( selectBox, value, fireChange ){
        selectBox = formUtils.validSelectbox( selectBox );
        fireChange = fireChange === undefined ? true : fireChange;
        var rtn=-1;
        for( var i=0, k=selectBox.options.length, opts=selectBox.options; i<k; i++ ){//clear the current list.
            if( opts[i].value == value ){
                opts[i].selected = true;
                rtn=i;
                break;
            }
        }
        if(fireChange) { 
            jQuery(selectBox).change(); 
        }
        return rtn;
    }

    //------------------------------------------------
    // Removes all optoin elements from the passed in
    // select box
    // @param: selectBox - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    //------------------------------------------------
    formUtils.emptySelectBox = function( selectBox ){
        selectBox = formUtils.validSelectbox( selectBox );

        for( var i=0, k=selectBox.length; i<k; i++ ){//clear the current list.
            selectBox.remove(0);
        }
    }

    //------------------------------------------------
    // Removes optoin elements from the passed in
    // select box by index.
    // @param: selectBox - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @param: index - array of indecies to remove
    //------------------------------------------------
    formUtils.removeItemFromSelectBox = function( selectBox, index ){
        selectBox = formUtils.validSelectbox( selectBox );
        if( ! (index instanceof Array) ) return; 

        for( var i=0, k=index.length; i<k; i++ ){//clear the current list.
            if( selectBox.options[index[i]] ){
                selectBox.remove(index[i]);
            }
        }
    }

    //------------------------------------------------
    // Gets all indecies of selected options in a
    // select box
    // @param: selectBox - HTMLSelectBox; the selectBox
    // @return: An array of selected options indecies 
    //------------------------------------------------
    formUtils.getAllSelectedFromSelectBox = function( selectBox ){
        var indexArray = new Array();
        
        selectBox = formUtils.getDOMElement( selectBox );
        if( !formUtils.isValidSelectbox( selectBox ) ){
            return indexArray;
        }

        for( var i=0, options=selectBox.options, l=options.length; i<l; i++ ){
            if( options[i].selected ){
                indexArray.push(i);
            } 
        }
        return indexArray;
    }

    //------------------------------------------------
    // Gets all optoin elements of selected options in a
    // select box.
    // @param: selectBox - HTMLSelectBox; the selectBox
    // @return: An array of selected option objects
    //------------------------------------------------
    formUtils.getAllSelectedOptnsFromSelectBox = function( selectBox ){
        var elmArray = new Array();
        
        selectBox = formUtils.getDOMElement( selectBox );
        if( !formUtils.isValidSelectbox( selectBox ) ){
            return elmArray;
        }

        for( var i=0, options=selectBox.options, l=options.length; i<l; i++ ){
            if( options[i].selected ){
                elmArray.push(options[i]);
            } 
        }
        return elmArray;
    }

    //------------------------------------------------
    // Gets all values of selected options in a
    // select box
    // @param: selectBox - HTMLSelectBox; the selectBox
    // @return: An array of selected options values
    //------------------------------------------------
    formUtils.getAllSelectedValuesFromSelectBox = function( selectBox ){
        var indexArray = new Array();

        selectBox = formUtils.getDOMElement( selectBox );
        if( !formUtils.isValidSelectbox( selectBox ) ){
            return indexArray;
        }

        for( var i=0, options=selectBox.options, l=options.length; i<l; i++ ){
            if( options[i].selected ){
                indexArray.push(options[i].value);
            } 
        }
        return indexArray;
    }

    //------------------------------------------------
    // Author: Dan M.
    // Gets all values of selected options in a div
    // @param: div - string; the div
    // @return: An array of selected options values
    //------------------------------------------------
    formUtils.getAllSelectedValuesFromDiv = function( div ){
        var indexArray = new Array();

        var $div = jQuery('#'+div);
        $div.find('.selected').each( function() {
            indexArray.push(jQuery(this).attr('value'));
        });

        return indexArray;
    }

    //------------------------------------------------
    // Gets all text of selected options in a
    // select box
    // @param: selectBox - HTMLSelectBox; the selectBox
    // @return: An array of selected options values
    //------------------------------------------------
    formUtils.getAllSelectedTextFromSelectBox = function( selectBox ){
        var indexArray = new Array();

        selectBox = formUtils.getDOMElement( selectBox );
        if( !formUtils.isValidSelectbox( selectBox ) ){
            return indexArray;
        }

        for( var i=0, options=selectBox.options, l=options.length; i<l; i++ ){
            if( options[i].selected ){
                indexArray.push(options[i].text);
            } 
        }
        return indexArray;
    }

    //------------------------------------------------
    // Returns the index in the options array of the given
    // select box of the given value. 
    // @param: selectBox - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @param: value - string; the value to search for.
    // @param: caseInsensitive - boolean; true for case 
    //         insensitive search false for case sensitive.
    //         default true.
    // @return: integer: the index or -1 if not found
    //------------------------------------------------
    formUtils.getIndexOfValueInSelectBox = function( selectBox, value, caseInsensitive ){
        selectBox = formUtils.validSelectbox( selectBox );
        caseInsensitive = caseInsensitive || true;
        value = caseInsensitive ? value : value.toLowerCase();

        for( var i=0, options = selectBox.options, sz=selectBox.options.length; i<sz; i++ ){
            var tmpValue = caseInsensitive ? options[i].value : options[i].value ? options[i].value.toLowerCase() : options[i].value;
            if( value == tmpValue ){
                return i;
            }
        }
        return -1;
    }

    //------------------------------------------------
    // Returns the index of the first accurance of the
    // text in the selectbox optoins text.
    // @param: selectBox - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @param: text - string; the string to search for.
    // @param: caseInsensitive - boolean; true for case 
    //         insensitive search false for case sensitive.
    //         default true.
    // @return: integer: the index or -1 if not found
    //------------------------------------------------
    formUtils.getIndexOfTextInSelectBox = function( selectBox, text, caseInsensitive ){
        selectBox = formUtils.validSelectbox( selectBox );
        caseInsensitive = caseInsensitive || true;
        text = caseInsensitive ? text: text.toLowerCase();

        for( var i=0, options = selectBox.options, sz=selectBox.options.length; i<sz; i++ ){
            var tmpValue = caseInsensitive ? options[i].text : options[i].text ? options[i].text.toLowerCase() : options[i].text;
            if( text == tmpValue ){
                return i;
            }
        }
        return -1;
    }

    //------------------------------------------------
    // Adds optoins to a select box from the given array
    // of value, text pairs.
    // @param: selectBox - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @param: array - {Array}; array of objects that have {value:v, text:t} properties
    // @param: append - {boolean}; true if you want to append the optoins in the select box
    //   or false to clear the selectbox first. Default is false
    //------------------------------------------------
    formUtils.addOptionsToSelectbox = function( selectBox, array, append ){
        selectBox = formUtils.validSelectbox( selectBox );
        append = append || false;

        if( append == false ) { formUtils.emptySelectBox( selectBox ); }
        
        for( var i=0, sz=array.length, option=null, item=null; i<sz; i++ ){
            option=document.createElement("option");
            item = array[i]; 
            if( typeof(item) == "object" && item.text != undefined && item.value != undefined ){
                option.text  = array[i].text;
                option.value = array[i].value;
                try{
                    // for IE earlier than version 8
                    selectBox.add(option,selectBox.options[null]);
                } catch (e) {
                    selectBox.add(option,null);
                }
            }
        }
    }

    //------------------------------------------------
    // Appends the selected items in selectbox1 to 
    // selectbox2, and removes them from selectbox1. 
    // @param: selectBox1 - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @param: value - string, array: the value of the items
    //         you want moved to selectbox2.
    // @param: selectBox2 - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @param: remove - boolean; optinal, defaults true.
    //         whether to remove the items from selectbox1
    // @return: 
    //------------------------------------------------
    formUtils.moveSelItmBtwnSelectbx = function( selectBox1, selectBox2, remove ){
        selectBox1 = formUtils.validSelectbox( selectBox1 );
        selectBox2 = formUtils.validSelectbox( selectBox2 );
        if( remove === undefined || remove === null ) remove = true;
        var selectedOptions = formUtils.getAllSelectedOptnsFromSelectBox(selectBox1),
        selectedIndices = formUtils.getAllSelectedFromSelectBox(selectBox1);//Doing this twice is slow but i'm being rushed as usual.

        formUtils.addOptionsToSelectbox( selectBox2, selectedOptions, true );
        if( remove ){
            formUtils.removeItemFromSelectBox( selectBox1, selectedIndices );
        }
    }

    //------------------------------------------------
    // Moves the selected item in the given select box
    // up or down by 1.
    // @param: selectBox - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @param: dir - string; either 'up' or 'down'
    // @return: true if movement was made
    //------------------------------------------------
    formUtils.moveSelItmDir = function( selectBox, dir ){
        selectBox = formUtils.validSelectbox( selectBox );
        dir = dir.toLowerCase();
        var options = selectBox.options,
            selIndex = options.selectedIndex,
            selectedOpt = options[selIndex],
            tmpI = 0,
            dist = 1;//distance
        
        if( selIndex === undefined || selIndex === null ) return false;

        switch( dir ){
            case 'up':
            case 'u':
                dir = -1;
            break;

            case 'down':
            case 'd':
            case 'dwn':
            default:
                dir = 1;
        }

        tmpI = selIndex+(dir*dist);
        if( tmpI >= options.length || tmpI < 0 ) return false;
        if( options.remove === undefined ){
            options[selIndex]=null;
        }else{
            options.remove(selIndex);
        }
        options.add( selectedOpt, selIndex+(dir*1) );

        return true;
    }

    //------------------------------------------------
    // Moves the selected item in a select box up 1
    // @param: selectBox - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @return: true if movement was made
    //------------------------------------------------
    formUtils.moveSelItmUp = function( selectBox ){
        return formUtils.moveSelItmDir( selectBox, 'up' );
    }

    //------------------------------------------------
    // Moves the selected item in a select box down 1
    // @param: selectBox - String, string, jQuery, or
    //         a DOM element that represents a select
    //         box.
    // @return: true if movement was made
    //------------------------------------------------
    formUtils.moveSelItmDown = function( selectBox ){
        return formUtils.moveSelItmDir( selectBox, 'down' );
    }
}(formUtils);

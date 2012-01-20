//=========================================
// ������չģ�� by ˾ͽ����
//=========================================
$.define("lang", Array.isArray ? "" : "ecma", function(){
    $.log("�Ѽ���������չģ��");
    var global = this,
    rascii = /[^\x00-\xff]/g,
    rformat = /\\?\#{([^{}]+)\}/gm,
    rnoclose = /^(area|base|basefont|bgsound|br|col|frame|hr|img|input|isindex|link|meta|param|embed|wbr)$/i,
    // JSON RegExp
    rvalidchars = /^[\],:{}\s]*$/,
    rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
    rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
    str_eval = global.execScript ? "execScript" : "eval",
    str_body = (global.open + '').replace(/open/g, '');
    $.mix($,{
        //�ж��Ƿ���һ�����ص�javascript����Object��JSON��������DOM���󣬲���BOM���󣬲����Զ������ʵ����
        isPlainObject : function (obj){
            if(!$.type(obj,"Object") || $.isNative(obj, "reload") ){
                return false;
            }     
            try{//������hasOwnProperty�����Ķ���϶���IE��BOM�����DOM����
                for(var key in obj)//ֻ��һ��������������ԭ����������flase   
                    if(!({}).hasOwnProperty.call(obj, key)){//������obj.hasOwnProperty�Լ����Լ�
                        return false
                    }
            }catch(e){
                return false;
            }
            return true;
        },
        //�ж�method�Ƿ�Ϊobj��ԭ����������$.isNative(window,"JSON")
        isNative : function(obj, method) {
            var m = obj ? obj[method] : false, r = new RegExp(method, 'g');
            return !!(m && typeof m != 'string' && str_body === (m + '').replace(r, ''));
        },
        /**
         * �Ƿ�Ϊ�ն���
         * @param {Object} obj
         * @return {Boolean}
         */
        isEmptyObject: function(obj ) {
            for ( var i in obj ){
                return false;
            }
            return true;
        },
        //����Array,Arguments,NodeList,HTMLCollection,IXMLDOMNodeList���Զ������������
        //select.options���ϣ�������������item��length���ԣ�
        isArrayLike :  function (obj) {
            if(!obj || obj.document || obj.nodeType || $.type(obj,"Function")) return false;
            return isFinite(obj.length) ;
        },
        //���ַ����е�ռλ���滻Ϊ��Ӧ�ļ�ֵ
        //http://www.cnblogs.com/rubylouvre/archive/2011/05/02/1972176.html
        format : function(str, object){
            var array = $.slice(arguments,1);
            return str.replace(rformat, function(match, name){
                if (match.charAt(0) == '\\')
                    return match.slice(1);
                var index = Number(name)
                if(index >=0 )
                    return array[index];
                if(object && object[name] !== void 0)
                    return  object[name];
                return  '' ;
            });
        },
        /**
         * ����ƴ�Ӷ���HTMLƬ��,��ȥд<��>�������ǩ֮��
         * @param {String} tag �ɴ����ԵĿ�ʼ��ǩ
         * @param {String} innerHTML ��ѡ
         * @param {Boolean} xml ��ѡ Ĭ��false,ʹ��HTMLģʽ,��Ҫ����ձ�ǩ
         * @example var html = T("P title=aaa",T("span","111111")("strong","22222"))("div",T("div",T("span","����")))("H1",T("span","33333"))('',"���Ǵ��ı�");
         * console.log(html+"");
         * @return {Function}
         */
        tag:function (start, content, xml){
            xml = !!xml
            var chain = function(start, content, xml){
                var html = arguments.callee.html;
                start && html.push("<",start,">");
                content = ''+(content||'');
                content && html.push(content);
                var end = start.split(' ')[0];//ȡ�ý�����ǩ
                if(end && (xml || !rnoclose.test(end))){
                    html.push("</",end,">");
                }
                return chain;
            }
            chain.html = [];
            chain.toString = function(){
                return this.html.join("");
            }
            return chain(start,content,xml);
        },
        // Generate an integer Array containing an arithmetic progression. A port of
        // the native Python `range()` function. See
        // [the Python documentation](http://docs.python.org/library/functions.html#range).
        range : function(start, stop, step) {
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }
            step = arguments[2] || 1;
            var len = Math.max(Math.ceil((stop - start) / step), 0);
            var idx = 0;
            var range = new Array(len);
            while(idx < len) {
                range[idx++] = start;
                start += step;
            }
            return range;
        },
        quote : global.JSON && JSON.stringify || String.quote ||  (function(){
            var meta = {
                '\t':'t',
                '\n':'n',
                '\v':'v',
                'f':'f',
                '\r':'\r',
                '\'':'\'',
                '\"':'\"',
                '\\':'\\'
            },
            reg = /[\x00-\x1F\'\"\\\u007F-\uFFFF]/g,
            regFn = function(c){
                if (c in meta) return '\\' + meta[c];
                var ord = c.charCodeAt(0);
                return ord < 0x20   ? '\\x0' + ord.toString(16)
                :  ord < 0x7F   ? '\\'   + c
                :  ord < 0x100  ? '\\x'  + ord.toString(16)
                :  ord < 0x1000 ? '\\u0' + ord.toString(16)
                : '\\u'  + ord.toString(16)
            };
            return function (str) {
                return    '"' + str.replace(reg, regFn)+ '"';
            }
        })(),
        dump : function(obj, indent) {
            indent = indent || "";
            if (obj === null)
                return indent + "null";
            if (obj === void 0)
                return indent + "undefined";
            if (obj.nodeType === 9)
                return indent + "[object Document]";
            if (obj.nodeType)
                return indent + "[object " + (obj.tagName || "Node") +"]";
            var arr = [],type = $.type(obj),self = arguments.callee,next = indent +  "\t";
            switch (type) {
                case "Boolean":
                case "Number":
                case "NaN":
                case "RegExp":
                    return indent + obj;
                case "String":
                    return indent + $.quote(obj);
                case "Function":
                    return (indent + obj).replace(/\n/g, "\n" + indent);
                case "Date":
                    return indent + '(new Date(' + obj.valueOf() + '))';
                case "Window" :
                    return indent + "[object "+type +"]";
                case "NodeList":
                case "Arguments":
                case "Array":
                    for (var i = 0, n = obj.length; i < n; ++i)
                        arr.push(self(obj[i], next).replace(/^\s* /g, next));
                    return indent + "[\n" + arr.join(",\n") + "\n" + indent + "]";
                default:
                    if($.isPlainObject(obj)){
                        for ( i in obj) {
                            arr.push(next + self(i) + ": " + self(obj[i], next).replace(/^\s+/g, ""));
                        }
                        return indent + "{\n" + arr.join(",\n") + "\n" + indent + "}";
                    }else{
                        return indent + "[object "+type +"]";
                    }
            }
        },
        //http://www.schillmania.com/content/projects/javascript-animation-1/
        //http://www.cnblogs.com/rubylouvre/archive/2010/04/09/1708419.html
        parseJS: function( code ) {
            //IE�У�window.eval()��eval()һ��ֻ�ڵ�ǰ��������Ч��
            //Firefox��Safari��Opera�У�ֱ�ӵ���eval()Ϊ��ǰ������window.eval()����Ϊȫ��������
            if ( code && /\S/.test(code) ) {
                try{
                    global[str_eval](code);
                }catch(e){ }
            }
        },
        parseJSON: function( data ) {
            if ( typeof data !== "string" || !data ) {
                return null;
            }
            data = data.trim();
            if ( global.JSON && global.JSON.parse ) {
                //ʹ��ԭ����JSON.parseת���ַ���Ϊ����
                return global.JSON.parse( data );
            }
            if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                .replace( rvalidtokens, "]" )
                .replace( rvalidbraces, "")) ) {
                //ʹ��new Function����һ��JSON����
                return (new Function( "return " + data ))();
            }
            $.error( "Invalid JSON: " + data );
        },

        // Cross-browser xml parsing
        parseXML: function ( data,xml,tmp ) {
            try {
                if ( global.DOMParser ) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data , "text/xml" );
                } else { // IE
                    xml = new ActiveXObject("Microsoft.XMLDOM" );//"Microsoft.XMLDOM"
                    xml.async = "false";
                    xml.loadXML( data );
                }
            } catch( e ) {
                xml = undefined;
            }
            if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
                $.log( "Invalid XML: " + data );
            }
            return xml;
        }

    }, false);

    "Array,Function".replace($.rword, function(name){
        $["is"+name] = function(obj){
            return obj && ({}).toString.call(obj) === "[object "+name+"]";
        }
    });

    if(Array.isArray){
        $.isArray = Array.isArray;
    }
    var adjustOne = $.oneObject("String,Array,Number,Object"),
    arrayLike = $.oneObject("NodeList,Arguments,Object")
    //����������
    var $$ = $.lang = function(obj){
        var type = $.type(obj), chain = this;
        if(arrayLike[type] &&  isFinite(obj.length)){
            obj = $.slice(obj);
            type = "Array";
        }
        if(adjustOne[type]){
            if(!(chain instanceof $$)){
                chain = new $$;
            }
            chain.target = obj;
            chain.type = type;
            return chain;
        }else{// undefined boolean null
            return obj
        }
    }
    var proto = $$.prototype = {
        constructor:$$,
        valueOf:function(){
            return this.target;
        },
        toString:function(){
            return this.target + "";
        }
    };
    //����������������ĸ���Ҫ����:$.String, $.Array, $.Number, $.Object
    "String,Array,Number,Object".replace($.rword, function(type){
        $[type] = function(ext){
            Object.keys(ext).forEach(function(name){
                $[type][name] = ext[name];
                proto[name] = function(){
                    var obj = this.target;
                    var method = obj[name] || $[type][name];
                    var result = method.apply(obj, arguments);
                    return result;
                }
                proto[name+"X"] = function(){
                    var obj = this.target;
                    var method = obj[name] || $[type][name];
                    var result = method.apply(obj, arguments);
                    return $$.call(this, result) ;
                }
            });
        }
    });
    
    $.String({
        //�ж�һ���ַ����Ƿ������һ���ַ�
        contains: function(string, separator){
            return (separator) ? !!~(separator + this + separator).indexOf(separator + string + separator) : !!~this.indexOf(string);
        },
        //�ж��Ƿ��Ը����ַ�����ͷ
        startsWith: function(string, ignorecase) {
            var start_str = this.substr(0, string.length);
            return ignorecase ? start_str.toLowerCase() === string.toLowerCase() :
            start_str === string;
        },
        //�ж��Ƿ��Ը����ַ�����β
        endsWith: function(string, ignorecase) {
            var end_str = this.substring(this.length - string.length);
            return ignorecase ? end_str.toLowerCase() === string.toLowerCase() :
            end_str === string;
        },
        //�õ��ֽڳ���
        byteLen:function(){
            return this.replace(rascii,"--").length;
        },
        //�Ƿ�Ϊ�հ׽ڵ�
        empty: function () {
            return this.valueOf() === '';
        },
        //�ж��ַ����Ƿ�ֻ�пհ�
        blank: function () {
            return /^\s*$/.test(this);
        },
        //length�����ַ������ȣ�truncation�����ַ����Ľ�β���ֶ�,�������ַ���
        truncate :function(length, truncation) {
            length = length || 30;
            truncation = truncation === void(0) ? '...' : truncation;
            return this.length > length ?
            this.slice(0, length - truncation.length) + truncation :String(this);
        },
        //ת��Ϊ�շ���
        camelize:function(){
            return this.replace(/-([a-z])/g, function($1, $2){
                return $2.toUpperCase();
            });
        },
        //ת��Ϊ���ַ����
        underscored: function() {
            return this.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/\-/g, '_').toLowerCase();
        },
        //����ĸ��д
        capitalize: function(){
            return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
        },
        //ת��Ϊ����
        toInt: function(radix) {
            return parseInt(this, radix || 10);
        },
        //ת��ΪС��
        toFloat: function() {
            return parseFloat(this);
        },
        //ת��Ϊʮ������
        toHex: function() { 
            var txt = '',str = this;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i).toString(16).toUpperCase().length < 2) {
                    txt += '\\x0' + str.charCodeAt(i).toString(16).toUpperCase() ; 
                } else {
                    txt += '\\x' + str.charCodeAt(i).toString(16).toUpperCase() ;
                }
            }
            return txt; 
        },
        //http://stevenlevithan.com/regex/xregexp/
        //���ַ�����ȫ��ʽ��Ϊ������ʽ��Դ��
        escapeRegExp: function(){
            return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
        },
        //http://www.cnblogs.com/rubylouvre/archive/2010/02/09/1666165.html
        //����߲���һЩ�ַ�,Ĭ��Ϊ0
        padLeft: function(digits, filling, radix){
            var num = this.toString(radix || 10);
            filling = filling || "0";
            while(num.length < digits){
                num= filling + num;
            }
            return num;
        },

        //���ұ߲���һЩ�ַ�,Ĭ��Ϊ0
        padRight: function(digits, filling, radix){
            var num = this.toString(radix || 10);
            filling = filling || "0";
            while(num.length < digits){
                num +=  filling;
            }
            return num;
        },
        // http://www.cnblogs.com/rubylouvre/archive/2009/11/08/1598383.html
        times :function(n){
            var str = this,res = "";
            while (n > 0) {
                if (n & 1)
                    res += str;
                str += str;
                n >>= 1;
            }
            return res;
        }
    });
    $.Array({
        //�����ǰ����
        clone: function(){
            var i = this.length, result = [];
            while (i--) result[i] = cloneOf(this[i]);
            return result;
        },
        //ȡ�õ�һ��Ԫ�ػ�������в���
        first: function(fn, scope){
            if($.type(fn,"Function")){
                for(var i=0, n = this.length;i < n;i++){
                    if(fn.call(scope,this[i],i,this)){
                        return this[i];
                    }
                }
                return null;
            }else{
                return this[0];
            }
        },
        //ȡ�����һ��Ԫ�ػ�������в���
        last: function(fn, scope) {
            if($.type(fn,"Function")){
                for (var i=this.length-1; i > -1; i--) {
                    if (fn.call(scope, this[i], i, this)) {
                        return this[i];
                    }
                }
                return null;
            }else{
                return this[this.length-1];
            }
        },
        //�ж������Ƿ������Ԫ��
        contains: function (item) {
            return !!~this.indexOf(item) ;
        },
        //http://msdn.microsoft.com/zh-cn/library/bb383786.aspx
        //�Ƴ� Array ������ĳ��Ԫ�صĵ�һ��ƥ���
        remove: function (item) {
            var index = this.indexOf(item);
            if (~index ) return $.Array.removeAt.call(this, index);
            return null;
        },
        //�Ƴ� Array ������ָ��λ�õ�Ԫ�ء�
        removeAt: function (index) {
            return this.splice(index, 1);
        },
        //���������ϴ��,����Ӱ��ԭ����
        // Jonas Raoni Soares Silva http://jsfromhell.com/array/shuffle [v1.0]
        shuffle: function () {
            var shuff = (this || []).concat(), j, x, i = shuff.length;
            for (; i > 0; j = parseInt(Math.random() * i), x = shuff[--i], shuff[i] = shuff[j], shuff[j] = x) {};
            return shuff;
        },
        //�������������ѡһ��Ԫ�س���
        random: function () {
            return $.Array.shuffle.call(this)[0];
        },
        //ȡ������������ֵ��С��Ԫ��
        min: function() {
            return Math.min.apply(0, this);
        },
        //ȡ������������ֵ����Ԫ��
        max: function() {
            return Math.max.apply(0, this);
        },
        //ֻ��ԭ���鲻���ڲ������
        ensure: function() {
            var args = $.slice(arguments);
            args.forEach(function(el){
                if (!~this.indexOf(el) ) this.push(el);
            },this);
            return this;
        },
        //ȡ�ö��������ÿ��Ԫ�ص��ض�����
        pluck:function(name){
            var result = [], prop;
            this.forEach(function(item){
                prop = item[name];
                if(prop != null)
                    result.push(prop);
            });
            return result;
        },
        //���ݶ����ĳ�����Խ�������
        sortBy: function(fn, scope) {
            var array =  this.map(function(item, index) {
                return {
                    el: item,
                    re: fn.call(scope, item, index)
                };
            }).sort(function(left, right) {
                var a = left.re, b = right.re;
                return a < b ? -1 : a > b ? 1 : 0;
            });
            return $.Array.pluck.call(array,'el');
        },
        // ��������ʽ����ԭ�����в�Ϊnull��undefined��Ԫ��
        compact: function () {
            return this.filter(function (el) {
                return el != null;
            });
        },
        //ȡ�(����)
        diff : function(array) {
            var result = this.slice();
            for ( var i = 0; i < result.length; i++ ) {
                for ( var j = 0; j < array.length; j++ ) {
                    if ( result[i] === array[j] ) {
                        result.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
            return result;
        },
        //ȡ����
        union :function(array){
            var arr = this;
            arr = arr.concat(array);
            return $.Array.unique.call(arr);
        },
        //ȡ����
        intersect:function(array){
            return this.filter(function(n) {
                return ~array.indexOf(n)
            });
        },
        // ����û���ظ�ֵ��������
        unique: function () {
            var ret = [];
                o:for(var i = 0, n = this.length; i < n; i++) {
                    for(var x = i + 1 ; x < n; x++) {
                        if(this[x] === this[i])
                            continue o;
                    }
                    ret.push(this[i]);
                }
            return ret;
        },
        //���������ƽ̹����������һ��һά����
        flatten: function() {
            var result = [],self = $.Array.flatten;
            this.forEach(function(item) {
                if ($.isArray(item)) {
                    result = result.concat(self.call(item));
                } else {
                    result.push(item);
                }
            });
            return result;
        }
    });
    
    var NumberExt = {
        times: function(fn, bind) {
            for (var i=0; i < this; i++)
                fn.call(bind, i);
            return this;
        },
        //ȷ����ֵ��[n1,n2]������֮��,��������޽�,���û�Ϊ������������ֵ����Сֵ
        constrain:function(n1, n2){
            var a = [n1, n2].sort(),num = Number(this);
            if(num < a[0]) num = a[0];
            if(num > a[1]) num = a[1];
            return num;
        },
        //�������ԭ��������Ǹ���
        nearer:function(n1, n2){
            var num = Number(this),
            diff1 = Math.abs(num - n1),
            diff2 = Math.abs(num - n2);
            return diff1 < diff2 ? n1 : n2
        },
        upto: function(number, fn, scope) {
            for (var i=this+0; i <= number; i++)
                fn.call(scope, i);
            return this;
        },
        downto: function(number, fn, scope) {
            for (var i=this+0; i >= number; i--)
                fn.call(scope, i);
            return this;
        },
        round: function(base) {
            if (base) {
                base = Math.pow(10, base);
                return Math.round(this * base) / base;
            } else {
                return Math.round(this);
            }
        }
    }
    "padLeft,padRight".replace($.rword, function(name){
        NumberExt[name] = function(){
            return $.String[name].apply(this,arguments);
        }
    });
    "abs,acos,asin,atan,atan2,ceil,cos,exp,floor,log,pow,sin,sqrt,tan".replace($.rword,function(name){
        NumberExt[name] = function(){
            return Math[name](this);
        }
    });
    $.Number(NumberExt);
    function cloneOf(item){
        var name = $.type(item);
        switch(name){
            case "Array":
            case "Object":
                return $[name].clone.call(item);
            default:
                return item;
        }
    }
    //ʹ�����������������������ϲ���һ��
    function mergeOne(source, key, current){
        if(source[key] && typeof source[key] == "object"){
            $.Object.merge.call(source[key], current);
        }else {
            source[key] = cloneOf(current)
        }
        return source;
    };

    $.Object({
        //���ݴ�������ȡ��ǰ������صļ�ֵ�����һ���¶��󷵻�
        subset: function(keys){
            var results = {};
            for (var i = 0, l = keys.length; i < l; i++){
                var k = keys[i];
                results[k] = this[k];
            }
            return results;
        },
        //��������ļ�ֵ��
        forEach: function(fn, scope){
            Object.keys(this).forEach(function(name){
                fn.call(scope, this[name], name, this);
            }, this);
        },
        map: function(fn, scope){
            return Object.keys(this).map(function(name){
                fn.call(scope, this[name], name, this);
            }, this);
        },
        //�������������һ���¶�������ǿ�����ʹ��$.mix
        clone: function(){
            var clone = {};
            for (var key in this) {
                clone[key] = cloneOf(this[key]);
            }
            return clone;
        },
        merge: function(k, v){
            var target = this, obj, key;
            //ΪĿ��������һ����ֵ��
            if (typeof k === "string")
                return mergeOne(target, k, v);
            //�ϲ��������
            for (var i = 0, n = arguments.length; i < n; i++){
                obj = arguments[i];
                for ( key in obj){
                    if(obj[key] !== void 0)
                        mergeOne(target, key, obj[key]);
                }
            }
            return target;
        },
        //ȥ���봫�������ͬ��Ԫ��
        without: function(arr) {
            var result = {}, key;
            for (key in this) {//�൱�ڹ���һ���¶��󣬰Ѳ�λ�ڴ��������е�Ԫ�ظ�����
                if (!~arr.indexOf(key) ) {
                    result[key] = this[key];
                }
            }
            return result;
        }
    });
    return $$;
});


//2011.7.12 ��toArrayת�Ƶ�langģ����
//2011.7.26 ȥ��toArray����,���globalEval,parseJSON,parseXML����
//2011.8.6  ����tag����
//2011.8.14 �������ص������ռ�,�ع�range����,��nodeģ���parseHTML�����Ƶ��˴������ǿ��
//2011.8.16 $.String2,$.Number2,$.Array2,$.Object2,globalEval ����Ϊ$.String,$.Number,$.Array,$.Object,parseJS
//2011.8.18 $.Object.merge��������undefined��ֵ
//2011.8.28 �ع�Array.unique
//2011.9.11 �ع�$.isArray $.isFunction
//2011.9.16 �޸�$.format BUG
//2011.10.2 �Ż�$.lang
//2011.10.3 ��д$.isPlainObject��jQuery�ı���һ��, �Ż�parseJS��
//2011.10.4 ȥ��array.without��������array.diff��£�������object.widthout�Ĳ���
//2011.10.6 ʹ��λ���������� === -1, ���array.intersect,array.union
//2011.10.16 ��ӷ���ֵ
//2011.10.21 �޸�Object.keys BUG
//2011.10.26 �Ż�quote ;��parseJSON parseXML��$.log��Ϊ$.error; FIX isPlainObject BUG;
//2011.11.6 ��parseXML�е�IE���ֽ���ǿ��
//2011.12.22 ���������ռ�
//2012.1.17 ���dump����
//2012.1.20 �ع�$$.String, $$.Array, $$.Number, $$.Object, ������һ������
//���̿��������ƶ� http://www.wushen.biz/move/

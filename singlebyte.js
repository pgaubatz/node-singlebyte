var extend = require('util-extend');

var singlebyte = function(){
   /* jshint indent: false */
   if(!( this instanceof singlebyte )){
      return new singlebyte();
   }

   this.encodings = [];

   // CP437
   this.learnEncoding('cp437', this.extendASCII([
       0xC7,   0xFC,   0xE9,   0xE2,   0xE4,   0xE0,   0xE5,   0xE7,
       0xEA,   0xEB,   0xE8,   0xEF,   0xEE,   0xEC,   0xC4,   0xC5,
       0xC9,   0xE6,   0xC6,   0xF4,   0xF6,   0xF2,   0xFB,   0xF9,
       0xFF,   0xD6,   0xDC,   0xA2,   0xA3,   0xA5,  0x20A7, 0x192,
       0xE1,   0xED,   0xF3,   0xFA,   0xF1,   0xD1,   0xAA,   0xBA,
       0xBF,  0x2310,  0xAC,   0xBD,   0xBC,   0xA1,   0xAB,   0xBB,
      0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x2561, 0x2562, 0x2556,
      0x2555, 0x2563, 0x2551, 0x2557, 0x255D, 0x255C, 0x255B, 0x2510,
      0x2514, 0x2534, 0x252C, 0x251C, 0x2500, 0x253C, 0x255E, 0x255F,
      0x255A, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256C, 0x2567,
      0x2568, 0x2564, 0x2565, 0x2559, 0x2558, 0x2552, 0x2553, 0x256B,
      0x256A, 0x2518, 0x250C, 0x2588, 0x2584, 0x258C, 0x2590, 0x2580,
      0x3B1,  0x3B2,  0x393,  0x3C0,  0x3A3,  0x3C3,  0x3BC,  0x3C4,
      0x3A6,  0x398,  0x3A9,  0x3B4,  0x221E, 0x3C6,  0x3B5,  0x2229,
      0x2261,  0xB1,  0x2265, 0x2264, 0x2320, 0x2321,  0xF7,  0x2248,
      0xB0,   0x2219, 0xB7,   0x221A, 0x207F,  0xB2,  0x25A0,  0xA0
   ]));

   // CP866
   this.learnEncoding('cp866', this.extendASCII([
      0x410,  0x411,  0x412,  0x413,  0x414,  0x415,  0x416,  0x417,
      0x418,  0x419,  0x41A,  0x41B,  0x41C,  0x41D,  0x41E,  0x41F,
      0x420,  0x421,  0x422,  0x423,  0x424,  0x425,  0x426,  0x427,
      0x428,  0x429,  0x42A,  0x42B,  0x42C,  0x42D,  0x42E,  0x42F,
      0x430,  0x431,  0x432,  0x433,  0x434,  0x435,  0x436,  0x437,
      0x438,  0x439,  0x43A,  0x43B,  0x43C,  0x43D,  0x43E,  0x43F,
      0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x2561, 0x2562, 0x2556,
      0x2555, 0x2563, 0x2551, 0x2557, 0x255D, 0x255C, 0x255B, 0x2510,
      0x2514, 0x2534, 0x252C, 0x251C, 0x2500, 0x253C, 0x255E, 0x255F,
      0x255A, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256C, 0x2567,
      0x2568, 0x2564, 0x2565, 0x2559, 0x2558, 0x2552, 0x2553, 0x256B,
      0x256A, 0x2518, 0x250C, 0x2588, 0x2584, 0x258C, 0x2590, 0x2580,
      0x440,  0x441,  0x442,  0x443,  0x444,  0x445,  0x446,  0x447,
      0x448,  0x449,  0x44A,  0x44B,  0x44C,  0x44D,  0x44E,  0x44F,
      0x401,  0x451,  0x404,  0x454,  0x407,  0x457,  0x40E,  0x45E,
       0xB0,  0x2219, 0xB7,   0x221A, 0x2116,  0xA4,  0x25A0,  0xA0
   ]));
};

singlebyte.prototype.isEncoding = function(encodingName){
   if( Buffer.isEncoding(encodingName) ) return true;
   for( var i = 0; i < this.encodings.length; i++ ){
      if( this.encodings[i].name === encodingName ) return true;
   }
   return false;
};

singlebyte.prototype.learnEncoding = function(encodingName, encodingTable){
   /*jshint bitwise: false */
   if( Buffer.isEncoding(encodingName) ){
      throw new Error(this.errors.BUFFER_ENCODING);
   }

   if( encodingTable.length !== 256 ){
      throw new Error(this.errors.INVALID_TABLE_LENGTH);
   }
   for( var j = 0; j < encodingTable.length; j++ ){
      var nextCode = encodingTable[j] |0;
      if( 0 > nextCode || nextCode > 0x10FFFF ){
         throw new Error(this.errors.OUT_OF_UNICODE);
      }
      encodingTable[j] = nextCode;
   }

   if( this.isEncoding(encodingName) ){
      for( var i = 0; i < this.encodings.length; i++ ){
         if( this.encodings[i].name === encodingName ){
            this.encodings[i].table = encodingTable;
            return;
         }
      }
   } else {
      this.encodings.push({
         name:  encodingName,
         table: encodingTable
      });
   }
};

singlebyte.prototype.getEncodingTable = function(encodingName){
   for( var i = 0; i < this.encodings.length; i++ ){
      if( this.encodings[i].name === encodingName ){
         return this.encodings[i].table;
      }
   }
   return null;
};

singlebyte.prototype.extendASCII = function(extensionTable){
   var i;
   var output = [];
   if( extensionTable.length !== 128 ){
      throw new Error(this.errors.INVALID_EXTENSION);
   }
   for( i = 0; i < 128; i++ ){
      output.push(i);
   }
   for( i = 0; i < extensionTable.length; i++ ){
      output.push( extensionTable[i] );
   }
   return output;
};

singlebyte.prototype.bufToStr = function(buf, encoding, start, end){
   /* jshint bitwise: false */
   if(!( Buffer.isBuffer(buf) )){
      throw new Error(this.errors.NOT_A_BUFFER);
   }
   if( Buffer.isEncoding(encoding) ){
      return buf.toString(encoding, start, end);
   }
   var table = this.getEncodingTable(encoding);
   if( table === null ) throw new Error(this.errors.UNKNOWN_ENCODING);

   if( typeof end   === 'undefined' ) end   = buf.length;
   if( typeof start === 'undefined' ) start = 0;

   var output = '';
   var sourceValue;
   for( var i = start; i < end; i++ ){
      sourceValue = table[ buf[i] ];
      if( sourceValue <= 0xFFFF ){
         output += String.fromCharCode(sourceValue);
      } else if( 0x10000 <= sourceValue && sourceValue <= 0x10FFFF ){
         sourceValue -= 0x10000;
         output += String.fromCharCode( 0xD800 + (sourceValue >> 10) );
         output += String.fromCharCode( 0xDC00 + (sourceValue & 0x3FF) );
      } else throw new Error(this.errors.OUT_OF_UNICODE);
   }
   return output;
};

var strToBufDefaults = {
   defaultCode: 0x3F   // '?'
};

singlebyte.prototype.strToBuf = function(str, encoding, encodingOptions){
   if( Buffer.isEncoding(encoding) ){
      return new Buffer(str, encoding);
   }
   str = '' + str;
   var options = extend(strToBufDefaults, encodingOptions);
   var table = this.getEncodingTable(encoding);
   if( table === null ) throw new Error(this.errors.UNKNOWN_ENCODING);
   var output = [];
   for( var i = 0; i < str.length; i++ ){
      var charUnicode;
      var thisCharCode = str.charCodeAt(i);
      if( 0xD800 <= thisCharCode && thisCharCode <= 0xDBFF &&
         i+1 < str.length
      ){
         var nextCharCode = str.charCodeAt(i+1);
         if( 0xDC00 <= nextCharCode && nextCharCode <= 0xDFFF ){
            charUnicode = 0x10000 + (thisCharCode - 0xD800)*0x400 +
               (nextCharCode - 0xDC00);
            i++;
         } else {
            charUnicode = thisCharCode;
         }
      } else {
         charUnicode = thisCharCode;
      }
      var codeFound = false;
      for( var j = 0; j < table.length; j++ ){
         if( charUnicode === table[j] ){
            codeFound = true;
            output.push(j);
            break;
         }
      }
      if( !codeFound ) output.push(options.defaultCode);
   }
   return new Buffer(output);
};

singlebyte.prototype.errors = {
   NOT_A_BUFFER : 'The given source is not a buffer!',
   UNKNOWN_ENCODING : 'The given encoding is not defined!',
   INVALID_TABLE_LENGTH : 'The encoding table must have 256 elements!',
   INVALID_EXTENSION : 'The ASCII extension table must have 128 elements!',
   BUFFER_ENCODING : "Cannot redefine a Node's encoding!",
   OUT_OF_UNICODE : "An encoding table's element is greater than 0x10FFFF!"
};

module.exports = singlebyte();
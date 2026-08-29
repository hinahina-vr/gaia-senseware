var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err2) => function __init() {
  if (err2) throw err2[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err2 = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/geotiff/dist-module/globals.js
function getFieldTypeSize(fieldType) {
  const size = fieldTypeSizes[fieldType];
  if (size === void 0) {
    throw new RangeError(`Invalid field type: ${fieldType}`);
  }
  return size;
}
function registerTag(tag, name, type, isArray = false, eager = false) {
  tags[name] = tag;
  tagDefinitions[tag] = { tag, name, type: typeof type === "string" ? fieldTypes[type] : type, isArray, eager };
}
function resolveTag(tagIdentifier) {
  if (typeof tagIdentifier === "number") {
    return tagIdentifier;
  }
  return tags[tagIdentifier];
}
var fieldTypes, fieldTypeSizes, tagDictionary, tags, tagDefinitions, photometricInterpretations, ExtraSamplesValues, LercParameters, LercAddCompression, geoKeyNames, geoKeys;
var init_globals = __esm({
  "node_modules/geotiff/dist-module/globals.js"() {
    fieldTypes = {
      BYTE: (
        /** @type {1} */
        1
      ),
      ASCII: (
        /** @type {2} */
        2
      ),
      SHORT: (
        /** @type {3} */
        3
      ),
      LONG: (
        /** @type {4} */
        4
      ),
      RATIONAL: (
        /** @type {5} */
        5
      ),
      SBYTE: (
        /** @type {6} */
        6
      ),
      UNDEFINED: (
        /** @type {7} */
        7
      ),
      SSHORT: (
        /** @type {8} */
        8
      ),
      SLONG: (
        /** @type {9} */
        9
      ),
      SRATIONAL: (
        /** @type {10} */
        10
      ),
      FLOAT: (
        /** @type {11} */
        11
      ),
      DOUBLE: (
        /** @type {12} */
        12
      ),
      // IFD offset, suggested by https://owl.phy.queensu.ca/~phil/exiftool/standards.html
      IFD: (
        /** @type {13} */
        13
      ),
      // introduced by BigTIFF
      LONG8: (
        /** @type {16} */
        16
      ),
      SLONG8: (
        /** @type {17} */
        17
      ),
      IFD8: (
        /** @type {18} */
        18
      )
    };
    fieldTypeSizes = /** @type {const} */
    {
      [fieldTypes.BYTE]: 1,
      [fieldTypes.ASCII]: 1,
      [fieldTypes.SBYTE]: 1,
      [fieldTypes.UNDEFINED]: 1,
      [fieldTypes.SHORT]: 2,
      [fieldTypes.SSHORT]: 2,
      [fieldTypes.LONG]: 4,
      [fieldTypes.SLONG]: 4,
      [fieldTypes.FLOAT]: 4,
      [fieldTypes.IFD]: 4,
      [fieldTypes.RATIONAL]: 8,
      [fieldTypes.SRATIONAL]: 8,
      [fieldTypes.DOUBLE]: 8,
      [fieldTypes.LONG8]: 8,
      [fieldTypes.SLONG8]: 8,
      [fieldTypes.IFD8]: 8
    };
    __name(getFieldTypeSize, "getFieldTypeSize");
    tagDictionary = /** @type {const} */
    {
      NewSubfileType: { tag: 254, type: fieldTypes.LONG, eager: true },
      SubfileType: { tag: 255, type: fieldTypes.SHORT, eager: true },
      ImageWidth: { tag: 256, type: fieldTypes.SHORT, eager: true },
      ImageLength: { tag: 257, type: fieldTypes.SHORT, eager: true },
      BitsPerSample: { tag: 258, type: fieldTypes.SHORT, isArray: true, eager: true },
      Compression: { tag: 259, type: fieldTypes.SHORT, eager: true },
      PhotometricInterpretation: { tag: 262, type: fieldTypes.SHORT, eager: true },
      Threshholding: { tag: 263, type: fieldTypes.SHORT },
      CellWidth: { tag: 264, type: fieldTypes.SHORT },
      CellLength: { tag: 265, type: fieldTypes.SHORT },
      FillOrder: { tag: 266, type: fieldTypes.SHORT },
      DocumentName: { tag: 269, type: fieldTypes.ASCII },
      ImageDescription: { tag: 270, type: fieldTypes.ASCII },
      Make: { tag: 271, type: fieldTypes.ASCII },
      Model: { tag: 272, type: fieldTypes.ASCII },
      StripOffsets: { tag: 273, type: fieldTypes.SHORT, isArray: true },
      Orientation: { tag: 274, type: fieldTypes.SHORT },
      SamplesPerPixel: { tag: 277, type: fieldTypes.SHORT, eager: true },
      RowsPerStrip: { tag: 278, type: fieldTypes.SHORT, eager: true },
      StripByteCounts: { tag: 279, type: fieldTypes.LONG, isArray: true },
      MinSampleValue: { tag: 280, type: fieldTypes.SHORT, isArray: true },
      MaxSampleValue: { tag: 281, type: fieldTypes.SHORT, isArray: true },
      XResolution: { tag: 282, type: fieldTypes.RATIONAL },
      YResolution: { tag: 283, type: fieldTypes.RATIONAL },
      PlanarConfiguration: { tag: 284, type: fieldTypes.SHORT, eager: true },
      PageName: { tag: 285, type: fieldTypes.ASCII },
      XPosition: { tag: 286, type: fieldTypes.RATIONAL },
      YPosition: { tag: 287, type: fieldTypes.RATIONAL },
      FreeOffsets: { tag: 288, type: fieldTypes.LONG },
      FreeByteCounts: { tag: 289, type: fieldTypes.LONG },
      GrayResponseUnit: { tag: 290, type: fieldTypes.SHORT },
      GrayResponseCurve: { tag: 291, type: fieldTypes.SHORT, isArray: true },
      T4Options: { tag: 292, type: fieldTypes.LONG },
      T6Options: { tag: 293, type: fieldTypes.LONG },
      ResolutionUnit: { tag: 296, type: fieldTypes.SHORT },
      PageNumber: { tag: 297, type: fieldTypes.SHORT, isArray: true },
      TransferFunction: { tag: 301, type: fieldTypes.SHORT, isArray: true },
      Software: { tag: 305, type: fieldTypes.ASCII },
      DateTime: { tag: 306, type: fieldTypes.ASCII },
      Artist: { tag: 315, type: fieldTypes.ASCII },
      HostComputer: { tag: 316, type: fieldTypes.ASCII },
      Predictor: { tag: 317, type: fieldTypes.SHORT },
      WhitePoint: { tag: 318, type: fieldTypes.RATIONAL, isArray: true },
      PrimaryChromaticities: { tag: 319, type: fieldTypes.RATIONAL, isArray: true },
      ColorMap: { tag: 320, type: fieldTypes.SHORT, isArray: true },
      HalftoneHints: { tag: 321, type: fieldTypes.SHORT, isArray: true },
      TileWidth: { tag: 322, type: fieldTypes.SHORT, eager: true },
      TileLength: { tag: 323, type: fieldTypes.SHORT, eager: true },
      TileOffsets: { tag: 324, type: fieldTypes.LONG, isArray: true },
      TileByteCounts: { tag: 325, type: fieldTypes.SHORT, isArray: true },
      InkSet: { tag: 332, type: fieldTypes.SHORT },
      InkNames: { tag: 333, type: fieldTypes.ASCII },
      NumberOfInks: { tag: 334, type: fieldTypes.SHORT },
      DotRange: { tag: 336, type: fieldTypes.BYTE, isArray: true },
      TargetPrinter: { tag: 337, type: fieldTypes.ASCII },
      ExtraSamples: { tag: 338, type: fieldTypes.BYTE, isArray: true, eager: true },
      SampleFormat: { tag: 339, type: fieldTypes.SHORT, isArray: true, eager: true },
      SMinSampleValue: { tag: 340, isArray: true },
      SMaxSampleValue: { tag: 341, isArray: true },
      TransferRange: { tag: 342, type: fieldTypes.SHORT, isArray: true },
      JPEGProc: { tag: 512, type: fieldTypes.SHORT },
      JPEGInterchangeFormat: { tag: 513, type: fieldTypes.LONG },
      JPEGInterchangeFormatLngth: { tag: 514, type: fieldTypes.LONG },
      JPEGRestartInterval: { tag: 515, type: fieldTypes.SHORT },
      JPEGLosslessPredictors: { tag: 517, type: fieldTypes.SHORT, isArray: true },
      JPEGPointTransforms: { tag: 518, type: fieldTypes.SHORT, isArray: true },
      JPEGQTables: { tag: 519, type: fieldTypes.LONG, isArray: true },
      JPEGDCTables: { tag: 520, type: fieldTypes.LONG, isArray: true },
      JPEGACTables: { tag: 521, type: fieldTypes.LONG, isArray: true },
      YCbCrCoefficients: { tag: 529, type: fieldTypes.RATIONAL, isArray: true },
      YCbCrSubSampling: { tag: 530, type: fieldTypes.SHORT, isArray: true },
      YCbCrPositioning: { tag: 531, type: fieldTypes.SHORT },
      ReferenceBlackWhite: { tag: 532, type: fieldTypes.LONG, isArray: true },
      Copyright: { tag: 33432, type: fieldTypes.ASCII },
      BadFaxLines: { tag: 326 },
      CleanFaxData: { tag: 327 },
      ClipPath: { tag: 343 },
      ConsecutiveBadFaxLines: { tag: 328 },
      Decode: { tag: 433 },
      DefaultImageColor: { tag: 434 },
      Indexed: { tag: 346 },
      JPEGTables: { tag: 347, isArray: true, eager: true },
      StripRowCounts: { tag: 559, isArray: true },
      SubIFDs: { tag: 330, isArray: true },
      XClipPathUnits: { tag: 344 },
      YClipPathUnits: { tag: 345 },
      ApertureValue: { tag: 37378 },
      ColorSpace: { tag: 40961 },
      DateTimeDigitized: { tag: 36868 },
      DateTimeOriginal: { tag: 36867 },
      ExifIFD: { tag: 34665, name: "Exif IFD", type: fieldTypes.LONG },
      ExifVersion: { tag: 36864 },
      ExposureTime: { tag: 33434 },
      FileSource: { tag: 41728 },
      Flash: { tag: 37385 },
      FlashpixVersion: { tag: 40960 },
      FNumber: { tag: 33437 },
      ImageUniqueID: { tag: 42016 },
      LightSource: { tag: 37384 },
      MakerNote: { tag: 37500 },
      ShutterSpeedValue: { tag: 37377 },
      UserComment: { tag: 37510 },
      IPTC: { tag: 33723 },
      CZ_LSMINFO: { tag: 34412 },
      ICCProfile: { tag: 34675, name: "ICC Profile" },
      XMP: { tag: 700 },
      GDAL_METADATA: { tag: 42112 },
      GDAL_NODATA: { tag: 42113, type: fieldTypes.ASCII, eager: true },
      Photoshop: { tag: 34377 },
      ModelPixelScale: { tag: 33550, type: fieldTypes.DOUBLE, isArray: true, eager: true },
      ModelTiepoint: { tag: 33922, type: fieldTypes.DOUBLE, isArray: true, eager: true },
      ModelTransformation: { tag: 34264, type: fieldTypes.DOUBLE, isArray: true, eager: true },
      GeoKeyDirectory: { tag: 34735, type: fieldTypes.SHORT, isArray: true, eager: true },
      GeoDoubleParams: { tag: 34736, type: fieldTypes.DOUBLE, isArray: true, eager: true },
      GeoAsciiParams: { tag: 34737, type: fieldTypes.ASCII, eager: true },
      LercParameters: { tag: 50674, eager: true }
    };
    tags = {};
    tagDefinitions = {};
    __name(registerTag, "registerTag");
    for (const [key, value] of Object.entries(tagDictionary)) {
      const entry = (
        /** @type {TagDictionaryEntry} */
        value
      );
      registerTag(entry.tag, entry.name || key, entry.type, entry.isArray, entry.eager);
    }
    __name(resolveTag, "resolveTag");
    photometricInterpretations = {
      WhiteIsZero: 0,
      BlackIsZero: 1,
      RGB: 2,
      Palette: 3,
      TransparencyMask: 4,
      CMYK: 5,
      YCbCr: 6,
      CIELab: 8,
      ICCLab: 9
    };
    ExtraSamplesValues = {
      Unspecified: 0,
      Assocalpha: 1,
      Unassalpha: 2
    };
    LercParameters = {
      Version: 0,
      AddCompression: 1
    };
    LercAddCompression = {
      None: 0,
      Deflate: 1,
      Zstandard: 2
    };
    geoKeyNames = /** @type {const} */
    {
      1024: "GTModelTypeGeoKey",
      1025: "GTRasterTypeGeoKey",
      1026: "GTCitationGeoKey",
      2048: "GeographicTypeGeoKey",
      2049: "GeogCitationGeoKey",
      2050: "GeogGeodeticDatumGeoKey",
      2051: "GeogPrimeMeridianGeoKey",
      2052: "GeogLinearUnitsGeoKey",
      2053: "GeogLinearUnitSizeGeoKey",
      2054: "GeogAngularUnitsGeoKey",
      2055: "GeogAngularUnitSizeGeoKey",
      2056: "GeogEllipsoidGeoKey",
      2057: "GeogSemiMajorAxisGeoKey",
      2058: "GeogSemiMinorAxisGeoKey",
      2059: "GeogInvFlatteningGeoKey",
      2060: "GeogAzimuthUnitsGeoKey",
      2061: "GeogPrimeMeridianLongGeoKey",
      2062: "GeogTOWGS84GeoKey",
      3072: "ProjectedCSTypeGeoKey",
      3073: "PCSCitationGeoKey",
      3074: "ProjectionGeoKey",
      3075: "ProjCoordTransGeoKey",
      3076: "ProjLinearUnitsGeoKey",
      3077: "ProjLinearUnitSizeGeoKey",
      3078: "ProjStdParallel1GeoKey",
      3079: "ProjStdParallel2GeoKey",
      3080: "ProjNatOriginLongGeoKey",
      3081: "ProjNatOriginLatGeoKey",
      3082: "ProjFalseEastingGeoKey",
      3083: "ProjFalseNorthingGeoKey",
      3084: "ProjFalseOriginLongGeoKey",
      3085: "ProjFalseOriginLatGeoKey",
      3086: "ProjFalseOriginEastingGeoKey",
      3087: "ProjFalseOriginNorthingGeoKey",
      3088: "ProjCenterLongGeoKey",
      3089: "ProjCenterLatGeoKey",
      3090: "ProjCenterEastingGeoKey",
      3091: "ProjCenterNorthingGeoKey",
      3092: "ProjScaleAtNatOriginGeoKey",
      3093: "ProjScaleAtCenterGeoKey",
      3094: "ProjAzimuthAngleGeoKey",
      3095: "ProjStraightVertPoleLongGeoKey",
      3096: "ProjRectifiedGridAngleGeoKey",
      4096: "VerticalCSTypeGeoKey",
      4097: "VerticalCitationGeoKey",
      4098: "VerticalDatumGeoKey",
      4099: "VerticalUnitsGeoKey"
    };
    geoKeys = /** @type {Record<GeoKeyName, number>} */
    {};
    for (const [key, name] of Object.entries(geoKeyNames)) {
      geoKeys[
        /** @type {GeoKeyName} */
        name
      ] = parseInt(key, 10);
    }
  }
});

// node_modules/geotiff/dist-module/predictor.js
function decodeRowAcc(row, stride) {
  let length = row.length - stride;
  let offset = 0;
  do {
    for (let i = stride; i > 0; i--) {
      row[offset + stride] += row[offset];
      offset++;
    }
    length -= stride;
  } while (length > 0);
}
function decodeRowFloatingPoint(row, stride, bytesPerSample) {
  let index = 0;
  let count = row.length;
  const wc = count / bytesPerSample;
  while (count > stride) {
    for (let i = stride; i > 0; --i) {
      row[index + stride] += row[index];
      ++index;
    }
    count -= stride;
  }
  const copy = row.slice();
  for (let i = 0; i < wc; ++i) {
    for (let b = 0; b < bytesPerSample; ++b) {
      row[bytesPerSample * i + b] = copy[(bytesPerSample - b - 1) * wc + i];
    }
  }
}
function applyPredictor(block, predictor, width, height, bitsPerSample, planarConfiguration) {
  if (!predictor || predictor === 1) {
    return block;
  }
  for (let i = 0; i < bitsPerSample.length; ++i) {
    if (bitsPerSample[i] % 8 !== 0) {
      throw new Error("When decoding with predictor, only multiple of 8 bits are supported.");
    }
    if (bitsPerSample[i] !== bitsPerSample[0]) {
      throw new Error("When decoding with predictor, all samples must have the same size.");
    }
  }
  const bytesPerSample = bitsPerSample[0] / 8;
  const stride = planarConfiguration === 2 ? 1 : bitsPerSample.length;
  for (let i = 0; i < height; ++i) {
    if (i * stride * width * bytesPerSample >= block.byteLength) {
      break;
    }
    let row;
    if (predictor === 2) {
      switch (bitsPerSample[0]) {
        case 8:
          row = new Uint8Array(block, i * stride * width * bytesPerSample, stride * width * bytesPerSample);
          break;
        case 16:
          row = new Uint16Array(block, i * stride * width * bytesPerSample, stride * width * bytesPerSample / 2);
          break;
        case 32:
          row = new Uint32Array(block, i * stride * width * bytesPerSample, stride * width * bytesPerSample / 4);
          break;
        default:
          throw new Error(`Predictor 2 not allowed with ${bitsPerSample[0]} bits per sample.`);
      }
      decodeRowAcc(row, stride);
    } else if (predictor === 3) {
      row = new Uint8Array(block, i * stride * width * bytesPerSample, stride * width * bytesPerSample);
      decodeRowFloatingPoint(row, stride, bytesPerSample);
    }
  }
  return block;
}
var init_predictor = __esm({
  "node_modules/geotiff/dist-module/predictor.js"() {
    __name(decodeRowAcc, "decodeRowAcc");
    __name(decodeRowFloatingPoint, "decodeRowFloatingPoint");
    __name(applyPredictor, "applyPredictor");
  }
});

// node_modules/geotiff/dist-module/compression/basedecoder.js
var BaseDecoder;
var init_basedecoder = __esm({
  "node_modules/geotiff/dist-module/compression/basedecoder.js"() {
    init_predictor();
    BaseDecoder = class {
      static {
        __name(this, "BaseDecoder");
      }
      /**
       * @param {BaseDecoderParameters} parameters
       */
      constructor(parameters) {
        this.parameters = parameters;
      }
      /**
       * @abstract
       * @param {ArrayBufferLike} _buffer
       * @returns {Promise<ArrayBufferLike>|ArrayBufferLike}
       */
      decodeBlock(_buffer) {
        throw new Error("decodeBlock not implemented");
      }
      /**
       * @param {ArrayBufferLike} buffer
       * @returns {Promise<ArrayBufferLike>}
       */
      async decode(buffer2) {
        const decoded = await this.decodeBlock(buffer2);
        const { tileWidth, tileHeight, predictor, bitsPerSample, planarConfiguration } = this.parameters;
        if (predictor !== 1) {
          const isBitsPerSampleArray = Array.isArray(bitsPerSample) || ArrayBuffer.isView(bitsPerSample);
          const adaptedBitsPerSample = isBitsPerSampleArray ? Array.from(bitsPerSample) : [bitsPerSample];
          return applyPredictor(decoded, predictor, tileWidth, tileHeight, adaptedBitsPerSample, planarConfiguration);
        }
        return decoded;
      }
    };
  }
});

// node_modules/geotiff/dist-module/compression/raw.js
var raw_exports = {};
__export(raw_exports, {
  default: () => RawDecoder
});
var RawDecoder;
var init_raw = __esm({
  "node_modules/geotiff/dist-module/compression/raw.js"() {
    init_basedecoder();
    RawDecoder = class extends BaseDecoder {
      static {
        __name(this, "RawDecoder");
      }
      /** @param {ArrayBuffer} buffer */
      decodeBlock(buffer2) {
        return buffer2;
      }
    };
  }
});

// node_modules/geotiff/dist-module/compression/lzw.js
var lzw_exports = {};
__export(lzw_exports, {
  default: () => LZWDecoder
});
function getByte(array, position, length) {
  const d = position % 8;
  const a = Math.floor(position / 8);
  const de = 8 - d;
  const ef = position + length - (a + 1) * 8;
  let fg = 8 * (a + 2) - (position + length);
  const dg = (a + 2) * 8 - position;
  fg = Math.max(0, fg);
  if (a >= array.length) {
    console.warn("ran off the end of the buffer before finding EOI_CODE (end on input code)");
    return EOI_CODE;
  }
  let chunk1 = array[a] & 2 ** (8 - d) - 1;
  chunk1 <<= length - de;
  let chunks = chunk1;
  if (a + 1 < array.length) {
    let chunk2 = array[a + 1] >>> fg;
    chunk2 <<= Math.max(0, length - dg);
    chunks += chunk2;
  }
  if (ef > 8 && a + 2 < array.length) {
    const hi = (a + 3) * 8 - (position + length);
    const chunk3 = array[a + 2] >>> hi;
    chunks += chunk3;
  }
  return chunks;
}
function appendReversed(dest, source) {
  for (let i = source.length - 1; i >= 0; i--) {
    dest.push(source[i]);
  }
  return dest;
}
function decompress(input) {
  const dictionaryIndex = new Uint16Array(4093);
  const dictionaryChar = new Uint8Array(4093);
  for (let i = 0; i <= 257; i++) {
    dictionaryIndex[i] = 4096;
    dictionaryChar[i] = i;
  }
  let dictionaryLength = 258;
  let byteLength = MIN_BITS;
  let position = 0;
  function initDictionary() {
    dictionaryLength = 258;
    byteLength = MIN_BITS;
  }
  __name(initDictionary, "initDictionary");
  function getNext(array2) {
    const byte = getByte(array2, position, byteLength);
    position += byteLength;
    return byte;
  }
  __name(getNext, "getNext");
  function addToDictionary(i, c) {
    dictionaryChar[dictionaryLength] = c;
    dictionaryIndex[dictionaryLength] = i;
    dictionaryLength++;
    return dictionaryLength - 1;
  }
  __name(addToDictionary, "addToDictionary");
  function getDictionaryReversed(n) {
    const rev = [];
    for (let i = n; i !== 4096; i = dictionaryIndex[i]) {
      rev.push(dictionaryChar[i]);
    }
    return rev;
  }
  __name(getDictionaryReversed, "getDictionaryReversed");
  const result = [];
  initDictionary();
  const array = new Uint8Array(input);
  let code = getNext(array);
  let oldCode;
  while (code !== EOI_CODE) {
    if (code === CLEAR_CODE) {
      initDictionary();
      code = getNext(array);
      while (code === CLEAR_CODE) {
        code = getNext(array);
      }
      if (code === EOI_CODE) {
        break;
      } else if (code > CLEAR_CODE) {
        throw new Error(`corrupted code at scanline ${code}`);
      } else {
        const val = getDictionaryReversed(code);
        appendReversed(result, val);
        oldCode = code;
      }
    } else if (code < dictionaryLength) {
      const val = getDictionaryReversed(code);
      appendReversed(result, val);
      if (oldCode !== void 0) {
        addToDictionary(oldCode, val[val.length - 1]);
      }
      oldCode = code;
    } else {
      if (oldCode === void 0) {
        throw new Error(`Invalid LZW code: ${code} with no previous code`);
      }
      const oldVal = getDictionaryReversed(oldCode);
      if (!oldVal) {
        throw new Error(`Bogus entry. Not in dictionary, ${oldCode} / ${dictionaryLength}, position: ${position}`);
      }
      appendReversed(result, oldVal);
      result.push(oldVal[oldVal.length - 1]);
      addToDictionary(oldCode, oldVal[oldVal.length - 1]);
      oldCode = code;
    }
    if (dictionaryLength + 1 >= 2 ** byteLength) {
      if (byteLength === MAX_BYTELENGTH) {
        oldCode = void 0;
      } else {
        byteLength++;
      }
    }
    code = getNext(array);
  }
  return new Uint8Array(result);
}
var MIN_BITS, CLEAR_CODE, EOI_CODE, MAX_BYTELENGTH, LZWDecoder;
var init_lzw = __esm({
  "node_modules/geotiff/dist-module/compression/lzw.js"() {
    init_basedecoder();
    MIN_BITS = 9;
    CLEAR_CODE = 256;
    EOI_CODE = 257;
    MAX_BYTELENGTH = 12;
    __name(getByte, "getByte");
    __name(appendReversed, "appendReversed");
    __name(decompress, "decompress");
    LZWDecoder = class extends BaseDecoder {
      static {
        __name(this, "LZWDecoder");
      }
      /** @param {ArrayBuffer} buffer */
      decodeBlock(buffer2) {
        return decompress(buffer2).buffer;
      }
    };
  }
});

// node_modules/geotiff/dist-module/compression/jpeg.js
var jpeg_exports = {};
__export(jpeg_exports, {
  default: () => JpegDecoder
});
function buildHuffmanTable(codeLengths, values2) {
  let k = 0;
  const code = [];
  let length = 16;
  while (length > 0 && !codeLengths[length - 1]) {
    --length;
  }
  code.push({ children: [], index: 0 });
  let p = code[0];
  let q;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < codeLengths[i]; j++) {
      p = code.pop();
      if (!p) {
        throw new Error("buildHuffmanTable: codeLength mismatch");
      }
      p.children[p.index] = values2[k];
      while (p.index > 0) {
        p = code.pop();
        if (!p) {
          throw new Error("buildHuffmanTable: codeLength mismatch");
        }
      }
      p.index++;
      code.push(p);
      while (code.length <= i) {
        code.push(q = { children: [], index: 0 });
        p.children[p.index] = q.children;
        p = q;
      }
      k++;
    }
    if (i + 1 < length) {
      code.push(q = { children: [], index: 0 });
      p.children[p.index] = q.children;
      p = q;
    }
  }
  return code[0].children;
}
function decodeScan(data, initialOffset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive) {
  const { mcusPerLine, progressive } = frame;
  if (components.length > 1 && (mcusPerLine === void 0 || frame.mcusPerColumn === void 0)) {
    throw new Error("Missing MCU dimensions");
  }
  if (components.length === 1 && (components[0].blocksPerLine === void 0 || components[0].blocksPerColumn === void 0)) {
    throw new Error("Missing block dimensions");
  }
  const startOffset = initialOffset;
  let offset = initialOffset;
  let bitsData = 0;
  let bitsCount = 0;
  function readBit() {
    if (bitsCount > 0) {
      bitsCount--;
      return bitsData >> bitsCount & 1;
    }
    bitsData = data[offset++];
    if (bitsData === 255) {
      const nextByte = data[offset++];
      if (nextByte) {
        throw new Error(`unexpected marker: ${(bitsData << 8 | nextByte).toString(16)}`);
      }
    }
    bitsCount = 7;
    return bitsData >>> 7;
  }
  __name(readBit, "readBit");
  function decodeHuffman(tree) {
    if (!tree) {
      throw new Error("Huffman table not found");
    }
    let node = tree;
    let bit;
    while ((bit = readBit()) !== null) {
      const next3 = node[bit];
      if (typeof next3 === "number") {
        return next3;
      }
      if (typeof next3 !== "object") {
        throw new Error("invalid huffman sequence");
      }
      node = next3;
    }
    return null;
  }
  __name(decodeHuffman, "decodeHuffman");
  function receive(initialLength) {
    let length = initialLength;
    let n2 = 0;
    while (length > 0) {
      const bit = readBit();
      if (bit === null) {
        return void 0;
      }
      n2 = n2 << 1 | bit;
      --length;
    }
    return n2;
  }
  __name(receive, "receive");
  function receiveAndExtend(length) {
    const n2 = receive(length);
    if (n2 === void 0) {
      return void 0;
    }
    if (n2 >= 1 << length - 1) {
      return n2;
    }
    return n2 + (-1 << length) + 1;
  }
  __name(receiveAndExtend, "receiveAndExtend");
  function decodeBaseline(component2, zz) {
    const t = decodeHuffman(component2.huffmanTableDC);
    if (t === null) {
      throw new Error("Huffman error");
    }
    const diff = t === 0 ? 0 : receiveAndExtend(t);
    if (diff === void 0) {
      throw new Error("Unexpected end of stream");
    }
    if (component2.pred === void 0) {
      component2.pred = 0;
    }
    component2.pred += diff;
    zz[0] = component2.pred;
    let k2 = 1;
    while (k2 < 64) {
      const rs = decodeHuffman(component2.huffmanTableAC);
      if (rs === null) {
        throw new Error("Unexpected end of data in AC coefficient decoding");
      }
      const s = rs & 15;
      const r = rs >> 4;
      if (s === 0) {
        if (r < 15) {
          break;
        }
        k2 += 16;
      } else {
        k2 += r;
        const z = dctZigZag[k2];
        const val = receiveAndExtend(s);
        if (val === void 0) {
          throw new Error("Unexpected end of stream");
        }
        zz[z] = val;
        k2++;
      }
    }
  }
  __name(decodeBaseline, "decodeBaseline");
  function decodeDCFirst(component2, zz) {
    const t = decodeHuffman(component2.huffmanTableDC);
    if (t === null) {
      throw new Error("Huffman error");
    }
    const value = receiveAndExtend(t);
    if (value === void 0) {
      throw new Error("Unexpected end of data in DC coefficient decoding");
    }
    const diff = t === 0 ? 0 : value << successive;
    if (component2.pred === void 0) {
      component2.pred = 0;
    }
    component2.pred += diff;
    zz[0] = component2.pred;
  }
  __name(decodeDCFirst, "decodeDCFirst");
  function decodeDCSuccessive(_, zz) {
    const bit = readBit();
    if (bit === null) {
      throw new Error("Unexpected end of data in DC coefficient decoding");
    }
    zz[0] |= bit << successive;
  }
  __name(decodeDCSuccessive, "decodeDCSuccessive");
  let eobrun = 0;
  function decodeACFirst(component2, zz) {
    if (eobrun > 0) {
      eobrun--;
      return;
    }
    let k2 = spectralStart;
    const e = spectralEnd;
    while (k2 <= e) {
      const rs = decodeHuffman(component2.huffmanTableAC);
      if (rs === null) {
        throw new Error("Unexpected end of data in AC coefficient decoding");
      }
      const s = rs & 15;
      const r = rs >> 4;
      if (s === 0) {
        if (r < 15) {
          const value = receive(r);
          if (value === void 0) {
            throw new Error("Unexpected end of data in AC coefficient decoding");
          }
          eobrun = value + (1 << r) - 1;
          break;
        }
        k2 += 16;
      } else {
        k2 += r;
        const z = dctZigZag[k2];
        const value = receiveAndExtend(s);
        if (value === void 0) {
          throw new Error("Unexpected end of data in AC coefficient decoding");
        }
        zz[z] = value * (1 << successive);
        k2++;
      }
    }
  }
  __name(decodeACFirst, "decodeACFirst");
  let successiveACState = 0;
  let successiveACNextValue;
  function decodeACSuccessive(component2, zz) {
    let k2 = spectralStart;
    const e = spectralEnd;
    let r = 0;
    while (k2 <= e) {
      const z = dctZigZag[k2];
      const direction = zz[z] < 0 ? -1 : 1;
      switch (successiveACState) {
        case 0: {
          const rs = decodeHuffman(component2.huffmanTableAC);
          if (rs === null) {
            throw new Error("Unexpected end of data in AC coefficient decoding");
          }
          const s = rs & 15;
          r = rs >> 4;
          if (s === 0) {
            if (r < 15) {
              const value = receive(r);
              if (value === void 0) {
                throw new Error("Unexpected end of data in AC coefficient decoding");
              }
              eobrun = value + (1 << r);
              successiveACState = 4;
            } else {
              r = 16;
              successiveACState = 1;
            }
          } else {
            if (s !== 1) {
              throw new Error("invalid ACn encoding");
            }
            const nextVal = receiveAndExtend(s);
            if (nextVal === void 0) {
              throw new Error("Unexpected end of data in AC coefficient decoding");
            }
            successiveACNextValue = nextVal;
            successiveACState = r ? 2 : 3;
          }
          continue;
        }
        case 1:
        // skipping r zero items
        case 2:
          if (zz[z]) {
            const bit = readBit();
            if (bit === null) {
              throw new Error("Unexpected end of data in AC coefficient decoding");
            }
            zz[z] += (bit << successive) * direction;
          } else {
            r--;
            if (r === 0) {
              successiveACState = successiveACState === 2 ? 3 : 0;
            }
          }
          break;
        case 3:
          if (zz[z]) {
            const bit = readBit();
            if (bit === null) {
              throw new Error("Unexpected end of data in AC coefficient decoding");
            }
            zz[z] += (bit << successive) * direction;
          } else {
            zz[z] = successiveACNextValue << successive;
            successiveACState = 0;
          }
          break;
        case 4:
          if (zz[z]) {
            const bit = readBit();
            if (bit === null) {
              throw new Error("Unexpected end of data in AC coefficient decoding");
            }
            zz[z] += (bit << successive) * direction;
          }
          break;
        default:
          break;
      }
      k2++;
    }
    if (successiveACState === 4) {
      eobrun--;
      if (eobrun === 0) {
        successiveACState = 0;
      }
    }
  }
  __name(decodeACSuccessive, "decodeACSuccessive");
  function decodeMcu(component2, decodeFunction, mcu2, row, col) {
    const mcuRow = mcu2 / mcusPerLine | 0;
    const mcuCol = mcu2 % mcusPerLine;
    const blockRow = mcuRow * component2.v + row;
    const blockCol = mcuCol * component2.h + col;
    if (!component2.blocks) {
      throw new Error("Missing blocks");
    }
    decodeFunction(component2, component2.blocks[blockRow][blockCol]);
  }
  __name(decodeMcu, "decodeMcu");
  function decodeBlock(component2, decodeFunction, mcu2) {
    const blockRow = mcu2 / component2.blocksPerLine | 0;
    const blockCol = mcu2 % component2.blocksPerLine;
    if (!component2.blocks) {
      throw new Error("Missing blocks");
    }
    decodeFunction(component2, component2.blocks[blockRow][blockCol]);
  }
  __name(decodeBlock, "decodeBlock");
  const componentsLength = components.length;
  let component;
  let i;
  let j;
  let k;
  let n;
  let decodeFn;
  if (progressive) {
    if (spectralStart === 0) {
      decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
    } else {
      decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
    }
  } else {
    decodeFn = decodeBaseline;
  }
  let mcu = 0;
  let marker;
  let mcuExpected;
  if (componentsLength === 1) {
    mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
  } else {
    mcuExpected = mcusPerLine * frame.mcusPerColumn;
  }
  const usedResetInterval = resetInterval || mcuExpected;
  while (mcu < mcuExpected) {
    for (i = 0; i < componentsLength; i++) {
      components[i].pred = 0;
    }
    eobrun = 0;
    if (componentsLength === 1) {
      component = components[0];
      for (n = 0; n < usedResetInterval; n++) {
        decodeBlock(component, decodeFn, mcu);
        mcu++;
      }
    } else {
      for (n = 0; n < usedResetInterval; n++) {
        for (i = 0; i < componentsLength; i++) {
          component = components[i];
          const { h, v } = component;
          for (j = 0; j < v; j++) {
            for (k = 0; k < h; k++) {
              decodeMcu(component, decodeFn, mcu, j, k);
            }
          }
        }
        mcu++;
        if (mcu === mcuExpected) {
          break;
        }
      }
    }
    bitsCount = 0;
    marker = data[offset] << 8 | data[offset + 1];
    if (marker < 65280) {
      throw new Error("marker was not found");
    }
    if (marker >= 65488 && marker <= 65495) {
      offset += 2;
    } else {
      break;
    }
  }
  return offset - startOffset;
}
function buildComponentData(component) {
  const lines = [];
  const { blocksPerLine, blocksPerColumn } = component;
  if (!blocksPerLine || !blocksPerColumn || !component.blocks) {
    throw new Error("Missing component data");
  }
  const samplesPerLine = blocksPerLine << 3;
  const R = new Int32Array(64);
  const r = new Uint8Array(64);
  function quantizeAndInverse(zz, dataOut, dataIn) {
    const qt = component.quantizationTable;
    if (!qt) {
      throw new Error("No quantization table found");
    }
    let v0;
    let v1;
    let v2;
    let v3;
    let v4;
    let v5;
    let v6;
    let v7;
    let t;
    const p = dataIn;
    let i;
    for (i = 0; i < 64; i++) {
      p[i] = zz[i] * qt[i];
    }
    for (i = 0; i < 8; ++i) {
      const row = 8 * i;
      if (p[1 + row] === 0 && p[2 + row] === 0 && p[3 + row] === 0 && p[4 + row] === 0 && p[5 + row] === 0 && p[6 + row] === 0 && p[7 + row] === 0) {
        t = dctSqrt2 * p[0 + row] + 512 >> 10;
        p[0 + row] = t;
        p[1 + row] = t;
        p[2 + row] = t;
        p[3 + row] = t;
        p[4 + row] = t;
        p[5 + row] = t;
        p[6 + row] = t;
        p[7 + row] = t;
        continue;
      }
      v0 = dctSqrt2 * p[0 + row] + 128 >> 8;
      v1 = dctSqrt2 * p[4 + row] + 128 >> 8;
      v2 = p[2 + row];
      v3 = p[6 + row];
      v4 = dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128 >> 8;
      v7 = dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128 >> 8;
      v5 = p[3 + row] << 4;
      v6 = p[5 + row] << 4;
      t = v0 - v1 + 1 >> 1;
      v0 = v0 + v1 + 1 >> 1;
      v1 = t;
      t = v2 * dctSin6 + v3 * dctCos6 + 128 >> 8;
      v2 = v2 * dctCos6 - v3 * dctSin6 + 128 >> 8;
      v3 = t;
      t = v4 - v6 + 1 >> 1;
      v4 = v4 + v6 + 1 >> 1;
      v6 = t;
      t = v7 + v5 + 1 >> 1;
      v5 = v7 - v5 + 1 >> 1;
      v7 = t;
      t = v0 - v3 + 1 >> 1;
      v0 = v0 + v3 + 1 >> 1;
      v3 = t;
      t = v1 - v2 + 1 >> 1;
      v1 = v1 + v2 + 1 >> 1;
      v2 = t;
      t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
      v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
      v7 = t;
      t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
      v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
      v6 = t;
      p[0 + row] = v0 + v7;
      p[7 + row] = v0 - v7;
      p[1 + row] = v1 + v6;
      p[6 + row] = v1 - v6;
      p[2 + row] = v2 + v5;
      p[5 + row] = v2 - v5;
      p[3 + row] = v3 + v4;
      p[4 + row] = v3 - v4;
    }
    for (i = 0; i < 8; ++i) {
      const col = i;
      if (p[1 * 8 + col] === 0 && p[2 * 8 + col] === 0 && p[3 * 8 + col] === 0 && p[4 * 8 + col] === 0 && p[5 * 8 + col] === 0 && p[6 * 8 + col] === 0 && p[7 * 8 + col] === 0) {
        t = dctSqrt2 * dataIn[i + 0] + 8192 >> 14;
        p[0 * 8 + col] = t;
        p[1 * 8 + col] = t;
        p[2 * 8 + col] = t;
        p[3 * 8 + col] = t;
        p[4 * 8 + col] = t;
        p[5 * 8 + col] = t;
        p[6 * 8 + col] = t;
        p[7 * 8 + col] = t;
        continue;
      }
      v0 = dctSqrt2 * p[0 * 8 + col] + 2048 >> 12;
      v1 = dctSqrt2 * p[4 * 8 + col] + 2048 >> 12;
      v2 = p[2 * 8 + col];
      v3 = p[6 * 8 + col];
      v4 = dctSqrt1d2 * (p[1 * 8 + col] - p[7 * 8 + col]) + 2048 >> 12;
      v7 = dctSqrt1d2 * (p[1 * 8 + col] + p[7 * 8 + col]) + 2048 >> 12;
      v5 = p[3 * 8 + col];
      v6 = p[5 * 8 + col];
      t = v0 - v1 + 1 >> 1;
      v0 = v0 + v1 + 1 >> 1;
      v1 = t;
      t = v2 * dctSin6 + v3 * dctCos6 + 2048 >> 12;
      v2 = v2 * dctCos6 - v3 * dctSin6 + 2048 >> 12;
      v3 = t;
      t = v4 - v6 + 1 >> 1;
      v4 = v4 + v6 + 1 >> 1;
      v6 = t;
      t = v7 + v5 + 1 >> 1;
      v5 = v7 - v5 + 1 >> 1;
      v7 = t;
      t = v0 - v3 + 1 >> 1;
      v0 = v0 + v3 + 1 >> 1;
      v3 = t;
      t = v1 - v2 + 1 >> 1;
      v1 = v1 + v2 + 1 >> 1;
      v2 = t;
      t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
      v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
      v7 = t;
      t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
      v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
      v6 = t;
      p[0 * 8 + col] = v0 + v7;
      p[7 * 8 + col] = v0 - v7;
      p[1 * 8 + col] = v1 + v6;
      p[6 * 8 + col] = v1 - v6;
      p[2 * 8 + col] = v2 + v5;
      p[5 * 8 + col] = v2 - v5;
      p[3 * 8 + col] = v3 + v4;
      p[4 * 8 + col] = v3 - v4;
    }
    for (i = 0; i < 64; ++i) {
      const sample = 128 + (p[i] + 8 >> 4);
      if (sample < 0) {
        dataOut[i] = 0;
      } else if (sample > 255) {
        dataOut[i] = 255;
      } else {
        dataOut[i] = sample;
      }
    }
  }
  __name(quantizeAndInverse, "quantizeAndInverse");
  for (let blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
    const scanLine = blockRow << 3;
    for (let i = 0; i < 8; i++) {
      lines.push(new Uint8Array(samplesPerLine));
    }
    for (let blockCol = 0; blockCol < blocksPerLine; blockCol++) {
      quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);
      let offset = 0;
      const sample = blockCol << 3;
      for (let j = 0; j < 8; j++) {
        const line = lines[scanLine + j];
        for (let i = 0; i < 8; i++) {
          line[sample + i] = r[offset++];
        }
      }
    }
  }
  return lines;
}
var dctZigZag, dctCos1, dctSin1, dctCos3, dctSin3, dctCos6, dctSin6, dctSqrt2, dctSqrt1d2, JpegStreamReader, JpegDecoder;
var init_jpeg = __esm({
  "node_modules/geotiff/dist-module/compression/jpeg.js"() {
    init_basedecoder();
    dctZigZag = new Int32Array([
      0,
      1,
      8,
      16,
      9,
      2,
      3,
      10,
      17,
      24,
      32,
      25,
      18,
      11,
      4,
      5,
      12,
      19,
      26,
      33,
      40,
      48,
      41,
      34,
      27,
      20,
      13,
      6,
      7,
      14,
      21,
      28,
      35,
      42,
      49,
      56,
      57,
      50,
      43,
      36,
      29,
      22,
      15,
      23,
      30,
      37,
      44,
      51,
      58,
      59,
      52,
      45,
      38,
      31,
      39,
      46,
      53,
      60,
      61,
      54,
      47,
      55,
      62,
      63
    ]);
    dctCos1 = 4017;
    dctSin1 = 799;
    dctCos3 = 3406;
    dctSin3 = 2276;
    dctCos6 = 1567;
    dctSin6 = 3784;
    dctSqrt2 = 5793;
    dctSqrt1d2 = 2896;
    __name(buildHuffmanTable, "buildHuffmanTable");
    __name(decodeScan, "decodeScan");
    __name(buildComponentData, "buildComponentData");
    JpegStreamReader = class {
      static {
        __name(this, "JpegStreamReader");
      }
      constructor() {
        this.jfif = null;
        this.adobe = null;
        this.resetInterval = 0;
        this.quantizationTables = [];
        this.huffmanTablesAC = [];
        this.huffmanTablesDC = [];
        this.frames = [];
      }
      resetFrames() {
        this.frames = [];
      }
      /** @param {Uint8Array} data */
      parse(data) {
        let offset = 0;
        function readUint16() {
          const value = data[offset] << 8 | data[offset + 1];
          offset += 2;
          return value;
        }
        __name(readUint16, "readUint16");
        function readDataBlock() {
          const length = readUint16();
          const array = data.subarray(offset, offset + length - 2);
          offset += array.length;
          return array;
        }
        __name(readDataBlock, "readDataBlock");
        function prepareComponents(frame) {
          let maxH = 0;
          let maxV = 0;
          let component;
          let componentId;
          for (componentId in frame.components) {
            if (frame.components.hasOwnProperty(componentId)) {
              component = frame.components[componentId];
              if (maxH < component.h) {
                maxH = component.h;
              }
              if (maxV < component.v) {
                maxV = component.v;
              }
            }
          }
          const mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
          const mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
          for (componentId in frame.components) {
            if (frame.components.hasOwnProperty(componentId)) {
              component = frame.components[componentId];
              const blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
              const blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / maxV);
              const blocksPerLineForMcu = mcusPerLine * component.h;
              const blocksPerColumnForMcu = mcusPerColumn * component.v;
              const blocks = [];
              for (let i = 0; i < blocksPerColumnForMcu; i++) {
                const row = [];
                for (let j = 0; j < blocksPerLineForMcu; j++) {
                  row.push(new Int32Array(64));
                }
                blocks.push(row);
              }
              component.blocksPerLine = blocksPerLine;
              component.blocksPerColumn = blocksPerColumn;
              component.blocks = blocks;
            }
          }
          frame.maxH = maxH;
          frame.maxV = maxV;
          frame.mcusPerLine = mcusPerLine;
          frame.mcusPerColumn = mcusPerColumn;
        }
        __name(prepareComponents, "prepareComponents");
        let fileMarker = readUint16();
        if (fileMarker !== 65496) {
          throw new Error("SOI not found");
        }
        fileMarker = readUint16();
        while (fileMarker !== 65497) {
          switch (fileMarker) {
            case 65280:
              break;
            case 65504:
            // APP0 (Application Specific)
            case 65505:
            // APP1
            case 65506:
            // APP2
            case 65507:
            // APP3
            case 65508:
            // APP4
            case 65509:
            // APP5
            case 65510:
            // APP6
            case 65511:
            // APP7
            case 65512:
            // APP8
            case 65513:
            // APP9
            case 65514:
            // APP10
            case 65515:
            // APP11
            case 65516:
            // APP12
            case 65517:
            // APP13
            case 65518:
            // APP14
            case 65519:
            // APP15
            case 65534: {
              const appData = readDataBlock();
              if (fileMarker === 65504) {
                if (appData[0] === 74 && appData[1] === 70 && appData[2] === 73 && appData[3] === 70 && appData[4] === 0) {
                  this.jfif = {
                    version: { major: appData[5], minor: appData[6] },
                    densityUnits: appData[7],
                    xDensity: appData[8] << 8 | appData[9],
                    yDensity: appData[10] << 8 | appData[11],
                    thumbWidth: appData[12],
                    thumbHeight: appData[13],
                    thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                  };
                }
              }
              if (fileMarker === 65518) {
                if (appData[0] === 65 && appData[1] === 100 && appData[2] === 111 && appData[3] === 98 && appData[4] === 101 && appData[5] === 0) {
                  this.adobe = {
                    version: appData[6],
                    flags0: appData[7] << 8 | appData[8],
                    flags1: appData[9] << 8 | appData[10],
                    transformCode: appData[11]
                  };
                }
              }
              break;
            }
            case 65499: {
              const quantizationTablesLength = readUint16();
              const quantizationTablesEnd = quantizationTablesLength + offset - 2;
              while (offset < quantizationTablesEnd) {
                const quantizationTableSpec = data[offset++];
                const tableData = new Int32Array(64);
                if (quantizationTableSpec >> 4 === 0) {
                  for (let j = 0; j < 64; j++) {
                    const z = dctZigZag[j];
                    tableData[z] = data[offset++];
                  }
                } else if (quantizationTableSpec >> 4 === 1) {
                  for (let j = 0; j < 64; j++) {
                    const z = dctZigZag[j];
                    tableData[z] = readUint16();
                  }
                } else {
                  throw new Error("DQT: invalid table spec");
                }
                this.quantizationTables[quantizationTableSpec & 15] = tableData;
              }
              break;
            }
            case 65472:
            // SOF0 (Start of Frame, Baseline DCT)
            case 65473:
            // SOF1 (Start of Frame, Extended DCT)
            case 65474: {
              readUint16();
              const frame = {
                extended: fileMarker === 65473,
                progressive: fileMarker === 65474,
                precision: data[offset++],
                scanLines: readUint16(),
                samplesPerLine: readUint16(),
                /** @type {Object.<string, JpegComponent>} */
                components: {},
                /** @type {number[]} */
                componentsOrder: [],
                maxH: 0,
                maxV: 0,
                mcusPerLine: 0,
                mcusPerColumn: 0
              };
              const componentsCount = data[offset++];
              let componentId;
              for (let i = 0; i < componentsCount; i++) {
                componentId = data[offset];
                const h = data[offset + 1] >> 4;
                const v = data[offset + 1] & 15;
                const qId = data[offset + 2];
                frame.componentsOrder.push(componentId);
                frame.components[componentId] = {
                  h,
                  v,
                  quantizationIdx: qId,
                  blocksPerLine: 0,
                  blocksPerColumn: 0,
                  blocks: []
                };
                offset += 3;
              }
              prepareComponents(frame);
              this.frames.push(frame);
              break;
            }
            case 65476: {
              const huffmanLength = readUint16();
              for (let i = 2; i < huffmanLength; ) {
                const huffmanTableSpec = data[offset++];
                const codeLengths = new Uint8Array(16);
                let codeLengthSum = 0;
                for (let j = 0; j < 16; j++, offset++) {
                  codeLengths[j] = data[offset];
                  codeLengthSum += codeLengths[j];
                }
                const huffmanValues = new Uint8Array(codeLengthSum);
                for (let j = 0; j < codeLengthSum; j++, offset++) {
                  huffmanValues[j] = data[offset];
                }
                i += 17 + codeLengthSum;
                if (huffmanTableSpec >> 4 === 0) {
                  this.huffmanTablesDC[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
                } else {
                  this.huffmanTablesAC[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
                }
              }
              break;
            }
            case 65501:
              readUint16();
              this.resetInterval = readUint16();
              break;
            case 65498: {
              readUint16();
              const selectorsCount = data[offset++];
              const components = [];
              const frame = this.frames[0];
              for (let i = 0; i < selectorsCount; i++) {
                const component = frame.components[data[offset++]];
                const tableSpec = data[offset++];
                component.huffmanTableDC = this.huffmanTablesDC[tableSpec >> 4];
                component.huffmanTableAC = this.huffmanTablesAC[tableSpec & 15];
                components.push(component);
              }
              const spectralStart = data[offset++];
              const spectralEnd = data[offset++];
              const successiveApproximation = data[offset++];
              const processed = decodeScan(data, offset, frame, components, this.resetInterval, spectralStart, spectralEnd, successiveApproximation >> 4, successiveApproximation & 15);
              offset += processed;
              break;
            }
            case 65535:
              if (data[offset] !== 255) {
                offset--;
              }
              break;
            default:
              if (data[offset - 3] === 255 && data[offset - 2] >= 192 && data[offset - 2] <= 254) {
                offset -= 3;
                break;
              }
              throw new Error(`unknown JPEG marker ${fileMarker.toString(16)}`);
          }
          fileMarker = readUint16();
        }
      }
      getResult() {
        const { frames } = this;
        if (this.frames.length === 0) {
          throw new Error("no frames were decoded");
        } else if (this.frames.length > 1) {
          console.warn("more than one frame is not supported");
        }
        for (let i = 0; i < this.frames.length; i++) {
          const cp = this.frames[i].components;
          for (const j of Object.keys(cp)) {
            const qIdx = cp[j].quantizationIdx;
            if (typeof qIdx === "number") {
              cp[j].quantizationTable = this.quantizationTables[qIdx];
              delete cp[j].quantizationIdx;
            }
          }
        }
        const frame = frames[0];
        if (!frame.maxH || !frame.maxV) {
          throw new Error("Invalid frame dimensions");
        }
        const { components, componentsOrder } = frame;
        const outComponents = [];
        const width = frame.samplesPerLine;
        const height = frame.scanLines;
        for (let i = 0; i < componentsOrder.length; i++) {
          const component = components[componentsOrder[i]];
          outComponents.push({
            lines: buildComponentData(component),
            scaleX: component.h / frame.maxH,
            scaleY: component.v / frame.maxV
          });
        }
        const out = new Uint8Array(width * height * outComponents.length);
        let oi = 0;
        for (let y = 0; y < height; ++y) {
          for (let x = 0; x < width; ++x) {
            for (let i = 0; i < outComponents.length; ++i) {
              const component = outComponents[i];
              out[oi] = component.lines[0 | y * component.scaleY][0 | x * component.scaleX];
              ++oi;
            }
          }
        }
        return out;
      }
    };
    JpegDecoder = class extends BaseDecoder {
      static {
        __name(this, "JpegDecoder");
      }
      /**
       * @param {import('./basedecoder.js').BaseDecoderParameters & { JPEGTables?: Uint8Array }} parameters
       */
      constructor(parameters) {
        super(parameters);
        this.reader = new JpegStreamReader();
        if (parameters.JPEGTables) {
          this.reader.parse(parameters.JPEGTables);
        }
      }
      /** @param {ArrayBuffer} buffer */
      decodeBlock(buffer2) {
        this.reader.resetFrames();
        this.reader.parse(new Uint8Array(buffer2));
        return this.reader.getResult().buffer;
      }
    };
  }
});

// node_modules/pako/dist/pako.esm.mjs
function zero$1(buf) {
  let len = buf.length;
  while (--len >= 0) {
    buf[len] = 0;
  }
}
function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
  this.static_tree = static_tree;
  this.extra_bits = extra_bits;
  this.extra_base = extra_base;
  this.elems = elems;
  this.max_length = max_length;
  this.has_stree = static_tree && static_tree.length;
}
function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;
  this.max_code = 0;
  this.stat_desc = stat_desc;
}
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}
function DeflateState() {
  this.strm = null;
  this.status = 0;
  this.pending_buf = null;
  this.pending_buf_size = 0;
  this.pending_out = 0;
  this.pending = 0;
  this.wrap = 0;
  this.gzhead = null;
  this.gzindex = 0;
  this.method = Z_DEFLATED$2;
  this.last_flush = -1;
  this.w_size = 0;
  this.w_bits = 0;
  this.w_mask = 0;
  this.window = null;
  this.window_size = 0;
  this.prev = null;
  this.head = null;
  this.ins_h = 0;
  this.legacy_hash = 0;
  this.hash_size = 0;
  this.hash_bits = 0;
  this.hash_mask = 0;
  this.hash_shift = 0;
  this.block_start = 0;
  this.match_length = 0;
  this.prev_match = 0;
  this.match_available = 0;
  this.strstart = 0;
  this.match_start = 0;
  this.lookahead = 0;
  this.prev_length = 0;
  this.max_chain_length = 0;
  this.max_lazy_match = 0;
  this.level = 0;
  this.strategy = 0;
  this.good_match = 0;
  this.nice_match = 0;
  this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
  this.dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);
  this.bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);
  this.l_desc = null;
  this.d_desc = null;
  this.bl_desc = null;
  this.bl_count = new Uint16Array(MAX_BITS + 1);
  this.heap = new Uint16Array(2 * L_CODES + 1);
  zero(this.heap);
  this.heap_len = 0;
  this.heap_max = 0;
  this.depth = new Uint16Array(2 * L_CODES + 1);
  zero(this.depth);
  this.sym_buf = 0;
  this.lit_bufsize = 0;
  this.sym_next = 0;
  this.sym_end = 0;
  this.opt_len = 0;
  this.static_len = 0;
  this.matches = 0;
  this.insert = 0;
  this.bi_buf = 0;
  this.bi_valid = 0;
}
function ZStream() {
  this.input = null;
  this.next_in = 0;
  this.avail_in = 0;
  this.total_in = 0;
  this.output = null;
  this.next_out = 0;
  this.avail_out = 0;
  this.total_out = 0;
  this.msg = "";
  this.state = null;
  this.data_type = 2;
  this.adler = 0;
}
function Deflate$1(options) {
  this.options = common.assign({}, defaultOptions$1, options || {});
  let opt = this.options;
  if (opt.raw && opt.windowBits > 0) {
    opt.windowBits = -opt.windowBits;
  } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
    opt.windowBits += 16;
  }
  this.err = 0;
  this.msg = "";
  this.ended = false;
  this.chunks = [];
  this.strm = new zstream();
  this.strm.avail_out = 0;
  let status = deflate_1$2.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy,
    opt.legacyHash
  );
  if (status !== Z_OK$2) {
    throw new Error(messages[status]);
  }
  if (opt.header) {
    deflate_1$2.deflateSetHeader(this.strm, opt.header);
  }
  if (opt.dictionary) {
    let dict;
    if (typeof opt.dictionary === "string") {
      dict = strings.string2buf(opt.dictionary);
    } else if (toString$1.call(opt.dictionary) === "[object ArrayBuffer]") {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }
    status = deflate_1$2.deflateSetDictionary(this.strm, dict);
    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }
    this._dict_set = true;
  }
}
function deflate$1(input, options) {
  const deflator = new Deflate$1(options);
  deflator.push(input, true);
  if (deflator.err) {
    throw deflator.msg || messages[deflator.err];
  }
  return deflator.result;
}
function deflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return deflate$1(input, options);
}
function gzip$1(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate$1(input, options);
}
function InflateState() {
  this.strm = null;
  this.mode = 0;
  this.last = false;
  this.wrap = 0;
  this.havedict = false;
  this.flags = 0;
  this.dmax = 0;
  this.check = 0;
  this.total = 0;
  this.head = null;
  this.wbits = 0;
  this.wsize = 0;
  this.whave = 0;
  this.wnext = 0;
  this.window = null;
  this.hold = 0;
  this.bits = 0;
  this.length = 0;
  this.offset = 0;
  this.extra = 0;
  this.lencode = null;
  this.distcode = null;
  this.lenbits = 0;
  this.distbits = 0;
  this.ncode = 0;
  this.nlen = 0;
  this.ndist = 0;
  this.have = 0;
  this.next = null;
  this.lens = new Uint16Array(320);
  this.work = new Uint16Array(288);
  this.lendyn = null;
  this.distdyn = null;
  this.sane = 0;
  this.back = 0;
  this.was = 0;
}
function GZheader() {
  this.text = 0;
  this.time = 0;
  this.xflags = 0;
  this.os = 0;
  this.extra = null;
  this.extra_len = 0;
  this.name = "";
  this.comment = "";
  this.hcrc = 0;
  this.done = false;
}
function Inflate$1(options) {
  this.options = common.assign({}, defaultOptions, options || {});
  const opt = this.options;
  if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) {
      opt.windowBits = -15;
    }
  }
  if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
    opt.windowBits += 32;
  }
  if (opt.windowBits > 15 && opt.windowBits < 48) {
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }
  this.err = 0;
  this.msg = "";
  this.ended = false;
  this.chunks = [];
  this.strm = new zstream();
  this.strm.avail_out = 0;
  let status = inflate_1$2.inflateInit2(
    this.strm,
    opt.windowBits
  );
  if (status !== Z_OK) {
    throw new Error(messages[status]);
  }
  this.header = new gzheader();
  inflate_1$2.inflateGetHeader(this.strm, this.header);
  if (opt.dictionary) {
    if (typeof opt.dictionary === "string") {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) {
      status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(messages[status]);
      }
    }
  }
}
function inflate$1(input, options) {
  const inflator = new Inflate$1(options);
  inflator.push(input, true);
  if (inflator.err) throw inflator.msg || messages[inflator.err];
  return inflator.result;
}
function inflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return inflate$1(input, options);
}
var Z_FIXED$1, Z_BINARY, Z_TEXT, Z_UNKNOWN$1, STORED_BLOCK, STATIC_TREES, DYN_TREES, MIN_MATCH$1, MAX_MATCH$1, LENGTH_CODES$1, LITERALS$1, L_CODES$1, D_CODES$1, BL_CODES$1, HEAP_SIZE$1, MAX_BITS$1, Buf_size, MAX_BL_BITS, END_BLOCK, REP_3_6, REPZ_3_10, REPZ_11_138, extra_lbits, extra_dbits, extra_blbits, bl_order, DIST_CODE_LEN, static_ltree, static_dtree, _dist_code, _length_code, base_length, base_dist, static_l_desc, static_d_desc, static_bl_desc, d_code, put_short, send_bits, send_code, bi_reverse, bi_flush, gen_bitlen, gen_codes, tr_static_init, init_block, bi_windup, smaller, pqdownheap, compress_block, build_tree, scan_tree, send_tree, build_bl_tree, send_all_trees, detect_data_type, static_init_done, _tr_init$1, _tr_stored_block$1, _tr_align$1, _tr_flush_block$1, _tr_tally$1, _tr_init_1, _tr_stored_block_1, _tr_flush_block_1, _tr_tally_1, _tr_align_1, trees, adler32, adler32_1, makeTable, crcTable, crc32, crc32_1, messages, constants$2, _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align, Z_NO_FLUSH$2, Z_PARTIAL_FLUSH, Z_FULL_FLUSH$1, Z_FINISH$3, Z_BLOCK$1, Z_OK$3, Z_STREAM_END$3, Z_STREAM_ERROR$2, Z_DATA_ERROR$2, Z_BUF_ERROR$2, Z_DEFAULT_COMPRESSION$1, Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY$1, Z_UNKNOWN, Z_DEFLATED$2, MAX_MEM_LEVEL, MAX_WBITS$1, DEF_MEM_LEVEL, LENGTH_CODES, LITERALS, L_CODES, D_CODES, BL_CODES, HEAP_SIZE, MAX_BITS, MIN_MATCH, MAX_MATCH, MIN_LOOKAHEAD, PRESET_DICT, INIT_STATE, GZIP_STATE, EXTRA_STATE, NAME_STATE, COMMENT_STATE, HCRC_STATE, BUSY_STATE, FINISH_STATE, BS_NEED_MORE, BS_BLOCK_DONE, BS_FINISH_STARTED, BS_FINISH_DONE, OS_CODE, err, rank, zero, slide_hash, HASH, INSERT_STRING, flush_pending, flush_block_only, put_byte, putShortMSB, read_buf, longest_match, fill_window, deflate_stored, deflate_fast, deflate_slow, deflate_rle, deflate_huff, configuration_table, lm_init, deflateStateCheck, deflateResetKeep, deflateReset, deflateSetHeader, deflateInit2, deflateInit, deflate$2, deflateEnd, deflateSetDictionary, deflateInit_1, deflateInit2_1, deflateReset_1, deflateResetKeep_1, deflateSetHeader_1, deflate_2$1, deflateEnd_1, deflateSetDictionary_1, deflateInfo, deflate_1$2, _has, assign, flattenChunks, common, STR_APPLY_UIA_OK, _utf8len, string2buf, buf2binstring, buf2string, utf8border, strings, zstream, toString$1, Z_NO_FLUSH$1, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH$2, Z_OK$2, Z_STREAM_END$2, Z_DEFAULT_COMPRESSION, Z_DEFAULT_STRATEGY, Z_DEFLATED$1, defaultOptions$1, Deflate_1$1, deflate_2, deflateRaw_1$1, gzip_1$1, constants$1, deflate_1$1, BAD$1, TYPE$1, inffast, MAXBITS, ENOUGH_LENS$1, ENOUGH_DISTS$1, CODES$1, LENS$1, DISTS$1, lbase, lext, dbase, dext, inflate_table, inftrees, CODES, LENS, DISTS, Z_FINISH$1, Z_BLOCK, Z_TREES, Z_OK$1, Z_STREAM_END$1, Z_NEED_DICT$1, Z_STREAM_ERROR$1, Z_DATA_ERROR$1, Z_MEM_ERROR$1, Z_BUF_ERROR$1, Z_DEFLATED, HEAD, FLAGS, TIME, OS, EXLEN, EXTRA, NAME, COMMENT, HCRC, DICTID, DICT, TYPE, TYPEDO, STORED, COPY_, COPY, TABLE, LENLENS, CODELENS, LEN_, LEN, LENEXT, DIST, DISTEXT, MATCH, LIT, CHECK, LENGTH, DONE, BAD, MEM, SYNC, ENOUGH_LENS, ENOUGH_DISTS, MAX_WBITS, DEF_WBITS, zswap32, inflateStateCheck, inflateResetKeep, inflateReset, inflateReset2, inflateInit2, inflateInit, virgin, lenfix, distfix, fixedtables, updatewindow, inflate$2, inflateEnd, inflateGetHeader, inflateSetDictionary, inflateReset_1, inflateReset2_1, inflateResetKeep_1, inflateInit_1, inflateInit2_1, inflate_2$1, inflateEnd_1, inflateGetHeader_1, inflateSetDictionary_1, inflateInfo, inflate_1$2, gzheader, toString, Z_NO_FLUSH, Z_FINISH, Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR, Z_BUF_ERROR, defaultOptions, Inflate_1$1, inflate_2, inflateRaw_1$1, ungzip$1, constants, inflate_1$1, Deflate, deflate, deflateRaw, gzip, Inflate, inflate, inflateRaw, ungzip, inflate_1;
var init_pako_esm = __esm({
  "node_modules/pako/dist/pako.esm.mjs"() {
    Z_FIXED$1 = 4;
    Z_BINARY = 0;
    Z_TEXT = 1;
    Z_UNKNOWN$1 = 2;
    __name(zero$1, "zero$1");
    STORED_BLOCK = 0;
    STATIC_TREES = 1;
    DYN_TREES = 2;
    MIN_MATCH$1 = 3;
    MAX_MATCH$1 = 258;
    LENGTH_CODES$1 = 29;
    LITERALS$1 = 256;
    L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
    D_CODES$1 = 30;
    BL_CODES$1 = 19;
    HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
    MAX_BITS$1 = 15;
    Buf_size = 16;
    MAX_BL_BITS = 7;
    END_BLOCK = 256;
    REP_3_6 = 16;
    REPZ_3_10 = 17;
    REPZ_11_138 = 18;
    extra_lbits = /* extra bits for each length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]);
    extra_dbits = /* extra bits for each distance code */
    new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]);
    extra_blbits = /* extra bits for each bit length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]);
    bl_order = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    DIST_CODE_LEN = 512;
    static_ltree = new Array((L_CODES$1 + 2) * 2);
    zero$1(static_ltree);
    static_dtree = new Array(D_CODES$1 * 2);
    zero$1(static_dtree);
    _dist_code = new Array(DIST_CODE_LEN);
    zero$1(_dist_code);
    _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
    zero$1(_length_code);
    base_length = new Array(LENGTH_CODES$1);
    zero$1(base_length);
    base_dist = new Array(D_CODES$1);
    zero$1(base_dist);
    __name(StaticTreeDesc, "StaticTreeDesc");
    __name(TreeDesc, "TreeDesc");
    d_code = /* @__PURE__ */ __name((dist) => {
      return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
    }, "d_code");
    put_short = /* @__PURE__ */ __name((s, w) => {
      s.pending_buf[s.pending++] = w & 255;
      s.pending_buf[s.pending++] = w >>> 8 & 255;
    }, "put_short");
    send_bits = /* @__PURE__ */ __name((s, value, length) => {
      if (s.bi_valid > Buf_size - length) {
        s.bi_buf |= value << s.bi_valid & 65535;
        put_short(s, s.bi_buf);
        s.bi_buf = value >> Buf_size - s.bi_valid;
        s.bi_valid += length - Buf_size;
      } else {
        s.bi_buf |= value << s.bi_valid & 65535;
        s.bi_valid += length;
      }
    }, "send_bits");
    send_code = /* @__PURE__ */ __name((s, c, tree) => {
      send_bits(
        s,
        tree[c * 2],
        tree[c * 2 + 1]
        /*.Len*/
      );
    }, "send_code");
    bi_reverse = /* @__PURE__ */ __name((code, len) => {
      let res = 0;
      do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
      } while (--len > 0);
      return res >>> 1;
    }, "bi_reverse");
    bi_flush = /* @__PURE__ */ __name((s) => {
      if (s.bi_valid === 16) {
        put_short(s, s.bi_buf);
        s.bi_buf = 0;
        s.bi_valid = 0;
      } else if (s.bi_valid >= 8) {
        s.pending_buf[s.pending++] = s.bi_buf & 255;
        s.bi_buf >>= 8;
        s.bi_valid -= 8;
      }
    }, "bi_flush");
    gen_bitlen = /* @__PURE__ */ __name((s, desc) => {
      const tree = desc.dyn_tree;
      const max_code = desc.max_code;
      const stree = desc.stat_desc.static_tree;
      const has_stree = desc.stat_desc.has_stree;
      const extra = desc.stat_desc.extra_bits;
      const base = desc.stat_desc.extra_base;
      const max_length = desc.stat_desc.max_length;
      let h;
      let n, m;
      let bits;
      let xbits;
      let f;
      let overflow = 0;
      for (bits = 0; bits <= MAX_BITS$1; bits++) {
        s.bl_count[bits] = 0;
      }
      tree[s.heap[s.heap_max] * 2 + 1] = 0;
      for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
          bits = max_length;
          overflow++;
        }
        tree[n * 2 + 1] = bits;
        if (n > max_code) {
          continue;
        }
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base) {
          xbits = extra[n - base];
        }
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (has_stree) {
          s.static_len += f * (stree[n * 2 + 1] + xbits);
        }
      }
      if (overflow === 0) {
        return;
      }
      do {
        bits = max_length - 1;
        while (s.bl_count[bits] === 0) {
          bits--;
        }
        s.bl_count[bits]--;
        s.bl_count[bits + 1] += 2;
        s.bl_count[max_length]--;
        overflow -= 2;
      } while (overflow > 0);
      for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits];
        while (n !== 0) {
          m = s.heap[--h];
          if (m > max_code) {
            continue;
          }
          if (tree[m * 2 + 1] !== bits) {
            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
            tree[m * 2 + 1] = bits;
          }
          n--;
        }
      }
    }, "gen_bitlen");
    gen_codes = /* @__PURE__ */ __name((tree, max_code, bl_count) => {
      const next_code = new Array(MAX_BITS$1 + 1);
      let code = 0;
      let bits;
      let n;
      for (bits = 1; bits <= MAX_BITS$1; bits++) {
        code = code + bl_count[bits - 1] << 1;
        next_code[bits] = code;
      }
      for (n = 0; n <= max_code; n++) {
        let len = tree[n * 2 + 1];
        if (len === 0) {
          continue;
        }
        tree[n * 2] = bi_reverse(next_code[len]++, len);
      }
    }, "gen_codes");
    tr_static_init = /* @__PURE__ */ __name(() => {
      let n;
      let bits;
      let length;
      let code;
      let dist;
      const bl_count = new Array(MAX_BITS$1 + 1);
      length = 0;
      for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
        base_length[code] = length;
        for (n = 0; n < 1 << extra_lbits[code]; n++) {
          _length_code[length++] = code;
        }
      }
      _length_code[length - 1] = code;
      dist = 0;
      for (code = 0; code < 16; code++) {
        base_dist[code] = dist;
        for (n = 0; n < 1 << extra_dbits[code]; n++) {
          _dist_code[dist++] = code;
        }
      }
      dist >>= 7;
      for (; code < D_CODES$1; code++) {
        base_dist[code] = dist << 7;
        for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
          _dist_code[256 + dist++] = code;
        }
      }
      for (bits = 0; bits <= MAX_BITS$1; bits++) {
        bl_count[bits] = 0;
      }
      n = 0;
      while (n <= 143) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      while (n <= 255) {
        static_ltree[n * 2 + 1] = 9;
        n++;
        bl_count[9]++;
      }
      while (n <= 279) {
        static_ltree[n * 2 + 1] = 7;
        n++;
        bl_count[7]++;
      }
      while (n <= 287) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      gen_codes(static_ltree, L_CODES$1 + 1, bl_count);
      for (n = 0; n < D_CODES$1; n++) {
        static_dtree[n * 2 + 1] = 5;
        static_dtree[n * 2] = bi_reverse(n, 5);
      }
      static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
      static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
      static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);
    }, "tr_static_init");
    init_block = /* @__PURE__ */ __name((s) => {
      let n;
      for (n = 0; n < L_CODES$1; n++) {
        s.dyn_ltree[n * 2] = 0;
      }
      for (n = 0; n < D_CODES$1; n++) {
        s.dyn_dtree[n * 2] = 0;
      }
      for (n = 0; n < BL_CODES$1; n++) {
        s.bl_tree[n * 2] = 0;
      }
      s.dyn_ltree[END_BLOCK * 2] = 1;
      s.opt_len = s.static_len = 0;
      s.sym_next = s.matches = 0;
    }, "init_block");
    bi_windup = /* @__PURE__ */ __name((s) => {
      if (s.bi_valid > 8) {
        put_short(s, s.bi_buf);
      } else if (s.bi_valid > 0) {
        s.pending_buf[s.pending++] = s.bi_buf;
      }
      s.bi_buf = 0;
      s.bi_valid = 0;
    }, "bi_windup");
    smaller = /* @__PURE__ */ __name((tree, n, m, depth) => {
      const _n2 = n * 2;
      const _m2 = m * 2;
      return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
    }, "smaller");
    pqdownheap = /* @__PURE__ */ __name((s, tree, k) => {
      const v = s.heap[k];
      let j = k << 1;
      while (j <= s.heap_len) {
        if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
          j++;
        }
        if (smaller(tree, v, s.heap[j], s.depth)) {
          break;
        }
        s.heap[k] = s.heap[j];
        k = j;
        j <<= 1;
      }
      s.heap[k] = v;
    }, "pqdownheap");
    compress_block = /* @__PURE__ */ __name((s, ltree, dtree) => {
      let dist;
      let lc;
      let sx = 0;
      let code;
      let extra;
      if (s.sym_next !== 0) {
        do {
          dist = s.pending_buf[s.sym_buf + sx++] & 255;
          dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
          lc = s.pending_buf[s.sym_buf + sx++];
          if (dist === 0) {
            send_code(s, lc, ltree);
          } else {
            code = _length_code[lc];
            send_code(s, code + LITERALS$1 + 1, ltree);
            extra = extra_lbits[code];
            if (extra !== 0) {
              lc -= base_length[code];
              send_bits(s, lc, extra);
            }
            dist--;
            code = d_code(dist);
            send_code(s, code, dtree);
            extra = extra_dbits[code];
            if (extra !== 0) {
              dist -= base_dist[code];
              send_bits(s, dist, extra);
            }
          }
        } while (sx < s.sym_next);
      }
      send_code(s, END_BLOCK, ltree);
    }, "compress_block");
    build_tree = /* @__PURE__ */ __name((s, desc) => {
      const tree = desc.dyn_tree;
      const stree = desc.stat_desc.static_tree;
      const has_stree = desc.stat_desc.has_stree;
      const elems = desc.stat_desc.elems;
      let n, m;
      let max_code = -1;
      let node;
      s.heap_len = 0;
      s.heap_max = HEAP_SIZE$1;
      for (n = 0; n < elems; n++) {
        if (tree[n * 2] !== 0) {
          s.heap[++s.heap_len] = max_code = n;
          s.depth[n] = 0;
        } else {
          tree[n * 2 + 1] = 0;
        }
      }
      while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (has_stree) {
          s.static_len -= stree[node * 2 + 1];
        }
      }
      desc.max_code = max_code;
      for (n = s.heap_len >> 1; n >= 1; n--) {
        pqdownheap(s, tree, n);
      }
      node = elems;
      do {
        n = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[
          1
          /*SMALLEST*/
        ] = s.heap[s.heap_len--];
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
        m = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[--s.heap_max] = n;
        s.heap[--s.heap_max] = m;
        tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        s.heap[
          1
          /*SMALLEST*/
        ] = node++;
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
      } while (s.heap_len >= 2);
      s.heap[--s.heap_max] = s.heap[
        1
        /*SMALLEST*/
      ];
      gen_bitlen(s, desc);
      gen_codes(tree, max_code, s.bl_count);
    }, "build_tree");
    scan_tree = /* @__PURE__ */ __name((s, tree, max_code) => {
      let n;
      let prevlen = -1;
      let curlen;
      let nextlen = tree[0 * 2 + 1];
      let count = 0;
      let max_count = 7;
      let min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      tree[(max_code + 1) * 2 + 1] = 65535;
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          s.bl_tree[curlen * 2] += count;
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            s.bl_tree[curlen * 2]++;
          }
          s.bl_tree[REP_3_6 * 2]++;
        } else if (count <= 10) {
          s.bl_tree[REPZ_3_10 * 2]++;
        } else {
          s.bl_tree[REPZ_11_138 * 2]++;
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }, "scan_tree");
    send_tree = /* @__PURE__ */ __name((s, tree, max_code) => {
      let n;
      let prevlen = -1;
      let curlen;
      let nextlen = tree[0 * 2 + 1];
      let count = 0;
      let max_count = 7;
      let min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          do {
            send_code(s, curlen, s.bl_tree);
          } while (--count !== 0);
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            send_code(s, curlen, s.bl_tree);
            count--;
          }
          send_code(s, REP_3_6, s.bl_tree);
          send_bits(s, count - 3, 2);
        } else if (count <= 10) {
          send_code(s, REPZ_3_10, s.bl_tree);
          send_bits(s, count - 3, 3);
        } else {
          send_code(s, REPZ_11_138, s.bl_tree);
          send_bits(s, count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }, "send_tree");
    build_bl_tree = /* @__PURE__ */ __name((s) => {
      let max_blindex;
      scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
      scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
      build_tree(s, s.bl_desc);
      for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
        if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
          break;
        }
      }
      s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
      return max_blindex;
    }, "build_bl_tree");
    send_all_trees = /* @__PURE__ */ __name((s, lcodes, dcodes, blcodes) => {
      let rank2;
      send_bits(s, lcodes - 257, 5);
      send_bits(s, dcodes - 1, 5);
      send_bits(s, blcodes - 4, 4);
      for (rank2 = 0; rank2 < blcodes; rank2++) {
        send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
      }
      send_tree(s, s.dyn_ltree, lcodes - 1);
      send_tree(s, s.dyn_dtree, dcodes - 1);
    }, "send_all_trees");
    detect_data_type = /* @__PURE__ */ __name((s) => {
      let block_mask = 4093624447;
      let n;
      for (n = 0; n <= 31; n++, block_mask >>>= 1) {
        if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
          return Z_BINARY;
        }
      }
      if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
        return Z_TEXT;
      }
      for (n = 32; n < LITERALS$1; n++) {
        if (s.dyn_ltree[n * 2] !== 0) {
          return Z_TEXT;
        }
      }
      return Z_BINARY;
    }, "detect_data_type");
    static_init_done = false;
    _tr_init$1 = /* @__PURE__ */ __name((s) => {
      if (!static_init_done) {
        tr_static_init();
        static_init_done = true;
      }
      s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
      s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
      s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
      s.bi_buf = 0;
      s.bi_valid = 0;
      init_block(s);
    }, "_tr_init$1");
    _tr_stored_block$1 = /* @__PURE__ */ __name((s, buf, stored_len, last) => {
      send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
      bi_windup(s);
      put_short(s, stored_len);
      put_short(s, ~stored_len);
      if (stored_len) {
        s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
      }
      s.pending += stored_len;
    }, "_tr_stored_block$1");
    _tr_align$1 = /* @__PURE__ */ __name((s) => {
      send_bits(s, STATIC_TREES << 1, 3);
      send_code(s, END_BLOCK, static_ltree);
      bi_flush(s);
    }, "_tr_align$1");
    _tr_flush_block$1 = /* @__PURE__ */ __name((s, buf, stored_len, last) => {
      let opt_lenb, static_lenb;
      let max_blindex = 0;
      if (s.level > 0) {
        if (s.strm.data_type === Z_UNKNOWN$1) {
          s.strm.data_type = detect_data_type(s);
        }
        build_tree(s, s.l_desc);
        build_tree(s, s.d_desc);
        max_blindex = build_bl_tree(s);
        opt_lenb = s.opt_len + 3 + 7 >>> 3;
        static_lenb = s.static_len + 3 + 7 >>> 3;
        if (static_lenb <= opt_lenb) {
          opt_lenb = static_lenb;
        }
      } else {
        opt_lenb = static_lenb = stored_len + 5;
      }
      if (stored_len + 4 <= opt_lenb && buf !== -1) {
        _tr_stored_block$1(s, buf, stored_len, last);
      } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {
        send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
        compress_block(s, static_ltree, static_dtree);
      } else {
        send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
        send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
        compress_block(s, s.dyn_ltree, s.dyn_dtree);
      }
      init_block(s);
      if (last) {
        bi_windup(s);
      }
    }, "_tr_flush_block$1");
    _tr_tally$1 = /* @__PURE__ */ __name((s, dist, lc) => {
      s.pending_buf[s.sym_buf + s.sym_next++] = dist;
      s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
      s.pending_buf[s.sym_buf + s.sym_next++] = lc;
      if (dist === 0) {
        s.dyn_ltree[lc * 2]++;
      } else {
        s.matches++;
        dist--;
        s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]++;
        s.dyn_dtree[d_code(dist) * 2]++;
      }
      return s.sym_next === s.sym_end;
    }, "_tr_tally$1");
    _tr_init_1 = _tr_init$1;
    _tr_stored_block_1 = _tr_stored_block$1;
    _tr_flush_block_1 = _tr_flush_block$1;
    _tr_tally_1 = _tr_tally$1;
    _tr_align_1 = _tr_align$1;
    trees = {
      _tr_init: _tr_init_1,
      _tr_stored_block: _tr_stored_block_1,
      _tr_flush_block: _tr_flush_block_1,
      _tr_tally: _tr_tally_1,
      _tr_align: _tr_align_1
    };
    adler32 = /* @__PURE__ */ __name((adler, buf, len, pos) => {
      let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
      while (len !== 0) {
        n = len > 2e3 ? 2e3 : len;
        len -= n;
        do {
          s1 = s1 + buf[pos++] | 0;
          s2 = s2 + s1 | 0;
        } while (--n);
        s1 %= 65521;
        s2 %= 65521;
      }
      return s1 | s2 << 16 | 0;
    }, "adler32");
    adler32_1 = adler32;
    makeTable = /* @__PURE__ */ __name(() => {
      let c, table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        table[n] = c;
      }
      return table;
    }, "makeTable");
    crcTable = new Uint32Array(makeTable());
    crc32 = /* @__PURE__ */ __name((crc, buf, len, pos) => {
      const t = crcTable;
      const end = pos + len;
      crc ^= -1;
      for (let i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      }
      return crc ^ -1;
    }, "crc32");
    crc32_1 = crc32;
    messages = {
      2: "need dictionary",
      /* Z_NEED_DICT       2  */
      1: "stream end",
      /* Z_STREAM_END      1  */
      0: "",
      /* Z_OK              0  */
      "-1": "file error",
      /* Z_ERRNO         (-1) */
      "-2": "stream error",
      /* Z_STREAM_ERROR  (-2) */
      "-3": "data error",
      /* Z_DATA_ERROR    (-3) */
      "-4": "insufficient memory",
      /* Z_MEM_ERROR     (-4) */
      "-5": "buffer error",
      /* Z_BUF_ERROR     (-5) */
      "-6": "incompatible version"
      /* Z_VERSION_ERROR (-6) */
    };
    constants$2 = {
      /* Allowed flush values; see deflate() and inflate() below for details */
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      /* Return codes for the compression/decompression functions. Negative values
      * are errors, positive values are used for special but normal events.
      */
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      Z_MEM_ERROR: -4,
      Z_BUF_ERROR: -5,
      //Z_VERSION_ERROR: -6,
      /* compression levels */
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      /* Possible values of the data_type field (though see inflate()) */
      Z_BINARY: 0,
      Z_TEXT: 1,
      //Z_ASCII:                1, // = Z_TEXT (deprecated)
      Z_UNKNOWN: 2,
      /* The deflate compression method */
      Z_DEFLATED: 8
      //Z_NULL:                 null // Use -1 or null inline, depending on var type
    };
    ({ _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees);
    ({
      Z_NO_FLUSH: Z_NO_FLUSH$2,
      Z_PARTIAL_FLUSH,
      Z_FULL_FLUSH: Z_FULL_FLUSH$1,
      Z_FINISH: Z_FINISH$3,
      Z_BLOCK: Z_BLOCK$1,
      Z_OK: Z_OK$3,
      Z_STREAM_END: Z_STREAM_END$3,
      Z_STREAM_ERROR: Z_STREAM_ERROR$2,
      Z_DATA_ERROR: Z_DATA_ERROR$2,
      Z_BUF_ERROR: Z_BUF_ERROR$2,
      Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
      Z_FILTERED,
      Z_HUFFMAN_ONLY,
      Z_RLE,
      Z_FIXED,
      Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
      Z_UNKNOWN,
      Z_DEFLATED: Z_DEFLATED$2
    } = constants$2);
    MAX_MEM_LEVEL = 9;
    MAX_WBITS$1 = 15;
    DEF_MEM_LEVEL = 8;
    LENGTH_CODES = 29;
    LITERALS = 256;
    L_CODES = LITERALS + 1 + LENGTH_CODES;
    D_CODES = 30;
    BL_CODES = 19;
    HEAP_SIZE = 2 * L_CODES + 1;
    MAX_BITS = 15;
    MIN_MATCH = 3;
    MAX_MATCH = 258;
    MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
    PRESET_DICT = 32;
    INIT_STATE = 42;
    GZIP_STATE = 57;
    EXTRA_STATE = 69;
    NAME_STATE = 73;
    COMMENT_STATE = 91;
    HCRC_STATE = 103;
    BUSY_STATE = 113;
    FINISH_STATE = 666;
    BS_NEED_MORE = 1;
    BS_BLOCK_DONE = 2;
    BS_FINISH_STARTED = 3;
    BS_FINISH_DONE = 4;
    OS_CODE = 3;
    err = /* @__PURE__ */ __name((strm, errorCode) => {
      strm.msg = messages[errorCode];
      return errorCode;
    }, "err");
    rank = /* @__PURE__ */ __name((f) => {
      return f * 2 - (f > 4 ? 9 : 0);
    }, "rank");
    zero = /* @__PURE__ */ __name((buf) => {
      let len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }, "zero");
    slide_hash = /* @__PURE__ */ __name((s) => {
      let n, m;
      let p;
      let wsize = s.w_size;
      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = m >= wsize ? m - wsize : 0;
      } while (--n);
      n = wsize;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = m >= wsize ? m - wsize : 0;
      } while (--n);
    }, "slide_hash");
    HASH = /* @__PURE__ */ __name((s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask, "HASH");
    INSERT_STRING = /* @__PURE__ */ __name((s, str) => {
      let h;
      if (s.legacy_hash) {
        h = s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
      } else {
        const w = s.window;
        const value = w[str] | w[str + 1] << 8 | w[str + 2] << 16 | w[str + 3] << 24;
        h = s.ins_h = Math.imul(value, 66521) + 66521 >>> 16 & s.hash_mask;
      }
      const hash_head = s.prev[str & s.w_mask] = s.head[h];
      s.head[h] = str;
      return hash_head;
    }, "INSERT_STRING");
    flush_pending = /* @__PURE__ */ __name((strm) => {
      const s = strm.state;
      let len = s.pending;
      if (len > strm.avail_out) {
        len = strm.avail_out;
      }
      if (len === 0) {
        return;
      }
      strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
      strm.next_out += len;
      s.pending_out += len;
      strm.total_out += len;
      strm.avail_out -= len;
      s.pending -= len;
      if (s.pending === 0) {
        s.pending_out = 0;
      }
    }, "flush_pending");
    flush_block_only = /* @__PURE__ */ __name((s, last) => {
      _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
      s.block_start = s.strstart;
      flush_pending(s.strm);
    }, "flush_block_only");
    put_byte = /* @__PURE__ */ __name((s, b) => {
      s.pending_buf[s.pending++] = b;
    }, "put_byte");
    putShortMSB = /* @__PURE__ */ __name((s, b) => {
      s.pending_buf[s.pending++] = b >>> 8 & 255;
      s.pending_buf[s.pending++] = b & 255;
    }, "putShortMSB");
    read_buf = /* @__PURE__ */ __name((strm, buf, start, size) => {
      let len = strm.avail_in;
      if (len > size) {
        len = size;
      }
      if (len === 0) {
        return 0;
      }
      strm.avail_in -= len;
      buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
      if (strm.state.wrap === 1) {
        strm.adler = adler32_1(strm.adler, buf, len, start);
      } else if (strm.state.wrap === 2) {
        strm.adler = crc32_1(strm.adler, buf, len, start);
      }
      strm.next_in += len;
      strm.total_in += len;
      return len;
    }, "read_buf");
    longest_match = /* @__PURE__ */ __name((s, cur_match) => {
      let chain_length = s.max_chain_length;
      let scan = s.strstart;
      let match;
      let len;
      let best_len = s.prev_length;
      let nice_match = s.nice_match;
      const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
      const _win = s.window;
      const wmask = s.w_mask;
      const prev = s.prev;
      const strend = s.strstart + MAX_MATCH;
      let scan_end1 = _win[scan + best_len - 1];
      let scan_end = _win[scan + best_len];
      if (s.prev_length >= s.good_match) {
        chain_length >>= 2;
      }
      if (nice_match > s.lookahead) {
        nice_match = s.lookahead;
      }
      do {
        match = cur_match;
        if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
          continue;
        }
        scan += 2;
        match++;
        do {
        } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
        len = MAX_MATCH - (strend - scan);
        scan = strend - MAX_MATCH;
        if (len > best_len) {
          s.match_start = cur_match;
          best_len = len;
          if (len >= nice_match) {
            break;
          }
          scan_end1 = _win[scan + best_len - 1];
          scan_end = _win[scan + best_len];
        }
      } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
      if (best_len <= s.lookahead) {
        return best_len;
      }
      return s.lookahead;
    }, "longest_match");
    fill_window = /* @__PURE__ */ __name((s) => {
      const _w_size = s.w_size;
      let n, more, str;
      do {
        more = s.window_size - s.lookahead - s.strstart;
        if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
          s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
          s.match_start -= _w_size;
          s.strstart -= _w_size;
          s.block_start -= _w_size;
          if (s.insert > s.strstart) {
            s.insert = s.strstart;
          }
          slide_hash(s);
          more += _w_size;
        }
        if (s.strm.avail_in === 0) {
          break;
        }
        n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
        s.lookahead += n;
        if (!s.legacy_hash) {
          if (s.lookahead + s.insert > MIN_MATCH) {
            str = s.strstart - s.insert;
            while (s.insert) {
              INSERT_STRING(s, str);
              str++;
              s.insert--;
              if (s.lookahead + s.insert <= MIN_MATCH) {
                break;
              }
            }
          }
        } else if (s.lookahead + s.insert >= MIN_MATCH) {
          str = s.strstart - s.insert;
          s.ins_h = s.window[str];
          s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
          while (s.insert) {
            INSERT_STRING(s, str);
            str++;
            s.insert--;
            if (s.lookahead + s.insert < MIN_MATCH) {
              break;
            }
          }
        }
      } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
    }, "fill_window");
    deflate_stored = /* @__PURE__ */ __name((s, flush) => {
      let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
      let len, left, have, last = 0;
      let used = s.strm.avail_in;
      do {
        len = 65535;
        have = s.bi_valid + 42 >> 3;
        if (s.strm.avail_out < have) {
          break;
        }
        have = s.strm.avail_out - have;
        left = s.strstart - s.block_start;
        if (len > left + s.strm.avail_in) {
          len = left + s.strm.avail_in;
        }
        if (len > have) {
          len = have;
        }
        if (len < min_block && (len === 0 && flush !== Z_FINISH$3 || flush === Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) {
          break;
        }
        last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
        _tr_stored_block(s, 0, 0, last);
        s.pending_buf[s.pending - 4] = len;
        s.pending_buf[s.pending - 3] = len >> 8;
        s.pending_buf[s.pending - 2] = ~len;
        s.pending_buf[s.pending - 1] = ~len >> 8;
        flush_pending(s.strm);
        if (left) {
          if (left > len) {
            left = len;
          }
          s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
          s.strm.next_out += left;
          s.strm.avail_out -= left;
          s.strm.total_out += left;
          s.block_start += left;
          len -= left;
        }
        if (len) {
          read_buf(s.strm, s.strm.output, s.strm.next_out, len);
          s.strm.next_out += len;
          s.strm.avail_out -= len;
          s.strm.total_out += len;
        }
      } while (last === 0);
      used -= s.strm.avail_in;
      if (used) {
        if (used >= s.w_size) {
          s.matches = 2;
          s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
          s.strstart = s.w_size;
          s.insert = s.strstart;
        } else {
          if (s.window_size - s.strstart <= used) {
            s.strstart -= s.w_size;
            s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
            if (s.matches < 2) {
              s.matches++;
            }
            if (s.insert > s.strstart) {
              s.insert = s.strstart;
            }
          }
          s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
          s.strstart += used;
          s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
        }
        s.block_start = s.strstart;
      }
      if (s.high_water < s.strstart) {
        s.high_water = s.strstart;
      }
      if (last) {
        return BS_FINISH_DONE;
      }
      if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 && s.strm.avail_in === 0 && s.strstart === s.block_start) {
        return BS_BLOCK_DONE;
      }
      have = s.window_size - s.strstart;
      if (s.strm.avail_in > have && s.block_start >= s.w_size) {
        s.block_start -= s.w_size;
        s.strstart -= s.w_size;
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) {
          s.matches++;
        }
        have += s.w_size;
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
      }
      if (have > s.strm.avail_in) {
        have = s.strm.avail_in;
      }
      if (have) {
        read_buf(s.strm, s.window, s.strstart, have);
        s.strstart += have;
        s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
      }
      if (s.high_water < s.strstart) {
        s.high_water = s.strstart;
      }
      have = s.bi_valid + 42 >> 3;
      have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
      min_block = have > s.w_size ? s.w_size : have;
      left = s.strstart - s.block_start;
      if (left >= min_block || (left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 && s.strm.avail_in === 0 && left <= have) {
        len = left > have ? have : left;
        last = flush === Z_FINISH$3 && s.strm.avail_in === 0 && len === left ? 1 : 0;
        _tr_stored_block(s, s.block_start, len, last);
        s.block_start += len;
        flush_pending(s.strm);
      }
      return last ? BS_FINISH_STARTED : BS_NEED_MORE;
    }, "deflate_stored");
    deflate_fast = /* @__PURE__ */ __name((s, flush) => {
      let hash_head;
      let bflush;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          hash_head = INSERT_STRING(s, s.strstart);
        }
        if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
            s.match_length--;
            do {
              s.strstart++;
              hash_head = INSERT_STRING(s, s.strstart);
            } while (--s.match_length !== 0);
            s.strstart++;
          } else {
            s.strstart += s.match_length;
            s.match_length = 0;
            if (s.legacy_hash) {
              s.ins_h = s.window[s.strstart];
              s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
            }
          }
        } else {
          bflush = _tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH$3) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.sym_next) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }, "deflate_fast");
    deflate_slow = /* @__PURE__ */ __name((s, flush) => {
      let hash_head;
      let bflush;
      let max_insert;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          hash_head = INSERT_STRING(s, s.strstart);
        }
        s.prev_length = s.match_length;
        s.prev_match = s.match_start;
        s.match_length = MIN_MATCH - 1;
        if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
          if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
            s.match_length = MIN_MATCH - 1;
          }
        }
        if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
          max_insert = s.strstart + s.lookahead - MIN_MATCH;
          bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
          s.lookahead -= s.prev_length - 1;
          s.prev_length -= 2;
          do {
            if (++s.strstart <= max_insert) {
              hash_head = INSERT_STRING(s, s.strstart);
            }
          } while (--s.prev_length !== 0);
          s.match_available = 0;
          s.match_length = MIN_MATCH - 1;
          s.strstart++;
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        } else if (s.match_available) {
          bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
          if (bflush) {
            flush_block_only(s, false);
          }
          s.strstart++;
          s.lookahead--;
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        } else {
          s.match_available = 1;
          s.strstart++;
          s.lookahead--;
        }
      }
      if (s.match_available) {
        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
        s.match_available = 0;
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH$3) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.sym_next) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }, "deflate_slow");
    deflate_rle = /* @__PURE__ */ __name((s, flush) => {
      let bflush;
      let prev;
      let scan, strend;
      const _win = s.window;
      for (; ; ) {
        if (s.lookahead <= MAX_MATCH) {
          fill_window(s);
          if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.match_length = 0;
        if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
          scan = s.strstart - 1;
          prev = _win[scan];
          if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
            strend = s.strstart + MAX_MATCH;
            do {
            } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
            s.match_length = MAX_MATCH - (strend - scan);
            if (s.match_length > s.lookahead) {
              s.match_length = s.lookahead;
            }
          }
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          s.strstart += s.match_length;
          s.match_length = 0;
        } else {
          bflush = _tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH$3) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.sym_next) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }, "deflate_rle");
    deflate_huff = /* @__PURE__ */ __name((s, flush) => {
      let bflush;
      for (; ; ) {
        if (s.lookahead === 0) {
          fill_window(s);
          if (s.lookahead === 0) {
            if (flush === Z_NO_FLUSH$2) {
              return BS_NEED_MORE;
            }
            break;
          }
        }
        s.match_length = 0;
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH$3) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.sym_next) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }, "deflate_huff");
    __name(Config, "Config");
    configuration_table = [
      /*      good lazy nice chain */
      new Config(0, 0, 0, 0, deflate_stored),
      /* 0 store only */
      new Config(4, 4, 8, 4, deflate_fast),
      /* 1 max speed, no lazy matches */
      new Config(4, 5, 16, 8, deflate_fast),
      /* 2 */
      new Config(4, 6, 32, 32, deflate_fast),
      /* 3 */
      new Config(4, 4, 16, 16, deflate_slow),
      /* 4 lazy matches */
      new Config(8, 16, 32, 32, deflate_slow),
      /* 5 */
      new Config(8, 16, 128, 128, deflate_slow),
      /* 6 */
      new Config(8, 32, 128, 256, deflate_slow),
      /* 7 */
      new Config(32, 128, 258, 1024, deflate_slow),
      /* 8 */
      new Config(32, 258, 258, 4096, deflate_slow)
      /* 9 max compression */
    ];
    lm_init = /* @__PURE__ */ __name((s) => {
      s.window_size = 2 * s.w_size;
      zero(s.head);
      s.max_lazy_match = configuration_table[s.level].max_lazy;
      s.good_match = configuration_table[s.level].good_length;
      s.nice_match = configuration_table[s.level].nice_length;
      s.max_chain_length = configuration_table[s.level].max_chain;
      s.strstart = 0;
      s.block_start = 0;
      s.lookahead = 0;
      s.insert = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      s.ins_h = 0;
    }, "lm_init");
    __name(DeflateState, "DeflateState");
    deflateStateCheck = /* @__PURE__ */ __name((strm) => {
      if (!strm) {
        return 1;
      }
      const s = strm.state;
      if (!s || s.strm !== strm || s.status !== INIT_STATE && //#ifdef GZIP
      s.status !== GZIP_STATE && //#endif
      s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) {
        return 1;
      }
      return 0;
    }, "deflateStateCheck");
    deflateResetKeep = /* @__PURE__ */ __name((strm) => {
      if (deflateStateCheck(strm)) {
        return err(strm, Z_STREAM_ERROR$2);
      }
      strm.total_in = strm.total_out = 0;
      strm.data_type = Z_UNKNOWN;
      const s = strm.state;
      s.pending = 0;
      s.pending_out = 0;
      if (s.wrap < 0) {
        s.wrap = -s.wrap;
      }
      s.status = //#ifdef GZIP
      s.wrap === 2 ? GZIP_STATE : (
        //#endif
        s.wrap ? INIT_STATE : BUSY_STATE
      );
      strm.adler = s.wrap === 2 ? 0 : 1;
      s.last_flush = -2;
      _tr_init(s);
      return Z_OK$3;
    }, "deflateResetKeep");
    deflateReset = /* @__PURE__ */ __name((strm) => {
      const ret = deflateResetKeep(strm);
      if (ret === Z_OK$3) {
        lm_init(strm.state);
      }
      return ret;
    }, "deflateReset");
    deflateSetHeader = /* @__PURE__ */ __name((strm, head) => {
      if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
        return Z_STREAM_ERROR$2;
      }
      strm.state.gzhead = head;
      return Z_OK$3;
    }, "deflateSetHeader");
    deflateInit2 = /* @__PURE__ */ __name((strm, level, method, windowBits, memLevel, strategy, legacyHash) => {
      if (!strm) {
        return Z_STREAM_ERROR$2;
      }
      let wrap = 1;
      if (level === Z_DEFAULT_COMPRESSION$1) {
        level = 6;
      }
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else if (windowBits > 15) {
        wrap = 2;
        windowBits -= 16;
      }
      if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) {
        return err(strm, Z_STREAM_ERROR$2);
      }
      if (windowBits === 8) {
        windowBits = 9;
      }
      const s = new DeflateState();
      strm.state = s;
      s.strm = strm;
      s.status = INIT_STATE;
      s.wrap = wrap;
      s.gzhead = null;
      s.w_bits = windowBits;
      s.w_size = 1 << s.w_bits;
      s.w_mask = s.w_size - 1;
      s.legacy_hash = legacyHash ? 1 : 0;
      s.hash_bits = memLevel + 7;
      if (!s.legacy_hash && s.hash_bits < 15) {
        s.hash_bits = 15;
      }
      s.hash_size = 1 << s.hash_bits;
      s.hash_mask = s.hash_size - 1;
      s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
      s.window = new Uint8Array(s.w_size * 2);
      s.head = new Uint16Array(s.hash_size);
      s.prev = new Uint16Array(s.w_size);
      s.lit_bufsize = 1 << memLevel + 6;
      s.pending_buf_size = s.lit_bufsize * 4;
      s.pending_buf = new Uint8Array(s.pending_buf_size);
      s.sym_buf = s.lit_bufsize;
      s.sym_end = (s.lit_bufsize - 1) * 3;
      s.level = level;
      s.strategy = strategy;
      s.method = method;
      return deflateReset(strm);
    }, "deflateInit2");
    deflateInit = /* @__PURE__ */ __name((strm, level) => {
      return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
    }, "deflateInit");
    deflate$2 = /* @__PURE__ */ __name((strm, flush) => {
      if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
        return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
      }
      const s = strm.state;
      if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH$3) {
        return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR$2 : Z_STREAM_ERROR$2);
      }
      const old_flush = s.last_flush;
      s.last_flush = flush;
      if (s.pending !== 0) {
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) {
        return err(strm, Z_BUF_ERROR$2);
      }
      if (s.status === FINISH_STATE && strm.avail_in !== 0) {
        return err(strm, Z_BUF_ERROR$2);
      }
      if (s.status === INIT_STATE && s.wrap === 0) {
        s.status = BUSY_STATE;
      }
      if (s.status === INIT_STATE) {
        let header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
        let level_flags = -1;
        if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
          level_flags = 0;
        } else if (s.level < 6) {
          level_flags = 1;
        } else if (s.level === 6) {
          level_flags = 2;
        } else {
          level_flags = 3;
        }
        header |= level_flags << 6;
        if (s.strstart !== 0) {
          header |= PRESET_DICT;
        }
        header += 31 - header % 31;
        putShortMSB(s, header);
        if (s.strstart !== 0) {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 65535);
        }
        strm.adler = 1;
        s.status = BUSY_STATE;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
      if (s.status === GZIP_STATE) {
        strm.adler = 0;
        put_byte(s, 31);
        put_byte(s, 139);
        put_byte(s, 8);
        if (!s.gzhead) {
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
          put_byte(s, OS_CODE);
          s.status = BUSY_STATE;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
        } else {
          put_byte(
            s,
            (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
          );
          put_byte(s, s.gzhead.time & 255);
          put_byte(s, s.gzhead.time >> 8 & 255);
          put_byte(s, s.gzhead.time >> 16 & 255);
          put_byte(s, s.gzhead.time >> 24 & 255);
          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
          put_byte(s, s.gzhead.os & 255);
          if (s.gzhead.extra && s.gzhead.extra.length) {
            put_byte(s, s.gzhead.extra.length & 255);
            put_byte(s, s.gzhead.extra.length >> 8 & 255);
          }
          if (s.gzhead.hcrc) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
          }
          s.gzindex = 0;
          s.status = EXTRA_STATE;
        }
      }
      if (s.status === EXTRA_STATE) {
        if (s.gzhead.extra) {
          let beg = s.pending;
          let left = (s.gzhead.extra.length & 65535) - s.gzindex;
          while (s.pending + left > s.pending_buf_size) {
            let copy = s.pending_buf_size - s.pending;
            s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
            s.pending = s.pending_buf_size;
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            s.gzindex += copy;
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
            left -= copy;
          }
          let gzhead_extra = new Uint8Array(s.gzhead.extra);
          s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
          s.pending += left;
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          s.gzindex = 0;
        }
        s.status = NAME_STATE;
      }
      if (s.status === NAME_STATE) {
        if (s.gzhead.name) {
          let beg = s.pending;
          let val;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              if (s.pending !== 0) {
                s.last_flush = -1;
                return Z_OK$3;
              }
              beg = 0;
            }
            if (s.gzindex < s.gzhead.name.length) {
              val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          s.gzindex = 0;
        }
        s.status = COMMENT_STATE;
      }
      if (s.status === COMMENT_STATE) {
        if (s.gzhead.comment) {
          let beg = s.pending;
          let val;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              if (s.pending !== 0) {
                s.last_flush = -1;
                return Z_OK$3;
              }
              beg = 0;
            }
            if (s.gzindex < s.gzhead.comment.length) {
              val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
        }
        s.status = HCRC_STATE;
      }
      if (s.status === HCRC_STATE) {
        if (s.gzhead.hcrc) {
          if (s.pending + 2 > s.pending_buf_size) {
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
          }
          put_byte(s, strm.adler & 255);
          put_byte(s, strm.adler >> 8 & 255);
          strm.adler = 0;
        }
        s.status = BUSY_STATE;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
      if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE) {
        let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
        if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
          s.status = FINISH_STATE;
        }
        if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
          if (strm.avail_out === 0) {
            s.last_flush = -1;
          }
          return Z_OK$3;
        }
        if (bstate === BS_BLOCK_DONE) {
          if (flush === Z_PARTIAL_FLUSH) {
            _tr_align(s);
          } else if (flush !== Z_BLOCK$1) {
            _tr_stored_block(s, 0, 0, false);
            if (flush === Z_FULL_FLUSH$1) {
              zero(s.head);
              if (s.lookahead === 0) {
                s.strstart = 0;
                s.block_start = 0;
                s.insert = 0;
              }
            }
          }
          flush_pending(strm);
          if (strm.avail_out === 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
        }
      }
      if (flush !== Z_FINISH$3) {
        return Z_OK$3;
      }
      if (s.wrap <= 0) {
        return Z_STREAM_END$3;
      }
      if (s.wrap === 2) {
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        put_byte(s, strm.adler >> 16 & 255);
        put_byte(s, strm.adler >> 24 & 255);
        put_byte(s, strm.total_in & 255);
        put_byte(s, strm.total_in >> 8 & 255);
        put_byte(s, strm.total_in >> 16 & 255);
        put_byte(s, strm.total_in >> 24 & 255);
      } else {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      flush_pending(strm);
      if (s.wrap > 0) {
        s.wrap = -s.wrap;
      }
      return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
    }, "deflate$2");
    deflateEnd = /* @__PURE__ */ __name((strm) => {
      if (deflateStateCheck(strm)) {
        return Z_STREAM_ERROR$2;
      }
      const status = strm.state.status;
      strm.state = null;
      return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
    }, "deflateEnd");
    deflateSetDictionary = /* @__PURE__ */ __name((strm, dictionary) => {
      let dictLength = dictionary.length;
      if (deflateStateCheck(strm)) {
        return Z_STREAM_ERROR$2;
      }
      const s = strm.state;
      const wrap = s.wrap;
      if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
        return Z_STREAM_ERROR$2;
      }
      if (wrap === 1) {
        strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
      }
      s.wrap = 0;
      if (dictLength >= s.w_size) {
        if (wrap === 0) {
          zero(s.head);
          s.strstart = 0;
          s.block_start = 0;
          s.insert = 0;
        }
        let tmpDict = new Uint8Array(s.w_size);
        tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
        dictionary = tmpDict;
        dictLength = s.w_size;
      }
      const avail = strm.avail_in;
      const next3 = strm.next_in;
      const input = strm.input;
      strm.avail_in = dictLength;
      strm.next_in = 0;
      strm.input = dictionary;
      fill_window(s);
      while (s.lookahead >= MIN_MATCH) {
        let str = s.strstart;
        let n = s.lookahead - (MIN_MATCH - 1);
        do {
          INSERT_STRING(s, str);
          str++;
        } while (--n);
        s.strstart = str;
        s.lookahead = MIN_MATCH - 1;
        fill_window(s);
      }
      s.strstart += s.lookahead;
      s.block_start = s.strstart;
      s.insert = s.lookahead;
      s.lookahead = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      strm.next_in = next3;
      strm.input = input;
      strm.avail_in = avail;
      s.wrap = wrap;
      return Z_OK$3;
    }, "deflateSetDictionary");
    deflateInit_1 = deflateInit;
    deflateInit2_1 = deflateInit2;
    deflateReset_1 = deflateReset;
    deflateResetKeep_1 = deflateResetKeep;
    deflateSetHeader_1 = deflateSetHeader;
    deflate_2$1 = deflate$2;
    deflateEnd_1 = deflateEnd;
    deflateSetDictionary_1 = deflateSetDictionary;
    deflateInfo = "pako deflate (from Nodeca project)";
    deflate_1$2 = {
      deflateInit: deflateInit_1,
      deflateInit2: deflateInit2_1,
      deflateReset: deflateReset_1,
      deflateResetKeep: deflateResetKeep_1,
      deflateSetHeader: deflateSetHeader_1,
      deflate: deflate_2$1,
      deflateEnd: deflateEnd_1,
      deflateSetDictionary: deflateSetDictionary_1,
      deflateInfo
    };
    _has = /* @__PURE__ */ __name((obj, key) => {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }, "_has");
    assign = /* @__PURE__ */ __name(function(obj) {
      const sources = Array.prototype.slice.call(arguments, 1);
      while (sources.length) {
        const source = sources.shift();
        if (!source) {
          continue;
        }
        if (typeof source !== "object") {
          throw new TypeError(source + "must be non-object");
        }
        for (const p in source) {
          if (_has(source, p)) {
            obj[p] = source[p];
          }
        }
      }
      return obj;
    }, "assign");
    flattenChunks = /* @__PURE__ */ __name((chunks) => {
      let len = 0;
      for (let i = 0, l = chunks.length; i < l; i++) {
        len += chunks[i].length;
      }
      const result = new Uint8Array(len);
      for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
        let chunk = chunks[i];
        result.set(chunk, pos);
        pos += chunk.length;
      }
      return result;
    }, "flattenChunks");
    common = {
      assign,
      flattenChunks
    };
    STR_APPLY_UIA_OK = true;
    try {
      String.fromCharCode.apply(null, new Uint8Array(1));
    } catch (__) {
      STR_APPLY_UIA_OK = false;
    }
    _utf8len = new Uint8Array(256);
    for (let q = 0; q < 256; q++) {
      _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
    }
    _utf8len[254] = _utf8len[255] = 1;
    string2buf = /* @__PURE__ */ __name((str) => {
      if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
        return new TextEncoder().encode(str);
      }
      let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      }
      buf = new Uint8Array(buf_len);
      for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        if (c < 128) {
          buf[i++] = c;
        } else if (c < 2048) {
          buf[i++] = 192 | c >>> 6;
          buf[i++] = 128 | c & 63;
        } else if (c < 65536) {
          buf[i++] = 224 | c >>> 12;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        } else {
          buf[i++] = 240 | c >>> 18;
          buf[i++] = 128 | c >>> 12 & 63;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        }
      }
      return buf;
    }, "string2buf");
    buf2binstring = /* @__PURE__ */ __name((buf, len) => {
      if (len < 65534) {
        if (buf.subarray && STR_APPLY_UIA_OK) {
          return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
        }
      }
      let result = "";
      for (let i = 0; i < len; i++) {
        result += String.fromCharCode(buf[i]);
      }
      return result;
    }, "buf2binstring");
    buf2string = /* @__PURE__ */ __name((buf, max) => {
      const len = max || buf.length;
      if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
        return new TextDecoder().decode(buf.subarray(0, max));
      }
      let i, out;
      const utf16buf = new Array(len * 2);
      for (out = 0, i = 0; i < len; ) {
        let c = buf[i++];
        if (c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        let c_len = _utf8len[c];
        if (c_len > 4) {
          utf16buf[out++] = 65533;
          i += c_len - 1;
          continue;
        }
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        while (c_len > 1 && i < len) {
          c = c << 6 | buf[i++] & 63;
          c_len--;
        }
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        if (c < 65536) {
          utf16buf[out++] = c;
        } else {
          c -= 65536;
          utf16buf[out++] = 55296 | c >> 10 & 1023;
          utf16buf[out++] = 56320 | c & 1023;
        }
      }
      return buf2binstring(utf16buf, out);
    }, "buf2string");
    utf8border = /* @__PURE__ */ __name((buf, max) => {
      max = max || buf.length;
      if (max > buf.length) {
        max = buf.length;
      }
      let pos = max - 1;
      while (pos >= 0 && (buf[pos] & 192) === 128) {
        pos--;
      }
      if (pos < 0) {
        return max;
      }
      if (pos === 0) {
        return max;
      }
      return pos + _utf8len[buf[pos]] > max ? pos : max;
    }, "utf8border");
    strings = {
      string2buf,
      buf2string,
      utf8border
    };
    __name(ZStream, "ZStream");
    zstream = ZStream;
    toString$1 = Object.prototype.toString;
    ({
      Z_NO_FLUSH: Z_NO_FLUSH$1,
      Z_SYNC_FLUSH,
      Z_FULL_FLUSH,
      Z_FINISH: Z_FINISH$2,
      Z_OK: Z_OK$2,
      Z_STREAM_END: Z_STREAM_END$2,
      Z_DEFAULT_COMPRESSION,
      Z_DEFAULT_STRATEGY,
      Z_DEFLATED: Z_DEFLATED$1
    } = constants$2);
    defaultOptions$1 = {
      level: Z_DEFAULT_COMPRESSION,
      method: Z_DEFLATED$1,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY,
      legacyHash: true
    };
    __name(Deflate$1, "Deflate$1");
    Deflate$1.prototype.push = function(data, flush_mode) {
      const strm = this.strm;
      const chunkSize = this.options.chunkSize;
      let status, _flush_mode;
      if (this.ended) {
        return false;
      }
      if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
      else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;
      if (typeof data === "string") {
        strm.input = strings.string2buf(data);
      } else if (toString$1.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      for (; ; ) {
        if (strm.avail_out === 0) {
          strm.output = new Uint8Array(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
          this.onData(strm.output.subarray(0, strm.next_out));
          strm.avail_out = 0;
          continue;
        }
        status = deflate_1$2.deflate(strm, _flush_mode);
        if (status === Z_STREAM_END$2) {
          if (strm.next_out > 0) {
            this.onData(strm.output.subarray(0, strm.next_out));
          }
          status = deflate_1$2.deflateEnd(this.strm);
          this.onEnd(status);
          this.ended = true;
          return status === Z_OK$2;
        }
        if (strm.avail_out === 0) {
          this.onData(strm.output);
          continue;
        }
        if (_flush_mode > 0 && strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
          strm.avail_out = 0;
          continue;
        }
        if (strm.avail_in === 0) break;
      }
      return true;
    };
    Deflate$1.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Deflate$1.prototype.onEnd = function(status) {
      if (status === Z_OK$2) {
        this.result = common.flattenChunks(this.chunks);
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    __name(deflate$1, "deflate$1");
    __name(deflateRaw$1, "deflateRaw$1");
    __name(gzip$1, "gzip$1");
    Deflate_1$1 = Deflate$1;
    deflate_2 = deflate$1;
    deflateRaw_1$1 = deflateRaw$1;
    gzip_1$1 = gzip$1;
    constants$1 = constants$2;
    deflate_1$1 = {
      Deflate: Deflate_1$1,
      deflate: deflate_2,
      deflateRaw: deflateRaw_1$1,
      gzip: gzip_1$1,
      constants: constants$1
    };
    BAD$1 = 16209;
    TYPE$1 = 16191;
    inffast = /* @__PURE__ */ __name(function inflate_fast(strm, start) {
      let _in;
      let last;
      let _out;
      let beg;
      let end;
      let dmax;
      let wsize;
      let whave;
      let wnext;
      let s_window;
      let hold;
      let bits;
      let lcode;
      let dcode;
      let lmask;
      let dmask;
      let here;
      let op;
      let len;
      let dist;
      let from;
      let from_source;
      let input, output;
      const state = strm.state;
      _in = strm.next_in;
      input = strm.input;
      last = _in + (strm.avail_in - 5);
      _out = strm.next_out;
      output = strm.output;
      beg = _out - (start - strm.avail_out);
      end = _out + (strm.avail_out - 257);
      dmax = state.dmax;
      wsize = state.wsize;
      whave = state.whave;
      wnext = state.wnext;
      s_window = state.window;
      hold = state.hold;
      bits = state.bits;
      lcode = state.lencode;
      dcode = state.distcode;
      lmask = (1 << state.lenbits) - 1;
      dmask = (1 << state.distbits) - 1;
      top:
        do {
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = lcode[hold & lmask];
          dolen:
            for (; ; ) {
              op = here >>> 24;
              hold >>>= op;
              bits -= op;
              op = here >>> 16 & 255;
              if (op === 0) {
                output[_out++] = here & 65535;
              } else if (op & 16) {
                len = here & 65535;
                op &= 15;
                if (op) {
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                  }
                  len += hold & (1 << op) - 1;
                  hold >>>= op;
                  bits -= op;
                }
                if (bits < 15) {
                  hold += input[_in++] << bits;
                  bits += 8;
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                here = dcode[hold & dmask];
                dodist:
                  for (; ; ) {
                    op = here >>> 24;
                    hold >>>= op;
                    bits -= op;
                    op = here >>> 16 & 255;
                    if (op & 16) {
                      dist = here & 65535;
                      op &= 15;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        if (bits < op) {
                          hold += input[_in++] << bits;
                          bits += 8;
                        }
                      }
                      dist += hold & (1 << op) - 1;
                      if (dist > dmax) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD$1;
                        break top;
                      }
                      hold >>>= op;
                      bits -= op;
                      op = _out - beg;
                      if (dist > op) {
                        op = dist - op;
                        if (op > whave) {
                          if (state.sane) {
                            strm.msg = "invalid distance too far back";
                            state.mode = BAD$1;
                            break top;
                          }
                        }
                        from = 0;
                        from_source = s_window;
                        if (wnext === 0) {
                          from += wsize - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        } else if (wnext < op) {
                          from += wsize + wnext - op;
                          op -= wnext;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = 0;
                            if (wnext < len) {
                              op = wnext;
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist;
                              from_source = output;
                            }
                          }
                        } else {
                          from += wnext - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                        while (len > 2) {
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          len -= 3;
                        }
                        if (len) {
                          output[_out++] = from_source[from++];
                          if (len > 1) {
                            output[_out++] = from_source[from++];
                          }
                        }
                      } else {
                        from = _out - dist;
                        do {
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          len -= 3;
                        } while (len > 2);
                        if (len) {
                          output[_out++] = output[from++];
                          if (len > 1) {
                            output[_out++] = output[from++];
                          }
                        }
                      }
                    } else if ((op & 64) === 0) {
                      here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                      continue dodist;
                    } else {
                      strm.msg = "invalid distance code";
                      state.mode = BAD$1;
                      break top;
                    }
                    break;
                  }
              } else if ((op & 64) === 0) {
                here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                continue dolen;
              } else if (op & 32) {
                state.mode = TYPE$1;
                break top;
              } else {
                strm.msg = "invalid literal/length code";
                state.mode = BAD$1;
                break top;
              }
              break;
            }
        } while (_in < last && _out < end);
      len = bits >> 3;
      _in -= len;
      bits -= len << 3;
      hold &= (1 << bits) - 1;
      strm.next_in = _in;
      strm.next_out = _out;
      strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
      strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
      state.hold = hold;
      state.bits = bits;
      return;
    }, "inflate_fast");
    MAXBITS = 15;
    ENOUGH_LENS$1 = 852;
    ENOUGH_DISTS$1 = 592;
    CODES$1 = 0;
    LENS$1 = 1;
    DISTS$1 = 2;
    lbase = new Uint16Array([
      /* Length codes 257..285 base */
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      13,
      15,
      17,
      19,
      23,
      27,
      31,
      35,
      43,
      51,
      59,
      67,
      83,
      99,
      115,
      131,
      163,
      195,
      227,
      258,
      0,
      0
    ]);
    lext = new Uint8Array([
      /* Length codes 257..285 extra */
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      17,
      17,
      17,
      17,
      18,
      18,
      18,
      18,
      19,
      19,
      19,
      19,
      20,
      20,
      20,
      20,
      21,
      21,
      21,
      21,
      16,
      199,
      75
    ]);
    dbase = new Uint16Array([
      /* Distance codes 0..29 base */
      1,
      2,
      3,
      4,
      5,
      7,
      9,
      13,
      17,
      25,
      33,
      49,
      65,
      97,
      129,
      193,
      257,
      385,
      513,
      769,
      1025,
      1537,
      2049,
      3073,
      4097,
      6145,
      8193,
      12289,
      16385,
      24577,
      0,
      0
    ]);
    dext = new Uint8Array([
      /* Distance codes 0..29 extra */
      16,
      16,
      16,
      16,
      17,
      17,
      18,
      18,
      19,
      19,
      20,
      20,
      21,
      21,
      22,
      22,
      23,
      23,
      24,
      24,
      25,
      25,
      26,
      26,
      27,
      27,
      28,
      28,
      29,
      29,
      64,
      64
    ]);
    inflate_table = /* @__PURE__ */ __name((type, lens, lens_index, codes, table, table_index, work, opts) => {
      const bits = opts.bits;
      let len = 0;
      let sym = 0;
      let min = 0, max = 0;
      let root = 0;
      let curr = 0;
      let drop = 0;
      let left = 0;
      let used = 0;
      let huff = 0;
      let incr;
      let fill;
      let low;
      let mask;
      let next3;
      let base = null;
      let match;
      const count = new Uint16Array(MAXBITS + 1);
      const offs = new Uint16Array(MAXBITS + 1);
      let extra = null;
      let here_bits, here_op, here_val;
      for (len = 0; len <= MAXBITS; len++) {
        count[len] = 0;
      }
      for (sym = 0; sym < codes; sym++) {
        count[lens[lens_index + sym]]++;
      }
      root = bits;
      for (max = MAXBITS; max >= 1; max--) {
        if (count[max] !== 0) {
          break;
        }
      }
      if (root > max) {
        root = max;
      }
      if (max === 0) {
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        opts.bits = 1;
        return 0;
      }
      for (min = 1; min < max; min++) {
        if (count[min] !== 0) {
          break;
        }
      }
      if (root < min) {
        root = min;
      }
      left = 1;
      for (len = 1; len <= MAXBITS; len++) {
        left <<= 1;
        left -= count[len];
        if (left < 0) {
          return -1;
        }
      }
      if (left > 0 && (type === CODES$1 || max !== 1)) {
        return -1;
      }
      offs[1] = 0;
      for (len = 1; len < MAXBITS; len++) {
        offs[len + 1] = offs[len] + count[len];
      }
      for (sym = 0; sym < codes; sym++) {
        if (lens[lens_index + sym] !== 0) {
          work[offs[lens[lens_index + sym]]++] = sym;
        }
      }
      if (type === CODES$1) {
        base = extra = work;
        match = 20;
      } else if (type === LENS$1) {
        base = lbase;
        extra = lext;
        match = 257;
      } else {
        base = dbase;
        extra = dext;
        match = 0;
      }
      huff = 0;
      sym = 0;
      len = min;
      next3 = table_index;
      curr = root;
      drop = 0;
      low = -1;
      used = 1 << root;
      mask = used - 1;
      if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
        return 1;
      }
      for (; ; ) {
        here_bits = len - drop;
        if (work[sym] + 1 < match) {
          here_op = 0;
          here_val = work[sym];
        } else if (work[sym] >= match) {
          here_op = extra[work[sym] - match];
          here_val = base[work[sym] - match];
        } else {
          here_op = 32 + 64;
          here_val = 0;
        }
        incr = 1 << len - drop;
        fill = 1 << curr;
        min = fill;
        do {
          fill -= incr;
          table[next3 + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
        } while (fill !== 0);
        incr = 1 << len - 1;
        while (huff & incr) {
          incr >>= 1;
        }
        if (incr !== 0) {
          huff &= incr - 1;
          huff += incr;
        } else {
          huff = 0;
        }
        sym++;
        if (--count[len] === 0) {
          if (len === max) {
            break;
          }
          len = lens[lens_index + work[sym]];
        }
        if (len > root && (huff & mask) !== low) {
          if (drop === 0) {
            drop = root;
          }
          next3 += min;
          curr = len - drop;
          left = 1 << curr;
          while (curr + drop < max) {
            left -= count[curr + drop];
            if (left <= 0) {
              break;
            }
            curr++;
            left <<= 1;
          }
          used += 1 << curr;
          if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
            return 1;
          }
          low = huff & mask;
          table[low] = root << 24 | curr << 16 | next3 - table_index | 0;
        }
      }
      if (huff !== 0) {
        table[next3 + huff] = len - drop << 24 | 64 << 16 | 0;
      }
      opts.bits = root;
      return 0;
    }, "inflate_table");
    inftrees = inflate_table;
    CODES = 0;
    LENS = 1;
    DISTS = 2;
    ({
      Z_FINISH: Z_FINISH$1,
      Z_BLOCK,
      Z_TREES,
      Z_OK: Z_OK$1,
      Z_STREAM_END: Z_STREAM_END$1,
      Z_NEED_DICT: Z_NEED_DICT$1,
      Z_STREAM_ERROR: Z_STREAM_ERROR$1,
      Z_DATA_ERROR: Z_DATA_ERROR$1,
      Z_MEM_ERROR: Z_MEM_ERROR$1,
      Z_BUF_ERROR: Z_BUF_ERROR$1,
      Z_DEFLATED
    } = constants$2);
    HEAD = 16180;
    FLAGS = 16181;
    TIME = 16182;
    OS = 16183;
    EXLEN = 16184;
    EXTRA = 16185;
    NAME = 16186;
    COMMENT = 16187;
    HCRC = 16188;
    DICTID = 16189;
    DICT = 16190;
    TYPE = 16191;
    TYPEDO = 16192;
    STORED = 16193;
    COPY_ = 16194;
    COPY = 16195;
    TABLE = 16196;
    LENLENS = 16197;
    CODELENS = 16198;
    LEN_ = 16199;
    LEN = 16200;
    LENEXT = 16201;
    DIST = 16202;
    DISTEXT = 16203;
    MATCH = 16204;
    LIT = 16205;
    CHECK = 16206;
    LENGTH = 16207;
    DONE = 16208;
    BAD = 16209;
    MEM = 16210;
    SYNC = 16211;
    ENOUGH_LENS = 852;
    ENOUGH_DISTS = 592;
    MAX_WBITS = 15;
    DEF_WBITS = MAX_WBITS;
    zswap32 = /* @__PURE__ */ __name((q) => {
      return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
    }, "zswap32");
    __name(InflateState, "InflateState");
    inflateStateCheck = /* @__PURE__ */ __name((strm) => {
      if (!strm) {
        return 1;
      }
      const state = strm.state;
      if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
        return 1;
      }
      return 0;
    }, "inflateStateCheck");
    inflateResetKeep = /* @__PURE__ */ __name((strm) => {
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR$1;
      }
      const state = strm.state;
      strm.total_in = strm.total_out = state.total = 0;
      strm.msg = "";
      if (state.wrap) {
        strm.adler = state.wrap & 1;
      }
      state.mode = HEAD;
      state.last = 0;
      state.havedict = 0;
      state.flags = -1;
      state.dmax = 32768;
      state.head = null;
      state.hold = 0;
      state.bits = 0;
      state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
      state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
      state.sane = 1;
      state.back = -1;
      return Z_OK$1;
    }, "inflateResetKeep");
    inflateReset = /* @__PURE__ */ __name((strm) => {
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR$1;
      }
      const state = strm.state;
      state.wsize = 0;
      state.whave = 0;
      state.wnext = 0;
      return inflateResetKeep(strm);
    }, "inflateReset");
    inflateReset2 = /* @__PURE__ */ __name((strm, windowBits) => {
      let wrap;
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR$1;
      }
      const state = strm.state;
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else {
        wrap = (windowBits >> 4) + 5;
        if (windowBits < 48) {
          windowBits &= 15;
        }
      }
      if (windowBits && (windowBits < 8 || windowBits > 15)) {
        return Z_STREAM_ERROR$1;
      }
      if (state.window !== null && state.wbits !== windowBits) {
        state.window = null;
      }
      state.wrap = wrap;
      state.wbits = windowBits;
      return inflateReset(strm);
    }, "inflateReset2");
    inflateInit2 = /* @__PURE__ */ __name((strm, windowBits) => {
      if (!strm) {
        return Z_STREAM_ERROR$1;
      }
      const state = new InflateState();
      strm.state = state;
      state.strm = strm;
      state.window = null;
      state.mode = HEAD;
      const ret = inflateReset2(strm, windowBits);
      if (ret !== Z_OK$1) {
        strm.state = null;
      }
      return ret;
    }, "inflateInit2");
    inflateInit = /* @__PURE__ */ __name((strm) => {
      return inflateInit2(strm, DEF_WBITS);
    }, "inflateInit");
    virgin = true;
    fixedtables = /* @__PURE__ */ __name((state) => {
      if (virgin) {
        lenfix = new Int32Array(512);
        distfix = new Int32Array(32);
        let sym = 0;
        while (sym < 144) {
          state.lens[sym++] = 8;
        }
        while (sym < 256) {
          state.lens[sym++] = 9;
        }
        while (sym < 280) {
          state.lens[sym++] = 7;
        }
        while (sym < 288) {
          state.lens[sym++] = 8;
        }
        inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
        sym = 0;
        while (sym < 32) {
          state.lens[sym++] = 5;
        }
        inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
        virgin = false;
      }
      state.lencode = lenfix;
      state.lenbits = 9;
      state.distcode = distfix;
      state.distbits = 5;
    }, "fixedtables");
    updatewindow = /* @__PURE__ */ __name((strm, src, end, copy) => {
      let dist;
      const state = strm.state;
      if (state.window === null) {
        state.window = new Uint8Array(1 << state.wbits);
      }
      if (state.wsize === 0) {
        state.wsize = 1 << state.wbits;
        state.wnext = 0;
        state.whave = 0;
      }
      if (copy >= state.wsize) {
        state.window.set(src.subarray(end - state.wsize, end), 0);
        state.wnext = 0;
        state.whave = state.wsize;
      } else {
        dist = state.wsize - state.wnext;
        if (dist > copy) {
          dist = copy;
        }
        state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
        copy -= dist;
        if (copy) {
          state.window.set(src.subarray(end - copy, end), 0);
          state.wnext = copy;
          state.whave = state.wsize;
        } else {
          state.wnext += dist;
          if (state.wnext === state.wsize) {
            state.wnext = 0;
          }
          if (state.whave < state.wsize) {
            state.whave += dist;
          }
        }
      }
      return 0;
    }, "updatewindow");
    inflate$2 = /* @__PURE__ */ __name((strm, flush) => {
      let state;
      let input, output;
      let next3;
      let put;
      let have, left;
      let hold;
      let bits;
      let _in, _out;
      let copy;
      let from;
      let from_source;
      let here = 0;
      let here_bits, here_op, here_val;
      let last_bits, last_op, last_val;
      let len;
      let ret;
      const hbuf = new Uint8Array(4);
      let opts;
      let n;
      const order = (
        /* permutation of code lengths */
        new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
      );
      if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
        return Z_STREAM_ERROR$1;
      }
      state = strm.state;
      if (state.mode === TYPE) {
        state.mode = TYPEDO;
      }
      put = strm.next_out;
      output = strm.output;
      left = strm.avail_out;
      next3 = strm.next_in;
      input = strm.input;
      have = strm.avail_in;
      hold = state.hold;
      bits = state.bits;
      _in = have;
      _out = left;
      ret = Z_OK$1;
      inf_leave:
        for (; ; ) {
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO;
                break;
              }
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next3++] << bits;
                bits += 8;
              }
              if (state.wrap & 2 && hold === 35615) {
                if (state.wbits === 0) {
                  state.wbits = 15;
                }
                state.check = 0;
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32_1(state.check, hbuf, 2, 0);
                hold = 0;
                bits = 0;
                state.mode = FLAGS;
                break;
              }
              if (state.head) {
                state.head.done = false;
              }
              if (!(state.wrap & 1) || /* check if zlib header allowed */
              (((hold & 255) << 8) + (hold >> 8)) % 31) {
                strm.msg = "incorrect header check";
                state.mode = BAD;
                break;
              }
              if ((hold & 15) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              hold >>>= 4;
              bits -= 4;
              len = (hold & 15) + 8;
              if (state.wbits === 0) {
                state.wbits = len;
              }
              if (len > 15 || len > state.wbits) {
                strm.msg = "invalid window size";
                state.mode = BAD;
                break;
              }
              state.dmax = 1 << state.wbits;
              state.flags = 0;
              strm.adler = state.check = 1;
              state.mode = hold & 512 ? DICTID : TYPE;
              hold = 0;
              bits = 0;
              break;
            case FLAGS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next3++] << bits;
                bits += 8;
              }
              state.flags = hold;
              if ((state.flags & 255) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              if (state.flags & 57344) {
                strm.msg = "unknown header flags set";
                state.mode = BAD;
                break;
              }
              if (state.head) {
                state.head.text = hold >> 8 & 1;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32_1(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = TIME;
            /* falls through */
            case TIME:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next3++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.time = hold;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                hbuf[2] = hold >>> 16 & 255;
                hbuf[3] = hold >>> 24 & 255;
                state.check = crc32_1(state.check, hbuf, 4, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = OS;
            /* falls through */
            case OS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next3++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.xflags = hold & 255;
                state.head.os = hold >> 8;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32_1(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = EXLEN;
            /* falls through */
            case EXLEN:
              if (state.flags & 1024) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next3++] << bits;
                  bits += 8;
                }
                state.length = hold;
                if (state.head) {
                  state.head.extra_len = hold;
                }
                if (state.flags & 512 && state.wrap & 4) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32_1(state.check, hbuf, 2, 0);
                }
                hold = 0;
                bits = 0;
              } else if (state.head) {
                state.head.extra = null;
              }
              state.mode = EXTRA;
            /* falls through */
            case EXTRA:
              if (state.flags & 1024) {
                copy = state.length;
                if (copy > have) {
                  copy = have;
                }
                if (copy) {
                  if (state.head) {
                    len = state.head.extra_len - state.length;
                    if (!state.head.extra) {
                      state.head.extra = new Uint8Array(state.head.extra_len);
                    }
                    state.head.extra.set(
                      input.subarray(
                        next3,
                        // extra field is limited to 65536 bytes
                        // - no need for additional size check
                        next3 + copy
                      ),
                      /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                      len
                    );
                  }
                  if (state.flags & 512 && state.wrap & 4) {
                    state.check = crc32_1(state.check, input, copy, next3);
                  }
                  have -= copy;
                  next3 += copy;
                  state.length -= copy;
                }
                if (state.length) {
                  break inf_leave;
                }
              }
              state.length = 0;
              state.mode = NAME;
            /* falls through */
            case NAME:
              if (state.flags & 2048) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next3 + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.name += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512 && state.wrap & 4) {
                  state.check = crc32_1(state.check, input, copy, next3);
                }
                have -= copy;
                next3 += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.name = null;
              }
              state.length = 0;
              state.mode = COMMENT;
            /* falls through */
            case COMMENT:
              if (state.flags & 4096) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next3 + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.comment += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512 && state.wrap & 4) {
                  state.check = crc32_1(state.check, input, copy, next3);
                }
                have -= copy;
                next3 += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.comment = null;
              }
              state.mode = HCRC;
            /* falls through */
            case HCRC:
              if (state.flags & 512) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next3++] << bits;
                  bits += 8;
                }
                if (state.wrap & 4 && hold !== (state.check & 65535)) {
                  strm.msg = "header crc mismatch";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              if (state.head) {
                state.head.hcrc = state.flags >> 9 & 1;
                state.head.done = true;
              }
              strm.adler = state.check = 0;
              state.mode = TYPE;
              break;
            case DICTID:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next3++] << bits;
                bits += 8;
              }
              strm.adler = state.check = zswap32(hold);
              hold = 0;
              bits = 0;
              state.mode = DICT;
            /* falls through */
            case DICT:
              if (state.havedict === 0) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next3;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                return Z_NEED_DICT$1;
              }
              strm.adler = state.check = 1;
              state.mode = TYPE;
            /* falls through */
            case TYPE:
              if (flush === Z_BLOCK || flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case TYPEDO:
              if (state.last) {
                hold >>>= bits & 7;
                bits -= bits & 7;
                state.mode = CHECK;
                break;
              }
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next3++] << bits;
                bits += 8;
              }
              state.last = hold & 1;
              hold >>>= 1;
              bits -= 1;
              switch (hold & 3) {
                case 0:
                  state.mode = STORED;
                  break;
                case 1:
                  fixedtables(state);
                  state.mode = LEN_;
                  if (flush === Z_TREES) {
                    hold >>>= 2;
                    bits -= 2;
                    break inf_leave;
                  }
                  break;
                case 2:
                  state.mode = TABLE;
                  break;
                case 3:
                  strm.msg = "invalid block type";
                  state.mode = BAD;
              }
              hold >>>= 2;
              bits -= 2;
              break;
            case STORED:
              hold >>>= bits & 7;
              bits -= bits & 7;
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next3++] << bits;
                bits += 8;
              }
              if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                strm.msg = "invalid stored block lengths";
                state.mode = BAD;
                break;
              }
              state.length = hold & 65535;
              hold = 0;
              bits = 0;
              state.mode = COPY_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case COPY_:
              state.mode = COPY;
            /* falls through */
            case COPY:
              copy = state.length;
              if (copy) {
                if (copy > have) {
                  copy = have;
                }
                if (copy > left) {
                  copy = left;
                }
                if (copy === 0) {
                  break inf_leave;
                }
                output.set(input.subarray(next3, next3 + copy), put);
                have -= copy;
                next3 += copy;
                left -= copy;
                put += copy;
                state.length -= copy;
                break;
              }
              state.mode = TYPE;
              break;
            case TABLE:
              while (bits < 14) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next3++] << bits;
                bits += 8;
              }
              state.nlen = (hold & 31) + 257;
              hold >>>= 5;
              bits -= 5;
              state.ndist = (hold & 31) + 1;
              hold >>>= 5;
              bits -= 5;
              state.ncode = (hold & 15) + 4;
              hold >>>= 4;
              bits -= 4;
              if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = "too many length or distance symbols";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = LENLENS;
            /* falls through */
            case LENLENS:
              while (state.have < state.ncode) {
                while (bits < 3) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next3++] << bits;
                  bits += 8;
                }
                state.lens[order[state.have++]] = hold & 7;
                hold >>>= 3;
                bits -= 3;
              }
              while (state.have < 19) {
                state.lens[order[state.have++]] = 0;
              }
              state.lencode = state.lendyn;
              state.lenbits = 7;
              opts = { bits: state.lenbits };
              ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid code lengths set";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = CODELENS;
            /* falls through */
            case CODELENS:
              while (state.have < state.nlen + state.ndist) {
                for (; ; ) {
                  here = state.lencode[hold & (1 << state.lenbits) - 1];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next3++] << bits;
                  bits += 8;
                }
                if (here_val < 16) {
                  hold >>>= here_bits;
                  bits -= here_bits;
                  state.lens[state.have++] = here_val;
                } else {
                  if (here_val === 16) {
                    n = here_bits + 2;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next3++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    if (state.have === 0) {
                      strm.msg = "invalid bit length repeat";
                      state.mode = BAD;
                      break;
                    }
                    len = state.lens[state.have - 1];
                    copy = 3 + (hold & 3);
                    hold >>>= 2;
                    bits -= 2;
                  } else if (here_val === 17) {
                    n = here_bits + 3;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next3++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 3 + (hold & 7);
                    hold >>>= 3;
                    bits -= 3;
                  } else {
                    n = here_bits + 7;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next3++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 11 + (hold & 127);
                    hold >>>= 7;
                    bits -= 7;
                  }
                  if (state.have + copy > state.nlen + state.ndist) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  while (copy--) {
                    state.lens[state.have++] = len;
                  }
                }
              }
              if (state.mode === BAD) {
                break;
              }
              if (state.lens[256] === 0) {
                strm.msg = "invalid code -- missing end-of-block";
                state.mode = BAD;
                break;
              }
              state.lenbits = 9;
              opts = { bits: state.lenbits };
              ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid literal/lengths set";
                state.mode = BAD;
                break;
              }
              state.distbits = 6;
              state.distcode = state.distdyn;
              opts = { bits: state.distbits };
              ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
              state.distbits = opts.bits;
              if (ret) {
                strm.msg = "invalid distances set";
                state.mode = BAD;
                break;
              }
              state.mode = LEN_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case LEN_:
              state.mode = LEN;
            /* falls through */
            case LEN:
              if (have >= 6 && left >= 258) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next3;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                inffast(strm, _out);
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next3 = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                if (state.mode === TYPE) {
                  state.back = -1;
                }
                break;
              }
              state.back = 0;
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next3++] << bits;
                bits += 8;
              }
              if (here_op && (here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next3++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              state.length = here_val;
              if (here_op === 0) {
                state.mode = LIT;
                break;
              }
              if (here_op & 32) {
                state.back = -1;
                state.mode = TYPE;
                break;
              }
              if (here_op & 64) {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break;
              }
              state.extra = here_op & 15;
              state.mode = LENEXT;
            /* falls through */
            case LENEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next3++] << bits;
                  bits += 8;
                }
                state.length += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              state.was = state.length;
              state.mode = DIST;
            /* falls through */
            case DIST:
              for (; ; ) {
                here = state.distcode[hold & (1 << state.distbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next3++] << bits;
                bits += 8;
              }
              if ((here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next3++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              if (here_op & 64) {
                strm.msg = "invalid distance code";
                state.mode = BAD;
                break;
              }
              state.offset = here_val;
              state.extra = here_op & 15;
              state.mode = DISTEXT;
            /* falls through */
            case DISTEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next3++] << bits;
                  bits += 8;
                }
                state.offset += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              if (state.offset > state.dmax) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break;
              }
              state.mode = MATCH;
            /* falls through */
            case MATCH:
              if (left === 0) {
                break inf_leave;
              }
              copy = _out - left;
              if (state.offset > copy) {
                copy = state.offset - copy;
                if (copy > state.whave) {
                  if (state.sane) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD;
                    break;
                  }
                }
                if (copy > state.wnext) {
                  copy -= state.wnext;
                  from = state.wsize - copy;
                } else {
                  from = state.wnext - copy;
                }
                if (copy > state.length) {
                  copy = state.length;
                }
                from_source = state.window;
              } else {
                from_source = output;
                from = put - state.offset;
                copy = state.length;
              }
              if (copy > left) {
                copy = left;
              }
              left -= copy;
              state.length -= copy;
              do {
                output[put++] = from_source[from++];
              } while (--copy);
              if (state.length === 0) {
                state.mode = LEN;
              }
              break;
            case LIT:
              if (left === 0) {
                break inf_leave;
              }
              output[put++] = state.length;
              left--;
              state.mode = LEN;
              break;
            case CHECK:
              if (state.wrap) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold |= input[next3++] << bits;
                  bits += 8;
                }
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (state.wrap & 4 && _out) {
                  strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
                  state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);
                }
                _out = left;
                if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = "incorrect data check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = LENGTH;
            /* falls through */
            case LENGTH:
              if (state.wrap && state.flags) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next3++] << bits;
                  bits += 8;
                }
                if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
                  strm.msg = "incorrect length check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = DONE;
            /* falls through */
            case DONE:
              ret = Z_STREAM_END$1;
              break inf_leave;
            case BAD:
              ret = Z_DATA_ERROR$1;
              break inf_leave;
            case MEM:
              return Z_MEM_ERROR$1;
            case SYNC:
            /* falls through */
            default:
              return Z_STREAM_ERROR$1;
          }
        }
      strm.next_out = put;
      strm.avail_out = left;
      strm.next_in = next3;
      strm.avail_in = have;
      state.hold = hold;
      state.bits = bits;
      if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
        if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
      }
      _in -= strm.avail_in;
      _out -= strm.avail_out;
      strm.total_in += _in;
      strm.total_out += _out;
      state.total += _out;
      if (state.wrap & 4 && _out) {
        strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
        state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);
      }
      strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
      if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
        ret = Z_BUF_ERROR$1;
      }
      return ret;
    }, "inflate$2");
    inflateEnd = /* @__PURE__ */ __name((strm) => {
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR$1;
      }
      let state = strm.state;
      if (state.window) {
        state.window = null;
      }
      strm.state = null;
      return Z_OK$1;
    }, "inflateEnd");
    inflateGetHeader = /* @__PURE__ */ __name((strm, head) => {
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR$1;
      }
      const state = strm.state;
      if ((state.wrap & 2) === 0) {
        return Z_STREAM_ERROR$1;
      }
      state.head = head;
      head.done = false;
      return Z_OK$1;
    }, "inflateGetHeader");
    inflateSetDictionary = /* @__PURE__ */ __name((strm, dictionary) => {
      const dictLength = dictionary.length;
      let state;
      let dictid;
      let ret;
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR$1;
      }
      state = strm.state;
      if (state.wrap !== 0 && state.mode !== DICT) {
        return Z_STREAM_ERROR$1;
      }
      if (state.mode === DICT) {
        dictid = 1;
        dictid = adler32_1(dictid, dictionary, dictLength, 0);
        if (dictid !== state.check) {
          return Z_DATA_ERROR$1;
        }
      }
      ret = updatewindow(strm, dictionary, dictLength, dictLength);
      if (ret) {
        state.mode = MEM;
        return Z_MEM_ERROR$1;
      }
      state.havedict = 1;
      return Z_OK$1;
    }, "inflateSetDictionary");
    inflateReset_1 = inflateReset;
    inflateReset2_1 = inflateReset2;
    inflateResetKeep_1 = inflateResetKeep;
    inflateInit_1 = inflateInit;
    inflateInit2_1 = inflateInit2;
    inflate_2$1 = inflate$2;
    inflateEnd_1 = inflateEnd;
    inflateGetHeader_1 = inflateGetHeader;
    inflateSetDictionary_1 = inflateSetDictionary;
    inflateInfo = "pako inflate (from Nodeca project)";
    inflate_1$2 = {
      inflateReset: inflateReset_1,
      inflateReset2: inflateReset2_1,
      inflateResetKeep: inflateResetKeep_1,
      inflateInit: inflateInit_1,
      inflateInit2: inflateInit2_1,
      inflate: inflate_2$1,
      inflateEnd: inflateEnd_1,
      inflateGetHeader: inflateGetHeader_1,
      inflateSetDictionary: inflateSetDictionary_1,
      inflateInfo
    };
    __name(GZheader, "GZheader");
    gzheader = GZheader;
    toString = Object.prototype.toString;
    ({
      Z_NO_FLUSH,
      Z_FINISH,
      Z_OK,
      Z_STREAM_END,
      Z_NEED_DICT,
      Z_STREAM_ERROR,
      Z_DATA_ERROR,
      Z_MEM_ERROR,
      Z_BUF_ERROR
    } = constants$2);
    defaultOptions = {
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ""
    };
    __name(Inflate$1, "Inflate$1");
    Inflate$1.prototype.push = function(data, flush_mode) {
      const strm = this.strm;
      const chunkSize = this.options.chunkSize;
      const dictionary = this.options.dictionary;
      let status, _flush_mode, last_avail_out;
      if (this.ended) return false;
      if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
      else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
      if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      for (; ; ) {
        if (strm.avail_out === 0) {
          strm.output = new Uint8Array(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = inflate_1$2.inflate(strm, _flush_mode);
        if (status === Z_NEED_DICT && dictionary) {
          status = inflate_1$2.inflateSetDictionary(strm, dictionary);
          if (status === Z_OK) {
            status = inflate_1$2.inflate(strm, _flush_mode);
          } else if (status === Z_DATA_ERROR) {
            status = Z_NEED_DICT;
          }
        }
        while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap & 2 && strm.state.flags !== 0 && strm.input[strm.next_in] !== 0) {
          inflate_1$2.inflateReset(strm);
          status = inflate_1$2.inflate(strm, _flush_mode);
        }
        switch (status) {
          case Z_STREAM_ERROR:
          case Z_DATA_ERROR:
          case Z_NEED_DICT:
          case Z_MEM_ERROR:
            this.onEnd(status);
            this.ended = true;
            return false;
        }
        last_avail_out = strm.avail_out;
        if (strm.next_out) {
          if (strm.avail_out === 0 || status === Z_STREAM_END || _flush_mode > 0) {
            if (this.options.to === "string") {
              let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
              let tail = strm.next_out - next_out_utf8;
              let utf8str = strings.buf2string(strm.output, next_out_utf8);
              strm.next_out = tail;
              strm.avail_out = chunkSize - tail;
              if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
              this.onData(utf8str);
            } else {
              this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
              strm.avail_out = 0;
              strm.next_out = 0;
            }
          }
        }
        if ((status === Z_OK || status === Z_BUF_ERROR) && last_avail_out === 0) continue;
        if (status === Z_STREAM_END) {
          status = inflate_1$2.inflateEnd(this.strm);
          this.onEnd(status);
          this.ended = true;
          return true;
        }
        if (strm.avail_in === 0) {
          if (_flush_mode === Z_FINISH) {
            status = inflate_1$2.inflateEnd(this.strm);
            this.onEnd(status === Z_OK ? Z_BUF_ERROR : status);
            this.ended = true;
            return false;
          }
          break;
        }
      }
      return true;
    };
    Inflate$1.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Inflate$1.prototype.onEnd = function(status) {
      if (status === Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = common.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    __name(inflate$1, "inflate$1");
    __name(inflateRaw$1, "inflateRaw$1");
    Inflate_1$1 = Inflate$1;
    inflate_2 = inflate$1;
    inflateRaw_1$1 = inflateRaw$1;
    ungzip$1 = inflate$1;
    constants = constants$2;
    inflate_1$1 = {
      Inflate: Inflate_1$1,
      inflate: inflate_2,
      inflateRaw: inflateRaw_1$1,
      ungzip: ungzip$1,
      constants
    };
    ({ Deflate, deflate, deflateRaw, gzip } = deflate_1$1);
    ({ Inflate, inflate, inflateRaw, ungzip } = inflate_1$1);
    inflate_1 = inflate;
  }
});

// node_modules/geotiff/dist-module/compression/deflate.js
var deflate_exports = {};
__export(deflate_exports, {
  default: () => DeflateDecoder
});
var DeflateDecoder;
var init_deflate = __esm({
  "node_modules/geotiff/dist-module/compression/deflate.js"() {
    init_pako_esm();
    init_basedecoder();
    DeflateDecoder = class extends BaseDecoder {
      static {
        __name(this, "DeflateDecoder");
      }
      /** @param {ArrayBuffer} buffer */
      decodeBlock(buffer2) {
        return inflate_1(new Uint8Array(buffer2)).buffer;
      }
    };
  }
});

// node_modules/geotiff/dist-module/compression/packbits.js
var packbits_exports = {};
__export(packbits_exports, {
  default: () => PackbitsDecoder
});
var PackbitsDecoder;
var init_packbits = __esm({
  "node_modules/geotiff/dist-module/compression/packbits.js"() {
    init_basedecoder();
    PackbitsDecoder = class extends BaseDecoder {
      static {
        __name(this, "PackbitsDecoder");
      }
      /** @param {ArrayBuffer} buffer */
      decodeBlock(buffer2) {
        const dataView = new DataView(buffer2);
        const out = [];
        for (let i = 0; i < buffer2.byteLength; ++i) {
          let header = dataView.getInt8(i);
          if (header < 0) {
            const next3 = dataView.getUint8(i + 1);
            header = -header;
            for (let j = 0; j <= header; ++j) {
              out.push(next3);
            }
            i += 1;
          } else {
            for (let j = 0; j <= header; ++j) {
              out.push(dataView.getUint8(i + j + 1));
            }
            i += header + 1;
          }
        }
        return new Uint8Array(out).buffer;
      }
    };
  }
});

// node_modules/lerc/LercDecode.js
var require_LercDecode = __commonJS({
  "node_modules/lerc/LercDecode.js"(exports, module) {
    (function() {
      var LercDecode = (function() {
        var CntZImage = {};
        CntZImage.defaultNoDataValue = -34027999387901484e22;
        CntZImage.decode = function(input, options) {
          options = options || {};
          var skipMask = options.encodedMaskData || options.encodedMaskData === null;
          var parsedData = parse(input, options.inputOffset || 0, skipMask);
          var noDataValue = options.noDataValue !== null ? options.noDataValue : CntZImage.defaultNoDataValue;
          var uncompressedData = uncompressPixelValues(
            parsedData,
            options.pixelType || Float32Array,
            options.encodedMaskData,
            noDataValue,
            options.returnMask
          );
          var result = {
            width: parsedData.width,
            height: parsedData.height,
            pixelData: uncompressedData.resultPixels,
            minValue: uncompressedData.minValue,
            maxValue: parsedData.pixels.maxValue,
            noDataValue
          };
          if (uncompressedData.resultMask) {
            result.maskData = uncompressedData.resultMask;
          }
          if (options.returnEncodedMask && parsedData.mask) {
            result.encodedMaskData = parsedData.mask.bitset ? parsedData.mask.bitset : null;
          }
          if (options.returnFileInfo) {
            result.fileInfo = formatFileInfo(parsedData);
            if (options.computeUsedBitDepths) {
              result.fileInfo.bitDepths = computeUsedBitDepths(parsedData);
            }
          }
          return result;
        };
        var uncompressPixelValues = /* @__PURE__ */ __name(function(data, TypedArrayClass, maskBitset, noDataValue, storeDecodedMask) {
          var blockIdx = 0;
          var numX = data.pixels.numBlocksX;
          var numY = data.pixels.numBlocksY;
          var blockWidth = Math.floor(data.width / numX);
          var blockHeight = Math.floor(data.height / numY);
          var scale = 2 * data.maxZError;
          var minValue = Number.MAX_VALUE, currentValue;
          maskBitset = maskBitset || (data.mask ? data.mask.bitset : null);
          var resultPixels, resultMask;
          resultPixels = new TypedArrayClass(data.width * data.height);
          if (storeDecodedMask && maskBitset) {
            resultMask = new Uint8Array(data.width * data.height);
          }
          var blockDataBuffer = new Float32Array(blockWidth * blockHeight);
          var xx, yy;
          for (var y = 0; y <= numY; y++) {
            var thisBlockHeight = y !== numY ? blockHeight : data.height % numY;
            if (thisBlockHeight === 0) {
              continue;
            }
            for (var x = 0; x <= numX; x++) {
              var thisBlockWidth = x !== numX ? blockWidth : data.width % numX;
              if (thisBlockWidth === 0) {
                continue;
              }
              var outPtr = y * data.width * blockHeight + x * blockWidth;
              var outStride = data.width - thisBlockWidth;
              var block = data.pixels.blocks[blockIdx];
              var blockData, blockPtr, constValue;
              if (block.encoding < 2) {
                if (block.encoding === 0) {
                  blockData = block.rawData;
                } else {
                  unstuff(block.stuffedData, block.bitsPerPixel, block.numValidPixels, block.offset, scale, blockDataBuffer, data.pixels.maxValue);
                  blockData = blockDataBuffer;
                }
                blockPtr = 0;
              } else if (block.encoding === 2) {
                constValue = 0;
              } else {
                constValue = block.offset;
              }
              var maskByte;
              if (maskBitset) {
                for (yy = 0; yy < thisBlockHeight; yy++) {
                  if (outPtr & 7) {
                    maskByte = maskBitset[outPtr >> 3];
                    maskByte <<= outPtr & 7;
                  }
                  for (xx = 0; xx < thisBlockWidth; xx++) {
                    if (!(outPtr & 7)) {
                      maskByte = maskBitset[outPtr >> 3];
                    }
                    if (maskByte & 128) {
                      if (resultMask) {
                        resultMask[outPtr] = 1;
                      }
                      currentValue = block.encoding < 2 ? blockData[blockPtr++] : constValue;
                      minValue = minValue > currentValue ? currentValue : minValue;
                      resultPixels[outPtr++] = currentValue;
                    } else {
                      if (resultMask) {
                        resultMask[outPtr] = 0;
                      }
                      resultPixels[outPtr++] = noDataValue;
                    }
                    maskByte <<= 1;
                  }
                  outPtr += outStride;
                }
              } else {
                if (block.encoding < 2) {
                  for (yy = 0; yy < thisBlockHeight; yy++) {
                    for (xx = 0; xx < thisBlockWidth; xx++) {
                      currentValue = blockData[blockPtr++];
                      minValue = minValue > currentValue ? currentValue : minValue;
                      resultPixels[outPtr++] = currentValue;
                    }
                    outPtr += outStride;
                  }
                } else {
                  minValue = minValue > constValue ? constValue : minValue;
                  for (yy = 0; yy < thisBlockHeight; yy++) {
                    for (xx = 0; xx < thisBlockWidth; xx++) {
                      resultPixels[outPtr++] = constValue;
                    }
                    outPtr += outStride;
                  }
                }
              }
              if (block.encoding === 1 && blockPtr !== block.numValidPixels) {
                throw "Block and Mask do not match";
              }
              blockIdx++;
            }
          }
          return {
            resultPixels,
            resultMask,
            minValue
          };
        }, "uncompressPixelValues");
        var formatFileInfo = /* @__PURE__ */ __name(function(data) {
          return {
            "fileIdentifierString": data.fileIdentifierString,
            "fileVersion": data.fileVersion,
            "imageType": data.imageType,
            "height": data.height,
            "width": data.width,
            "maxZError": data.maxZError,
            "eofOffset": data.eofOffset,
            "mask": data.mask ? {
              "numBlocksX": data.mask.numBlocksX,
              "numBlocksY": data.mask.numBlocksY,
              "numBytes": data.mask.numBytes,
              "maxValue": data.mask.maxValue
            } : null,
            "pixels": {
              "numBlocksX": data.pixels.numBlocksX,
              "numBlocksY": data.pixels.numBlocksY,
              "numBytes": data.pixels.numBytes,
              "maxValue": data.pixels.maxValue,
              "noDataValue": data.noDataValue
            }
          };
        }, "formatFileInfo");
        var computeUsedBitDepths = /* @__PURE__ */ __name(function(data) {
          var numBlocks = data.pixels.numBlocksX * data.pixels.numBlocksY;
          var bitDepths = {};
          for (var i = 0; i < numBlocks; i++) {
            var block = data.pixels.blocks[i];
            if (block.encoding === 0) {
              bitDepths.float32 = true;
            } else if (block.encoding === 1) {
              bitDepths[block.bitsPerPixel] = true;
            } else {
              bitDepths[0] = true;
            }
          }
          return Object.keys(bitDepths);
        }, "computeUsedBitDepths");
        var parse = /* @__PURE__ */ __name(function(input, fp, skipMask) {
          var data = {};
          var fileIdView = new Uint8Array(input, fp, 10);
          data.fileIdentifierString = String.fromCharCode.apply(null, fileIdView);
          if (data.fileIdentifierString.trim() !== "CntZImage") {
            throw "Unexpected file identifier string: " + data.fileIdentifierString;
          }
          fp += 10;
          var view = new DataView(input, fp, 24);
          data.fileVersion = view.getInt32(0, true);
          data.imageType = view.getInt32(4, true);
          data.height = view.getUint32(8, true);
          data.width = view.getUint32(12, true);
          data.maxZError = view.getFloat64(16, true);
          fp += 24;
          if (!skipMask) {
            view = new DataView(input, fp, 16);
            data.mask = {};
            data.mask.numBlocksY = view.getUint32(0, true);
            data.mask.numBlocksX = view.getUint32(4, true);
            data.mask.numBytes = view.getUint32(8, true);
            data.mask.maxValue = view.getFloat32(12, true);
            fp += 16;
            if (data.mask.numBytes > 0) {
              var bitset = new Uint8Array(Math.ceil(data.width * data.height / 8));
              view = new DataView(input, fp, data.mask.numBytes);
              var cnt = view.getInt16(0, true);
              var ip = 2, op = 0;
              do {
                if (cnt > 0) {
                  while (cnt--) {
                    bitset[op++] = view.getUint8(ip++);
                  }
                } else {
                  var val = view.getUint8(ip++);
                  cnt = -cnt;
                  while (cnt--) {
                    bitset[op++] = val;
                  }
                }
                cnt = view.getInt16(ip, true);
                ip += 2;
              } while (ip < data.mask.numBytes);
              if (cnt !== -32768 || op < bitset.length) {
                throw "Unexpected end of mask RLE encoding";
              }
              data.mask.bitset = bitset;
              fp += data.mask.numBytes;
            } else if ((data.mask.numBytes | data.mask.numBlocksY | data.mask.maxValue) === 0) {
              data.mask.bitset = new Uint8Array(Math.ceil(data.width * data.height / 8));
            }
          }
          view = new DataView(input, fp, 16);
          data.pixels = {};
          data.pixels.numBlocksY = view.getUint32(0, true);
          data.pixels.numBlocksX = view.getUint32(4, true);
          data.pixels.numBytes = view.getUint32(8, true);
          data.pixels.maxValue = view.getFloat32(12, true);
          fp += 16;
          var numBlocksX = data.pixels.numBlocksX;
          var numBlocksY = data.pixels.numBlocksY;
          var actualNumBlocksX = numBlocksX + (data.width % numBlocksX > 0 ? 1 : 0);
          var actualNumBlocksY = numBlocksY + (data.height % numBlocksY > 0 ? 1 : 0);
          data.pixels.blocks = new Array(actualNumBlocksX * actualNumBlocksY);
          var blockI = 0;
          for (var blockY = 0; blockY < actualNumBlocksY; blockY++) {
            for (var blockX = 0; blockX < actualNumBlocksX; blockX++) {
              var size = 0;
              var bytesLeft = input.byteLength - fp;
              view = new DataView(input, fp, Math.min(10, bytesLeft));
              var block = {};
              data.pixels.blocks[blockI++] = block;
              var headerByte = view.getUint8(0);
              size++;
              block.encoding = headerByte & 63;
              if (block.encoding > 3) {
                throw "Invalid block encoding (" + block.encoding + ")";
              }
              if (block.encoding === 2) {
                fp++;
                continue;
              }
              if (headerByte !== 0 && headerByte !== 2) {
                headerByte >>= 6;
                block.offsetType = headerByte;
                if (headerByte === 2) {
                  block.offset = view.getInt8(1);
                  size++;
                } else if (headerByte === 1) {
                  block.offset = view.getInt16(1, true);
                  size += 2;
                } else if (headerByte === 0) {
                  block.offset = view.getFloat32(1, true);
                  size += 4;
                } else {
                  throw "Invalid block offset type";
                }
                if (block.encoding === 1) {
                  headerByte = view.getUint8(size);
                  size++;
                  block.bitsPerPixel = headerByte & 63;
                  headerByte >>= 6;
                  block.numValidPixelsType = headerByte;
                  if (headerByte === 2) {
                    block.numValidPixels = view.getUint8(size);
                    size++;
                  } else if (headerByte === 1) {
                    block.numValidPixels = view.getUint16(size, true);
                    size += 2;
                  } else if (headerByte === 0) {
                    block.numValidPixels = view.getUint32(size, true);
                    size += 4;
                  } else {
                    throw "Invalid valid pixel count type";
                  }
                }
              }
              fp += size;
              if (block.encoding === 3) {
                continue;
              }
              var arrayBuf, store8;
              if (block.encoding === 0) {
                var numPixels = (data.pixels.numBytes - 1) / 4;
                if (numPixels !== Math.floor(numPixels)) {
                  throw "uncompressed block has invalid length";
                }
                arrayBuf = new ArrayBuffer(numPixels * 4);
                store8 = new Uint8Array(arrayBuf);
                store8.set(new Uint8Array(input, fp, numPixels * 4));
                var rawData = new Float32Array(arrayBuf);
                block.rawData = rawData;
                fp += numPixels * 4;
              } else if (block.encoding === 1) {
                var dataBytes = Math.ceil(block.numValidPixels * block.bitsPerPixel / 8);
                var dataWords = Math.ceil(dataBytes / 4);
                arrayBuf = new ArrayBuffer(dataWords * 4);
                store8 = new Uint8Array(arrayBuf);
                store8.set(new Uint8Array(input, fp, dataBytes));
                block.stuffedData = new Uint32Array(arrayBuf);
                fp += dataBytes;
              }
            }
          }
          data.eofOffset = fp;
          return data;
        }, "parse");
        var unstuff = /* @__PURE__ */ __name(function(src, bitsPerPixel, numPixels, offset, scale, dest, maxValue) {
          var bitMask = (1 << bitsPerPixel) - 1;
          var i = 0, o;
          var bitsLeft = 0;
          var n, buffer2;
          var nmax = Math.ceil((maxValue - offset) / scale);
          var numInvalidTailBytes = src.length * 4 - Math.ceil(bitsPerPixel * numPixels / 8);
          src[src.length - 1] <<= 8 * numInvalidTailBytes;
          for (o = 0; o < numPixels; o++) {
            if (bitsLeft === 0) {
              buffer2 = src[i++];
              bitsLeft = 32;
            }
            if (bitsLeft >= bitsPerPixel) {
              n = buffer2 >>> bitsLeft - bitsPerPixel & bitMask;
              bitsLeft -= bitsPerPixel;
            } else {
              var missingBits = bitsPerPixel - bitsLeft;
              n = (buffer2 & bitMask) << missingBits & bitMask;
              buffer2 = src[i++];
              bitsLeft = 32 - missingBits;
              n += buffer2 >>> bitsLeft;
            }
            dest[o] = n < nmax ? offset + n * scale : maxValue;
          }
          return dest;
        }, "unstuff");
        return CntZImage;
      })();
      var Lerc2Decode = (function() {
        "use strict";
        var BitStuffer = {
          //methods ending with 2 are for the new byte order used by Lerc2.3 and above.
          //originalUnstuff is used to unpack Huffman code table. code is duplicated to unstuffx for performance reasons.
          unstuff: /* @__PURE__ */ __name(function(src, dest, bitsPerPixel, numPixels, lutArr, offset, scale, maxValue) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o;
            var bitsLeft = 0;
            var n, buffer2, missingBits, nmax;
            var numInvalidTailBytes = src.length * 4 - Math.ceil(bitsPerPixel * numPixels / 8);
            src[src.length - 1] <<= 8 * numInvalidTailBytes;
            if (lutArr) {
              for (o = 0; o < numPixels; o++) {
                if (bitsLeft === 0) {
                  buffer2 = src[i++];
                  bitsLeft = 32;
                }
                if (bitsLeft >= bitsPerPixel) {
                  n = buffer2 >>> bitsLeft - bitsPerPixel & bitMask;
                  bitsLeft -= bitsPerPixel;
                } else {
                  missingBits = bitsPerPixel - bitsLeft;
                  n = (buffer2 & bitMask) << missingBits & bitMask;
                  buffer2 = src[i++];
                  bitsLeft = 32 - missingBits;
                  n += buffer2 >>> bitsLeft;
                }
                dest[o] = lutArr[n];
              }
            } else {
              nmax = Math.ceil((maxValue - offset) / scale);
              for (o = 0; o < numPixels; o++) {
                if (bitsLeft === 0) {
                  buffer2 = src[i++];
                  bitsLeft = 32;
                }
                if (bitsLeft >= bitsPerPixel) {
                  n = buffer2 >>> bitsLeft - bitsPerPixel & bitMask;
                  bitsLeft -= bitsPerPixel;
                } else {
                  missingBits = bitsPerPixel - bitsLeft;
                  n = (buffer2 & bitMask) << missingBits & bitMask;
                  buffer2 = src[i++];
                  bitsLeft = 32 - missingBits;
                  n += buffer2 >>> bitsLeft;
                }
                dest[o] = n < nmax ? offset + n * scale : maxValue;
              }
            }
          }, "unstuff"),
          unstuffLUT: /* @__PURE__ */ __name(function(src, bitsPerPixel, numPixels, offset, scale, maxValue) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o = 0, missingBits = 0, bitsLeft = 0, n = 0;
            var buffer2;
            var dest = [];
            var numInvalidTailBytes = src.length * 4 - Math.ceil(bitsPerPixel * numPixels / 8);
            src[src.length - 1] <<= 8 * numInvalidTailBytes;
            var nmax = Math.ceil((maxValue - offset) / scale);
            for (o = 0; o < numPixels; o++) {
              if (bitsLeft === 0) {
                buffer2 = src[i++];
                bitsLeft = 32;
              }
              if (bitsLeft >= bitsPerPixel) {
                n = buffer2 >>> bitsLeft - bitsPerPixel & bitMask;
                bitsLeft -= bitsPerPixel;
              } else {
                missingBits = bitsPerPixel - bitsLeft;
                n = (buffer2 & bitMask) << missingBits & bitMask;
                buffer2 = src[i++];
                bitsLeft = 32 - missingBits;
                n += buffer2 >>> bitsLeft;
              }
              dest[o] = n < nmax ? offset + n * scale : maxValue;
            }
            dest.unshift(offset);
            return dest;
          }, "unstuffLUT"),
          unstuff2: /* @__PURE__ */ __name(function(src, dest, bitsPerPixel, numPixels, lutArr, offset, scale, maxValue) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o;
            var bitsLeft = 0, bitPos = 0;
            var n, buffer2, missingBits;
            if (lutArr) {
              for (o = 0; o < numPixels; o++) {
                if (bitsLeft === 0) {
                  buffer2 = src[i++];
                  bitsLeft = 32;
                  bitPos = 0;
                }
                if (bitsLeft >= bitsPerPixel) {
                  n = buffer2 >>> bitPos & bitMask;
                  bitsLeft -= bitsPerPixel;
                  bitPos += bitsPerPixel;
                } else {
                  missingBits = bitsPerPixel - bitsLeft;
                  n = buffer2 >>> bitPos & bitMask;
                  buffer2 = src[i++];
                  bitsLeft = 32 - missingBits;
                  n |= (buffer2 & (1 << missingBits) - 1) << bitsPerPixel - missingBits;
                  bitPos = missingBits;
                }
                dest[o] = lutArr[n];
              }
            } else {
              var nmax = Math.ceil((maxValue - offset) / scale);
              for (o = 0; o < numPixels; o++) {
                if (bitsLeft === 0) {
                  buffer2 = src[i++];
                  bitsLeft = 32;
                  bitPos = 0;
                }
                if (bitsLeft >= bitsPerPixel) {
                  n = buffer2 >>> bitPos & bitMask;
                  bitsLeft -= bitsPerPixel;
                  bitPos += bitsPerPixel;
                } else {
                  missingBits = bitsPerPixel - bitsLeft;
                  n = buffer2 >>> bitPos & bitMask;
                  buffer2 = src[i++];
                  bitsLeft = 32 - missingBits;
                  n |= (buffer2 & (1 << missingBits) - 1) << bitsPerPixel - missingBits;
                  bitPos = missingBits;
                }
                dest[o] = n < nmax ? offset + n * scale : maxValue;
              }
            }
            return dest;
          }, "unstuff2"),
          unstuffLUT2: /* @__PURE__ */ __name(function(src, bitsPerPixel, numPixels, offset, scale, maxValue) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o = 0, missingBits = 0, bitsLeft = 0, n = 0, bitPos = 0;
            var buffer2;
            var dest = [];
            var nmax = Math.ceil((maxValue - offset) / scale);
            for (o = 0; o < numPixels; o++) {
              if (bitsLeft === 0) {
                buffer2 = src[i++];
                bitsLeft = 32;
                bitPos = 0;
              }
              if (bitsLeft >= bitsPerPixel) {
                n = buffer2 >>> bitPos & bitMask;
                bitsLeft -= bitsPerPixel;
                bitPos += bitsPerPixel;
              } else {
                missingBits = bitsPerPixel - bitsLeft;
                n = buffer2 >>> bitPos & bitMask;
                buffer2 = src[i++];
                bitsLeft = 32 - missingBits;
                n |= (buffer2 & (1 << missingBits) - 1) << bitsPerPixel - missingBits;
                bitPos = missingBits;
              }
              dest[o] = n < nmax ? offset + n * scale : maxValue;
            }
            dest.unshift(offset);
            return dest;
          }, "unstuffLUT2"),
          originalUnstuff: /* @__PURE__ */ __name(function(src, dest, bitsPerPixel, numPixels) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o;
            var bitsLeft = 0;
            var n, buffer2, missingBits;
            var numInvalidTailBytes = src.length * 4 - Math.ceil(bitsPerPixel * numPixels / 8);
            src[src.length - 1] <<= 8 * numInvalidTailBytes;
            for (o = 0; o < numPixels; o++) {
              if (bitsLeft === 0) {
                buffer2 = src[i++];
                bitsLeft = 32;
              }
              if (bitsLeft >= bitsPerPixel) {
                n = buffer2 >>> bitsLeft - bitsPerPixel & bitMask;
                bitsLeft -= bitsPerPixel;
              } else {
                missingBits = bitsPerPixel - bitsLeft;
                n = (buffer2 & bitMask) << missingBits & bitMask;
                buffer2 = src[i++];
                bitsLeft = 32 - missingBits;
                n += buffer2 >>> bitsLeft;
              }
              dest[o] = n;
            }
            return dest;
          }, "originalUnstuff"),
          originalUnstuff2: /* @__PURE__ */ __name(function(src, dest, bitsPerPixel, numPixels) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o;
            var bitsLeft = 0, bitPos = 0;
            var n, buffer2, missingBits;
            for (o = 0; o < numPixels; o++) {
              if (bitsLeft === 0) {
                buffer2 = src[i++];
                bitsLeft = 32;
                bitPos = 0;
              }
              if (bitsLeft >= bitsPerPixel) {
                n = buffer2 >>> bitPos & bitMask;
                bitsLeft -= bitsPerPixel;
                bitPos += bitsPerPixel;
              } else {
                missingBits = bitsPerPixel - bitsLeft;
                n = buffer2 >>> bitPos & bitMask;
                buffer2 = src[i++];
                bitsLeft = 32 - missingBits;
                n |= (buffer2 & (1 << missingBits) - 1) << bitsPerPixel - missingBits;
                bitPos = missingBits;
              }
              dest[o] = n;
            }
            return dest;
          }, "originalUnstuff2")
        };
        var Lerc2Helpers = {
          HUFFMAN_LUT_BITS_MAX: 12,
          //use 2^12 lut, treat it like constant
          computeChecksumFletcher32: /* @__PURE__ */ __name(function(input) {
            var sum1 = 65535, sum2 = 65535;
            var len = input.length;
            var words = Math.floor(len / 2);
            var i = 0;
            while (words) {
              var tlen = words >= 359 ? 359 : words;
              words -= tlen;
              do {
                sum1 += input[i++] << 8;
                sum2 += sum1 += input[i++];
              } while (--tlen);
              sum1 = (sum1 & 65535) + (sum1 >>> 16);
              sum2 = (sum2 & 65535) + (sum2 >>> 16);
            }
            if (len & 1) {
              sum2 += sum1 += input[i] << 8;
            }
            sum1 = (sum1 & 65535) + (sum1 >>> 16);
            sum2 = (sum2 & 65535) + (sum2 >>> 16);
            return (sum2 << 16 | sum1) >>> 0;
          }, "computeChecksumFletcher32"),
          readHeaderInfo: /* @__PURE__ */ __name(function(input, data) {
            var ptr = data.ptr;
            var fileIdView = new Uint8Array(input, ptr, 6);
            var headerInfo = {};
            headerInfo.fileIdentifierString = String.fromCharCode.apply(null, fileIdView);
            if (headerInfo.fileIdentifierString.lastIndexOf("Lerc2", 0) !== 0) {
              throw "Unexpected file identifier string (expect Lerc2 ): " + headerInfo.fileIdentifierString;
            }
            ptr += 6;
            var view = new DataView(input, ptr, 8);
            var fileVersion = view.getInt32(0, true);
            headerInfo.fileVersion = fileVersion;
            ptr += 4;
            if (fileVersion >= 3) {
              headerInfo.checksum = view.getUint32(4, true);
              ptr += 4;
            }
            view = new DataView(input, ptr, 12);
            headerInfo.height = view.getUint32(0, true);
            headerInfo.width = view.getUint32(4, true);
            ptr += 8;
            if (fileVersion >= 4) {
              headerInfo.numDims = view.getUint32(8, true);
              ptr += 4;
            } else {
              headerInfo.numDims = 1;
            }
            view = new DataView(input, ptr, 40);
            headerInfo.numValidPixel = view.getUint32(0, true);
            headerInfo.microBlockSize = view.getInt32(4, true);
            headerInfo.blobSize = view.getInt32(8, true);
            headerInfo.imageType = view.getInt32(12, true);
            headerInfo.maxZError = view.getFloat64(16, true);
            headerInfo.zMin = view.getFloat64(24, true);
            headerInfo.zMax = view.getFloat64(32, true);
            ptr += 40;
            data.headerInfo = headerInfo;
            data.ptr = ptr;
            var checksum, keyLength;
            if (fileVersion >= 3) {
              keyLength = fileVersion >= 4 ? 52 : 48;
              checksum = this.computeChecksumFletcher32(new Uint8Array(input, ptr - keyLength, headerInfo.blobSize - 14));
              if (checksum !== headerInfo.checksum) {
                throw "Checksum failed.";
              }
            }
            return true;
          }, "readHeaderInfo"),
          checkMinMaxRanges: /* @__PURE__ */ __name(function(input, data) {
            var headerInfo = data.headerInfo;
            var OutPixelTypeArray = this.getDataTypeArray(headerInfo.imageType);
            var rangeBytes = headerInfo.numDims * this.getDataTypeSize(headerInfo.imageType);
            var minValues = this.readSubArray(input, data.ptr, OutPixelTypeArray, rangeBytes);
            var maxValues = this.readSubArray(input, data.ptr + rangeBytes, OutPixelTypeArray, rangeBytes);
            data.ptr += 2 * rangeBytes;
            var i, equal = true;
            for (i = 0; i < headerInfo.numDims; i++) {
              if (minValues[i] !== maxValues[i]) {
                equal = false;
                break;
              }
            }
            headerInfo.minValues = minValues;
            headerInfo.maxValues = maxValues;
            return equal;
          }, "checkMinMaxRanges"),
          readSubArray: /* @__PURE__ */ __name(function(input, ptr, OutPixelTypeArray, numBytes) {
            var rawData;
            if (OutPixelTypeArray === Uint8Array) {
              rawData = new Uint8Array(input, ptr, numBytes);
            } else {
              var arrayBuf = new ArrayBuffer(numBytes);
              var store8 = new Uint8Array(arrayBuf);
              store8.set(new Uint8Array(input, ptr, numBytes));
              rawData = new OutPixelTypeArray(arrayBuf);
            }
            return rawData;
          }, "readSubArray"),
          readMask: /* @__PURE__ */ __name(function(input, data) {
            var ptr = data.ptr;
            var headerInfo = data.headerInfo;
            var numPixels = headerInfo.width * headerInfo.height;
            var numValidPixel = headerInfo.numValidPixel;
            var view = new DataView(input, ptr, 4);
            var mask = {};
            mask.numBytes = view.getUint32(0, true);
            ptr += 4;
            if ((0 === numValidPixel || numPixels === numValidPixel) && 0 !== mask.numBytes) {
              throw "invalid mask";
            }
            var bitset, resultMask;
            if (numValidPixel === 0) {
              bitset = new Uint8Array(Math.ceil(numPixels / 8));
              mask.bitset = bitset;
              resultMask = new Uint8Array(numPixels);
              data.pixels.resultMask = resultMask;
              ptr += mask.numBytes;
            } else if (mask.numBytes > 0) {
              bitset = new Uint8Array(Math.ceil(numPixels / 8));
              view = new DataView(input, ptr, mask.numBytes);
              var cnt = view.getInt16(0, true);
              var ip = 2, op = 0, val = 0;
              do {
                if (cnt > 0) {
                  while (cnt--) {
                    bitset[op++] = view.getUint8(ip++);
                  }
                } else {
                  val = view.getUint8(ip++);
                  cnt = -cnt;
                  while (cnt--) {
                    bitset[op++] = val;
                  }
                }
                cnt = view.getInt16(ip, true);
                ip += 2;
              } while (ip < mask.numBytes);
              if (cnt !== -32768 || op < bitset.length) {
                throw "Unexpected end of mask RLE encoding";
              }
              resultMask = new Uint8Array(numPixels);
              var mb = 0, k = 0;
              for (k = 0; k < numPixels; k++) {
                if (k & 7) {
                  mb = bitset[k >> 3];
                  mb <<= k & 7;
                } else {
                  mb = bitset[k >> 3];
                }
                if (mb & 128) {
                  resultMask[k] = 1;
                }
              }
              data.pixels.resultMask = resultMask;
              mask.bitset = bitset;
              ptr += mask.numBytes;
            }
            data.ptr = ptr;
            data.mask = mask;
            return true;
          }, "readMask"),
          readDataOneSweep: /* @__PURE__ */ __name(function(input, data, OutPixelTypeArray, useBSQForOutputDim) {
            var ptr = data.ptr;
            var headerInfo = data.headerInfo;
            var numDims = headerInfo.numDims;
            var numPixels = headerInfo.width * headerInfo.height;
            var imageType = headerInfo.imageType;
            var numBytes = headerInfo.numValidPixel * Lerc2Helpers.getDataTypeSize(imageType) * numDims;
            var rawData;
            var mask = data.pixels.resultMask;
            if (OutPixelTypeArray === Uint8Array) {
              rawData = new Uint8Array(input, ptr, numBytes);
            } else {
              var arrayBuf = new ArrayBuffer(numBytes);
              var store8 = new Uint8Array(arrayBuf);
              store8.set(new Uint8Array(input, ptr, numBytes));
              rawData = new OutPixelTypeArray(arrayBuf);
            }
            if (rawData.length === numPixels * numDims) {
              if (useBSQForOutputDim) {
                data.pixels.resultPixels = Lerc2Helpers.swapDimensionOrder(rawData, numPixels, numDims, OutPixelTypeArray, true);
              } else {
                data.pixels.resultPixels = rawData;
              }
            } else {
              data.pixels.resultPixels = new OutPixelTypeArray(numPixels * numDims);
              var z = 0, k = 0, i = 0, nStart = 0;
              if (numDims > 1) {
                if (useBSQForOutputDim) {
                  for (k = 0; k < numPixels; k++) {
                    if (mask[k]) {
                      nStart = k;
                      for (i = 0; i < numDims; i++, nStart += numPixels) {
                        data.pixels.resultPixels[nStart] = rawData[z++];
                      }
                    }
                  }
                } else {
                  for (k = 0; k < numPixels; k++) {
                    if (mask[k]) {
                      nStart = k * numDims;
                      for (i = 0; i < numDims; i++) {
                        data.pixels.resultPixels[nStart + i] = rawData[z++];
                      }
                    }
                  }
                }
              } else {
                for (k = 0; k < numPixels; k++) {
                  if (mask[k]) {
                    data.pixels.resultPixels[k] = rawData[z++];
                  }
                }
              }
            }
            ptr += numBytes;
            data.ptr = ptr;
            return true;
          }, "readDataOneSweep"),
          readHuffmanTree: /* @__PURE__ */ __name(function(input, data) {
            var BITS_MAX = this.HUFFMAN_LUT_BITS_MAX;
            var view = new DataView(input, data.ptr, 16);
            data.ptr += 16;
            var version = view.getInt32(0, true);
            if (version < 2) {
              throw "unsupported Huffman version";
            }
            var size = view.getInt32(4, true);
            var i0 = view.getInt32(8, true);
            var i1 = view.getInt32(12, true);
            if (i0 >= i1) {
              return false;
            }
            var blockDataBuffer = new Uint32Array(i1 - i0);
            Lerc2Helpers.decodeBits(input, data, blockDataBuffer);
            var codeTable = [];
            var i, j, k, len;
            for (i = i0; i < i1; i++) {
              j = i - (i < size ? 0 : size);
              codeTable[j] = { first: blockDataBuffer[i - i0], second: null };
            }
            var dataBytes = input.byteLength - data.ptr;
            var dataWords = Math.ceil(dataBytes / 4);
            var arrayBuf = new ArrayBuffer(dataWords * 4);
            var store8 = new Uint8Array(arrayBuf);
            store8.set(new Uint8Array(input, data.ptr, dataBytes));
            var stuffedData = new Uint32Array(arrayBuf);
            var bitPos = 0, word, srcPtr = 0;
            word = stuffedData[0];
            for (i = i0; i < i1; i++) {
              j = i - (i < size ? 0 : size);
              len = codeTable[j].first;
              if (len > 0) {
                codeTable[j].second = word << bitPos >>> 32 - len;
                if (32 - bitPos >= len) {
                  bitPos += len;
                  if (bitPos === 32) {
                    bitPos = 0;
                    srcPtr++;
                    word = stuffedData[srcPtr];
                  }
                } else {
                  bitPos += len - 32;
                  srcPtr++;
                  word = stuffedData[srcPtr];
                  codeTable[j].second |= word >>> 32 - bitPos;
                }
              }
            }
            var numBitsLUT = 0, numBitsLUTQick = 0;
            var tree = new TreeNode();
            for (i = 0; i < codeTable.length; i++) {
              if (codeTable[i] !== void 0) {
                numBitsLUT = Math.max(numBitsLUT, codeTable[i].first);
              }
            }
            if (numBitsLUT >= BITS_MAX) {
              numBitsLUTQick = BITS_MAX;
            } else {
              numBitsLUTQick = numBitsLUT;
            }
            var decodeLut = [], entry, code, numEntries, jj, currentBit, node;
            for (i = i0; i < i1; i++) {
              j = i - (i < size ? 0 : size);
              len = codeTable[j].first;
              if (len > 0) {
                entry = [len, j];
                if (len <= numBitsLUTQick) {
                  code = codeTable[j].second << numBitsLUTQick - len;
                  numEntries = 1 << numBitsLUTQick - len;
                  for (k = 0; k < numEntries; k++) {
                    decodeLut[code | k] = entry;
                  }
                } else {
                  code = codeTable[j].second;
                  node = tree;
                  for (jj = len - 1; jj >= 0; jj--) {
                    currentBit = code >>> jj & 1;
                    if (currentBit) {
                      if (!node.right) {
                        node.right = new TreeNode();
                      }
                      node = node.right;
                    } else {
                      if (!node.left) {
                        node.left = new TreeNode();
                      }
                      node = node.left;
                    }
                    if (jj === 0 && !node.val) {
                      node.val = entry[1];
                    }
                  }
                }
              }
            }
            return {
              decodeLut,
              numBitsLUTQick,
              numBitsLUT,
              tree,
              stuffedData,
              srcPtr,
              bitPos
            };
          }, "readHuffmanTree"),
          readHuffman: /* @__PURE__ */ __name(function(input, data, OutPixelTypeArray, useBSQForOutputDim) {
            var headerInfo = data.headerInfo;
            var numDims = headerInfo.numDims;
            var height = data.headerInfo.height;
            var width = data.headerInfo.width;
            var numPixels = width * height;
            var huffmanInfo = this.readHuffmanTree(input, data);
            var decodeLut = huffmanInfo.decodeLut;
            var tree = huffmanInfo.tree;
            var stuffedData = huffmanInfo.stuffedData;
            var srcPtr = huffmanInfo.srcPtr;
            var bitPos = huffmanInfo.bitPos;
            var numBitsLUTQick = huffmanInfo.numBitsLUTQick;
            var numBitsLUT = huffmanInfo.numBitsLUT;
            var offset = data.headerInfo.imageType === 0 ? 128 : 0;
            var node, val, delta, mask = data.pixels.resultMask, valTmp, valTmpQuick, currentBit;
            var i, j, k, ii;
            var prevVal = 0;
            if (bitPos > 0) {
              srcPtr++;
              bitPos = 0;
            }
            var word = stuffedData[srcPtr];
            var deltaEncode = data.encodeMode === 1;
            var resultPixelsAllDim = new OutPixelTypeArray(numPixels * numDims);
            var resultPixels = resultPixelsAllDim;
            var iDim;
            if (numDims < 2 || deltaEncode) {
              for (iDim = 0; iDim < numDims; iDim++) {
                if (numDims > 1) {
                  resultPixels = new OutPixelTypeArray(resultPixelsAllDim.buffer, numPixels * iDim, numPixels);
                  prevVal = 0;
                }
                if (data.headerInfo.numValidPixel === width * height) {
                  for (k = 0, i = 0; i < height; i++) {
                    for (j = 0; j < width; j++, k++) {
                      val = 0;
                      valTmp = word << bitPos >>> 32 - numBitsLUTQick;
                      valTmpQuick = valTmp;
                      if (32 - bitPos < numBitsLUTQick) {
                        valTmp |= stuffedData[srcPtr + 1] >>> 64 - bitPos - numBitsLUTQick;
                        valTmpQuick = valTmp;
                      }
                      if (decodeLut[valTmpQuick]) {
                        val = decodeLut[valTmpQuick][1];
                        bitPos += decodeLut[valTmpQuick][0];
                      } else {
                        valTmp = word << bitPos >>> 32 - numBitsLUT;
                        valTmpQuick = valTmp;
                        if (32 - bitPos < numBitsLUT) {
                          valTmp |= stuffedData[srcPtr + 1] >>> 64 - bitPos - numBitsLUT;
                          valTmpQuick = valTmp;
                        }
                        node = tree;
                        for (ii = 0; ii < numBitsLUT; ii++) {
                          currentBit = valTmp >>> numBitsLUT - ii - 1 & 1;
                          node = currentBit ? node.right : node.left;
                          if (!(node.left || node.right)) {
                            val = node.val;
                            bitPos = bitPos + ii + 1;
                            break;
                          }
                        }
                      }
                      if (bitPos >= 32) {
                        bitPos -= 32;
                        srcPtr++;
                        word = stuffedData[srcPtr];
                      }
                      delta = val - offset;
                      if (deltaEncode) {
                        if (j > 0) {
                          delta += prevVal;
                        } else if (i > 0) {
                          delta += resultPixels[k - width];
                        } else {
                          delta += prevVal;
                        }
                        delta &= 255;
                        resultPixels[k] = delta;
                        prevVal = delta;
                      } else {
                        resultPixels[k] = delta;
                      }
                    }
                  }
                } else {
                  for (k = 0, i = 0; i < height; i++) {
                    for (j = 0; j < width; j++, k++) {
                      if (mask[k]) {
                        val = 0;
                        valTmp = word << bitPos >>> 32 - numBitsLUTQick;
                        valTmpQuick = valTmp;
                        if (32 - bitPos < numBitsLUTQick) {
                          valTmp |= stuffedData[srcPtr + 1] >>> 64 - bitPos - numBitsLUTQick;
                          valTmpQuick = valTmp;
                        }
                        if (decodeLut[valTmpQuick]) {
                          val = decodeLut[valTmpQuick][1];
                          bitPos += decodeLut[valTmpQuick][0];
                        } else {
                          valTmp = word << bitPos >>> 32 - numBitsLUT;
                          valTmpQuick = valTmp;
                          if (32 - bitPos < numBitsLUT) {
                            valTmp |= stuffedData[srcPtr + 1] >>> 64 - bitPos - numBitsLUT;
                            valTmpQuick = valTmp;
                          }
                          node = tree;
                          for (ii = 0; ii < numBitsLUT; ii++) {
                            currentBit = valTmp >>> numBitsLUT - ii - 1 & 1;
                            node = currentBit ? node.right : node.left;
                            if (!(node.left || node.right)) {
                              val = node.val;
                              bitPos = bitPos + ii + 1;
                              break;
                            }
                          }
                        }
                        if (bitPos >= 32) {
                          bitPos -= 32;
                          srcPtr++;
                          word = stuffedData[srcPtr];
                        }
                        delta = val - offset;
                        if (deltaEncode) {
                          if (j > 0 && mask[k - 1]) {
                            delta += prevVal;
                          } else if (i > 0 && mask[k - width]) {
                            delta += resultPixels[k - width];
                          } else {
                            delta += prevVal;
                          }
                          delta &= 255;
                          resultPixels[k] = delta;
                          prevVal = delta;
                        } else {
                          resultPixels[k] = delta;
                        }
                      }
                    }
                  }
                }
              }
            } else {
              for (k = 0, i = 0; i < height; i++) {
                for (j = 0; j < width; j++) {
                  k = i * width + j;
                  if (!mask || mask[k]) {
                    for (iDim = 0; iDim < numDims; iDim++, k += numPixels) {
                      val = 0;
                      valTmp = word << bitPos >>> 32 - numBitsLUTQick;
                      valTmpQuick = valTmp;
                      if (32 - bitPos < numBitsLUTQick) {
                        valTmp |= stuffedData[srcPtr + 1] >>> 64 - bitPos - numBitsLUTQick;
                        valTmpQuick = valTmp;
                      }
                      if (decodeLut[valTmpQuick]) {
                        val = decodeLut[valTmpQuick][1];
                        bitPos += decodeLut[valTmpQuick][0];
                      } else {
                        valTmp = word << bitPos >>> 32 - numBitsLUT;
                        valTmpQuick = valTmp;
                        if (32 - bitPos < numBitsLUT) {
                          valTmp |= stuffedData[srcPtr + 1] >>> 64 - bitPos - numBitsLUT;
                          valTmpQuick = valTmp;
                        }
                        node = tree;
                        for (ii = 0; ii < numBitsLUT; ii++) {
                          currentBit = valTmp >>> numBitsLUT - ii - 1 & 1;
                          node = currentBit ? node.right : node.left;
                          if (!(node.left || node.right)) {
                            val = node.val;
                            bitPos = bitPos + ii + 1;
                            break;
                          }
                        }
                      }
                      if (bitPos >= 32) {
                        bitPos -= 32;
                        srcPtr++;
                        word = stuffedData[srcPtr];
                      }
                      delta = val - offset;
                      resultPixels[k] = delta;
                    }
                  }
                }
              }
            }
            data.ptr = data.ptr + (srcPtr + 1) * 4 + (bitPos > 0 ? 4 : 0);
            data.pixels.resultPixels = resultPixelsAllDim;
            if (numDims > 1 && !useBSQForOutputDim) {
              data.pixels.resultPixels = Lerc2Helpers.swapDimensionOrder(resultPixelsAllDim, numPixels, numDims, OutPixelTypeArray);
            }
          }, "readHuffman"),
          decodeBits: /* @__PURE__ */ __name(function(input, data, blockDataBuffer, offset, iDim) {
            {
              var headerInfo = data.headerInfo;
              var fileVersion = headerInfo.fileVersion;
              var blockPtr = 0;
              var viewByteLength = input.byteLength - data.ptr >= 5 ? 5 : input.byteLength - data.ptr;
              var view = new DataView(input, data.ptr, viewByteLength);
              var headerByte = view.getUint8(0);
              blockPtr++;
              var bits67 = headerByte >> 6;
              var n = bits67 === 0 ? 4 : 3 - bits67;
              var doLut = (headerByte & 32) > 0 ? true : false;
              var numBits = headerByte & 31;
              var numElements = 0;
              if (n === 1) {
                numElements = view.getUint8(blockPtr);
                blockPtr++;
              } else if (n === 2) {
                numElements = view.getUint16(blockPtr, true);
                blockPtr += 2;
              } else if (n === 4) {
                numElements = view.getUint32(blockPtr, true);
                blockPtr += 4;
              } else {
                throw "Invalid valid pixel count type";
              }
              var scale = 2 * headerInfo.maxZError;
              var stuffedData, arrayBuf, store8, dataBytes, dataWords;
              var lutArr, lutData, lutBytes, lutBitsPerElement, bitsPerPixel;
              var zMax = headerInfo.numDims > 1 ? headerInfo.maxValues[iDim] : headerInfo.zMax;
              if (doLut) {
                data.counter.lut++;
                lutBytes = view.getUint8(blockPtr);
                lutBitsPerElement = numBits;
                blockPtr++;
                dataBytes = Math.ceil((lutBytes - 1) * numBits / 8);
                dataWords = Math.ceil(dataBytes / 4);
                arrayBuf = new ArrayBuffer(dataWords * 4);
                store8 = new Uint8Array(arrayBuf);
                data.ptr += blockPtr;
                store8.set(new Uint8Array(input, data.ptr, dataBytes));
                lutData = new Uint32Array(arrayBuf);
                data.ptr += dataBytes;
                bitsPerPixel = 0;
                while (lutBytes - 1 >>> bitsPerPixel) {
                  bitsPerPixel++;
                }
                dataBytes = Math.ceil(numElements * bitsPerPixel / 8);
                dataWords = Math.ceil(dataBytes / 4);
                arrayBuf = new ArrayBuffer(dataWords * 4);
                store8 = new Uint8Array(arrayBuf);
                store8.set(new Uint8Array(input, data.ptr, dataBytes));
                stuffedData = new Uint32Array(arrayBuf);
                data.ptr += dataBytes;
                if (fileVersion >= 3) {
                  lutArr = BitStuffer.unstuffLUT2(lutData, numBits, lutBytes - 1, offset, scale, zMax);
                } else {
                  lutArr = BitStuffer.unstuffLUT(lutData, numBits, lutBytes - 1, offset, scale, zMax);
                }
                if (fileVersion >= 3) {
                  BitStuffer.unstuff2(stuffedData, blockDataBuffer, bitsPerPixel, numElements, lutArr);
                } else {
                  BitStuffer.unstuff(stuffedData, blockDataBuffer, bitsPerPixel, numElements, lutArr);
                }
              } else {
                data.counter.bitstuffer++;
                bitsPerPixel = numBits;
                data.ptr += blockPtr;
                if (bitsPerPixel > 0) {
                  dataBytes = Math.ceil(numElements * bitsPerPixel / 8);
                  dataWords = Math.ceil(dataBytes / 4);
                  arrayBuf = new ArrayBuffer(dataWords * 4);
                  store8 = new Uint8Array(arrayBuf);
                  store8.set(new Uint8Array(input, data.ptr, dataBytes));
                  stuffedData = new Uint32Array(arrayBuf);
                  data.ptr += dataBytes;
                  if (fileVersion >= 3) {
                    if (offset == null) {
                      BitStuffer.originalUnstuff2(stuffedData, blockDataBuffer, bitsPerPixel, numElements);
                    } else {
                      BitStuffer.unstuff2(stuffedData, blockDataBuffer, bitsPerPixel, numElements, false, offset, scale, zMax);
                    }
                  } else {
                    if (offset == null) {
                      BitStuffer.originalUnstuff(stuffedData, blockDataBuffer, bitsPerPixel, numElements);
                    } else {
                      BitStuffer.unstuff(stuffedData, blockDataBuffer, bitsPerPixel, numElements, false, offset, scale, zMax);
                    }
                  }
                }
              }
            }
          }, "decodeBits"),
          readTiles: /* @__PURE__ */ __name(function(input, data, OutPixelTypeArray, useBSQForOutputDim) {
            var headerInfo = data.headerInfo;
            var width = headerInfo.width;
            var height = headerInfo.height;
            var numPixels = width * height;
            var microBlockSize = headerInfo.microBlockSize;
            var imageType = headerInfo.imageType;
            var dataTypeSize = Lerc2Helpers.getDataTypeSize(imageType);
            var numBlocksX = Math.ceil(width / microBlockSize);
            var numBlocksY = Math.ceil(height / microBlockSize);
            data.pixels.numBlocksY = numBlocksY;
            data.pixels.numBlocksX = numBlocksX;
            data.pixels.ptr = 0;
            var row = 0, col = 0, blockY = 0, blockX = 0, thisBlockHeight = 0, thisBlockWidth = 0, bytesLeft = 0, headerByte = 0, bits67 = 0, testCode = 0, outPtr = 0, outStride = 0, numBytes = 0, bytesleft = 0, z = 0, blockPtr = 0;
            var view, block, arrayBuf, store8, rawData;
            var blockEncoding;
            var blockDataBuffer = new OutPixelTypeArray(microBlockSize * microBlockSize);
            var lastBlockHeight = height % microBlockSize || microBlockSize;
            var lastBlockWidth = width % microBlockSize || microBlockSize;
            var offsetType, offset;
            var numDims = headerInfo.numDims, iDim;
            var mask = data.pixels.resultMask;
            var resultPixels = data.pixels.resultPixels;
            var fileVersion = headerInfo.fileVersion;
            var fileVersionCheckNum = fileVersion >= 5 ? 14 : 15;
            var isDiffEncoding;
            var zMax = headerInfo.zMax;
            var resultPixelsPrevDim;
            for (blockY = 0; blockY < numBlocksY; blockY++) {
              thisBlockHeight = blockY !== numBlocksY - 1 ? microBlockSize : lastBlockHeight;
              for (blockX = 0; blockX < numBlocksX; blockX++) {
                thisBlockWidth = blockX !== numBlocksX - 1 ? microBlockSize : lastBlockWidth;
                outPtr = blockY * width * microBlockSize + blockX * microBlockSize;
                outStride = width - thisBlockWidth;
                for (iDim = 0; iDim < numDims; iDim++) {
                  if (numDims > 1) {
                    resultPixelsPrevDim = resultPixels;
                    outPtr = blockY * width * microBlockSize + blockX * microBlockSize;
                    resultPixels = new OutPixelTypeArray(data.pixels.resultPixels.buffer, numPixels * iDim * dataTypeSize, numPixels);
                    zMax = headerInfo.maxValues[iDim];
                  } else {
                    resultPixelsPrevDim = null;
                  }
                  bytesLeft = input.byteLength - data.ptr;
                  view = new DataView(input, data.ptr, Math.min(10, bytesLeft));
                  block = {};
                  blockPtr = 0;
                  headerByte = view.getUint8(0);
                  blockPtr++;
                  isDiffEncoding = headerInfo.fileVersion >= 5 ? headerByte & 4 : 0;
                  bits67 = headerByte >> 6 & 255;
                  testCode = headerByte >> 2 & fileVersionCheckNum;
                  if (testCode !== (blockX * microBlockSize >> 3 & fileVersionCheckNum)) {
                    throw "integrity issue";
                  }
                  if (isDiffEncoding && iDim === 0) {
                    throw "integrity issue";
                  }
                  blockEncoding = headerByte & 3;
                  if (blockEncoding > 3) {
                    data.ptr += blockPtr;
                    throw "Invalid block encoding (" + blockEncoding + ")";
                  } else if (blockEncoding === 2) {
                    if (isDiffEncoding) {
                      if (mask) {
                        for (row = 0; row < thisBlockHeight; row++) {
                          for (col = 0; col < thisBlockWidth; col++) {
                            if (mask[outPtr]) {
                              resultPixels[outPtr] = resultPixelsPrevDim[outPtr];
                            }
                            outPtr++;
                          }
                        }
                      } else {
                        for (row = 0; row < thisBlockHeight; row++) {
                          for (col = 0; col < thisBlockWidth; col++) {
                            resultPixels[outPtr] = resultPixelsPrevDim[outPtr];
                            outPtr++;
                          }
                        }
                      }
                    }
                    data.counter.constant++;
                    data.ptr += blockPtr;
                    continue;
                  } else if (blockEncoding === 0) {
                    if (isDiffEncoding) {
                      throw "integrity issue";
                    }
                    data.counter.uncompressed++;
                    data.ptr += blockPtr;
                    numBytes = thisBlockHeight * thisBlockWidth * dataTypeSize;
                    bytesleft = input.byteLength - data.ptr;
                    numBytes = numBytes < bytesleft ? numBytes : bytesleft;
                    arrayBuf = new ArrayBuffer(numBytes % dataTypeSize === 0 ? numBytes : numBytes + dataTypeSize - numBytes % dataTypeSize);
                    store8 = new Uint8Array(arrayBuf);
                    store8.set(new Uint8Array(input, data.ptr, numBytes));
                    rawData = new OutPixelTypeArray(arrayBuf);
                    z = 0;
                    if (mask) {
                      for (row = 0; row < thisBlockHeight; row++) {
                        for (col = 0; col < thisBlockWidth; col++) {
                          if (mask[outPtr]) {
                            resultPixels[outPtr] = rawData[z++];
                          }
                          outPtr++;
                        }
                        outPtr += outStride;
                      }
                    } else {
                      for (row = 0; row < thisBlockHeight; row++) {
                        for (col = 0; col < thisBlockWidth; col++) {
                          resultPixels[outPtr++] = rawData[z++];
                        }
                        outPtr += outStride;
                      }
                    }
                    data.ptr += z * dataTypeSize;
                  } else {
                    offsetType = Lerc2Helpers.getDataTypeUsed(isDiffEncoding && imageType < 6 ? 4 : imageType, bits67);
                    offset = Lerc2Helpers.getOnePixel(block, blockPtr, offsetType, view);
                    blockPtr += Lerc2Helpers.getDataTypeSize(offsetType);
                    if (blockEncoding === 3) {
                      data.ptr += blockPtr;
                      data.counter.constantoffset++;
                      if (mask) {
                        for (row = 0; row < thisBlockHeight; row++) {
                          for (col = 0; col < thisBlockWidth; col++) {
                            if (mask[outPtr]) {
                              resultPixels[outPtr] = isDiffEncoding ? Math.min(zMax, resultPixelsPrevDim[outPtr] + offset) : offset;
                            }
                            outPtr++;
                          }
                          outPtr += outStride;
                        }
                      } else {
                        for (row = 0; row < thisBlockHeight; row++) {
                          for (col = 0; col < thisBlockWidth; col++) {
                            resultPixels[outPtr] = isDiffEncoding ? Math.min(zMax, resultPixelsPrevDim[outPtr] + offset) : offset;
                            outPtr++;
                          }
                          outPtr += outStride;
                        }
                      }
                    } else {
                      data.ptr += blockPtr;
                      Lerc2Helpers.decodeBits(input, data, blockDataBuffer, offset, iDim);
                      blockPtr = 0;
                      if (isDiffEncoding) {
                        if (mask) {
                          for (row = 0; row < thisBlockHeight; row++) {
                            for (col = 0; col < thisBlockWidth; col++) {
                              if (mask[outPtr]) {
                                resultPixels[outPtr] = blockDataBuffer[blockPtr++] + resultPixelsPrevDim[outPtr];
                              }
                              outPtr++;
                            }
                            outPtr += outStride;
                          }
                        } else {
                          for (row = 0; row < thisBlockHeight; row++) {
                            for (col = 0; col < thisBlockWidth; col++) {
                              resultPixels[outPtr] = blockDataBuffer[blockPtr++] + resultPixelsPrevDim[outPtr];
                              outPtr++;
                            }
                            outPtr += outStride;
                          }
                        }
                      } else if (mask) {
                        for (row = 0; row < thisBlockHeight; row++) {
                          for (col = 0; col < thisBlockWidth; col++) {
                            if (mask[outPtr]) {
                              resultPixels[outPtr] = blockDataBuffer[blockPtr++];
                            }
                            outPtr++;
                          }
                          outPtr += outStride;
                        }
                      } else {
                        for (row = 0; row < thisBlockHeight; row++) {
                          for (col = 0; col < thisBlockWidth; col++) {
                            resultPixels[outPtr++] = blockDataBuffer[blockPtr++];
                          }
                          outPtr += outStride;
                        }
                      }
                    }
                  }
                }
              }
            }
            if (numDims > 1 && !useBSQForOutputDim) {
              data.pixels.resultPixels = Lerc2Helpers.swapDimensionOrder(data.pixels.resultPixels, numPixels, numDims, OutPixelTypeArray);
            }
          }, "readTiles"),
          /*****************
          *  private methods (helper methods)
          *****************/
          formatFileInfo: /* @__PURE__ */ __name(function(data) {
            return {
              "fileIdentifierString": data.headerInfo.fileIdentifierString,
              "fileVersion": data.headerInfo.fileVersion,
              "imageType": data.headerInfo.imageType,
              "height": data.headerInfo.height,
              "width": data.headerInfo.width,
              "numValidPixel": data.headerInfo.numValidPixel,
              "microBlockSize": data.headerInfo.microBlockSize,
              "blobSize": data.headerInfo.blobSize,
              "maxZError": data.headerInfo.maxZError,
              "pixelType": Lerc2Helpers.getPixelType(data.headerInfo.imageType),
              "eofOffset": data.eofOffset,
              "mask": data.mask ? {
                "numBytes": data.mask.numBytes
              } : null,
              "pixels": {
                "numBlocksX": data.pixels.numBlocksX,
                "numBlocksY": data.pixels.numBlocksY,
                //"numBytes": data.pixels.numBytes,
                "maxValue": data.headerInfo.zMax,
                "minValue": data.headerInfo.zMin,
                "noDataValue": data.noDataValue
              }
            };
          }, "formatFileInfo"),
          constructConstantSurface: /* @__PURE__ */ __name(function(data, useBSQForOutputDim) {
            var val = data.headerInfo.zMax;
            var valMin = data.headerInfo.zMin;
            var maxValues = data.headerInfo.maxValues;
            var numDims = data.headerInfo.numDims;
            var numPixels = data.headerInfo.height * data.headerInfo.width;
            var i = 0, k = 0, nStart = 0;
            var mask = data.pixels.resultMask;
            var resultPixels = data.pixels.resultPixels;
            if (mask) {
              if (numDims > 1) {
                if (useBSQForOutputDim) {
                  for (i = 0; i < numDims; i++) {
                    nStart = i * numPixels;
                    val = maxValues[i];
                    for (k = 0; k < numPixels; k++) {
                      if (mask[k]) {
                        resultPixels[nStart + k] = val;
                      }
                    }
                  }
                } else {
                  for (k = 0; k < numPixels; k++) {
                    if (mask[k]) {
                      nStart = k * numDims;
                      for (i = 0; i < numDims; i++) {
                        resultPixels[nStart + numDims] = maxValues[i];
                      }
                    }
                  }
                }
              } else {
                for (k = 0; k < numPixels; k++) {
                  if (mask[k]) {
                    resultPixels[k] = val;
                  }
                }
              }
            } else {
              if (numDims > 1 && valMin !== val) {
                if (useBSQForOutputDim) {
                  for (i = 0; i < numDims; i++) {
                    nStart = i * numPixels;
                    val = maxValues[i];
                    for (k = 0; k < numPixels; k++) {
                      resultPixels[nStart + k] = val;
                    }
                  }
                } else {
                  for (k = 0; k < numPixels; k++) {
                    nStart = k * numDims;
                    for (i = 0; i < numDims; i++) {
                      resultPixels[nStart + i] = maxValues[i];
                    }
                  }
                }
              } else {
                for (k = 0; k < numPixels * numDims; k++) {
                  resultPixels[k] = val;
                }
              }
            }
            return;
          }, "constructConstantSurface"),
          getDataTypeArray: /* @__PURE__ */ __name(function(t) {
            var tp;
            switch (t) {
              case 0:
                tp = Int8Array;
                break;
              case 1:
                tp = Uint8Array;
                break;
              case 2:
                tp = Int16Array;
                break;
              case 3:
                tp = Uint16Array;
                break;
              case 4:
                tp = Int32Array;
                break;
              case 5:
                tp = Uint32Array;
                break;
              case 6:
                tp = Float32Array;
                break;
              case 7:
                tp = Float64Array;
                break;
              default:
                tp = Float32Array;
            }
            return tp;
          }, "getDataTypeArray"),
          getPixelType: /* @__PURE__ */ __name(function(t) {
            var tp;
            switch (t) {
              case 0:
                tp = "S8";
                break;
              case 1:
                tp = "U8";
                break;
              case 2:
                tp = "S16";
                break;
              case 3:
                tp = "U16";
                break;
              case 4:
                tp = "S32";
                break;
              case 5:
                tp = "U32";
                break;
              case 6:
                tp = "F32";
                break;
              case 7:
                tp = "F64";
                break;
              default:
                tp = "F32";
            }
            return tp;
          }, "getPixelType"),
          isValidPixelValue: /* @__PURE__ */ __name(function(t, val) {
            if (val == null) {
              return false;
            }
            var isValid;
            switch (t) {
              case 0:
                isValid = val >= -128 && val <= 127;
                break;
              case 1:
                isValid = val >= 0 && val <= 255;
                break;
              case 2:
                isValid = val >= -32768 && val <= 32767;
                break;
              case 3:
                isValid = val >= 0 && val <= 65536;
                break;
              case 4:
                isValid = val >= -2147483648 && val <= 2147483647;
                break;
              case 5:
                isValid = val >= 0 && val <= 4294967296;
                break;
              case 6:
                isValid = val >= -34027999387901484e22 && val <= 34027999387901484e22;
                break;
              case 7:
                isValid = val >= -17976931348623157e292 && val <= 17976931348623157e292;
                break;
              default:
                isValid = false;
            }
            return isValid;
          }, "isValidPixelValue"),
          getDataTypeSize: /* @__PURE__ */ __name(function(t) {
            var s = 0;
            switch (t) {
              case 0:
              //ubyte
              case 1:
                s = 1;
                break;
              case 2:
              //short
              case 3:
                s = 2;
                break;
              case 4:
              case 5:
              case 6:
                s = 4;
                break;
              case 7:
                s = 8;
                break;
              default:
                s = t;
            }
            return s;
          }, "getDataTypeSize"),
          getDataTypeUsed: /* @__PURE__ */ __name(function(dt, tc) {
            var t = dt;
            switch (dt) {
              case 2:
              //short
              case 4:
                t = dt - tc;
                break;
              case 3:
              //ushort
              case 5:
                t = dt - 2 * tc;
                break;
              case 6:
                if (0 === tc) {
                  t = dt;
                } else if (1 === tc) {
                  t = 2;
                } else {
                  t = 1;
                }
                break;
              case 7:
                if (0 === tc) {
                  t = dt;
                } else {
                  t = dt - 2 * tc + 1;
                }
                break;
              default:
                t = dt;
                break;
            }
            return t;
          }, "getDataTypeUsed"),
          getOnePixel: /* @__PURE__ */ __name(function(block, blockPtr, offsetType, view) {
            var temp = 0;
            switch (offsetType) {
              case 0:
                temp = view.getInt8(blockPtr);
                break;
              case 1:
                temp = view.getUint8(blockPtr);
                break;
              case 2:
                temp = view.getInt16(blockPtr, true);
                break;
              case 3:
                temp = view.getUint16(blockPtr, true);
                break;
              case 4:
                temp = view.getInt32(blockPtr, true);
                break;
              case 5:
                temp = view.getUInt32(blockPtr, true);
                break;
              case 6:
                temp = view.getFloat32(blockPtr, true);
                break;
              case 7:
                temp = view.getFloat64(blockPtr, true);
                break;
              default:
                throw "the decoder does not understand this pixel type";
            }
            return temp;
          }, "getOnePixel"),
          swapDimensionOrder: /* @__PURE__ */ __name(function(pixels, numPixels, numDims, OutPixelTypeArray, inputIsBIP) {
            var i = 0, j = 0, iDim = 0, temp = 0, swap = pixels;
            if (numDims > 1) {
              swap = new OutPixelTypeArray(numPixels * numDims);
              if (inputIsBIP) {
                for (i = 0; i < numPixels; i++) {
                  temp = i;
                  for (iDim = 0; iDim < numDims; iDim++, temp += numPixels) {
                    swap[temp] = pixels[j++];
                  }
                }
              } else {
                for (i = 0; i < numPixels; i++) {
                  temp = i;
                  for (iDim = 0; iDim < numDims; iDim++, temp += numPixels) {
                    swap[j++] = pixels[temp];
                  }
                }
              }
            }
            return swap;
          }, "swapDimensionOrder")
        };
        var TreeNode = /* @__PURE__ */ __name(function(val, left, right) {
          this.val = val;
          this.left = left;
          this.right = right;
        }, "TreeNode");
        var Lerc2Decode2 = {
          /*
          * ********removed options compared to LERC1. We can bring some of them back if needed.
           * removed pixel type. LERC2 is typed and doesn't require user to give pixel type
           * changed encodedMaskData to maskData. LERC2 's js version make it faster to use maskData directly.
           * removed returnMask. mask is used by LERC2 internally and is cost free. In case of user input mask, it's returned as well and has neglible cost.
           * removed nodatavalue. Because LERC2 pixels are typed, nodatavalue will sacrify a useful value for many types (8bit, 16bit) etc,
           *       user has to be knowledgable enough about raster and their data to avoid usability issues. so nodata value is simply removed now.
           *       We can add it back later if their's a clear requirement.
           * removed encodedMask. This option was not implemented in LercDecode. It can be done after decoding (less efficient)
           * removed computeUsedBitDepths.
           *
           *
           * response changes compared to LERC1
           * 1. encodedMaskData is not available
           * 2. noDataValue is optional (returns only if user's noDataValue is with in the valid data type range)
           * 3. maskData is always available
          */
          /*****************
          *  public properties
          ******************/
          //HUFFMAN_LUT_BITS_MAX: 12, //use 2^12 lut, not configurable
          /*****************
          *  public methods
          *****************/
          /**
           * Decode a LERC2 byte stream and return an object containing the pixel data and optional metadata.
           *
           * @param {ArrayBuffer} input The LERC input byte stream
           * @param {object} [options] options Decoding options
           * @param {number} [options.inputOffset] The number of bytes to skip in the input byte stream. A valid LERC file is expected at that position
           * @param {boolean} [options.returnFileInfo] If true, the return value will have a fileInfo property that contains metadata obtained from the LERC headers and the decoding process
           * @param {boolean} [options.returnPixelInterleavedDims]  If true, returned dimensions are pixel-interleaved, a.k.a [p1_dim0, p1_dim1, p1_dimn, p2_dim0...], default is [p1_dim0, p2_dim0, ..., p1_dim1, p2_dim1...]
           */
          decode: /* @__PURE__ */ __name(function(input, options) {
            options = options || {};
            var noDataValue = options.noDataValue;
            var i = 0, data = {};
            data.ptr = options.inputOffset || 0;
            data.pixels = {};
            if (!Lerc2Helpers.readHeaderInfo(input, data)) {
              return;
            }
            var headerInfo = data.headerInfo;
            var fileVersion = headerInfo.fileVersion;
            var OutPixelTypeArray = Lerc2Helpers.getDataTypeArray(headerInfo.imageType);
            if (fileVersion > 5) {
              throw "unsupported lerc version 2." + fileVersion;
            }
            Lerc2Helpers.readMask(input, data);
            if (headerInfo.numValidPixel !== headerInfo.width * headerInfo.height && !data.pixels.resultMask) {
              data.pixels.resultMask = options.maskData;
            }
            var numPixels = headerInfo.width * headerInfo.height;
            data.pixels.resultPixels = new OutPixelTypeArray(numPixels * headerInfo.numDims);
            data.counter = {
              onesweep: 0,
              uncompressed: 0,
              lut: 0,
              bitstuffer: 0,
              constant: 0,
              constantoffset: 0
            };
            var useBSQForOutputDim = !options.returnPixelInterleavedDims;
            if (headerInfo.numValidPixel !== 0) {
              if (headerInfo.zMax === headerInfo.zMin) {
                Lerc2Helpers.constructConstantSurface(data, useBSQForOutputDim);
              } else if (fileVersion >= 4 && Lerc2Helpers.checkMinMaxRanges(input, data)) {
                Lerc2Helpers.constructConstantSurface(data, useBSQForOutputDim);
              } else {
                var view = new DataView(input, data.ptr, 2);
                var bReadDataOneSweep = view.getUint8(0);
                data.ptr++;
                if (bReadDataOneSweep) {
                  Lerc2Helpers.readDataOneSweep(input, data, OutPixelTypeArray, useBSQForOutputDim);
                } else {
                  if (fileVersion > 1 && headerInfo.imageType <= 1 && Math.abs(headerInfo.maxZError - 0.5) < 1e-5) {
                    var flagHuffman = view.getUint8(1);
                    data.ptr++;
                    data.encodeMode = flagHuffman;
                    if (flagHuffman > 2 || fileVersion < 4 && flagHuffman > 1) {
                      throw "Invalid Huffman flag " + flagHuffman;
                    }
                    if (flagHuffman) {
                      Lerc2Helpers.readHuffman(input, data, OutPixelTypeArray, useBSQForOutputDim);
                    } else {
                      Lerc2Helpers.readTiles(input, data, OutPixelTypeArray, useBSQForOutputDim);
                    }
                  } else {
                    Lerc2Helpers.readTiles(input, data, OutPixelTypeArray, useBSQForOutputDim);
                  }
                }
              }
            }
            data.eofOffset = data.ptr;
            var diff;
            if (options.inputOffset) {
              diff = data.headerInfo.blobSize + options.inputOffset - data.ptr;
              if (Math.abs(diff) >= 1) {
                data.eofOffset = options.inputOffset + data.headerInfo.blobSize;
              }
            } else {
              diff = data.headerInfo.blobSize - data.ptr;
              if (Math.abs(diff) >= 1) {
                data.eofOffset = data.headerInfo.blobSize;
              }
            }
            var result = {
              width: headerInfo.width,
              height: headerInfo.height,
              pixelData: data.pixels.resultPixels,
              minValue: headerInfo.zMin,
              maxValue: headerInfo.zMax,
              validPixelCount: headerInfo.numValidPixel,
              dimCount: headerInfo.numDims,
              dimStats: {
                minValues: headerInfo.minValues,
                maxValues: headerInfo.maxValues
              },
              maskData: data.pixels.resultMask
              //noDataValue: noDataValue
            };
            if (data.pixels.resultMask && Lerc2Helpers.isValidPixelValue(headerInfo.imageType, noDataValue)) {
              var mask = data.pixels.resultMask;
              for (i = 0; i < numPixels; i++) {
                if (!mask[i]) {
                  result.pixelData[i] = noDataValue;
                }
              }
              result.noDataValue = noDataValue;
            }
            data.noDataValue = noDataValue;
            if (options.returnFileInfo) {
              result.fileInfo = Lerc2Helpers.formatFileInfo(data);
            }
            return result;
          }, "decode"),
          getBandCount: /* @__PURE__ */ __name(function(input) {
            var count = 0;
            var i = 0;
            var temp = {};
            temp.ptr = 0;
            temp.pixels = {};
            while (i < input.byteLength - 58) {
              Lerc2Helpers.readHeaderInfo(input, temp);
              i += temp.headerInfo.blobSize;
              count++;
              temp.ptr = i;
            }
            return count;
          }, "getBandCount")
        };
        return Lerc2Decode2;
      })();
      var isPlatformLittleEndian = (function() {
        var a = new ArrayBuffer(4);
        var b = new Uint8Array(a);
        var c = new Uint32Array(a);
        c[0] = 1;
        return b[0] === 1;
      })();
      var Lerc2 = {
        /************wrapper**********************************************/
        /**
         * A wrapper for decoding both LERC1 and LERC2 byte streams capable of handling multiband pixel blocks for various pixel types.
         *
         * @alias module:Lerc
         * @param {ArrayBuffer} input The LERC input byte stream
         * @param {object} [options] The decoding options below are optional.
         * @param {number} [options.inputOffset] The number of bytes to skip in the input byte stream. A valid Lerc file is expected at that position.
         * @param {string} [options.pixelType] (LERC1 only) Default value is F32. Valid pixel types for input are U8/S8/S16/U16/S32/U32/F32.
         * @param {number} [options.noDataValue] (LERC1 only). It is recommended to use the returned mask instead of setting this value.
         * @param {boolean} [options.returnPixelInterleavedDims] (nDim LERC2 only) If true, returned dimensions are pixel-interleaved, a.k.a [p1_dim0, p1_dim1, p1_dimn, p2_dim0...], default is [p1_dim0, p2_dim0, ..., p1_dim1, p2_dim1...]
         * @returns {{width, height, pixels, pixelType, mask, statistics}}
           * @property {number} width Width of decoded image.
           * @property {number} height Height of decoded image.
           * @property {array} pixels [band1, band2, …] Each band is a typed array of width*height.
           * @property {string} pixelType The type of pixels represented in the output.
           * @property {mask} mask Typed array with a size of width*height, or null if all pixels are valid.
           * @property {array} statistics [statistics_band1, statistics_band2, …] Each element is a statistics object representing min and max values
        **/
        decode: /* @__PURE__ */ __name(function(encodedData, options) {
          if (!isPlatformLittleEndian) {
            throw "Big endian system is not supported.";
          }
          options = options || {};
          var inputOffset = options.inputOffset || 0;
          var fileIdView = new Uint8Array(encodedData, inputOffset, 10);
          var fileIdentifierString = String.fromCharCode.apply(null, fileIdView);
          var lerc, majorVersion;
          if (fileIdentifierString.trim() === "CntZImage") {
            lerc = LercDecode;
            majorVersion = 1;
          } else if (fileIdentifierString.substring(0, 5) === "Lerc2") {
            lerc = Lerc2Decode;
            majorVersion = 2;
          } else {
            throw "Unexpected file identifier string: " + fileIdentifierString;
          }
          var iPlane = 0, eof = encodedData.byteLength - 10, encodedMaskData, bandMasks = [], bandMask, maskData;
          var decodedPixelBlock = {
            width: 0,
            height: 0,
            pixels: [],
            pixelType: options.pixelType,
            mask: null,
            statistics: []
          };
          var uniqueBandMaskCount = 0;
          while (inputOffset < eof) {
            var result = lerc.decode(encodedData, {
              inputOffset,
              //for both lerc1 and lerc2
              encodedMaskData,
              //lerc1 only
              maskData,
              //lerc2 only
              returnMask: iPlane === 0 ? true : false,
              //lerc1 only
              returnEncodedMask: iPlane === 0 ? true : false,
              //lerc1 only
              returnFileInfo: true,
              //for both lerc1 and lerc2
              returnPixelInterleavedDims: options.returnPixelInterleavedDims,
              //for ndim lerc2 only
              pixelType: options.pixelType || null,
              //lerc1 only
              noDataValue: options.noDataValue || null
              //lerc1 only
            });
            inputOffset = result.fileInfo.eofOffset;
            maskData = result.maskData;
            if (iPlane === 0) {
              encodedMaskData = result.encodedMaskData;
              decodedPixelBlock.width = result.width;
              decodedPixelBlock.height = result.height;
              decodedPixelBlock.dimCount = result.dimCount || 1;
              decodedPixelBlock.pixelType = result.pixelType || result.fileInfo.pixelType;
              decodedPixelBlock.mask = maskData;
            }
            if (majorVersion > 1) {
              if (maskData) {
                bandMasks.push(maskData);
              }
              if (result.fileInfo.mask && result.fileInfo.mask.numBytes > 0) {
                uniqueBandMaskCount++;
              }
            }
            iPlane++;
            decodedPixelBlock.pixels.push(result.pixelData);
            decodedPixelBlock.statistics.push({
              minValue: result.minValue,
              maxValue: result.maxValue,
              noDataValue: result.noDataValue,
              dimStats: result.dimStats
            });
          }
          var i, j, numPixels;
          if (majorVersion > 1 && uniqueBandMaskCount > 1) {
            numPixels = decodedPixelBlock.width * decodedPixelBlock.height;
            decodedPixelBlock.bandMasks = bandMasks;
            maskData = new Uint8Array(numPixels);
            maskData.set(bandMasks[0]);
            for (i = 1; i < bandMasks.length; i++) {
              bandMask = bandMasks[i];
              for (j = 0; j < numPixels; j++) {
                maskData[j] = maskData[j] & bandMask[j];
              }
            }
            decodedPixelBlock.maskData = maskData;
          }
          return decodedPixelBlock;
        }, "decode")
      };
      if (typeof define === "function" && define.amd) {
        define([], function() {
          return Lerc2;
        });
      } else if (typeof module !== "undefined" && module.exports) {
        module.exports = Lerc2;
      } else {
        this.Lerc = Lerc2;
      }
    })();
  }
});

// node_modules/zstddec/dist/zstddec.modern.js
var init, instance, heap, IMPORT_OBJECT, ZSTDDecoder, wasm;
var init_zstddec_modern = __esm({
  "node_modules/zstddec/dist/zstddec.modern.js"() {
    IMPORT_OBJECT = {
      env: {
        emscripten_notify_memory_growth: /* @__PURE__ */ __name((_) => {
          heap = new Uint8Array(instance.exports.memory.buffer);
        }, "emscripten_notify_memory_growth")
      }
    };
    ZSTDDecoder = class {
      static {
        __name(this, "ZSTDDecoder");
      }
      init() {
        if (init) return init;
        if (typeof fetch !== "undefined") {
          init = fetch(`data:application/wasm;base64,${wasm}`).then((response) => response.arrayBuffer()).then((arrayBuffer) => WebAssembly.instantiate(arrayBuffer, IMPORT_OBJECT)).then(this._init);
        } else {
          init = WebAssembly.instantiate(Buffer.from(wasm, "base64"), IMPORT_OBJECT).then(this._init);
        }
        return init;
      }
      _init(result) {
        instance = result.instance;
        IMPORT_OBJECT.env.emscripten_notify_memory_growth(0);
      }
      decode(array, uncompressedSize = 0) {
        if (!instance) throw new Error("ZSTDDecoder: Await .init() before decoding.");
        const compressedSize = array.byteLength;
        const compressedPtr = instance.exports.malloc(compressedSize);
        heap.set(array, compressedPtr);
        uncompressedSize = uncompressedSize || Number(instance.exports.ZSTD_findDecompressedSize(compressedPtr, compressedSize));
        const uncompressedPtr = instance.exports.malloc(uncompressedSize);
        const actualSize = instance.exports.ZSTD_decompress(uncompressedPtr, uncompressedSize, compressedPtr, compressedSize);
        const dec = heap.slice(uncompressedPtr, uncompressedPtr + actualSize);
        instance.exports.free(compressedPtr);
        instance.exports.free(uncompressedPtr);
        return dec;
      }
    };
    wasm = "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AikACDcACCAHIDo3AAAgEUEZSA0BIARBGGohBANAIAIpABAhOiAEIAIpABg3AAggBCA6NwAAIAIpACAhOiAEIAIpACg3ABggBCA6NwAQIAJBIGohAiAEQSBqIgQgCkkNAAsMAQsCQAJAIAUoAswCIhEgBUHgAWogJUEHcUEMbGoiDygCACICaiIHIBxLDQAgCSAPKAIEIgogAmoiBmogG0sNACAGQSBqIBQgCWtNDQELIAUgDygCCDYCoAEgBSAPKQIANwOYASAJIBQgBUGYAWogBUHMAmogHCALIBcgIhAgIQYMAQsgAiAJaiEEIA8oAgghFSARKQAAITogCSARKQAINwAIIAkgOjcAAAJAIAJBEUkNACARKQAQITogCSARKQAYNwAYIAkgOjcAECACQRBrQRFIDQAgEUEQaiECIAlBIGohEgNAIAIpABAhOiASIAIpABg3AAggEiA6NwAAIAIpACAhOiASIAIpACg3ABggEiA6NwAQIAJBIGohAiASQSBqIhIgBEkNAAsLIAQgFWshAiAFIAc2AswCIAQgC2sgFUkEQCAVIAQgF2tLDQwgIiAiIAIgC2siD2oiByAKak8EQCAKRQ0CIAQgByAK/AoAAAwCC0EAIA9rIgIEQCAEIAcgAvwKAAALIAogD2ohCiAEIA9rIQQgCyECCyAVQRBPBEAgAikAACE6IAQgAikACDcACCAEIDo3AAAgCkERSA0BIAQgCmohByAEQRBqIQQDQCACKQAQITogBCACKQAYNwAIIAQgOjcAACACKQAgITogBCACKQAoNwAYIAQgOjcAECACQSBqIQIgBEEgaiIEIAdJDQALDAELAkAgFUEHTQRAIAQgAi0AADoAACAEIAItAAE6AAEgBCACLQACOgACIAQgAi0AAzoAAyAEIAIgFUECdCIHQeAaaigCAGoiAigAADYABCACIAdBgBtqKAIAayECDAELIAQgAikAADcAAAsgCkEJSQ0AIAQgCmohDyAEQQhqIgcgAkEIaiICa0EPTARAA0AgByACKQAANwAAIAJBCGohAiAHQQhqIgcgD0kNAAwCCwALIAIpAAAhOiAHIAIpAAg3AAggByA6NwAAIApBGUgNACAEQRhqIQQDQCACKQAQITogBCACKQAYNwAIIAQgOjcAACACKQAgITogBCACKQAoNwAYIAQgOjcAECACQSBqIQIgBEEgaiIEIA9JDQALCyAGQYh/SwRAIAYhAwwLCyAFQeABaiAlQQdxQQxsaiICIA02AgggAiAMNgIEIAIgEDYCAAsgBiAJaiEJICVBAWohJSAQIC1qIAxqIS0MAQsLIAUoArABIAUoArQBRw0HIAUoAqwBQSBHDQcgDiAoayEQA0ACQCAOIBBMBEBBACECA0AgAkEDRg0CIDIgAkECdCIDaiADICZqKAIANgIAIAJBAWohAgwACwALIAVB4AFqIBBBB3FBDGxqIQoCfwJAIAgoAoTsAUECRgRAIAUoAswCIg8gCigCACIEaiIHIAgoAoDsASICSwRAIAIgD0cEQCACIA9rIgIgFCAJa0sNCyAJIA8gAhAfIAogBCACayIENgIAIAIgCWohCQsgBSAWNgLMAiAIQQA2AoTsAQJAAkACQCAEQYCABEoNACAJIAooAgQiDSAEaiIGaiAbSw0AIAZBIGogFCAJa00NAQsgBSAKKAIINgJQIAUgCikCADcDSCAJIBQgBUHIAGogBUHMAmogGSALIBcgIhAgIQYMAQsgBCAWaiEHIAQgCWohDCAKKAIIIQogFikAACE6IAkgFikACDcACCAJIDo3AAACQCAEQRFJDQAgHikAACE6IAkgHikACDcAGCAJIDo3ABAgBEEQa0ERSA0AIAlBIGohAiAeIQQDQCAEKQAQITogAiAEKQAYNwAIIAIgOjcAACAEKQAgITogAiAEKQAoNwAYIAIgOjcAECAEQSBqIQQgAkEgaiICIAxJDQALCyAMIAprIQIgBSAHNgLMAiAMIAtrIApJBEAgCiAMIBdrSw0PICIgIiACIAtrIgdqIgQgDWpPBEAgDUUNAiAMIAQgDfwKAAAMAgtBACAHayICBEAgDCAEIAL8CgAACyAHIA1qIQ0gDCAHayEMIAshAgsgCkEQTwRAIAIpAAAhOiAMIAIpAAg3AAggDCA6NwAAIA1BEUgNASAMIA1qIQcgDEEQaiEEA0AgAikAECE6IAQgAikAGDcACCAEIDo3AAAgAikAICE6IAQgAikAKDcAGCAEIDo3ABAgAkEgaiECIARBIGoiBCAHSQ0ACwwBCwJAIApBB00EQCAMIAItAAA6AAAgDCACLQABOgABIAwgAi0AAjoAAiAMIAItAAM6AAMgDCACIApBAnQiBEHgGmooAgBqIgIoAAA2AAQgAiAEQYAbaigCAGshAgwBCyAMIAIpAAA3AAALIA1BCUkNACAMIA1qIQcgDEEIaiIEIAJBCGoiAmtBD0wEQANAIAQgAikAADcAACACQQhqIQIgBEEIaiIEIAdJDQAMAgsACyACKQAAITogBCACKQAINwAIIAQgOjcAACANQRlIDQAgDEEYaiEEA0AgAikAECE6IAQgAikAGDcACCAEIDo3AAAgAikAICE6IAQgAikAKDcAGCAEIDo3ABAgAkEgaiECIARBIGoiBCAHSQ0ACwsgBkGJf08EQCAGIQMMDgsgGSEcIAYgCWoMAwsgB0EgayECAkACQCAHIBxLDQAgCSAKKAIEIhIgBGoiDGogAksNACAMQSBqIBQgCWtNDQELIAUgCigCCDYCYCAFIAopAgA3A1ggCSAUIAIgBUHYAGogBUHMAmogHCALIBcgIhAhIQwMAgsgBCAJaiEGIAooAgghCiAPKQAAITogCSAPKQAINwAIIAkgOjcAAAJAIARBEUkNACAPKQAQITogCSAPKQAYNwAYIAkgOjcAECAEQRBrQRFIDQAgD0EQaiECIAlBIGohBANAIAIpABAhOiAEIAIpABg3AAggBCA6NwAAIAIpACAhOiAEIAIpACg3ABggBCA6NwAQIAJBIGohAiAEQSBqIgQgBkkNAAsLIAYgCmshAiAFIAc2AswCIAYgC2sgCkkEQCAKIAYgF2tLDQ0gIiAiIAIgC2siB2oiBCASak8EQCASRQ0DIAYgBCAS/AoAAAwDC0EAIAdrIgIEQCAGIAQgAvwKAAALIAcgEmohEiAGIAdrIQYgCyECCyAKQRBPBEAgAikAACE6IAYgAikACDcACCAGIDo3AAAgEkERSA0CIAYgEmohByAGQRBqIQQDQCACKQAQITogBCACKQAYNwAIIAQgOjcAACACKQAgITogBCACKQAoNwAYIAQgOjcAECACQSBqIQIgBEEgaiIEIAdJDQALDAILAkAgCkEHTQRAIAYgAi0AADoAACAGIAItAAE6AAEgBiACLQACOgACIAYgAi0AAzoAAyAGIAIgCkECdCIEQeAaaigCAGoiAigAADYABCACIARBgBtqKAIAayECDAELIAYgAikAADcAAAsgEkEJSQ0BIAYgEmohByAGQQhqIgQgAkEIaiICa0EPTARAA0AgBCACKQAANwAAIAJBCGohAiAE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";
  }
});

// node_modules/geotiff/dist-module/compression/lerc.js
var lerc_exports = {};
__export(lerc_exports, {
  default: () => LercDecoder,
  zstd: () => zstd
});
var import_lerc, zstd, LercDecoder;
var init_lerc = __esm({
  "node_modules/geotiff/dist-module/compression/lerc.js"() {
    init_pako_esm();
    import_lerc = __toESM(require_LercDecode(), 1);
    init_zstddec_modern();
    init_basedecoder();
    init_globals();
    zstd = new ZSTDDecoder();
    LercDecoder = class extends BaseDecoder {
      static {
        __name(this, "LercDecoder");
      }
      /**
       * @param {ArrayBufferLike} buffer
       * @returns {ArrayBufferLike}
       */
      decodeBlock(buffer2) {
        const params = (
          /** @type {LercDecoderParameters} */
          this.parameters
        );
        const addCompression = params.LercParameters?.[LercParameters.AddCompression];
        let decoded = buffer2;
        switch (addCompression) {
          case LercAddCompression.None:
            break;
          case LercAddCompression.Deflate:
            decoded = inflate_1(new Uint8Array(decoded)).buffer;
            break;
          case LercAddCompression.Zstandard:
            decoded = zstd.decode(new Uint8Array(decoded)).buffer;
            break;
          default:
            throw new Error(`Unsupported LERC additional compression method identifier: ${addCompression}`);
        }
        const lercResult = import_lerc.default.decode(decoded, { returnPixelInterleavedDims: this.parameters.planarConfiguration === 1 });
        const lercData = lercResult.pixels[0];
        return lercData.buffer;
      }
    };
  }
});

// node_modules/zstddec/dist/zstddec-stream.modern.js
var init2, instance2, heap2, heapView, IMPORT_OBJECT2, ZSTDDecoder2, wasm2;
var init_zstddec_stream_modern = __esm({
  "node_modules/zstddec/dist/zstddec-stream.modern.js"() {
    IMPORT_OBJECT2 = {
      env: {
        emscripten_notify_memory_growth: /* @__PURE__ */ __name((_) => {
          heap2 = new Uint8Array(instance2.exports.memory.buffer);
          heapView = new DataView(heap2.buffer);
        }, "emscripten_notify_memory_growth")
      }
    };
    ZSTDDecoder2 = class {
      static {
        __name(this, "ZSTDDecoder");
      }
      init() {
        if (init2) return init2;
        if (typeof fetch !== "undefined") {
          init2 = fetch(`data:application/wasm;base64,${wasm2}`).then((response) => response.arrayBuffer()).then((arrayBuffer) => WebAssembly.instantiate(arrayBuffer, IMPORT_OBJECT2)).then(this._init);
        } else {
          init2 = WebAssembly.instantiate(Buffer.from(wasm2, "base64"), IMPORT_OBJECT2).then(this._init);
        }
        return init2;
      }
      _init(result) {
        instance2 = result.instance;
        IMPORT_OBJECT2.env.emscripten_notify_memory_growth(0);
      }
      decode(array, uncompressedSize = 0) {
        if (!instance2) throw new Error("ZSTDDecoder: Await .init() before decoding.");
        const compressedSize = array.byteLength;
        const compressedPtr = instance2.exports.malloc(compressedSize);
        heap2.set(array, compressedPtr);
        if (uncompressedSize === 0) {
          uncompressedSize = Number(instance2.exports.ZSTD_findDecompressedSize(compressedPtr, compressedSize));
        }
        if (uncompressedSize === -1) {
          instance2.exports.free(compressedPtr);
          const parts = [];
          for (const out of this.decodeStreaming([array])) {
            parts.push(out);
          }
          if (parts.length === 1) {
            return parts[0];
          }
          const fullByteLength = parts.reduce((acc, arr) => acc + arr.byteLength, 0);
          const result = new Uint8Array(fullByteLength);
          let offset = 0;
          for (const part of parts) {
            result.set(part, offset);
            offset += part.byteLength;
          }
          return result;
        }
        const uncompressedPtr = instance2.exports.malloc(uncompressedSize);
        const actualSize = instance2.exports.ZSTD_decompress(uncompressedPtr, uncompressedSize, compressedPtr, compressedSize);
        const dec = heap2.slice(uncompressedPtr, uncompressedPtr + actualSize);
        instance2.exports.free(compressedPtr);
        instance2.exports.free(uncompressedPtr);
        return dec;
      }
      *decodeStreaming(arrays) {
        if (!instance2) throw new Error("ZSTDDecoder: Await .init() before decoding.");
        const buffInSize = instance2.exports.ZSTD_DStreamInSize();
        const buffIn = instance2.exports.malloc(buffInSize);
        const buffOutSize = instance2.exports.ZSTD_DStreamOutSize();
        const buffOut = instance2.exports.malloc(buffOutSize);
        const dctxPtr = instance2.exports.ZSTD_createDCtx();
        const sizeOfPointer = 4;
        const sizeOfSizeT = 4;
        const inputPtr = instance2.exports.malloc(sizeOfPointer + sizeOfSizeT * 2);
        const outputPtr = instance2.exports.malloc(sizeOfPointer + sizeOfSizeT * 2);
        let lastRet = 0;
        for (const array of arrays) {
          const compressedPtr = instance2.exports.malloc(array.byteLength);
          heap2.set(array, compressedPtr);
          heapView.setInt32(inputPtr, compressedPtr, true);
          heapView.setInt32(inputPtr + sizeOfPointer, array.byteLength, true);
          heapView.setInt32(inputPtr + sizeOfPointer + sizeOfSizeT, 0, true);
          while (heapView.getUint32(inputPtr + sizeOfPointer + sizeOfSizeT, true) < heapView.getUint32(inputPtr + sizeOfPointer, true)) {
            heapView.setInt32(outputPtr, buffOut, true);
            heapView.setInt32(outputPtr + sizeOfPointer, buffOutSize, true);
            heapView.setInt32(outputPtr + sizeOfPointer + sizeOfSizeT, 0, true);
            lastRet = instance2.exports.ZSTD_decompressStream(dctxPtr, outputPtr, inputPtr);
            const outputPos = heapView.getUint32(outputPtr + sizeOfPointer + sizeOfSizeT, true);
            yield heap2.slice(buffOut, buffOut + outputPos);
          }
          instance2.exports.free(compressedPtr);
        }
        instance2.exports.ZSTD_freeDCtx(dctxPtr);
        instance2.exports.free(buffIn);
        instance2.exports.free(buffOut);
        instance2.exports.free(inputPtr);
        instance2.exports.free(outputPtr);
        if (lastRet !== 0) {
          throw new Error("Incomplete stream, more data expected.");
        }
      }
    };
    wasm2 = "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QQhyIQBBACEDA0AgACADTQ0DIANBQGshAwwACwALQWwhCiAOIA5B/ABqIA5B+ABqIAUgBhAGIgJBiH9LDQEgDigCeCIDIARLDQEgACAOIA4oAnwgByAIIAMgDRAlIAEgADYCACACIQoMAQtBbCEKCyAOQYABaiQAIAoLcAEEfyAAQgA3AgAgAgRAIAFBCmohBiABKAIEIQRBACECQQAhAQNAIAEgBHZFBEAgAiAGIAFBA3RqLQAAIgUgAiAFSxshAiABQQFqIQEgAyAFQRZLaiEDDAELCyAAIAI2AgQgACADQQggBGt0NgIACwuuAQEEfyABIAIoAgQiAyABKAIEaiIENgIEIAAgA0ECdEGwGWooAgAgASgCAEEAIARrdnE2AgACQCAEQSFPBEAgAUGwGjYCCAwBCyABKAIIIgMgASgCEE8EQCABEAwMAQsgAyABKAIMIgVGDQAgASADIAMgBWsgBEEDdiIGIAMgBmsgBUkbIgNrIgU2AgggASAEIANBA3RrNgIEIAEgBSgAADYCAAsgACACQQhqNgIEC40CAgN/AX4gACACaiEEAkACQCACQQhOBEAgACABayICQXlIDQELA0AgACAETw0CIAAgAS0AADoAACAAQQFqIQAgAUEBaiEBDAALAAsCQAJAIAJBb0sNACAAIARBIGsiAksNACABKQAAIQYgACABKQAINwAIIAAgBjcAACACIABrIgVBEU4EQCAAQRBqIQAgASEDA0AgAykAECEGIAAgAykAGDcACCAAIAY3AAAgAykAICEGIAAgAykAKDcAGCAAIAY3ABAgA0EgaiEDIABBIGoiACACSQ0ACwsgASAFaiEBDAELIAAhAgsDQCACIARPDQEgAiABLQAAOgAAIAJBAWohAiABQQFqIQEMAAsACwvfAQEGf0G6fyEKAkAgAigCBCIIIAIoAgAiCWoiDSABIABrSw0AQWwhCiAJIAQgAygCACILa0sNACAAIAlqIgQgAigCCCIMayECIAAgAUEgayIBIAsgCUEAEDMgAyAJIAtqNgIAAkACQCAEIAVrIAxPBEAgAiEFDAELIAwgBCAGa0sNAiAHIAcgAiAFayIDaiICIAhqTwRAIAhFDQIgBCACIAj8CgAADAILQQAgA2siAARAIAQgAiAA/AoAAAsgAyAIaiEIIAQgA2shBAsgBCABIAUgCEEBEDMLIA0hCgsgCgvrAQEGf0G6fyELAkAgAygCBCIJIAMoAgAiCmoiDSABIABrSw0AIAUgBCgCACIFayAKSQRAQWwPCyADKAIIIQwgACAFSyAFIApqIg4gAEtxDQAgACAKaiIDIAxrIQEgACAFIAoQLyAEIA42AgACQAJAIAMgBmsgDE8EQCABIQYMAQtBbCELIAwgAyAHa0sNAiAIIAggASAGayIAaiIBIAlqTwRAIAlFDQIgAyABIAn8CgAADAILQQAgAGsiBARAIAMgASAE/AoAAAsgACAJaiEJIAMgAGshAwsgAyACIAYgCUEBEDMLIA0hCwsgCwurAgECfyACQR9xIQMgASEEA0AgA0EISUUEQCADQQhrIQMgBCkAAELP1tO+0ser2UJ+Qh+JQoeVr6+Ytt6bnn9+IACFQhuJQoeVr6+Ytt6bnn9+Qp2jteqDsY2K+gB9IQAgBEEIaiEEDAELCyABIAJBGHFqIQEgAkEHcSIDQQRJBH8gAQUgA0EEayEDIAE1AABCh5Wvr5i23puef34gAIVCF4lCz9bTvtLHq9lCfkL5893xmfaZqxZ8IQAgAUEEagshBANAIAMEQCADQQFrIQMgBDEAAELFz9my8eW66id+IACFQguJQoeVr6+Ytt6bnn9+IQAgBEEBaiEEDAELCyAAQiGIIACFQs/W077Sx6vZQn4iAEIdiCAAhUL5893xmfaZqxZ+IgBCIIggAIUL4QQCAX4CfyAAIANqIQcCQCADQQdMBEADQCAAIAdPDQIgACACLQAAOgAAIABBAWohACACQQFqIQIMAAsACyAEBEACQCAAIAJrIgZBB00EQCAAIAItAAA6AAAgACACLQABOgABIAAgAi0AAjoAAiAAIAItAAM6AAMgACACIAZBAnQiBkHgGmooAgBqIgIoAAA2AAQgAiAGQYAbaigCAGshAgwBCyAAIAIpAAA3AAALIANBCGshAyACQQhqIQIgAEEIaiEACyABIAdPBEAgACADaiEBIARFIAAgAmtBD0pyRQRAA0AgACACKQAANwAAIAJBCGohAiAAQQhqIgAgAUkNAAwDCwALIAIpAAAhBSAAIAIpAAg3AAggACAFNwAAIANBEUkNASAAQRBqIQADQCACKQAQIQUgACACKQAYNwAIIAAgBTcAACACKQAgIQUgACACKQAoNwAYIAAgBTcAECACQSBqIQIgAEEgaiIAIAFJDQALDAELAkAgACABSwRAIAAhAQwBCyABIABrIQYCQCAERSAAIAJrQQ9KckUEQCACIQMDQCAAIAMpAAA3AAAgA0EIaiEDIABBCGoiACABSQ0ACwwBCyACKQAAIQUgACACKQAINwAIIAAgBTcAACAGQRFIDQAgAEEQaiEAIAIhAwNAIAMpABAhBSAAIAMpABg3AAggACAFNwAAIAMpACAhBSAAIAMpACg3ABggACAFNwAQIANBIGohAyAAQSBqIgAgAUkNAAsLIAIgBmohAgsDQCABIAdPDQEgASACLQAAOgAAIAFBAWohASACQQFqIQIMAAsACwtOAQJ/IwBBEGsiBCQAIARBADYCCCAEQgA3AwACQCAEEBciBUUEQEFAIQMMAQsgBSAAIAEgAiADIAUQIRAiIQMgBRAZGgsgBEEQaiQAIAMLrwgCAn8BfiMAQRBrIgYkAAJAIAAgBBA2IARHBEBBuH8hBQwBCyAAIAEgAhAgIAAgACkD8OkBIAStfDcD8OkBQX8hBQJAAkACQAJAAkACQAJAAkAgACgChOoBDggAAQIDAwQFBggLAkAgACgC7OoBIgUNAEEAIQUgAygAAEFwcUHQ1LTCAUcNACAEBEAgAEGo7AVqIAMgBPwKAAALIABBBjYChOoBIABBCCAEazYCvOkBDAgLIAAgAyAEIAUQHCIFNgLo6gEgBUGIf0sNByAEBEAgAEGo7AVqIAMgBPwKAAALIABBATYChOoBIAAgBSAEazYCvOkBQQAhBQwHCyAAQajsBWohASAAKALo6gEhAiAEBEAgASACIARraiADIAT8CgAACyAAIAEgAhAmIgVBiH9LDQYgAEECNgKE6gEgAEEDNgK86QFBACEFDAYLIANBAyAGQQRqEB8iAUGIf0sEQCABIQUMBgtBbCEFIAEgACgC0OkBSw0FIAAgATYCvOkBIAAgBigCBDYCgOoBIAAgBigCDDYCjOsBIAYoAgghAiAAAn9BBEEDIAIbIAENABogAgRAIAAoAuDpAQRAIABBBDYCvOkBQQUMAgsgAEEANgK86QFBAAwBCyAAQQM2ArzpAUECCzYChOoBQQAhBQwFC0FsIQUCQAJAAkACQAJAAkACQCAAKAKA6gEOAwABAgsLIAIgBEkEQEG6fyEFDAsLAkAgAUUEQCAERQ0BQbZ/IQUMDAsgBARAIAEgAyAE/AoAAAsgBEGIf00NACAEIQUMCwsgACAAKAK86QEgBGsiAjYCvOkBIAQhBQwDCwJAIAIgACgCjOsBIgVJBH9Bun8FIAENASAFRQ0FQbZ/CyEFIABBADYCvOkBDAoLIAVFDQEgASADLQAAIAX8CwAMAQsgACABIAIgAyAEQQEQJyEFC0EAIQIgAEEANgK86QEgBUGIf0sNBwsgBSAAKALQ6QFNDQFBbCEFDAYLQQAhAiAAQQA2ArzpAUEAIQULIAAgACkD+OkBIAUiA618NwP46QEgACgC9OoBBEAgAEGQ6gFqIAEgAxAoIAAoArzpASECCyAAIAEgA2o2AqzpASACDQMgACgChOoBQQRGBEAgACkDwOkBIgdCf1IEQEFsIQUgACkD+OkBIAdSDQYLIAAoAuDpAQRAIABBBTYChOoBIABBBDYCvOkBDAULIABBADYChOoBIABBADYCvOkBDAQLIABBAzYCvOkBIABBAjYChOoBDAMLIAAoAvTqAUUNASADKAAAIABBkOoBahApp0YNAUFqIQUMAwsgBARAIAAgBGtBsOwFaiADIAT8CgAACyAAQQc2AoTqASAAIAAoAKzsBTYCvOkBQQAhBQwCC0EAIQUgAEEANgKE6gEgAEEANgK86QEMAQsgAyEFCyAGQRBqJAAgBQtGAQF/IAAoAoTqAUEDa0ECTwRAIAAoArzpAQ8LIAAoArzpASECIAAoAoDqAQR/IAIFQQEgASACIAEgAkkbIgAgAEEBTRsLCwYAQYOACAsGAEGAgAgLxBACGH8CfiMAQRBrIggkACACKAIIIQ4gAigCBCEPIAIoAgAhBCABKAIEIRAgCCABKAIAIgYgASgCCCITaiIYNgIMAkAgDiAPSwRAQbh/IQMMAQsCQCAQIBNJDQACQCAAKALs6wFBAUcNACAAKAK86wFFDQBBmH8hAyAAKALw6wEgBkcNAiAAKAL46wEgE0cNAiAAKAL06wEgEEcNAgsgBiAQaiEMIAQgD2ohCSAAQfDrAWohESAPIA5rIRUgAEGo7AVqIQogAEHA6QFqIQ0gAEHY6wFqIRQgAEGE6gFqIRYgAEGE6wFqIRcgAEGA6wFqIRkgBCAOaiISIQQDQAJAIAQhBgJ/AkAgBUEBcUUEQEF/IQMCQAJAAkAgDSAKAn8CQAJAIAAoArzrAQ4FAQADBAUMCyAAKALg6wEMAQsgAEEANgLI6wEgAEEBNgK86wEgFEIANwMIIBRCADcDACARIAEoAgg2AgggESABKQIANwIAQQALIAAoAuzqARAbIQQCQCAAKAKw6wFFDQAgACgCrOsBRQ0AIAAQKgsgBEGIf0sEQCAEIQMMCgsgBARAIAQgACgC4OsBIgNrIgUgCSAGayIHSwRAIAYgCUcEQCAHBEAgAyAKaiAGIAf8CgAACyAAIAMgB2oiAzYC4OsBCyACIAIoAgQ2AgggDSAKIAMgACgC7OoBEBsiA0GIf0sNC0ECQQYgACgC7OoBGyIBIAQgASAESxsgACgC4OsBa0EDaiEDDAsLIAUEQCADIApqIAYgBfwKAAALIAAgBDYC4OsBIAUgBmohBEEAIQUMCAsCQCANKQMAIhtCf1ENACAAKALU6QFBAUYNACAbIAwgCCgCDCIEayIDrVYNACASIBUgACgC7OoBEB4iBSAVSw0AIAAgBCADIBIgBSAAECEQIiIDQYh/Sw0KIAggAyAEakEAIAQbNgIMIABBADYCvOsBIABBADYCvOkBIAUgEmohBEEBIQUMCAsCQCAAKALs6wFBAUcNACAAKALU6QFBAUYNACANKQMAIhtCf1ENACAbIAwgCCgCDGutVg0JCyAAIAAQIRAjAn8CQCAAKALs6gENACAKKAAAQXBxQdDUtMIBRw0AIAAoAKzsBSEFQQcMAQsgACAKIAAoAuDrARAmIgNBiH9LDQpBAyEFQQILIQQgACAFNgK86QEgFiAENgIAIABCgAggACkDyOkBIhsgG0KACFgbIhs3A8jpASAANQLM6wEgG1QEQEFwIQMMCgsgACgC0OkBIQUgACgCuOsBIgQEQCAAIAUgBCAEIAVLGyIFNgLQ6QELQQAhB0EAIQMgACgC7OsBRQRAQXAgDSkDACIcIBsgBUKAgAggGyAbQoCACFobpyIEIAQgBUsbQQF0rXxCQH0iGyAbIBxWGyIbpyAbQoCAgIAQWhshAwsgACgC1OsBIgsgACgCxOsBIhpqQQQgBSAFQQRNGyIEIANqIgVBA2xPBEAgACgCvOwFQQFqIQcLIAAgBzYCvOwFIAQgGksgAyALS3JFIAdBgAFJcUUEQAJAAkAgACgCkOsBIgcEQCAFIAdBwOwFa00NAQwKCyAAKALA6wEgGSgCACAXKAIAEBUgAEEANgLU6wEgAEEANgLE6wEgACAFIAAoAvzqASAXKAIAEBgiBTYCwOsBIAVFDQkMAQsgACgCwOsBIQULIAAgAzYC1OsBIAAgBDYCxOsBIAAgBCAFajYC0OsBCyAAQQI2ArzrAQsgACAJIAZrIgQQNiIDRQRAIABBADYCvOsBQQEhBSAGIQQMBwsgAyAETQRAIAMgBmohBEEAIQUgACAIQQxqIAwgBiADEDoiA0GJf0kNBwwJC0EBIQUgBiAJIgRGDQYgAEEDNgK86wELIAAoArzpASILIAAoAsjrASIFayEDAkAgFigCAEEHRwRAIAAoAsTrASAFayADSQRAQWwhAwwKCyADIAkgBmsiBCADIARJGyIHRQ0EIAcEQCAAKALA6wEgBWogBiAH/AoAAAsgACgCyOsBIQUMAQsgAyAJIAZrIgQgAyAESRsiB0UNAwsgACAFIAdqNgLI6wEgBiAHagwDCyAMIAgoAgwiA2siByAAKALc6wEgACgC2OsBIgVrIgsgByALSRsiBARAIAQEQCADIAAoAtDrASAFaiAE/AoAAAsgACgC2OsBIQULIAggAyAEakEAIAMbNgIMIBQgBCAFaiIDNgIAQQEhBSAGIQQgByALSQ0EIABBAjYCvOsBQQAhBSAAKQPA6QEgACgC1OsBIgatWA0EIAAoAtDpASADaiAGTQ0EIABCADcD2OsBDAQLIAIgBiACKAIAazYCCCABIAgoAgwiBCABKAIAayIDNgIIIBEgAzYCCCARIAEpAgA3AgACQCAGIBJHIAQgGEdyRQRAIAAgACgC6OsBIgFBAWo2AujrASABQQ9IDQEgECATRgRAQbB/IQMMCAsgDiAPRw0BQa5/IQMMBwsgAEEANgLo6wELIAAoArzpASIBRQRAIAAoAuTrASEBAkACQCAAKALc6wEgACgC2OsBRgRAQQAhAyABRQ0JIAIoAggiASACKAIETwRAIABBAjYCvOsBDAILIAIgAUEBajYCCAwJCyABRQ0BC0EBIQMMBwsgAiACKAIIQQFrNgIIQQEhAyAAQQE2AuTrAQwGCyABIAAoAsjrAWtBA0EAIABBhOoBaigCAEEDRhtqIQMMBQtBACEHIAYLIQRBASEFIAMgB0sNAUEAIQUgAEEANgLI6wEgACAIQQxqIAwgACgCwOsBIAsQOiIDQYl/SQ0BDAMLC0FAIQMMAQtBun8hAwsgCEEQaiQAIAMLxwEBAn8gACgChOoBIgVBB0YhBgJAIAACfwJAIAAoAuzrAUUEQAJ/IAVBB0YEQCAAKALY6wEhAUEADAELIAAoAtTrASAAKALY6wEiAWsLIQIgACAAKALQ6wEgAWogAiADIAQQNSIEQYh/Sw0DIAQgBnJFDQEgACAAKALY6wEgBGo2AtzrAUEEDAILIAAgASgCACIFQQAgAiAFayAGGyADIAQQNSIEQYh/Sw0CIAEgASgCACAEajYCAAtBAgs2ArzrAUEAIQQLIAQLCgAgAARAEDwACwsDAAALC80SCgBBiAgLBQEAAAABAEGYCAvbBAEAAAABAAAAlgAAANgAAAB9AQAAdwAAAKoAAADNAAAAAgIAAHAAAACxAAAAxwAAABsCAABuAAAAxQAAAMIAAACEAgAAawAAAN0AAADAAAAA3wIAAGsAAAAAAQAAvQAAAHEDAABqAAAAZwEAALwAAACPBAAAbQAAAEYCAAC7AAAAIgYAAHIAAACwAgAAuwAAALAGAAB6AAAAOQMAALoAAACtBwAAiAAAANADAAC5AAAAUwgAAJYAAACcBAAAugAAABYIAACvAAAAYQUAALkAAADDBgAAygAAAIQFAAC5AAAAnwYAAMoAAAAAAAAAAQAAAAEAAAAFAAAADQAAAB0AAAA9AAAAfQAAAP0AAAD9AQAA/QMAAP0HAAD9DwAA/R8AAP0/AAD9fwAA/f8AAP3/AQD9/wMA/f8HAP3/DwD9/x8A/f8/AP3/fwD9//8A/f//Af3//wP9//8H/f//D/3//x/9//8//f//fwABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fAwAAAAQAAAAFAAAABgAAAAcAAAAIAAAACQAAAAoAAAALAAAADAAAAA0AAAAOAAAADwAAABAAAAARAAAAEgAAABMAAAAUAAAAFQAAABYAAAAXAAAAGAAAABkAAAAaAAAAGwAAABwAAAAdAAAAHgAAAB8AAAAgAAAAIQAAACIAAAAjAAAAJQAAACcAAAApAAAAKwAAAC8AAAAzAAAAOwAAAEMAAABTAAAAYwAAAIMAAAADAQAAAwIAAAMEAAADCAAAAxAAAAMgAAADQAAAA4AAAAMAAQBBoA0LFQEBAQECAgMDBAQFBwgJCgsMDQ4PEABBxA0LiwEBAAAAAgAAAAMAAAAEAAAABQAAAAYAAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAAAQAAAAEgAAABQAAAAWAAAAGAAAABwAAAAgAAAAKAAAADAAAABAAAAAgAAAAAABAAAAAgAAAAQAAAAIAAAAEAAAACAAAABAAAAAgAAAAAABAEHgDgumBAEBAQECAgMDBAYHCAkKCwwNDg8QAQAAAAQAAAAIAAAAAQABAQYAAAAAAAAEAAAAABAAAAQAAAAAIAAABQEAAAAAAAAFAwAAAAAAAAUEAAAAAAAABQYAAAAAAAAFBwAAAAAAAAUJAAAAAAAABQoAAAAAAAAFDAAAAAAAAAYOAAAAAAABBRAAAAAAAAEFFAAAAAAAAQUWAAAAAAACBRwAAAAAAAMFIAAAAAAABAUwAAAAIAAGBUAAAAAAAAcFgAAAAAAACAYAAQAAAAAKBgAEAAAAAAwGABAAACAAAAQAAAAAAAAABAEAAAAAAAAFAgAAACAAAAUEAAAAAAAABQUAAAAgAAAFBwAAAAAAAAUIAAAAIAAABQoAAAAAAAAFCwAAAAAAAAYNAAAAIAABBRAAAAAAAAEFEgAAACAAAQUWAAAAAAACBRgAAAAgAAMFIAAAAAAAAwUoAAAAAAAGBEAAAAAQAAYEQAAAACAABwWAAAAAAAAJBgACAAAAAAsGAAgAADAAAAQAAAAAEAAABAEAAAAgAAAFAgAAACAAAAUDAAAAIAAABQUAAAAgAAAFBgAAACAAAAUIAAAAIAAABQkAAAAgAAAFCwAAACAAAAUMAAAAAAAABg8AAAAgAAEFEgAAACAAAQUUAAAAIAACBRgAAAAgAAIFHAAAACAAAwUoAAAAIAAEBTAAAAAAABAGAAABAAAADwYAgAAAAAAOBgBAAAAAAA0GACAAQZATC4cCAQABAQUAAAAAAAAFAAAAAAAABgQ9AAAAAAAJBf0BAAAAAA8F/X8AAAAAFQX9/x8AAAADBQUAAAAAAAcEfQAAAAAADAX9DwAAAAASBf3/AwAAABcF/f9/AAAABQUdAAAAAAAIBP0AAAAAAA4F/T8AAAAAFAX9/w8AAAACBQEAAAAQAAcEfQAAAAAACwX9BwAAAAARBf3/AQAAABYF/f8/AAAABAUNAAAAEAAIBP0AAAAAAA0F/R8AAAAAEwX9/wcAAAABBQEAAAAQAAYEPQAAAAAACgX9AwAAAAAQBf3/AAAAABwF/f//DwAAGwX9//8HAAAaBf3//wMAABkF/f//AQAAGAX9//8AQaAVC4YEAQABAQYAAAAAAAAGAwAAAAAAAAQEAAAAIAAABQUAAAAAAAAFBgAAAAAAAAUIAAAAAAAABQkAAAAAAAAFCwAAAAAAAAYNAAAAAAAABhAAAAAAAAAGEwAAAAAAAAYWAAAAAAAABhkAAAAAAAAGHAAAAAAAAAYfAAAAAAAABiIAAAAAAAEGJQAAAAAAAQYpAAAAAAACBi8AAAAAAAMGOwAAAAAABAZTAAAAAAAHBoMAAAAAAAkGAwIAABAAAAQEAAAAAAAABAUAAAAgAAAFBgAAAAAAAAUHAAAAIAAABQkAAAAAAAAFCgAAAAAAAAYMAAAAAAAABg8AAAAAAAAGEgAAAAAAAAYVAAAAAAAABhgAAAAAAAAGGwAAAAAAAAYeAAAAAAAABiEAAAAAAAEGIwAAAAAAAQYnAAAAAAACBisAAAAAAAMGMwAAAAAABAZDAAAAAAAFBmMAAAAAAAgGAwEAACAAAAQEAAAAMAAABAQAAAAQAAAEBQAAACAAAAUHAAAAIAAABQgAAAAgAAAFCgAAACAAAAULAAAAAAAABg4AAAAAAAAGEQAAAAAAAAYUAAAAAAAABhcAAAAAAAAGGgAAAAAAAAYdAAAAAAAABiAAAAAAABAGAwABAAAADwYDgAAAAAAOBgNAAAAAAA0GAyAAAAAADAYDEAAAAAALBgMIAAAAAAoGAwQAQbQZC3wBAAAAAwAAAAcAAAAPAAAAHwAAAD8AAAB/AAAA/wAAAP8BAAD/AwAA/wcAAP8PAAD/HwAA/z8AAP9/AAD//wAA//8BAP//AwD//wcA//8PAP//HwD//z8A//9/AP///wD///8B////A////wf///8P////H////z////9/AEHEGgtZAQAAAAIAAAAEAAAAAAAAAAIAAAAEAAAACAAAAAAAAAABAAAAAgAAAAEAAAAEAAAABAAAAAQAAAAEAAAACAAAAAgAAAAIAAAABwAAAAgAAAAJAAAACgAAAAsAQaAbCwOgDwE=";
  }
});

// node_modules/geotiff/dist-module/compression/zstd.js
var zstd_exports = {};
__export(zstd_exports, {
  default: () => ZstdDecoder,
  zstd: () => zstd2
});
var zstd2, ZstdDecoder;
var init_zstd = __esm({
  "node_modules/geotiff/dist-module/compression/zstd.js"() {
    init_zstddec_stream_modern();
    init_basedecoder();
    zstd2 = new ZSTDDecoder2();
    ZstdDecoder = class extends BaseDecoder {
      static {
        __name(this, "ZstdDecoder");
      }
      /** @param {ArrayBuffer} buffer */
      decodeBlock(buffer2) {
        return (
          /** @type {ArrayBuffer} */
          zstd2.decode(new Uint8Array(buffer2)).buffer
        );
      }
    };
  }
});

// node_modules/geotiff/dist-module/compression/webimage.js
var webimage_exports = {};
__export(webimage_exports, {
  default: () => WebImageDecoder
});
var WebImageDecoder;
var init_webimage = __esm({
  "node_modules/geotiff/dist-module/compression/webimage.js"() {
    init_basedecoder();
    WebImageDecoder = class extends BaseDecoder {
      static {
        __name(this, "WebImageDecoder");
      }
      /**
       * @param {import('./basedecoder.js').BaseDecoderParameters} parameters
       */
      constructor(parameters) {
        super(parameters);
        if (typeof createImageBitmap === "undefined") {
          throw new Error("Cannot decode WebImage as `createImageBitmap` is not available");
        } else if (typeof document === "undefined" && typeof OffscreenCanvas === "undefined") {
          throw new Error("Cannot decode WebImage as neither `document` nor `OffscreenCanvas` is not available");
        }
      }
      /** @param {ArrayBuffer} buffer */
      async decodeBlock(buffer2) {
        const blob = new Blob([buffer2]);
        const imageBitmap = await createImageBitmap(blob);
        let canvas;
        if (typeof document !== "undefined") {
          canvas = document.createElement("canvas");
          canvas.width = imageBitmap.width;
          canvas.height = imageBitmap.height;
        } else {
          canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        }
        const ctx = (
          /** @type {CanvasRenderingContext2D} */
          canvas.getContext("2d")
        );
        ctx.drawImage(imageBitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height).data;
        const samplesPerPixel = this.parameters.samplesPerPixel || 4;
        if (samplesPerPixel === 4) {
          return imageData.buffer;
        } else if (samplesPerPixel === 3) {
          const rgb = new Uint8ClampedArray(imageBitmap.width * imageBitmap.height * 3);
          for (let i = 0, j = 0; i < rgb.length; i += 3, j += 4) {
            rgb[i] = imageData[j];
            rgb[i + 1] = imageData[j + 1];
            rgb[i + 2] = imageData[j + 2];
          }
          return rgb.buffer;
        } else {
          throw new Error(`Unsupported SamplesPerPixel value: ${samplesPerPixel}`);
        }
      }
    };
  }
});

// src/crypto.ts
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var sha256Hex = /* @__PURE__ */ __name(async (value) => {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return bytesToHex(new Uint8Array(digest));
}, "sha256Hex");
var hmacHex = /* @__PURE__ */ __name(async (secret, value) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToHex(new Uint8Array(signature));
}, "hmacHex");
var timingSafeHexEqual = /* @__PURE__ */ __name(async (left, right) => {
  const leftBytes = hexToBytes(left.padEnd(64, "0").slice(0, 64));
  const rightBytes = hexToBytes(right.padEnd(64, "0").slice(0, 64));
  const comparisonKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode("gaia-senseware-fixed-length-comparison-v1"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const signature = await crypto.subtle.sign("HMAC", comparisonKey, leftBytes);
  const equal = await crypto.subtle.verify("HMAC", comparisonKey, signature, rightBytes);
  return equal && left.length === 64 && right.length === 64;
}, "timingSafeHexEqual");
var randomToken = /* @__PURE__ */ __name((prefix = "") => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `${prefix}${base64UrlEncode(bytes)}`;
}, "randomToken");
var PAIRING_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
var randomPairingCode = /* @__PURE__ */ __name(() => {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const characters = Array.from(bytes, (byte) => PAIRING_ALPHABET[byte % PAIRING_ALPHABET.length]);
  return `${characters.slice(0, 4).join("")}-${characters.slice(4).join("")}`;
}, "randomPairingCode");
var pkceChallenge = /* @__PURE__ */ __name(async (verifier) => {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(verifier));
  return base64UrlEncode(new Uint8Array(digest));
}, "pkceChallenge");
var encryptFlowValue = /* @__PURE__ */ __name(async (value, secret) => {
  const key = await deriveAesKey(secret);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(value));
  return `${base64UrlEncode(iv)}.${base64UrlEncode(new Uint8Array(ciphertext))}`;
}, "encryptFlowValue");
var decryptFlowValue = /* @__PURE__ */ __name(async (packed, secret) => {
  const [ivPart, ciphertextPart] = packed.split(".");
  if (!ivPart || !ciphertextPart) return null;
  try {
    const key = await deriveAesKey(secret);
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64UrlDecode(ivPart) },
      key,
      base64UrlDecode(ciphertextPart)
    );
    return decoder.decode(plaintext);
  } catch {
    return null;
  }
}, "decryptFlowValue");
var base64UrlEncode = /* @__PURE__ */ __name((bytes) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}, "base64UrlEncode");
var base64UrlDecode = /* @__PURE__ */ __name((value) => {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}, "base64UrlDecode");
var deriveAesKey = /* @__PURE__ */ __name(async (secret) => {
  const keyMaterial = await crypto.subtle.digest("SHA-256", encoder.encode(`gaia-oidc-flow:${secret}`));
  return crypto.subtle.importKey("raw", keyMaterial, "AES-GCM", false, ["encrypt", "decrypt"]);
}, "deriveAesKey");
var bytesToHex = /* @__PURE__ */ __name((bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(""), "bytesToHex");
var hexToBytes = /* @__PURE__ */ __name((hex) => {
  const pairs = hex.match(/.{2}/gu) ?? [];
  const bytes = new Uint8Array(pairs.length);
  pairs.forEach((pair, index) => {
    bytes[index] = Number.parseInt(pair, 16);
  });
  return bytes;
}, "hexToBytes");

// src/http.ts
var ApiError = class extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
  status;
  code;
  static {
    __name(this, "ApiError");
  }
};
var json = /* @__PURE__ */ __name((body, status = 200, headers = {}) => {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Content-Type", "application/json; charset=utf-8");
  responseHeaders.set("Cache-Control", "no-store");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("Referrer-Policy", "no-referrer");
  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}, "json");
var errorResponse = /* @__PURE__ */ __name((error, headers = {}) => json({ error: { code: error.code, message: error.message } }, error.status, headers), "errorResponse");
var readJson = /* @__PURE__ */ __name(async (request, maximumBytes) => {
  const type = request.headers.get("Content-Type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (type !== "application/json") throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json.");
  const declaredLength = request.headers.get("Content-Length");
  if (declaredLength !== null) {
    const length = Number(declaredLength);
    if (!Number.isFinite(length) || length < 0 || length > maximumBytes) {
      throw new ApiError(413, "PAYLOAD_TOO_LARGE", `Request body must not exceed ${maximumBytes} bytes.`);
    }
  }
  if (!request.body) throw new ApiError(400, "INVALID_JSON", "A JSON request body is required.");
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel();
        throw new ApiError(413, "PAYLOAD_TOO_LARGE", `Request body must not exceed ${maximumBytes} bytes.`);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(body));
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Request body is not valid JSON.");
  }
}, "readJson");
var readBytes = /* @__PURE__ */ __name(async (request, maximumBytes) => {
  const declaredLength = request.headers.get("Content-Length");
  if (declaredLength !== null && (!Number.isFinite(Number(declaredLength)) || Number(declaredLength) < 1 || Number(declaredLength) > maximumBytes)) {
    throw new ApiError(413, "PAYLOAD_TOO_LARGE", `Request body must not exceed ${maximumBytes} bytes.`);
  }
  if (!request.body) throw new ApiError(400, "EMPTY_BODY", "A request body is required.");
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel();
        throw new ApiError(413, "PAYLOAD_TOO_LARGE", `Request body must not exceed ${maximumBytes} bytes.`);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  if (total < 1) throw new ApiError(400, "EMPTY_BODY", "A request body is required.");
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}, "readBytes");
var isRecord = /* @__PURE__ */ __name((value) => typeof value === "object" && value !== null && !Array.isArray(value), "isRecord");
var requireExactKeys = /* @__PURE__ */ __name((value, allowed) => {
  const unknown = Object.keys(value).find((key) => !allowed.includes(key));
  if (unknown) throw new ApiError(400, "UNKNOWN_FIELD", `Unknown field: ${unknown}.`);
}, "requireExactKeys");
var requireString = /* @__PURE__ */ __name((value, field, minimum, maximum) => {
  if (typeof value !== "string") throw new ApiError(400, "INVALID_FIELD", `${field} must be a string.`);
  const normalized = value.trim();
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new ApiError(400, "INVALID_FIELD", `${field} must be between ${minimum} and ${maximum} characters.`);
  }
  return normalized;
}, "requireString");
var optionalString = /* @__PURE__ */ __name((value, field, maximum) => {
  if (value === void 0 || value === null || value === "") return null;
  return requireString(value, field, 1, maximum);
}, "optionalString");
var parseCookies = /* @__PURE__ */ __name((request) => {
  const result = /* @__PURE__ */ new Map();
  for (const part of (request.headers.get("Cookie") ?? "").split(";")) {
    const separator = part.indexOf("=");
    if (separator <= 0) continue;
    const key = part.slice(0, separator).trim();
    const raw = part.slice(separator + 1).trim();
    try {
      result.set(key, decodeURIComponent(raw));
    } catch {
    }
  }
  return result;
}, "parseCookies");
var sessionCookie = /* @__PURE__ */ __name((value, maximumAge) => [
  `__Host-gaia_sensor_session=${encodeURIComponent(value)}`,
  "Path=/",
  "HttpOnly",
  "Secure",
  "SameSite=Lax",
  `Max-Age=${maximumAge}`
].filter(Boolean).join("; "), "sessionCookie");
var csrfCookie = /* @__PURE__ */ __name((value, maximumAge) => [
  `__Host-gaia_sensor_csrf=${encodeURIComponent(value)}`,
  "Path=/",
  "Secure",
  "SameSite=Strict",
  `Max-Age=${maximumAge}`
].filter(Boolean).join("; "), "csrfCookie");
var flowCookie = /* @__PURE__ */ __name((value, maximumAge) => [
  `__Host-gaia_sensor_oidc=${encodeURIComponent(value)}`,
  "Path=/",
  "HttpOnly",
  "Secure",
  "SameSite=Lax",
  `Max-Age=${maximumAge}`
].join("; "), "flowCookie");
var clearCookie = /* @__PURE__ */ __name((name, httpOnly) => [
  `${name}=`,
  "Path=/",
  httpOnly ? "HttpOnly" : "",
  "Secure",
  "SameSite=Lax",
  "Max-Age=0"
].filter(Boolean).join("; "), "clearCookie");

// src/auth.ts
var SESSION_COOKIE = "__Host-gaia_sensor_session";
var CSRF_COOKIE = "__Host-gaia_sensor_csrf";
var OIDC_FLOW_COOKIE = "__Host-gaia_sensor_oidc";
var GOOGLE_AUTHORIZATION_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
var GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
var GOOGLE_JWKS_ENDPOINT = "https://www.googleapis.com/oauth2/v3/certs";
var FLOW_TTL_SECONDS = 600;
var startGoogleLogin = /* @__PURE__ */ __name(async (request, env) => {
  requireAuthConfiguration(env);
  const requestUrl = new URL(request.url);
  const returnPath = normalizeReturnPath(requestUrl.searchParams.get("returnTo"));
  const state = randomToken("st_");
  const nonce = randomToken("no_");
  const verifier = randomToken("pkce_");
  const browserBinding = randomToken("oidc_");
  const now = /* @__PURE__ */ new Date();
  const expiresAt = new Date(now.getTime() + FLOW_TTL_SECONDS * 1e3).toISOString();
  await env.DB.prepare(
    `INSERT INTO oauth_flows
      (id, state_hash, nonce_hash, browser_binding_hash, verifier_ciphertext, return_path, expires_at, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`
  ).bind(
    crypto.randomUUID(),
    await sha256Hex(state),
    await sha256Hex(nonce),
    await sha256Hex(browserBinding),
    await encryptFlowValue(verifier, env.SESSION_SECRET),
    returnPath,
    expiresAt,
    now.toISOString()
  ).run();
  const authorize = new URL(GOOGLE_AUTHORIZATION_ENDPOINT);
  authorize.search = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(env),
    response_type: "code",
    scope: "openid",
    state,
    nonce,
    code_challenge: await pkceChallenge(verifier),
    code_challenge_method: "S256",
    access_type: "online",
    prompt: "select_account"
  }).toString();
  return new Response(null, {
    status: 302,
    headers: { Location: authorize.toString(), "Set-Cookie": flowCookie(browserBinding, FLOW_TTL_SECONDS) }
  });
}, "startGoogleLogin");
var finishGoogleLogin = /* @__PURE__ */ __name(async (request, env) => {
  requireAuthConfiguration(env);
  const url = new URL(request.url);
  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";
  if (!state || !code || state.length > 512 || code.length > 4096) {
    throw new ApiError(400, "INVALID_OIDC_CALLBACK", "Google login callback is incomplete.");
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const stateHash = await sha256Hex(state);
  const candidate = await env.DB.prepare(
    `SELECT id, nonce_hash, browser_binding_hash, verifier_ciphertext, return_path
     FROM oauth_flows WHERE state_hash = ?1 AND consumed_at IS NULL AND expires_at > ?2`
  ).bind(stateHash, now).first();
  const browserBinding = parseCookies(request).get(OIDC_FLOW_COOKIE) ?? "";
  const browserBindingHash = await sha256Hex(browserBinding);
  if (!candidate || !browserBinding || !await timingSafeHexEqual(browserBindingHash, candidate.browser_binding_hash)) {
    throw new ApiError(400, "INVALID_OIDC_STATE", "Google login state is invalid, expired, or belongs to another browser.");
  }
  const flow = await env.DB.prepare(
    `UPDATE oauth_flows SET consumed_at = ?1
     WHERE id = ?2 AND state_hash = ?3 AND browser_binding_hash = ?4
       AND consumed_at IS NULL AND expires_at > ?1
     RETURNING id, nonce_hash, browser_binding_hash, verifier_ciphertext, return_path`
  ).bind(now, candidate.id, stateHash, browserBindingHash).first();
  if (!flow) throw new ApiError(400, "INVALID_OIDC_STATE", "Google login state has already been used.");
  const verifier = await decryptFlowValue(flow.verifier_ciphertext, env.SESSION_SECRET);
  if (!verifier) throw new ApiError(400, "INVALID_OIDC_FLOW", "Google login flow could not be verified.");
  const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri(env),
      grant_type: "authorization_code",
      code_verifier: verifier
    })
  });
  if (!tokenResponse.ok) throw new ApiError(401, "OIDC_TOKEN_EXCHANGE_FAILED", "Google login could not be completed.");
  const tokenBody = await tokenResponse.json();
  const idToken = isGoogleTokenResponse(tokenBody) ? tokenBody.id_token : void 0;
  if (typeof idToken !== "string" || idToken.length > 16384) {
    throw new ApiError(401, "INVALID_ID_TOKEN", "Google did not return a valid ID token.");
  }
  const identity = await verifyGoogleIdToken(idToken, env.GOOGLE_CLIENT_ID, flow.nonce_hash);
  const userId = await upsertGoogleUser(env.DB, identity, now);
  const session = await createSession(env, userId, now);
  const headers = new Headers({ Location: new URL(flow.return_path, env.PUBLIC_ORIGIN).toString() });
  headers.append("Set-Cookie", sessionCookie(session.token, session.ttl));
  headers.append("Set-Cookie", csrfCookie(session.csrfToken, session.ttl));
  headers.append("Set-Cookie", clearCookie(OIDC_FLOW_COOKIE, true));
  return new Response(null, { status: 302, headers });
}, "finishGoogleLogin");
var getAuthenticatedUser = /* @__PURE__ */ __name(async (request, env) => {
  const token = parseCookies(request).get(SESSION_COOKIE);
  if (!token || token.length > 256) throw new ApiError(401, "AUTHENTICATION_REQUIRED", "Login is required.");
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const row = await env.DB.prepare(
    `SELECT s.id AS session_id, s.user_id, u.display_name, u.account_kind, s.csrf_hash, s.expires_at
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?1 AND s.revoked_at IS NULL AND s.expires_at > ?2`
  ).bind(await sha256Hex(token), now).first();
  if (!row) throw new ApiError(401, "SESSION_EXPIRED", "Your session has expired. Please log in again.");
  return {
    id: row.user_id,
    displayName: row.display_name,
    accountKind: row.account_kind,
    sessionId: row.session_id,
    csrfHash: row.csrf_hash,
    expiresAt: row.expires_at
  };
}, "getAuthenticatedUser");
var requireCsrf = /* @__PURE__ */ __name(async (request, user) => {
  const cookieToken = parseCookies(request).get(CSRF_COOKIE) ?? "";
  const headerToken = request.headers.get("X-CSRF-Token") ?? "";
  if (!cookieToken || !headerToken || cookieToken.length > 256 || headerToken.length > 256) {
    throw new ApiError(403, "CSRF_VALIDATION_FAILED", "CSRF validation failed.");
  }
  const [cookieHash, headerHash] = await Promise.all([sha256Hex(cookieToken), sha256Hex(headerToken)]);
  if (!await timingSafeHexEqual(cookieHash, headerHash) || !await timingSafeHexEqual(cookieHash, user.csrfHash)) {
    throw new ApiError(403, "CSRF_VALIDATION_FAILED", "CSRF validation failed.");
  }
}, "requireCsrf");
var sessionResponse = /* @__PURE__ */ __name(async (request, env) => {
  const user = await getAuthenticatedUser(request, env);
  const rotatedToken = randomToken("gs_");
  const now = /* @__PURE__ */ new Date();
  const rotated = await env.DB.prepare(
    `UPDATE sessions SET token_hash = ?1, last_seen_at = ?2
     WHERE id = ?3 AND user_id = ?4 AND revoked_at IS NULL AND expires_at > ?2`
  ).bind(await sha256Hex(rotatedToken), now.toISOString(), user.sessionId, user.id).run();
  if (rotated.meta.changes !== 1) throw new ApiError(401, "AUTHENTICATION_REQUIRED", "Session is no longer active.");
  const remainingSeconds = Math.max(1, Math.floor((Date.parse(user.expiresAt) - now.getTime()) / 1e3));
  const headers = new Headers({ "Set-Cookie": sessionCookie(rotatedToken, remainingSeconds) });
  return json({ user: { id: user.id, displayName: user.displayName, accountKind: user.accountKind }, expiresAt: user.expiresAt }, 200, headers);
}, "sessionResponse");
var startTrialSession = /* @__PURE__ */ __name(async (request, env) => {
  if (request.headers.get("Origin") !== env.WEB_ORIGIN) {
    throw new ApiError(403, "ORIGIN_NOT_ALLOWED", "Origin is not allowed.");
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  await env.DB.prepare(
    `DELETE FROM users
     WHERE account_kind = 'trial'
       AND NOT EXISTS (
         SELECT 1 FROM sessions
         WHERE sessions.user_id = users.id
           AND sessions.revoked_at IS NULL
           AND sessions.expires_at > ?1
       )`
  ).bind(now).run();
  const userId = crypto.randomUUID();
  const publicId = createPublicId();
  const displayName = anonymousDisplayName("\u304A\u305F\u3081\u3057\u53C2\u52A0\u8005", publicId);
  await env.DB.prepare(
    `INSERT INTO users (id, public_id, display_name, account_kind, created_at, updated_at)
     VALUES (?1, ?2, ?3, 'trial', ?4, ?4)`
  ).bind(userId, publicId, displayName, now).run();
  const session = await createSession(env, userId, now);
  const headers = new Headers();
  headers.append("Set-Cookie", sessionCookie(session.token, session.ttl));
  headers.append("Set-Cookie", csrfCookie(session.csrfToken, session.ttl));
  return json({
    user: { id: userId, displayName, accountKind: "trial" },
    expiresAt: session.expiresAt
  }, 201, headers);
}, "startTrialSession");
var logout = /* @__PURE__ */ __name(async (request, env) => {
  const user = await getAuthenticatedUser(request, env);
  await requireCsrf(request, user);
  if (user.accountKind === "trial") {
    await env.DB.prepare("DELETE FROM users WHERE id = ?1 AND account_kind = 'trial'").bind(user.id).run();
  } else {
    await env.DB.prepare("UPDATE sessions SET revoked_at = ?1 WHERE id = ?2 AND user_id = ?3").bind((/* @__PURE__ */ new Date()).toISOString(), user.sessionId, user.id).run();
  }
  const headers = new Headers();
  headers.append("Set-Cookie", clearCookie(SESSION_COOKIE, true));
  headers.append("Set-Cookie", clearCookie(CSRF_COOKIE, false));
  return json({ ok: true, accountDeleted: user.accountKind === "trial" }, 200, headers);
}, "logout");
var createSession = /* @__PURE__ */ __name(async (env, userId, now) => {
  const ttl = boundedInteger(env.SESSION_TTL_SECONDS, 900, 86400, 28800);
  const token = randomToken("gs_");
  const csrfToken = randomToken("csrf_");
  const expiresAt = new Date(Date.parse(now) + ttl * 1e3).toISOString();
  await env.DB.prepare(
    `INSERT INTO sessions (id, token_hash, user_id, csrf_hash, expires_at, created_at, last_seen_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)`
  ).bind(
    crypto.randomUUID(),
    await sha256Hex(token),
    userId,
    await sha256Hex(csrfToken),
    expiresAt,
    now
  ).run();
  return { token, csrfToken, ttl, expiresAt };
}, "createSession");
var upsertGoogleUser = /* @__PURE__ */ __name(async (db, identity, now) => {
  const existing = await db.prepare(
    "SELECT user_id FROM user_identities WHERE provider = 'google' AND provider_subject = ?1"
  ).bind(identity.sub).first();
  if (existing) {
    await db.batch([
      db.prepare("UPDATE users SET updated_at = ?1 WHERE id = ?2").bind(now, existing.user_id),
      db.prepare(
        "UPDATE user_identities SET email = NULL, email_verified = 0, updated_at = ?1 WHERE provider = 'google' AND provider_subject = ?2"
      ).bind(now, identity.sub)
    ]);
    return existing.user_id;
  }
  const userId = crypto.randomUUID();
  const publicId = createPublicId();
  try {
    await db.batch([
      db.prepare("INSERT INTO users (id, public_id, display_name, account_kind, created_at, updated_at) VALUES (?1, ?2, ?3, 'google', ?4, ?4)").bind(userId, publicId, anonymousDisplayName("GAIA\u53C2\u52A0\u8005", publicId), now),
      db.prepare(
        `INSERT INTO user_identities
          (id, user_id, provider, provider_subject, email, email_verified, created_at, updated_at)
         VALUES (?1, ?2, 'google', ?3, NULL, 0, ?4, ?4)`
      ).bind(crypto.randomUUID(), userId, identity.sub, now)
    ]);
    return userId;
  } catch {
    const winner = await db.prepare(
      "SELECT user_id FROM user_identities WHERE provider = 'google' AND provider_subject = ?1"
    ).bind(identity.sub).first();
    if (winner) return winner.user_id;
    throw new ApiError(500, "IDENTITY_SAVE_FAILED", "Google identity could not be saved.");
  }
}, "upsertGoogleUser");
var verifyGoogleIdToken = /* @__PURE__ */ __name(async (token, audience, nonceHash) => {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) throw new ApiError(401, "INVALID_ID_TOKEN", "ID token is malformed.");
  const header = decodeJwtPart(parts[0]);
  const claims = decodeJwtPart(parts[1]);
  if (!isObject(header) || header.alg !== "RS256" || typeof header.kid !== "string") {
    throw new ApiError(401, "INVALID_ID_TOKEN", "ID token header is invalid.");
  }
  const keysResponse = await fetch(GOOGLE_JWKS_ENDPOINT, { headers: { Accept: "application/json" } });
  if (!keysResponse.ok) throw new ApiError(503, "OIDC_KEYS_UNAVAILABLE", "Google signing keys are unavailable.");
  const keysBody = await keysResponse.json();
  const keys = isObject(keysBody) && Array.isArray(keysBody.keys) ? keysBody.keys : [];
  const jwk = keys.find(
    (candidate) => isObject(candidate) && candidate.kid === header.kid && candidate.alg === "RS256" && candidate.use === "sig"
  );
  if (!jwk) throw new ApiError(401, "INVALID_ID_TOKEN", "ID token signing key was not found.");
  const publicKey = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const verified = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, base64UrlDecode(parts[2]), signed);
  if (!verified || !isObject(claims)) throw new ApiError(401, "INVALID_ID_TOKEN", "ID token signature is invalid.");
  const nowSeconds = Math.floor(Date.now() / 1e3);
  if (claims.iss !== "https://accounts.google.com" && claims.iss !== "accounts.google.com") throw new ApiError(401, "INVALID_ID_TOKEN_ISSUER", "ID token issuer is invalid.");
  if (claims.aud !== audience) throw new ApiError(401, "INVALID_ID_TOKEN_AUDIENCE", "ID token audience is invalid.");
  if (typeof claims.exp !== "number" || claims.exp <= nowSeconds) throw new ApiError(401, "EXPIRED_ID_TOKEN", "ID token has expired.");
  if (typeof claims.iat !== "number" || claims.iat > nowSeconds + 120) throw new ApiError(401, "INVALID_ID_TOKEN_TIME", "ID token issue time is invalid.");
  if (typeof claims.nonce !== "string" || !await timingSafeHexEqual(await sha256Hex(claims.nonce), nonceHash)) {
    throw new ApiError(401, "INVALID_ID_TOKEN_NONCE", "ID token nonce is invalid.");
  }
  if (typeof claims.sub !== "string" || claims.sub.length < 1 || claims.sub.length > 255) throw new ApiError(401, "INVALID_ID_TOKEN_SUBJECT", "ID token subject is invalid.");
  return { sub: claims.sub };
}, "verifyGoogleIdToken");
var decodeJwtPart = /* @__PURE__ */ __name((part) => {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlDecode(part)));
  } catch {
    return null;
  }
}, "decodeJwtPart");
var isObject = /* @__PURE__ */ __name((value) => typeof value === "object" && value !== null && !Array.isArray(value), "isObject");
var isGoogleTokenResponse = /* @__PURE__ */ __name((value) => isObject(value), "isGoogleTokenResponse");
var createPublicId = /* @__PURE__ */ __name(() => `usr_${randomToken().replace(/[^A-Za-z0-9]/gu, "").slice(0, 24).toLowerCase()}`, "createPublicId");
var anonymousDisplayName = /* @__PURE__ */ __name((prefix, publicId) => `${prefix} ${publicId.slice(-4).toUpperCase()}`, "anonymousDisplayName");
var normalizeReturnPath = /* @__PURE__ */ __name((value) => value === "/sensors/" ? value : "/sensors/", "normalizeReturnPath");
var redirectUri = /* @__PURE__ */ __name((env) => new URL("/api/auth/google/callback", env.PUBLIC_ORIGIN).toString(), "redirectUri");
var boundedInteger = /* @__PURE__ */ __name((value, minimum, maximum, fallback) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}, "boundedInteger");
var requireAuthConfiguration = /* @__PURE__ */ __name((env) => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.SESSION_SECRET) {
    throw new ApiError(503, "OIDC_NOT_CONFIGURED", "Google OIDC credentials are not configured.");
  }
}, "requireAuthConfiguration");

// src/region-code-data.ts
var REGION_DATA_VERSION = "cldr-48.2.0+jlis-2026-08-14";
var SUBDIVISION_RECORDS = [
  ["AD-02", "AD", "Canillo"],
  ["AD-03", "AD", "Encamp"],
  ["AD-04", "AD", "La Massana"],
  ["AD-05", "AD", "Ordino"],
  ["AD-06", "AD", "Sant Juli\xE0 de L\xF2ria"],
  ["AD-07", "AD", "Andorra la Vella"],
  ["AD-08", "AD", "Escaldes-Engordany"],
  ["AE-AJ", "AE", "Ajman"],
  ["AE-AZ", "AE", "Abu Dhabi"],
  ["AE-DU", "AE", "Dubai"],
  ["AE-FU", "AE", "Fujairah"],
  ["AE-RK", "AE", "Ras al-Khaimah"],
  ["AE-SH", "AE", "Sharjah"],
  ["AE-UQ", "AE", "Umm al-Quwain"],
  ["AF-BAL", "AF", "Balkh"],
  ["AF-BAM", "AF", "Bamyan"],
  ["AF-BDG", "AF", "Badghis"],
  ["AF-BDS", "AF", "Badakhshan"],
  ["AF-BGL", "AF", "Baghlan"],
  ["AF-DAY", "AF", "Daykundi"],
  ["AF-FRA", "AF", "Farah"],
  ["AF-FYB", "AF", "Faryab"],
  ["AF-GHA", "AF", "Ghazni"],
  ["AF-GHO", "AF", "Gh\u014Dr"],
  ["AF-HEL", "AF", "Helmand"],
  ["AF-HER", "AF", "Herat"],
  ["AF-JOW", "AF", "Jowzjan"],
  ["AF-KAB", "AF", "Kabul"],
  ["AF-KAN", "AF", "Kandahar"],
  ["AF-KAP", "AF", "Kapisa"],
  ["AF-KDZ", "AF", "Kunduz"],
  ["AF-KHO", "AF", "Khost"],
  ["AF-KNR", "AF", "Kunar"],
  ["AF-LAG", "AF", "Laghman"],
  ["AF-LOG", "AF", "Logar"],
  ["AF-NAN", "AF", "Nangarhar"],
  ["AF-NIM", "AF", "Nimruz"],
  ["AF-NUR", "AF", "Nuristan"],
  ["AF-PAN", "AF", "Panjshir"],
  ["AF-PAR", "AF", "Parwan"],
  ["AF-PIA", "AF", "Paktia"],
  ["AF-PKA", "AF", "Paktika"],
  ["AF-SAM", "AF", "Samangan"],
  ["AF-SAR", "AF", "Sar-e Pol"],
  ["AF-TAK", "AF", "Takhar"],
  ["AF-URU", "AF", "Urozgan"],
  ["AF-WAR", "AF", "Maidan Wardak"],
  ["AF-ZAB", "AF", "Zabul"],
  ["AG-03", "AG", "Saint George"],
  ["AG-04", "AG", "Saint John"],
  ["AG-05", "AG", "Saint Mary"],
  ["AG-06", "AG", "Saint Paul"],
  ["AG-07", "AG", "Saint Peter"],
  ["AG-08", "AG", "Saint Philip"],
  ["AG-10", "AG", "Barbuda"],
  ["AG-11", "AG", "Redonda"],
  ["AL-01", "AL", "Berat County"],
  ["AL-02", "AL", "Durr\xEBs County"],
  ["AL-03", "AL", "Elbasan County"],
  ["AL-04", "AL", "Fier County"],
  ["AL-05", "AL", "Gjirokast\xEBr County"],
  ["AL-06", "AL", "Kor\xE7\xEB County"],
  ["AL-07", "AL", "Kuk\xEBs County"],
  ["AL-08", "AL", "Lezh\xEB County"],
  ["AL-09", "AL", "Dib\xEBr County"],
  ["AL-10", "AL", "Shkod\xEBr County"],
  ["AL-11", "AL", "Tirana County"],
  ["AL-12", "AL", "Vlor\xEB County"],
  ["AM-AG", "AM", "Aragatsotn"],
  ["AM-AR", "AM", "Ararat"],
  ["AM-AV", "AM", "Armavir"],
  ["AM-ER", "AM", "Yerevan"],
  ["AM-GR", "AM", "Gegharkunik"],
  ["AM-KT", "AM", "Kotayk"],
  ["AM-LO", "AM", "Lori"],
  ["AM-SH", "AM", "Shirak"],
  ["AM-SU", "AM", "Syunik"],
  ["AM-TV", "AM", "Tavush"],
  ["AM-VD", "AM", "Vayots Dzor"],
  ["AO-BGO", "AO", "Bengo"],
  ["AO-BGU", "AO", "Benguela"],
  ["AO-BIE", "AO", "Bi\xE9"],
  ["AO-CAB", "AO", "Cabinda"],
  ["AO-CCU", "AO", "Cuando Cubango"],
  ["AO-CNN", "AO", "Cunene"],
  ["AO-CNO", "AO", "Cuanza Norte"],
  ["AO-CUS", "AO", "Cuanza Sul"],
  ["AO-HUA", "AO", "Huambo"],
  ["AO-HUI", "AO", "Hu\xEDla"],
  ["AO-LNO", "AO", "Lunda Norte"],
  ["AO-LSU", "AO", "Lunda Sul"],
  ["AO-LUA", "AO", "Luanda"],
  ["AO-MAL", "AO", "Malanje"],
  ["AO-MOX", "AO", "Moxico"],
  ["AO-NAM", "AO", "Namibe"],
  ["AO-UIG", "AO", "U\xEDge"],
  ["AO-ZAI", "AO", "Zaire"],
  ["AR-A", "AR", "Salta"],
  ["AR-B", "AR", "Buenos Aires Province"],
  ["AR-C", "AR", "Buenos Aires"],
  ["AR-D", "AR", "San Luis"],
  ["AR-E", "AR", "Entre R\xEDos"],
  ["AR-F", "AR", "La Rioja"],
  ["AR-G", "AR", "Santiago del Estero"],
  ["AR-H", "AR", "Chaco"],
  ["AR-J", "AR", "San Juan"],
  ["AR-K", "AR", "Catamarca"],
  ["AR-L", "AR", "La Pampa"],
  ["AR-M", "AR", "Mendoza"],
  ["AR-N", "AR", "Misiones"],
  ["AR-P", "AR", "Formosa"],
  ["AR-Q", "AR", "Neuqu\xE9n"],
  ["AR-R", "AR", "R\xEDo Negro"],
  ["AR-S", "AR", "Santa Fe"],
  ["AR-T", "AR", "Tucum\xE1n"],
  ["AR-U", "AR", "Chubut"],
  ["AR-V", "AR", "Tierra del Fuego"],
  ["AR-W", "AR", "Corrientes"],
  ["AR-X", "AR", "C\xF3rdoba"],
  ["AR-Y", "AR", "Jujuy"],
  ["AR-Z", "AR", "Santa Cruz"],
  ["AT-1", "AT", "Burgenland"],
  ["AT-2", "AT", "Carinthia"],
  ["AT-3", "AT", "Lower Austria"],
  ["AT-4", "AT", "Upper Austria"],
  ["AT-5", "AT", "Salzburg"],
  ["AT-6", "AT", "Styria"],
  ["AT-7", "AT", "Tyrol"],
  ["AT-8", "AT", "Vorarlberg"],
  ["AT-9", "AT", "Vienna"],
  ["AU-ACT", "AU", "Australian Capital Territory"],
  ["AU-NSW", "AU", "New South Wales"],
  ["AU-NT", "AU", "Northern Territory"],
  ["AU-QLD", "AU", "Queensland"],
  ["AU-SA", "AU", "South Australia"],
  ["AU-TAS", "AU", "Tasmania"],
  ["AU-VIC", "AU", "Victoria"],
  ["AU-WA", "AU", "Western Australia"],
  ["AZ-ABS", "AZ", "Absheron"],
  ["AZ-AGA", "AZ", "Agstafa"],
  ["AZ-AGC", "AZ", "Aghjabadi"],
  ["AZ-AGM", "AZ", "Agdam"],
  ["AZ-AGS", "AZ", "Agdash"],
  ["AZ-AGU", "AZ", "Agsu"],
  ["AZ-AST", "AZ", "Astara"],
  ["AZ-BA", "AZ", "Baku"],
  ["AZ-BAB", "AZ", "Babek"],
  ["AZ-BAL", "AZ", "Balakan"],
  ["AZ-BAR", "AZ", "Barda"],
  ["AZ-BEY", "AZ", "Beylagan"],
  ["AZ-BIL", "AZ", "Bilasuvar"],
  ["AZ-CAB", "AZ", "Jabrayil"],
  ["AZ-CAL", "AZ", "Jalilabad"],
  ["AZ-CUL", "AZ", "Julfa"],
  ["AZ-DAS", "AZ", "Dashkasan"],
  ["AZ-FUZ", "AZ", "Fizuli"],
  ["AZ-GA", "AZ", "Ganja"],
  ["AZ-GAD", "AZ", "Gadabay"],
  ["AZ-GOR", "AZ", "Goranboy"],
  ["AZ-GOY", "AZ", "Goychay"],
  ["AZ-GYG", "AZ", "Goygol"],
  ["AZ-HAC", "AZ", "Hajigabul"],
  ["AZ-IMI", "AZ", "Imishli"],
  ["AZ-ISM", "AZ", "Ismailli"],
  ["AZ-KAL", "AZ", "Kalbajar"],
  ["AZ-KAN", "AZ", "Kangarli"],
  ["AZ-KUR", "AZ", "Kurdamir"],
  ["AZ-LA", "AZ", "Lankaran"],
  ["AZ-LAC", "AZ", "Lachin"],
  ["AZ-LAN", "AZ", "Lankaran District"],
  ["AZ-LER", "AZ", "Lerik"],
  ["AZ-MAS", "AZ", "Masally"],
  ["AZ-MI", "AZ", "Mingachevir"],
  ["AZ-NA", "AZ", "Naftalan"],
  ["AZ-NEF", "AZ", "Neftchala"],
  ["AZ-NV", "AZ", "Nakhchivan"],
  ["AZ-NX", "AZ", "Nakhchivan AR"],
  ["AZ-OGU", "AZ", "Oghuz"],
  ["AZ-ORD", "AZ", "Ordubad"],
  ["AZ-QAB", "AZ", "Qabala"],
  ["AZ-QAX", "AZ", "Qakh"],
  ["AZ-QAZ", "AZ", "Qazakh"],
  ["AZ-QBA", "AZ", "Quba"],
  ["AZ-QBI", "AZ", "Qubadli"],
  ["AZ-QOB", "AZ", "Gobustan"],
  ["AZ-QUS", "AZ", "Qusar"],
  ["AZ-SA", "AZ", "Shaki"],
  ["AZ-SAB", "AZ", "Sabirabad"],
  ["AZ-SAD", "AZ", "Sadarak"],
  ["AZ-SAH", "AZ", "Shahbuz"],
  ["AZ-SAK", "AZ", "Shaki District"],
  ["AZ-SAL", "AZ", "Salyan"],
  ["AZ-SAR", "AZ", "Sharur"],
  ["AZ-SAT", "AZ", "Saatly"],
  ["AZ-SBN", "AZ", "Shabran"],
  ["AZ-SIY", "AZ", "Siazan"],
  ["AZ-SKR", "AZ", "Shamkir"],
  ["AZ-SM", "AZ", "Sumqayit"],
  ["AZ-SMI", "AZ", "Shamakhi"],
  ["AZ-SMX", "AZ", "Samukh"],
  ["AZ-SR", "AZ", "Shirvan"],
  ["AZ-SUS", "AZ", "Shusha"],
  ["AZ-TAR", "AZ", "Tartar"],
  ["AZ-TOV", "AZ", "Tovuz"],
  ["AZ-UCA", "AZ", "Ujar"],
  ["AZ-XA", "AZ", "Stepanakert"],
  ["AZ-XAC", "AZ", "Khachmaz"],
  ["AZ-XCI", "AZ", "Khojali"],
  ["AZ-XIZ", "AZ", "Khizi"],
  ["AZ-XVD", "AZ", "Khojavend"],
  ["AZ-YAR", "AZ", "Yardymli"],
  ["AZ-YE", "AZ", "Yevlakh"],
  ["AZ-YEV", "AZ", "Yevlakh District"],
  ["AZ-ZAN", "AZ", "Zangilan"],
  ["AZ-ZAQ", "AZ", "Zaqatala"],
  ["AZ-ZAR", "AZ", "Zardab"],
  ["BA-BIH", "BA", "Federation of Bosnia and Herzegovina"],
  ["BA-BRC", "BA", "Br\u010Dko District"],
  ["BA-SRP", "BA", "Republika Srpska"],
  ["BB-01", "BB", "Christ Church"],
  ["BB-02", "BB", "Saint Andrew"],
  ["BB-03", "BB", "Saint George"],
  ["BB-04", "BB", "Saint James"],
  ["BB-05", "BB", "Saint John"],
  ["BB-06", "BB", "Saint Joseph"],
  ["BB-07", "BB", "Saint Lucy"],
  ["BB-08", "BB", "Saint Michael"],
  ["BB-09", "BB", "Saint Peter"],
  ["BB-10", "BB", "Saint Philip"],
  ["BB-11", "BB", "Saint Thomas"],
  ["BD-01", "BD", "Bandarban"],
  ["BD-02", "BD", "Barguna"],
  ["BD-03", "BD", "Bogra"],
  ["BD-04", "BD", "Brahmanbaria"],
  ["BD-05", "BD", "Bagerhat"],
  ["BD-06", "BD", "Barisal Division"],
  ["BD-07", "BD", "Bhola"],
  ["BD-08", "BD", "Comilla"],
  ["BD-09", "BD", "Chandpur"],
  ["BD-10", "BD", "Chittagong"],
  ["BD-11", "BD", "Cox\u2019s Bazar"],
  ["BD-12", "BD", "Chuadanga"],
  ["BD-13", "BD", "Dhaka"],
  ["BD-14", "BD", "Dinajpur"],
  ["BD-15", "BD", "Faridpur"],
  ["BD-16", "BD", "Feni"],
  ["BD-17", "BD", "Gopalganj"],
  ["BD-18", "BD", "Gazipur"],
  ["BD-19", "BD", "Gaibandha"],
  ["BD-20", "BD", "Habiganj"],
  ["BD-21", "BD", "Jamalpur"],
  ["BD-22", "BD", "Jessore"],
  ["BD-23", "BD", "Jhenaidah"],
  ["BD-24", "BD", "Joypurhat"],
  ["BD-25", "BD", "Jhalokati"],
  ["BD-26", "BD", "Kishoreganj"],
  ["BD-27", "BD", "Khulna"],
  ["BD-28", "BD", "Kurigram"],
  ["BD-29", "BD", "Khagrachari"],
  ["BD-30", "BD", "Kushtia"],
  ["BD-31", "BD", "Lakshmipur"],
  ["BD-32", "BD", "Lalmonirhat"],
  ["BD-33", "BD", "Manikganj"],
  ["BD-34", "BD", "Mymensingh"],
  ["BD-35", "BD", "Munshiganj"],
  ["BD-36", "BD", "Madaripur"],
  ["BD-37", "BD", "Magura"],
  ["BD-38", "BD", "Maulvi Bazar"],
  ["BD-39", "BD", "Meherpur"],
  ["BD-40", "BD", "Narayanganj"],
  ["BD-41", "BD", "Netrokona"],
  ["BD-42", "BD", "Narsingdi"],
  ["BD-43", "BD", "Narail"],
  ["BD-44", "BD", "Natore"],
  ["BD-45", "BD", "Nawabganj"],
  ["BD-46", "BD", "Nilphamari"],
  ["BD-47", "BD", "Noakhali"],
  ["BD-48", "BD", "Naogaon"],
  ["BD-49", "BD", "Pabna"],
  ["BD-50", "BD", "Pirojpur"],
  ["BD-51", "BD", "Patuakhali"],
  ["BD-52", "BD", "Panchagarh"],
  ["BD-53", "BD", "Rajbari"],
  ["BD-54", "BD", "Rajshahi"],
  ["BD-55", "BD", "Rangpur"],
  ["BD-56", "BD", "Rangamati Hill"],
  ["BD-57", "BD", "Sherpur"],
  ["BD-58", "BD", "Satkhira"],
  ["BD-59", "BD", "Sirajganj"],
  ["BD-60", "BD", "Sylhet"],
  ["BD-61", "BD", "Sunamganj"],
  ["BD-62", "BD", "Shariatpur"],
  ["BD-63", "BD", "Tangail"],
  ["BD-64", "BD", "Thakurgaon"],
  ["BD-A", "BD", "Barisal"],
  ["BD-B", "BD", "Chittagong Division"],
  ["BD-C", "BD", "Dhaka Division"],
  ["BD-D", "BD", "Khulna Division"],
  ["BD-E", "BD", "Rajshahi Division"],
  ["BD-F", "BD", "Rangpur Division"],
  ["BD-G", "BD", "Sylhet Division"],
  ["BD-H", "BD", "Mymensingh Division"],
  ["BE-BRU", "BE", "Brussels"],
  ["BE-VAN", "BE", "Antwerp"],
  ["BE-VBR", "BE", "Flemish Brabant"],
  ["BE-VLG", "BE", "Flanders"],
  ["BE-VLI", "BE", "Limburg"],
  ["BE-VOV", "BE", "East Flanders"],
  ["BE-VWV", "BE", "West Flanders"],
  ["BE-WAL", "BE", "Wallonia"],
  ["BE-WBR", "BE", "Walloon Brabant"],
  ["BE-WHT", "BE", "Hainaut"],
  ["BE-WLG", "BE", "Li\xE8ge"],
  ["BE-WLX", "BE", "Luxembourg"],
  ["BE-WNA", "BE", "Namur"],
  ["BF-01", "BF", "Boucle du Mouhoun"],
  ["BF-02", "BF", "Cascades"],
  ["BF-03", "BF", "Centre"],
  ["BF-04", "BF", "Centre-Est"],
  ["BF-05", "BF", "Centre-Nord"],
  ["BF-06", "BF", "Centre-Ouest"],
  ["BF-07", "BF", "Centre-Sud"],
  ["BF-08", "BF", "Est"],
  ["BF-09", "BF", "Hauts-Bassins"],
  ["BF-10", "BF", "Nord"],
  ["BF-11", "BF", "Plateau-Central"],
  ["BF-12", "BF", "Sahel"],
  ["BF-13", "BF", "Sud-Ouest"],
  ["BF-BAL", "BF", "Bal\xE9"],
  ["BF-BAM", "BF", "Bam"],
  ["BF-BAN", "BF", "Banwa"],
  ["BF-BAZ", "BF", "Baz\xE8ga"],
  ["BF-BGR", "BF", "Bougouriba"],
  ["BF-BLG", "BF", "Boulgou"],
  ["BF-BLK", "BF", "Boulkiemd\xE9"],
  ["BF-COM", "BF", "Como\xE9"],
  ["BF-GAN", "BF", "Ganzourgou"],
  ["BF-GNA", "BF", "Gnagna"],
  ["BF-GOU", "BF", "Gourma"],
  ["BF-HOU", "BF", "Houet"],
  ["BF-IOB", "BF", "Ioba"],
  ["BF-KAD", "BF", "Kadiogo"],
  ["BF-KEN", "BF", "K\xE9n\xE9dougou"],
  ["BF-KMD", "BF", "Komondjari"],
  ["BF-KMP", "BF", "Kompienga"],
  ["BF-KOP", "BF", "Koulp\xE9logo"],
  ["BF-KOS", "BF", "Kossi"],
  ["BF-KOT", "BF", "Kouritenga"],
  ["BF-KOW", "BF", "Kourw\xE9ogo"],
  ["BF-LER", "BF", "L\xE9raba"],
  ["BF-LOR", "BF", "Loroum"],
  ["BF-MOU", "BF", "Mouhoun"],
  ["BF-NAM", "BF", "Namentenga"],
  ["BF-NAO", "BF", "Nahouri"],
  ["BF-NAY", "BF", "Nayala"],
  ["BF-NOU", "BF", "Noumbiel"],
  ["BF-OUB", "BF", "Oubritenga"],
  ["BF-OUD", "BF", "Oudalan"],
  ["BF-PAS", "BF", "Passor\xE9"],
  ["BF-PON", "BF", "Poni"],
  ["BF-SEN", "BF", "S\xE9no"],
  ["BF-SIS", "BF", "Sissili"],
  ["BF-SMT", "BF", "Sanmatenga"],
  ["BF-SNG", "BF", "Sangui\xE9"],
  ["BF-SOM", "BF", "Soum"],
  ["BF-SOR", "BF", "Sourou"],
  ["BF-TAP", "BF", "Tapoa"],
  ["BF-TUI", "BF", "Tuy"],
  ["BF-YAG", "BF", "Yagha"],
  ["BF-YAT", "BF", "Yatenga"],
  ["BF-ZIR", "BF", "Ziro"],
  ["BF-ZON", "BF", "Zondoma"],
  ["BF-ZOU", "BF", "Zoundw\xE9ogo"],
  ["BG-01", "BG", "Blagoevgrad"],
  ["BG-02", "BG", "Burgas"],
  ["BG-03", "BG", "Varna"],
  ["BG-04", "BG", "Veliko Tarnovo"],
  ["BG-05", "BG", "Vidin"],
  ["BG-06", "BG", "Vratsa"],
  ["BG-07", "BG", "Gabrovo"],
  ["BG-08", "BG", "Dobrich"],
  ["BG-09", "BG", "Kardzhali"],
  ["BG-10", "BG", "Kyustendil"],
  ["BG-11", "BG", "Lovech"],
  ["BG-12", "BG", "Montana"],
  ["BG-13", "BG", "Pazardzhik"],
  ["BG-14", "BG", "Pernik"],
  ["BG-15", "BG", "Pleven"],
  ["BG-16", "BG", "Plovdiv"],
  ["BG-17", "BG", "Razgrad"],
  ["BG-18", "BG", "Ruse"],
  ["BG-19", "BG", "Silistra"],
  ["BG-20", "BG", "Sliven"],
  ["BG-21", "BG", "Smolyan"],
  ["BG-22", "BG", "Sofia"],
  ["BG-23", "BG", "Sofia District"],
  ["BG-24", "BG", "Stara Zagora"],
  ["BG-25", "BG", "Targovishte"],
  ["BG-26", "BG", "Haskovo"],
  ["BG-27", "BG", "Shumen"],
  ["BG-28", "BG", "Yambol"],
  ["BH-13", "BH", "Capital"],
  ["BH-14", "BH", "Southern"],
  ["BH-15", "BH", "Muharraq"],
  ["BH-17", "BH", "Northern"],
  ["BI-BB", "BI", "Bubanza"],
  ["BI-BL", "BI", "Bujumbura Rural"],
  ["BI-BM", "BI", "Bujumbura"],
  ["BI-BR", "BI", "Bururi"],
  ["BI-CA", "BI", "Cankuzo"],
  ["BI-CI", "BI", "Cibitoke"],
  ["BI-GI", "BI", "Gitega"],
  ["BI-KI", "BI", "Kirundo"],
  ["BI-KR", "BI", "Karuzi"],
  ["BI-KY", "BI", "Kayanza"],
  ["BI-MA", "BI", "Makamba"],
  ["BI-MU", "BI", "Muramvya"],
  ["BI-MW", "BI", "Mwaro"],
  ["BI-MY", "BI", "Muyinga"],
  ["BI-NG", "BI", "Ngozi"],
  ["BI-RM", "BI", "Rumonge"],
  ["BI-RT", "BI", "Rutana"],
  ["BI-RY", "BI", "Ruyigi"],
  ["BJ-AK", "BJ", "Atakora"],
  ["BJ-AL", "BJ", "Alibori"],
  ["BJ-AQ", "BJ", "Atlantique"],
  ["BJ-BO", "BJ", "Borgou"],
  ["BJ-CO", "BJ", "Collines"],
  ["BJ-DO", "BJ", "Donga"],
  ["BJ-KO", "BJ", "Kouffo"],
  ["BJ-LI", "BJ", "Littoral"],
  ["BJ-MO", "BJ", "Mono"],
  ["BJ-OU", "BJ", "Ou\xE9m\xE9"],
  ["BJ-PL", "BJ", "Plateau"],
  ["BJ-ZO", "BJ", "Zou"],
  ["BN-BE", "BN", "Belait"],
  ["BN-BM", "BN", "Brunei-Muara"],
  ["BN-TE", "BN", "Temburong"],
  ["BN-TU", "BN", "Tutong"],
  ["BO-B", "BO", "Beni"],
  ["BO-C", "BO", "Cochabamba"],
  ["BO-H", "BO", "Chuquisaca"],
  ["BO-L", "BO", "La Paz"],
  ["BO-N", "BO", "Pando"],
  ["BO-O", "BO", "Oruro"],
  ["BO-P", "BO", "Potos\xED"],
  ["BO-S", "BO", "Santa Cruz"],
  ["BO-T", "BO", "Tarija"],
  ["BQ-BO", "BQ", "Bonaire"],
  ["BQ-SA", "BQ", "Saba"],
  ["BQ-SE", "BQ", "Sint Eustatius"],
  ["BR-AC", "BR", "Acre"],
  ["BR-AL", "BR", "Alagoas"],
  ["BR-AM", "BR", "Amazonas"],
  ["BR-AP", "BR", "Amap\xE1"],
  ["BR-BA", "BR", "Bahia"],
  ["BR-CE", "BR", "Cear\xE1"],
  ["BR-DF", "BR", "Federal District"],
  ["BR-ES", "BR", "Esp\xEDrito Santo"],
  ["BR-GO", "BR", "Goi\xE1s"],
  ["BR-MA", "BR", "Maranh\xE3o"],
  ["BR-MG", "BR", "Minas Gerais"],
  ["BR-MS", "BR", "Mato Grosso do Sul"],
  ["BR-MT", "BR", "Mato Grosso"],
  ["BR-PA", "BR", "Par\xE1"],
  ["BR-PB", "BR", "Para\xEDba"],
  ["BR-PE", "BR", "Pernambuco"],
  ["BR-PI", "BR", "Piau\xED"],
  ["BR-PR", "BR", "Paran\xE1"],
  ["BR-RJ", "BR", "Rio de Janeiro"],
  ["BR-RN", "BR", "Rio Grande do Norte"],
  ["BR-RO", "BR", "Rond\xF4nia"],
  ["BR-RR", "BR", "Roraima"],
  ["BR-RS", "BR", "Rio Grande do Sul"],
  ["BR-SC", "BR", "Santa Catarina"],
  ["BR-SE", "BR", "Sergipe"],
  ["BR-SP", "BR", "S\xE3o Paulo"],
  ["BR-TO", "BR", "Tocantins"],
  ["BS-AK", "BS", "Acklins"],
  ["BS-BI", "BS", "Bimini"],
  ["BS-BP", "BS", "Black Point"],
  ["BS-BY", "BS", "Berry Islands"],
  ["BS-CE", "BS", "Central Eleuthera"],
  ["BS-CI", "BS", "Cat Island"],
  ["BS-CK", "BS", "Crooked Island"],
  ["BS-CO", "BS", "Central Abaco"],
  ["BS-CS", "BS", "Central Andros"],
  ["BS-EG", "BS", "East Grand Bahama"],
  ["BS-EX", "BS", "Exuma"],
  ["BS-FP", "BS", "Freeport"],
  ["BS-GC", "BS", "Grand Cay"],
  ["BS-HI", "BS", "Harbour Island"],
  ["BS-HT", "BS", "Hope Town"],
  ["BS-IN", "BS", "Inagua"],
  ["BS-LI", "BS", "Long Island"],
  ["BS-MC", "BS", "Mangrove Cay"],
  ["BS-MG", "BS", "Mayaguana"],
  ["BS-MI", "BS", "Moore\u2019s Island"],
  ["BS-NE", "BS", "North Eleuthera"],
  ["BS-NO", "BS", "North Abaco"],
  ["BS-NP", "BS", "New Providence"],
  ["BS-NS", "BS", "North Andros"],
  ["BS-RC", "BS", "Rum Cay"],
  ["BS-RI", "BS", "Ragged Island"],
  ["BS-SA", "BS", "South Andros"],
  ["BS-SE", "BS", "South Eleuthera"],
  ["BS-SO", "BS", "South Abaco"],
  ["BS-SS", "BS", "San Salvador"],
  ["BS-SW", "BS", "Spanish Wells"],
  ["BS-WG", "BS", "West Grand Bahama"],
  ["BT-11", "BT", "Paro"],
  ["BT-12", "BT", "Chukha"],
  ["BT-13", "BT", "Haa"],
  ["BT-14", "BT", "Samtse"],
  ["BT-15", "BT", "Thimphu"],
  ["BT-21", "BT", "Tsirang"],
  ["BT-22", "BT", "Dagana"],
  ["BT-23", "BT", "Punakha"],
  ["BT-24", "BT", "Wangdue Phodrang"],
  ["BT-31", "BT", "Sarpang"],
  ["BT-32", "BT", "Trongsa"],
  ["BT-33", "BT", "Bumthang"],
  ["BT-34", "BT", "Zhemgang"],
  ["BT-41", "BT", "Trashigang"],
  ["BT-42", "BT", "Mongar"],
  ["BT-43", "BT", "Pemagatshel"],
  ["BT-44", "BT", "Lhuntse"],
  ["BT-45", "BT", "Samdrup Jongkhar"],
  ["BT-GA", "BT", "Gasa"],
  ["BT-TY", "BT", "Trashiyangtse"],
  ["BW-CE", "BW", "Central"],
  ["BW-CH", "BW", "Chobe"],
  ["BW-FR", "BW", "Francistown"],
  ["BW-GA", "BW", "Gaborone"],
  ["BW-GH", "BW", "Ghanzi"],
  ["BW-JW", "BW", "Jwaneng"],
  ["BW-KG", "BW", "Kgalagadi"],
  ["BW-KL", "BW", "Kgatleng"],
  ["BW-KW", "BW", "Kweneng"],
  ["BW-LO", "BW", "Lobatse"],
  ["BW-NE", "BW", "North East"],
  ["BW-NW", "BW", "North West"],
  ["BW-SE", "BW", "South East"],
  ["BW-SO", "BW", "Southern"],
  ["BW-SP", "BW", "Selibe Phikwe"],
  ["BW-ST", "BW", "Sowa Town"],
  ["BY-BR", "BY", "Brest"],
  ["BY-HM", "BY", "Minsk"],
  ["BY-HO", "BY", "Homel"],
  ["BY-HR", "BY", "Hrodna"],
  ["BY-MA", "BY", "Magileu"],
  ["BY-MI", "BY", "Minsk Region"],
  ["BY-VI", "BY", "Vitebsk"],
  ["BZ-BZ", "BZ", "Belize"],
  ["BZ-CY", "BZ", "Cayo"],
  ["BZ-CZL", "BZ", "Corozal"],
  ["BZ-OW", "BZ", "Orange Walk"],
  ["BZ-SC", "BZ", "Stann Creek"],
  ["BZ-TOL", "BZ", "Toledo"],
  ["CA-AB", "CA", "Alberta"],
  ["CA-BC", "CA", "British Columbia"],
  ["CA-MB", "CA", "Manitoba"],
  ["CA-NB", "CA", "New Brunswick"],
  ["CA-NL", "CA", "Newfoundland and Labrador"],
  ["CA-NS", "CA", "Nova Scotia"],
  ["CA-NT", "CA", "Northwest Territories"],
  ["CA-NU", "CA", "Nunavut"],
  ["CA-ON", "CA", "Ontario"],
  ["CA-PE", "CA", "Prince Edward Island"],
  ["CA-QC", "CA", "Quebec"],
  ["CA-SK", "CA", "Saskatchewan"],
  ["CA-YT", "CA", "Yukon"],
  ["CD-BC", "CD", "Bas-Congo"],
  ["CD-BU", "CD", "Bas-U\xE9l\xE9"],
  ["CD-EQ", "CD", "\xC9quateur"],
  ["CD-HK", "CD", "Haut-Katanga"],
  ["CD-HL", "CD", "Haut-Lomami"],
  ["CD-HU", "CD", "Haut-U\xE9l\xE9"],
  ["CD-IT", "CD", "Ituri"],
  ["CD-KC", "CD", "Kasa\xEF Central"],
  ["CD-KE", "CD", "Kasa\xEF-Oriental"],
  ["CD-KG", "CD", "Kwango"],
  ["CD-KL", "CD", "Kwilu"],
  ["CD-KN", "CD", "Kinshasa"],
  ["CD-KS", "CD", "Kasa\xEF"],
  ["CD-LO", "CD", "Lomami"],
  ["CD-LU", "CD", "Lualaba"],
  ["CD-MA", "CD", "Maniema"],
  ["CD-MN", "CD", "Mai-Ndombe"],
  ["CD-MO", "CD", "Mongala"],
  ["CD-NK", "CD", "North Kivu"],
  ["CD-NU", "CD", "Nord-Ubangi"],
  ["CD-SA", "CD", "Sankuru"],
  ["CD-SK", "CD", "South Kivu"],
  ["CD-SU", "CD", "Sud-Ubangi"],
  ["CD-TA", "CD", "Tanganyika"],
  ["CD-TO", "CD", "Tshopo"],
  ["CD-TU", "CD", "Tshuapa"],
  ["CF-AC", "CF", "Ouham"],
  ["CF-BB", "CF", "Bamingui-Bangoran"],
  ["CF-BGF", "CF", "Bangui"],
  ["CF-BK", "CF", "Basse-Kotto"],
  ["CF-HK", "CF", "Haute-Kotto"],
  ["CF-HM", "CF", "Haut-Mbomou"],
  ["CF-HS", "CF", "Mamb\xE9r\xE9-Kad\xE9\xEF"],
  ["CF-KB", "CF", "Nana-Gr\xE9bizi"],
  ["CF-KG", "CF", "K\xE9mo"],
  ["CF-LB", "CF", "Lobaye"],
  ["CF-MB", "CF", "Mbomou"],
  ["CF-MP", "CF", "Ombella-M\u2019Poko"],
  ["CF-NM", "CF", "Nana-Mamb\xE9r\xE9"],
  ["CF-OP", "CF", "Ouham-Pend\xE9"],
  ["CF-SE", "CF", "Sangha-Mba\xE9r\xE9"],
  ["CF-UK", "CF", "Ouaka"],
  ["CF-VK", "CF", "Vakaga"],
  ["CG-11", "CG", "Bouenza"],
  ["CG-12", "CG", "Pool"],
  ["CG-13", "CG", "Sangha"],
  ["CG-14", "CG", "Plateaux"],
  ["CG-15", "CG", "Cuvette-Ouest"],
  ["CG-16", "CG", "Pointe-Noire"],
  ["CG-2", "CG", "L\xE9koumou"],
  ["CG-5", "CG", "Kouilou"],
  ["CG-7", "CG", "Likouala"],
  ["CG-8", "CG", "Cuvette"],
  ["CG-9", "CG", "Niari"],
  ["CG-BZV", "CG", "Brazzaville"],
  ["CH-AG", "CH", "Aargau"],
  ["CH-AI", "CH", "Appenzell Innerrhoden"],
  ["CH-AR", "CH", "Appenzell Ausserrhoden"],
  ["CH-BE", "CH", "Bern"],
  ["CH-BL", "CH", "Basel-Landschaft"],
  ["CH-BS", "CH", "Basel-Stadt"],
  ["CH-FR", "CH", "Fribourg"],
  ["CH-GE", "CH", "Geneva"],
  ["CH-GL", "CH", "Glarus"],
  ["CH-GR", "CH", "Graub\xFCnden"],
  ["CH-JU", "CH", "Jura"],
  ["CH-LU", "CH", "Lucerne"],
  ["CH-NE", "CH", "Neuch\xE2tel"],
  ["CH-NW", "CH", "Nidwalden"],
  ["CH-OW", "CH", "Obwalden"],
  ["CH-SG", "CH", "St. Gallen"],
  ["CH-SH", "CH", "Schaffhausen"],
  ["CH-SO", "CH", "Solothurn"],
  ["CH-SZ", "CH", "Schwyz"],
  ["CH-TG", "CH", "Thurgau"],
  ["CH-TI", "CH", "Ticino"],
  ["CH-UR", "CH", "Uri"],
  ["CH-VD", "CH", "Vaud"],
  ["CH-VS", "CH", "Valais"],
  ["CH-ZG", "CH", "Zug"],
  ["CH-ZH", "CH", "Z\xFCrich"],
  ["CI-AB", "CI", "Abidjan"],
  ["CI-BS", "CI", "Bas-Sassandra\xB2"],
  ["CI-CM", "CI", "Como\xE9"],
  ["CI-DN", "CI", "Dengu\xE9l\xE9\xB2"],
  ["CI-GD", "CI", "G\xF4h-Djiboua"],
  ["CI-LC", "CI", "Lacs\xB2"],
  ["CI-LG", "CI", "Lagunes\xB2"],
  ["CI-MG", "CI", "Montagnes"],
  ["CI-SM", "CI", "Sassandra-Marahou\xE9"],
  ["CI-SV", "CI", "Savanes"],
  ["CI-VB", "CI", "Vall\xE9e du Bandama\xB2"],
  ["CI-WR", "CI", "Woroba"],
  ["CI-YM", "CI", "Yamoussoukro"],
  ["CI-ZZ", "CI", "Zanzan\xB2"],
  ["CL-AI", "CL", "Ays\xE9n"],
  ["CL-AN", "CL", "Antofagasta"],
  ["CL-AP", "CL", "Arica y Parinacota"],
  ["CL-AR", "CL", "Araucan\xEDa"],
  ["CL-AT", "CL", "Atacama"],
  ["CL-BI", "CL", "B\xEDo B\xEDo"],
  ["CL-CO", "CL", "Coquimbo"],
  ["CL-LI", "CL", "Libertador General Bernardo O\u2019Higgins"],
  ["CL-LL", "CL", "Los Lagos"],
  ["CL-LR", "CL", "Los R\xEDos"],
  ["CL-MA", "CL", "Magallanes Region"],
  ["CL-ML", "CL", "Maule"],
  ["CL-NB", "CL", "\xD1uble"],
  ["CL-RM", "CL", "Santiago Metropolitan"],
  ["CL-TA", "CL", "Tarapac\xE1"],
  ["CL-VS", "CL", "Valpara\xEDso"],
  ["CM-AD", "CM", "Adamawa"],
  ["CM-CE", "CM", "Centre"],
  ["CM-EN", "CM", "Far North"],
  ["CM-ES", "CM", "East"],
  ["CM-LT", "CM", "Littoral"],
  ["CM-NO", "CM", "North"],
  ["CM-NW", "CM", "Northwest"],
  ["CM-OU", "CM", "West"],
  ["CM-SU", "CM", "South"],
  ["CM-SW", "CM", "Southwest"],
  ["CN-AH", "CN", "Anhui"],
  ["CN-BJ", "CN", "Beijing"],
  ["CN-CQ", "CN", "Chongqing"],
  ["CN-FJ", "CN", "Fujian"],
  ["CN-GD", "CN", "Guangdong"],
  ["CN-GS", "CN", "Gansu"],
  ["CN-GX", "CN", "Guangxi"],
  ["CN-GZ", "CN", "Guizhou"],
  ["CN-HA", "CN", "Henan"],
  ["CN-HB", "CN", "Hubei"],
  ["CN-HE", "CN", "Hebei"],
  ["CN-HI", "CN", "Hainan"],
  ["CN-HK", "CN", "Hong Kong SAR China"],
  ["CN-HL", "CN", "Heilongjiang"],
  ["CN-HN", "CN", "Hunan"],
  ["CN-JL", "CN", "Jilin"],
  ["CN-JS", "CN", "Jiangsu"],
  ["CN-JX", "CN", "Jiangxi"],
  ["CN-LN", "CN", "Liaoning"],
  ["CN-MO", "CN", "Macao SAR China"],
  ["CN-NM", "CN", "Inner Mongolia"],
  ["CN-NX", "CN", "Ningxia"],
  ["CN-QH", "CN", "Qinghai"],
  ["CN-SC", "CN", "Sichuan"],
  ["CN-SD", "CN", "Shandong"],
  ["CN-SH", "CN", "Shanghai"],
  ["CN-SN", "CN", "Shaanxi"],
  ["CN-SX", "CN", "Shanxi"],
  ["CN-TJ", "CN", "Tianjin"],
  ["CN-TW", "CN", "Taiwan"],
  ["CN-XJ", "CN", "Xinjiang"],
  ["CN-XZ", "CN", "Tibet"],
  ["CN-YN", "CN", "Yunnan"],
  ["CN-ZJ", "CN", "Zhejiang"],
  ["CO-AMA", "CO", "Amazonas"],
  ["CO-ANT", "CO", "Antioquia"],
  ["CO-ARA", "CO", "Arauca"],
  ["CO-ATL", "CO", "Atl\xE1ntico"],
  ["CO-BOL", "CO", "Bol\xEDvar"],
  ["CO-BOY", "CO", "Boyac\xE1"],
  ["CO-CAL", "CO", "Caldas"],
  ["CO-CAQ", "CO", "Caquet\xE1"],
  ["CO-CAS", "CO", "Casanare"],
  ["CO-CAU", "CO", "Cauca"],
  ["CO-CES", "CO", "Cesar"],
  ["CO-CHO", "CO", "Choc\xF3"],
  ["CO-COR", "CO", "C\xF3rdoba"],
  ["CO-CUN", "CO", "Cundinamarca"],
  ["CO-DC", "CO", "Capital District"],
  ["CO-GUA", "CO", "Guain\xEDa"],
  ["CO-GUV", "CO", "Guaviare"],
  ["CO-HUI", "CO", "Huila"],
  ["CO-LAG", "CO", "La Guajira"],
  ["CO-MAG", "CO", "Magdalena"],
  ["CO-MET", "CO", "Meta"],
  ["CO-NAR", "CO", "Nari\xF1o"],
  ["CO-NSA", "CO", "Norte de Santander"],
  ["CO-PUT", "CO", "Putumayo"],
  ["CO-QUI", "CO", "Quind\xEDo"],
  ["CO-RIS", "CO", "Risaralda"],
  ["CO-SAN", "CO", "Santander"],
  ["CO-SAP", "CO", "San Andr\xE9s & Providencia"],
  ["CO-SUC", "CO", "Sucre"],
  ["CO-TOL", "CO", "Tolima"],
  ["CO-VAC", "CO", "Valle del Cauca"],
  ["CO-VAU", "CO", "Vaup\xE9s"],
  ["CO-VID", "CO", "Vichada"],
  ["CR-A", "CR", "Alajuela"],
  ["CR-C", "CR", "Cartago"],
  ["CR-G", "CR", "Guanacaste"],
  ["CR-H", "CR", "Heredia"],
  ["CR-L", "CR", "Lim\xF3n"],
  ["CR-P", "CR", "Puntarenas"],
  ["CR-SJ", "CR", "San Jos\xE9"],
  ["CU-01", "CU", "Pinar del R\xEDo"],
  ["CU-03", "CU", "Havana"],
  ["CU-04", "CU", "Matanzas"],
  ["CU-05", "CU", "Villa Clara"],
  ["CU-06", "CU", "Cienfuegos"],
  ["CU-07", "CU", "Sancti Sp\xEDritus"],
  ["CU-08", "CU", "Ciego de \xC1vila"],
  ["CU-09", "CU", "Camag\xFCey"],
  ["CU-10", "CU", "Las Tunas"],
  ["CU-11", "CU", "Holgu\xEDn"],
  ["CU-12", "CU", "Granma"],
  ["CU-13", "CU", "Santiago de Cuba"],
  ["CU-14", "CU", "Guant\xE1namo"],
  ["CU-15", "CU", "Artemisa"],
  ["CU-16", "CU", "Mayabeque"],
  ["CU-99", "CU", "Isla de la Juventud"],
  ["CV-B", "CV", "Barlavento Islands"],
  ["CV-BR", "CV", "Brava"],
  ["CV-BV", "CV", "Boa Vista"],
  ["CV-CA", "CV", "Santa Catarina"],
  ["CV-CF", "CV", "Santa Catarina do Fogo"],
  ["CV-CR", "CV", "Santa Cruz"],
  ["CV-MA", "CV", "Maio"],
  ["CV-MO", "CV", "Mosteiros"],
  ["CV-PA", "CV", "Paul"],
  ["CV-PN", "CV", "Porto Novo"],
  ["CV-PR", "CV", "Praia"],
  ["CV-RB", "CV", "Ribeira Brava"],
  ["CV-RG", "CV", "Ribeira Grande"],
  ["CV-RS", "CV", "Ribeira Grande de Santiago"],
  ["CV-S", "CV", "Sotavento Islands"],
  ["CV-SD", "CV", "S\xE3o Domingos"],
  ["CV-SF", "CV", "S\xE3o Filipe"],
  ["CV-SL", "CV", "Sal"],
  ["CV-SM", "CV", "S\xE3o Miguel"],
  ["CV-SO", "CV", "S\xE3o Louren\xE7o dos \xD3rg\xE3os"],
  ["CV-SS", "CV", "S\xE3o Salvador do Mundo"],
  ["CV-SV", "CV", "S\xE3o Vicente"],
  ["CV-TA", "CV", "Tarrafal"],
  ["CV-TS", "CV", "Tarrafal de S\xE3o Nicolau"],
  ["CY-01", "CY", "Nicosia"],
  ["CY-02", "CY", "Limassol"],
  ["CY-03", "CY", "Larnaca"],
  ["CY-04", "CY", "Famagusta"],
  ["CY-05", "CY", "Paphos"],
  ["CY-06", "CY", "Kyrenia"],
  ["CZ-10", "CZ", "Prague, Hlavn\xED me\u0161to"],
  ["CZ-20", "CZ", "St\u0159edo\u010Desk\xFD"],
  ["CZ-201", "CZ", "Bene\u0161ov"],
  ["CZ-202", "CZ", "Beroun"],
  ["CZ-203", "CZ", "Kladno"],
  ["CZ-204", "CZ", "Kol\xEDn"],
  ["CZ-205", "CZ", "Kutn\xE1 Hora"],
  ["CZ-206", "CZ", "M\u011Bln\xEDk"],
  ["CZ-207", "CZ", "Mlad\xE1 Boleslav"],
  ["CZ-208", "CZ", "Nymburk"],
  ["CZ-209", "CZ", "Prague-East"],
  ["CZ-20A", "CZ", "Prague-West"],
  ["CZ-20B", "CZ", "P\u0159\xEDbram"],
  ["CZ-20C", "CZ", "Rakovn\xEDk"],
  ["CZ-31", "CZ", "Jiho\u010Desk\xFD"],
  ["CZ-311", "CZ", "\u010Cesk\xE9 Bud\u011Bjovice"],
  ["CZ-312", "CZ", "\u010Cesk\xFD Krumlov"],
  ["CZ-313", "CZ", "Jind\u0159ich\u016Fv Hradec"],
  ["CZ-314", "CZ", "P\xEDsek"],
  ["CZ-315", "CZ", "Prachatice"],
  ["CZ-316", "CZ", "Strakonice"],
  ["CZ-317", "CZ", "T\xE1bor"],
  ["CZ-32", "CZ", "Plze\u0148sk\xFD"],
  ["CZ-321", "CZ", "Doma\u017Elice"],
  ["CZ-322", "CZ", "Klatovy"],
  ["CZ-323", "CZ", "Plze\u0148"],
  ["CZ-324", "CZ", "Plze\u0148-South"],
  ["CZ-325", "CZ", "Plze\u0148-North"],
  ["CZ-326", "CZ", "Rokycany"],
  ["CZ-327", "CZ", "Tachov"],
  ["CZ-41", "CZ", "Karlovarsk\xFD"],
  ["CZ-411", "CZ", "Cheb"],
  ["CZ-412", "CZ", "Karlovy Vary"],
  ["CZ-413", "CZ", "Sokolov"],
  ["CZ-42", "CZ", "\xDAsteck\xFD"],
  ["CZ-421", "CZ", "D\u011B\u010D\xEDn"],
  ["CZ-422", "CZ", "Chomutov"],
  ["CZ-423", "CZ", "Litom\u011B\u0159ice"],
  ["CZ-424", "CZ", "Louny"],
  ["CZ-425", "CZ", "Most"],
  ["CZ-426", "CZ", "Teplice"],
  ["CZ-427", "CZ", "\xDAst\xED nad Labem"],
  ["CZ-51", "CZ", "Libereck\xFD"],
  ["CZ-511", "CZ", "\u010Cesk\xE1 L\xEDpa"],
  ["CZ-512", "CZ", "Jablonec nad Nisou"],
  ["CZ-513", "CZ", "Liberec"],
  ["CZ-514", "CZ", "Semily"],
  ["CZ-52", "CZ", "Kr\xE1lov\xE9hradeck\xFD"],
  ["CZ-521", "CZ", "Hradec Kr\xE1lov\xE9"],
  ["CZ-522", "CZ", "Ji\u010D\xEDn"],
  ["CZ-523", "CZ", "N\xE1chod"],
  ["CZ-524", "CZ", "Rychnov nad Kn\u011B\u017Enou"],
  ["CZ-525", "CZ", "Trutnov"],
  ["CZ-53", "CZ", "Pardubick\xFD"],
  ["CZ-531", "CZ", "Chrudim"],
  ["CZ-532", "CZ", "Pardubice"],
  ["CZ-533", "CZ", "Svitavy"],
  ["CZ-534", "CZ", "\xDAst\xED nad Orlic\xED"],
  ["CZ-63", "CZ", "Vyso\u010Dina"],
  ["CZ-631", "CZ", "Havl\xED\u010Dk\u016Fv Brod"],
  ["CZ-632", "CZ", "Jihlava"],
  ["CZ-633", "CZ", "Pelh\u0159imov"],
  ["CZ-634", "CZ", "T\u0159eb\xED\u010D"],
  ["CZ-635", "CZ", "\u017D\u010F\xE1r nad S\xE1zavou"],
  ["CZ-64", "CZ", "Jihomoravsk\xFD"],
  ["CZ-641", "CZ", "Blansko"],
  ["CZ-642", "CZ", "Brno-m\u011Bsto"],
  ["CZ-643", "CZ", "Brno-venkov"],
  ["CZ-644", "CZ", "B\u0159eclav"],
  ["CZ-645", "CZ", "Hodon\xEDn"],
  ["CZ-646", "CZ", "Vy\u0161kov"],
  ["CZ-647", "CZ", "Znojmo"],
  ["CZ-71", "CZ", "Olomouck\xFD"],
  ["CZ-711", "CZ", "Jesen\xEDk"],
  ["CZ-712", "CZ", "Olomouc"],
  ["CZ-713", "CZ", "Prost\u011Bjov"],
  ["CZ-714", "CZ", "P\u0159erov"],
  ["CZ-715", "CZ", "\u0160umperk"],
  ["CZ-72", "CZ", "Zl\xEDnsk\xFD"],
  ["CZ-721", "CZ", "Krom\u011B\u0159\xED\u017E"],
  ["CZ-722", "CZ", "Uhersk\xE9 Hradi\u0161t\u011B"],
  ["CZ-723", "CZ", "Vset\xEDn"],
  ["CZ-724", "CZ", "Zl\xEDn"],
  ["CZ-80", "CZ", "Moravskoslezsk\xFD"],
  ["CZ-801", "CZ", "Brunt\xE1l"],
  ["CZ-802", "CZ", "Fr\xFDdek-M\xEDstek"],
  ["CZ-803", "CZ", "Karvin\xE1"],
  ["CZ-804", "CZ", "Nov\xFD Ji\u010D\xEDn"],
  ["CZ-805", "CZ", "Opava"],
  ["CZ-806", "CZ", "Ostrava"],
  ["DE-BB", "DE", "Brandenburg"],
  ["DE-BE", "DE", "Berlin"],
  ["DE-BW", "DE", "Baden-W\xFCrttemberg"],
  ["DE-BY", "DE", "Bavaria"],
  ["DE-HB", "DE", "Bremen"],
  ["DE-HE", "DE", "Hesse"],
  ["DE-HH", "DE", "Hamburg"],
  ["DE-MV", "DE", "Mecklenburg-Vorpommern"],
  ["DE-NI", "DE", "Lower Saxony"],
  ["DE-NW", "DE", "North Rhine-Westphalia"],
  ["DE-RP", "DE", "Rhineland-Palatinate"],
  ["DE-SH", "DE", "Schleswig-Holstein"],
  ["DE-SL", "DE", "Saarland"],
  ["DE-SN", "DE", "Saxony"],
  ["DE-ST", "DE", "Saxony-Anhalt"],
  ["DE-TH", "DE", "Thuringia"],
  ["DJ-AR", "DJ", "Arta"],
  ["DJ-AS", "DJ", "Ali Sabieh"],
  ["DJ-DI", "DJ", "Dikhil"],
  ["DJ-DJ", "DJ", "Djibouti"],
  ["DJ-OB", "DJ", "Obock"],
  ["DJ-TA", "DJ", "Tadjourah"],
  ["DK-81", "DK", "Northern Denmark"],
  ["DK-82", "DK", "Central Denmark"],
  ["DK-83", "DK", "Southern Denmark"],
  ["DK-84", "DK", "Capital Region"],
  ["DK-85", "DK", "Zealand"],
  ["DM-02", "DM", "Saint Andrew"],
  ["DM-03", "DM", "Saint David"],
  ["DM-04", "DM", "Saint George"],
  ["DM-05", "DM", "Saint John"],
  ["DM-06", "DM", "Saint Joseph"],
  ["DM-07", "DM", "Saint Luke"],
  ["DM-08", "DM", "Saint Mark"],
  ["DM-09", "DM", "Saint Patrick"],
  ["DM-10", "DM", "Saint Paul"],
  ["DM-11", "DM", "Saint Peter"],
  ["DO-01", "DO", "Distrito Nacional"],
  ["DO-02", "DO", "Azua"],
  ["DO-03", "DO", "Baoruco"],
  ["DO-04", "DO", "Barahona"],
  ["DO-05", "DO", "Dajab\xF3n"],
  ["DO-06", "DO", "Duarte"],
  ["DO-07", "DO", "El\xEDas Pi\xF1a"],
  ["DO-08", "DO", "El Seibo"],
  ["DO-09", "DO", "Espaillat"],
  ["DO-10", "DO", "Independencia"],
  ["DO-11", "DO", "La Altagracia"],
  ["DO-12", "DO", "La Romana"],
  ["DO-13", "DO", "La Vega"],
  ["DO-14", "DO", "Mar\xEDa Trinidad S\xE1nchez"],
  ["DO-15", "DO", "Monte Cristi"],
  ["DO-16", "DO", "Pedernales"],
  ["DO-17", "DO", "Peravia"],
  ["DO-18", "DO", "Puerto Plata"],
  ["DO-19", "DO", "Hermanas Mirabal"],
  ["DO-20", "DO", "Saman\xE1"],
  ["DO-21", "DO", "San Crist\xF3bal"],
  ["DO-22", "DO", "San Juan"],
  ["DO-23", "DO", "San Pedro de Macor\xEDs"],
  ["DO-24", "DO", "S\xE1nchez Ram\xEDrez"],
  ["DO-25", "DO", "Santiago"],
  ["DO-26", "DO", "Santiago Rodr\xEDguez"],
  ["DO-27", "DO", "Valverde"],
  ["DO-28", "DO", "Monse\xF1or Nouel"],
  ["DO-29", "DO", "Monte Plata"],
  ["DO-30", "DO", "Hato Mayor"],
  ["DO-31", "DO", "San Jos\xE9 de Ocoa"],
  ["DO-32", "DO", "Santo Domingo"],
  ["DO-33", "DO", "Cibao Nordeste"],
  ["DO-34", "DO", "Cibao Noroeste"],
  ["DO-35", "DO", "Cibao Norte"],
  ["DO-36", "DO", "Cibao Sur"],
  ["DO-37", "DO", "El Valle"],
  ["DO-38", "DO", "Enriquillo"],
  ["DO-39", "DO", "Hig\xFCamo"],
  ["DO-40", "DO", "Ozama"],
  ["DO-41", "DO", "Valdesia"],
  ["DO-42", "DO", "Yuma"],
  ["DZ-01", "DZ", "Adrar"],
  ["DZ-02", "DZ", "Chlef"],
  ["DZ-03", "DZ", "Laghouat"],
  ["DZ-04", "DZ", "Oum El Bouaghi"],
  ["DZ-05", "DZ", "Batna"],
  ["DZ-06", "DZ", "B\xE9ja\xEFa"],
  ["DZ-07", "DZ", "Biskra"],
  ["DZ-08", "DZ", "B\xE9char"],
  ["DZ-09", "DZ", "Blida"],
  ["DZ-10", "DZ", "Bouira"],
  ["DZ-11", "DZ", "Tamanghasset"],
  ["DZ-12", "DZ", "T\xE9bessa"],
  ["DZ-13", "DZ", "Tlemcen"],
  ["DZ-14", "DZ", "Tiaret"],
  ["DZ-15", "DZ", "Tizi Ouzou"],
  ["DZ-16", "DZ", "Algiers"],
  ["DZ-17", "DZ", "Djelfa"],
  ["DZ-18", "DZ", "Jijel"],
  ["DZ-19", "DZ", "S\xE9tif"],
  ["DZ-20", "DZ", "Sa\xEFda"],
  ["DZ-21", "DZ", "Skikda"],
  ["DZ-22", "DZ", "Sidi Bel Abb\xE8s"],
  ["DZ-23", "DZ", "Annaba"],
  ["DZ-24", "DZ", "Guelma"],
  ["DZ-25", "DZ", "Constantine"],
  ["DZ-26", "DZ", "M\xE9d\xE9a"],
  ["DZ-27", "DZ", "Mostaganem"],
  ["DZ-28", "DZ", "M\u2019Sila"],
  ["DZ-29", "DZ", "Mascara"],
  ["DZ-30", "DZ", "Ouargla"],
  ["DZ-31", "DZ", "Oran"],
  ["DZ-32", "DZ", "El Bayadh"],
  ["DZ-33", "DZ", "Illizi"],
  ["DZ-34", "DZ", "Bordj Bou Arr\xE9ridj"],
  ["DZ-35", "DZ", "Boumerd\xE8s"],
  ["DZ-36", "DZ", "El Tarf"],
  ["DZ-37", "DZ", "Tindouf"],
  ["DZ-38", "DZ", "Tissemsilt"],
  ["DZ-39", "DZ", "El Oued"],
  ["DZ-40", "DZ", "Khenchela"],
  ["DZ-41", "DZ", "Souk Ahras"],
  ["DZ-42", "DZ", "Tipasa"],
  ["DZ-43", "DZ", "Mila"],
  ["DZ-44", "DZ", "A\xEFn Defla"],
  ["DZ-45", "DZ", "Naama"],
  ["DZ-46", "DZ", "A\xEFn T\xE9mouchent"],
  ["DZ-47", "DZ", "Gharda\xEFa"],
  ["DZ-48", "DZ", "Relizane"],
  ["DZ-49", "DZ", "Timimoun"],
  ["DZ-50", "DZ", "Bordj Badji Mokhtar"],
  ["DZ-51", "DZ", "Ouled Djellal"],
  ["DZ-52", "DZ", "B\xE9ni Abb\xE8s"],
  ["DZ-53", "DZ", "In Salah"],
  ["DZ-54", "DZ", "In Guezzam"],
  ["DZ-55", "DZ", "Touggourt"],
  ["DZ-56", "DZ", "Djanet"],
  ["DZ-57", "DZ", "El Meghaier"],
  ["DZ-58", "DZ", "El Meniaa"],
  ["EC-A", "EC", "Azuay"],
  ["EC-B", "EC", "Bol\xEDvar"],
  ["EC-C", "EC", "Carchi"],
  ["EC-D", "EC", "Orellana"],
  ["EC-E", "EC", "Esmeraldas"],
  ["EC-F", "EC", "Ca\xF1ar"],
  ["EC-G", "EC", "Guayas"],
  ["EC-H", "EC", "Chimborazo"],
  ["EC-I", "EC", "Imbabura"],
  ["EC-L", "EC", "Loja"],
  ["EC-M", "EC", "Manab\xED"],
  ["EC-N", "EC", "Napo"],
  ["EC-O", "EC", "El Oro"],
  ["EC-P", "EC", "Pichincha"],
  ["EC-R", "EC", "Los R\xEDos"],
  ["EC-S", "EC", "Morona-Santiago"],
  ["EC-SD", "EC", "Santo Domingo de los Ts\xE1chilas"],
  ["EC-SE", "EC", "Santa Elena"],
  ["EC-T", "EC", "Tungurahua"],
  ["EC-U", "EC", "Sucumb\xEDos"],
  ["EC-W", "EC", "Gal\xE1pagos"],
  ["EC-X", "EC", "Cotopaxi"],
  ["EC-Y", "EC", "Pastaza"],
  ["EC-Z", "EC", "Zamora-Chinchipe"],
  ["EE-130", "EE", "Alutaguse"],
  ["EE-141", "EE", "Anija"],
  ["EE-142", "EE", "Antsla"],
  ["EE-171", "EE", "Elva"],
  ["EE-184", "EE", "Haapsalu"],
  ["EE-191", "EE", "Haljala"],
  ["EE-198", "EE", "Harku"],
  ["EE-205", "EE", "Hiiumaa"],
  ["EE-214", "EE", "H\xE4\xE4demeeste"],
  ["EE-245", "EE", "J\xF5el\xE4htme"],
  ["EE-247", "EE", "J\xF5geva"],
  ["EE-251", "EE", "J\xF5hvi"],
  ["EE-255", "EE", "J\xE4rva"],
  ["EE-272", "EE", "Kadrina"],
  ["EE-283", "EE", "Kambja"],
  ["EE-284", "EE", "Kanepi"],
  ["EE-291", "EE", "Kastre"],
  ["EE-293", "EE", "Kehtna"],
  ["EE-296", "EE", "Keila"],
  ["EE-303", "EE", "Kihnu"],
  ["EE-305", "EE", "Kiili"],
  ["EE-317", "EE", "Kohila"],
  ["EE-321", "EE", "Kohtla-J\xE4rve"],
  ["EE-338", "EE", "Kose"],
  ["EE-353", "EE", "Kuusalu"],
  ["EE-37", "EE", "Harju"],
  ["EE-39", "EE", "Hiiu"],
  ["EE-424", "EE", "Loksa"],
  ["EE-430", "EE", "L\xE4\xE4neranna"],
  ["EE-431", "EE", "L\xE4\xE4ne-Harju"],
  ["EE-432", "EE", "Luunja"],
  ["EE-441", "EE", "L\xE4\xE4ne-Nigula"],
  ["EE-442", "EE", "L\xFCganuse"],
  ["EE-446", "EE", "Maardu"],
  ["EE-45", "EE", "Ida-Virumaa"],
  ["EE-478", "EE", "Muhu"],
  ["EE-480", "EE", "Mulgi"],
  ["EE-486", "EE", "Mustvee"],
  ["EE-50", "EE", "J\xF5gevamaa"],
  ["EE-503", "EE", "M\xE4rjamaa"],
  ["EE-511", "EE", "Narva"],
  ["EE-514", "EE", "Narva-J\xF5esuu"],
  ["EE-52", "EE", "J\xE4rvamaa"],
  ["EE-528", "EE", "N\xF5o"],
  ["EE-557", "EE", "Otep\xE4\xE4"],
  ["EE-56", "EE", "L\xE4\xE4nemaa"],
  ["EE-567", "EE", "Paide"],
  ["EE-586", "EE", "Peipsi\xE4\xE4re"],
  ["EE-60", "EE", "L\xE4\xE4ne-Virumaa"],
  ["EE-615", "EE", "P\xF5hja-Sakala"],
  ["EE-618", "EE", "P\xF5ltsamaa"],
  ["EE-622", "EE", "P\xF5lva"],
  ["EE-624", "EE", "P\xE4rnu"],
  ["EE-638", "EE", "P\xF5hja-P\xE4rnumaa"],
  ["EE-64", "EE", "P\xF5lvamaa"],
  ["EE-651", "EE", "Raasiku"],
  ["EE-653", "EE", "Rae"],
  ["EE-661", "EE", "Rakvere"],
  ["EE-663", "EE", "Rakvere\xB2"],
  ["EE-668", "EE", "Rapla"],
  ["EE-68", "EE", "P\xE4rnumaa"],
  ["EE-689", "EE", "Ruhnu"],
  ["EE-698", "EE", "R\xF5uge"],
  ["EE-708", "EE", "R\xE4pina"],
  ["EE-71", "EE", "Raplamaa"],
  ["EE-712", "EE", "Saarde"],
  ["EE-714", "EE", "Saaremaa"],
  ["EE-719", "EE", "Saku"],
  ["EE-726", "EE", "Saue"],
  ["EE-732", "EE", "Setomaa"],
  ["EE-735", "EE", "Sillam\xE4e"],
  ["EE-74", "EE", "Saare"],
  ["EE-784", "EE", "Tallinn"],
  ["EE-79", "EE", "Tartumaa"],
  ["EE-792", "EE", "Tapa"],
  ["EE-793", "EE", "Tartu"],
  ["EE-796", "EE", "Tartu\xB2"],
  ["EE-803", "EE", "Toila"],
  ["EE-809", "EE", "Tori"],
  ["EE-81", "EE", "Valgamaa"],
  ["EE-824", "EE", "T\xF5rva"],
  ["EE-834", "EE", "T\xFCri"],
  ["EE-84", "EE", "Viljandi"],
  ["EE-855", "EE", "Valga"],
  ["EE-87", "EE", "V\xF5rumaa"],
  ["EE-890", "EE", "Viimsi"],
  ["EE-897", "EE", "Viljandi\xB2"],
  ["EE-899", "EE", "Viljandi\xB3"],
  ["EE-901", "EE", "Vinni"],
  ["EE-903", "EE", "Viru-Nigula"],
  ["EE-907", "EE", "Vormsi"],
  ["EE-917", "EE", "V\xF5ru\xB2"],
  ["EE-919", "EE", "V\xF5ru"],
  ["EE-928", "EE", "V\xE4ike-Maarja"],
  ["EG-ALX", "EG", "Alexandria"],
  ["EG-ASN", "EG", "Aswan"],
  ["EG-AST", "EG", "Asyut"],
  ["EG-BA", "EG", "Red Sea"],
  ["EG-BH", "EG", "Beheira"],
  ["EG-BNS", "EG", "Beni Suef"],
  ["EG-C", "EG", "Cairo"],
  ["EG-DK", "EG", "Dakahlia"],
  ["EG-DT", "EG", "Damietta"],
  ["EG-FYM", "EG", "Faiyum"],
  ["EG-GH", "EG", "Gharbia"],
  ["EG-GZ", "EG", "Giza"],
  ["EG-IS", "EG", "Ismailia"],
  ["EG-JS", "EG", "South Sinai"],
  ["EG-KB", "EG", "Qalyubia"],
  ["EG-KFS", "EG", "Kafr el-Sheikh"],
  ["EG-KN", "EG", "Qena"],
  ["EG-LX", "EG", "Luxor"],
  ["EG-MN", "EG", "Minya"],
  ["EG-MNF", "EG", "Monufia"],
  ["EG-MT", "EG", "Matrouh"],
  ["EG-PTS", "EG", "Port Said"],
  ["EG-SHG", "EG", "Sohag"],
  ["EG-SHR", "EG", "Al Sharqia"],
  ["EG-SIN", "EG", "North Sinai"],
  ["EG-SUZ", "EG", "Suez"],
  ["EG-WAD", "EG", "New Valley"],
  ["ER-AN", "ER", "Anseba"],
  ["ER-DK", "ER", "Southern Red Sea"],
  ["ER-DU", "ER", "Debub"],
  ["ER-GB", "ER", "Gash-Barka"],
  ["ER-MA", "ER", "Maekel"],
  ["ER-SK", "ER", "Northern Red Sea"],
  ["ES-A", "ES", "Alicante"],
  ["ES-AB", "ES", "Albacete"],
  ["ES-AL", "ES", "Almer\xEDa"],
  ["ES-AN", "ES", "Andalusia"],
  ["ES-AR", "ES", "Aragon"],
  ["ES-AS", "ES", "Asturias"],
  ["ES-AV", "ES", "\xC1vila"],
  ["ES-B", "ES", "Barcelona"],
  ["ES-BA", "ES", "Badajoz"],
  ["ES-BI", "ES", "Biscay"],
  ["ES-BU", "ES", "Burgos"],
  ["ES-C", "ES", "A Coru\xF1a"],
  ["ES-CA", "ES", "C\xE1diz"],
  ["ES-CB", "ES", "Cantabria"],
  ["ES-CC", "ES", "C\xE1ceres"],
  ["ES-CE", "ES", "Ceuta"],
  ["ES-CL", "ES", "Castile and Le\xF3n"],
  ["ES-CM", "ES", "Castile-La Mancha"],
  ["ES-CN", "ES", "Canary Islands"],
  ["ES-CO", "ES", "C\xF3rdoba"],
  ["ES-CR", "ES", "Ciudad Real"],
  ["ES-CS", "ES", "Castell\xF3n"],
  ["ES-CT", "ES", "Catalonia"],
  ["ES-CU", "ES", "Cuenca"],
  ["ES-EX", "ES", "Extremadura"],
  ["ES-GA", "ES", "Galicia"],
  ["ES-GC", "ES", "Las Palmas"],
  ["ES-GI", "ES", "Girona"],
  ["ES-GR", "ES", "Granada"],
  ["ES-GU", "ES", "Guadalajara"],
  ["ES-H", "ES", "Huelva"],
  ["ES-HU", "ES", "Huesca"],
  ["ES-IB", "ES", "Balearic Islands"],
  ["ES-J", "ES", "Ja\xE9n"],
  ["ES-L", "ES", "Lleida"],
  ["ES-LE", "ES", "Le\xF3n"],
  ["ES-LO", "ES", "La Rioja Province"],
  ["ES-LU", "ES", "Lugo"],
  ["ES-M", "ES", "Madrid Province"],
  ["ES-MA", "ES", "M\xE1laga"],
  ["ES-MC", "ES", "Murcia Region"],
  ["ES-MD", "ES", "Madrid Autonomous Community"],
  ["ES-ML", "ES", "Melilla"],
  ["ES-MU", "ES", "Murcia"],
  ["ES-NA", "ES", "Navarra"],
  ["ES-NC", "ES", "Navarra Chartered Community"],
  ["ES-O", "ES", "Asturias Province"],
  ["ES-OR", "ES", "Ourense"],
  ["ES-P", "ES", "Palencia"],
  ["ES-PM", "ES", "Balears Province"],
  ["ES-PO", "ES", "Pontevedra"],
  ["ES-PV", "ES", "Basque Country"],
  ["ES-RI", "ES", "La Rioja"],
  ["ES-S", "ES", "Cantabria Province"],
  ["ES-SA", "ES", "Salamanca"],
  ["ES-SE", "ES", "Seville"],
  ["ES-SG", "ES", "Segovia"],
  ["ES-SO", "ES", "Soria"],
  ["ES-SS", "ES", "Gipuzkoa"],
  ["ES-T", "ES", "Tarragona"],
  ["ES-TE", "ES", "Teruel"],
  ["ES-TF", "ES", "Santa Cruz de Tenerife"],
  ["ES-TO", "ES", "Toledo"],
  ["ES-V", "ES", "Valencia"],
  ["ES-VA", "ES", "Valladolid"],
  ["ES-VC", "ES", "Valencian Community"],
  ["ES-VI", "ES", "\xC1lava"],
  ["ES-Z", "ES", "Zaragoza"],
  ["ES-ZA", "ES", "Zamora"],
  ["ET-AA", "ET", "Addis Ababa"],
  ["ET-AF", "ET", "Afar"],
  ["ET-AM", "ET", "Amhara"],
  ["ET-BE", "ET", "Benishangul-Gumuz"],
  ["ET-DD", "ET", "Dire Dawa"],
  ["ET-GA", "ET", "Gambela"],
  ["ET-HA", "ET", "Harari"],
  ["ET-OR", "ET", "Oromia"],
  ["ET-SI", "ET", "Sidama"],
  ["ET-SN", "ET", "Southern Nations, Nationalities, and Peoples"],
  ["ET-SO", "ET", "Somali"],
  ["ET-SW", "ET", "Southwest Ethiopia Peoples"],
  ["ET-TI", "ET", "Tigray"],
  ["FI-01", "FI", "\xC5land"],
  ["FI-02", "FI", "South Karelia"],
  ["FI-03", "FI", "Southern Ostrobothnia"],
  ["FI-04", "FI", "Southern Savonia"],
  ["FI-05", "FI", "Kainuu"],
  ["FI-06", "FI", "Tavastia Proper"],
  ["FI-07", "FI", "Central Ostrobothnia"],
  ["FI-08", "FI", "Central Finland"],
  ["FI-09", "FI", "Kymenlaakso"],
  ["FI-10", "FI", "Lapland"],
  ["FI-11", "FI", "Pirkanmaa"],
  ["FI-12", "FI", "Ostrobothnia"],
  ["FI-13", "FI", "North Karelia"],
  ["FI-14", "FI", "Northern Ostrobothnia"],
  ["FI-15", "FI", "Northern Savonia"],
  ["FI-16", "FI", "P\xE4ij\xE4nne Tavastia"],
  ["FI-17", "FI", "Satakunta"],
  ["FI-18", "FI", "Uusimaa"],
  ["FI-19", "FI", "Southwest Finland"],
  ["FJ-01", "FJ", "Ba"],
  ["FJ-02", "FJ", "Bua"],
  ["FJ-03", "FJ", "Cakaudrove"],
  ["FJ-04", "FJ", "Kadavu"],
  ["FJ-05", "FJ", "Lau"],
  ["FJ-06", "FJ", "Lomaiviti"],
  ["FJ-07", "FJ", "Macuata"],
  ["FJ-08", "FJ", "Nadroga-Navosa"],
  ["FJ-09", "FJ", "Naitasiri"],
  ["FJ-10", "FJ", "Namosi"],
  ["FJ-11", "FJ", "Ra"],
  ["FJ-12", "FJ", "Rewa"],
  ["FJ-13", "FJ", "Serua"],
  ["FJ-14", "FJ", "Tailevu"],
  ["FJ-C", "FJ", "Central"],
  ["FJ-E", "FJ", "Eastern"],
  ["FJ-N", "FJ", "Northern"],
  ["FJ-R", "FJ", "Rotuma"],
  ["FJ-W", "FJ", "Western"],
  ["FM-KSA", "FM", "Kosrae"],
  ["FM-PNI", "FM", "Pohnpei"],
  ["FM-TRK", "FM", "Chuuk"],
  ["FM-YAP", "FM", "Yap"],
  ["FR-01", "FR", "Ain"],
  ["FR-02", "FR", "Aisne"],
  ["FR-03", "FR", "Allier"],
  ["FR-04", "FR", "Alpes-de-Haute-Provence"],
  ["FR-05", "FR", "Hautes-Alpes"],
  ["FR-06", "FR", "Alpes-Maritimes"],
  ["FR-07", "FR", "Ard\xE8che"],
  ["FR-08", "FR", "Ardennes"],
  ["FR-09", "FR", "Ari\xE8ge"],
  ["FR-10", "FR", "Aube"],
  ["FR-11", "FR", "Aude"],
  ["FR-12", "FR", "Aveyron"],
  ["FR-13", "FR", "Bouches-du-Rh\xF4ne"],
  ["FR-14", "FR", "Calvados"],
  ["FR-15", "FR", "Cantal"],
  ["FR-16", "FR", "Charente"],
  ["FR-17", "FR", "Charente-Maritime"],
  ["FR-18", "FR", "Cher"],
  ["FR-19", "FR", "Corr\xE8ze"],
  ["FR-20R", "FR", "Corse"],
  ["FR-21", "FR", "C\xF4te-d\u2019Or"],
  ["FR-22", "FR", "C\xF4tes-d\u2019Armor"],
  ["FR-23", "FR", "Creuse"],
  ["FR-24", "FR", "Dordogne"],
  ["FR-25", "FR", "Doubs"],
  ["FR-26", "FR", "Dr\xF4me"],
  ["FR-27", "FR", "Eure"],
  ["FR-28", "FR", "Eure-et-Loir"],
  ["FR-29", "FR", "Finist\xE8re"],
  ["FR-2A", "FR", "Corse-du-Sud"],
  ["FR-2B", "FR", "Haute-Corse"],
  ["FR-30", "FR", "Gard"],
  ["FR-31", "FR", "Haute-Garonne"],
  ["FR-32", "FR", "Gers"],
  ["FR-33", "FR", "Gironde"],
  ["FR-34", "FR", "H\xE9rault"],
  ["FR-35", "FR", "Ille-et-Vilaine"],
  ["FR-36", "FR", "Indre"],
  ["FR-37", "FR", "Indre-et-Loire"],
  ["FR-38", "FR", "Is\xE8re"],
  ["FR-39", "FR", "Jura"],
  ["FR-40", "FR", "Landes"],
  ["FR-41", "FR", "Loir-et-Cher"],
  ["FR-42", "FR", "Loire"],
  ["FR-43", "FR", "Haute-Loire"],
  ["FR-44", "FR", "Loire-Atlantique"],
  ["FR-45", "FR", "Loiret"],
  ["FR-46", "FR", "Lot"],
  ["FR-47", "FR", "Lot-et-Garonne"],
  ["FR-48", "FR", "Loz\xE8re"],
  ["FR-49", "FR", "Maine-et-Loire"],
  ["FR-50", "FR", "Manche"],
  ["FR-51", "FR", "Marne"],
  ["FR-52", "FR", "Haute-Marne"],
  ["FR-53", "FR", "Mayenne"],
  ["FR-54", "FR", "Meurthe-et-Moselle"],
  ["FR-55", "FR", "Meuse"],
  ["FR-56", "FR", "Morbihan"],
  ["FR-57", "FR", "Moselle"],
  ["FR-58", "FR", "Ni\xE8vre"],
  ["FR-59", "FR", "Nord"],
  ["FR-60", "FR", "Oise"],
  ["FR-61", "FR", "Orne"],
  ["FR-62", "FR", "Pas-de-Calais"],
  ["FR-63", "FR", "Puy-de-D\xF4me"],
  ["FR-64", "FR", "Pyr\xE9n\xE9es-Atlantiques"],
  ["FR-65", "FR", "Hautes-Pyr\xE9n\xE9es"],
  ["FR-66", "FR", "Pyr\xE9n\xE9es-Orientales"],
  ["FR-67", "FR", "Bas-Rhin"],
  ["FR-68", "FR", "Haut-Rhin"],
  ["FR-69", "FR", "Rh\xF4ne"],
  ["FR-69M", "FR", "M\xE9tropole de Lyon"],
  ["FR-6AE", "FR", "Alsace"],
  ["FR-70", "FR", "Haute-Sa\xF4ne"],
  ["FR-71", "FR", "Sa\xF4ne-et-Loire"],
  ["FR-72", "FR", "Sarthe"],
  ["FR-73", "FR", "Savoie"],
  ["FR-74", "FR", "Haute-Savoie"],
  ["FR-75C", "FR", "Paris"],
  ["FR-76", "FR", "Seine-Maritime"],
  ["FR-77", "FR", "Seine-et-Marne"],
  ["FR-78", "FR", "Yvelines"],
  ["FR-79", "FR", "Deux-S\xE8vres"],
  ["FR-80", "FR", "Somme"],
  ["FR-81", "FR", "Tarn"],
  ["FR-82", "FR", "Tarn-et-Garonne"],
  ["FR-83", "FR", "Var"],
  ["FR-84", "FR", "Vaucluse"],
  ["FR-85", "FR", "Vend\xE9e"],
  ["FR-86", "FR", "Vienne"],
  ["FR-87", "FR", "Haute-Vienne"],
  ["FR-88", "FR", "Vosges"],
  ["FR-89", "FR", "Yonne"],
  ["FR-90", "FR", "Territoire de Belfort"],
  ["FR-91", "FR", "Essonne"],
  ["FR-92", "FR", "Hauts-de-Seine"],
  ["FR-93", "FR", "Seine-Saint-Denis"],
  ["FR-94", "FR", "Val-de-Marne"],
  ["FR-95", "FR", "Val-d\u2019Oise"],
  ["FR-971", "FR", "Guadeloupe"],
  ["FR-972", "FR", "Martinique"],
  ["FR-973", "FR", "Guyane (fran\xE7aise)"],
  ["FR-974", "FR", "La R\xE9union"],
  ["FR-976", "FR", "Mayotte"],
  ["FR-ARA", "FR", "Auvergne-Rh\xF4ne-Alpes"],
  ["FR-BFC", "FR", "Burgundy-Franche-Comt\xE9"],
  ["FR-BL", "FR", "St. Barth\xE9lemy"],
  ["FR-BRE", "FR", "Brittany"],
  ["FR-CP", "FR", "Clipperton Island"],
  ["FR-CVL", "FR", "Centre-Val de Loire"],
  ["FR-GES", "FR", "Grand-Est"],
  ["FR-HDF", "FR", "Hauts-de-France"],
  ["FR-IDF", "FR", "\xCEle-de-France\xB2"],
  ["FR-MF", "FR", "St. Martin"],
  ["FR-NAQ", "FR", "Nouvelle-Aquitaine"],
  ["FR-NC", "FR", "New Caledonia"],
  ["FR-NOR", "FR", "Normandie"],
  ["FR-OCC", "FR", "Occitanie"],
  ["FR-PAC", "FR", "Provence-Alpes-C\xF4te-d\u2019Azur"],
  ["FR-PDL", "FR", "Pays-de-la-Loire"],
  ["FR-PF", "FR", "French Polynesia"],
  ["FR-PM", "FR", "St. Pierre & Miquelon"],
  ["FR-TF", "FR", "French Southern Territories"],
  ["FR-WF", "FR", "Wallis & Futuna"],
  ["GA-1", "GA", "Estuaire"],
  ["GA-2", "GA", "Haut-Ogoou\xE9"],
  ["GA-3", "GA", "Moyen-Ogoou\xE9"],
  ["GA-4", "GA", "Ngouni\xE9"],
  ["GA-5", "GA", "Nyanga"],
  ["GA-6", "GA", "Ogoou\xE9-Ivindo"],
  ["GA-7", "GA", "Ogoou\xE9-Lolo"],
  ["GA-8", "GA", "Ogoou\xE9-Maritime"],
  ["GA-9", "GA", "Woleu-Ntem"],
  ["GB-ABC", "GB", "Armagh, Banbridge and Craigavon"],
  ["GB-ABD", "GB", "Aberdeenshire"],
  ["GB-ABE", "GB", "Aberdeen"],
  ["GB-AGB", "GB", "Argyll and Bute"],
  ["GB-AGY", "GB", "Anglesey"],
  ["GB-AND", "GB", "Ards and North Down"],
  ["GB-ANN", "GB", "Antrim and Newtownabbey"],
  ["GB-ANS", "GB", "Angus"],
  ["GB-BAS", "GB", "Bath and North East Somerset"],
  ["GB-BBD", "GB", "Blackburn with Darwen"],
  ["GB-BCP", "GB", "Bournemouth, Christchurch and Poole"],
  ["GB-BDF", "GB", "Bedford"],
  ["GB-BDG", "GB", "Barking and Dagenham"],
  ["GB-BEN", "GB", "Brent"],
  ["GB-BEX", "GB", "Bexley"],
  ["GB-BFS", "GB", "Belfast"],
  ["GB-BGE", "GB", "Bridgend"],
  ["GB-BGW", "GB", "Blaenau Gwent"],
  ["GB-BIR", "GB", "Birmingham"],
  ["GB-BKM", "GB", "Buckinghamshire"],
  ["GB-BNE", "GB", "Barnet"],
  ["GB-BNH", "GB", "Brighton and Hove"],
  ["GB-BNS", "GB", "Barnsley"],
  ["GB-BOL", "GB", "Bolton"],
  ["GB-BPL", "GB", "Blackpool"],
  ["GB-BRC", "GB", "Bracknell Forest"],
  ["GB-BRD", "GB", "Bradford"],
  ["GB-BRY", "GB", "Bromley"],
  ["GB-BST", "GB", "Bristol"],
  ["GB-BUR", "GB", "Bury"],
  ["GB-CAM", "GB", "Cambridgeshire"],
  ["GB-CAY", "GB", "Caerphilly"],
  ["GB-CBF", "GB", "Central Bedfordshire"],
  ["GB-CCG", "GB", "Causeway Coast and Glens"],
  ["GB-CGN", "GB", "Ceredigion"],
  ["GB-CHE", "GB", "Cheshire East"],
  ["GB-CHW", "GB", "Cheshire West and Chester"],
  ["GB-CLD", "GB", "Calderdale"],
  ["GB-CLK", "GB", "Clackmannanshire"],
  ["GB-CMA", "GB", "Cumbria"],
  ["GB-CMD", "GB", "Camden"],
  ["GB-CMN", "GB", "Carmarthenshire"],
  ["GB-CON", "GB", "Cornwall"],
  ["GB-COV", "GB", "Coventry"],
  ["GB-CRF", "GB", "Cardiff"],
  ["GB-CRY", "GB", "Croydon"],
  ["GB-CWY", "GB", "Conwy"],
  ["GB-DAL", "GB", "Darlington"],
  ["GB-DBY", "GB", "Derbyshire"],
  ["GB-DEN", "GB", "Denbighshire"],
  ["GB-DER", "GB", "Derby"],
  ["GB-DEV", "GB", "Devon"],
  ["GB-DGY", "GB", "Dumfries and Galloway"],
  ["GB-DNC", "GB", "Doncaster"],
  ["GB-DND", "GB", "Dundee"],
  ["GB-DOR", "GB", "Dorset"],
  ["GB-DRS", "GB", "Derry and Strabane"],
  ["GB-DUD", "GB", "Dudley"],
  ["GB-DUR", "GB", "Durham"],
  ["GB-EAL", "GB", "Ealing"],
  ["GB-EAY", "GB", "East Ayrshire"],
  ["GB-EDH", "GB", "Edinburgh"],
  ["GB-EDU", "GB", "East Dunbartonshire"],
  ["GB-ELN", "GB", "East Lothian"],
  ["GB-ELS", "GB", "Outer Hebrides"],
  ["GB-ENF", "GB", "Enfield"],
  ["GB-ENG", "GB", "England"],
  ["GB-ERW", "GB", "East Renfrewshire"],
  ["GB-ERY", "GB", "East Riding of Yorkshire"],
  ["GB-ESS", "GB", "Essex"],
  ["GB-ESX", "GB", "East Sussex"],
  ["GB-FAL", "GB", "Falkirk"],
  ["GB-FIF", "GB", "Fife"],
  ["GB-FLN", "GB", "Flintshire"],
  ["GB-FMO", "GB", "Fermanagh and Omagh"],
  ["GB-GAT", "GB", "Gateshead"],
  ["GB-GLG", "GB", "Glasgow"],
  ["GB-GLS", "GB", "Gloucestershire"],
  ["GB-GRE", "GB", "Greenwich"],
  ["GB-GWN", "GB", "Gwynedd"],
  ["GB-HAL", "GB", "Halton"],
  ["GB-HAM", "GB", "Hampshire"],
  ["GB-HAV", "GB", "Havering"],
  ["GB-HCK", "GB", "Hackney"],
  ["GB-HEF", "GB", "Herefordshire"],
  ["GB-HIL", "GB", "Hillingdon"],
  ["GB-HLD", "GB", "Highland"],
  ["GB-HMF", "GB", "Hammersmith and Fulham"],
  ["GB-HNS", "GB", "Hounslow"],
  ["GB-HPL", "GB", "Hartlepool"],
  ["GB-HRT", "GB", "Hertfordshire"],
  ["GB-HRW", "GB", "Harrow"],
  ["GB-HRY", "GB", "Haringey"],
  ["GB-IOS", "GB", "Isles of Scilly"],
  ["GB-IOW", "GB", "Isle of Wight"],
  ["GB-ISL", "GB", "Islington"],
  ["GB-IVC", "GB", "Inverclyde"],
  ["GB-KEC", "GB", "Kensington and Chelsea"],
  ["GB-KEN", "GB", "Kent"],
  ["GB-KHL", "GB", "Kingston upon Hull"],
  ["GB-KIR", "GB", "Kirklees"],
  ["GB-KTT", "GB", "Kingston upon Thames"],
  ["GB-KWL", "GB", "Knowsley"],
  ["GB-LAN", "GB", "Lancashire"],
  ["GB-LBC", "GB", "Lisburn and Castlereagh"],
  ["GB-LBH", "GB", "Lambeth"],
  ["GB-LCE", "GB", "Leicester"],
  ["GB-LDS", "GB", "Leeds"],
  ["GB-LEC", "GB", "Leicestershire"],
  ["GB-LEW", "GB", "Lewisham"],
  ["GB-LIN", "GB", "Lincolnshire"],
  ["GB-LIV", "GB", "Liverpool"],
  ["GB-LND", "GB", "London"],
  ["GB-LUT", "GB", "Luton"],
  ["GB-MAN", "GB", "Manchester"],
  ["GB-MDB", "GB", "Middlesbrough"],
  ["GB-MDW", "GB", "Medway"],
  ["GB-MEA", "GB", "Mid and East Antrim"],
  ["GB-MIK", "GB", "Milton Keynes"],
  ["GB-MLN", "GB", "Midlothian"],
  ["GB-MON", "GB", "Monmouthshire"],
  ["GB-MRT", "GB", "Merton"],
  ["GB-MRY", "GB", "Moray"],
  ["GB-MTY", "GB", "Merthyr Tydfil"],
  ["GB-MUL", "GB", "Mid Ulster"],
  ["GB-NAY", "GB", "North Ayrshire"],
  ["GB-NBL", "GB", "Northumberland"],
  ["GB-NEL", "GB", "North East Lincolnshire"],
  ["GB-NET", "GB", "Newcastle upon Tyne"],
  ["GB-NFK", "GB", "Norfolk"],
  ["GB-NGM", "GB", "Nottingham"],
  ["GB-NIR", "GB", "Northern Ireland"],
  ["GB-NLK", "GB", "North Lanarkshire"],
  ["GB-NLN", "GB", "North Lincolnshire"],
  ["GB-NMD", "GB", "Newry, Mourne and Down"],
  ["GB-NNH", "GB", "North Northamptonshire"],
  ["GB-NSM", "GB", "North Somerset"],
  ["GB-NTL", "GB", "Neath Port Talbot"],
  ["GB-NTT", "GB", "Nottinghamshire"],
  ["GB-NTY", "GB", "North Tyneside"],
  ["GB-NWM", "GB", "Newham"],
  ["GB-NWP", "GB", "Newport"],
  ["GB-NYK", "GB", "North Yorkshire"],
  ["GB-OLD", "GB", "Oldham"],
  ["GB-ORK", "GB", "Orkney Islands"],
  ["GB-OXF", "GB", "Oxfordshire"],
  ["GB-PEM", "GB", "Pembrokeshire"],
  ["GB-PKN", "GB", "Perth and Kinross"],
  ["GB-PLY", "GB", "Plymouth"],
  ["GB-POR", "GB", "Portsmouth"],
  ["GB-POW", "GB", "Powys"],
  ["GB-PTE", "GB", "Peter"],
  ["GB-RCC", "GB", "Redcar and Cleveland"],
  ["GB-RCH", "GB", "Rochdale"],
  ["GB-RCT", "GB", "Rhondda Cynon Taf"],
  ["GB-RDB", "GB", "Redbridge"],
  ["GB-RDG", "GB", "Reading"],
  ["GB-RFW", "GB", "Renfrewshire"],
  ["GB-RIC", "GB", "Richmond upon Thames"],
  ["GB-ROT", "GB", "Rotherham"],
  ["GB-RUT", "GB", "Rutland"],
  ["GB-SAW", "GB", "Sandwell"],
  ["GB-SAY", "GB", "South Ayrshire"],
  ["GB-SCB", "GB", "Scottish Borders"],
  ["GB-SCT", "GB", "Scotland"],
  ["GB-SFK", "GB", "Suffolk"],
  ["GB-SFT", "GB", "Sefton"],
  ["GB-SGC", "GB", "South Gloucestershire"],
  ["GB-SHF", "GB", "Sheffield"],
  ["GB-SHN", "GB", "Saint Helens"],
  ["GB-SHR", "GB", "Shropshire"],
  ["GB-SKP", "GB", "Stockport"],
  ["GB-SLF", "GB", "Salford"],
  ["GB-SLG", "GB", "Slough"],
  ["GB-SLK", "GB", "South Lanarkshire"],
  ["GB-SND", "GB", "Sunderland"],
  ["GB-SOL", "GB", "Solihull"],
  ["GB-SOM", "GB", "Somerset"],
  ["GB-SOS", "GB", "Southend-on-Sea"],
  ["GB-SRY", "GB", "Surrey"],
  ["GB-STE", "GB", "Stoke-on-Trent"],
  ["GB-STG", "GB", "Stirling"],
  ["GB-STH", "GB", "Southampton"],
  ["GB-STN", "GB", "Sutton"],
  ["GB-STS", "GB", "Staffordshire"],
  ["GB-STT", "GB", "Stockton-on-Tees"],
  ["GB-STY", "GB", "South Tyneside"],
  ["GB-SWA", "GB", "Swansea"],
  ["GB-SWD", "GB", "Swindon"],
  ["GB-SWK", "GB", "Southwark"],
  ["GB-TAM", "GB", "Tameside"],
  ["GB-TFW", "GB", "Telford and Wrekin"],
  ["GB-THR", "GB", "Thurrock"],
  ["GB-TOB", "GB", "Torbay"],
  ["GB-TOF", "GB", "Torfaen"],
  ["GB-TRF", "GB", "Trafford"],
  ["GB-TWH", "GB", "Tower Hamlets"],
  ["GB-VGL", "GB", "Vale of Glamorgan"],
  ["GB-WAR", "GB", "Warwickshire"],
  ["GB-WBK", "GB", "West Berkshire"],
  ["GB-WDU", "GB", "West Dunbartonshire"],
  ["GB-WFT", "GB", "Waltham Forest"],
  ["GB-WGN", "GB", "Wigan"],
  ["GB-WIL", "GB", "Wiltshire"],
  ["GB-WKF", "GB", "Wakefield"],
  ["GB-WLL", "GB", "Walsall"],
  ["GB-WLN", "GB", "West Lothian"],
  ["GB-WLS", "GB", "Wales"],
  ["GB-WLV", "GB", "Wolverhampton"],
  ["GB-WND", "GB", "Wandsworth"],
  ["GB-WNH", "GB", "West Northamptonshire"],
  ["GB-WNM", "GB", "Windsor and Maidenhead"],
  ["GB-WOK", "GB", "Wokingham"],
  ["GB-WOR", "GB", "Worcestershire"],
  ["GB-WRL", "GB", "Wirral"],
  ["GB-WRT", "GB", "Warrington"],
  ["GB-WRX", "GB", "Wrexham"],
  ["GB-WSM", "GB", "Westminster"],
  ["GB-WSX", "GB", "West Sussex"],
  ["GB-YOR", "GB", "York"],
  ["GB-ZET", "GB", "Shetland"],
  ["GD-01", "GD", "Saint Andrew"],
  ["GD-02", "GD", "Saint David"],
  ["GD-03", "GD", "Saint George"],
  ["GD-04", "GD", "Saint John"],
  ["GD-05", "GD", "Saint Mark"],
  ["GD-06", "GD", "Saint Patrick"],
  ["GD-10", "GD", "Carriacou and Petite Martinique"],
  ["GE-AB", "GE", "Abkhazia"],
  ["GE-AJ", "GE", "Adjara"],
  ["GE-GU", "GE", "Guria"],
  ["GE-IM", "GE", "Imereti"],
  ["GE-KA", "GE", "Kakheti"],
  ["GE-KK", "GE", "Kvemo Kartli"],
  ["GE-MM", "GE", "Mtskheta-Mtianeti"],
  ["GE-RL", "GE", "Racha-Lechkhumi and Kvemo Svaneti"],
  ["GE-SJ", "GE", "Samtskhe-Javakheti"],
  ["GE-SK", "GE", "Shida Kartli"],
  ["GE-SZ", "GE", "Samegrelo-Zemo Svaneti"],
  ["GE-TB", "GE", "Tbilisi"],
  ["GH-AA", "GH", "Greater Accra"],
  ["GH-AF", "GH", "Ahafo"],
  ["GH-AH", "GH", "Ashanti"],
  ["GH-BE", "GH", "Bono East"],
  ["GH-BO", "GH", "Bono"],
  ["GH-CP", "GH", "Central"],
  ["GH-EP", "GH", "Eastern"],
  ["GH-NE", "GH", "North East"],
  ["GH-NP", "GH", "Northern"],
  ["GH-OT", "GH", "Oti"],
  ["GH-SV", "GH", "Savannah"],
  ["GH-TV", "GH", "Volta"],
  ["GH-UE", "GH", "Upper East"],
  ["GH-UW", "GH", "Upper West"],
  ["GH-WN", "GH", "Western North"],
  ["GH-WP", "GH", "Western"],
  ["GL-AV", "GL", "Avannaata Kommunia"],
  ["GL-KU", "GL", "Kujalleq"],
  ["GL-QE", "GL", "Qeqqata"],
  ["GL-QT", "GL", "Kommune Qeqertalik"],
  ["GL-SM", "GL", "Sermersooq"],
  ["GM-B", "GM", "Banjul"],
  ["GM-L", "GM", "Lower River Division"],
  ["GM-M", "GM", "Central River Division"],
  ["GM-N", "GM", "North Bank Division"],
  ["GM-U", "GM", "Upper River Division"],
  ["GM-W", "GM", "West Coast Division"],
  ["GN-B", "GN", "Bok\xE9 Region"],
  ["GN-BE", "GN", "Beyla"],
  ["GN-BF", "GN", "Boffa"],
  ["GN-BK", "GN", "Bok\xE9"],
  ["GN-C", "GN", "Conakry"],
  ["GN-CO", "GN", "Coyah"],
  ["GN-D", "GN", "Kindia Region"],
  ["GN-DB", "GN", "Dabola"],
  ["GN-DI", "GN", "Dinguiraye"],
  ["GN-DL", "GN", "Dalaba"],
  ["GN-DU", "GN", "Dubr\xE9ka"],
  ["GN-F", "GN", "Faranah Region"],
  ["GN-FA", "GN", "Faranah"],
  ["GN-FO", "GN", "For\xE9cariah"],
  ["GN-FR", "GN", "Fria"],
  ["GN-GA", "GN", "Gaoual"],
  ["GN-GU", "GN", "Gu\xE9ck\xE9dou"],
  ["GN-K", "GN", "Kankan Region"],
  ["GN-KA", "GN", "Kankan"],
  ["GN-KB", "GN", "Koubia"],
  ["GN-KD", "GN", "Kindia"],
  ["GN-KE", "GN", "K\xE9rouan\xE9"],
  ["GN-KN", "GN", "Koundara"],
  ["GN-KO", "GN", "Kouroussa"],
  ["GN-KS", "GN", "Kissidougou"],
  ["GN-L", "GN", "Lab\xE9 Region"],
  ["GN-LA", "GN", "Lab\xE9"],
  ["GN-LE", "GN", "L\xE9louma"],
  ["GN-LO", "GN", "Lola"],
  ["GN-M", "GN", "Mamou Region"],
  ["GN-MC", "GN", "Macenta"],
  ["GN-MD", "GN", "Mandiana"],
  ["GN-ML", "GN", "Mali"],
  ["GN-MM", "GN", "Mamou"],
  ["GN-N", "GN", "Nz\xE9r\xE9kor\xE9 Region"],
  ["GN-NZ", "GN", "Nz\xE9r\xE9kor\xE9"],
  ["GN-PI", "GN", "Pita"],
  ["GN-SI", "GN", "Siguiri"],
  ["GN-TE", "GN", "T\xE9lim\xE9l\xE9"],
  ["GN-TO", "GN", "Tougu\xE9"],
  ["GN-YO", "GN", "Yomou"],
  ["GQ-AN", "GQ", "Annob\xF3n"],
  ["GQ-BN", "GQ", "Bioko Norte"],
  ["GQ-BS", "GQ", "Bioko Sur"],
  ["GQ-C", "GQ", "R\xEDo Muni"],
  ["GQ-CS", "GQ", "Centro Sur"],
  ["GQ-DJ", "GQ", "Djibloho"],
  ["GQ-I", "GQ", "Insular"],
  ["GQ-KN", "GQ", "Ki\xE9-Ntem"],
  ["GQ-LI", "GQ", "Litoral"],
  ["GQ-WN", "GQ", "Wele-Nzas"],
  ["GR-69", "GR", "Mount Athos"],
  ["GR-A", "GR", "East Macedonia and Thrace"],
  ["GR-B", "GR", "Central Macedonia"],
  ["GR-C", "GR", "West Macedonia"],
  ["GR-D", "GR", "Epirus"],
  ["GR-E", "GR", "Thessaly"],
  ["GR-F", "GR", "Ionian Islands"],
  ["GR-G", "GR", "West Greece"],
  ["GR-H", "GR", "Central Greece"],
  ["GR-I", "GR", "Attica"],
  ["GR-J", "GR", "Peloponnese"],
  ["GR-K", "GR", "North Aegean"],
  ["GR-L", "GR", "South Aegean"],
  ["GR-M", "GR", "Crete"],
  ["GT-01", "GT", "Guatemala"],
  ["GT-02", "GT", "El Progreso"],
  ["GT-03", "GT", "Sacatep\xE9quez"],
  ["GT-04", "GT", "Chimaltenango"],
  ["GT-05", "GT", "Escuintla"],
  ["GT-06", "GT", "Santa Rosa"],
  ["GT-07", "GT", "Solol\xE1"],
  ["GT-08", "GT", "Totonicap\xE1n"],
  ["GT-09", "GT", "Quetzaltenango"],
  ["GT-10", "GT", "Suchitep\xE9quez"],
  ["GT-11", "GT", "Retalhuleu"],
  ["GT-12", "GT", "San Marcos"],
  ["GT-13", "GT", "Huehuetenango"],
  ["GT-14", "GT", "Quich\xE9"],
  ["GT-15", "GT", "Baja Verapaz"],
  ["GT-16", "GT", "Alta Verapaz"],
  ["GT-17", "GT", "Pet\xE9n"],
  ["GT-18", "GT", "Izabal"],
  ["GT-19", "GT", "Zacapa"],
  ["GT-20", "GT", "Chiquimula"],
  ["GT-21", "GT", "Jalapa"],
  ["GT-22", "GT", "Jutiapa"],
  ["GW-BA", "GW", "Bafat\xE1"],
  ["GW-BL", "GW", "Bolama"],
  ["GW-BM", "GW", "Biombo"],
  ["GW-BS", "GW", "Bissau"],
  ["GW-CA", "GW", "Cacheu"],
  ["GW-GA", "GW", "Gab\xFA"],
  ["GW-L", "GW", "Leste"],
  ["GW-N", "GW", "Norte"],
  ["GW-OI", "GW", "Oio"],
  ["GW-QU", "GW", "Quinara"],
  ["GW-S", "GW", "Sul"],
  ["GW-TO", "GW", "Tombali"],
  ["GY-BA", "GY", "Barima-Waini"],
  ["GY-CU", "GY", "Cuyuni-Mazaruni"],
  ["GY-DE", "GY", "Demerara-Mahaica"],
  ["GY-EB", "GY", "East Berbice-Corentyne"],
  ["GY-ES", "GY", "Essequibo Islands-West Demerara"],
  ["GY-MA", "GY", "Mahaica-Berbice"],
  ["GY-PM", "GY", "Pomeroon-Supenaam"],
  ["GY-PT", "GY", "Potaro-Siparuni"],
  ["GY-UD", "GY", "Upper Demerara-Berbice"],
  ["GY-UT", "GY", "Upper Takutu-Upper Essequibo"],
  ["HN-AT", "HN", "Atl\xE1ntida"],
  ["HN-CH", "HN", "Choluteca"],
  ["HN-CL", "HN", "Col\xF3n"],
  ["HN-CM", "HN", "Comayagua"],
  ["HN-CP", "HN", "Cop\xE1n"],
  ["HN-CR", "HN", "Cort\xE9s"],
  ["HN-EP", "HN", "El Para\xEDso"],
  ["HN-FM", "HN", "Francisco Moraz\xE1n"],
  ["HN-GD", "HN", "Gracias a Dios"],
  ["HN-IB", "HN", "Bay Islands"],
  ["HN-IN", "HN", "Intibuc\xE1"],
  ["HN-LE", "HN", "Lempira"],
  ["HN-LP", "HN", "La Paz"],
  ["HN-OC", "HN", "Ocotepeque"],
  ["HN-OL", "HN", "Olancho"],
  ["HN-SB", "HN", "Santa B\xE1rbara"],
  ["HN-VA", "HN", "Valle"],
  ["HN-YO", "HN", "Yoro"],
  ["HR-01", "HR", "Zagreb County"],
  ["HR-02", "HR", "Krapina-Zagorje"],
  ["HR-03", "HR", "Sisak-Moslavina"],
  ["HR-04", "HR", "Karlovac"],
  ["HR-05", "HR", "Vara\u017Edin"],
  ["HR-06", "HR", "Koprivnica-Kri\u017Eevci"],
  ["HR-07", "HR", "Bjelovar-Bilogora"],
  ["HR-08", "HR", "Primorje-Gorski Kotar"],
  ["HR-09", "HR", "Lika-Senj"],
  ["HR-10", "HR", "Virovitica-Podravina"],
  ["HR-11", "HR", "Po\u017Eega-Slavonia"],
  ["HR-12", "HR", "Brod-Posavina"],
  ["HR-13", "HR", "Zadar"],
  ["HR-14", "HR", "Osijek-Baranja"],
  ["HR-15", "HR", "\u0160ibenik-Knin"],
  ["HR-16", "HR", "Vukovar-Syrmia"],
  ["HR-17", "HR", "Split-Dalmatia"],
  ["HR-18", "HR", "Istria"],
  ["HR-19", "HR", "Dubrovnik-Neretva"],
  ["HR-20", "HR", "Me\u0111imurje"],
  ["HR-21", "HR", "Zagreb"],
  ["HT-AR", "HT", "Artibonite"],
  ["HT-CE", "HT", "Centre"],
  ["HT-GA", "HT", "Grand\u2019Anse"],
  ["HT-ND", "HT", "Nord"],
  ["HT-NE", "HT", "Nord-Est"],
  ["HT-NI", "HT", "Nippes"],
  ["HT-NO", "HT", "Nord-Ouest"],
  ["HT-OU", "HT", "Ouest"],
  ["HT-SD", "HT", "Sud"],
  ["HT-SE", "HT", "Sud-Est"],
  ["HU-BA", "HU", "Baranya"],
  ["HU-BC", "HU", "B\xE9k\xE9scsaba"],
  ["HU-BE", "HU", "B\xE9k\xE9s"],
  ["HU-BK", "HU", "B\xE1cs-Kiskun"],
  ["HU-BU", "HU", "Budapest"],
  ["HU-BZ", "HU", "Borsod-Aba\xFAj-Zempl\xE9n"],
  ["HU-CS", "HU", "Csongr\xE1d"],
  ["HU-DE", "HU", "Debrecen"],
  ["HU-DU", "HU", "Duna\xFAjv\xE1ros"],
  ["HU-EG", "HU", "Eger"],
  ["HU-ER", "HU", "\xC9rd"],
  ["HU-FE", "HU", "Fej\xE9r"],
  ["HU-GS", "HU", "Gy\u0151r-Moson-Sopron"],
  ["HU-GY", "HU", "Gy\u0151r"],
  ["HU-HB", "HU", "Hajd\xFA-Bihar"],
  ["HU-HE", "HU", "Heves"],
  ["HU-HV", "HU", "H\xF3dmez\u0151v\xE1s\xE1rhely"],
  ["HU-JN", "HU", "J\xE1sz-Nagykun-Szolnok"],
  ["HU-KE", "HU", "Kom\xE1rom-Esztergom"],
  ["HU-KM", "HU", "Kecskem\xE9t"],
  ["HU-KV", "HU", "Kaposv\xE1r"],
  ["HU-MI", "HU", "Miskolc"],
  ["HU-NK", "HU", "Nagykanizsa"],
  ["HU-NO", "HU", "N\xF3gr\xE1d"],
  ["HU-NY", "HU", "Ny\xEDregyh\xE1za"],
  ["HU-PE", "HU", "Pest"],
  ["HU-PS", "HU", "P\xE9cs"],
  ["HU-SD", "HU", "Szeged"],
  ["HU-SF", "HU", "Sz\xE9kesfeh\xE9rv\xE1r"],
  ["HU-SH", "HU", "Szombathely"],
  ["HU-SK", "HU", "Szolnok"],
  ["HU-SN", "HU", "Sopron"],
  ["HU-SO", "HU", "Somogy"],
  ["HU-SS", "HU", "Szeksz\xE1rd"],
  ["HU-ST", "HU", "Salg\xF3tarj\xE1n"],
  ["HU-SZ", "HU", "Szabolcs-Szatm\xE1r-Bereg"],
  ["HU-TB", "HU", "Tatab\xE1nya"],
  ["HU-TO", "HU", "Tolna"],
  ["HU-VA", "HU", "Vas"],
  ["HU-VE", "HU", "Veszpr\xE9m County"],
  ["HU-VM", "HU", "Veszpr\xE9m"],
  ["HU-ZA", "HU", "Zala"],
  ["HU-ZE", "HU", "Zalaegerszeg"],
  ["ID-AC", "ID", "Aceh"],
  ["ID-BA", "ID", "Bali"],
  ["ID-BB", "ID", "Bangka\u2013Belitung Islands"],
  ["ID-BE", "ID", "Bengkulu"],
  ["ID-BT", "ID", "Banten"],
  ["ID-GO", "ID", "Gorontalo"],
  ["ID-JA", "ID", "Jambi"],
  ["ID-JB", "ID", "West Java"],
  ["ID-JI", "ID", "East Java"],
  ["ID-JK", "ID", "Jakarta"],
  ["ID-JT", "ID", "Central Java"],
  ["ID-JW", "ID", "Java"],
  ["ID-KA", "ID", "Kalimantan"],
  ["ID-KB", "ID", "West Kalimantan"],
  ["ID-KI", "ID", "East Kalimantan"],
  ["ID-KR", "ID", "Riau Islands"],
  ["ID-KS", "ID", "South Kalimantan"],
  ["ID-KT", "ID", "Central Kalimantan"],
  ["ID-KU", "ID", "North Kalimantan"],
  ["ID-LA", "ID", "Lampung"],
  ["ID-MA", "ID", "Maluku"],
  ["ID-ML", "ID", "Maluku Islands"],
  ["ID-MU", "ID", "North Maluku"],
  ["ID-NB", "ID", "West Nusa Tenggara"],
  ["ID-NT", "ID", "East Nusa Tenggara"],
  ["ID-NU", "ID", "Lesser Sunda Islands"],
  ["ID-PA", "ID", "Papua"],
  ["ID-PB", "ID", "West Papua"],
  ["ID-PD", "ID", "Papua Barat Daya"],
  ["ID-PE", "ID", "Papua Pengunungan"],
  ["ID-PP", "ID", "Papua Islands"],
  ["ID-PS", "ID", "Papua Selatan"],
  ["ID-PT", "ID", "Papua Tengah"],
  ["ID-RI", "ID", "Riau"],
  ["ID-SA", "ID", "North Sulawesi"],
  ["ID-SB", "ID", "West Sumatra"],
  ["ID-SG", "ID", "Southeast Sulawesi"],
  ["ID-SL", "ID", "Sulawesi"],
  ["ID-SM", "ID", "Sumatra"],
  ["ID-SN", "ID", "South Sulawesi"],
  ["ID-SR", "ID", "West Sulawesi"],
  ["ID-SS", "ID", "South Sumatra"],
  ["ID-ST", "ID", "Central Sulawesi"],
  ["ID-SU", "ID", "North Sumatra"],
  ["ID-YO", "ID", "Yogyakarta"],
  ["IE-C", "IE", "Connacht"],
  ["IE-CE", "IE", "Clare"],
  ["IE-CN", "IE", "Cavan"],
  ["IE-CO", "IE", "Cork"],
  ["IE-CW", "IE", "Carlow"],
  ["IE-D", "IE", "Dublin"],
  ["IE-DL", "IE", "Donegal"],
  ["IE-G", "IE", "Galway"],
  ["IE-KE", "IE", "Kildare"],
  ["IE-KK", "IE", "Kilkenny"],
  ["IE-KY", "IE", "Kerry"],
  ["IE-L", "IE", "Leinster"],
  ["IE-LD", "IE", "Longford"],
  ["IE-LH", "IE", "Louth"],
  ["IE-LK", "IE", "Limerick"],
  ["IE-LM", "IE", "Leitrim"],
  ["IE-LS", "IE", "Laois"],
  ["IE-M", "IE", "Munster"],
  ["IE-MH", "IE", "Meath"],
  ["IE-MN", "IE", "Monaghan"],
  ["IE-MO", "IE", "Mayo"],
  ["IE-OY", "IE", "Offaly"],
  ["IE-RN", "IE", "Roscommon"],
  ["IE-SO", "IE", "Sligo"],
  ["IE-TA", "IE", "Tipperary"],
  ["IE-U", "IE", "Ulster"],
  ["IE-WD", "IE", "Waterford"],
  ["IE-WH", "IE", "Westmeath"],
  ["IE-WW", "IE", "Wicklow"],
  ["IE-WX", "IE", "Wexford"],
  ["IL-D", "IL", "Southern District"],
  ["IL-HA", "IL", "Haifa District"],
  ["IL-JM", "IL", "Jerusalem"],
  ["IL-M", "IL", "Central District"],
  ["IL-TA", "IL", "Tel Aviv District"],
  ["IL-Z", "IL", "Northern District"],
  ["IN-AN", "IN", "Andaman and Nicobar Islands"],
  ["IN-AP", "IN", "Andhra Pradesh"],
  ["IN-AR", "IN", "Arunachal Pradesh"],
  ["IN-AS", "IN", "Assam"],
  ["IN-BR", "IN", "Bihar"],
  ["IN-CG", "IN", "Chhatt\u012Bsgarh"],
  ["IN-CH", "IN", "Chandigarh"],
  ["IN-DH", "IN", "D\u0101dra and Nagar Haveli and Dam\u0101n and Diu"],
  ["IN-DL", "IN", "Delhi"],
  ["IN-GA", "IN", "Goa"],
  ["IN-GJ", "IN", "Gujarat"],
  ["IN-HP", "IN", "Himachal Pradesh"],
  ["IN-HR", "IN", "Haryana"],
  ["IN-JH", "IN", "Jharkhand"],
  ["IN-JK", "IN", "Jammu and Kashmir"],
  ["IN-KA", "IN", "Karnataka"],
  ["IN-KL", "IN", "Kerala"],
  ["IN-LA", "IN", "Ladakh"],
  ["IN-LD", "IN", "Lakshadweep"],
  ["IN-MH", "IN", "Maharashtra"],
  ["IN-ML", "IN", "Meghalaya"],
  ["IN-MN", "IN", "Manipur"],
  ["IN-MP", "IN", "Madhya Pradesh"],
  ["IN-MZ", "IN", "Mizoram"],
  ["IN-NL", "IN", "Nagaland"],
  ["IN-OD", "IN", "Odisha"],
  ["IN-PB", "IN", "Punjab"],
  ["IN-PY", "IN", "Puducherry"],
  ["IN-RJ", "IN", "Rajasthan"],
  ["IN-SK", "IN", "Sikkim"],
  ["IN-TN", "IN", "Tamil Nadu"],
  ["IN-TR", "IN", "Tripura"],
  ["IN-TS", "IN", "Telang\u0101na"],
  ["IN-UK", "IN", "Uttar\u0101khand"],
  ["IN-UP", "IN", "Uttar Pradesh"],
  ["IN-WB", "IN", "West Bengal"],
  ["IQ-AN", "IQ", "Al Anbar"],
  ["IQ-AR", "IQ", "Erbil"],
  ["IQ-BA", "IQ", "Basra"],
  ["IQ-BB", "IQ", "Babylon"],
  ["IQ-BG", "IQ", "Baghdad"],
  ["IQ-DA", "IQ", "Dohuk"],
  ["IQ-DI", "IQ", "Diyala"],
  ["IQ-DQ", "IQ", "Dhi Qar"],
  ["IQ-KA", "IQ", "Karbala"],
  ["IQ-KI", "IQ", "Kirkuk"],
  ["IQ-KR", "IQ", "Kurdistan"],
  ["IQ-MA", "IQ", "Maysan"],
  ["IQ-MU", "IQ", "Al Muthanna"],
  ["IQ-NA", "IQ", "Najaf"],
  ["IQ-NI", "IQ", "Nineveh"],
  ["IQ-QA", "IQ", "Al-Q\u0101disiyyah"],
  ["IQ-SD", "IQ", "Saladin"],
  ["IQ-SU", "IQ", "Sulaymaniyah"],
  ["IQ-WA", "IQ", "Wasit"],
  ["IR-00", "IR", "Markaz\u012B"],
  ["IR-01", "IR", "East Azerbaijan"],
  ["IR-02", "IR", "West Azarbaijan"],
  ["IR-03", "IR", "Ardabil"],
  ["IR-04", "IR", "Isfahan"],
  ["IR-05", "IR", "Ilam"],
  ["IR-06", "IR", "Bushehr"],
  ["IR-07", "IR", "Tehran"],
  ["IR-08", "IR", "Chaharmahal and Bakhtiari"],
  ["IR-09", "IR", "Khor\u0101s\u0101n-e Ra\u1E95av\u012B"],
  ["IR-10", "IR", "Khuzestan"],
  ["IR-11", "IR", "Zanjan"],
  ["IR-12", "IR", "Semnan"],
  ["IR-13", "IR", "Sistan and Baluchestan"],
  ["IR-14", "IR", "Fars"],
  ["IR-15", "IR", "Kerman"],
  ["IR-16", "IR", "Kurdistan"],
  ["IR-17", "IR", "Kermanshah"],
  ["IR-18", "IR", "Kohgiluyeh and Boyer-Ahmad"],
  ["IR-19", "IR", "Gilan"],
  ["IR-20", "IR", "Lorestan"],
  ["IR-21", "IR", "Mazandaran"],
  ["IR-22", "IR", "Markazi"],
  ["IR-23", "IR", "Hormozgan"],
  ["IR-24", "IR", "Hamadan"],
  ["IR-25", "IR", "Yazd"],
  ["IR-26", "IR", "Qom"],
  ["IR-27", "IR", "Golestan"],
  ["IR-28", "IR", "Qazvin"],
  ["IR-29", "IR", "South Khorasan"],
  ["IR-30", "IR", "Razavi Khorasan"],
  ["IS-1", "IS", "Capital"],
  ["IS-2", "IS", "Southern Peninsula"],
  ["IS-3", "IS", "Western"],
  ["IS-4", "IS", "Westfjords"],
  ["IS-5", "IS", "Northwestern"],
  ["IS-6", "IS", "Northeastern"],
  ["IS-7", "IS", "Eastern"],
  ["IS-8", "IS", "Southern"],
  ["IS-AKN", "IS", "Akraneskaupsta\xF0ur"],
  ["IS-AKU", "IS", "Akureyrarb\xE6r"],
  ["IS-ARN", "IS", "\xC1rneshreppur"],
  ["IS-ASA", "IS", "\xC1sahreppur"],
  ["IS-BLA", "IS", "Bl\xE1sk\xF3gabygg\xF0"],
  ["IS-BOG", "IS", "Borgarbygg\xF0"],
  ["IS-BOL", "IS", "Bolungarv\xEDkurkaupsta\xF0ur"],
  ["IS-DAB", "IS", "Dalabygg\xF0"],
  ["IS-DAV", "IS", "Dalv\xEDkurbygg\xF0"],
  ["IS-EOM", "IS", "Eyja- og Miklaholtshreppur"],
  ["IS-EYF", "IS", "Eyjafjar\xF0arsveit"],
  ["IS-FJD", "IS", "Fjar\xF0abygg\xF0"],
  ["IS-FJL", "IS", "Fjallabygg\xF0"],
  ["IS-FLA", "IS", "Fl\xF3ahreppur"],
  ["IS-FLR", "IS", "Flj\xF3tsdalshreppur"],
  ["IS-GAR", "IS", "Gar\xF0ab\xE6r"],
  ["IS-GOG", "IS", "Gr\xEDmsnes- og Grafningshreppur"],
  ["IS-GRN", "IS", "Grindav\xEDkurb\xE6r"],
  ["IS-GRU", "IS", "Grundarfjar\xF0arb\xE6r"],
  ["IS-GRY", "IS", "Gr\xFDtubakkahreppur"],
  ["IS-HAF", "IS", "Hafnarfjar\xF0arkaupsta\xF0ur"],
  ["IS-HRG", "IS", "H\xF6rg\xE1rsveit"],
  ["IS-HRU", "IS", "Hrunamannahreppur"],
  ["IS-HUG", "IS", "H\xFAnabygg\xF0"],
  ["IS-HUV", "IS", "H\xFAna\xFEing vestra"],
  ["IS-HVA", "IS", "Hvalfjar\xF0arsveit"],
  ["IS-HVE", "IS", "Hverager\xF0isb\xE6r"],
  ["IS-ISA", "IS", "\xCDsafjar\xF0arb\xE6r"],
  ["IS-KAL", "IS", "Kaldrananeshreppur"],
  ["IS-KJO", "IS", "Kj\xF3sarhreppur"],
  ["IS-KOP", "IS", "K\xF3pavogsb\xE6r"],
  ["IS-LAN", "IS", "Langanesbygg\xF0"],
  ["IS-MOS", "IS", "Mosfellsb\xE6r"],
  ["IS-MUL", "IS", "M\xFAla\xFEing"],
  ["IS-MYR", "IS", "M\xFDrdalshreppur"],
  ["IS-NOR", "IS", "Nor\xF0ur\xFEing"],
  ["IS-RGE", "IS", "Rang\xE1r\xFEing eystra"],
  ["IS-RGY", "IS", "Rang\xE1r\xFEing ytra"],
  ["IS-RHH", "IS", "Reykh\xF3lahreppur"],
  ["IS-RKN", "IS", "Reykjanesb\xE6r"],
  ["IS-RKV", "IS", "Reykjav\xEDkurborg"],
  ["IS-SBT", "IS", "Svalbar\xF0sstrandarhreppur"],
  ["IS-SDN", "IS", "Su\xF0urnesjab\xE6r"],
  ["IS-SDV", "IS", "S\xFA\xF0av\xEDkurhreppur"],
  ["IS-SEL", "IS", "Seltjarnarnesb\xE6r"],
  ["IS-SFA", "IS", "Sveitarf\xE9lagi\xF0 \xC1rborg"],
  ["IS-SHF", "IS", "Sveitarf\xE9lagi\xF0 Hornafj\xF6r\xF0ur"],
  ["IS-SKF", "IS", "Skaft\xE1rhreppur"],
  ["IS-SKG", "IS", "Skagabygg\xF0"],
  ["IS-SKO", "IS", "Skorradalshreppur"],
  ["IS-SKR", "IS", "Skagafj\xF6r\xF0ur"],
  ["IS-SNF", "IS", "Sn\xE6fellsb\xE6r"],
  ["IS-SOG", "IS", "Skei\xF0a- og Gn\xFApverjahreppur"],
  ["IS-SOL", "IS", "Sveitarf\xE9lagi\xF0 \xD6lfus"],
  ["IS-SSS", "IS", "Sveitarf\xE9lagi\xF0 Skagastr\xF6nd"],
  ["IS-STR", "IS", "Strandabygg\xF0"],
  ["IS-STY", "IS", "Stykkish\xF3lmsb\xE6r"],
  ["IS-SVG", "IS", "Sveitarf\xE9lagi\xF0 Vogar"],
  ["IS-TAL", "IS", "T\xE1lknafjar\xF0arhreppur"],
  ["IS-THG", "IS", "\xDEingeyjarsveit"],
  ["IS-TJO", "IS", "Tj\xF6rneshreppur"],
  ["IS-VEM", "IS", "Vestmannaeyjab\xE6r"],
  ["IS-VER", "IS", "Vesturbygg\xF0"],
  ["IS-VOP", "IS", "Vopnafjar\xF0arhreppur"],
  ["IT-21", "IT", "Piedmont"],
  ["IT-23", "IT", "Aosta Valley"],
  ["IT-25", "IT", "Lombardy"],
  ["IT-32", "IT", "Trentino-South Tyrol"],
  ["IT-34", "IT", "Veneto"],
  ["IT-36", "IT", "Friuli\u2013Venezia Giulia"],
  ["IT-42", "IT", "Liguria"],
  ["IT-45", "IT", "Emilia-Romagna"],
  ["IT-52", "IT", "Tuscany"],
  ["IT-55", "IT", "Umbria"],
  ["IT-57", "IT", "Marche"],
  ["IT-62", "IT", "Lazio"],
  ["IT-65", "IT", "Abruzzo"],
  ["IT-67", "IT", "Molise"],
  ["IT-72", "IT", "Campania"],
  ["IT-75", "IT", "Apulia"],
  ["IT-77", "IT", "Basilicata"],
  ["IT-78", "IT", "Calabria"],
  ["IT-82", "IT", "Sicily"],
  ["IT-88", "IT", "Sardinia"],
  ["IT-AG", "IT", "Agrigento"],
  ["IT-AL", "IT", "Alessandria"],
  ["IT-AN", "IT", "Ancona"],
  ["IT-AP", "IT", "Ascoli Piceno"],
  ["IT-AQ", "IT", "L\u2019Aquila"],
  ["IT-AR", "IT", "Arezzo"],
  ["IT-AT", "IT", "Asti"],
  ["IT-AV", "IT", "Avellino"],
  ["IT-BA", "IT", "Bari"],
  ["IT-BG", "IT", "Bergamo"],
  ["IT-BI", "IT", "Biella"],
  ["IT-BL", "IT", "Belluno"],
  ["IT-BN", "IT", "Benevento"],
  ["IT-BO", "IT", "Bologna"],
  ["IT-BR", "IT", "Brindisi"],
  ["IT-BS", "IT", "Brescia"],
  ["IT-BT", "IT", "Barletta-Andria-Trani"],
  ["IT-BZ", "IT", "South Tyrol"],
  ["IT-CA", "IT", "Cagliari"],
  ["IT-CB", "IT", "Campobasso"],
  ["IT-CE", "IT", "Caserta"],
  ["IT-CH", "IT", "Chieti"],
  ["IT-CL", "IT", "Caltanissetta"],
  ["IT-CN", "IT", "Cuneo"],
  ["IT-CO", "IT", "Como"],
  ["IT-CR", "IT", "Cremona"],
  ["IT-CS", "IT", "Cosenza"],
  ["IT-CT", "IT", "Catania"],
  ["IT-CZ", "IT", "Catanzaro"],
  ["IT-EN", "IT", "Enna"],
  ["IT-FC", "IT", "Forl\xEC-Cesena"],
  ["IT-FE", "IT", "Ferrara"],
  ["IT-FG", "IT", "Foggia"],
  ["IT-FI", "IT", "Florence"],
  ["IT-FM", "IT", "Fermo"],
  ["IT-FR", "IT", "Frosinone"],
  ["IT-GE", "IT", "Genoa"],
  ["IT-GO", "IT", "Gorizia"],
  ["IT-GR", "IT", "Grosseto"],
  ["IT-IM", "IT", "Imperia"],
  ["IT-IS", "IT", "Isernia"],
  ["IT-KR", "IT", "Crotone"],
  ["IT-LC", "IT", "Lecco"],
  ["IT-LE", "IT", "Lecce"],
  ["IT-LI", "IT", "Livorno"],
  ["IT-LO", "IT", "Lodi"],
  ["IT-LT", "IT", "Latina"],
  ["IT-LU", "IT", "Lucca"],
  ["IT-MB", "IT", "Monza and Brianza"],
  ["IT-MC", "IT", "Macerata"],
  ["IT-ME", "IT", "Messina"],
  ["IT-MI", "IT", "Milan"],
  ["IT-MN", "IT", "Mantua"],
  ["IT-MO", "IT", "Modena"],
  ["IT-MS", "IT", "Massa and Carrara"],
  ["IT-MT", "IT", "Matera"],
  ["IT-NA", "IT", "Naples"],
  ["IT-NO", "IT", "Novara"],
  ["IT-NU", "IT", "Nuoro"],
  ["IT-OR", "IT", "Oristano"],
  ["IT-PA", "IT", "Palermo"],
  ["IT-PC", "IT", "Piacenza"],
  ["IT-PD", "IT", "Padua"],
  ["IT-PE", "IT", "Pescara"],
  ["IT-PG", "IT", "Perugia"],
  ["IT-PI", "IT", "Pisa"],
  ["IT-PN", "IT", "Pordenone"],
  ["IT-PO", "IT", "Prato"],
  ["IT-PR", "IT", "Parma"],
  ["IT-PT", "IT", "Pistoia"],
  ["IT-PU", "IT", "Pesaro and Urbino"],
  ["IT-PV", "IT", "Pavia"],
  ["IT-PZ", "IT", "Potenza"],
  ["IT-RA", "IT", "Ravenna"],
  ["IT-RC", "IT", "Reggio Calabria"],
  ["IT-RE", "IT", "Reggio Emilia"],
  ["IT-RG", "IT", "Ragusa"],
  ["IT-RI", "IT", "Rieti"],
  ["IT-RM", "IT", "Rome"],
  ["IT-RN", "IT", "Rimini"],
  ["IT-RO", "IT", "Rovigo"],
  ["IT-SA", "IT", "Salerno"],
  ["IT-SI", "IT", "Siena"],
  ["IT-SO", "IT", "Sondrio"],
  ["IT-SP", "IT", "La Spezia"],
  ["IT-SR", "IT", "Syracuse"],
  ["IT-SS", "IT", "Sassari"],
  ["IT-SU", "IT", "Sud Sardegna"],
  ["IT-SV", "IT", "Savona"],
  ["IT-TA", "IT", "Taranto"],
  ["IT-TE", "IT", "Teramo"],
  ["IT-TN", "IT", "Trentino"],
  ["IT-TO", "IT", "Turin"],
  ["IT-TP", "IT", "Trapani"],
  ["IT-TR", "IT", "Terni"],
  ["IT-TS", "IT", "Trieste"],
  ["IT-TV", "IT", "Treviso"],
  ["IT-UD", "IT", "Udine"],
  ["IT-VA", "IT", "Varese"],
  ["IT-VB", "IT", "Verbano-Cusio-Ossola"],
  ["IT-VC", "IT", "Vercelli"],
  ["IT-VE", "IT", "Venice"],
  ["IT-VI", "IT", "Vicenza"],
  ["IT-VR", "IT", "Verona"],
  ["IT-VT", "IT", "Viterbo"],
  ["IT-VV", "IT", "Vibo Valentia"],
  ["JM-01", "JM", "Kingston"],
  ["JM-02", "JM", "Saint Andrew"],
  ["JM-03", "JM", "Saint Thomas"],
  ["JM-04", "JM", "Portland"],
  ["JM-05", "JM", "Saint Mary"],
  ["JM-06", "JM", "Saint Ann"],
  ["JM-07", "JM", "Trelawny"],
  ["JM-08", "JM", "Saint James"],
  ["JM-09", "JM", "Hanover"],
  ["JM-10", "JM", "Westmoreland"],
  ["JM-11", "JM", "Saint Elizabeth"],
  ["JM-12", "JM", "Manchester"],
  ["JM-13", "JM", "Clarendon"],
  ["JM-14", "JM", "Saint Catherine"],
  ["JO-AJ", "JO", "Ajloun"],
  ["JO-AM", "JO", "Amman"],
  ["JO-AQ", "JO", "Aqaba"],
  ["JO-AT", "JO", "Tafilah"],
  ["JO-AZ", "JO", "Zarqa"],
  ["JO-BA", "JO", "Balqa"],
  ["JO-IR", "JO", "Irbid"],
  ["JO-JA", "JO", "Jerash"],
  ["JO-KA", "JO", "Karak"],
  ["JO-MA", "JO", "Mafraq"],
  ["JO-MD", "JO", "Madaba"],
  ["JO-MN", "JO", "Ma\u2019an"],
  ["JP-01", "JP", "\u5317\u6D77\u9053"],
  ["JP-02", "JP", "\u9752\u68EE\u770C"],
  ["JP-03", "JP", "\u5CA9\u624B\u770C"],
  ["JP-04", "JP", "\u5BAE\u57CE\u770C"],
  ["JP-05", "JP", "\u79CB\u7530\u770C"],
  ["JP-06", "JP", "\u5C71\u5F62\u770C"],
  ["JP-07", "JP", "\u798F\u5CF6\u770C"],
  ["JP-08", "JP", "\u8328\u57CE\u770C"],
  ["JP-09", "JP", "\u6803\u6728\u770C"],
  ["JP-10", "JP", "\u7FA4\u99AC\u770C"],
  ["JP-11", "JP", "\u57FC\u7389\u770C"],
  ["JP-12", "JP", "\u5343\u8449\u770C"],
  ["JP-13", "JP", "\u6771\u4EAC\u90FD"],
  ["JP-14", "JP", "\u795E\u5948\u5DDD\u770C"],
  ["JP-15", "JP", "\u65B0\u6F5F\u770C"],
  ["JP-16", "JP", "\u5BCC\u5C71\u770C"],
  ["JP-17", "JP", "\u77F3\u5DDD\u770C"],
  ["JP-18", "JP", "\u798F\u4E95\u770C"],
  ["JP-19", "JP", "\u5C71\u68A8\u770C"],
  ["JP-20", "JP", "\u9577\u91CE\u770C"],
  ["JP-21", "JP", "\u5C90\u961C\u770C"],
  ["JP-22", "JP", "\u9759\u5CA1\u770C"],
  ["JP-23", "JP", "\u611B\u77E5\u770C"],
  ["JP-24", "JP", "\u4E09\u91CD\u770C"],
  ["JP-25", "JP", "\u6ECB\u8CC0\u770C"],
  ["JP-26", "JP", "\u4EAC\u90FD\u5E9C"],
  ["JP-27", "JP", "\u5927\u962A\u5E9C"],
  ["JP-28", "JP", "\u5175\u5EAB\u770C"],
  ["JP-29", "JP", "\u5948\u826F\u770C"],
  ["JP-30", "JP", "\u548C\u6B4C\u5C71\u770C"],
  ["JP-31", "JP", "\u9CE5\u53D6\u770C"],
  ["JP-32", "JP", "\u5CF6\u6839\u770C"],
  ["JP-33", "JP", "\u5CA1\u5C71\u770C"],
  ["JP-34", "JP", "\u5E83\u5CF6\u770C"],
  ["JP-35", "JP", "\u5C71\u53E3\u770C"],
  ["JP-36", "JP", "\u5FB3\u5CF6\u770C"],
  ["JP-37", "JP", "\u9999\u5DDD\u770C"],
  ["JP-38", "JP", "\u611B\u5A9B\u770C"],
  ["JP-39", "JP", "\u9AD8\u77E5\u770C"],
  ["JP-40", "JP", "\u798F\u5CA1\u770C"],
  ["JP-41", "JP", "\u4F50\u8CC0\u770C"],
  ["JP-42", "JP", "\u9577\u5D0E\u770C"],
  ["JP-43", "JP", "\u718A\u672C\u770C"],
  ["JP-44", "JP", "\u5927\u5206\u770C"],
  ["JP-45", "JP", "\u5BAE\u5D0E\u770C"],
  ["JP-46", "JP", "\u9E7F\u5150\u5CF6\u770C"],
  ["JP-47", "JP", "\u6C96\u7E04\u770C"],
  ["KE-01", "KE", "Baringo"],
  ["KE-02", "KE", "Bomet"],
  ["KE-03", "KE", "Bungoma"],
  ["KE-04", "KE", "Busia"],
  ["KE-05", "KE", "Elgeyo-Marakwet"],
  ["KE-06", "KE", "Embu"],
  ["KE-07", "KE", "Garissa"],
  ["KE-08", "KE", "Homa Bay"],
  ["KE-09", "KE", "Isiolo"],
  ["KE-10", "KE", "Kajiado"],
  ["KE-11", "KE", "Kakamega"],
  ["KE-12", "KE", "Kericho"],
  ["KE-13", "KE", "Kiambu"],
  ["KE-14", "KE", "Kilifi"],
  ["KE-15", "KE", "Kirinyaga"],
  ["KE-16", "KE", "Kisii"],
  ["KE-17", "KE", "Kisumu"],
  ["KE-18", "KE", "Kitui"],
  ["KE-19", "KE", "Kwale"],
  ["KE-20", "KE", "Laikipia"],
  ["KE-21", "KE", "Lamu"],
  ["KE-22", "KE", "Machakos"],
  ["KE-23", "KE", "Makueni"],
  ["KE-24", "KE", "Mandera"],
  ["KE-25", "KE", "Marsabit"],
  ["KE-26", "KE", "Meru"],
  ["KE-27", "KE", "Migori"],
  ["KE-28", "KE", "Mombasa"],
  ["KE-29", "KE", "Murang\u2019a"],
  ["KE-30", "KE", "Nairobi County"],
  ["KE-31", "KE", "Nakuru"],
  ["KE-32", "KE", "Nandi"],
  ["KE-33", "KE", "Narok"],
  ["KE-34", "KE", "Nyamira"],
  ["KE-35", "KE", "Nyandarua"],
  ["KE-36", "KE", "Nyeri"],
  ["KE-37", "KE", "Samburu"],
  ["KE-38", "KE", "Siaya"],
  ["KE-39", "KE", "Taita-Taveta"],
  ["KE-40", "KE", "Tana River"],
  ["KE-41", "KE", "Tharaka-Nithi"],
  ["KE-42", "KE", "Trans Nzoia"],
  ["KE-43", "KE", "Turkana"],
  ["KE-44", "KE", "Uasin Gishu"],
  ["KE-45", "KE", "Vihiga"],
  ["KE-46", "KE", "Wajir"],
  ["KE-47", "KE", "West Pokot"],
  ["KG-B", "KG", "Batken"],
  ["KG-C", "KG", "Chuy"],
  ["KG-GB", "KG", "Bishkek"],
  ["KG-GO", "KG", "Osh"],
  ["KG-J", "KG", "Jalal-Abad"],
  ["KG-N", "KG", "Naryn"],
  ["KG-O", "KG", "Osh Region"],
  ["KG-T", "KG", "Talas"],
  ["KG-Y", "KG", "Issyk-Kul"],
  ["KH-1", "KH", "Banteay Meanchey"],
  ["KH-10", "KH", "Krati\xE9"],
  ["KH-11", "KH", "Mondulkiri"],
  ["KH-12", "KH", "Phnom Penh"],
  ["KH-13", "KH", "Preah Vihear"],
  ["KH-14", "KH", "Prey Veng"],
  ["KH-15", "KH", "Pursat"],
  ["KH-16", "KH", "Ratanakiri"],
  ["KH-17", "KH", "Siem Reap"],
  ["KH-18", "KH", "Sihanoukville"],
  ["KH-19", "KH", "Stung Treng"],
  ["KH-2", "KH", "Battambang"],
  ["KH-20", "KH", "Svay Rieng"],
  ["KH-21", "KH", "Tak\xE9o"],
  ["KH-22", "KH", "Oddar Meanchey"],
  ["KH-23", "KH", "Kep"],
  ["KH-24", "KH", "Pailin"],
  ["KH-25", "KH", "Tbong Khmum"],
  ["KH-3", "KH", "Kampong Cham"],
  ["KH-4", "KH", "Kampong Chhnang"],
  ["KH-5", "KH", "Kampong Speu"],
  ["KH-6", "KH", "Kampong Thom"],
  ["KH-7", "KH", "Kampot"],
  ["KH-8", "KH", "Kandal"],
  ["KH-9", "KH", "Koh Kong"],
  ["KI-G", "KI", "Gilbert Islands"],
  ["KI-L", "KI", "Line Islands"],
  ["KI-P", "KI", "Phoenix Islands"],
  ["KM-A", "KM", "Anjouan"],
  ["KM-G", "KM", "Grande Comore"],
  ["KM-M", "KM", "Moh\xE9li"],
  ["KN-01", "KN", "Christ Church Nichola Town"],
  ["KN-02", "KN", "Saint Anne Sandy Point"],
  ["KN-03", "KN", "Saint George Basseterre"],
  ["KN-04", "KN", "Saint George Gingerland"],
  ["KN-05", "KN", "Saint James Windward"],
  ["KN-06", "KN", "Saint John Capisterre"],
  ["KN-07", "KN", "Saint John Figtree"],
  ["KN-08", "KN", "Saint Mary Cayon"],
  ["KN-09", "KN", "Saint Paul Capisterre"],
  ["KN-10", "KN", "Saint Paul Charlestown"],
  ["KN-11", "KN", "Saint Peter Basseterre"],
  ["KN-12", "KN", "Saint Thomas Lowland"],
  ["KN-13", "KN", "Saint Thomas Middle Island"],
  ["KN-15", "KN", "Trinity Palmetto Point"],
  ["KN-K", "KN", "Saint Kitts"],
  ["KN-N", "KN", "Nevis"],
  ["KP-01", "KP", "Pyongyang"],
  ["KP-02", "KP", "South Pyongan"],
  ["KP-03", "KP", "North Pyongan"],
  ["KP-04", "KP", "Chagang"],
  ["KP-05", "KP", "South Hwanghae"],
  ["KP-06", "KP", "North Hwanghae"],
  ["KP-07", "KP", "Kangwon"],
  ["KP-08", "KP", "South Hamgyong"],
  ["KP-09", "KP", "North Hamgyong"],
  ["KP-10", "KP", "Ryanggang"],
  ["KP-13", "KP", "Rason"],
  ["KP-14", "KP", "Nampho"],
  ["KP-15", "KP", "Kaeseong"],
  ["KR-11", "KR", "Seoul"],
  ["KR-26", "KR", "Busan"],
  ["KR-27", "KR", "Daegu"],
  ["KR-28", "KR", "Incheon"],
  ["KR-29", "KR", "Gwangju City"],
  ["KR-30", "KR", "Daejeon"],
  ["KR-31", "KR", "Ulsan"],
  ["KR-41", "KR", "Gyeonggi"],
  ["KR-42", "KR", "Gangwon"],
  ["KR-43", "KR", "North Chungcheong"],
  ["KR-44", "KR", "South Chungcheong"],
  ["KR-45", "KR", "North Jeolla"],
  ["KR-46", "KR", "South Jeolla"],
  ["KR-47", "KR", "North Gyeongsang"],
  ["KR-48", "KR", "South Gyeongsang"],
  ["KR-49", "KR", "Jeju"],
  ["KR-50", "KR", "Sejong"],
  ["KW-AH", "KW", "Al Ahmadi"],
  ["KW-FA", "KW", "Al Farwaniyah"],
  ["KW-HA", "KW", "Hawalli"],
  ["KW-JA", "KW", "Al Jahra"],
  ["KW-KU", "KW", "Al Asimah"],
  ["KW-MU", "KW", "Mubarak Al-Kabeer"],
  ["KZ-10", "KZ", "Abay oblysy"],
  ["KZ-11", "KZ", "Aqmola oblysy"],
  ["KZ-15", "KZ", "Aqt\xF6be oblysy"],
  ["KZ-19", "KZ", "Almaty oblysy"],
  ["KZ-23", "KZ", "Atyra\u016B oblysy"],
  ["KZ-27", "KZ", "Batys Qazaqstan oblysy"],
  ["KZ-31", "KZ", "Zhambyl oblysy"],
  ["KZ-33", "KZ", "Zhetis\u016B oblysy"],
  ["KZ-35", "KZ", "Qaraghandy oblysy"],
  ["KZ-39", "KZ", "Qostanay oblysy"],
  ["KZ-43", "KZ", "Qyzylorda oblysy"],
  ["KZ-47", "KZ", "Mangghysta\u016B oblysy"],
  ["KZ-55", "KZ", "Pavlodar oblysy"],
  ["KZ-59", "KZ", "Solt\xFCstik Qazaqstan oblysy"],
  ["KZ-61", "KZ", "T\xFCrkistan oblysy"],
  ["KZ-62", "KZ", "Ulyta\u016B oblysy"],
  ["KZ-63", "KZ", "Shyghys Qazaqstan oblysy"],
  ["KZ-71", "KZ", "Astana"],
  ["KZ-75", "KZ", "Almaty"],
  ["KZ-79", "KZ", "Shymkent"],
  ["LA-AT", "LA", "Attapeu"],
  ["LA-BK", "LA", "Bokeo"],
  ["LA-BL", "LA", "Bolikhamsai"],
  ["LA-CH", "LA", "Champasak"],
  ["LA-HO", "LA", "Houaphanh"],
  ["LA-KH", "LA", "Khammouane"],
  ["LA-LM", "LA", "Luang Namtha"],
  ["LA-LP", "LA", "Luang Prabang"],
  ["LA-OU", "LA", "Oudomxay"],
  ["LA-PH", "LA", "Phongsaly"],
  ["LA-SL", "LA", "Salavan"],
  ["LA-SV", "LA", "Savannakhet"],
  ["LA-VI", "LA", "Vientiane Province"],
  ["LA-VT", "LA", "Vientiane"],
  ["LA-XA", "LA", "Sainyabuli"],
  ["LA-XE", "LA", "Sekong"],
  ["LA-XI", "LA", "Xiangkhouang"],
  ["LA-XS", "LA", "Xaisomboun"],
  ["LB-AK", "LB", "Akkar"],
  ["LB-AS", "LB", "North"],
  ["LB-BA", "LB", "Beirut"],
  ["LB-BH", "LB", "Baalbek-Hermel"],
  ["LB-BI", "LB", "Beqaa"],
  ["LB-JA", "LB", "South"],
  ["LB-JL", "LB", "Mount Lebanon"],
  ["LB-NA", "LB", "Nabatieh"],
  ["LC-01", "LC", "Anse la Raye"],
  ["LC-02", "LC", "Castries"],
  ["LC-03", "LC", "Choiseul"],
  ["LC-05", "LC", "Dennery"],
  ["LC-06", "LC", "Gros Islet"],
  ["LC-07", "LC", "Laborie"],
  ["LC-08", "LC", "Micoud"],
  ["LC-10", "LC", "Soufri\xE8re"],
  ["LC-11", "LC", "Vieux Fort"],
  ["LC-12", "LC", "Canaries"],
  ["LI-01", "LI", "Balzers"],
  ["LI-02", "LI", "Eschen"],
  ["LI-03", "LI", "Gamprin"],
  ["LI-04", "LI", "Mauren"],
  ["LI-05", "LI", "Planken"],
  ["LI-06", "LI", "Ruggell"],
  ["LI-07", "LI", "Schaan"],
  ["LI-08", "LI", "Schellenberg"],
  ["LI-09", "LI", "Triesen"],
  ["LI-10", "LI", "Triesenberg"],
  ["LI-11", "LI", "Vaduz"],
  ["LK-1", "LK", "Western"],
  ["LK-11", "LK", "Colombo"],
  ["LK-12", "LK", "Gampaha"],
  ["LK-13", "LK", "Kalutara"],
  ["LK-2", "LK", "Central"],
  ["LK-21", "LK", "Kandy"],
  ["LK-22", "LK", "Matale"],
  ["LK-23", "LK", "Nuwara Eliya"],
  ["LK-3", "LK", "Southern"],
  ["LK-31", "LK", "Galle"],
  ["LK-32", "LK", "Matara"],
  ["LK-33", "LK", "Hambantota"],
  ["LK-4", "LK", "Northern"],
  ["LK-41", "LK", "Jaffna"],
  ["LK-42", "LK", "Kilinochchi"],
  ["LK-43", "LK", "Mannar"],
  ["LK-44", "LK", "Vavuniya"],
  ["LK-45", "LK", "Mullaitivu"],
  ["LK-5", "LK", "Eastern"],
  ["LK-51", "LK", "Batticaloa"],
  ["LK-52", "LK", "Ampara"],
  ["LK-53", "LK", "Trincomalee"],
  ["LK-6", "LK", "North Western"],
  ["LK-61", "LK", "Kurunegala"],
  ["LK-62", "LK", "Puttalam"],
  ["LK-7", "LK", "North Central"],
  ["LK-71", "LK", "Anuradhapura"],
  ["LK-72", "LK", "Polonnaruwa"],
  ["LK-8", "LK", "Uva"],
  ["LK-81", "LK", "Badulla"],
  ["LK-82", "LK", "Moneragala"],
  ["LK-9", "LK", "Sabaragamuwa"],
  ["LK-91", "LK", "Ratnapura"],
  ["LK-92", "LK", "Kegalle"],
  ["LR-BG", "LR", "Bong"],
  ["LR-BM", "LR", "Bomi"],
  ["LR-CM", "LR", "Grand Cape Mount"],
  ["LR-GB", "LR", "Grand Bassa"],
  ["LR-GG", "LR", "Grand Gedeh"],
  ["LR-GK", "LR", "Grand Kru"],
  ["LR-GP", "LR", "Gbarpolu"],
  ["LR-LO", "LR", "Lofa"],
  ["LR-MG", "LR", "Margibi"],
  ["LR-MO", "LR", "Montserrado"],
  ["LR-MY", "LR", "Maryland"],
  ["LR-NI", "LR", "Nimba"],
  ["LR-RG", "LR", "River Gee"],
  ["LR-RI", "LR", "Rivercess"],
  ["LR-SI", "LR", "Sinoe"],
  ["LS-A", "LS", "Maseru"],
  ["LS-B", "LS", "Butha-Buthe"],
  ["LS-C", "LS", "Leribe"],
  ["LS-D", "LS", "Berea"],
  ["LS-E", "LS", "Mafeteng"],
  ["LS-F", "LS", "Mohale\u2019s Hoek"],
  ["LS-G", "LS", "Quthing"],
  ["LS-H", "LS", "Qacha\u2019s Nek"],
  ["LS-J", "LS", "Mokhotlong"],
  ["LS-K", "LS", "Thaba-Tseka"],
  ["LT-01", "LT", "Akmen\u0117"],
  ["LT-02", "LT", "Alytus Municipality"],
  ["LT-03", "LT", "Alytus"],
  ["LT-04", "LT", "Anyk\u0161\u010Diai"],
  ["LT-05", "LT", "Bir\u0161tonas"],
  ["LT-06", "LT", "Bir\u017Eai"],
  ["LT-07", "LT", "Druskininkai"],
  ["LT-08", "LT", "Elektr\u0117nai"],
  ["LT-09", "LT", "Ignalina"],
  ["LT-10", "LT", "Jonava"],
  ["LT-11", "LT", "Joni\u0161kis"],
  ["LT-12", "LT", "Jurbarkas"],
  ["LT-13", "LT", "Kai\u0161iadorys"],
  ["LT-14", "LT", "Kalvarija"],
  ["LT-15", "LT", "Kauno Municipality"],
  ["LT-16", "LT", "Kaunas"],
  ["LT-17", "LT", "Kazl\u0173 R\u016Bda"],
  ["LT-18", "LT", "K\u0117dainiai"],
  ["LT-19", "LT", "Kelm\u0117"],
  ["LT-20", "LT", "Klaip\u0117dos Municipality"],
  ["LT-21", "LT", "Klaip\u0117da"],
  ["LT-22", "LT", "Kretinga"],
  ["LT-23", "LT", "Kupi\u0161kis"],
  ["LT-24", "LT", "Lazdijai"],
  ["LT-25", "LT", "Marijampol\u0117"],
  ["LT-26", "LT", "Ma\u017Eeikiai"],
  ["LT-27", "LT", "Mol\u0117tai"],
  ["LT-28", "LT", "Neringa"],
  ["LT-29", "LT", "Pag\u0117giai"],
  ["LT-30", "LT", "Pakruojis"],
  ["LT-31", "LT", "Palanga"],
  ["LT-32", "LT", "Panev\u0117\u017Eio Municipality"],
  ["LT-33", "LT", "Panev\u0117\u017Eys"],
  ["LT-34", "LT", "Pasvalys"],
  ["LT-35", "LT", "Plung\u0117"],
  ["LT-36", "LT", "Prienai"],
  ["LT-37", "LT", "Radvili\u0161kis"],
  ["LT-38", "LT", "Raseiniai"],
  ["LT-39", "LT", "Rietavas"],
  ["LT-40", "LT", "Roki\u0161kis"],
  ["LT-41", "LT", "\u0160akiai"],
  ["LT-42", "LT", "\u0160al\u010Dininkai"],
  ["LT-43", "LT", "\u0160iauli\u0173 Municipality"],
  ["LT-44", "LT", "\u0160iauliai"],
  ["LT-45", "LT", "\u0160ilal\u0117"],
  ["LT-46", "LT", "\u0160ilut\u0117"],
  ["LT-47", "LT", "\u0160irvintos"],
  ["LT-48", "LT", "Skuodas"],
  ["LT-49", "LT", "\u0160ven\u010Dionys"],
  ["LT-50", "LT", "Taurag\u0117"],
  ["LT-51", "LT", "Tel\u0161iai"],
  ["LT-52", "LT", "Trakai"],
  ["LT-53", "LT", "Ukmerg\u0117"],
  ["LT-54", "LT", "Utena"],
  ["LT-55", "LT", "Var\u0117na"],
  ["LT-56", "LT", "Vilkavi\u0161kis"],
  ["LT-57", "LT", "Vilniaus Municipality"],
  ["LT-58", "LT", "Vilnius"],
  ["LT-59", "LT", "Visaginas"],
  ["LT-60", "LT", "Zarasai"],
  ["LT-AL", "LT", "Alytus County"],
  ["LT-KL", "LT", "Klaip\u0117da County"],
  ["LT-KU", "LT", "Kaunas County"],
  ["LT-MR", "LT", "Marijampol\u0117 County"],
  ["LT-PN", "LT", "Panev\u0117\u017Eys County"],
  ["LT-SA", "LT", "\u0160iauliai County"],
  ["LT-TA", "LT", "Taurag\u0117 County"],
  ["LT-TE", "LT", "Tel\u0161iai County"],
  ["LT-UT", "LT", "Utena County"],
  ["LT-VL", "LT", "Vilnius County"],
  ["LU-CA", "LU", "Capellen"],
  ["LU-CL", "LU", "Clervaux"],
  ["LU-DI", "LU", "Diekirch"],
  ["LU-EC", "LU", "Echternach"],
  ["LU-ES", "LU", "Esch-sur-Alzette"],
  ["LU-GR", "LU", "Grevenmacher"],
  ["LU-LU", "LU", "Luxembourg"],
  ["LU-ME", "LU", "Mersch"],
  ["LU-RD", "LU", "Redange"],
  ["LU-RM", "LU", "Remich"],
  ["LU-VD", "LU", "Vianden"],
  ["LU-WI", "LU", "Wiltz"],
  ["LV-002", "LV", "Aizkraukle"],
  ["LV-007", "LV", "Al\u016Bksne"],
  ["LV-011", "LV", "\u0100da\u017Ei"],
  ["LV-015", "LV", "Balvi"],
  ["LV-016", "LV", "Bauska"],
  ["LV-022", "LV", "C\u0113sis"],
  ["LV-026", "LV", "Dobele"],
  ["LV-033", "LV", "Gulbene"],
  ["LV-041", "LV", "Jelgava Municipality"],
  ["LV-042", "LV", "J\u0113kabpils Municipality"],
  ["LV-047", "LV", "Kr\u0101slava"],
  ["LV-050", "LV", "Kuld\u012Bga"],
  ["LV-052", "LV", "\u0136ekava"],
  ["LV-054", "LV", "Limba\u017Ei"],
  ["LV-056", "LV", "L\u012Bv\u0101ni"],
  ["LV-058", "LV", "Ludza"],
  ["LV-059", "LV", "Madona"],
  ["LV-062", "LV", "M\u0101rupe"],
  ["LV-067", "LV", "Ogre"],
  ["LV-068", "LV", "Olaine"],
  ["LV-073", "LV", "Prei\u013Ci"],
  ["LV-077", "LV", "R\u0113zekne Municipality"],
  ["LV-080", "LV", "Ropa\u017Ei"],
  ["LV-087", "LV", "Salaspils"],
  ["LV-088", "LV", "Saldus"],
  ["LV-089", "LV", "Saulkrasti"],
  ["LV-091", "LV", "Sigulda"],
  ["LV-094", "LV", "Smiltene"],
  ["LV-097", "LV", "Talsi"],
  ["LV-099", "LV", "Tukums"],
  ["LV-101", "LV", "Valka"],
  ["LV-102", "LV", "Varak\u013C\u0101ni"],
  ["LV-106", "LV", "Ventspils Municipality"],
  ["LV-111", "LV", "Aug\u0161daugavas novads"],
  ["LV-112", "LV", "Dienvidkurzemes Novads"],
  ["LV-113", "LV", "Valmieras Novads"],
  ["LV-DGV", "LV", "Daugavpils"],
  ["LV-JEL", "LV", "Jelgava"],
  ["LV-JUR", "LV", "J\u016Brmala"],
  ["LV-LPX", "LV", "Liep\u0101ja"],
  ["LV-REZ", "LV", "R\u0113zekne"],
  ["LV-RIX", "LV", "Riga"],
  ["LV-VEN", "LV", "Ventspils"],
  ["LY-BA", "LY", "Benghazi"],
  ["LY-BU", "LY", "Butnan"],
  ["LY-DR", "LY", "Derna"],
  ["LY-GT", "LY", "Ghat"],
  ["LY-JA", "LY", "Jabal al Akhdar"],
  ["LY-JG", "LY", "Jabal al Gharbi"],
  ["LY-JI", "LY", "Jafara"],
  ["LY-JU", "LY", "Jufra"],
  ["LY-KF", "LY", "Kufra"],
  ["LY-MB", "LY", "Murqub"],
  ["LY-MI", "LY", "Misrata"],
  ["LY-MJ", "LY", "Marj"],
  ["LY-MQ", "LY", "Murzuq"],
  ["LY-NL", "LY", "Nalut"],
  ["LY-NQ", "LY", "Nuqat al Khams"],
  ["LY-SB", "LY", "Sabha"],
  ["LY-SR", "LY", "Sirte"],
  ["LY-TB", "LY", "Tripoli"],
  ["LY-WA", "LY", "Al Wahat"],
  ["LY-WD", "LY", "Wadi al Hayaa"],
  ["LY-WS", "LY", "Wadi al Shatii"],
  ["LY-ZA", "LY", "Zawiya"],
  ["MA-01", "MA", "Tangier-T\xE9touan"],
  ["MA-02", "MA", "Gharb-Chrarda-B\xE9ni Hssen"],
  ["MA-03", "MA", "Taza-Al Hoceima-Taounate"],
  ["MA-04", "MA", "Oriental"],
  ["MA-05", "MA", "F\xE8s-Boulemane"],
  ["MA-06", "MA", "Mekn\xE8s-Tafilalet"],
  ["MA-07", "MA", "Rabat-Sal\xE9-Zemmour-Zaer"],
  ["MA-08", "MA", "Grand Casablanca"],
  ["MA-09", "MA", "Chaouia-Ouardigha"],
  ["MA-10", "MA", "Doukkala-Abda"],
  ["MA-11", "MA", "Marrakesh-Tensift-El Haouz"],
  ["MA-12", "MA", "Tadla-Azilal"],
  ["MA-AGD", "MA", "Agadir-Ida Ou Tanane"],
  ["MA-AOU", "MA", "Aousserd"],
  ["MA-ASZ", "MA", "Assa-Zag"],
  ["MA-AZI", "MA", "Azilal"],
  ["MA-BEM", "MA", "B\xE9ni-Mellal"],
  ["MA-BER", "MA", "Berkane"],
  ["MA-BES", "MA", "Ben Slimane"],
  ["MA-BOD", "MA", "Boujdour"],
  ["MA-BOM", "MA", "Boulemane"],
  ["MA-BRR", "MA", "Berrechid"],
  ["MA-CAS", "MA", "Casablanca"],
  ["MA-CHE", "MA", "Chefchaouen"],
  ["MA-CHI", "MA", "Chichaoua"],
  ["MA-CHT", "MA", "Chtouka A\xEFt Baha"],
  ["MA-DRI", "MA", "Driouch"],
  ["MA-ERR", "MA", "Errachidia"],
  ["MA-ESI", "MA", "Essaouira"],
  ["MA-ESM", "MA", "Es Semara"],
  ["MA-FAH", "MA", "Fahs-Beni Makada"],
  ["MA-FES", "MA", "F\xE8s-Dar-Dbibegh"],
  ["MA-FIG", "MA", "Figuig"],
  ["MA-FQH", "MA", "Fquih Ben Salah"],
  ["MA-GUE", "MA", "Guelmim"],
  ["MA-GUF", "MA", "Guercif"],
  ["MA-HAJ", "MA", "El Hajeb"],
  ["MA-HAO", "MA", "Al Haouz"],
  ["MA-HOC", "MA", "Al Hoce\xEFma"],
  ["MA-IFR", "MA", "Ifrane"],
  ["MA-INE", "MA", "Inezgane-A\xEFt Melloul"],
  ["MA-JDI", "MA", "El Jadida"],
  ["MA-JRA", "MA", "Jerada"],
  ["MA-KEN", "MA", "K\xE9nitra"],
  ["MA-KES", "MA", "Kelaat Sraghna"],
  ["MA-KHE", "MA", "Khemisset"],
  ["MA-KHN", "MA", "Kh\xE9nifra"],
  ["MA-KHO", "MA", "Khouribga"],
  ["MA-LAA", "MA", "La\xE2youne"],
  ["MA-LAR", "MA", "Larache"],
  ["MA-MAR", "MA", "Marrakech"],
  ["MA-MDF", "MA", "M\u2019diq-Fnideq"],
  ["MA-MED", "MA", "M\xE9diouna"],
  ["MA-MEK", "MA", "Mekn\xE8s"],
  ["MA-MID", "MA", "Midelt"],
  ["MA-MOH", "MA", "Mohammedia"],
  ["MA-MOU", "MA", "Moulay Yacoub"],
  ["MA-NAD", "MA", "Nador"],
  ["MA-NOU", "MA", "Nouaceur"],
  ["MA-OUA", "MA", "Ouarzazate"],
  ["MA-OUD", "MA", "Oued Ed-Dahab"],
  ["MA-OUJ", "MA", "Oujda-Angad"],
  ["MA-OUZ", "MA", "Ouezzane"],
  ["MA-RAB", "MA", "Rabat"],
  ["MA-REH", "MA", "Rehamna"],
  ["MA-SAF", "MA", "Safi"],
  ["MA-SAL", "MA", "Sal\xE9"],
  ["MA-SEF", "MA", "Sefrou"],
  ["MA-SET", "MA", "Settat"],
  ["MA-SIB", "MA", "Sidi Bennour"],
  ["MA-SIF", "MA", "Sidi Ifni"],
  ["MA-SIK", "MA", "Sidi Kacem"],
  ["MA-SIL", "MA", "Sidi Slimane"],
  ["MA-SKH", "MA", "Skhirat-T\xE9mara"],
  ["MA-TAF", "MA", "Tarfaya (EH-partial)"],
  ["MA-TAI", "MA", "Taourirt"],
  ["MA-TAO", "MA", "Taounate"],
  ["MA-TAR", "MA", "Taroudant"],
  ["MA-TAT", "MA", "Tata"],
  ["MA-TAZ", "MA", "Taza"],
  ["MA-TET", "MA", "T\xE9touan"],
  ["MA-TIN", "MA", "Tinghir"],
  ["MA-TIZ", "MA", "Tiznit"],
  ["MA-TNG", "MA", "Tangier-Assilah"],
  ["MA-TNT", "MA", "Tan-Tan"],
  ["MA-YUS", "MA", "Youssoufia"],
  ["MA-ZAG", "MA", "Zagora"],
  ["MC-CL", "MC", "La Colle"],
  ["MC-CO", "MC", "La Condamine"],
  ["MC-FO", "MC", "Fontvieille"],
  ["MC-GA", "MC", "La Gare"],
  ["MC-JE", "MC", "Jardin Exotique de Monaco"],
  ["MC-LA", "MC", "Larvotto"],
  ["MC-MA", "MC", "Malbousquet"],
  ["MC-MC", "MC", "Monte Carlo"],
  ["MC-MG", "MC", "Moneghetti"],
  ["MC-MO", "MC", "Monaco-Ville"],
  ["MC-MU", "MC", "Moulins"],
  ["MC-PH", "MC", "Port Hercules"],
  ["MC-SD", "MC", "Sainte-D\xE9vote Chapel"],
  ["MC-SO", "MC", "La Source"],
  ["MC-SP", "MC", "Sp\xE9lugues"],
  ["MC-SR", "MC", "Saint Roman"],
  ["MC-VR", "MC", "Vallon de la Rousse"],
  ["MD-AN", "MD", "Anenii Noi"],
  ["MD-BA", "MD", "B\u0103l\u0163i"],
  ["MD-BD", "MD", "Bender"],
  ["MD-BR", "MD", "Briceni"],
  ["MD-BS", "MD", "Basarabeasca"],
  ["MD-CA", "MD", "Cahul"],
  ["MD-CL", "MD", "C\u0103l\u0103ra\u0219i"],
  ["MD-CM", "MD", "Cimi\u0219lia"],
  ["MD-CR", "MD", "Criuleni"],
  ["MD-CS", "MD", "C\u0103u\u0219eni"],
  ["MD-CT", "MD", "Cantemir"],
  ["MD-CU", "MD", "Chi\u0219in\u0103u"],
  ["MD-DO", "MD", "Dondu\u0219eni"],
  ["MD-DR", "MD", "Drochia"],
  ["MD-DU", "MD", "Dub\u0103sari"],
  ["MD-ED", "MD", "Edine\u021B"],
  ["MD-FA", "MD", "F\u0103le\u0219ti"],
  ["MD-FL", "MD", "Flore\u0219ti"],
  ["MD-GA", "MD", "Gagauzia"],
  ["MD-GL", "MD", "Glodeni"],
  ["MD-HI", "MD", "H\xEEnce\u0219ti"],
  ["MD-IA", "MD", "Ialoveni"],
  ["MD-LE", "MD", "Leova"],
  ["MD-NI", "MD", "Nisporeni"],
  ["MD-OC", "MD", "Ocni\u0163a"],
  ["MD-OR", "MD", "Orhei"],
  ["MD-RE", "MD", "Rezina"],
  ["MD-RI", "MD", "R\xEE\u0219cani"],
  ["MD-SD", "MD", "\u0218old\u0103ne\u0219ti"],
  ["MD-SI", "MD", "S\xEEngerei"],
  ["MD-SN", "MD", "Transnistria"],
  ["MD-SO", "MD", "Soroca"],
  ["MD-ST", "MD", "Str\u0103\u0219eni"],
  ["MD-SV", "MD", "\u015Etefan Vod\u0103"],
  ["MD-TA", "MD", "Taraclia"],
  ["MD-TE", "MD", "Telene\u0219ti"],
  ["MD-UN", "MD", "Ungheni"],
  ["ME-01", "ME", "Andrijevica"],
  ["ME-02", "ME", "Bar"],
  ["ME-03", "ME", "Berane"],
  ["ME-04", "ME", "Bijelo Polje"],
  ["ME-05", "ME", "Budva"],
  ["ME-06", "ME", "Cetinje"],
  ["ME-07", "ME", "Danilovgrad"],
  ["ME-08", "ME", "Herceg Novi"],
  ["ME-09", "ME", "Kola\u0161in"],
  ["ME-10", "ME", "Kotor"],
  ["ME-11", "ME", "Mojkovac"],
  ["ME-12", "ME", "Nik\u0161i\u0107"],
  ["ME-13", "ME", "Plav"],
  ["ME-14", "ME", "Pljevlja"],
  ["ME-15", "ME", "Plu\u017Eine"],
  ["ME-16", "ME", "Podgorica"],
  ["ME-17", "ME", "Ro\u017Eaje"],
  ["ME-18", "ME", "\u0160avnik"],
  ["ME-19", "ME", "Tivat"],
  ["ME-20", "ME", "Ulcinj"],
  ["ME-21", "ME", "\u017Dabljak"],
  ["ME-22", "ME", "Gusinje"],
  ["ME-23", "ME", "Petnjica"],
  ["ME-24", "ME", "Tuzi"],
  ["ME-25", "ME", "Zeta"],
  ["MG-A", "MG", "Toamasina"],
  ["MG-D", "MG", "Antsiranana"],
  ["MG-F", "MG", "Fianarantsoa"],
  ["MG-M", "MG", "Mahajanga"],
  ["MG-T", "MG", "Antananarivo"],
  ["MG-U", "MG", "Toliara"],
  ["MH-ALK", "MH", "Ailuk Atoll"],
  ["MH-ALL", "MH", "Ailinglaplap Atoll"],
  ["MH-ARN", "MH", "Arno"],
  ["MH-AUR", "MH", "Aur Atoll"],
  ["MH-EBO", "MH", "Ebon Atoll"],
  ["MH-ENI", "MH", "Enewetak Atoll"],
  ["MH-JAB", "MH", "Jabat Island"],
  ["MH-JAL", "MH", "Jaluit Atoll"],
  ["MH-KIL", "MH", "Kili Island"],
  ["MH-KWA", "MH", "Kwajalein"],
  ["MH-L", "MH", "Ralik Chain"],
  ["MH-LAE", "MH", "Lae Atoll"],
  ["MH-LIB", "MH", "Lib Island"],
  ["MH-LIK", "MH", "Likiep Atoll"],
  ["MH-MAJ", "MH", "Majuro"],
  ["MH-MAL", "MH", "Maloelap Atoll"],
  ["MH-MEJ", "MH", "Mejit Island"],
  ["MH-MIL", "MH", "Mili Atoll"],
  ["MH-NMK", "MH", "Namdrik Atoll"],
  ["MH-NMU", "MH", "Namu Atoll"],
  ["MH-RON", "MH", "Rongelap Atoll"],
  ["MH-T", "MH", "Ratak Chain"],
  ["MH-UJA", "MH", "Ujae Atoll"],
  ["MH-UTI", "MH", "Utirik Atoll"],
  ["MH-WTH", "MH", "Wotho Atoll"],
  ["MH-WTJ", "MH", "Wotje Atoll"],
  ["MK-101", "MK", "Veles"],
  ["MK-102", "MK", "Gradsko"],
  ["MK-103", "MK", "Demir Kapija"],
  ["MK-104", "MK", "Kavadarci"],
  ["MK-105", "MK", "Lozovo"],
  ["MK-106", "MK", "Negotino"],
  ["MK-107", "MK", "Rosoman"],
  ["MK-108", "MK", "Sveti Nikole"],
  ["MK-109", "MK", "\u010Ca\u0161ka"],
  ["MK-201", "MK", "Berovo"],
  ["MK-202", "MK", "Vinica"],
  ["MK-203", "MK", "Del\u010Devo"],
  ["MK-204", "MK", "Zrnovci"],
  ["MK-205", "MK", "Karbinci"],
  ["MK-206", "MK", "Ko\u010Dani"],
  ["MK-207", "MK", "Makedonska Kamenica"],
  ["MK-208", "MK", "Peh\u010Devo"],
  ["MK-209", "MK", "Probi\u0161tip"],
  ["MK-210", "MK", "\u010Ce\u0161inovo-Oble\u0161evo"],
  ["MK-211", "MK", "\u0160tip"],
  ["MK-301", "MK", "Vev\u010Dani"],
  ["MK-303", "MK", "Debar"],
  ["MK-304", "MK", "Debrca"],
  ["MK-307", "MK", "Ki\u010Devo"],
  ["MK-308", "MK", "Makedonski Brod"],
  ["MK-310", "MK", "Ohrid"],
  ["MK-311", "MK", "Plasnica"],
  ["MK-312", "MK", "Struga"],
  ["MK-313", "MK", "Centar \u017Dupa"],
  ["MK-401", "MK", "Bogdanci"],
  ["MK-402", "MK", "Bosilovo"],
  ["MK-403", "MK", "Valandovo"],
  ["MK-404", "MK", "Vasilevo"],
  ["MK-405", "MK", "Gevgelija"],
  ["MK-406", "MK", "Dojran"],
  ["MK-407", "MK", "Kon\u010De"],
  ["MK-408", "MK", "Novo Selo"],
  ["MK-409", "MK", "Radovi\u0161"],
  ["MK-410", "MK", "Strumica"],
  ["MK-501", "MK", "Bitola"],
  ["MK-502", "MK", "Demir Hisar"],
  ["MK-503", "MK", "Dolneni"],
  ["MK-504", "MK", "Krivoga\u0161tani"],
  ["MK-505", "MK", "Kru\u0161evo"],
  ["MK-506", "MK", "Mogila"],
  ["MK-507", "MK", "Novaci"],
  ["MK-508", "MK", "Prilep"],
  ["MK-509", "MK", "Resen"],
  ["MK-601", "MK", "Bogovinje"],
  ["MK-602", "MK", "Brvenica"],
  ["MK-603", "MK", "Vrap\u010Di\u0161te"],
  ["MK-604", "MK", "Gostivar"],
  ["MK-605", "MK", "\u017Delino"],
  ["MK-606", "MK", "Jegunovce"],
  ["MK-607", "MK", "Mavrovo i Rostu\u0161e"],
  ["MK-608", "MK", "Tearce"],
  ["MK-609", "MK", "Tetovo"],
  ["MK-701", "MK", "Kratovo"],
  ["MK-702", "MK", "Kriva Palanka"],
  ["MK-703", "MK", "Kumanovo"],
  ["MK-704", "MK", "Lipkovo"],
  ["MK-705", "MK", "Rankovce"],
  ["MK-706", "MK", "Staro Nagori\u010Dane"],
  ["MK-801", "MK", "Aerodrom \u2020"],
  ["MK-802", "MK", "Ara\u010Dinovo"],
  ["MK-803", "MK", "Butel \u2020"],
  ["MK-804", "MK", "Gazi Baba \u2020"],
  ["MK-805", "MK", "Gjor\u010De Petrov \u2020"],
  ["MK-806", "MK", "Zelenikovo"],
  ["MK-807", "MK", "Ilinden"],
  ["MK-808", "MK", "Karpo\u0161 \u2020"],
  ["MK-809", "MK", "Kisela Voda \u2020"],
  ["MK-810", "MK", "Petrovec"],
  ["MK-811", "MK", "Saraj \u2020"],
  ["MK-812", "MK", "Sopi\u0161te"],
  ["MK-813", "MK", "Studeni\u010Dani"],
  ["MK-814", "MK", "Centar \u2020"],
  ["MK-815", "MK", "\u010Cair \u2020"],
  ["MK-816", "MK", "\u010Cu\u010Der-Sandevo"],
  ["MK-817", "MK", "\u0160uto Orizari \u2020"],
  ["ML-1", "ML", "Kayes"],
  ["ML-10", "ML", "Taoud\xE9nit"],
  ["ML-2", "ML", "Koulikoro"],
  ["ML-3", "ML", "Sikasso"],
  ["ML-4", "ML", "S\xE9gou"],
  ["ML-5", "ML", "Mopti"],
  ["ML-6", "ML", "Tombouctou"],
  ["ML-7", "ML", "Gao"],
  ["ML-8", "ML", "Kidal"],
  ["ML-9", "ML", "M\xE9naka"],
  ["ML-BKO", "ML", "Bamako"],
  ["MM-01", "MM", "Sagaing"],
  ["MM-02", "MM", "Bago"],
  ["MM-03", "MM", "Magway"],
  ["MM-04", "MM", "Mandalay"],
  ["MM-05", "MM", "Tanintharyi"],
  ["MM-06", "MM", "Yangon"],
  ["MM-07", "MM", "Ayeyarwady"],
  ["MM-11", "MM", "Kachin"],
  ["MM-12", "MM", "Kayah"],
  ["MM-13", "MM", "Kayin"],
  ["MM-14", "MM", "Chin"],
  ["MM-15", "MM", "Mon"],
  ["MM-16", "MM", "Rakhine"],
  ["MM-17", "MM", "Shan"],
  ["MM-18", "MM", "Naypyidaw"],
  ["MN-035", "MN", "Orkhon"],
  ["MN-037", "MN", "Darkhan-Uul"],
  ["MN-039", "MN", "Khentii"],
  ["MN-041", "MN", "Kh\xF6vsg\xF6l"],
  ["MN-043", "MN", "Khovd"],
  ["MN-046", "MN", "Uvs"],
  ["MN-047", "MN", "T\xF6v"],
  ["MN-049", "MN", "Selenge"],
  ["MN-051", "MN", "S\xFCkhbaatar"],
  ["MN-053", "MN", "\xD6mn\xF6govi"],
  ["MN-055", "MN", "\xD6v\xF6rkhangai"],
  ["MN-057", "MN", "Zavkhan"],
  ["MN-059", "MN", "Dundgovi"],
  ["MN-061", "MN", "Dornod"],
  ["MN-063", "MN", "Dornogovi"],
  ["MN-064", "MN", "Govis\xFCmber"],
  ["MN-065", "MN", "Govi-Altai"],
  ["MN-067", "MN", "Bulgan"],
  ["MN-069", "MN", "Bayankhongor"],
  ["MN-071", "MN", "Bayan-\xD6lgii"],
  ["MN-073", "MN", "Arkhangai"],
  ["MN-1", "MN", "Ulaanbaatar"],
  ["MR-01", "MR", "Hodh Ech Chargui"],
  ["MR-02", "MR", "Hodh El Gharbi"],
  ["MR-03", "MR", "Assaba"],
  ["MR-04", "MR", "Gorgol"],
  ["MR-05", "MR", "Brakna"],
  ["MR-06", "MR", "Trarza"],
  ["MR-07", "MR", "Adrar"],
  ["MR-08", "MR", "Dakhlet Nouadhibou"],
  ["MR-09", "MR", "Tagant"],
  ["MR-10", "MR", "Guidimaka"],
  ["MR-11", "MR", "Tiris Zemmour"],
  ["MR-12", "MR", "Inchiri"],
  ["MR-13", "MR", "Nouakchott Ouest"],
  ["MR-14", "MR", "Nouakchott Nord"],
  ["MR-15", "MR", "Nouakchott Sud"],
  ["MT-01", "MT", "Attard"],
  ["MT-02", "MT", "Balzan"],
  ["MT-03", "MT", "Birgu"],
  ["MT-04", "MT", "Birkirkara"],
  ["MT-05", "MT", "Bir\u017Cebbu\u0121a"],
  ["MT-06", "MT", "Cospicua"],
  ["MT-07", "MT", "Dingli"],
  ["MT-08", "MT", "Fgura"],
  ["MT-09", "MT", "Floriana"],
  ["MT-10", "MT", "Fontana"],
  ["MT-11", "MT", "Gudja"],
  ["MT-12", "MT", "G\u017Cira"],
  ["MT-13", "MT", "G\u0127ajnsielem"],
  ["MT-14", "MT", "G\u0127arb"],
  ["MT-15", "MT", "G\u0127arg\u0127ur"],
  ["MT-16", "MT", "G\u0127asri"],
  ["MT-17", "MT", "G\u0127axaq"],
  ["MT-18", "MT", "\u0126amrun"],
  ["MT-19", "MT", "Iklin"],
  ["MT-20", "MT", "Senglea"],
  ["MT-21", "MT", "Kalkara"],
  ["MT-22", "MT", "Ker\u010Bem"],
  ["MT-23", "MT", "Kirkop"],
  ["MT-24", "MT", "Lija"],
  ["MT-25", "MT", "Luqa"],
  ["MT-26", "MT", "Marsa"],
  ["MT-27", "MT", "Marsaskala"],
  ["MT-28", "MT", "Marsaxlokk"],
  ["MT-29", "MT", "Mdina"],
  ["MT-30", "MT", "Mellie\u0127a"],
  ["MT-31", "MT", "M\u0121arr"],
  ["MT-32", "MT", "Mosta"],
  ["MT-33", "MT", "Mqabba"],
  ["MT-34", "MT", "Msida"],
  ["MT-35", "MT", "Imtarfa"],
  ["MT-36", "MT", "Munxar"],
  ["MT-37", "MT", "Nadur"],
  ["MT-38", "MT", "Naxxar"],
  ["MT-39", "MT", "Paola"],
  ["MT-40", "MT", "Pembroke"],
  ["MT-41", "MT", "Piet\xE0"],
  ["MT-42", "MT", "Qala"],
  ["MT-43", "MT", "Qormi"],
  ["MT-44", "MT", "Qrendi"],
  ["MT-45", "MT", "Victoria"],
  ["MT-46", "MT", "Rabat"],
  ["MT-47", "MT", "Safi"],
  ["MT-48", "MT", "St. Julian\u2019s"],
  ["MT-49", "MT", "San \u0120wann"],
  ["MT-50", "MT", "Saint Lawrence"],
  ["MT-51", "MT", "St. Paul\u2019s Bay"],
  ["MT-52", "MT", "Sannat"],
  ["MT-53", "MT", "Santa Lu\u010Bija"],
  ["MT-54", "MT", "Santa Venera"],
  ["MT-55", "MT", "Si\u0121\u0121iewi"],
  ["MT-56", "MT", "Sliema"],
  ["MT-57", "MT", "Swieqi"],
  ["MT-58", "MT", "Ta\u2019 Xbiex"],
  ["MT-59", "MT", "Tarxien"],
  ["MT-60", "MT", "Valletta"],
  ["MT-61", "MT", "Xag\u0127ra"],
  ["MT-62", "MT", "Xewkija"],
  ["MT-63", "MT", "Xg\u0127ajra"],
  ["MT-64", "MT", "\u017Babbar"],
  ["MT-65", "MT", "\u017Bebbu\u0121 Gozo"],
  ["MT-66", "MT", "\u017Bebbu\u0121"],
  ["MT-67", "MT", "\u017Bejtun"],
  ["MT-68", "MT", "\u017Burrieq"],
  ["MU-AG", "MU", "Agal\xE9ga"],
  ["MU-BL", "MU", "Rivi\xE8re Noire"],
  ["MU-CC", "MU", "Cargados Carajos"],
  ["MU-FL", "MU", "Flacq"],
  ["MU-GP", "MU", "Grand Port"],
  ["MU-MO", "MU", "Moka"],
  ["MU-PA", "MU", "Pamplemousses"],
  ["MU-PL", "MU", "Port Louis District"],
  ["MU-PW", "MU", "Plaines Wilhems"],
  ["MU-RO", "MU", "Rodrigues"],
  ["MU-RR", "MU", "Rivi\xE8re du Rempart"],
  ["MU-SA", "MU", "Savanne"],
  ["MV-00", "MV", "Alif Dhaal"],
  ["MV-01", "MV", "Addu"],
  ["MV-02", "MV", "Alif Alif"],
  ["MV-03", "MV", "Lhaviyani"],
  ["MV-04", "MV", "Vaavu"],
  ["MV-05", "MV", "Laamu"],
  ["MV-07", "MV", "Haa Alif"],
  ["MV-08", "MV", "Thaa"],
  ["MV-12", "MV", "Meemu"],
  ["MV-13", "MV", "Raa"],
  ["MV-14", "MV", "Faafu"],
  ["MV-17", "MV", "Dhaalu"],
  ["MV-20", "MV", "Baa"],
  ["MV-23", "MV", "Haa Dhaalu"],
  ["MV-24", "MV", "Shaviyani"],
  ["MV-25", "MV", "Noonu"],
  ["MV-26", "MV", "Kaafu"],
  ["MV-27", "MV", "Gaafu Alif"],
  ["MV-28", "MV", "Gaafu Dhaalu"],
  ["MV-29", "MV", "Gnaviyani"],
  ["MV-MLE", "MV", "Mal\xE9"],
  ["MW-BA", "MW", "Balaka"],
  ["MW-BL", "MW", "Blantyre"],
  ["MW-C", "MW", "Central"],
  ["MW-CK", "MW", "Chikwawa"],
  ["MW-CR", "MW", "Chiradzulu"],
  ["MW-CT", "MW", "Chitipa"],
  ["MW-DE", "MW", "Dedza"],
  ["MW-DO", "MW", "Dowa"],
  ["MW-KR", "MW", "Karonga"],
  ["MW-KS", "MW", "Kasungu"],
  ["MW-LI", "MW", "Lilongwe"],
  ["MW-LK", "MW", "Likoma"],
  ["MW-MC", "MW", "Mchinji"],
  ["MW-MG", "MW", "Mangochi"],
  ["MW-MH", "MW", "Machinga"],
  ["MW-MU", "MW", "Mulanje"],
  ["MW-MW", "MW", "Mwanza"],
  ["MW-MZ", "MW", "Mzimba"],
  ["MW-N", "MW", "Northern"],
  ["MW-NB", "MW", "Nkhata Bay"],
  ["MW-NE", "MW", "Neno"],
  ["MW-NI", "MW", "Ntchisi"],
  ["MW-NK", "MW", "Nkhotakota"],
  ["MW-NS", "MW", "Nsanje"],
  ["MW-NU", "MW", "Ntcheu"],
  ["MW-PH", "MW", "Phalombe"],
  ["MW-RU", "MW", "Rumphi"],
  ["MW-S", "MW", "Southern"],
  ["MW-SA", "MW", "Salima"],
  ["MW-TH", "MW", "Thyolo"],
  ["MW-ZO", "MW", "Zomba"],
  ["MX-AGU", "MX", "Aguascalientes"],
  ["MX-BCN", "MX", "Baja California"],
  ["MX-BCS", "MX", "Baja California Sur"],
  ["MX-CAM", "MX", "Campeche"],
  ["MX-CHH", "MX", "Chihuahua"],
  ["MX-CHP", "MX", "Chiapas"],
  ["MX-CMX", "MX", "Ciudad de Mexico"],
  ["MX-COA", "MX", "Coahuila"],
  ["MX-COL", "MX", "Colima"],
  ["MX-DUR", "MX", "Durango"],
  ["MX-GRO", "MX", "Guerrero"],
  ["MX-GUA", "MX", "Guanajuato"],
  ["MX-HID", "MX", "Hidalgo"],
  ["MX-JAL", "MX", "Jalisco"],
  ["MX-MEX", "MX", "Mexico State"],
  ["MX-MIC", "MX", "Michoac\xE1n"],
  ["MX-MOR", "MX", "Morelos"],
  ["MX-NAY", "MX", "Nayarit"],
  ["MX-NLE", "MX", "Nuevo Le\xF3n"],
  ["MX-OAX", "MX", "Oaxaca"],
  ["MX-PUE", "MX", "Puebla"],
  ["MX-QUE", "MX", "Quer\xE9taro"],
  ["MX-ROO", "MX", "Quintana Roo"],
  ["MX-SIN", "MX", "Sinaloa"],
  ["MX-SLP", "MX", "San Luis Potos\xED"],
  ["MX-SON", "MX", "Sonora"],
  ["MX-TAB", "MX", "Tabasco"],
  ["MX-TAM", "MX", "Tamaulipas"],
  ["MX-TLA", "MX", "Tlaxcala"],
  ["MX-VER", "MX", "Veracruz"],
  ["MX-YUC", "MX", "Yucat\xE1n"],
  ["MX-ZAC", "MX", "Zacatecas"],
  ["MY-01", "MY", "Johor"],
  ["MY-02", "MY", "Kedah"],
  ["MY-03", "MY", "Kelantan"],
  ["MY-04", "MY", "Malacca"],
  ["MY-05", "MY", "Negeri Sembilan"],
  ["MY-06", "MY", "Pahang"],
  ["MY-07", "MY", "Penang"],
  ["MY-08", "MY", "Perak"],
  ["MY-09", "MY", "Perlis"],
  ["MY-10", "MY", "Selangor"],
  ["MY-11", "MY", "Terengganu"],
  ["MY-12", "MY", "Sabah"],
  ["MY-13", "MY", "Sarawak"],
  ["MY-14", "MY", "Kuala Lumpur"],
  ["MY-15", "MY", "Labuan"],
  ["MY-16", "MY", "Putrajaya"],
  ["MZ-A", "MZ", "Niassa"],
  ["MZ-B", "MZ", "Manica"],
  ["MZ-G", "MZ", "Gaza"],
  ["MZ-I", "MZ", "Inhambane"],
  ["MZ-L", "MZ", "Maputo Province"],
  ["MZ-MPM", "MZ", "Maputo"],
  ["MZ-N", "MZ", "Nampula"],
  ["MZ-P", "MZ", "Cabo Delgado"],
  ["MZ-Q", "MZ", "Zambezia"],
  ["MZ-S", "MZ", "Sofala"],
  ["MZ-T", "MZ", "Tete"],
  ["NA-CA", "NA", "Zambezi"],
  ["NA-ER", "NA", "Erongo"],
  ["NA-HA", "NA", "Hardap"],
  ["NA-KA", "NA", "Karas"],
  ["NA-KE", "NA", "Kavango East"],
  ["NA-KH", "NA", "Khomas"],
  ["NA-KU", "NA", "Kunene"],
  ["NA-KW", "NA", "Kavango West"],
  ["NA-OD", "NA", "Otjozondjupa"],
  ["NA-OH", "NA", "Omaheke"],
  ["NA-ON", "NA", "Oshana"],
  ["NA-OS", "NA", "Omusati"],
  ["NA-OT", "NA", "Oshikoto"],
  ["NA-OW", "NA", "Ohangwena"],
  ["NE-1", "NE", "Agadez"],
  ["NE-2", "NE", "Diffa"],
  ["NE-3", "NE", "Dosso"],
  ["NE-4", "NE", "Maradi"],
  ["NE-5", "NE", "Tahoua"],
  ["NE-6", "NE", "Tillab\xE9ri"],
  ["NE-7", "NE", "Zinder"],
  ["NE-8", "NE", "Niamey"],
  ["NG-AB", "NG", "Abia"],
  ["NG-AD", "NG", "Adamawa"],
  ["NG-AK", "NG", "Akwa Ibom"],
  ["NG-AN", "NG", "Anambra"],
  ["NG-BA", "NG", "Bauchi"],
  ["NG-BE", "NG", "Benue"],
  ["NG-BO", "NG", "Borno"],
  ["NG-BY", "NG", "Bayelsa"],
  ["NG-CR", "NG", "Cross River"],
  ["NG-DE", "NG", "Delta"],
  ["NG-EB", "NG", "Ebonyi"],
  ["NG-ED", "NG", "Edo"],
  ["NG-EK", "NG", "Ekiti"],
  ["NG-EN", "NG", "Enugu"],
  ["NG-FC", "NG", "Federal Capital Territory"],
  ["NG-GO", "NG", "Gombe"],
  ["NG-IM", "NG", "Imo"],
  ["NG-JI", "NG", "Jigawa"],
  ["NG-KD", "NG", "Kaduna"],
  ["NG-KE", "NG", "Kebbi"],
  ["NG-KN", "NG", "Kano"],
  ["NG-KO", "NG", "Kogi"],
  ["NG-KT", "NG", "Katsina"],
  ["NG-KW", "NG", "Kwara"],
  ["NG-LA", "NG", "Lagos"],
  ["NG-NA", "NG", "Nasarawa"],
  ["NG-NI", "NG", "Niger"],
  ["NG-OG", "NG", "Ogun"],
  ["NG-ON", "NG", "Ondo"],
  ["NG-OS", "NG", "Osun"],
  ["NG-OY", "NG", "Oyo"],
  ["NG-PL", "NG", "Plateau"],
  ["NG-RI", "NG", "Rivers"],
  ["NG-SO", "NG", "Sokoto"],
  ["NG-TA", "NG", "Taraba"],
  ["NG-YO", "NG", "Yobe"],
  ["NG-ZA", "NG", "Zamfara"],
  ["NI-AN", "NI", "Atl\xE1ntico Norte"],
  ["NI-AS", "NI", "Atl\xE1ntico Sur"],
  ["NI-BO", "NI", "Boaco"],
  ["NI-CA", "NI", "Carazo"],
  ["NI-CI", "NI", "Chinandega"],
  ["NI-CO", "NI", "Chontales"],
  ["NI-ES", "NI", "Estel\xED"],
  ["NI-GR", "NI", "Granada"],
  ["NI-JI", "NI", "Jinotega"],
  ["NI-LE", "NI", "Le\xF3n"],
  ["NI-MD", "NI", "Madriz"],
  ["NI-MN", "NI", "Managua"],
  ["NI-MS", "NI", "Masaya"],
  ["NI-MT", "NI", "Matagalpa"],
  ["NI-NS", "NI", "Nueva Segovia"],
  ["NI-RI", "NI", "Rivas"],
  ["NI-SJ", "NI", "R\xEDo San Juan"],
  ["NL-AW", "NL", "Aruba"],
  ["NL-BQ1", "NL", "Bonaire"],
  ["NL-BQ2", "NL", "Saba"],
  ["NL-BQ3", "NL", "Sint Eustatius"],
  ["NL-CW", "NL", "Cura\xE7ao"],
  ["NL-DR", "NL", "Drenthe"],
  ["NL-FL", "NL", "Flevoland"],
  ["NL-FR", "NL", "Friesland"],
  ["NL-GE", "NL", "Gelderland"],
  ["NL-GR", "NL", "Groningen"],
  ["NL-LI", "NL", "Limburg"],
  ["NL-NB", "NL", "North Brabant"],
  ["NL-NH", "NL", "North Holland"],
  ["NL-OV", "NL", "Overijssel"],
  ["NL-SX", "NL", "Sint Maarten"],
  ["NL-UT", "NL", "Utrecht"],
  ["NL-ZE", "NL", "Zeeland"],
  ["NL-ZH", "NL", "South Holland"],
  ["NO-03", "NO", "Oslo"],
  ["NO-11", "NO", "Rogaland"],
  ["NO-15", "NO", "M\xF8re og Romsdal"],
  ["NO-18", "NO", "Nordland"],
  ["NO-21", "NO", "Svalbard"],
  ["NO-22", "NO", "Jan Mayen"],
  ["NO-30", "NO", "Viken"],
  ["NO-34", "NO", "Innlandet"],
  ["NO-38", "NO", "Vestfold og Telemark"],
  ["NO-42", "NO", "Agder"],
  ["NO-46", "NO", "Vestland"],
  ["NO-50", "NO", "Tr\xF8ndelag"],
  ["NO-54", "NO", "Tromssan ja Finmarkun"],
  ["NP-P1", "NP", "Province 1"],
  ["NP-P2", "NP", "Province 2"],
  ["NP-P3", "NP", "Province 3"],
  ["NP-P4", "NP", "Gandaki\xB2"],
  ["NP-P5", "NP", "Province 5"],
  ["NP-P6", "NP", "Karnali\xB2"],
  ["NP-P7", "NP", "Province 7"],
  ["NR-01", "NR", "Aiwo"],
  ["NR-02", "NR", "Anabar"],
  ["NR-03", "NR", "Anetan"],
  ["NR-04", "NR", "Anibare"],
  ["NR-05", "NR", "Baiti"],
  ["NR-06", "NR", "Boe"],
  ["NR-07", "NR", "Buada"],
  ["NR-08", "NR", "Denigomodu"],
  ["NR-09", "NR", "Ewa"],
  ["NR-10", "NR", "Ijuw"],
  ["NR-11", "NR", "Meneng"],
  ["NR-12", "NR", "Nibok"],
  ["NR-13", "NR", "Uaboe"],
  ["NR-14", "NR", "Yaren"],
  ["NZ-AUK", "NZ", "Auckland"],
  ["NZ-BOP", "NZ", "Bay of Plenty"],
  ["NZ-CAN", "NZ", "Canterbury"],
  ["NZ-CIT", "NZ", "Chatham Islands"],
  ["NZ-GIS", "NZ", "Gisborne"],
  ["NZ-HKB", "NZ", "Hawke\u2019s Bay"],
  ["NZ-MBH", "NZ", "Marl"],
  ["NZ-MWT", "NZ", "Manawatu-Wanganui"],
  ["NZ-NSN", "NZ", "Nelson"],
  ["NZ-NTL", "NZ", "Northland"],
  ["NZ-OTA", "NZ", "Otago"],
  ["NZ-STL", "NZ", "Southland"],
  ["NZ-TAS", "NZ", "Tasman"],
  ["NZ-TKI", "NZ", "Taranaki"],
  ["NZ-WGN", "NZ", "Wellington"],
  ["NZ-WKO", "NZ", "Waikato"],
  ["NZ-WTC", "NZ", "West Coast"],
  ["OM-BJ", "OM", "Janub al Batinah"],
  ["OM-BS", "OM", "Shamal al Batinah"],
  ["OM-BU", "OM", "Al Buraimi"],
  ["OM-DA", "OM", "Ad Dakhiliyah"],
  ["OM-MA", "OM", "Muscat"],
  ["OM-MU", "OM", "Musandam"],
  ["OM-SJ", "OM", "Janub ash Sharqiyah"],
  ["OM-SS", "OM", "Shamal ash Sharqiyah"],
  ["OM-WU", "OM", "Al Wusta"],
  ["OM-ZA", "OM", "Ad Dhahirah"],
  ["OM-ZU", "OM", "Dhofar"],
  ["PA-1", "PA", "Bocas del Toro"],
  ["PA-10", "PA", "West Panam\xE1"],
  ["PA-2", "PA", "Cocl\xE9"],
  ["PA-3", "PA", "Col\xF3n"],
  ["PA-4", "PA", "Chiriqu\xED"],
  ["PA-5", "PA", "Dari\xE9n"],
  ["PA-6", "PA", "Herrera"],
  ["PA-7", "PA", "Los Santos"],
  ["PA-8", "PA", "Panam\xE1"],
  ["PA-9", "PA", "Veraguas"],
  ["PA-EM", "PA", "Ember\xE1"],
  ["PA-KY", "PA", "Guna Yala"],
  ["PA-NB", "PA", "Ng\xF6be-Bugl\xE9"],
  ["PA-NT", "PA", "Naso Tj\xEBr Di"],
  ["PE-AMA", "PE", "Amazonas"],
  ["PE-ANC", "PE", "Ancash"],
  ["PE-APU", "PE", "Apur\xEDmac"],
  ["PE-ARE", "PE", "Arequipa"],
  ["PE-AYA", "PE", "Ayacucho"],
  ["PE-CAJ", "PE", "Cajamarca"],
  ["PE-CAL", "PE", "El Callao"],
  ["PE-CUS", "PE", "Cusco"],
  ["PE-HUC", "PE", "Hu\xE1nuco"],
  ["PE-HUV", "PE", "Huancavelica"],
  ["PE-ICA", "PE", "Ica"],
  ["PE-JUN", "PE", "Jun\xEDn"],
  ["PE-LAL", "PE", "La Libertad"],
  ["PE-LAM", "PE", "Lambayeque"],
  ["PE-LIM", "PE", "Lima Region"],
  ["PE-LMA", "PE", "Lima"],
  ["PE-LOR", "PE", "Loreto"],
  ["PE-MDD", "PE", "Madre de Dios"],
  ["PE-MOQ", "PE", "Moquegua"],
  ["PE-PAS", "PE", "Pasco"],
  ["PE-PIU", "PE", "Piura"],
  ["PE-PUN", "PE", "Puno"],
  ["PE-SAM", "PE", "San Mart\xEDn"],
  ["PE-TAC", "PE", "Tacna"],
  ["PE-TUM", "PE", "Tumbes"],
  ["PE-UCA", "PE", "Ucayali"],
  ["PG-CPK", "PG", "Chimbu"],
  ["PG-CPM", "PG", "Central"],
  ["PG-EBR", "PG", "East New Britain"],
  ["PG-EHG", "PG", "Eastern Highlands"],
  ["PG-EPW", "PG", "Enga"],
  ["PG-ESW", "PG", "East Sepik"],
  ["PG-GPK", "PG", "Gulf"],
  ["PG-HLA", "PG", "Hela"],
  ["PG-JWK", "PG", "Jiwaka"],
  ["PG-MBA", "PG", "Milne Bay"],
  ["PG-MPL", "PG", "Morobe"],
  ["PG-MPM", "PG", "Madang"],
  ["PG-MRL", "PG", "Manus"],
  ["PG-NCD", "PG", "Port Moresby"],
  ["PG-NIK", "PG", "New Ireland"],
  ["PG-NPP", "PG", "Oro"],
  ["PG-NSB", "PG", "Bougainville"],
  ["PG-SAN", "PG", "Sandaun"],
  ["PG-SHM", "PG", "Southern Highlands"],
  ["PG-WBK", "PG", "West New Britain"],
  ["PG-WHM", "PG", "Western Highlands"],
  ["PG-WPD", "PG", "Western"],
  ["PH-00", "PH", "Metro Manila"],
  ["PH-01", "PH", "Ilocos"],
  ["PH-02", "PH", "Cagayan Valley"],
  ["PH-03", "PH", "Central Luzon"],
  ["PH-05", "PH", "Bicol"],
  ["PH-06", "PH", "Western Visayas"],
  ["PH-07", "PH", "Central Visayas"],
  ["PH-08", "PH", "Eastern Visayas"],
  ["PH-09", "PH", "Zamboanga Peninsula"],
  ["PH-10", "PH", "Northern Mindanao"],
  ["PH-11", "PH", "Davao"],
  ["PH-12", "PH", "Soccsksargen"],
  ["PH-13", "PH", "Caraga"],
  ["PH-14", "PH", "Muslim Mindanao"],
  ["PH-15", "PH", "Cordillera Administrative"],
  ["PH-40", "PH", "Calabarzon"],
  ["PH-41", "PH", "Mimaropa"],
  ["PH-ABR", "PH", "Abra"],
  ["PH-AGN", "PH", "Agusan del Norte"],
  ["PH-AGS", "PH", "Agusan del Sur"],
  ["PH-AKL", "PH", "Aklan"],
  ["PH-ALB", "PH", "Albay"],
  ["PH-ANT", "PH", "Antique"],
  ["PH-APA", "PH", "Apayao"],
  ["PH-AUR", "PH", "Aurora"],
  ["PH-BAN", "PH", "Bataan"],
  ["PH-BAS", "PH", "Basilan"],
  ["PH-BEN", "PH", "Benguet"],
  ["PH-BIL", "PH", "Biliran"],
  ["PH-BOH", "PH", "Bohol"],
  ["PH-BTG", "PH", "Batangas"],
  ["PH-BTN", "PH", "Batanes"],
  ["PH-BUK", "PH", "Bukidnon"],
  ["PH-BUL", "PH", "Bulacan"],
  ["PH-CAG", "PH", "Cagayan"],
  ["PH-CAM", "PH", "Camiguin"],
  ["PH-CAN", "PH", "Camarines Norte"],
  ["PH-CAP", "PH", "Capiz"],
  ["PH-CAS", "PH", "Camarines Sur"],
  ["PH-CAT", "PH", "Catanduanes"],
  ["PH-CAV", "PH", "Cavite"],
  ["PH-CEB", "PH", "Cebu"],
  ["PH-COM", "PH", "Compostela Valley"],
  ["PH-DAO", "PH", "Davao Oriental"],
  ["PH-DAS", "PH", "Davao del Sur"],
  ["PH-DAV", "PH", "Davao del Norte"],
  ["PH-DIN", "PH", "Dinagat Islands"],
  ["PH-DVO", "PH", "Davao Occidental"],
  ["PH-EAS", "PH", "Eastern Samar"],
  ["PH-GUI", "PH", "Guimaras"],
  ["PH-IFU", "PH", "Ifugao"],
  ["PH-ILI", "PH", "Iloilo"],
  ["PH-ILN", "PH", "Ilocos Norte"],
  ["PH-ILS", "PH", "Ilocos Sur"],
  ["PH-ISA", "PH", "Isabela"],
  ["PH-KAL", "PH", "Kalinga"],
  ["PH-LAG", "PH", "Laguna"],
  ["PH-LAN", "PH", "Lanao del Norte"],
  ["PH-LAS", "PH", "Lanao del Sur"],
  ["PH-LEY", "PH", "Leyte"],
  ["PH-LUN", "PH", "La Union"],
  ["PH-MAD", "PH", "Marinduque"],
  ["PH-MAS", "PH", "Masbate"],
  ["PH-MDC", "PH", "Occidental Mindoro"],
  ["PH-MDR", "PH", "Oriental Mindoro"],
  ["PH-MGN", "PH", "Maguindanao del Norte"],
  ["PH-MGS", "PH", "Maguindanao del Sur"],
  ["PH-MOU", "PH", "Mountain"],
  ["PH-MSC", "PH", "Misamis Occidental"],
  ["PH-MSR", "PH", "Misamis Oriental"],
  ["PH-NCO", "PH", "Cotabato"],
  ["PH-NEC", "PH", "Negros Occidental"],
  ["PH-NER", "PH", "Negros Oriental"],
  ["PH-NSA", "PH", "Northern Samar"],
  ["PH-NUE", "PH", "Nueva Ecija"],
  ["PH-NUV", "PH", "Nueva Vizcaya"],
  ["PH-PAM", "PH", "Pampanga"],
  ["PH-PAN", "PH", "Pangasinan"],
  ["PH-PLW", "PH", "Palawan"],
  ["PH-QUE", "PH", "Quezon"],
  ["PH-QUI", "PH", "Quirino"],
  ["PH-RIZ", "PH", "Rizal"],
  ["PH-ROM", "PH", "Romblon"],
  ["PH-SAR", "PH", "Sarangani"],
  ["PH-SCO", "PH", "South Cotabato"],
  ["PH-SIG", "PH", "Siquijor"],
  ["PH-SLE", "PH", "Southern Leyte"],
  ["PH-SLU", "PH", "Sulu"],
  ["PH-SOR", "PH", "Sorsogon"],
  ["PH-SUK", "PH", "Sultan Kudarat"],
  ["PH-SUN", "PH", "Surigao del Norte"],
  ["PH-SUR", "PH", "Surigao del Sur"],
  ["PH-TAR", "PH", "Tarlac"],
  ["PH-TAW", "PH", "Tawi-Tawi"],
  ["PH-WSA", "PH", "Samar"],
  ["PH-ZAN", "PH", "Zamboanga del Norte"],
  ["PH-ZAS", "PH", "Zamboanga del Sur"],
  ["PH-ZMB", "PH", "Zambales"],
  ["PH-ZSI", "PH", "Zamboanga Sibugay"],
  ["PK-BA", "PK", "Balochistan"],
  ["PK-GB", "PK", "Gilgit-Baltistan"],
  ["PK-IS", "PK", "Islamabad"],
  ["PK-JK", "PK", "Azad Kashmir"],
  ["PK-KP", "PK", "Khyber Pakhtunkhwa"],
  ["PK-PB", "PK", "Punjab"],
  ["PK-SD", "PK", "Sindh"],
  ["PL-02", "PL", "Lower Silesia"],
  ["PL-04", "PL", "Kuyavia-Pomerania"],
  ["PL-06", "PL", "Lublin"],
  ["PL-08", "PL", "Lubusz"],
  ["PL-10", "PL", "\u0141\xF3d\u017A"],
  ["PL-12", "PL", "Lesser Poland"],
  ["PL-14", "PL", "Mazovia"],
  ["PL-16", "PL", "Opole"],
  ["PL-18", "PL", "Subcarpathia"],
  ["PL-20", "PL", "Podlachia"],
  ["PL-22", "PL", "Pomerania"],
  ["PL-24", "PL", "Silesia"],
  ["PL-26", "PL", "Holy Cross"],
  ["PL-28", "PL", "Warmia-Masuria"],
  ["PL-30", "PL", "Greater Poland"],
  ["PL-32", "PL", "West Pomerania"],
  ["PS-BTH", "PS", "Bethlehem"],
  ["PS-DEB", "PS", "Deir al-Balah"],
  ["PS-GZA", "PS", "Gaza"],
  ["PS-HBN", "PS", "Hebron"],
  ["PS-JEM", "PS", "Jerusalem"],
  ["PS-JEN", "PS", "Jenin"],
  ["PS-JRH", "PS", "Jericho"],
  ["PS-KYS", "PS", "Khan Yunis"],
  ["PS-NBS", "PS", "Nablus"],
  ["PS-NGZ", "PS", "North Gaza"],
  ["PS-QQA", "PS", "Qalqilya"],
  ["PS-RBH", "PS", "Ramallah and al-Bireh"],
  ["PS-RFH", "PS", "Rafah"],
  ["PS-SLT", "PS", "Salfit"],
  ["PS-TBS", "PS", "Tubas"],
  ["PS-TKM", "PS", "Tulkarm"],
  ["PT-01", "PT", "Aveiro"],
  ["PT-02", "PT", "Beja"],
  ["PT-03", "PT", "Braga"],
  ["PT-04", "PT", "Bragan\xE7a"],
  ["PT-05", "PT", "Castelo Branco"],
  ["PT-06", "PT", "Coimbra"],
  ["PT-07", "PT", "\xC9vora"],
  ["PT-08", "PT", "Faro"],
  ["PT-09", "PT", "Guarda"],
  ["PT-10", "PT", "Leiria"],
  ["PT-11", "PT", "Lisbon"],
  ["PT-12", "PT", "Portalegre"],
  ["PT-13", "PT", "Porto"],
  ["PT-14", "PT", "Santar\xE9m"],
  ["PT-15", "PT", "Set\xFAbal"],
  ["PT-16", "PT", "Viana do Castelo"],
  ["PT-17", "PT", "Vila Real"],
  ["PT-18", "PT", "Viseu"],
  ["PT-20", "PT", "Azores"],
  ["PT-30", "PT", "Madeira"],
  ["PW-002", "PW", "Aimeliik"],
  ["PW-004", "PW", "Airai"],
  ["PW-010", "PW", "Angaur"],
  ["PW-050", "PW", "Hatohobei"],
  ["PW-100", "PW", "Kayangel"],
  ["PW-150", "PW", "Koror"],
  ["PW-212", "PW", "Melekeok"],
  ["PW-214", "PW", "Ngaraard"],
  ["PW-218", "PW", "Ngarchelong"],
  ["PW-222", "PW", "Ngardmau"],
  ["PW-224", "PW", "Ngatpang"],
  ["PW-226", "PW", "Ngchesar"],
  ["PW-227", "PW", "Ngeremlengui"],
  ["PW-228", "PW", "Ngiwal"],
  ["PW-350", "PW", "Peleliu"],
  ["PW-370", "PW", "Sonsorol"],
  ["PY-1", "PY", "Concepci\xF3n"],
  ["PY-10", "PY", "Alto Paran\xE1"],
  ["PY-11", "PY", "Central"],
  ["PY-12", "PY", "\xD1eembuc\xFA"],
  ["PY-13", "PY", "Amambay"],
  ["PY-14", "PY", "Canindey\xFA"],
  ["PY-15", "PY", "Presidente Hayes"],
  ["PY-16", "PY", "Alto Paraguay"],
  ["PY-19", "PY", "Boquer\xF3n"],
  ["PY-2", "PY", "San Pedro"],
  ["PY-3", "PY", "Cordillera"],
  ["PY-4", "PY", "Guair\xE1"],
  ["PY-5", "PY", "Caaguaz\xFA"],
  ["PY-6", "PY", "Caazap\xE1"],
  ["PY-7", "PY", "Itap\xFAa"],
  ["PY-8", "PY", "Misiones"],
  ["PY-9", "PY", "Paraguar\xED"],
  ["PY-ASU", "PY", "Asunci\xF3n"],
  ["QA-DA", "QA", "Doha"],
  ["QA-KH", "QA", "Al Khor"],
  ["QA-MS", "QA", "Madinat ash Shamal"],
  ["QA-RA", "QA", "Al Rayyan"],
  ["QA-SH", "QA", "Ash Sh\u012B\u1E29\u0101n\u012Byah"],
  ["QA-US", "QA", "Umm Salal"],
  ["QA-WA", "QA", "Al Wakrah"],
  ["QA-ZA", "QA", "Al Daayen"],
  ["RO-AB", "RO", "Alba"],
  ["RO-AG", "RO", "Arge\u0219"],
  ["RO-AR", "RO", "Arad"],
  ["RO-B", "RO", "Bucharest"],
  ["RO-BC", "RO", "Bac\u0103u"],
  ["RO-BH", "RO", "Bihor"],
  ["RO-BN", "RO", "Bistri\u0163a-N\u0103s\u0103ud"],
  ["RO-BR", "RO", "Br\u0103ila"],
  ["RO-BT", "RO", "Boto\u015Fani"],
  ["RO-BV", "RO", "Bra\u015Fov"],
  ["RO-BZ", "RO", "Buz\u0103u"],
  ["RO-CJ", "RO", "Cluj"],
  ["RO-CL", "RO", "C\u0103l\u0103ra\u0219i"],
  ["RO-CS", "RO", "Cara\u0219-Severin"],
  ["RO-CT", "RO", "Constan\u021Ba"],
  ["RO-CV", "RO", "Covasna"],
  ["RO-DB", "RO", "D\xE2mbovi\u021Ba"],
  ["RO-DJ", "RO", "Dolj"],
  ["RO-GJ", "RO", "Gorj"],
  ["RO-GL", "RO", "Gala\u021Bi"],
  ["RO-GR", "RO", "Giurgiu"],
  ["RO-HD", "RO", "Hunedoara"],
  ["RO-HR", "RO", "Harghita"],
  ["RO-IF", "RO", "Ilfov"],
  ["RO-IL", "RO", "Ialomi\u021Ba"],
  ["RO-IS", "RO", "Ia\u0219i"],
  ["RO-MH", "RO", "Mehedin\u021Bi"],
  ["RO-MM", "RO", "Maramure\u015F"],
  ["RO-MS", "RO", "Mure\u015F"],
  ["RO-NT", "RO", "Neam\u0163"],
  ["RO-OT", "RO", "Olt"],
  ["RO-PH", "RO", "Prahova"],
  ["RO-SB", "RO", "Sibiu"],
  ["RO-SJ", "RO", "S\u0103laj"],
  ["RO-SM", "RO", "Satu Mare"],
  ["RO-SV", "RO", "Suceava"],
  ["RO-TL", "RO", "Tulcea"],
  ["RO-TM", "RO", "Timi\u0219"],
  ["RO-TR", "RO", "Teleorman"],
  ["RO-VL", "RO", "V\xE2lcea"],
  ["RO-VN", "RO", "Vrancea"],
  ["RO-VS", "RO", "Vaslui"],
  ["RS-00", "RS", "Beograd"],
  ["RS-01", "RS", "North Ba\u010Dka"],
  ["RS-02", "RS", "Central Banat"],
  ["RS-03", "RS", "North Banat"],
  ["RS-04", "RS", "South Banat"],
  ["RS-05", "RS", "West Ba\u010Dka"],
  ["RS-06", "RS", "South Ba\u010Dka"],
  ["RS-07", "RS", "Srem"],
  ["RS-08", "RS", "Ma\u010Dva"],
  ["RS-09", "RS", "Kolubara"],
  ["RS-10", "RS", "Podunavlje"],
  ["RS-11", "RS", "Brani\u010Devo"],
  ["RS-12", "RS", "\u0160umadija"],
  ["RS-13", "RS", "Pomoravlje"],
  ["RS-14", "RS", "Bor"],
  ["RS-15", "RS", "Zaje\u010Dar"],
  ["RS-16", "RS", "Zlatibor"],
  ["RS-17", "RS", "Moravica"],
  ["RS-18", "RS", "Ra\u0161ka"],
  ["RS-19", "RS", "Rasina"],
  ["RS-20", "RS", "Ni\u0161ava"],
  ["RS-21", "RS", "Toplica"],
  ["RS-22", "RS", "Pirot"],
  ["RS-23", "RS", "Jablanica"],
  ["RS-24", "RS", "P\u010Dinja"],
  ["RS-25", "RS", "Kosovo"],
  ["RS-26", "RS", "Pe\u0107"],
  ["RS-27", "RS", "Prizren"],
  ["RS-28", "RS", "Kosovska Mitrovica"],
  ["RS-29", "RS", "Kosovo-Pomoravlje"],
  ["RS-KM", "RS", "Kosovo-Metohija"],
  ["RS-VO", "RS", "Vojvodina"],
  ["RU-AD", "RU", "Adygea"],
  ["RU-AL", "RU", "Altai"],
  ["RU-ALT", "RU", "Altai Krai"],
  ["RU-AMU", "RU", "Amur"],
  ["RU-ARK", "RU", "Arkhangelsk"],
  ["RU-AST", "RU", "Astrakhan"],
  ["RU-BA", "RU", "Bashkortostan"],
  ["RU-BEL", "RU", "Belgorod"],
  ["RU-BRY", "RU", "Bryansk"],
  ["RU-BU", "RU", "Buryat"],
  ["RU-CE", "RU", "Chechen"],
  ["RU-CHE", "RU", "Chelyabinsk"],
  ["RU-CHU", "RU", "Chukotka Okrug"],
  ["RU-CU", "RU", "Chuvash"],
  ["RU-DA", "RU", "Dagestan"],
  ["RU-IN", "RU", "Ingushetia"],
  ["RU-IRK", "RU", "Irkutsk"],
  ["RU-IVA", "RU", "Ivanovo"],
  ["RU-KAM", "RU", "Kamchatka Krai"],
  ["RU-KB", "RU", "Kabardino-Balkar"],
  ["RU-KC", "RU", "Karachay-Cherkess"],
  ["RU-KDA", "RU", "Krasnodar Krai"],
  ["RU-KEM", "RU", "Kemerovo"],
  ["RU-KGD", "RU", "Kaliningrad"],
  ["RU-KGN", "RU", "Kurgan"],
  ["RU-KHA", "RU", "Khabarovsk Krai"],
  ["RU-KHM", "RU", "Khanty-Mansi"],
  ["RU-KIR", "RU", "Kirov"],
  ["RU-KK", "RU", "Khakassia"],
  ["RU-KL", "RU", "Kalmykia"],
  ["RU-KLU", "RU", "Kaluga"],
  ["RU-KO", "RU", "Komi"],
  ["RU-KOS", "RU", "Kostroma"],
  ["RU-KR", "RU", "Karelia"],
  ["RU-KRS", "RU", "Kursk"],
  ["RU-KYA", "RU", "Krasnoyarsk Krai"],
  ["RU-LEN", "RU", "Leningrad"],
  ["RU-LIP", "RU", "Lipetsk"],
  ["RU-MAG", "RU", "Magadan"],
  ["RU-ME", "RU", "Mari El"],
  ["RU-MO", "RU", "Mordovia"],
  ["RU-MOS", "RU", "Moscow Province"],
  ["RU-MOW", "RU", "Moscow"],
  ["RU-MUR", "RU", "Murmansk"],
  ["RU-NEN", "RU", "Nenets"],
  ["RU-NGR", "RU", "Novgorod"],
  ["RU-NIZ", "RU", "Nizhny Novgorod"],
  ["RU-NVS", "RU", "Novosibirsk"],
  ["RU-OMS", "RU", "Omsk"],
  ["RU-ORE", "RU", "Orenburg"],
  ["RU-ORL", "RU", "Oryol"],
  ["RU-PER", "RU", "Perm Krai"],
  ["RU-PNZ", "RU", "Penza"],
  ["RU-PRI", "RU", "Primorsky Krai"],
  ["RU-PSK", "RU", "Pskov"],
  ["RU-ROS", "RU", "Rostov"],
  ["RU-RYA", "RU", "Ryazan"],
  ["RU-SA", "RU", "Sakha"],
  ["RU-SAK", "RU", "Sakhalin"],
  ["RU-SAM", "RU", "Samara"],
  ["RU-SAR", "RU", "Saratov"],
  ["RU-SE", "RU", "North Ossetia-Alania"],
  ["RU-SMO", "RU", "Smolensk"],
  ["RU-SPE", "RU", "Saint Petersburg"],
  ["RU-STA", "RU", "Stavropol Krai"],
  ["RU-SVE", "RU", "Sverdlovsk"],
  ["RU-TA", "RU", "Tatarstan"],
  ["RU-TAM", "RU", "Tambov"],
  ["RU-TOM", "RU", "Tomsk"],
  ["RU-TUL", "RU", "Tula"],
  ["RU-TVE", "RU", "Tver"],
  ["RU-TY", "RU", "Tuva"],
  ["RU-TYU", "RU", "Tyumen"],
  ["RU-UD", "RU", "Udmurt"],
  ["RU-ULY", "RU", "Ulyanovsk"],
  ["RU-VGG", "RU", "Volgograd"],
  ["RU-VLA", "RU", "Vladimir"],
  ["RU-VLG", "RU", "Vologda"],
  ["RU-VOR", "RU", "Voronezh"],
  ["RU-YAN", "RU", "Yamalo-Nenets Okrug"],
  ["RU-YAR", "RU", "Yaroslavl"],
  ["RU-YEV", "RU", "Jewish"],
  ["RU-ZAB", "RU", "Zabaykalsky Krai"],
  ["RW-01", "RW", "Kigali"],
  ["RW-02", "RW", "Eastern"],
  ["RW-03", "RW", "Northern"],
  ["RW-04", "RW", "Western"],
  ["RW-05", "RW", "Southern"],
  ["SA-01", "SA", "Riyadh"],
  ["SA-02", "SA", "Makkah"],
  ["SA-03", "SA", "Al Madinah"],
  ["SA-04", "SA", "Eastern"],
  ["SA-05", "SA", "Al-Qassim"],
  ["SA-06", "SA", "Ha\u2019il"],
  ["SA-07", "SA", "Tabuk"],
  ["SA-08", "SA", "Northern Borders"],
  ["SA-09", "SA", "Jizan"],
  ["SA-10", "SA", "Najran"],
  ["SA-11", "SA", "Al Bahah"],
  ["SA-12", "SA", "Al Jawf"],
  ["SA-14", "SA", "Asir"],
  ["SB-CE", "SB", "Central"],
  ["SB-CH", "SB", "Choiseul"],
  ["SB-CT", "SB", "Honiara"],
  ["SB-GU", "SB", "Guadalcanal"],
  ["SB-IS", "SB", "Isabel"],
  ["SB-MK", "SB", "Makira-Ulawa"],
  ["SB-ML", "SB", "Malaita"],
  ["SB-RB", "SB", "Rennell and Bellona"],
  ["SB-TE", "SB", "Temotu"],
  ["SB-WE", "SB", "Western"],
  ["SC-01", "SC", "Anse aux Pins"],
  ["SC-02", "SC", "Anse Boileau"],
  ["SC-03", "SC", "Anse Etoile"],
  ["SC-04", "SC", "Au Cap"],
  ["SC-05", "SC", "Anse Royale"],
  ["SC-06", "SC", "Baie Lazare"],
  ["SC-07", "SC", "Baie Sainte Anne"],
  ["SC-08", "SC", "Beau Vallon"],
  ["SC-09", "SC", "Bel Air"],
  ["SC-10", "SC", "Bel Ombre"],
  ["SC-11", "SC", "Cascade"],
  ["SC-12", "SC", "Glacis"],
  ["SC-13", "SC", "Grand\u2019Anse Mah\xE9"],
  ["SC-14", "SC", "Grand\u2019Anse Praslin"],
  ["SC-15", "SC", "La Digue"],
  ["SC-16", "SC", "La Rivi\xE8re Anglaise"],
  ["SC-17", "SC", "Mont Buxton"],
  ["SC-18", "SC", "Mont Fleuri"],
  ["SC-19", "SC", "Plaisance"],
  ["SC-20", "SC", "Pointe La Rue"],
  ["SC-21", "SC", "Port Glaud"],
  ["SC-22", "SC", "Saint Louis"],
  ["SC-23", "SC", "Takamaka"],
  ["SC-24", "SC", "Les Mamelles"],
  ["SC-25", "SC", "Roche Caiman"],
  ["SC-26", "SC", "Ile Perseverance I"],
  ["SC-27", "SC", "Ile Perseverance II"],
  ["SD-DC", "SD", "Central Darfur"],
  ["SD-DE", "SD", "East Darfur"],
  ["SD-DN", "SD", "North Darfur"],
  ["SD-DS", "SD", "South Darfur"],
  ["SD-DW", "SD", "West Darfur"],
  ["SD-GD", "SD", "Al Qadarif"],
  ["SD-GK", "SD", "West Kurdufan"],
  ["SD-GZ", "SD", "Al Jazirah"],
  ["SD-KA", "SD", "Kassala"],
  ["SD-KH", "SD", "Khartoum"],
  ["SD-KN", "SD", "North Kurdufan"],
  ["SD-KS", "SD", "South Kurdufan"],
  ["SD-NB", "SD", "Blue Nile"],
  ["SD-NO", "SD", "Northern"],
  ["SD-NR", "SD", "River Nile"],
  ["SD-NW", "SD", "White Nile"],
  ["SD-RS", "SD", "Red Sea"],
  ["SD-SI", "SD", "Sennar"],
  ["SE-AB", "SE", "Stockholm"],
  ["SE-AC", "SE", "V\xE4sterbotten"],
  ["SE-BD", "SE", "Norrbotten"],
  ["SE-C", "SE", "Uppsala"],
  ["SE-D", "SE", "S\xF6dermanland"],
  ["SE-E", "SE", "\xD6sterg\xF6tland"],
  ["SE-F", "SE", "J\xF6nk\xF6ping"],
  ["SE-G", "SE", "Kronoberg"],
  ["SE-H", "SE", "Kalmar"],
  ["SE-I", "SE", "Gotland"],
  ["SE-K", "SE", "Blekinge"],
  ["SE-M", "SE", "Sk\xE5ne"],
  ["SE-N", "SE", "Halland"],
  ["SE-O", "SE", "V\xE4stra G\xF6taland"],
  ["SE-S", "SE", "V\xE4rmland"],
  ["SE-T", "SE", "\xD6rebro"],
  ["SE-U", "SE", "V\xE4stmanland"],
  ["SE-W", "SE", "Dalarna"],
  ["SE-X", "SE", "G\xE4vleborg"],
  ["SE-Y", "SE", "V\xE4sternorrland"],
  ["SE-Z", "SE", "J\xE4mtland"],
  ["SG-01", "SG", "Central Singapore"],
  ["SG-02", "SG", "North East"],
  ["SG-03", "SG", "North West"],
  ["SG-04", "SG", "South East"],
  ["SG-05", "SG", "South West"],
  ["SH-AC", "SH", "Ascension Island"],
  ["SH-HL", "SH", "Saint Helena"],
  ["SH-TA", "SH", "Tristan da Cunha"],
  ["SI-001", "SI", "Ajdov\u0161\u010Dina"],
  ["SI-002", "SI", "Beltinci"],
  ["SI-003", "SI", "Bled"],
  ["SI-004", "SI", "Bohinj"],
  ["SI-005", "SI", "Borovnica"],
  ["SI-006", "SI", "Bovec"],
  ["SI-007", "SI", "Brda"],
  ["SI-008", "SI", "Brezovica"],
  ["SI-009", "SI", "Bre\u017Eice"],
  ["SI-010", "SI", "Ti\u0161ina"],
  ["SI-011", "SI", "Celje"],
  ["SI-012", "SI", "Cerklje na Gorenjskem"],
  ["SI-013", "SI", "Cerknica"],
  ["SI-014", "SI", "Cerkno"],
  ["SI-015", "SI", "\u010Cren\u0161ovci"],
  ["SI-016", "SI", "\u010Crna na Koro\u0161kem"],
  ["SI-017", "SI", "\u010Crnomelj"],
  ["SI-018", "SI", "Destrnik"],
  ["SI-019", "SI", "Diva\u010Da"],
  ["SI-020", "SI", "Dobrepolje"],
  ["SI-021", "SI", "Dobrova\u2013Polhov Gradec"],
  ["SI-022", "SI", "Dol pri Ljubljani"],
  ["SI-023", "SI", "Dom\u017Eale"],
  ["SI-024", "SI", "Dornava"],
  ["SI-025", "SI", "Dravograd"],
  ["SI-026", "SI", "Duplek"],
  ["SI-027", "SI", "Gorenja Vas\u2013Poljane"],
  ["SI-028", "SI", "Gori\u0161nica"],
  ["SI-029", "SI", "Gornja Radgona"],
  ["SI-030", "SI", "Gornji Grad"],
  ["SI-031", "SI", "Gornji Petrovci"],
  ["SI-032", "SI", "Grosuplje"],
  ["SI-033", "SI", "\u0160alovci"],
  ["SI-034", "SI", "Hrastnik"],
  ["SI-035", "SI", "Hrpelje\u2013Kozina"],
  ["SI-036", "SI", "Idrija"],
  ["SI-037", "SI", "Ig"],
  ["SI-038", "SI", "Ilirska Bistrica"],
  ["SI-039", "SI", "Ivan\u010Dna Gorica"],
  ["SI-040", "SI", "Izola"],
  ["SI-041", "SI", "Jesenice"],
  ["SI-042", "SI", "Jur\u0161inci"],
  ["SI-043", "SI", "Kamnik"],
  ["SI-044", "SI", "Kanal"],
  ["SI-045", "SI", "Kidri\u010Devo"],
  ["SI-046", "SI", "Kobarid"],
  ["SI-047", "SI", "Kobilje"],
  ["SI-048", "SI", "Ko\u010Devje"],
  ["SI-049", "SI", "Komen"],
  ["SI-050", "SI", "Koper"],
  ["SI-051", "SI", "Kozje"],
  ["SI-052", "SI", "Kranj"],
  ["SI-053", "SI", "Kranjska Gora"],
  ["SI-054", "SI", "Kr\u0161ko"],
  ["SI-055", "SI", "Kungota"],
  ["SI-056", "SI", "Kuzma"],
  ["SI-057", "SI", "La\u0161ko"],
  ["SI-058", "SI", "Lenart"],
  ["SI-059", "SI", "Lendava"],
  ["SI-060", "SI", "Litija"],
  ["SI-061", "SI", "Ljubljana"],
  ["SI-062", "SI", "Ljubno"],
  ["SI-063", "SI", "Ljutomer"],
  ["SI-064", "SI", "Logatec"],
  ["SI-065", "SI", "Lo\u0161ka Dolina"],
  ["SI-066", "SI", "Lo\u0161ki Potok"],
  ["SI-067", "SI", "Lu\u010De"],
  ["SI-068", "SI", "Lukovica"],
  ["SI-069", "SI", "Maj\u0161perk"],
  ["SI-070", "SI", "Maribor"],
  ["SI-071", "SI", "Medvode"],
  ["SI-072", "SI", "Menge\u0161"],
  ["SI-073", "SI", "Metlika"],
  ["SI-074", "SI", "Me\u017Eica"],
  ["SI-075", "SI", "Miren\u2013Kostanjevica"],
  ["SI-076", "SI", "Mislinja"],
  ["SI-077", "SI", "Morav\u010De"],
  ["SI-078", "SI", "Moravske Toplice"],
  ["SI-079", "SI", "Mozirje"],
  ["SI-080", "SI", "Murska Sobota"],
  ["SI-081", "SI", "Muta"],
  ["SI-082", "SI", "Naklo"],
  ["SI-083", "SI", "Nazarje"],
  ["SI-084", "SI", "Nova Gorica"],
  ["SI-085", "SI", "Novo Mesto"],
  ["SI-086", "SI", "Odranci"],
  ["SI-087", "SI", "Ormo\u017E"],
  ["SI-088", "SI", "Osilnica"],
  ["SI-089", "SI", "Pesnica"],
  ["SI-090", "SI", "Piran"],
  ["SI-091", "SI", "Pivka"],
  ["SI-092", "SI", "Pod\u010Detrtek"],
  ["SI-093", "SI", "Podvelka"],
  ["SI-094", "SI", "Postojna"],
  ["SI-095", "SI", "Preddvor"],
  ["SI-096", "SI", "Ptuj"],
  ["SI-097", "SI", "Puconci"],
  ["SI-098", "SI", "Ra\u010De\u2013Fram"],
  ["SI-099", "SI", "Rade\u010De"],
  ["SI-100", "SI", "Radenci"],
  ["SI-101", "SI", "Radlje ob Dravi"],
  ["SI-102", "SI", "Radovljica"],
  ["SI-103", "SI", "Ravne na Koro\u0161kem"],
  ["SI-104", "SI", "Ribnica"],
  ["SI-105", "SI", "Roga\u0161ovci"],
  ["SI-106", "SI", "Roga\u0161ka Slatina"],
  ["SI-107", "SI", "Rogatec"],
  ["SI-108", "SI", "Ru\u0161e"],
  ["SI-109", "SI", "Semi\u010D"],
  ["SI-110", "SI", "Sevnica"],
  ["SI-111", "SI", "Se\u017Eana"],
  ["SI-112", "SI", "Slovenj Gradec"],
  ["SI-113", "SI", "Slovenska Bistrica"],
  ["SI-114", "SI", "Slovenske Konjice"],
  ["SI-115", "SI", "Star\u0161e"],
  ["SI-116", "SI", "Sveti Jurij"],
  ["SI-117", "SI", "\u0160en\u010Dur"],
  ["SI-118", "SI", "\u0160entilj"],
  ["SI-119", "SI", "\u0160entjernej"],
  ["SI-120", "SI", "\u0160entjur"],
  ["SI-121", "SI", "\u0160kocjan"],
  ["SI-122", "SI", "\u0160kofja Loka"],
  ["SI-123", "SI", "\u0160kofljica"],
  ["SI-124", "SI", "\u0160marje pri Jel\u0161ah"],
  ["SI-125", "SI", "\u0160martno ob Paki"],
  ["SI-126", "SI", "\u0160o\u0161tanj"],
  ["SI-127", "SI", "\u0160tore"],
  ["SI-128", "SI", "Tolmin"],
  ["SI-129", "SI", "Trbovlje"],
  ["SI-130", "SI", "Trebnje"],
  ["SI-131", "SI", "Tr\u017Ei\u010D"],
  ["SI-132", "SI", "Turni\u0161\u010De"],
  ["SI-133", "SI", "Velenje"],
  ["SI-134", "SI", "Velike La\u0161\u010De"],
  ["SI-135", "SI", "Videm"],
  ["SI-136", "SI", "Vipava"],
  ["SI-137", "SI", "Vitanje"],
  ["SI-138", "SI", "Vodice"],
  ["SI-139", "SI", "Vojnik"],
  ["SI-140", "SI", "Vrhnika"],
  ["SI-141", "SI", "Vuzenica"],
  ["SI-142", "SI", "Zagorje ob Savi"],
  ["SI-143", "SI", "Zavr\u010D"],
  ["SI-144", "SI", "Zre\u010De"],
  ["SI-146", "SI", "\u017Delezniki"],
  ["SI-147", "SI", "\u017Diri"],
  ["SI-148", "SI", "Benedikt"],
  ["SI-149", "SI", "Bistrica ob Sotli"],
  ["SI-150", "SI", "Bloke"],
  ["SI-151", "SI", "Braslov\u010De"],
  ["SI-152", "SI", "Cankova"],
  ["SI-153", "SI", "Cerkvenjak"],
  ["SI-154", "SI", "Dobje"],
  ["SI-155", "SI", "Dobrna"],
  ["SI-156", "SI", "Dobrovnik"],
  ["SI-157", "SI", "Dolenjske Toplice"],
  ["SI-158", "SI", "Grad"],
  ["SI-159", "SI", "Hajdina"],
  ["SI-160", "SI", "Ho\u010De\u2013Slivnica"],
  ["SI-161", "SI", "Hodo\u0161"],
  ["SI-162", "SI", "Horjul"],
  ["SI-163", "SI", "Jezersko"],
  ["SI-164", "SI", "Komenda"],
  ["SI-165", "SI", "Kostel"],
  ["SI-166", "SI", "Kri\u017Eevci"],
  ["SI-167", "SI", "Lovrenc na Pohorju"],
  ["SI-168", "SI", "Markovci"],
  ["SI-169", "SI", "Miklav\u017E na Dravskem Polju"],
  ["SI-170", "SI", "Mirna Pe\u010D"],
  ["SI-171", "SI", "Oplotnica"],
  ["SI-172", "SI", "Podlehnik"],
  ["SI-173", "SI", "Polzela"],
  ["SI-174", "SI", "Prebold"],
  ["SI-175", "SI", "Prevalje"],
  ["SI-176", "SI", "Razkri\u017Eje"],
  ["SI-177", "SI", "Ribnica na Pohorju"],
  ["SI-178", "SI", "Selnica ob Dravi"],
  ["SI-179", "SI", "Sodra\u017Eica"],
  ["SI-180", "SI", "Sol\u010Dava"],
  ["SI-181", "SI", "Sveta Ana"],
  ["SI-182", "SI", "Sveti Andra\u017E v Slovenskih Goricah"],
  ["SI-183", "SI", "\u0160empeter\u2013Vrtojba"],
  ["SI-184", "SI", "Tabor"],
  ["SI-185", "SI", "Trnovska Vas"],
  ["SI-186", "SI", "Trzin"],
  ["SI-187", "SI", "Velika Polana"],
  ["SI-188", "SI", "Ver\u017Eej"],
  ["SI-189", "SI", "Vransko"],
  ["SI-190", "SI", "\u017Dalec"],
  ["SI-191", "SI", "\u017Detale"],
  ["SI-192", "SI", "\u017Dirovnica"],
  ["SI-193", "SI", "\u017Du\u017Eemberk"],
  ["SI-194", "SI", "\u0160martno pri Litiji"],
  ["SI-195", "SI", "Apa\u010De"],
  ["SI-196", "SI", "Cirkulane"],
  ["SI-197", "SI", "Kostanjevica na Krki"],
  ["SI-198", "SI", "Makole"],
  ["SI-199", "SI", "Mokronog\u2013Trebelno"],
  ["SI-200", "SI", "Polj\u010Dane"],
  ["SI-201", "SI", "Ren\u010De\u2013Vogrsko"],
  ["SI-202", "SI", "Sredi\u0161\u010De ob Dravi"],
  ["SI-203", "SI", "Stra\u017Ea"],
  ["SI-204", "SI", "Sveta Trojica v Slovenskih Goricah"],
  ["SI-205", "SI", "Sveti Toma\u017E"],
  ["SI-206", "SI", "\u0160marje\u0161ke Toplice"],
  ["SI-207", "SI", "Gorje"],
  ["SI-208", "SI", "Log\u2013Dragomer"],
  ["SI-209", "SI", "Re\u010Dica ob Savinji"],
  ["SI-210", "SI", "Sveti Jurij v Slovenskih Goricah"],
  ["SI-211", "SI", "\u0160entrupert"],
  ["SI-212", "SI", "Mirna"],
  ["SI-213", "SI", "Ankaran"],
  ["SK-BC", "SK", "Bansk\xE1 Bystrica"],
  ["SK-BL", "SK", "Bratislava"],
  ["SK-KI", "SK", "Ko\u0161ice"],
  ["SK-NI", "SK", "Nitra"],
  ["SK-PV", "SK", "Pre\u0161ov"],
  ["SK-TA", "SK", "Trnava"],
  ["SK-TC", "SK", "Tren\u010D\xEDn"],
  ["SK-ZI", "SK", "\u017Dilina"],
  ["SL-E", "SL", "Eastern"],
  ["SL-N", "SL", "Northern"],
  ["SL-NW", "SL", "North Western"],
  ["SL-S", "SL", "Southern"],
  ["SL-W", "SL", "Western Area"],
  ["SM-01", "SM", "Acquaviva"],
  ["SM-02", "SM", "Chiesanuova"],
  ["SM-03", "SM", "Domagnano"],
  ["SM-04", "SM", "Faetano"],
  ["SM-05", "SM", "Fiorentino"],
  ["SM-06", "SM", "Borgo Maggiore"],
  ["SM-07", "SM", "San Marino"],
  ["SM-08", "SM", "Montegiardino"],
  ["SM-09", "SM", "Serravalle"],
  ["SN-DB", "SN", "Diourbel"],
  ["SN-DK", "SN", "Dakar"],
  ["SN-FK", "SN", "Fatick"],
  ["SN-KA", "SN", "Kaffrine"],
  ["SN-KD", "SN", "Kolda"],
  ["SN-KE", "SN", "K\xE9dougou"],
  ["SN-KL", "SN", "Kaolack"],
  ["SN-LG", "SN", "Louga"],
  ["SN-MT", "SN", "Matam"],
  ["SN-SE", "SN", "S\xE9dhiou"],
  ["SN-SL", "SN", "Saint-Louis"],
  ["SN-TC", "SN", "Tambacounda"],
  ["SN-TH", "SN", "Thi\xE8s"],
  ["SN-ZG", "SN", "Ziguinchor"],
  ["SO-AW", "SO", "Awdal"],
  ["SO-BK", "SO", "Bakool"],
  ["SO-BN", "SO", "Banaadir"],
  ["SO-BR", "SO", "Bari"],
  ["SO-BY", "SO", "Bay, Somalia"],
  ["SO-GA", "SO", "Galguduud"],
  ["SO-GE", "SO", "Gedo"],
  ["SO-HI", "SO", "Hiran"],
  ["SO-JD", "SO", "Middle Juba"],
  ["SO-JH", "SO", "Lower Juba"],
  ["SO-MU", "SO", "Mudug"],
  ["SO-NU", "SO", "Nugal"],
  ["SO-SA", "SO", "Sanaag"],
  ["SO-SD", "SO", "Middle Shebelle"],
  ["SO-SH", "SO", "Lower Shebelle"],
  ["SO-SO", "SO", "Sool"],
  ["SO-TO", "SO", "Togdheer"],
  ["SO-WO", "SO", "Woqooyi Galbeed"],
  ["SR-BR", "SR", "Brokopondo"],
  ["SR-CM", "SR", "Commewijne"],
  ["SR-CR", "SR", "Coronie"],
  ["SR-MA", "SR", "Marowijne"],
  ["SR-NI", "SR", "Nickerie"],
  ["SR-PM", "SR", "Paramaribo"],
  ["SR-PR", "SR", "Para"],
  ["SR-SA", "SR", "Saramacca"],
  ["SR-SI", "SR", "Sipaliwini"],
  ["SR-WA", "SR", "Wanica"],
  ["SS-BN", "SS", "Northern Bahr el Ghazal"],
  ["SS-BW", "SS", "Western Bahr el Ghazal"],
  ["SS-EC", "SS", "Central Equatoria"],
  ["SS-EE", "SS", "Eastern Equatoria"],
  ["SS-EW", "SS", "Western Equatoria"],
  ["SS-JG", "SS", "Jonglei"],
  ["SS-LK", "SS", "Lakes"],
  ["SS-NU", "SS", "Upper Nile"],
  ["SS-UY", "SS", "Unity"],
  ["SS-WR", "SS", "Warrap"],
  ["ST-01", "ST", "\xC1gua Grande"],
  ["ST-02", "ST", "Cantagalo"],
  ["ST-03", "ST", "Cau\xE9"],
  ["ST-04", "ST", "Lemb\xE1"],
  ["ST-05", "ST", "Lobata"],
  ["ST-06", "ST", "M\xE9-Z\xF3chi"],
  ["ST-P", "ST", "Pr\xEDncipe"],
  ["SV-AH", "SV", "Ahuachap\xE1n"],
  ["SV-CA", "SV", "Caba\xF1as"],
  ["SV-CH", "SV", "Chalatenango"],
  ["SV-CU", "SV", "Cuscatl\xE1n"],
  ["SV-LI", "SV", "La Libertad"],
  ["SV-MO", "SV", "Moraz\xE1n"],
  ["SV-PA", "SV", "La Paz"],
  ["SV-SA", "SV", "Santa Ana"],
  ["SV-SM", "SV", "San Miguel"],
  ["SV-SO", "SV", "Sonsonate"],
  ["SV-SS", "SV", "San Salvador"],
  ["SV-SV", "SV", "San Vicente"],
  ["SV-UN", "SV", "La Uni\xF3n"],
  ["SV-US", "SV", "Usulut\xE1n"],
  ["SY-DI", "SY", "Damascus"],
  ["SY-DR", "SY", "Daraa"],
  ["SY-DY", "SY", "Deir ez-Zor"],
  ["SY-HA", "SY", "Al-Hasakah"],
  ["SY-HI", "SY", "Homs"],
  ["SY-HL", "SY", "Aleppo"],
  ["SY-HM", "SY", "Hama"],
  ["SY-ID", "SY", "Idlib"],
  ["SY-LA", "SY", "Latakia"],
  ["SY-QU", "SY", "Quneitra"],
  ["SY-RA", "SY", "Ar-Raqqah"],
  ["SY-RD", "SY", "Rif Dimashq"],
  ["SY-SU", "SY", "As-Suwayda"],
  ["SY-TA", "SY", "Tartus"],
  ["SZ-HH", "SZ", "Hhohho"],
  ["SZ-LU", "SZ", "Lubombo"],
  ["SZ-MA", "SZ", "Manzini"],
  ["SZ-SH", "SZ", "Shiselweni"],
  ["TD-BA", "TD", "Batha"],
  ["TD-BG", "TD", "Bahr el Gazel"],
  ["TD-BO", "TD", "Borkou"],
  ["TD-CB", "TD", "Chari-Baguirmi"],
  ["TD-EE", "TD", "Ennedi-Est"],
  ["TD-EO", "TD", "Ennedi-Ouest"],
  ["TD-GR", "TD", "Gu\xE9ra"],
  ["TD-HL", "TD", "Hadjer-Lamis"],
  ["TD-KA", "TD", "Kanem"],
  ["TD-LC", "TD", "Lac"],
  ["TD-LO", "TD", "Logone Occidental"],
  ["TD-LR", "TD", "Logone Oriental"],
  ["TD-MA", "TD", "Mandoul"],
  ["TD-MC", "TD", "Moyen-Chari"],
  ["TD-ME", "TD", "Mayo-Kebbi Est"],
  ["TD-MO", "TD", "Mayo-Kebbi Ouest"],
  ["TD-ND", "TD", "N\u2019Djamena"],
  ["TD-OD", "TD", "Ouadda\xEF"],
  ["TD-SA", "TD", "Salamat"],
  ["TD-SI", "TD", "Sila"],
  ["TD-TA", "TD", "Tandjil\xE9"],
  ["TD-TI", "TD", "Tibesti"],
  ["TD-WF", "TD", "Wadi Fira"],
  ["TG-C", "TG", "Centrale"],
  ["TG-K", "TG", "Kara"],
  ["TG-M", "TG", "Maritime"],
  ["TG-P", "TG", "Plateaux"],
  ["TG-S", "TG", "Savanes"],
  ["TH-10", "TH", "Bangkok"],
  ["TH-11", "TH", "Samut Prakan"],
  ["TH-12", "TH", "Nonthaburi"],
  ["TH-13", "TH", "Pathum Thani"],
  ["TH-14", "TH", "Phra Nakhon Si Ayutthaya"],
  ["TH-15", "TH", "Ang Thong"],
  ["TH-16", "TH", "Lopburi"],
  ["TH-17", "TH", "Sing Buri"],
  ["TH-18", "TH", "Chai Nat"],
  ["TH-19", "TH", "Saraburi"],
  ["TH-20", "TH", "Chon Buri"],
  ["TH-21", "TH", "Rayong"],
  ["TH-22", "TH", "Chanthaburi"],
  ["TH-23", "TH", "Trat"],
  ["TH-24", "TH", "Chachoengsao"],
  ["TH-25", "TH", "Prachin Buri"],
  ["TH-26", "TH", "Nakhon Nayok"],
  ["TH-27", "TH", "Sa Kaeo"],
  ["TH-30", "TH", "Nakhon Ratchasima"],
  ["TH-31", "TH", "Buri Ram"],
  ["TH-32", "TH", "Surin"],
  ["TH-33", "TH", "Si Sa Ket"],
  ["TH-34", "TH", "Ubon Ratchathani"],
  ["TH-35", "TH", "Yasothon"],
  ["TH-36", "TH", "Chaiyaphum"],
  ["TH-37", "TH", "Amnat Charoen"],
  ["TH-38", "TH", "Bueng Kan"],
  ["TH-39", "TH", "Nong Bua Lam Phu"],
  ["TH-40", "TH", "Khon Kaen"],
  ["TH-41", "TH", "Udon Thani"],
  ["TH-42", "TH", "Loei"],
  ["TH-43", "TH", "Nong Khai"],
  ["TH-44", "TH", "Maha Sarakham"],
  ["TH-45", "TH", "Roi Et"],
  ["TH-46", "TH", "Kalasin"],
  ["TH-47", "TH", "Sakon Nakhon"],
  ["TH-48", "TH", "Nakhon Phanom"],
  ["TH-49", "TH", "Mukdahan"],
  ["TH-50", "TH", "Chiang Mai"],
  ["TH-51", "TH", "Lamphun"],
  ["TH-52", "TH", "Lampang"],
  ["TH-53", "TH", "Uttaradit"],
  ["TH-54", "TH", "Phrae"],
  ["TH-55", "TH", "Nan"],
  ["TH-56", "TH", "Phayao"],
  ["TH-57", "TH", "Chiang Rai"],
  ["TH-58", "TH", "Mae Hong Son"],
  ["TH-60", "TH", "Nakhon Sawan"],
  ["TH-61", "TH", "Uthai Thani"],
  ["TH-62", "TH", "Kamphaeng Phet"],
  ["TH-63", "TH", "Tak"],
  ["TH-64", "TH", "Sukhothai"],
  ["TH-65", "TH", "Phitsanulok"],
  ["TH-66", "TH", "Phichit"],
  ["TH-67", "TH", "Phetchabun"],
  ["TH-70", "TH", "Ratchaburi"],
  ["TH-71", "TH", "Kanchanaburi"],
  ["TH-72", "TH", "Suphanburi"],
  ["TH-73", "TH", "Nakhon Pathom"],
  ["TH-74", "TH", "Samut Sakhon"],
  ["TH-75", "TH", "Samut Songkhram"],
  ["TH-76", "TH", "Phetchaburi"],
  ["TH-77", "TH", "Prachuap Khiri Khan"],
  ["TH-80", "TH", "Nakhon Si Thammarat"],
  ["TH-81", "TH", "Krabi"],
  ["TH-82", "TH", "Phang Nga"],
  ["TH-83", "TH", "Phuket"],
  ["TH-84", "TH", "Surat Thani"],
  ["TH-85", "TH", "Ranong"],
  ["TH-86", "TH", "Chumphon"],
  ["TH-90", "TH", "Songkhla"],
  ["TH-91", "TH", "Satun"],
  ["TH-92", "TH", "Trang"],
  ["TH-93", "TH", "Phatthalung"],
  ["TH-94", "TH", "Pattani"],
  ["TH-95", "TH", "Yala"],
  ["TH-96", "TH", "Narathiwat"],
  ["TH-S", "TH", "Pattaya"],
  ["TJ-DU", "TJ", "Dushanbe"],
  ["TJ-GB", "TJ", "Gorno-Badakhshan"],
  ["TJ-KT", "TJ", "Khatlon"],
  ["TJ-RA", "TJ", "Nohiyahoi Tobei Jumhur\xED"],
  ["TJ-SU", "TJ", "Sughd"],
  ["TL-AL", "TL", "Aileu"],
  ["TL-AN", "TL", "Ainaro"],
  ["TL-BA", "TL", "Baucau"],
  ["TL-BO", "TL", "Bobonaro"],
  ["TL-CO", "TL", "Cova Lima"],
  ["TL-DI", "TL", "Dili"],
  ["TL-ER", "TL", "Ermera"],
  ["TL-LA", "TL", "Laut\xE9m"],
  ["TL-LI", "TL", "Liqui\xE7\xE1"],
  ["TL-MF", "TL", "Manufahi"],
  ["TL-MT", "TL", "Manatuto"],
  ["TL-OE", "TL", "Oecusse"],
  ["TL-VI", "TL", "Viqueque"],
  ["TM-A", "TM", "Ahal"],
  ["TM-B", "TM", "Balkan"],
  ["TM-D", "TM", "Da\u015Foguz"],
  ["TM-L", "TM", "Lebap"],
  ["TM-M", "TM", "Mary"],
  ["TM-S", "TM", "A\u015Fgabat"],
  ["TN-11", "TN", "Tunis"],
  ["TN-12", "TN", "Ariana"],
  ["TN-13", "TN", "Ben Arous"],
  ["TN-14", "TN", "Manouba"],
  ["TN-21", "TN", "Nabeul"],
  ["TN-22", "TN", "Zaghouan"],
  ["TN-23", "TN", "Bizerte"],
  ["TN-31", "TN", "B\xE9ja"],
  ["TN-32", "TN", "Jendouba"],
  ["TN-33", "TN", "Kef"],
  ["TN-34", "TN", "Siliana"],
  ["TN-41", "TN", "Kairouan"],
  ["TN-42", "TN", "Kasserine"],
  ["TN-43", "TN", "Sidi Bouzid"],
  ["TN-51", "TN", "Sousse"],
  ["TN-52", "TN", "Monastir"],
  ["TN-53", "TN", "Mahdia"],
  ["TN-61", "TN", "Sfax"],
  ["TN-71", "TN", "Gafsa"],
  ["TN-72", "TN", "Tozeur"],
  ["TN-73", "TN", "Kebili"],
  ["TN-81", "TN", "Gab\xE8s"],
  ["TN-82", "TN", "Medenine"],
  ["TN-83", "TN", "Tataouine"],
  ["TO-01", "TO", "\u02BBEua"],
  ["TO-02", "TO", "Ha\u02BBapai"],
  ["TO-03", "TO", "Niuas"],
  ["TO-04", "TO", "Tongatapu"],
  ["TO-05", "TO", "Vava\u02BBu"],
  ["TR-01", "TR", "Adana"],
  ["TR-02", "TR", "Ad\u0131yaman"],
  ["TR-03", "TR", "Afyonkarahisar"],
  ["TR-04", "TR", "A\u011Fr\u0131"],
  ["TR-05", "TR", "Amasya"],
  ["TR-06", "TR", "Ankara"],
  ["TR-07", "TR", "Antalya"],
  ["TR-08", "TR", "Artvin"],
  ["TR-09", "TR", "Ayd\u0131n"],
  ["TR-10", "TR", "Bal\u0131kesir"],
  ["TR-11", "TR", "Bilecik"],
  ["TR-12", "TR", "Bing\xF6l"],
  ["TR-13", "TR", "Bitlis"],
  ["TR-14", "TR", "Bolu"],
  ["TR-15", "TR", "Burdur"],
  ["TR-16", "TR", "Bursa"],
  ["TR-17", "TR", "\xC7anakkale"],
  ["TR-18", "TR", "\xC7ank\u0131r\u0131"],
  ["TR-19", "TR", "\xC7orum"],
  ["TR-20", "TR", "Denizli"],
  ["TR-21", "TR", "Diyarbak\u0131r"],
  ["TR-22", "TR", "Edirne"],
  ["TR-23", "TR", "Elaz\u0131\u011F"],
  ["TR-24", "TR", "Erzincan"],
  ["TR-25", "TR", "Erzurum"],
  ["TR-26", "TR", "Eski\u015Fehir"],
  ["TR-27", "TR", "Gaziantep"],
  ["TR-28", "TR", "Giresun"],
  ["TR-29", "TR", "G\xFCm\xFC\u015Fhane"],
  ["TR-30", "TR", "Hakk\xE2ri"],
  ["TR-31", "TR", "Hatay"],
  ["TR-32", "TR", "Isparta"],
  ["TR-33", "TR", "Mersin"],
  ["TR-34", "TR", "Istanbul"],
  ["TR-35", "TR", "Izmir"],
  ["TR-36", "TR", "Kars"],
  ["TR-37", "TR", "Kastamonu"],
  ["TR-38", "TR", "Kayseri"],
  ["TR-39", "TR", "K\u0131rklareli"],
  ["TR-40", "TR", "K\u0131r\u015Fehir"],
  ["TR-41", "TR", "Kocaeli"],
  ["TR-42", "TR", "Konya"],
  ["TR-43", "TR", "K\xFCtahya"],
  ["TR-44", "TR", "Malatya"],
  ["TR-45", "TR", "Manisa"],
  ["TR-46", "TR", "Kahramanmara\u015F"],
  ["TR-47", "TR", "Mardin"],
  ["TR-48", "TR", "Mu\u011Fla"],
  ["TR-49", "TR", "Mu\u015F"],
  ["TR-50", "TR", "Nev\u015Fehir"],
  ["TR-51", "TR", "Ni\u011Fde"],
  ["TR-52", "TR", "Ordu"],
  ["TR-53", "TR", "Rize"],
  ["TR-54", "TR", "Sakarya"],
  ["TR-55", "TR", "Samsun"],
  ["TR-56", "TR", "Siirt"],
  ["TR-57", "TR", "Sinop"],
  ["TR-58", "TR", "Sivas"],
  ["TR-59", "TR", "Tekirda\u011F"],
  ["TR-60", "TR", "Tokat"],
  ["TR-61", "TR", "Trabzon"],
  ["TR-62", "TR", "Tunceli"],
  ["TR-63", "TR", "\u015Eanl\u0131urfa"],
  ["TR-64", "TR", "U\u015Fak"],
  ["TR-65", "TR", "Van"],
  ["TR-66", "TR", "Yozgat"],
  ["TR-67", "TR", "Zonguldak"],
  ["TR-68", "TR", "Aksaray"],
  ["TR-69", "TR", "Bayburt"],
  ["TR-70", "TR", "Karaman"],
  ["TR-71", "TR", "K\u0131r\u0131kkale"],
  ["TR-72", "TR", "Batman"],
  ["TR-73", "TR", "\u015E\u0131rnak"],
  ["TR-74", "TR", "Bart\u0131n"],
  ["TR-75", "TR", "Ardahan"],
  ["TR-76", "TR", "I\u011Fd\u0131r"],
  ["TR-77", "TR", "Yalova"],
  ["TR-78", "TR", "Karab\xFCk"],
  ["TR-79", "TR", "Kilis"],
  ["TR-80", "TR", "Osmaniye"],
  ["TR-81", "TR", "D\xFCzce"],
  ["TT-ARI", "TT", "Arima"],
  ["TT-CHA", "TT", "Chaguanas"],
  ["TT-CTT", "TT", "Couva-Tabaquite-Talparo"],
  ["TT-DMN", "TT", "Diego Martin"],
  ["TT-MRC", "TT", "Mayaro-Rio Claro"],
  ["TT-PED", "TT", "Penal-Debe"],
  ["TT-POS", "TT", "Port of Spain"],
  ["TT-PRT", "TT", "Princes Town"],
  ["TT-PTF", "TT", "Point Fortin"],
  ["TT-SFO", "TT", "San Fernando"],
  ["TT-SGE", "TT", "Sangre Grande"],
  ["TT-SIP", "TT", "Siparia"],
  ["TT-SJL", "TT", "San Juan-Laventille"],
  ["TT-TOB", "TT", "Tobago"],
  ["TT-TUP", "TT", "Tunapuna-Piarco"],
  ["TV-FUN", "TV", "Funafuti"],
  ["TV-NIT", "TV", "Niutao"],
  ["TV-NKF", "TV", "Nukufetau"],
  ["TV-NKL", "TV", "Nukulaelae"],
  ["TV-NMA", "TV", "Nanumea"],
  ["TV-NMG", "TV", "Nanumanga"],
  ["TV-NUI", "TV", "Nui"],
  ["TV-VAI", "TV", "Vaitupu"],
  ["TW-CHA", "TW", "Changhua"],
  ["TW-CYI", "TW", "Chiayi County"],
  ["TW-CYQ", "TW", "Chiayi"],
  ["TW-HSQ", "TW", "Hsinchu County"],
  ["TW-HSZ", "TW", "Hsinchu"],
  ["TW-HUA", "TW", "Hualien"],
  ["TW-ILA", "TW", "Yilan"],
  ["TW-KEE", "TW", "Keelung"],
  ["TW-KHH", "TW", "Kaohsiung"],
  ["TW-KIN", "TW", "Kinmen"],
  ["TW-LIE", "TW", "Lienchiang"],
  ["TW-MIA", "TW", "Miaoli"],
  ["TW-NAN", "TW", "Nantou"],
  ["TW-NWT", "TW", "New Taipei"],
  ["TW-PEN", "TW", "Penghu"],
  ["TW-PIF", "TW", "Pingtung"],
  ["TW-TAO", "TW", "Taoyuan"],
  ["TW-TNN", "TW", "Tainan"],
  ["TW-TPE", "TW", "Taipei"],
  ["TW-TTT", "TW", "Taitung"],
  ["TW-TXG", "TW", "Taichung"],
  ["TW-YUN", "TW", "Yunlin"],
  ["TZ-01", "TZ", "Arusha"],
  ["TZ-02", "TZ", "Dar es Salaam"],
  ["TZ-03", "TZ", "Dodoma"],
  ["TZ-04", "TZ", "Iringa"],
  ["TZ-05", "TZ", "Kagera"],
  ["TZ-06", "TZ", "North Pemba"],
  ["TZ-07", "TZ", "Zanzibar North"],
  ["TZ-08", "TZ", "Kigoma"],
  ["TZ-09", "TZ", "Kilimanjaro"],
  ["TZ-10", "TZ", "South Pemba"],
  ["TZ-11", "TZ", "Zanzibar Central/South"],
  ["TZ-12", "TZ", "Lindi"],
  ["TZ-13", "TZ", "Mara"],
  ["TZ-14", "TZ", "Mbeya"],
  ["TZ-15", "TZ", "Zanzibar Urban/West"],
  ["TZ-16", "TZ", "Morogoro"],
  ["TZ-17", "TZ", "Mtwara"],
  ["TZ-18", "TZ", "Mwanza"],
  ["TZ-19", "TZ", "Pwani"],
  ["TZ-20", "TZ", "Rukwa"],
  ["TZ-21", "TZ", "Ruvuma"],
  ["TZ-22", "TZ", "Shinyanga"],
  ["TZ-23", "TZ", "Singida"],
  ["TZ-24", "TZ", "Tabora"],
  ["TZ-25", "TZ", "Tanga"],
  ["TZ-26", "TZ", "Manyara"],
  ["TZ-27", "TZ", "Geita"],
  ["TZ-28", "TZ", "Katavi"],
  ["TZ-29", "TZ", "Njombe"],
  ["TZ-30", "TZ", "Simiyu"],
  ["TZ-31", "TZ", "Songwe"],
  ["UA-05", "UA", "Vinnychchyna"],
  ["UA-07", "UA", "Volyn"],
  ["UA-09", "UA", "Luhanshchyna"],
  ["UA-12", "UA", "Dnipropetrovshchyna"],
  ["UA-14", "UA", "Donechchyna"],
  ["UA-18", "UA", "Zhytomyrshchyna"],
  ["UA-21", "UA", "Zakarpattia"],
  ["UA-23", "UA", "Zaporizhzhya"],
  ["UA-26", "UA", "Prykarpattia"],
  ["UA-30", "UA", "Kyiv"],
  ["UA-32", "UA", "Kyivshchyna"],
  ["UA-35", "UA", "Kirovohradschyna"],
  ["UA-40", "UA", "Sevastopol"],
  ["UA-43", "UA", "Crimea"],
  ["UA-46", "UA", "Lvivshchyna"],
  ["UA-48", "UA", "Mykolayivschyna"],
  ["UA-51", "UA", "Odeshchyna"],
  ["UA-53", "UA", "Poltavshchyna"],
  ["UA-56", "UA", "Rivnenshchyna"],
  ["UA-59", "UA", "Sumshchyna"],
  ["UA-61", "UA", "Ternopilshchyna"],
  ["UA-63", "UA", "Kharkivshchyna"],
  ["UA-65", "UA", "Khersonshchyna"],
  ["UA-68", "UA", "Khmelnychchyna"],
  ["UA-71", "UA", "Cherkashchyna"],
  ["UA-74", "UA", "Chernihivshchyna"],
  ["UA-77", "UA", "Chernivtsi Oblast"],
  ["UG-101", "UG", "Kalangala"],
  ["UG-102", "UG", "Kampala"],
  ["UG-103", "UG", "Kiboga"],
  ["UG-104", "UG", "Luwero"],
  ["UG-105", "UG", "Masaka"],
  ["UG-106", "UG", "Mpigi"],
  ["UG-107", "UG", "Mubende"],
  ["UG-108", "UG", "Mukono"],
  ["UG-109", "UG", "Nakasongola"],
  ["UG-110", "UG", "Rakai"],
  ["UG-111", "UG", "Sembabule"],
  ["UG-112", "UG", "Kayunga"],
  ["UG-113", "UG", "Wakiso"],
  ["UG-114", "UG", "Lyantonde"],
  ["UG-115", "UG", "Mityana"],
  ["UG-116", "UG", "Nakaseke"],
  ["UG-117", "UG", "Buikwe"],
  ["UG-118", "UG", "Bukomansibi"],
  ["UG-119", "UG", "Butambala"],
  ["UG-120", "UG", "Buvuma"],
  ["UG-121", "UG", "Gomba"],
  ["UG-122", "UG", "Kalungu"],
  ["UG-123", "UG", "Kyankwanzi"],
  ["UG-124", "UG", "Lwengo"],
  ["UG-125", "UG", "Kyotera"],
  ["UG-126", "UG", "Kasanda"],
  ["UG-201", "UG", "Bugiri"],
  ["UG-202", "UG", "Busia"],
  ["UG-203", "UG", "Iganga"],
  ["UG-204", "UG", "Jinja"],
  ["UG-205", "UG", "Kamuli"],
  ["UG-206", "UG", "Kapchorwa"],
  ["UG-207", "UG", "Katakwi"],
  ["UG-208", "UG", "Kumi"],
  ["UG-209", "UG", "Mbale"],
  ["UG-210", "UG", "Pallisa"],
  ["UG-211", "UG", "Soroti"],
  ["UG-212", "UG", "Tororo"],
  ["UG-213", "UG", "Kaberamaido"],
  ["UG-214", "UG", "Mayuge"],
  ["UG-215", "UG", "Sironko"],
  ["UG-216", "UG", "Amuria"],
  ["UG-217", "UG", "Budaka"],
  ["UG-218", "UG", "Bududa"],
  ["UG-219", "UG", "Bukedea"],
  ["UG-220", "UG", "Bukwa"],
  ["UG-221", "UG", "Butaleja"],
  ["UG-222", "UG", "Kaliro"],
  ["UG-223", "UG", "Manafwa"],
  ["UG-224", "UG", "Namutumba"],
  ["UG-225", "UG", "Bulambuli"],
  ["UG-226", "UG", "Buyende"],
  ["UG-227", "UG", "Kibuku"],
  ["UG-228", "UG", "Kween"],
  ["UG-229", "UG", "Luuka"],
  ["UG-230", "UG", "Namayingo"],
  ["UG-231", "UG", "Ngora"],
  ["UG-232", "UG", "Serere"],
  ["UG-233", "UG", "Butebo"],
  ["UG-234", "UG", "Namisindwa"],
  ["UG-235", "UG", "Bugweri"],
  ["UG-236", "UG", "Kapelebyong"],
  ["UG-237", "UG", "Kalaki"],
  ["UG-301", "UG", "Adjumani"],
  ["UG-302", "UG", "Apac"],
  ["UG-303", "UG", "Arua"],
  ["UG-304", "UG", "Gulu"],
  ["UG-305", "UG", "Kitgum"],
  ["UG-306", "UG", "Kotido"],
  ["UG-307", "UG", "Lira"],
  ["UG-308", "UG", "Moroto"],
  ["UG-309", "UG", "Moyo"],
  ["UG-310", "UG", "Nebbi"],
  ["UG-311", "UG", "Nakapiripirit"],
  ["UG-312", "UG", "Pader"],
  ["UG-313", "UG", "Yumbe"],
  ["UG-314", "UG", "Abim"],
  ["UG-315", "UG", "Amolatar"],
  ["UG-316", "UG", "Amuru"],
  ["UG-317", "UG", "Dokolo"],
  ["UG-318", "UG", "Kaabong"],
  ["UG-319", "UG", "Koboko"],
  ["UG-320", "UG", "Maracha"],
  ["UG-321", "UG", "Oyam"],
  ["UG-322", "UG", "Agago"],
  ["UG-323", "UG", "Alebtong"],
  ["UG-324", "UG", "Amudat"],
  ["UG-325", "UG", "Kole"],
  ["UG-326", "UG", "Lamwo"],
  ["UG-327", "UG", "Napak"],
  ["UG-328", "UG", "Nwoya"],
  ["UG-329", "UG", "Otuke"],
  ["UG-330", "UG", "Zombo\xB2"],
  ["UG-331", "UG", "Zombo"],
  ["UG-332", "UG", "Pakwach"],
  ["UG-333", "UG", "Kwania"],
  ["UG-334", "UG", "Nabilatuk"],
  ["UG-335", "UG", "Karenga"],
  ["UG-336", "UG", "Madi-Okollo"],
  ["UG-337", "UG", "Obongi"],
  ["UG-401", "UG", "Bundibugyo"],
  ["UG-402", "UG", "Bushenyi"],
  ["UG-403", "UG", "Hoima"],
  ["UG-404", "UG", "Kabale"],
  ["UG-405", "UG", "Kabarole"],
  ["UG-406", "UG", "Kasese"],
  ["UG-407", "UG", "Kibaale"],
  ["UG-408", "UG", "Kisoro"],
  ["UG-409", "UG", "Masindi"],
  ["UG-410", "UG", "Mbarara"],
  ["UG-411", "UG", "Ntungamo"],
  ["UG-412", "UG", "Rukungiri"],
  ["UG-413", "UG", "Kamwenge"],
  ["UG-414", "UG", "Kanungu"],
  ["UG-415", "UG", "Kyenjojo"],
  ["UG-416", "UG", "Buliisa"],
  ["UG-417", "UG", "Ibanda"],
  ["UG-418", "UG", "Isingiro"],
  ["UG-419", "UG", "Kiruhura"],
  ["UG-420", "UG", "Buhweju"],
  ["UG-421", "UG", "Kiryandongo"],
  ["UG-422", "UG", "Kyegegwa"],
  ["UG-423", "UG", "Mitooma"],
  ["UG-424", "UG", "Ntoroko"],
  ["UG-425", "UG", "Rubirizi"],
  ["UG-426", "UG", "Sheema"],
  ["UG-427", "UG", "Kagadi"],
  ["UG-428", "UG", "Kakumiro"],
  ["UG-429", "UG", "Rubanda"],
  ["UG-430", "UG", "Bunyangabu"],
  ["UG-431", "UG", "Rukiga"],
  ["UG-432", "UG", "Kikuube"],
  ["UG-433", "UG", "Kazo"],
  ["UG-434", "UG", "Kitagwenda"],
  ["UG-435", "UG", "Rwampara"],
  ["UG-C", "UG", "Central"],
  ["UG-E", "UG", "Eastern"],
  ["UG-N", "UG", "Northern"],
  ["UG-W", "UG", "Western"],
  ["UM-67", "UM", "Johnston Atoll"],
  ["UM-71", "UM", "Midway Atoll"],
  ["UM-76", "UM", "Navassa Island"],
  ["UM-79", "UM", "Wake Island"],
  ["UM-81", "UM", "Baker Island"],
  ["UM-84", "UM", "Howland Island"],
  ["UM-86", "UM", "Jarvis Island"],
  ["UM-89", "UM", "Kingman Reef"],
  ["UM-95", "UM", "Palmyra Atoll"],
  ["US-AK", "US", "Alaska"],
  ["US-AL", "US", "Alabama"],
  ["US-AR", "US", "Arkansas"],
  ["US-AS", "US", "American Samoa"],
  ["US-AZ", "US", "Arizona"],
  ["US-CA", "US", "California"],
  ["US-CO", "US", "Colorado"],
  ["US-CT", "US", "Connecticut"],
  ["US-DC", "US", "Washington DC"],
  ["US-DE", "US", "Delaware"],
  ["US-FL", "US", "Florida"],
  ["US-GA", "US", "Georgia"],
  ["US-GU", "US", "Guam"],
  ["US-HI", "US", "Hawaii"],
  ["US-IA", "US", "Iowa"],
  ["US-ID", "US", "Idaho"],
  ["US-IL", "US", "Illinois"],
  ["US-IN", "US", "Indiana"],
  ["US-KS", "US", "Kansas"],
  ["US-KY", "US", "Kentucky"],
  ["US-LA", "US", "Louisiana"],
  ["US-MA", "US", "Massachusetts"],
  ["US-MD", "US", "Maryland"],
  ["US-ME", "US", "Maine"],
  ["US-MI", "US", "Michigan"],
  ["US-MN", "US", "Minnesota"],
  ["US-MO", "US", "Missouri"],
  ["US-MP", "US", "Northern Mariana Islands"],
  ["US-MS", "US", "Mississippi"],
  ["US-MT", "US", "Montana"],
  ["US-NC", "US", "North Carolina"],
  ["US-ND", "US", "North Dakota"],
  ["US-NE", "US", "Nebraska"],
  ["US-NH", "US", "New Hampshire"],
  ["US-NJ", "US", "New Jersey"],
  ["US-NM", "US", "New Mexico"],
  ["US-NV", "US", "Nevada"],
  ["US-NY", "US", "New York"],
  ["US-OH", "US", "Ohio"],
  ["US-OK", "US", "Oklahoma"],
  ["US-OR", "US", "Oregon"],
  ["US-PA", "US", "Pennsylvania"],
  ["US-PR", "US", "Puerto Rico"],
  ["US-RI", "US", "Rhode Island"],
  ["US-SC", "US", "South Carolina"],
  ["US-SD", "US", "South Dakota"],
  ["US-TN", "US", "Tennessee"],
  ["US-TX", "US", "Texas"],
  ["US-UM", "US", "U.S. Outlying Islands"],
  ["US-UT", "US", "Utah"],
  ["US-VA", "US", "Virginia"],
  ["US-VI", "US", "U.S. Virgin Islands"],
  ["US-VT", "US", "Vermont"],
  ["US-WA", "US", "Washington"],
  ["US-WI", "US", "Wisconsin"],
  ["US-WV", "US", "West Virginia"],
  ["US-WY", "US", "Wyoming"],
  ["UY-AR", "UY", "Artigas"],
  ["UY-CA", "UY", "Canelones"],
  ["UY-CL", "UY", "Cerro Largo"],
  ["UY-CO", "UY", "Colonia"],
  ["UY-DU", "UY", "Durazno"],
  ["UY-FD", "UY", "Florida"],
  ["UY-FS", "UY", "Flores"],
  ["UY-LA", "UY", "Lavalleja"],
  ["UY-MA", "UY", "Maldonado"],
  ["UY-MO", "UY", "Montevideo"],
  ["UY-PA", "UY", "Paysand\xFA"],
  ["UY-RN", "UY", "R\xEDo Negro"],
  ["UY-RO", "UY", "Rocha"],
  ["UY-RV", "UY", "Rivera"],
  ["UY-SA", "UY", "Salto"],
  ["UY-SJ", "UY", "San Jos\xE9"],
  ["UY-SO", "UY", "Soriano"],
  ["UY-TA", "UY", "Tacuaremb\xF3"],
  ["UY-TT", "UY", "Treinta y Tres"],
  ["UZ-AN", "UZ", "Andijan"],
  ["UZ-BU", "UZ", "Bukhara"],
  ["UZ-FA", "UZ", "Fergana"],
  ["UZ-JI", "UZ", "Jizzakh"],
  ["UZ-NG", "UZ", "Namangan"],
  ["UZ-NW", "UZ", "Navoiy"],
  ["UZ-QA", "UZ", "Qashqadaryo"],
  ["UZ-QR", "UZ", "Karakalpakstan"],
  ["UZ-SA", "UZ", "Samarqand"],
  ["UZ-SI", "UZ", "Sirdaryo"],
  ["UZ-SU", "UZ", "Surxondaryo"],
  ["UZ-TK", "UZ", "Tashkent"],
  ["UZ-TO", "UZ", "Tashkent Province"],
  ["UZ-XO", "UZ", "Xorazm"],
  ["VC-01", "VC", "Charlotte"],
  ["VC-02", "VC", "Saint Andrew"],
  ["VC-03", "VC", "Saint David"],
  ["VC-04", "VC", "Saint George"],
  ["VC-05", "VC", "Saint Patrick"],
  ["VC-06", "VC", "Grenadines"],
  ["VE-A", "VE", "Capital"],
  ["VE-B", "VE", "Anzo\xE1tegui"],
  ["VE-C", "VE", "Apure"],
  ["VE-D", "VE", "Aragua"],
  ["VE-E", "VE", "Barinas"],
  ["VE-F", "VE", "Bol\xEDvar"],
  ["VE-G", "VE", "Carabobo"],
  ["VE-H", "VE", "Cojedes"],
  ["VE-I", "VE", "Falc\xF3n"],
  ["VE-J", "VE", "Gu\xE1rico"],
  ["VE-K", "VE", "Lara"],
  ["VE-L", "VE", "M\xE9rida"],
  ["VE-M", "VE", "Miranda"],
  ["VE-N", "VE", "Monagas"],
  ["VE-O", "VE", "Nueva Esparta"],
  ["VE-P", "VE", "Portuguesa"],
  ["VE-R", "VE", "Sucre"],
  ["VE-S", "VE", "T\xE1chira"],
  ["VE-T", "VE", "Trujillo"],
  ["VE-U", "VE", "Yaracuy"],
  ["VE-V", "VE", "Zulia"],
  ["VE-W", "VE", "Federal Dependencies"],
  ["VE-X", "VE", "Vargas"],
  ["VE-Y", "VE", "Delta Amacuro"],
  ["VE-Z", "VE", "Amazonas"],
  ["VN-01", "VN", "Lai Ch\xE2u"],
  ["VN-02", "VN", "L\xE0o Cai"],
  ["VN-03", "VN", "H\xE0 Giang"],
  ["VN-04", "VN", "Cao B\u1EB1ng"],
  ["VN-05", "VN", "S\u01A1n La"],
  ["VN-06", "VN", "Y\xEAn B\xE1i"],
  ["VN-07", "VN", "Tuy\xEAn Quang"],
  ["VN-09", "VN", "L\u1EA1ng S\u01A1n"],
  ["VN-13", "VN", "Qu\u1EA3ng Ninh"],
  ["VN-14", "VN", "H\xF2a B\xECnh"],
  ["VN-18", "VN", "Ninh B\xECnh"],
  ["VN-20", "VN", "Th\xE1i B\xECnh"],
  ["VN-21", "VN", "Thanh H\xF3a"],
  ["VN-22", "VN", "Ngh\u1EC7 An"],
  ["VN-23", "VN", "H\xE0 T\u0129nh"],
  ["VN-24", "VN", "Qu\u1EA3ng B\xECnh"],
  ["VN-25", "VN", "Qu\u1EA3ng Tr\u1ECB"],
  ["VN-26", "VN", "Th\u1EEBa Thi\xEAn\u2013Hu\u1EBF"],
  ["VN-27", "VN", "Qu\u1EA3ng Nam"],
  ["VN-28", "VN", "Kon Tum"],
  ["VN-29", "VN", "Qu\u1EA3ng Ng\xE3i"],
  ["VN-30", "VN", "Gia Lai"],
  ["VN-31", "VN", "B\xECnh \u0110\u1ECBnh"],
  ["VN-32", "VN", "Ph\xFA Y\xEAn"],
  ["VN-33", "VN", "\u0110\u1EAFk L\u1EAFk"],
  ["VN-34", "VN", "Kh\xE1nh H\xF2a"],
  ["VN-35", "VN", "L\xE2m \u0110\u1ED3ng"],
  ["VN-36", "VN", "Ninh Thu\u1EADn"],
  ["VN-37", "VN", "T\xE2y Ninh"],
  ["VN-39", "VN", "\u0110\u1ED3ng Nai"],
  ["VN-40", "VN", "B\xECnh Thu\u1EADn"],
  ["VN-41", "VN", "Long An"],
  ["VN-43", "VN", "B\xE0 R\u1ECBa\u2013V\u0169ng T\xE0u"],
  ["VN-44", "VN", "An Giang"],
  ["VN-45", "VN", "\u0110\u1ED3ng Th\xE1p"],
  ["VN-46", "VN", "Ti\u1EC1n Giang"],
  ["VN-47", "VN", "Ki\xEAn Giang"],
  ["VN-49", "VN", "V\u0129nh Long"],
  ["VN-50", "VN", "B\u1EBFn Tre"],
  ["VN-51", "VN", "Tr\xE0 Vinh"],
  ["VN-52", "VN", "S\xF3c Tr\u0103ng"],
  ["VN-53", "VN", "B\u1EAFc K\u1EA1n"],
  ["VN-54", "VN", "B\u1EAFc Giang"],
  ["VN-55", "VN", "B\u1EA1c Li\xEAu"],
  ["VN-56", "VN", "B\u1EAFc Ninh"],
  ["VN-57", "VN", "B\xECnh D\u01B0\u01A1ng"],
  ["VN-58", "VN", "B\xECnh Ph\u01B0\u1EDBc"],
  ["VN-59", "VN", "C\xE0 Mau"],
  ["VN-61", "VN", "H\u1EA3i D\u01B0\u01A1ng"],
  ["VN-63", "VN", "H\xE0 Nam"],
  ["VN-66", "VN", "H\u01B0ng Y\xEAn"],
  ["VN-67", "VN", "Nam \u0110\u1ECBnh"],
  ["VN-68", "VN", "Ph\xFA Th\u1ECD"],
  ["VN-69", "VN", "Th\xE1i Nguy\xEAn"],
  ["VN-70", "VN", "V\u0129nh Ph\xFAc"],
  ["VN-71", "VN", "\u0110i\u1EC7n Bi\xEAn"],
  ["VN-72", "VN", "\u0110\u1EAFk N\xF4ng"],
  ["VN-73", "VN", "H\u1EADu Giang"],
  ["VN-CT", "VN", "Can Tho"],
  ["VN-DN", "VN", "Da Nang"],
  ["VN-HN", "VN", "Hanoi"],
  ["VN-HP", "VN", "Haiphong"],
  ["VN-SG", "VN", "Ho Chi Minh City"],
  ["VU-MAP", "VU", "Malampa"],
  ["VU-PAM", "VU", "Penama"],
  ["VU-SAM", "VU", "Sanma"],
  ["VU-SEE", "VU", "Shefa"],
  ["VU-TAE", "VU", "Tafea"],
  ["VU-TOB", "VU", "Torba"],
  ["WF-AL", "WF", "Alo"],
  ["WF-SG", "WF", "Sigave"],
  ["WF-UV", "WF", "Uvea"],
  ["WS-AA", "WS", "A\u2019ana"],
  ["WS-AL", "WS", "Aiga-i-le-Tai"],
  ["WS-AT", "WS", "Atua"],
  ["WS-FA", "WS", "Fa\u2019asaleleaga"],
  ["WS-GE", "WS", "Gaga\u2019emauga"],
  ["WS-GI", "WS", "Gaga\u2019ifomauga"],
  ["WS-PA", "WS", "Palauli"],
  ["WS-SA", "WS", "Satupa\u2019itea"],
  ["WS-TU", "WS", "Tuamasaga"],
  ["WS-VF", "WS", "Va\u2019a-o-Fonoti"],
  ["WS-VS", "WS", "Vaisigano"],
  ["YE-AB", "YE", "Abyan"],
  ["YE-AD", "YE", "\u2019Adan"],
  ["YE-AM", "YE", "Amran"],
  ["YE-BA", "YE", "Al Bayda"],
  ["YE-DA", "YE", "Dhale"],
  ["YE-DH", "YE", "Dhamar"],
  ["YE-HD", "YE", "Hadramaut"],
  ["YE-HJ", "YE", "Hajjah"],
  ["YE-HU", "YE", "Al Hudaydah"],
  ["YE-IB", "YE", "Ibb"],
  ["YE-JA", "YE", "Al Jawf"],
  ["YE-LA", "YE", "Lahij"],
  ["YE-MA", "YE", "Ma\u2019rib"],
  ["YE-MR", "YE", "Al Mahrah"],
  ["YE-MW", "YE", "Al Mahwit"],
  ["YE-RA", "YE", "Raymah"],
  ["YE-SA", "YE", "Amanat Al Asimah"],
  ["YE-SD", "YE", "Sa\u2019dah"],
  ["YE-SH", "YE", "Shabwah"],
  ["YE-SN", "YE", "Sana\u2019a"],
  ["YE-SU", "YE", "Arkhabil Suqutra"],
  ["YE-TA", "YE", "Taiz"],
  ["ZA-EC", "ZA", "Eastern Cape"],
  ["ZA-FS", "ZA", "Free State"],
  ["ZA-GP", "ZA", "Gauteng"],
  ["ZA-KZN", "ZA", "KwaZulu-Natal"],
  ["ZA-LP", "ZA", "Limpopo"],
  ["ZA-MP", "ZA", "Mpumalanga"],
  ["ZA-NC", "ZA", "Northern Cape"],
  ["ZA-NW", "ZA", "North West"],
  ["ZA-WC", "ZA", "Western Cape"],
  ["ZM-01", "ZM", "Western"],
  ["ZM-02", "ZM", "Central"],
  ["ZM-03", "ZM", "Eastern"],
  ["ZM-04", "ZM", "Luapula"],
  ["ZM-05", "ZM", "Northern"],
  ["ZM-06", "ZM", "North-Western"],
  ["ZM-07", "ZM", "Southern"],
  ["ZM-08", "ZM", "Copperbelt"],
  ["ZM-09", "ZM", "Lusaka"],
  ["ZM-10", "ZM", "Muchinga"],
  ["ZW-BU", "ZW", "Bulawayo"],
  ["ZW-HA", "ZW", "Harare"],
  ["ZW-MA", "ZW", "Manicaland"],
  ["ZW-MC", "ZW", "Mashonaland Central"],
  ["ZW-ME", "ZW", "Mashonaland East"],
  ["ZW-MI", "ZW", "Midlands"],
  ["ZW-MN", "ZW", "Matabeleland North"],
  ["ZW-MS", "ZW", "Matabeleland South"],
  ["ZW-MV", "ZW", "Masvingo"],
  ["ZW-MW", "ZW", "Mashonaland West"]
];
var JAPAN_MUNICIPALITY_RECORDS = [
  ["011002", "JP-01", "\u672D\u5E4C\u5E02"],
  ["011011", "JP-01", "\u672D\u5E4C\u5E02\u4E2D\u592E\u533A"],
  ["011029", "JP-01", "\u672D\u5E4C\u5E02\u5317\u533A"],
  ["011037", "JP-01", "\u672D\u5E4C\u5E02\u6771\u533A"],
  ["011045", "JP-01", "\u672D\u5E4C\u5E02\u767D\u77F3\u533A"],
  ["011053", "JP-01", "\u672D\u5E4C\u5E02\u8C4A\u5E73\u533A"],
  ["011061", "JP-01", "\u672D\u5E4C\u5E02\u5357\u533A"],
  ["011070", "JP-01", "\u672D\u5E4C\u5E02\u897F\u533A"],
  ["011088", "JP-01", "\u672D\u5E4C\u5E02\u539A\u5225\u533A"],
  ["011096", "JP-01", "\u672D\u5E4C\u5E02\u624B\u7A32\u533A"],
  ["011100", "JP-01", "\u672D\u5E4C\u5E02\u6E05\u7530\u533A"],
  ["012025", "JP-01", "\u51FD\u9928\u5E02"],
  ["012033", "JP-01", "\u5C0F\u6A3D\u5E02"],
  ["012041", "JP-01", "\u65ED\u5DDD\u5E02"],
  ["012050", "JP-01", "\u5BA4\u862D\u5E02"],
  ["012068", "JP-01", "\u91E7\u8DEF\u5E02"],
  ["012076", "JP-01", "\u5E2F\u5E83\u5E02"],
  ["012084", "JP-01", "\u5317\u898B\u5E02"],
  ["012092", "JP-01", "\u5915\u5F35\u5E02"],
  ["012106", "JP-01", "\u5CA9\u898B\u6CA2\u5E02"],
  ["012114", "JP-01", "\u7DB2\u8D70\u5E02"],
  ["012122", "JP-01", "\u7559\u840C\u5E02"],
  ["012131", "JP-01", "\u82EB\u5C0F\u7267\u5E02"],
  ["012149", "JP-01", "\u7A1A\u5185\u5E02"],
  ["012157", "JP-01", "\u7F8E\u5504\u5E02"],
  ["012165", "JP-01", "\u82A6\u5225\u5E02"],
  ["012173", "JP-01", "\u6C5F\u5225\u5E02"],
  ["012181", "JP-01", "\u8D64\u5E73\u5E02"],
  ["012190", "JP-01", "\u7D0B\u5225\u5E02"],
  ["012203", "JP-01", "\u58EB\u5225\u5E02"],
  ["012211", "JP-01", "\u540D\u5BC4\u5E02"],
  ["012220", "JP-01", "\u4E09\u7B20\u5E02"],
  ["012238", "JP-01", "\u6839\u5BA4\u5E02"],
  ["012246", "JP-01", "\u5343\u6B73\u5E02"],
  ["012254", "JP-01", "\u6EDD\u5DDD\u5E02"],
  ["012262", "JP-01", "\u7802\u5DDD\u5E02"],
  ["012271", "JP-01", "\u6B4C\u5FD7\u5185\u5E02"],
  ["012289", "JP-01", "\u6DF1\u5DDD\u5E02"],
  ["012297", "JP-01", "\u5BCC\u826F\u91CE\u5E02"],
  ["012301", "JP-01", "\u767B\u5225\u5E02"],
  ["012319", "JP-01", "\u6075\u5EAD\u5E02"],
  ["012335", "JP-01", "\u4F0A\u9054\u5E02"],
  ["012343", "JP-01", "\u5317\u5E83\u5CF6\u5E02"],
  ["012351", "JP-01", "\u77F3\u72E9\u5E02"],
  ["012360", "JP-01", "\u5317\u6597\u5E02"],
  ["013030", "JP-01", "\u5F53\u5225\u753A"],
  ["013048", "JP-01", "\u65B0\u7BE0\u6D25\u6751"],
  ["013315", "JP-01", "\u677E\u524D\u753A"],
  ["013323", "JP-01", "\u798F\u5CF6\u753A"],
  ["013331", "JP-01", "\u77E5\u5185\u753A"],
  ["013340", "JP-01", "\u6728\u53E4\u5185\u753A"],
  ["013374", "JP-01", "\u4E03\u98EF\u753A"],
  ["013439", "JP-01", "\u9E7F\u90E8\u753A"],
  ["013455", "JP-01", "\u68EE\u753A"],
  ["013463", "JP-01", "\u516B\u96F2\u753A"],
  ["013471", "JP-01", "\u9577\u4E07\u90E8\u753A"],
  ["013617", "JP-01", "\u6C5F\u5DEE\u753A"],
  ["013625", "JP-01", "\u4E0A\u30CE\u56FD\u753A"],
  ["013633", "JP-01", "\u539A\u6CA2\u90E8\u753A"],
  ["013641", "JP-01", "\u4E59\u90E8\u753A"],
  ["013676", "JP-01", "\u5965\u5C3B\u753A"],
  ["013706", "JP-01", "\u4ECA\u91D1\u753A"],
  ["013714", "JP-01", "\u305B\u305F\u306A\u753A"],
  ["013919", "JP-01", "\u5CF6\u7267\u6751"],
  ["013927", "JP-01", "\u5BFF\u90FD\u753A"],
  ["013935", "JP-01", "\u9ED2\u677E\u5185\u753A"],
  ["013943", "JP-01", "\u862D\u8D8A\u753A"],
  ["013951", "JP-01", "\u30CB\u30BB\u30B3\u753A"],
  ["013960", "JP-01", "\u771F\u72E9\u6751"],
  ["013978", "JP-01", "\u7559\u5BFF\u90FD\u6751"],
  ["013986", "JP-01", "\u559C\u8302\u5225\u753A"],
  ["013994", "JP-01", "\u4EAC\u6975\u753A"],
  ["014001", "JP-01", "\u5036\u77E5\u5B89\u753A"],
  ["014010", "JP-01", "\u5171\u548C\u753A"],
  ["014028", "JP-01", "\u5CA9\u5185\u753A"],
  ["014036", "JP-01", "\u6CCA\u6751"],
  ["014044", "JP-01", "\u795E\u6075\u5185\u6751"],
  ["014052", "JP-01", "\u7A4D\u4E39\u753A"],
  ["014061", "JP-01", "\u53E4\u5E73\u753A"],
  ["014079", "JP-01", "\u4EC1\u6728\u753A"],
  ["014087", "JP-01", "\u4F59\u5E02\u753A"],
  ["014095", "JP-01", "\u8D64\u4E95\u5DDD\u6751"],
  ["014231", "JP-01", "\u5357\u5E4C\u753A"],
  ["014249", "JP-01", "\u5948\u4E95\u6C5F\u753A"],
  ["014257", "JP-01", "\u4E0A\u7802\u5DDD\u753A"],
  ["014273", "JP-01", "\u7531\u4EC1\u753A"],
  ["014281", "JP-01", "\u9577\u6CBC\u753A"],
  ["014290", "JP-01", "\u6817\u5C71\u753A"],
  ["014303", "JP-01", "\u6708\u5F62\u753A"],
  ["014311", "JP-01", "\u6D66\u81FC\u753A"],
  ["014320", "JP-01", "\u65B0\u5341\u6D25\u5DDD\u753A"],
  ["014338", "JP-01", "\u59B9\u80CC\u725B\u753A"],
  ["014346", "JP-01", "\u79E9\u7236\u5225\u753A"],
  ["014362", "JP-01", "\u96E8\u7ADC\u753A"],
  ["014371", "JP-01", "\u5317\u7ADC\u753A"],
  ["014389", "JP-01", "\u6CBC\u7530\u753A"],
  ["014524", "JP-01", "\u9DF9\u6816\u753A"],
  ["014532", "JP-01", "\u6771\u795E\u697D\u753A"],
  ["014541", "JP-01", "\u5F53\u9EBB\u753A"],
  ["014559", "JP-01", "\u6BD4\u5E03\u753A"],
  ["014567", "JP-01", "\u611B\u5225\u753A"],
  ["014575", "JP-01", "\u4E0A\u5DDD\u753A"],
  ["014583", "JP-01", "\u6771\u5DDD\u753A"],
  ["014591", "JP-01", "\u7F8E\u745B\u753A"],
  ["014605", "JP-01", "\u4E0A\u5BCC\u826F\u91CE\u753A"],
  ["014613", "JP-01", "\u4E2D\u5BCC\u826F\u91CE\u753A"],
  ["014621", "JP-01", "\u5357\u5BCC\u826F\u91CE\u753A"],
  ["014630", "JP-01", "\u5360\u51A0\u6751"],
  ["014648", "JP-01", "\u548C\u5BD2\u753A"],
  ["014656", "JP-01", "\u5263\u6DF5\u753A"],
  ["014681", "JP-01", "\u4E0B\u5DDD\u753A"],
  ["014699", "JP-01", "\u7F8E\u6DF1\u753A"],
  ["014702", "JP-01", "\u97F3\u5A01\u5B50\u5E9C\u6751"],
  ["014711", "JP-01", "\u4E2D\u5DDD\u753A"],
  ["014729", "JP-01", "\u5E4C\u52A0\u5185\u753A"],
  ["014818", "JP-01", "\u5897\u6BDB\u753A"],
  ["014826", "JP-01", "\u5C0F\u5E73\u753A"],
  ["014834", "JP-01", "\u82EB\u524D\u753A"],
  ["014842", "JP-01", "\u7FBD\u5E4C\u753A"],
  ["014851", "JP-01", "\u521D\u5C71\u5225\u6751"],
  ["014869", "JP-01", "\u9060\u5225\u753A"],
  ["014877", "JP-01", "\u5929\u5869\u753A"],
  ["015113", "JP-01", "\u733F\u6255\u6751"],
  ["015121", "JP-01", "\u6D5C\u9813\u5225\u753A"],
  ["015130", "JP-01", "\u4E2D\u9813\u5225\u753A"],
  ["015148", "JP-01", "\u679D\u5E78\u753A"],
  ["015164", "JP-01", "\u8C4A\u5BCC\u753A"],
  ["015172", "JP-01", "\u793C\u6587\u753A"],
  ["015181", "JP-01", "\u5229\u5C3B\u753A"],
  ["015199", "JP-01", "\u5229\u5C3B\u5BCC\u58EB\u753A"],
  ["015202", "JP-01", "\u5E4C\u5EF6\u753A"],
  ["015431", "JP-01", "\u7F8E\u5E4C\u753A"],
  ["015440", "JP-01", "\u6D25\u5225\u753A"],
  ["015458", "JP-01", "\u659C\u91CC\u753A"],
  ["015466", "JP-01", "\u6E05\u91CC\u753A"],
  ["015474", "JP-01", "\u5C0F\u6E05\u6C34\u753A"],
  ["015491", "JP-01", "\u8A13\u5B50\u5E9C\u753A"],
  ["015504", "JP-01", "\u7F6E\u6238\u753A"],
  ["015521", "JP-01", "\u4F50\u5442\u9593\u753A"],
  ["015555", "JP-01", "\u9060\u8EFD\u753A"],
  ["015598", "JP-01", "\u6E67\u5225\u753A"],
  ["015601", "JP-01", "\u6EDD\u4E0A\u753A"],
  ["015610", "JP-01", "\u8208\u90E8\u753A"],
  ["015628", "JP-01", "\u897F\u8208\u90E8\u6751"],
  ["015636", "JP-01", "\u96C4\u6B66\u753A"],
  ["015644", "JP-01", "\u5927\u7A7A\u753A"],
  ["015717", "JP-01", "\u8C4A\u6D66\u753A"],
  ["015750", "JP-01", "\u58EE\u77A5\u753A"],
  ["015784", "JP-01", "\u767D\u8001\u753A"],
  ["015814", "JP-01", "\u539A\u771F\u753A"],
  ["015849", "JP-01", "\u6D1E\u723A\u6E56\u753A"],
  ["015857", "JP-01", "\u5B89\u5E73\u753A"],
  ["015865", "JP-01", "\u3080\u304B\u308F\u753A"],
  ["016012", "JP-01", "\u65E5\u9AD8\u753A"],
  ["016021", "JP-01", "\u5E73\u53D6\u753A"],
  ["016047", "JP-01", "\u65B0\u51A0\u753A"],
  ["016071", "JP-01", "\u6D66\u6CB3\u753A"],
  ["016080", "JP-01", "\u69D8\u4F3C\u753A"],
  ["016098", "JP-01", "\u3048\u308A\u3082\u753A"],
  ["016101", "JP-01", "\u65B0\u3072\u3060\u304B\u753A"],
  ["016314", "JP-01", "\u97F3\u66F4\u753A"],
  ["016322", "JP-01", "\u58EB\u5E4C\u753A"],
  ["016331", "JP-01", "\u4E0A\u58EB\u5E4C\u753A"],
  ["016349", "JP-01", "\u9E7F\u8FFD\u753A"],
  ["016357", "JP-01", "\u65B0\u5F97\u753A"],
  ["016365", "JP-01", "\u6E05\u6C34\u753A"],
  ["016373", "JP-01", "\u82BD\u5BA4\u753A"],
  ["016381", "JP-01", "\u4E2D\u672D\u5185\u6751"],
  ["016390", "JP-01", "\u66F4\u5225\u6751"],
  ["016411", "JP-01", "\u5927\u6A39\u753A"],
  ["016420", "JP-01", "\u5E83\u5C3E\u753A"],
  ["016438", "JP-01", "\u5E55\u5225\u753A"],
  ["016446", "JP-01", "\u6C60\u7530\u753A"],
  ["016454", "JP-01", "\u8C4A\u9803\u753A"],
  ["016462", "JP-01", "\u672C\u5225\u753A"],
  ["016471", "JP-01", "\u8DB3\u5BC4\u753A"],
  ["016489", "JP-01", "\u9678\u5225\u753A"],
  ["016497", "JP-01", "\u6D66\u5E4C\u753A"],
  ["016616", "JP-01", "\u91E7\u8DEF\u753A"],
  ["016624", "JP-01", "\u539A\u5CB8\u753A"],
  ["016632", "JP-01", "\u6D5C\u4E2D\u753A"],
  ["016641", "JP-01", "\u6A19\u8336\u753A"],
  ["016659", "JP-01", "\u5F1F\u5B50\u5C48\u753A"],
  ["016675", "JP-01", "\u9DB4\u5C45\u6751"],
  ["016683", "JP-01", "\u767D\u7CE0\u753A"],
  ["016918", "JP-01", "\u5225\u6D77\u753A"],
  ["016926", "JP-01", "\u4E2D\u6A19\u6D25\u753A"],
  ["016934", "JP-01", "\u6A19\u6D25\u753A"],
  ["016942", "JP-01", "\u7F85\u81FC\u753A"],
  ["022012", "JP-02", "\u9752\u68EE\u5E02"],
  ["022021", "JP-02", "\u5F18\u524D\u5E02"],
  ["022039", "JP-02", "\u516B\u6238\u5E02"],
  ["022047", "JP-02", "\u9ED2\u77F3\u5E02"],
  ["022055", "JP-02", "\u4E94\u6240\u5DDD\u539F\u5E02"],
  ["022063", "JP-02", "\u5341\u548C\u7530\u5E02"],
  ["022071", "JP-02", "\u4E09\u6CA2\u5E02"],
  ["022080", "JP-02", "\u3080\u3064\u5E02"],
  ["022098", "JP-02", "\u3064\u304C\u308B\u5E02"],
  ["022101", "JP-02", "\u5E73\u5DDD\u5E02"],
  ["023019", "JP-02", "\u5E73\u5185\u753A"],
  ["023035", "JP-02", "\u4ECA\u5225\u753A"],
  ["023043", "JP-02", "\u84EC\u7530\u6751"],
  ["023078", "JP-02", "\u5916\u30F6\u6D5C\u753A"],
  ["023213", "JP-02", "\u9C3A\u30F6\u6CA2\u753A"],
  ["023230", "JP-02", "\u6DF1\u6D66\u753A"],
  ["023434", "JP-02", "\u897F\u76EE\u5C4B\u6751"],
  ["023612", "JP-02", "\u85E4\u5D0E\u753A"],
  ["023621", "JP-02", "\u5927\u9C10\u753A"],
  ["023671", "JP-02", "\u7530\u820E\u9928\u6751"],
  ["023817", "JP-02", "\u677F\u67F3\u753A"],
  ["023841", "JP-02", "\u9DB4\u7530\u753A"],
  ["023876", "JP-02", "\u4E2D\u6CCA\u753A"],
  ["024015", "JP-02", "\u91CE\u8FBA\u5730\u753A"],
  ["024023", "JP-02", "\u4E03\u6238\u753A"],
  ["024058", "JP-02", "\u516D\u6238\u753A"],
  ["024066", "JP-02", "\u6A2A\u6D5C\u753A"],
  ["024082", "JP-02", "\u6771\u5317\u753A"],
  ["024112", "JP-02", "\u516D\u30F6\u6240\u6751"],
  ["024121", "JP-02", "\u304A\u3044\u3089\u305B\u753A"],
  ["024236", "JP-02", "\u5927\u9593\u753A"],
  ["024244", "JP-02", "\u6771\u901A\u6751"],
  ["024252", "JP-02", "\u98A8\u9593\u6D66\u6751"],
  ["024261", "JP-02", "\u4F50\u4E95\u6751"],
  ["024414", "JP-02", "\u4E09\u6238\u753A"],
  ["024422", "JP-02", "\u4E94\u6238\u753A"],
  ["024431", "JP-02", "\u7530\u5B50\u753A"],
  ["024457", "JP-02", "\u5357\u90E8\u753A"],
  ["024465", "JP-02", "\u968E\u4E0A\u753A"],
  ["024503", "JP-02", "\u65B0\u90F7\u6751"],
  ["032018", "JP-03", "\u76DB\u5CA1\u5E02"],
  ["032026", "JP-03", "\u5BAE\u53E4\u5E02"],
  ["032034", "JP-03", "\u5927\u8239\u6E21\u5E02"],
  ["032051", "JP-03", "\u82B1\u5DFB\u5E02"],
  ["032069", "JP-03", "\u5317\u4E0A\u5E02"],
  ["032077", "JP-03", "\u4E45\u6148\u5E02"],
  ["032085", "JP-03", "\u9060\u91CE\u5E02"],
  ["032093", "JP-03", "\u4E00\u95A2\u5E02"],
  ["032107", "JP-03", "\u9678\u524D\u9AD8\u7530\u5E02"],
  ["032115", "JP-03", "\u91DC\u77F3\u5E02"],
  ["032131", "JP-03", "\u4E8C\u6238\u5E02"],
  ["032140", "JP-03", "\u516B\u5E61\u5E73\u5E02"],
  ["032158", "JP-03", "\u5965\u5DDE\u5E02"],
  ["032166", "JP-03", "\u6EDD\u6CA2\u5E02"],
  ["033014", "JP-03", "\u96EB\u77F3\u753A"],
  ["033022", "JP-03", "\u845B\u5DFB\u753A"],
  ["033031", "JP-03", "\u5CA9\u624B\u753A"],
  ["033219", "JP-03", "\u7D2B\u6CE2\u753A"],
  ["033227", "JP-03", "\u77E2\u5DFE\u753A"],
  ["033669", "JP-03", "\u897F\u548C\u8CC0\u753A"],
  ["033812", "JP-03", "\u91D1\u30B1\u5D0E\u753A"],
  ["034029", "JP-03", "\u5E73\u6CC9\u753A"],
  ["034410", "JP-03", "\u4F4F\u7530\u753A"],
  ["034614", "JP-03", "\u5927\u69CC\u753A"],
  ["034827", "JP-03", "\u5C71\u7530\u753A"],
  ["034835", "JP-03", "\u5CA9\u6CC9\u753A"],
  ["034843", "JP-03", "\u7530\u91CE\u7551\u6751"],
  ["034851", "JP-03", "\u666E\u4EE3\u6751"],
  ["035017", "JP-03", "\u8EFD\u7C73\u753A"],
  ["035033", "JP-03", "\u91CE\u7530\u6751"],
  ["035068", "JP-03", "\u4E5D\u6238\u6751"],
  ["035076", "JP-03", "\u6D0B\u91CE\u753A"],
  ["035246", "JP-03", "\u4E00\u6238\u753A"],
  ["041009", "JP-04", "\u4ED9\u53F0\u5E02"],
  ["041017", "JP-04", "\u4ED9\u53F0\u5E02\u9752\u8449\u533A"],
  ["041025", "JP-04", "\u4ED9\u53F0\u5E02\u5BAE\u57CE\u91CE\u533A"],
  ["041033", "JP-04", "\u4ED9\u53F0\u5E02\u82E5\u6797\u533A"],
  ["041041", "JP-04", "\u4ED9\u53F0\u5E02\u592A\u767D\u533A"],
  ["041050", "JP-04", "\u4ED9\u53F0\u5E02\u6CC9\u533A"],
  ["042021", "JP-04", "\u77F3\u5DFB\u5E02"],
  ["042030", "JP-04", "\u5869\u7AC8\u5E02"],
  ["042056", "JP-04", "\u6C17\u4ED9\u6CBC\u5E02"],
  ["042064", "JP-04", "\u767D\u77F3\u5E02"],
  ["042072", "JP-04", "\u540D\u53D6\u5E02"],
  ["042081", "JP-04", "\u89D2\u7530\u5E02"],
  ["042099", "JP-04", "\u591A\u8CC0\u57CE\u5E02"],
  ["042111", "JP-04", "\u5CA9\u6CBC\u5E02"],
  ["042129", "JP-04", "\u767B\u7C73\u5E02"],
  ["042137", "JP-04", "\u6817\u539F\u5E02"],
  ["042145", "JP-04", "\u6771\u677E\u5CF6\u5E02"],
  ["042153", "JP-04", "\u5927\u5D0E\u5E02"],
  ["042161", "JP-04", "\u5BCC\u8C37\u5E02"],
  ["043010", "JP-04", "\u8535\u738B\u753A"],
  ["043028", "JP-04", "\u4E03\u30B1\u5BBF\u753A"],
  ["043214", "JP-04", "\u5927\u6CB3\u539F\u753A"],
  ["043222", "JP-04", "\u6751\u7530\u753A"],
  ["043231", "JP-04", "\u67F4\u7530\u753A"],
  ["043249", "JP-04", "\u5DDD\u5D0E\u753A"],
  ["043419", "JP-04", "\u4E38\u68EE\u753A"],
  ["043613", "JP-04", "\u4E98\u7406\u753A"],
  ["043621", "JP-04", "\u5C71\u5143\u753A"],
  ["044016", "JP-04", "\u677E\u5CF6\u753A"],
  ["044041", "JP-04", "\u4E03\u30F6\u6D5C\u753A"],
  ["044067", "JP-04", "\u5229\u5E9C\u753A"],
  ["044211", "JP-04", "\u5927\u548C\u753A"],
  ["044229", "JP-04", "\u5927\u90F7\u753A"],
  ["044245", "JP-04", "\u5927\u8861\u6751"],
  ["044440", "JP-04", "\u8272\u9EBB\u753A"],
  ["044458", "JP-04", "\u52A0\u7F8E\u753A"],
  ["045012", "JP-04", "\u6D8C\u8C37\u753A"],
  ["045055", "JP-04", "\u7F8E\u91CC\u753A"],
  ["045811", "JP-04", "\u5973\u5DDD\u753A"],
  ["046060", "JP-04", "\u5357\u4E09\u9678\u753A"],
  ["052019", "JP-05", "\u79CB\u7530\u5E02"],
  ["052027", "JP-05", "\u80FD\u4EE3\u5E02"],
  ["052035", "JP-05", "\u6A2A\u624B\u5E02"],
  ["052043", "JP-05", "\u5927\u9928\u5E02"],
  ["052060", "JP-05", "\u7537\u9E7F\u5E02"],
  ["052078", "JP-05", "\u6E6F\u6CA2\u5E02"],
  ["052094", "JP-05", "\u9E7F\u89D2\u5E02"],
  ["052108", "JP-05", "\u7531\u5229\u672C\u8358\u5E02"],
  ["052116", "JP-05", "\u6F5F\u4E0A\u5E02"],
  ["052124", "JP-05", "\u5927\u4ED9\u5E02"],
  ["052132", "JP-05", "\u5317\u79CB\u7530\u5E02"],
  ["052141", "JP-05", "\u306B\u304B\u307B\u5E02"],
  ["052159", "JP-05", "\u4ED9\u5317\u5E02"],
  ["053031", "JP-05", "\u5C0F\u5742\u753A"],
  ["053279", "JP-05", "\u4E0A\u5C0F\u963F\u4EC1\u6751"],
  ["053465", "JP-05", "\u85E4\u91CC\u753A"],
  ["053481", "JP-05", "\u4E09\u7A2E\u753A"],
  ["053490", "JP-05", "\u516B\u5CF0\u753A"],
  ["053619", "JP-05", "\u4E94\u57CE\u76EE\u753A"],
  ["053635", "JP-05", "\u516B\u90CE\u6F5F\u753A"],
  ["053660", "JP-05", "\u4E95\u5DDD\u753A"],
  ["053686", "JP-05", "\u5927\u6F5F\u6751"],
  ["054348", "JP-05", "\u7F8E\u90F7\u753A"],
  ["054631", "JP-05", "\u7FBD\u5F8C\u753A"],
  ["054640", "JP-05", "\u6771\u6210\u702C\u6751"],
  ["062014", "JP-06", "\u5C71\u5F62\u5E02"],
  ["062022", "JP-06", "\u7C73\u6CA2\u5E02"],
  ["062031", "JP-06", "\u9DB4\u5CA1\u5E02"],
  ["062049", "JP-06", "\u9152\u7530\u5E02"],
  ["062057", "JP-06", "\u65B0\u5E84\u5E02"],
  ["062065", "JP-06", "\u5BD2\u6CB3\u6C5F\u5E02"],
  ["062073", "JP-06", "\u4E0A\u5C71\u5E02"],
  ["062081", "JP-06", "\u6751\u5C71\u5E02"],
  ["062090", "JP-06", "\u9577\u4E95\u5E02"],
  ["062103", "JP-06", "\u5929\u7AE5\u5E02"],
  ["062111", "JP-06", "\u6771\u6839\u5E02"],
  ["062120", "JP-06", "\u5C3E\u82B1\u6CA2\u5E02"],
  ["062138", "JP-06", "\u5357\u967D\u5E02"],
  ["063011", "JP-06", "\u5C71\u8FBA\u753A"],
  ["063029", "JP-06", "\u4E2D\u5C71\u753A"],
  ["063215", "JP-06", "\u6CB3\u5317\u753A"],
  ["063223", "JP-06", "\u897F\u5DDD\u753A"],
  ["063231", "JP-06", "\u671D\u65E5\u753A"],
  ["063240", "JP-06", "\u5927\u6C5F\u753A"],
  ["063410", "JP-06", "\u5927\u77F3\u7530\u753A"],
  ["063614", "JP-06", "\u91D1\u5C71\u753A"],
  ["063622", "JP-06", "\u6700\u4E0A\u753A"],
  ["063631", "JP-06", "\u821F\u5F62\u753A"],
  ["063649", "JP-06", "\u771F\u5BA4\u5DDD\u753A"],
  ["063657", "JP-06", "\u5927\u8535\u6751"],
  ["063665", "JP-06", "\u9BAD\u5DDD\u6751"],
  ["063673", "JP-06", "\u6238\u6CA2\u6751"],
  ["063819", "JP-06", "\u9AD8\u7560\u753A"],
  ["063827", "JP-06", "\u5DDD\u897F\u753A"],
  ["064017", "JP-06", "\u5C0F\u56FD\u753A"],
  ["064025", "JP-06", "\u767D\u9DF9\u753A"],
  ["064033", "JP-06", "\u98EF\u8C4A\u753A"],
  ["064262", "JP-06", "\u4E09\u5DDD\u753A"],
  ["064289", "JP-06", "\u5E84\u5185\u753A"],
  ["064611", "JP-06", "\u904A\u4F50\u753A"],
  ["072010", "JP-07", "\u798F\u5CF6\u5E02"],
  ["072028", "JP-07", "\u4F1A\u6D25\u82E5\u677E\u5E02"],
  ["072036", "JP-07", "\u90E1\u5C71\u5E02"],
  ["072044", "JP-07", "\u3044\u308F\u304D\u5E02"],
  ["072052", "JP-07", "\u767D\u6CB3\u5E02"],
  ["072079", "JP-07", "\u9808\u8CC0\u5DDD\u5E02"],
  ["072087", "JP-07", "\u559C\u591A\u65B9\u5E02"],
  ["072095", "JP-07", "\u76F8\u99AC\u5E02"],
  ["072109", "JP-07", "\u4E8C\u672C\u677E\u5E02"],
  ["072117", "JP-07", "\u7530\u6751\u5E02"],
  ["072125", "JP-07", "\u5357\u76F8\u99AC\u5E02"],
  ["072133", "JP-07", "\u4F0A\u9054\u5E02"],
  ["072141", "JP-07", "\u672C\u5BAE\u5E02"],
  ["073016", "JP-07", "\u6851\u6298\u753A"],
  ["073032", "JP-07", "\u56FD\u898B\u753A"],
  ["073083", "JP-07", "\u5DDD\u4FE3\u753A"],
  ["073229", "JP-07", "\u5927\u7389\u6751"],
  ["073423", "JP-07", "\u93E1\u77F3\u753A"],
  ["073440", "JP-07", "\u5929\u6804\u6751"],
  ["073628", "JP-07", "\u4E0B\u90F7\u753A"],
  ["073644", "JP-07", "\u6A9C\u679D\u5C90\u6751"],
  ["073679", "JP-07", "\u53EA\u898B\u753A"],
  ["073687", "JP-07", "\u5357\u4F1A\u6D25\u753A"],
  ["074021", "JP-07", "\u5317\u5869\u539F\u6751"],
  ["074055", "JP-07", "\u897F\u4F1A\u6D25\u753A"],
  ["074071", "JP-07", "\u78D0\u68AF\u753A"],
  ["074080", "JP-07", "\u732A\u82D7\u4EE3\u753A"],
  ["074217", "JP-07", "\u4F1A\u6D25\u5742\u4E0B\u753A"],
  ["074225", "JP-07", "\u6E6F\u5DDD\u6751"],
  ["074233", "JP-07", "\u67F3\u6D25\u753A"],
  ["074446", "JP-07", "\u4E09\u5CF6\u753A"],
  ["074454", "JP-07", "\u91D1\u5C71\u753A"],
  ["074462", "JP-07", "\u662D\u548C\u6751"],
  ["074471", "JP-07", "\u4F1A\u6D25\u7F8E\u91CC\u753A"],
  ["074616", "JP-07", "\u897F\u90F7\u6751"],
  ["074641", "JP-07", "\u6CC9\u5D0E\u6751"],
  ["074659", "JP-07", "\u4E2D\u5CF6\u6751"],
  ["074667", "JP-07", "\u77E2\u5439\u753A"],
  ["074811", "JP-07", "\u68DA\u5009\u753A"],
  ["074829", "JP-07", "\u77E2\u796D\u753A"],
  ["074837", "JP-07", "\u5859\u753A"],
  ["074845", "JP-07", "\u9BAB\u5DDD\u6751"],
  ["075019", "JP-07", "\u77F3\u5DDD\u753A"],
  ["075027", "JP-07", "\u7389\u5DDD\u6751"],
  ["075035", "JP-07", "\u5E73\u7530\u6751"],
  ["075043", "JP-07", "\u6D45\u5DDD\u753A"],
  ["075051", "JP-07", "\u53E4\u6BBF\u753A"],
  ["075213", "JP-07", "\u4E09\u6625\u753A"],
  ["075221", "JP-07", "\u5C0F\u91CE\u753A"],
  ["075418", "JP-07", "\u5E83\u91CE\u753A"],
  ["075426", "JP-07", "\u6962\u8449\u753A"],
  ["075434", "JP-07", "\u5BCC\u5CA1\u753A"],
  ["075442", "JP-07", "\u5DDD\u5185\u6751"],
  ["075451", "JP-07", "\u5927\u718A\u753A"],
  ["075469", "JP-07", "\u53CC\u8449\u753A"],
  ["075477", "JP-07", "\u6D6A\u6C5F\u753A"],
  ["075485", "JP-07", "\u845B\u5C3E\u6751"],
  ["075612", "JP-07", "\u65B0\u5730\u753A"],
  ["075647", "JP-07", "\u98EF\u8218\u6751"],
  ["082015", "JP-08", "\u6C34\u6238\u5E02"],
  ["082023", "JP-08", "\u65E5\u7ACB\u5E02"],
  ["082031", "JP-08", "\u571F\u6D66\u5E02"],
  ["082040", "JP-08", "\u53E4\u6CB3\u5E02"],
  ["082058", "JP-08", "\u77F3\u5CA1\u5E02"],
  ["082074", "JP-08", "\u7D50\u57CE\u5E02"],
  ["082082", "JP-08", "\u9F8D\u30B1\u5D0E\u5E02"],
  ["082104", "JP-08", "\u4E0B\u59BB\u5E02"],
  ["082112", "JP-08", "\u5E38\u7DCF\u5E02"],
  ["082121", "JP-08", "\u5E38\u9678\u592A\u7530\u5E02"],
  ["082147", "JP-08", "\u9AD8\u8429\u5E02"],
  ["082155", "JP-08", "\u5317\u8328\u57CE\u5E02"],
  ["082163", "JP-08", "\u7B20\u9593\u5E02"],
  ["082171", "JP-08", "\u53D6\u624B\u5E02"],
  ["082198", "JP-08", "\u725B\u4E45\u5E02"],
  ["082201", "JP-08", "\u3064\u304F\u3070\u5E02"],
  ["082210", "JP-08", "\u3072\u305F\u3061\u306A\u304B\u5E02"],
  ["082228", "JP-08", "\u9E7F\u5D8B\u5E02"],
  ["082236", "JP-08", "\u6F6E\u6765\u5E02"],
  ["082244", "JP-08", "\u5B88\u8C37\u5E02"],
  ["082252", "JP-08", "\u5E38\u9678\u5927\u5BAE\u5E02"],
  ["082261", "JP-08", "\u90A3\u73C2\u5E02"],
  ["082279", "JP-08", "\u7B51\u897F\u5E02"],
  ["082287", "JP-08", "\u5742\u6771\u5E02"],
  ["082295", "JP-08", "\u7A32\u6577\u5E02"],
  ["082309", "JP-08", "\u304B\u3059\u307F\u304C\u3046\u3089\u5E02"],
  ["082317", "JP-08", "\u685C\u5DDD\u5E02"],
  ["082325", "JP-08", "\u795E\u6816\u5E02"],
  ["082333", "JP-08", "\u884C\u65B9\u5E02"],
  ["082341", "JP-08", "\u927E\u7530\u5E02"],
  ["082350", "JP-08", "\u3064\u304F\u3070\u307F\u3089\u3044\u5E02"],
  ["082368", "JP-08", "\u5C0F\u7F8E\u7389\u5E02"],
  ["083020", "JP-08", "\u8328\u57CE\u753A"],
  ["083097", "JP-08", "\u5927\u6D17\u753A"],
  ["083101", "JP-08", "\u57CE\u91CC\u753A"],
  ["083411", "JP-08", "\u6771\u6D77\u6751"],
  ["083640", "JP-08", "\u5927\u5B50\u753A"],
  ["084425", "JP-08", "\u7F8E\u6D66\u6751"],
  ["084433", "JP-08", "\u963F\u898B\u753A"],
  ["084476", "JP-08", "\u6CB3\u5185\u753A"],
  ["085219", "JP-08", "\u516B\u5343\u4EE3\u753A"],
  ["085421", "JP-08", "\u4E94\u971E\u753A"],
  ["085464", "JP-08", "\u5883\u753A"],
  ["085642", "JP-08", "\u5229\u6839\u753A"],
  ["092011", "JP-09", "\u5B87\u90FD\u5BAE\u5E02"],
  ["092029", "JP-09", "\u8DB3\u5229\u5E02"],
  ["092037", "JP-09", "\u6803\u6728\u5E02"],
  ["092045", "JP-09", "\u4F50\u91CE\u5E02"],
  ["092053", "JP-09", "\u9E7F\u6CBC\u5E02"],
  ["092061", "JP-09", "\u65E5\u5149\u5E02"],
  ["092088", "JP-09", "\u5C0F\u5C71\u5E02"],
  ["092096", "JP-09", "\u771F\u5CA1\u5E02"],
  ["092100", "JP-09", "\u5927\u7530\u539F\u5E02"],
  ["092118", "JP-09", "\u77E2\u677F\u5E02"],
  ["092134", "JP-09", "\u90A3\u9808\u5869\u539F\u5E02"],
  ["092142", "JP-09", "\u3055\u304F\u3089\u5E02"],
  ["092151", "JP-09", "\u90A3\u9808\u70CF\u5C71\u5E02"],
  ["092169", "JP-09", "\u4E0B\u91CE\u5E02"],
  ["093017", "JP-09", "\u4E0A\u4E09\u5DDD\u753A"],
  ["093424", "JP-09", "\u76CA\u5B50\u753A"],
  ["093432", "JP-09", "\u8302\u6728\u753A"],
  ["093441", "JP-09", "\u5E02\u8C9D\u753A"],
  ["093459", "JP-09", "\u82B3\u8CC0\u753A"],
  ["093611", "JP-09", "\u58EC\u751F\u753A"],
  ["093645", "JP-09", "\u91CE\u6728\u753A"],
  ["093840", "JP-09", "\u5869\u8C37\u753A"],
  ["093866", "JP-09", "\u9AD8\u6839\u6CA2\u753A"],
  ["094072", "JP-09", "\u90A3\u9808\u753A"],
  ["094111", "JP-09", "\u90A3\u73C2\u5DDD\u753A"],
  ["102016", "JP-10", "\u524D\u6A4B\u5E02"],
  ["102024", "JP-10", "\u9AD8\u5D0E\u5E02"],
  ["102032", "JP-10", "\u6850\u751F\u5E02"],
  ["102041", "JP-10", "\u4F0A\u52E2\u5D0E\u5E02"],
  ["102059", "JP-10", "\u592A\u7530\u5E02"],
  ["102067", "JP-10", "\u6CBC\u7530\u5E02"],
  ["102075", "JP-10", "\u9928\u6797\u5E02"],
  ["102083", "JP-10", "\u6E0B\u5DDD\u5E02"],
  ["102091", "JP-10", "\u85E4\u5CA1\u5E02"],
  ["102105", "JP-10", "\u5BCC\u5CA1\u5E02"],
  ["102113", "JP-10", "\u5B89\u4E2D\u5E02"],
  ["102121", "JP-10", "\u307F\u3069\u308A\u5E02"],
  ["103446", "JP-10", "\u699B\u6771\u6751"],
  ["103454", "JP-10", "\u5409\u5CA1\u753A"],
  ["103667", "JP-10", "\u4E0A\u91CE\u6751"],
  ["103675", "JP-10", "\u795E\u6D41\u753A"],
  ["103829", "JP-10", "\u4E0B\u4EC1\u7530\u753A"],
  ["103837", "JP-10", "\u5357\u7267\u6751"],
  ["103845", "JP-10", "\u7518\u697D\u753A"],
  ["104213", "JP-10", "\u4E2D\u4E4B\u6761\u753A"],
  ["104248", "JP-10", "\u9577\u91CE\u539F\u753A"],
  ["104256", "JP-10", "\u5B2C\u604B\u6751"],
  ["104264", "JP-10", "\u8349\u6D25\u753A"],
  ["104281", "JP-10", "\u9AD8\u5C71\u6751"],
  ["104299", "JP-10", "\u6771\u543E\u59BB\u753A"],
  ["104434", "JP-10", "\u7247\u54C1\u6751"],
  ["104442", "JP-10", "\u5DDD\u5834\u6751"],
  ["104485", "JP-10", "\u662D\u548C\u6751"],
  ["104493", "JP-10", "\u307F\u306A\u304B\u307F\u753A"],
  ["104647", "JP-10", "\u7389\u6751\u753A"],
  ["105210", "JP-10", "\u677F\u5009\u753A"],
  ["105228", "JP-10", "\u660E\u548C\u753A"],
  ["105236", "JP-10", "\u5343\u4EE3\u7530\u753A"],
  ["105244", "JP-10", "\u5927\u6CC9\u753A"],
  ["105252", "JP-10", "\u9091\u697D\u753A"],
  ["111007", "JP-11", "\u3055\u3044\u305F\u307E\u5E02"],
  ["111015", "JP-11", "\u3055\u3044\u305F\u307E\u5E02\u897F\u533A"],
  ["111023", "JP-11", "\u3055\u3044\u305F\u307E\u5E02\u5317\u533A"],
  ["111031", "JP-11", "\u3055\u3044\u305F\u307E\u5E02\u5927\u5BAE\u533A"],
  ["111040", "JP-11", "\u3055\u3044\u305F\u307E\u5E02\u898B\u6CBC\u533A"],
  ["111058", "JP-11", "\u3055\u3044\u305F\u307E\u5E02\u4E2D\u592E\u533A"],
  ["111066", "JP-11", "\u3055\u3044\u305F\u307E\u5E02\u685C\u533A"],
  ["111074", "JP-11", "\u3055\u3044\u305F\u307E\u5E02\u6D66\u548C\u533A"],
  ["111082", "JP-11", "\u3055\u3044\u305F\u307E\u5E02\u5357\u533A"],
  ["111091", "JP-11", "\u3055\u3044\u305F\u307E\u5E02\u7DD1\u533A"],
  ["111104", "JP-11", "\u3055\u3044\u305F\u307E\u5E02\u5CA9\u69FB\u533A"],
  ["112011", "JP-11", "\u5DDD\u8D8A\u5E02"],
  ["112020", "JP-11", "\u718A\u8C37\u5E02"],
  ["112038", "JP-11", "\u5DDD\u53E3\u5E02"],
  ["112062", "JP-11", "\u884C\u7530\u5E02"],
  ["112071", "JP-11", "\u79E9\u7236\u5E02"],
  ["112089", "JP-11", "\u6240\u6CA2\u5E02"],
  ["112097", "JP-11", "\u98EF\u80FD\u5E02"],
  ["112101", "JP-11", "\u52A0\u9808\u5E02"],
  ["112119", "JP-11", "\u672C\u5E84\u5E02"],
  ["112127", "JP-11", "\u6771\u677E\u5C71\u5E02"],
  ["112143", "JP-11", "\u6625\u65E5\u90E8\u5E02"],
  ["112151", "JP-11", "\u72ED\u5C71\u5E02"],
  ["112160", "JP-11", "\u7FBD\u751F\u5E02"],
  ["112178", "JP-11", "\u9D3B\u5DE3\u5E02"],
  ["112186", "JP-11", "\u6DF1\u8C37\u5E02"],
  ["112194", "JP-11", "\u4E0A\u5C3E\u5E02"],
  ["112216", "JP-11", "\u8349\u52A0\u5E02"],
  ["112224", "JP-11", "\u8D8A\u8C37\u5E02"],
  ["112232", "JP-11", "\u8568\u5E02"],
  ["112241", "JP-11", "\u6238\u7530\u5E02"],
  ["112259", "JP-11", "\u5165\u9593\u5E02"],
  ["112275", "JP-11", "\u671D\u971E\u5E02"],
  ["112283", "JP-11", "\u5FD7\u6728\u5E02"],
  ["112291", "JP-11", "\u548C\u5149\u5E02"],
  ["112305", "JP-11", "\u65B0\u5EA7\u5E02"],
  ["112313", "JP-11", "\u6876\u5DDD\u5E02"],
  ["112321", "JP-11", "\u4E45\u559C\u5E02"],
  ["112330", "JP-11", "\u5317\u672C\u5E02"],
  ["112348", "JP-11", "\u516B\u6F6E\u5E02"],
  ["112356", "JP-11", "\u5BCC\u58EB\u898B\u5E02"],
  ["112372", "JP-11", "\u4E09\u90F7\u5E02"],
  ["112381", "JP-11", "\u84EE\u7530\u5E02"],
  ["112399", "JP-11", "\u5742\u6238\u5E02"],
  ["112402", "JP-11", "\u5E78\u624B\u5E02"],
  ["112411", "JP-11", "\u9DB4\u30F6\u5CF6\u5E02"],
  ["112429", "JP-11", "\u65E5\u9AD8\u5E02"],
  ["112437", "JP-11", "\u5409\u5DDD\u5E02"],
  ["112453", "JP-11", "\u3075\u3058\u307F\u91CE\u5E02"],
  ["112461", "JP-11", "\u767D\u5CA1\u5E02"],
  ["113018", "JP-11", "\u4F0A\u5948\u753A"],
  ["113247", "JP-11", "\u4E09\u82B3\u753A"],
  ["113263", "JP-11", "\u6BDB\u5442\u5C71\u753A"],
  ["113271", "JP-11", "\u8D8A\u751F\u753A"],
  ["113417", "JP-11", "\u6ED1\u5DDD\u753A"],
  ["113425", "JP-11", "\u5D50\u5C71\u753A"],
  ["113433", "JP-11", "\u5C0F\u5DDD\u753A"],
  ["113468", "JP-11", "\u5DDD\u5CF6\u753A"],
  ["113476", "JP-11", "\u5409\u898B\u753A"],
  ["113484", "JP-11", "\u9CE9\u5C71\u753A"],
  ["113492", "JP-11", "\u3068\u304D\u304C\u308F\u753A"],
  ["113611", "JP-11", "\u6A2A\u702C\u753A"],
  ["113620", "JP-11", "\u7686\u91CE\u753A"],
  ["113638", "JP-11", "\u9577\u701E\u753A"],
  ["113654", "JP-11", "\u5C0F\u9E7F\u91CE\u753A"],
  ["113697", "JP-11", "\u6771\u79E9\u7236\u6751"],
  ["113816", "JP-11", "\u7F8E\u91CC\u753A"],
  ["113832", "JP-11", "\u795E\u5DDD\u753A"],
  ["113859", "JP-11", "\u4E0A\u91CC\u753A"],
  ["114081", "JP-11", "\u5BC4\u5C45\u753A"],
  ["114421", "JP-11", "\u5BAE\u4EE3\u753A"],
  ["114642", "JP-11", "\u6749\u6238\u753A"],
  ["114651", "JP-11", "\u677E\u4F0F\u753A"],
  ["121002", "JP-12", "\u5343\u8449\u5E02"],
  ["121011", "JP-12", "\u5343\u8449\u5E02\u4E2D\u592E\u533A"],
  ["121029", "JP-12", "\u5343\u8449\u5E02\u82B1\u898B\u5DDD\u533A"],
  ["121037", "JP-12", "\u5343\u8449\u5E02\u7A32\u6BDB\u533A"],
  ["121045", "JP-12", "\u5343\u8449\u5E02\u82E5\u8449\u533A"],
  ["121053", "JP-12", "\u5343\u8449\u5E02\u7DD1\u533A"],
  ["121061", "JP-12", "\u5343\u8449\u5E02\u7F8E\u6D5C\u533A"],
  ["122025", "JP-12", "\u929A\u5B50\u5E02"],
  ["122033", "JP-12", "\u5E02\u5DDD\u5E02"],
  ["122041", "JP-12", "\u8239\u6A4B\u5E02"],
  ["122050", "JP-12", "\u9928\u5C71\u5E02"],
  ["122068", "JP-12", "\u6728\u66F4\u6D25\u5E02"],
  ["122076", "JP-12", "\u677E\u6238\u5E02"],
  ["122084", "JP-12", "\u91CE\u7530\u5E02"],
  ["122106", "JP-12", "\u8302\u539F\u5E02"],
  ["122114", "JP-12", "\u6210\u7530\u5E02"],
  ["122122", "JP-12", "\u4F50\u5009\u5E02"],
  ["122131", "JP-12", "\u6771\u91D1\u5E02"],
  ["122157", "JP-12", "\u65ED\u5E02"],
  ["122165", "JP-12", "\u7FD2\u5FD7\u91CE\u5E02"],
  ["122173", "JP-12", "\u67CF\u5E02"],
  ["122181", "JP-12", "\u52DD\u6D66\u5E02"],
  ["122190", "JP-12", "\u5E02\u539F\u5E02"],
  ["122203", "JP-12", "\u6D41\u5C71\u5E02"],
  ["122211", "JP-12", "\u516B\u5343\u4EE3\u5E02"],
  ["122220", "JP-12", "\u6211\u5B6B\u5B50\u5E02"],
  ["122238", "JP-12", "\u9D28\u5DDD\u5E02"],
  ["122246", "JP-12", "\u938C\u30B1\u8C37\u5E02"],
  ["122254", "JP-12", "\u541B\u6D25\u5E02"],
  ["122262", "JP-12", "\u5BCC\u6D25\u5E02"],
  ["122271", "JP-12", "\u6D66\u5B89\u5E02"],
  ["122289", "JP-12", "\u56DB\u8857\u9053\u5E02"],
  ["122297", "JP-12", "\u8896\u30B1\u6D66\u5E02"],
  ["122301", "JP-12", "\u516B\u8857\u5E02"],
  ["122319", "JP-12", "\u5370\u897F\u5E02"],
  ["122327", "JP-12", "\u767D\u4E95\u5E02"],
  ["122335", "JP-12", "\u5BCC\u91CC\u5E02"],
  ["122343", "JP-12", "\u5357\u623F\u7DCF\u5E02"],
  ["122351", "JP-12", "\u531D\u7473\u5E02"],
  ["122360", "JP-12", "\u9999\u53D6\u5E02"],
  ["122378", "JP-12", "\u5C71\u6B66\u5E02"],
  ["122386", "JP-12", "\u3044\u3059\u307F\u5E02"],
  ["122394", "JP-12", "\u5927\u7DB2\u767D\u91CC\u5E02"],
  ["123226", "JP-12", "\u9152\u3005\u4E95\u753A"],
  ["123293", "JP-12", "\u6804\u753A"],
  ["123421", "JP-12", "\u795E\u5D0E\u753A"],
  ["123471", "JP-12", "\u591A\u53E4\u753A"],
  ["123498", "JP-12", "\u6771\u5E84\u753A"],
  ["124036", "JP-12", "\u4E5D\u5341\u4E5D\u91CC\u753A"],
  ["124095", "JP-12", "\u829D\u5C71\u753A"],
  ["124109", "JP-12", "\u6A2A\u829D\u5149\u753A"],
  ["124214", "JP-12", "\u4E00\u5BAE\u753A"],
  ["124222", "JP-12", "\u7766\u6CA2\u753A"],
  ["124231", "JP-12", "\u9577\u751F\u6751"],
  ["124249", "JP-12", "\u767D\u5B50\u753A"],
  ["124265", "JP-12", "\u9577\u67C4\u753A"],
  ["124273", "JP-12", "\u9577\u5357\u753A"],
  ["124419", "JP-12", "\u5927\u591A\u559C\u753A"],
  ["124435", "JP-12", "\u5FA1\u5BBF\u753A"],
  ["124630", "JP-12", "\u92F8\u5357\u753A"],
  ["131016", "JP-13", "\u5343\u4EE3\u7530\u533A"],
  ["131024", "JP-13", "\u4E2D\u592E\u533A"],
  ["131032", "JP-13", "\u6E2F\u533A"],
  ["131041", "JP-13", "\u65B0\u5BBF\u533A"],
  ["131059", "JP-13", "\u6587\u4EAC\u533A"],
  ["131067", "JP-13", "\u53F0\u6771\u533A"],
  ["131075", "JP-13", "\u58A8\u7530\u533A"],
  ["131083", "JP-13", "\u6C5F\u6771\u533A"],
  ["131091", "JP-13", "\u54C1\u5DDD\u533A"],
  ["131105", "JP-13", "\u76EE\u9ED2\u533A"],
  ["131113", "JP-13", "\u5927\u7530\u533A"],
  ["131121", "JP-13", "\u4E16\u7530\u8C37\u533A"],
  ["131130", "JP-13", "\u6E0B\u8C37\u533A"],
  ["131148", "JP-13", "\u4E2D\u91CE\u533A"],
  ["131156", "JP-13", "\u6749\u4E26\u533A"],
  ["131164", "JP-13", "\u8C4A\u5CF6\u533A"],
  ["131172", "JP-13", "\u5317\u533A"],
  ["131181", "JP-13", "\u8352\u5DDD\u533A"],
  ["131199", "JP-13", "\u677F\u6A4B\u533A"],
  ["131202", "JP-13", "\u7DF4\u99AC\u533A"],
  ["131211", "JP-13", "\u8DB3\u7ACB\u533A"],
  ["131229", "JP-13", "\u845B\u98FE\u533A"],
  ["131237", "JP-13", "\u6C5F\u6238\u5DDD\u533A"],
  ["132012", "JP-13", "\u516B\u738B\u5B50\u5E02"],
  ["132021", "JP-13", "\u7ACB\u5DDD\u5E02"],
  ["132039", "JP-13", "\u6B66\u8535\u91CE\u5E02"],
  ["132047", "JP-13", "\u4E09\u9DF9\u5E02"],
  ["132055", "JP-13", "\u9752\u6885\u5E02"],
  ["132063", "JP-13", "\u5E9C\u4E2D\u5E02"],
  ["132071", "JP-13", "\u662D\u5CF6\u5E02"],
  ["132080", "JP-13", "\u8ABF\u5E03\u5E02"],
  ["132098", "JP-13", "\u753A\u7530\u5E02"],
  ["132101", "JP-13", "\u5C0F\u91D1\u4E95\u5E02"],
  ["132110", "JP-13", "\u5C0F\u5E73\u5E02"],
  ["132128", "JP-13", "\u65E5\u91CE\u5E02"],
  ["132136", "JP-13", "\u6771\u6751\u5C71\u5E02"],
  ["132144", "JP-13", "\u56FD\u5206\u5BFA\u5E02"],
  ["132152", "JP-13", "\u56FD\u7ACB\u5E02"],
  ["132187", "JP-13", "\u798F\u751F\u5E02"],
  ["132195", "JP-13", "\u72DB\u6C5F\u5E02"],
  ["132209", "JP-13", "\u6771\u5927\u548C\u5E02"],
  ["132217", "JP-13", "\u6E05\u702C\u5E02"],
  ["132225", "JP-13", "\u6771\u4E45\u7559\u7C73\u5E02"],
  ["132233", "JP-13", "\u6B66\u8535\u6751\u5C71\u5E02"],
  ["132241", "JP-13", "\u591A\u6469\u5E02"],
  ["132250", "JP-13", "\u7A32\u57CE\u5E02"],
  ["132276", "JP-13", "\u7FBD\u6751\u5E02"],
  ["132284", "JP-13", "\u3042\u304D\u308B\u91CE\u5E02"],
  ["132292", "JP-13", "\u897F\u6771\u4EAC\u5E02"],
  ["133035", "JP-13", "\u745E\u7A42\u753A"],
  ["133051", "JP-13", "\u65E5\u306E\u51FA\u753A"],
  ["133078", "JP-13", "\u6A9C\u539F\u6751"],
  ["133086", "JP-13", "\u5965\u591A\u6469\u753A"],
  ["133612", "JP-13", "\u5927\u5CF6\u753A"],
  ["133621", "JP-13", "\u5229\u5CF6\u6751"],
  ["133639", "JP-13", "\u65B0\u5CF6\u6751"],
  ["133647", "JP-13", "\u795E\u6D25\u5CF6\u6751"],
  ["133817", "JP-13", "\u4E09\u5B85\u6751"],
  ["133825", "JP-13", "\u5FA1\u8535\u5CF6\u6751"],
  ["134015", "JP-13", "\u516B\u4E08\u753A"],
  ["134023", "JP-13", "\u9752\u30F6\u5CF6\u6751"],
  ["134210", "JP-13", "\u5C0F\u7B20\u539F\u6751"],
  ["141003", "JP-14", "\u6A2A\u6D5C\u5E02"],
  ["141011", "JP-14", "\u6A2A\u6D5C\u5E02\u9DB4\u898B\u533A"],
  ["141020", "JP-14", "\u6A2A\u6D5C\u5E02\u795E\u5948\u5DDD\u533A"],
  ["141038", "JP-14", "\u6A2A\u6D5C\u5E02\u897F\u533A"],
  ["141046", "JP-14", "\u6A2A\u6D5C\u5E02\u4E2D\u533A"],
  ["141054", "JP-14", "\u6A2A\u6D5C\u5E02\u5357\u533A"],
  ["141062", "JP-14", "\u6A2A\u6D5C\u5E02\u4FDD\u571F\u30B1\u8C37\u533A"],
  ["141071", "JP-14", "\u6A2A\u6D5C\u5E02\u78EF\u5B50\u533A"],
  ["141089", "JP-14", "\u6A2A\u6D5C\u5E02\u91D1\u6CA2\u533A"],
  ["141097", "JP-14", "\u6A2A\u6D5C\u5E02\u6E2F\u5317\u533A"],
  ["141101", "JP-14", "\u6A2A\u6D5C\u5E02\u6238\u585A\u533A"],
  ["141119", "JP-14", "\u6A2A\u6D5C\u5E02\u6E2F\u5357\u533A"],
  ["141127", "JP-14", "\u6A2A\u6D5C\u5E02\u65ED\u533A"],
  ["141135", "JP-14", "\u6A2A\u6D5C\u5E02\u7DD1\u533A"],
  ["141143", "JP-14", "\u6A2A\u6D5C\u5E02\u702C\u8C37\u533A"],
  ["141151", "JP-14", "\u6A2A\u6D5C\u5E02\u6804\u533A"],
  ["141160", "JP-14", "\u6A2A\u6D5C\u5E02\u6CC9\u533A"],
  ["141178", "JP-14", "\u6A2A\u6D5C\u5E02\u9752\u8449\u533A"],
  ["141186", "JP-14", "\u6A2A\u6D5C\u5E02\u90FD\u7B51\u533A"],
  ["141305", "JP-14", "\u5DDD\u5D0E\u5E02"],
  ["141313", "JP-14", "\u5DDD\u5D0E\u5E02\u5DDD\u5D0E\u533A"],
  ["141321", "JP-14", "\u5DDD\u5D0E\u5E02\u5E78\u533A"],
  ["141330", "JP-14", "\u5DDD\u5D0E\u5E02\u4E2D\u539F\u533A"],
  ["141348", "JP-14", "\u5DDD\u5D0E\u5E02\u9AD8\u6D25\u533A"],
  ["141356", "JP-14", "\u5DDD\u5D0E\u5E02\u591A\u6469\u533A"],
  ["141364", "JP-14", "\u5DDD\u5D0E\u5E02\u5BAE\u524D\u533A"],
  ["141372", "JP-14", "\u5DDD\u5D0E\u5E02\u9EBB\u751F\u533A"],
  ["141500", "JP-14", "\u76F8\u6A21\u539F\u5E02"],
  ["141518", "JP-14", "\u76F8\u6A21\u539F\u5E02\u7DD1\u533A"],
  ["141526", "JP-14", "\u76F8\u6A21\u539F\u5E02\u4E2D\u592E\u533A"],
  ["141534", "JP-14", "\u76F8\u6A21\u539F\u5E02\u5357\u533A"],
  ["142018", "JP-14", "\u6A2A\u9808\u8CC0\u5E02"],
  ["142034", "JP-14", "\u5E73\u585A\u5E02"],
  ["142042", "JP-14", "\u938C\u5009\u5E02"],
  ["142051", "JP-14", "\u85E4\u6CA2\u5E02"],
  ["142069", "JP-14", "\u5C0F\u7530\u539F\u5E02"],
  ["142077", "JP-14", "\u8305\u30F6\u5D0E\u5E02"],
  ["142085", "JP-14", "\u9017\u5B50\u5E02"],
  ["142107", "JP-14", "\u4E09\u6D66\u5E02"],
  ["142115", "JP-14", "\u79E6\u91CE\u5E02"],
  ["142123", "JP-14", "\u539A\u6728\u5E02"],
  ["142131", "JP-14", "\u5927\u548C\u5E02"],
  ["142140", "JP-14", "\u4F0A\u52E2\u539F\u5E02"],
  ["142158", "JP-14", "\u6D77\u8001\u540D\u5E02"],
  ["142166", "JP-14", "\u5EA7\u9593\u5E02"],
  ["142174", "JP-14", "\u5357\u8DB3\u67C4\u5E02"],
  ["142182", "JP-14", "\u7DBE\u702C\u5E02"],
  ["143014", "JP-14", "\u8449\u5C71\u753A"],
  ["143219", "JP-14", "\u5BD2\u5DDD\u753A"],
  ["143413", "JP-14", "\u5927\u78EF\u753A"],
  ["143421", "JP-14", "\u4E8C\u5BAE\u753A"],
  ["143618", "JP-14", "\u4E2D\u4E95\u753A"],
  ["143626", "JP-14", "\u5927\u4E95\u753A"],
  ["143634", "JP-14", "\u677E\u7530\u753A"],
  ["143642", "JP-14", "\u5C71\u5317\u753A"],
  ["143669", "JP-14", "\u958B\u6210\u753A"],
  ["143821", "JP-14", "\u7BB1\u6839\u753A"],
  ["143839", "JP-14", "\u771F\u9DB4\u753A"],
  ["143847", "JP-14", "\u6E6F\u6CB3\u539F\u753A"],
  ["144011", "JP-14", "\u611B\u5DDD\u753A"],
  ["144029", "JP-14", "\u6E05\u5DDD\u6751"],
  ["151009", "JP-15", "\u65B0\u6F5F\u5E02"],
  ["151017", "JP-15", "\u65B0\u6F5F\u5E02\u5317\u533A"],
  ["151025", "JP-15", "\u65B0\u6F5F\u5E02\u6771\u533A"],
  ["151033", "JP-15", "\u65B0\u6F5F\u5E02\u4E2D\u592E\u533A"],
  ["151041", "JP-15", "\u65B0\u6F5F\u5E02\u6C5F\u5357\u533A"],
  ["151050", "JP-15", "\u65B0\u6F5F\u5E02\u79CB\u8449\u533A"],
  ["151068", "JP-15", "\u65B0\u6F5F\u5E02\u5357\u533A"],
  ["151076", "JP-15", "\u65B0\u6F5F\u5E02\u897F\u533A"],
  ["151084", "JP-15", "\u65B0\u6F5F\u5E02\u897F\u84B2\u533A"],
  ["152021", "JP-15", "\u9577\u5CA1\u5E02"],
  ["152048", "JP-15", "\u4E09\u6761\u5E02"],
  ["152056", "JP-15", "\u67CF\u5D0E\u5E02"],
  ["152064", "JP-15", "\u65B0\u767A\u7530\u5E02"],
  ["152081", "JP-15", "\u5C0F\u5343\u8C37\u5E02"],
  ["152099", "JP-15", "\u52A0\u8302\u5E02"],
  ["152102", "JP-15", "\u5341\u65E5\u753A\u5E02"],
  ["152111", "JP-15", "\u898B\u9644\u5E02"],
  ["152129", "JP-15", "\u6751\u4E0A\u5E02"],
  ["152137", "JP-15", "\u71D5\u5E02"],
  ["152161", "JP-15", "\u7CF8\u9B5A\u5DDD\u5E02"],
  ["152170", "JP-15", "\u5999\u9AD8\u5E02"],
  ["152188", "JP-15", "\u4E94\u6CC9\u5E02"],
  ["152226", "JP-15", "\u4E0A\u8D8A\u5E02"],
  ["152234", "JP-15", "\u963F\u8CC0\u91CE\u5E02"],
  ["152242", "JP-15", "\u4F50\u6E21\u5E02"],
  ["152251", "JP-15", "\u9B5A\u6CBC\u5E02"],
  ["152269", "JP-15", "\u5357\u9B5A\u6CBC\u5E02"],
  ["152277", "JP-15", "\u80CE\u5185\u5E02"],
  ["153079", "JP-15", "\u8056\u7C60\u753A"],
  ["153427", "JP-15", "\u5F25\u5F66\u6751"],
  ["153613", "JP-15", "\u7530\u4E0A\u753A"],
  ["153851", "JP-15", "\u963F\u8CC0\u753A"],
  ["154059", "JP-15", "\u51FA\u96F2\u5D0E\u753A"],
  ["154610", "JP-15", "\u6E6F\u6CA2\u753A"],
  ["154822", "JP-15", "\u6D25\u5357\u753A"],
  ["155047", "JP-15", "\u5208\u7FBD\u6751"],
  ["155811", "JP-15", "\u95A2\u5DDD\u6751"],
  ["155861", "JP-15", "\u7C9F\u5CF6\u6D66\u6751"],
  ["162019", "JP-16", "\u5BCC\u5C71\u5E02"],
  ["162027", "JP-16", "\u9AD8\u5CA1\u5E02"],
  ["162043", "JP-16", "\u9B5A\u6D25\u5E02"],
  ["162051", "JP-16", "\u6C37\u898B\u5E02"],
  ["162060", "JP-16", "\u6ED1\u5DDD\u5E02"],
  ["162078", "JP-16", "\u9ED2\u90E8\u5E02"],
  ["162086", "JP-16", "\u783A\u6CE2\u5E02"],
  ["162094", "JP-16", "\u5C0F\u77E2\u90E8\u5E02"],
  ["162108", "JP-16", "\u5357\u783A\u5E02"],
  ["162116", "JP-16", "\u5C04\u6C34\u5E02"],
  ["163210", "JP-16", "\u821F\u6A4B\u6751"],
  ["163228", "JP-16", "\u4E0A\u5E02\u753A"],
  ["163236", "JP-16", "\u7ACB\u5C71\u753A"],
  ["163422", "JP-16", "\u5165\u5584\u753A"],
  ["163431", "JP-16", "\u671D\u65E5\u753A"],
  ["172014", "JP-17", "\u91D1\u6CA2\u5E02"],
  ["172022", "JP-17", "\u4E03\u5C3E\u5E02"],
  ["172031", "JP-17", "\u5C0F\u677E\u5E02"],
  ["172049", "JP-17", "\u8F2A\u5CF6\u5E02"],
  ["172057", "JP-17", "\u73E0\u6D32\u5E02"],
  ["172065", "JP-17", "\u52A0\u8CC0\u5E02"],
  ["172073", "JP-17", "\u7FBD\u548B\u5E02"],
  ["172090", "JP-17", "\u304B\u307B\u304F\u5E02"],
  ["172103", "JP-17", "\u767D\u5C71\u5E02"],
  ["172111", "JP-17", "\u80FD\u7F8E\u5E02"],
  ["172120", "JP-17", "\u91CE\u3005\u5E02\u5E02"],
  ["173240", "JP-17", "\u5DDD\u5317\u753A"],
  ["173614", "JP-17", "\u6D25\u5E61\u753A"],
  ["173657", "JP-17", "\u5185\u7058\u753A"],
  ["173843", "JP-17", "\u5FD7\u8CC0\u753A"],
  ["173860", "JP-17", "\u5B9D\u9054\u5FD7\u6C34\u753A"],
  ["174076", "JP-17", "\u4E2D\u80FD\u767B\u753A"],
  ["174611", "JP-17", "\u7A74\u6C34\u753A"],
  ["174637", "JP-17", "\u80FD\u767B\u753A"],
  ["182010", "JP-18", "\u798F\u4E95\u5E02"],
  ["182028", "JP-18", "\u6566\u8CC0\u5E02"],
  ["182044", "JP-18", "\u5C0F\u6D5C\u5E02"],
  ["182052", "JP-18", "\u5927\u91CE\u5E02"],
  ["182061", "JP-18", "\u52DD\u5C71\u5E02"],
  ["182079", "JP-18", "\u9BD6\u6C5F\u5E02"],
  ["182087", "JP-18", "\u3042\u308F\u3089\u5E02"],
  ["182095", "JP-18", "\u8D8A\u524D\u5E02"],
  ["182109", "JP-18", "\u5742\u4E95\u5E02"],
  ["183229", "JP-18", "\u6C38\u5E73\u5BFA\u753A"],
  ["183822", "JP-18", "\u6C60\u7530\u753A"],
  ["184047", "JP-18", "\u5357\u8D8A\u524D\u753A"],
  ["184233", "JP-18", "\u8D8A\u524D\u753A"],
  ["184420", "JP-18", "\u7F8E\u6D5C\u753A"],
  ["184811", "JP-18", "\u9AD8\u6D5C\u753A"],
  ["184837", "JP-18", "\u304A\u304A\u3044\u753A"],
  ["185019", "JP-18", "\u82E5\u72ED\u753A"],
  ["192015", "JP-19", "\u7532\u5E9C\u5E02"],
  ["192023", "JP-19", "\u5BCC\u58EB\u5409\u7530\u5E02"],
  ["192040", "JP-19", "\u90FD\u7559\u5E02"],
  ["192058", "JP-19", "\u5C71\u68A8\u5E02"],
  ["192066", "JP-19", "\u5927\u6708\u5E02"],
  ["192074", "JP-19", "\u97EE\u5D0E\u5E02"],
  ["192082", "JP-19", "\u5357\u30A2\u30EB\u30D7\u30B9\u5E02"],
  ["192091", "JP-19", "\u5317\u675C\u5E02"],
  ["192104", "JP-19", "\u7532\u6590\u5E02"],
  ["192112", "JP-19", "\u7B1B\u5439\u5E02"],
  ["192121", "JP-19", "\u4E0A\u91CE\u539F\u5E02"],
  ["192139", "JP-19", "\u7532\u5DDE\u5E02"],
  ["192147", "JP-19", "\u4E2D\u592E\u5E02"],
  ["193461", "JP-19", "\u5E02\u5DDD\u4E09\u90F7\u753A"],
  ["193640", "JP-19", "\u65E9\u5DDD\u753A"],
  ["193658", "JP-19", "\u8EAB\u5EF6\u753A"],
  ["193666", "JP-19", "\u5357\u90E8\u753A"],
  ["193682", "JP-19", "\u5BCC\u58EB\u5DDD\u753A"],
  ["193844", "JP-19", "\u662D\u548C\u753A"],
  ["194221", "JP-19", "\u9053\u5FD7\u6751"],
  ["194239", "JP-19", "\u897F\u6842\u753A"],
  ["194247", "JP-19", "\u5FCD\u91CE\u6751"],
  ["194255", "JP-19", "\u5C71\u4E2D\u6E56\u6751"],
  ["194298", "JP-19", "\u9CF4\u6CA2\u6751"],
  ["194301", "JP-19", "\u5BCC\u58EB\u6CB3\u53E3\u6E56\u753A"],
  ["194425", "JP-19", "\u5C0F\u83C5\u6751"],
  ["194433", "JP-19", "\u4E39\u6CE2\u5C71\u6751"],
  ["202011", "JP-20", "\u9577\u91CE\u5E02"],
  ["202029", "JP-20", "\u677E\u672C\u5E02"],
  ["202037", "JP-20", "\u4E0A\u7530\u5E02"],
  ["202045", "JP-20", "\u5CA1\u8C37\u5E02"],
  ["202053", "JP-20", "\u98EF\u7530\u5E02"],
  ["202061", "JP-20", "\u8ACF\u8A2A\u5E02"],
  ["202070", "JP-20", "\u9808\u5742\u5E02"],
  ["202088", "JP-20", "\u5C0F\u8AF8\u5E02"],
  ["202096", "JP-20", "\u4F0A\u90A3\u5E02"],
  ["202100", "JP-20", "\u99D2\u30F6\u6839\u5E02"],
  ["202118", "JP-20", "\u4E2D\u91CE\u5E02"],
  ["202126", "JP-20", "\u5927\u753A\u5E02"],
  ["202134", "JP-20", "\u98EF\u5C71\u5E02"],
  ["202142", "JP-20", "\u8305\u91CE\u5E02"],
  ["202151", "JP-20", "\u5869\u5C3B\u5E02"],
  ["202177", "JP-20", "\u4F50\u4E45\u5E02"],
  ["202185", "JP-20", "\u5343\u66F2\u5E02"],
  ["202193", "JP-20", "\u6771\u5FA1\u5E02"],
  ["202207", "JP-20", "\u5B89\u66C7\u91CE\u5E02"],
  ["203033", "JP-20", "\u5C0F\u6D77\u753A"],
  ["203041", "JP-20", "\u5DDD\u4E0A\u6751"],
  ["203050", "JP-20", "\u5357\u7267\u6751"],
  ["203068", "JP-20", "\u5357\u76F8\u6728\u6751"],
  ["203076", "JP-20", "\u5317\u76F8\u6728\u6751"],
  ["203092", "JP-20", "\u4F50\u4E45\u7A42\u753A"],
  ["203211", "JP-20", "\u8EFD\u4E95\u6CA2\u753A"],
  ["203238", "JP-20", "\u5FA1\u4EE3\u7530\u753A"],
  ["203246", "JP-20", "\u7ACB\u79D1\u753A"],
  ["203491", "JP-20", "\u9752\u6728\u6751"],
  ["203505", "JP-20", "\u9577\u548C\u753A"],
  ["203611", "JP-20", "\u4E0B\u8ACF\u8A2A\u753A"],
  ["203629", "JP-20", "\u5BCC\u58EB\u898B\u753A"],
  ["203637", "JP-20", "\u539F\u6751"],
  ["203823", "JP-20", "\u8FB0\u91CE\u753A"],
  ["203831", "JP-20", "\u7B95\u8F2A\u753A"],
  ["203840", "JP-20", "\u98EF\u5CF6\u753A"],
  ["203858", "JP-20", "\u5357\u7B95\u8F2A\u6751"],
  ["203866", "JP-20", "\u4E2D\u5DDD\u6751"],
  ["203882", "JP-20", "\u5BAE\u7530\u6751"],
  ["204021", "JP-20", "\u677E\u5DDD\u753A"],
  ["204030", "JP-20", "\u9AD8\u68EE\u753A"],
  ["204048", "JP-20", "\u963F\u5357\u753A"],
  ["204072", "JP-20", "\u963F\u667A\u6751"],
  ["204099", "JP-20", "\u5E73\u8C37\u6751"],
  ["204102", "JP-20", "\u6839\u7FBD\u6751"],
  ["204111", "JP-20", "\u4E0B\u689D\u6751"],
  ["204129", "JP-20", "\u58F2\u6728\u6751"],
  ["204137", "JP-20", "\u5929\u9F8D\u6751"],
  ["204145", "JP-20", "\u6CF0\u961C\u6751"],
  ["204153", "JP-20", "\u55AC\u6728\u6751"],
  ["204161", "JP-20", "\u8C4A\u4E18\u6751"],
  ["204170", "JP-20", "\u5927\u9E7F\u6751"],
  ["204226", "JP-20", "\u4E0A\u677E\u753A"],
  ["204234", "JP-20", "\u5357\u6728\u66FD\u753A"],
  ["204251", "JP-20", "\u6728\u7956\u6751"],
  ["204293", "JP-20", "\u738B\u6EDD\u6751"],
  ["204307", "JP-20", "\u5927\u6851\u6751"],
  ["204323", "JP-20", "\u6728\u66FD\u753A"],
  ["204463", "JP-20", "\u9EBB\u7E3E\u6751"],
  ["204480", "JP-20", "\u751F\u5742\u6751"],
  ["204501", "JP-20", "\u5C71\u5F62\u6751"],
  ["204510", "JP-20", "\u671D\u65E5\u6751"],
  ["204528", "JP-20", "\u7B51\u5317\u6751"],
  ["204811", "JP-20", "\u6C60\u7530\u753A"],
  ["204820", "JP-20", "\u677E\u5DDD\u6751"],
  ["204854", "JP-20", "\u767D\u99AC\u6751"],
  ["204862", "JP-20", "\u5C0F\u8C37\u6751"],
  ["205214", "JP-20", "\u5742\u57CE\u753A"],
  ["205419", "JP-20", "\u5C0F\u5E03\u65BD\u753A"],
  ["205435", "JP-20", "\u9AD8\u5C71\u6751"],
  ["205613", "JP-20", "\u5C71\u30CE\u5185\u753A"],
  ["205621", "JP-20", "\u6728\u5CF6\u5E73\u6751"],
  ["205630", "JP-20", "\u91CE\u6CA2\u6E29\u6CC9\u6751"],
  ["205834", "JP-20", "\u4FE1\u6FC3\u753A"],
  ["205885", "JP-20", "\u5C0F\u5DDD\u6751"],
  ["205907", "JP-20", "\u98EF\u7DB1\u753A"],
  ["206024", "JP-20", "\u6804\u6751"],
  ["212016", "JP-21", "\u5C90\u961C\u5E02"],
  ["212024", "JP-21", "\u5927\u57A3\u5E02"],
  ["212032", "JP-21", "\u9AD8\u5C71\u5E02"],
  ["212041", "JP-21", "\u591A\u6CBB\u898B\u5E02"],
  ["212059", "JP-21", "\u95A2\u5E02"],
  ["212067", "JP-21", "\u4E2D\u6D25\u5DDD\u5E02"],
  ["212075", "JP-21", "\u7F8E\u6FC3\u5E02"],
  ["212083", "JP-21", "\u745E\u6D6A\u5E02"],
  ["212091", "JP-21", "\u7FBD\u5CF6\u5E02"],
  ["212105", "JP-21", "\u6075\u90A3\u5E02"],
  ["212113", "JP-21", "\u7F8E\u6FC3\u52A0\u8302\u5E02"],
  ["212121", "JP-21", "\u571F\u5C90\u5E02"],
  ["212130", "JP-21", "\u5404\u52D9\u539F\u5E02"],
  ["212148", "JP-21", "\u53EF\u5150\u5E02"],
  ["212156", "JP-21", "\u5C71\u770C\u5E02"],
  ["212164", "JP-21", "\u745E\u7A42\u5E02"],
  ["212172", "JP-21", "\u98DB\u9A28\u5E02"],
  ["212181", "JP-21", "\u672C\u5DE3\u5E02"],
  ["212199", "JP-21", "\u90E1\u4E0A\u5E02"],
  ["212202", "JP-21", "\u4E0B\u5442\u5E02"],
  ["212211", "JP-21", "\u6D77\u6D25\u5E02"],
  ["213021", "JP-21", "\u5C90\u5357\u753A"],
  ["213039", "JP-21", "\u7B20\u677E\u753A"],
  ["213411", "JP-21", "\u990A\u8001\u753A"],
  ["213616", "JP-21", "\u5782\u4E95\u753A"],
  ["213624", "JP-21", "\u95A2\u30B1\u539F\u753A"],
  ["213811", "JP-21", "\u795E\u6238\u753A"],
  ["213829", "JP-21", "\u8F2A\u4E4B\u5185\u753A"],
  ["213837", "JP-21", "\u5B89\u516B\u753A"],
  ["214019", "JP-21", "\u63D6\u6590\u5DDD\u753A"],
  ["214035", "JP-21", "\u5927\u91CE\u753A"],
  ["214043", "JP-21", "\u6C60\u7530\u753A"],
  ["214213", "JP-21", "\u5317\u65B9\u753A"],
  ["215015", "JP-21", "\u5742\u795D\u753A"],
  ["215023", "JP-21", "\u5BCC\u52A0\u753A"],
  ["215031", "JP-21", "\u5DDD\u8FBA\u753A"],
  ["215040", "JP-21", "\u4E03\u5B97\u753A"],
  ["215058", "JP-21", "\u516B\u767E\u6D25\u753A"],
  ["215066", "JP-21", "\u767D\u5DDD\u753A"],
  ["215074", "JP-21", "\u6771\u767D\u5DDD\u6751"],
  ["215210", "JP-21", "\u5FA1\u5D69\u753A"],
  ["216046", "JP-21", "\u767D\u5DDD\u6751"],
  ["221007", "JP-22", "\u9759\u5CA1\u5E02"],
  ["221015", "JP-22", "\u9759\u5CA1\u5E02\u8475\u533A"],
  ["221023", "JP-22", "\u9759\u5CA1\u5E02\u99FF\u6CB3\u533A"],
  ["221031", "JP-22", "\u9759\u5CA1\u5E02\u6E05\u6C34\u533A"],
  ["221309", "JP-22", "\u6D5C\u677E\u5E02"],
  ["221384", "JP-22", "\u6D5C\u677E\u5E02\u4E2D\u592E\u533A"],
  ["221392", "JP-22", "\u6D5C\u677E\u5E02\u6D5C\u540D\u533A"],
  ["221406", "JP-22", "\u6D5C\u677E\u5E02\u5929\u7ADC\u533A"],
  ["222038", "JP-22", "\u6CBC\u6D25\u5E02"],
  ["222054", "JP-22", "\u71B1\u6D77\u5E02"],
  ["222062", "JP-22", "\u4E09\u5CF6\u5E02"],
  ["222071", "JP-22", "\u5BCC\u58EB\u5BAE\u5E02"],
  ["222089", "JP-22", "\u4F0A\u6771\u5E02"],
  ["222097", "JP-22", "\u5CF6\u7530\u5E02"],
  ["222101", "JP-22", "\u5BCC\u58EB\u5E02"],
  ["222119", "JP-22", "\u78D0\u7530\u5E02"],
  ["222127", "JP-22", "\u713C\u6D25\u5E02"],
  ["222135", "JP-22", "\u639B\u5DDD\u5E02"],
  ["222143", "JP-22", "\u85E4\u679D\u5E02"],
  ["222151", "JP-22", "\u5FA1\u6BBF\u5834\u5E02"],
  ["222160", "JP-22", "\u888B\u4E95\u5E02"],
  ["222194", "JP-22", "\u4E0B\u7530\u5E02"],
  ["222208", "JP-22", "\u88FE\u91CE\u5E02"],
  ["222216", "JP-22", "\u6E56\u897F\u5E02"],
  ["222224", "JP-22", "\u4F0A\u8C46\u5E02"],
  ["222232", "JP-22", "\u5FA1\u524D\u5D0E\u5E02"],
  ["222241", "JP-22", "\u83CA\u5DDD\u5E02"],
  ["222259", "JP-22", "\u4F0A\u8C46\u306E\u56FD\u5E02"],
  ["222267", "JP-22", "\u7267\u4E4B\u539F\u5E02"],
  ["223018", "JP-22", "\u6771\u4F0A\u8C46\u753A"],
  ["223026", "JP-22", "\u6CB3\u6D25\u753A"],
  ["223042", "JP-22", "\u5357\u4F0A\u8C46\u753A"],
  ["223051", "JP-22", "\u677E\u5D0E\u753A"],
  ["223069", "JP-22", "\u897F\u4F0A\u8C46\u753A"],
  ["223255", "JP-22", "\u51FD\u5357\u753A"],
  ["223417", "JP-22", "\u6E05\u6C34\u753A"],
  ["223425", "JP-22", "\u9577\u6CC9\u753A"],
  ["223441", "JP-22", "\u5C0F\u5C71\u753A"],
  ["224243", "JP-22", "\u5409\u7530\u753A"],
  ["224294", "JP-22", "\u5DDD\u6839\u672C\u753A"],
  ["224618", "JP-22", "\u68EE\u753A"],
  ["231002", "JP-23", "\u540D\u53E4\u5C4B\u5E02"],
  ["231011", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u5343\u7A2E\u533A"],
  ["231029", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u6771\u533A"],
  ["231037", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u5317\u533A"],
  ["231045", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u897F\u533A"],
  ["231053", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u4E2D\u6751\u533A"],
  ["231061", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u4E2D\u533A"],
  ["231070", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u662D\u548C\u533A"],
  ["231088", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u745E\u7A42\u533A"],
  ["231096", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u71B1\u7530\u533A"],
  ["231100", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u4E2D\u5DDD\u533A"],
  ["231118", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u6E2F\u533A"],
  ["231126", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u5357\u533A"],
  ["231134", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u5B88\u5C71\u533A"],
  ["231142", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u7DD1\u533A"],
  ["231151", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u540D\u6771\u533A"],
  ["231169", "JP-23", "\u540D\u53E4\u5C4B\u5E02\u5929\u767D\u533A"],
  ["232017", "JP-23", "\u8C4A\u6A4B\u5E02"],
  ["232025", "JP-23", "\u5CA1\u5D0E\u5E02"],
  ["232033", "JP-23", "\u4E00\u5BAE\u5E02"],
  ["232041", "JP-23", "\u702C\u6238\u5E02"],
  ["232050", "JP-23", "\u534A\u7530\u5E02"],
  ["232068", "JP-23", "\u6625\u65E5\u4E95\u5E02"],
  ["232076", "JP-23", "\u8C4A\u5DDD\u5E02"],
  ["232084", "JP-23", "\u6D25\u5CF6\u5E02"],
  ["232092", "JP-23", "\u78A7\u5357\u5E02"],
  ["232106", "JP-23", "\u5208\u8C37\u5E02"],
  ["232114", "JP-23", "\u8C4A\u7530\u5E02"],
  ["232122", "JP-23", "\u5B89\u57CE\u5E02"],
  ["232131", "JP-23", "\u897F\u5C3E\u5E02"],
  ["232149", "JP-23", "\u84B2\u90E1\u5E02"],
  ["232157", "JP-23", "\u72AC\u5C71\u5E02"],
  ["232165", "JP-23", "\u5E38\u6ED1\u5E02"],
  ["232173", "JP-23", "\u6C5F\u5357\u5E02"],
  ["232190", "JP-23", "\u5C0F\u7267\u5E02"],
  ["232203", "JP-23", "\u7A32\u6CA2\u5E02"],
  ["232211", "JP-23", "\u65B0\u57CE\u5E02"],
  ["232220", "JP-23", "\u6771\u6D77\u5E02"],
  ["232238", "JP-23", "\u5927\u5E9C\u5E02"],
  ["232246", "JP-23", "\u77E5\u591A\u5E02"],
  ["232254", "JP-23", "\u77E5\u7ACB\u5E02"],
  ["232262", "JP-23", "\u5C3E\u5F35\u65ED\u5E02"],
  ["232271", "JP-23", "\u9AD8\u6D5C\u5E02"],
  ["232289", "JP-23", "\u5CA9\u5009\u5E02"],
  ["232297", "JP-23", "\u8C4A\u660E\u5E02"],
  ["232301", "JP-23", "\u65E5\u9032\u5E02"],
  ["232319", "JP-23", "\u7530\u539F\u5E02"],
  ["232327", "JP-23", "\u611B\u897F\u5E02"],
  ["232335", "JP-23", "\u6E05\u9808\u5E02"],
  ["232343", "JP-23", "\u5317\u540D\u53E4\u5C4B\u5E02"],
  ["232351", "JP-23", "\u5F25\u5BCC\u5E02"],
  ["232360", "JP-23", "\u307F\u3088\u3057\u5E02"],
  ["232378", "JP-23", "\u3042\u307E\u5E02"],
  ["232386", "JP-23", "\u9577\u4E45\u624B\u5E02"],
  ["233021", "JP-23", "\u6771\u90F7\u753A"],
  ["233421", "JP-23", "\u8C4A\u5C71\u753A"],
  ["233617", "JP-23", "\u5927\u53E3\u753A"],
  ["233625", "JP-23", "\u6276\u6851\u753A"],
  ["234249", "JP-23", "\u5927\u6CBB\u753A"],
  ["234257", "JP-23", "\u87F9\u6C5F\u753A"],
  ["234273", "JP-23", "\u98DB\u5CF6\u6751"],
  ["234419", "JP-23", "\u963F\u4E45\u6BD4\u753A"],
  ["234427", "JP-23", "\u6771\u6D66\u753A"],
  ["234451", "JP-23", "\u5357\u77E5\u591A\u753A"],
  ["234460", "JP-23", "\u7F8E\u6D5C\u753A"],
  ["234478", "JP-23", "\u6B66\u8C4A\u753A"],
  ["235016", "JP-23", "\u5E78\u7530\u753A"],
  ["235610", "JP-23", "\u8A2D\u697D\u753A"],
  ["235628", "JP-23", "\u6771\u6804\u753A"],
  ["235636", "JP-23", "\u8C4A\u6839\u6751"],
  ["242012", "JP-24", "\u6D25\u5E02"],
  ["242021", "JP-24", "\u56DB\u65E5\u5E02\u5E02"],
  ["242039", "JP-24", "\u4F0A\u52E2\u5E02"],
  ["242047", "JP-24", "\u677E\u962A\u5E02"],
  ["242055", "JP-24", "\u6851\u540D\u5E02"],
  ["242071", "JP-24", "\u9234\u9E7F\u5E02"],
  ["242080", "JP-24", "\u540D\u5F35\u5E02"],
  ["242098", "JP-24", "\u5C3E\u9DF2\u5E02"],
  ["242101", "JP-24", "\u4E80\u5C71\u5E02"],
  ["242110", "JP-24", "\u9CE5\u7FBD\u5E02"],
  ["242128", "JP-24", "\u718A\u91CE\u5E02"],
  ["242144", "JP-24", "\u3044\u306A\u3079\u5E02"],
  ["242152", "JP-24", "\u5FD7\u6469\u5E02"],
  ["242161", "JP-24", "\u4F0A\u8CC0\u5E02"],
  ["243035", "JP-24", "\u6728\u66FD\u5CAC\u753A"],
  ["243248", "JP-24", "\u6771\u54E1\u753A"],
  ["243418", "JP-24", "\u83F0\u91CE\u753A"],
  ["243434", "JP-24", "\u671D\u65E5\u753A"],
  ["243442", "JP-24", "\u5DDD\u8D8A\u753A"],
  ["244414", "JP-24", "\u591A\u6C17\u753A"],
  ["244422", "JP-24", "\u660E\u548C\u753A"],
  ["244431", "JP-24", "\u5927\u53F0\u753A"],
  ["244619", "JP-24", "\u7389\u57CE\u753A"],
  ["244708", "JP-24", "\u5EA6\u4F1A\u753A"],
  ["244716", "JP-24", "\u5927\u7D00\u753A"],
  ["244724", "JP-24", "\u5357\u4F0A\u52E2\u753A"],
  ["245437", "JP-24", "\u7D00\u5317\u753A"],
  ["245615", "JP-24", "\u5FA1\u6D5C\u753A"],
  ["245623", "JP-24", "\u7D00\u5B9D\u753A"],
  ["252018", "JP-25", "\u5927\u6D25\u5E02"],
  ["252026", "JP-25", "\u5F66\u6839\u5E02"],
  ["252034", "JP-25", "\u9577\u6D5C\u5E02"],
  ["252042", "JP-25", "\u8FD1\u6C5F\u516B\u5E61\u5E02"],
  ["252069", "JP-25", "\u8349\u6D25\u5E02"],
  ["252077", "JP-25", "\u5B88\u5C71\u5E02"],
  ["252085", "JP-25", "\u6817\u6771\u5E02"],
  ["252093", "JP-25", "\u7532\u8CC0\u5E02"],
  ["252107", "JP-25", "\u91CE\u6D32\u5E02"],
  ["252115", "JP-25", "\u6E56\u5357\u5E02"],
  ["252123", "JP-25", "\u9AD8\u5CF6\u5E02"],
  ["252131", "JP-25", "\u6771\u8FD1\u6C5F\u5E02"],
  ["252140", "JP-25", "\u7C73\u539F\u5E02"],
  ["253839", "JP-25", "\u65E5\u91CE\u753A"],
  ["253847", "JP-25", "\u7ADC\u738B\u753A"],
  ["254258", "JP-25", "\u611B\u8358\u753A"],
  ["254410", "JP-25", "\u8C4A\u90F7\u753A"],
  ["254428", "JP-25", "\u7532\u826F\u753A"],
  ["254436", "JP-25", "\u591A\u8CC0\u753A"],
  ["261009", "JP-26", "\u4EAC\u90FD\u5E02"],
  ["261017", "JP-26", "\u4EAC\u90FD\u5E02\u5317\u533A"],
  ["261025", "JP-26", "\u4EAC\u90FD\u5E02\u4E0A\u4EAC\u533A"],
  ["261033", "JP-26", "\u4EAC\u90FD\u5E02\u5DE6\u4EAC\u533A"],
  ["261041", "JP-26", "\u4EAC\u90FD\u5E02\u4E2D\u4EAC\u533A"],
  ["261050", "JP-26", "\u4EAC\u90FD\u5E02\u6771\u5C71\u533A"],
  ["261068", "JP-26", "\u4EAC\u90FD\u5E02\u4E0B\u4EAC\u533A"],
  ["261076", "JP-26", "\u4EAC\u90FD\u5E02\u5357\u533A"],
  ["261084", "JP-26", "\u4EAC\u90FD\u5E02\u53F3\u4EAC\u533A"],
  ["261092", "JP-26", "\u4EAC\u90FD\u5E02\u4F0F\u898B\u533A"],
  ["261106", "JP-26", "\u4EAC\u90FD\u5E02\u5C71\u79D1\u533A"],
  ["261114", "JP-26", "\u4EAC\u90FD\u5E02\u897F\u4EAC\u533A"],
  ["262013", "JP-26", "\u798F\u77E5\u5C71\u5E02"],
  ["262021", "JP-26", "\u821E\u9DB4\u5E02"],
  ["262030", "JP-26", "\u7DBE\u90E8\u5E02"],
  ["262048", "JP-26", "\u5B87\u6CBB\u5E02"],
  ["262056", "JP-26", "\u5BAE\u6D25\u5E02"],
  ["262064", "JP-26", "\u4E80\u5CA1\u5E02"],
  ["262072", "JP-26", "\u57CE\u967D\u5E02"],
  ["262081", "JP-26", "\u5411\u65E5\u5E02"],
  ["262099", "JP-26", "\u9577\u5CA1\u4EAC\u5E02"],
  ["262102", "JP-26", "\u516B\u5E61\u5E02"],
  ["262111", "JP-26", "\u4EAC\u7530\u8FBA\u5E02"],
  ["262129", "JP-26", "\u4EAC\u4E39\u5F8C\u5E02"],
  ["262137", "JP-26", "\u5357\u4E39\u5E02"],
  ["262145", "JP-26", "\u6728\u6D25\u5DDD\u5E02"],
  ["263036", "JP-26", "\u5927\u5C71\u5D0E\u753A"],
  ["263222", "JP-26", "\u4E45\u5FA1\u5C71\u753A"],
  ["263435", "JP-26", "\u4E95\u624B\u753A"],
  ["263443", "JP-26", "\u5B87\u6CBB\u7530\u539F\u753A"],
  ["263648", "JP-26", "\u7B20\u7F6E\u753A"],
  ["263656", "JP-26", "\u548C\u675F\u753A"],
  ["263664", "JP-26", "\u7CBE\u83EF\u753A"],
  ["263672", "JP-26", "\u5357\u5C71\u57CE\u6751"],
  ["264075", "JP-26", "\u4EAC\u4E39\u6CE2\u753A"],
  ["264636", "JP-26", "\u4F0A\u6839\u753A"],
  ["264652", "JP-26", "\u4E0E\u8B1D\u91CE\u753A"],
  ["271004", "JP-27", "\u5927\u962A\u5E02"],
  ["271021", "JP-27", "\u5927\u962A\u5E02\u90FD\u5CF6\u533A"],
  ["271039", "JP-27", "\u5927\u962A\u5E02\u798F\u5CF6\u533A"],
  ["271047", "JP-27", "\u5927\u962A\u5E02\u6B64\u82B1\u533A"],
  ["271063", "JP-27", "\u5927\u962A\u5E02\u897F\u533A"],
  ["271071", "JP-27", "\u5927\u962A\u5E02\u6E2F\u533A"],
  ["271080", "JP-27", "\u5927\u962A\u5E02\u5927\u6B63\u533A"],
  ["271098", "JP-27", "\u5927\u962A\u5E02\u5929\u738B\u5BFA\u533A"],
  ["271110", "JP-27", "\u5927\u962A\u5E02\u6D6A\u901F\u533A"],
  ["271136", "JP-27", "\u5927\u962A\u5E02\u897F\u6DC0\u5DDD\u533A"],
  ["271144", "JP-27", "\u5927\u962A\u5E02\u6771\u6DC0\u5DDD\u533A"],
  ["271152", "JP-27", "\u5927\u962A\u5E02\u6771\u6210\u533A"],
  ["271161", "JP-27", "\u5927\u962A\u5E02\u751F\u91CE\u533A"],
  ["271179", "JP-27", "\u5927\u962A\u5E02\u65ED\u533A"],
  ["271187", "JP-27", "\u5927\u962A\u5E02\u57CE\u6771\u533A"],
  ["271195", "JP-27", "\u5927\u962A\u5E02\u963F\u500D\u91CE\u533A"],
  ["271209", "JP-27", "\u5927\u962A\u5E02\u4F4F\u5409\u533A"],
  ["271217", "JP-27", "\u5927\u962A\u5E02\u6771\u4F4F\u5409\u533A"],
  ["271225", "JP-27", "\u5927\u962A\u5E02\u897F\u6210\u533A"],
  ["271233", "JP-27", "\u5927\u962A\u5E02\u6DC0\u5DDD\u533A"],
  ["271241", "JP-27", "\u5927\u962A\u5E02\u9DB4\u898B\u533A"],
  ["271250", "JP-27", "\u5927\u962A\u5E02\u4F4F\u4E4B\u6C5F\u533A"],
  ["271268", "JP-27", "\u5927\u962A\u5E02\u5E73\u91CE\u533A"],
  ["271276", "JP-27", "\u5927\u962A\u5E02\u5317\u533A"],
  ["271284", "JP-27", "\u5927\u962A\u5E02\u4E2D\u592E\u533A"],
  ["271403", "JP-27", "\u583A\u5E02"],
  ["271411", "JP-27", "\u583A\u5E02\u583A\u533A"],
  ["271420", "JP-27", "\u583A\u5E02\u4E2D\u533A"],
  ["271438", "JP-27", "\u583A\u5E02\u6771\u533A"],
  ["271446", "JP-27", "\u583A\u5E02\u897F\u533A"],
  ["271454", "JP-27", "\u583A\u5E02\u5357\u533A"],
  ["271462", "JP-27", "\u583A\u5E02\u5317\u533A"],
  ["271471", "JP-27", "\u583A\u5E02\u7F8E\u539F\u533A"],
  ["272027", "JP-27", "\u5CB8\u548C\u7530\u5E02"],
  ["272035", "JP-27", "\u8C4A\u4E2D\u5E02"],
  ["272043", "JP-27", "\u6C60\u7530\u5E02"],
  ["272051", "JP-27", "\u5439\u7530\u5E02"],
  ["272060", "JP-27", "\u6CC9\u5927\u6D25\u5E02"],
  ["272078", "JP-27", "\u9AD8\u69FB\u5E02"],
  ["272086", "JP-27", "\u8C9D\u585A\u5E02"],
  ["272094", "JP-27", "\u5B88\u53E3\u5E02"],
  ["272108", "JP-27", "\u679A\u65B9\u5E02"],
  ["272116", "JP-27", "\u8328\u6728\u5E02"],
  ["272124", "JP-27", "\u516B\u5C3E\u5E02"],
  ["272132", "JP-27", "\u6CC9\u4F50\u91CE\u5E02"],
  ["272141", "JP-27", "\u5BCC\u7530\u6797\u5E02"],
  ["272159", "JP-27", "\u5BDD\u5C4B\u5DDD\u5E02"],
  ["272167", "JP-27", "\u6CB3\u5185\u9577\u91CE\u5E02"],
  ["272175", "JP-27", "\u677E\u539F\u5E02"],
  ["272183", "JP-27", "\u5927\u6771\u5E02"],
  ["272191", "JP-27", "\u548C\u6CC9\u5E02"],
  ["272205", "JP-27", "\u7B95\u9762\u5E02"],
  ["272213", "JP-27", "\u67CF\u539F\u5E02"],
  ["272221", "JP-27", "\u7FBD\u66F3\u91CE\u5E02"],
  ["272230", "JP-27", "\u9580\u771F\u5E02"],
  ["272248", "JP-27", "\u6442\u6D25\u5E02"],
  ["272256", "JP-27", "\u9AD8\u77F3\u5E02"],
  ["272264", "JP-27", "\u85E4\u4E95\u5BFA\u5E02"],
  ["272272", "JP-27", "\u6771\u5927\u962A\u5E02"],
  ["272281", "JP-27", "\u6CC9\u5357\u5E02"],
  ["272299", "JP-27", "\u56DB\u689D\u7577\u5E02"],
  ["272302", "JP-27", "\u4EA4\u91CE\u5E02"],
  ["272311", "JP-27", "\u5927\u962A\u72ED\u5C71\u5E02"],
  ["272329", "JP-27", "\u962A\u5357\u5E02"],
  ["273015", "JP-27", "\u5CF6\u672C\u753A"],
  ["273210", "JP-27", "\u8C4A\u80FD\u753A"],
  ["273228", "JP-27", "\u80FD\u52E2\u753A"],
  ["273414", "JP-27", "\u5FE0\u5CA1\u753A"],
  ["273619", "JP-27", "\u718A\u53D6\u753A"],
  ["273627", "JP-27", "\u7530\u5C3B\u753A"],
  ["273660", "JP-27", "\u5CAC\u753A"],
  ["273813", "JP-27", "\u592A\u5B50\u753A"],
  ["273821", "JP-27", "\u6CB3\u5357\u753A"],
  ["273830", "JP-27", "\u5343\u65E9\u8D64\u962A\u6751"],
  ["281000", "JP-28", "\u795E\u6238\u5E02"],
  ["281018", "JP-28", "\u795E\u6238\u5E02\u6771\u7058\u533A"],
  ["281026", "JP-28", "\u795E\u6238\u5E02\u7058\u533A"],
  ["281051", "JP-28", "\u795E\u6238\u5E02\u5175\u5EAB\u533A"],
  ["281069", "JP-28", "\u795E\u6238\u5E02\u9577\u7530\u533A"],
  ["281077", "JP-28", "\u795E\u6238\u5E02\u9808\u78E8\u533A"],
  ["281085", "JP-28", "\u795E\u6238\u5E02\u5782\u6C34\u533A"],
  ["281093", "JP-28", "\u795E\u6238\u5E02\u5317\u533A"],
  ["281107", "JP-28", "\u795E\u6238\u5E02\u4E2D\u592E\u533A"],
  ["281115", "JP-28", "\u795E\u6238\u5E02\u897F\u533A"],
  ["282014", "JP-28", "\u59EB\u8DEF\u5E02"],
  ["282022", "JP-28", "\u5C3C\u5D0E\u5E02"],
  ["282031", "JP-28", "\u660E\u77F3\u5E02"],
  ["282049", "JP-28", "\u897F\u5BAE\u5E02"],
  ["282057", "JP-28", "\u6D32\u672C\u5E02"],
  ["282065", "JP-28", "\u82A6\u5C4B\u5E02"],
  ["282073", "JP-28", "\u4F0A\u4E39\u5E02"],
  ["282081", "JP-28", "\u76F8\u751F\u5E02"],
  ["282090", "JP-28", "\u8C4A\u5CA1\u5E02"],
  ["282103", "JP-28", "\u52A0\u53E4\u5DDD\u5E02"],
  ["282120", "JP-28", "\u8D64\u7A42\u5E02"],
  ["282138", "JP-28", "\u897F\u8107\u5E02"],
  ["282146", "JP-28", "\u5B9D\u585A\u5E02"],
  ["282154", "JP-28", "\u4E09\u6728\u5E02"],
  ["282162", "JP-28", "\u9AD8\u7802\u5E02"],
  ["282171", "JP-28", "\u5DDD\u897F\u5E02"],
  ["282189", "JP-28", "\u5C0F\u91CE\u5E02"],
  ["282197", "JP-28", "\u4E09\u7530\u5E02"],
  ["282201", "JP-28", "\u52A0\u897F\u5E02"],
  ["282219", "JP-28", "\u4E39\u6CE2\u7BE0\u5C71\u5E02"],
  ["282227", "JP-28", "\u990A\u7236\u5E02"],
  ["282235", "JP-28", "\u4E39\u6CE2\u5E02"],
  ["282243", "JP-28", "\u5357\u3042\u308F\u3058\u5E02"],
  ["282251", "JP-28", "\u671D\u6765\u5E02"],
  ["282260", "JP-28", "\u6DE1\u8DEF\u5E02"],
  ["282278", "JP-28", "\u5B8D\u7C9F\u5E02"],
  ["282286", "JP-28", "\u52A0\u6771\u5E02"],
  ["282294", "JP-28", "\u305F\u3064\u306E\u5E02"],
  ["283011", "JP-28", "\u732A\u540D\u5DDD\u753A"],
  ["283657", "JP-28", "\u591A\u53EF\u753A"],
  ["283819", "JP-28", "\u7A32\u7F8E\u753A"],
  ["283827", "JP-28", "\u64AD\u78E8\u753A"],
  ["284424", "JP-28", "\u5E02\u5DDD\u753A"],
  ["284432", "JP-28", "\u798F\u5D0E\u753A"],
  ["284467", "JP-28", "\u795E\u6CB3\u753A"],
  ["284645", "JP-28", "\u592A\u5B50\u753A"],
  ["284815", "JP-28", "\u4E0A\u90E1\u753A"],
  ["285013", "JP-28", "\u4F50\u7528\u753A"],
  ["285854", "JP-28", "\u9999\u7F8E\u753A"],
  ["285862", "JP-28", "\u65B0\u6E29\u6CC9\u753A"],
  ["292010", "JP-29", "\u5948\u826F\u5E02"],
  ["292028", "JP-29", "\u5927\u548C\u9AD8\u7530\u5E02"],
  ["292036", "JP-29", "\u5927\u548C\u90E1\u5C71\u5E02"],
  ["292044", "JP-29", "\u5929\u7406\u5E02"],
  ["292052", "JP-29", "\u6A7F\u539F\u5E02"],
  ["292061", "JP-29", "\u685C\u4E95\u5E02"],
  ["292079", "JP-29", "\u4E94\u689D\u5E02"],
  ["292087", "JP-29", "\u5FA1\u6240\u5E02"],
  ["292095", "JP-29", "\u751F\u99D2\u5E02"],
  ["292109", "JP-29", "\u9999\u829D\u5E02"],
  ["292117", "JP-29", "\u845B\u57CE\u5E02"],
  ["292125", "JP-29", "\u5B87\u9640\u5E02"],
  ["293229", "JP-29", "\u5C71\u6DFB\u6751"],
  ["293423", "JP-29", "\u5E73\u7FA4\u753A"],
  ["293431", "JP-29", "\u4E09\u90F7\u753A"],
  ["293440", "JP-29", "\u6591\u9CE9\u753A"],
  ["293458", "JP-29", "\u5B89\u5835\u753A"],
  ["293610", "JP-29", "\u5DDD\u897F\u753A"],
  ["293628", "JP-29", "\u4E09\u5B85\u753A"],
  ["293636", "JP-29", "\u7530\u539F\u672C\u753A"],
  ["293857", "JP-29", "\u66FD\u723E\u6751"],
  ["293865", "JP-29", "\u5FA1\u6756\u6751"],
  ["294012", "JP-29", "\u9AD8\u53D6\u753A"],
  ["294021", "JP-29", "\u660E\u65E5\u9999\u6751"],
  ["294241", "JP-29", "\u4E0A\u7267\u753A"],
  ["294250", "JP-29", "\u738B\u5BFA\u753A"],
  ["294268", "JP-29", "\u5E83\u9675\u753A"],
  ["294276", "JP-29", "\u6CB3\u5408\u753A"],
  ["294411", "JP-29", "\u5409\u91CE\u753A"],
  ["294420", "JP-29", "\u5927\u6DC0\u753A"],
  ["294438", "JP-29", "\u4E0B\u5E02\u753A"],
  ["294446", "JP-29", "\u9ED2\u6EDD\u6751"],
  ["294462", "JP-29", "\u5929\u5DDD\u6751"],
  ["294471", "JP-29", "\u91CE\u8FEB\u5DDD\u6751"],
  ["294497", "JP-29", "\u5341\u6D25\u5DDD\u6751"],
  ["294501", "JP-29", "\u4E0B\u5317\u5C71\u6751"],
  ["294519", "JP-29", "\u4E0A\u5317\u5C71\u6751"],
  ["294527", "JP-29", "\u5DDD\u4E0A\u6751"],
  ["294535", "JP-29", "\u6771\u5409\u91CE\u6751"],
  ["302015", "JP-30", "\u548C\u6B4C\u5C71\u5E02"],
  ["302023", "JP-30", "\u6D77\u5357\u5E02"],
  ["302031", "JP-30", "\u6A4B\u672C\u5E02"],
  ["302040", "JP-30", "\u6709\u7530\u5E02"],
  ["302058", "JP-30", "\u5FA1\u574A\u5E02"],
  ["302066", "JP-30", "\u7530\u8FBA\u5E02"],
  ["302074", "JP-30", "\u65B0\u5BAE\u5E02"],
  ["302082", "JP-30", "\u7D00\u306E\u5DDD\u5E02"],
  ["302091", "JP-30", "\u5CA9\u51FA\u5E02"],
  ["303046", "JP-30", "\u7D00\u7F8E\u91CE\u753A"],
  ["303411", "JP-30", "\u304B\u3064\u3089\u304E\u753A"],
  ["303437", "JP-30", "\u4E5D\u5EA6\u5C71\u753A"],
  ["303445", "JP-30", "\u9AD8\u91CE\u753A"],
  ["303615", "JP-30", "\u6E6F\u6D45\u753A"],
  ["303623", "JP-30", "\u5E83\u5DDD\u753A"],
  ["303666", "JP-30", "\u6709\u7530\u5DDD\u753A"],
  ["303810", "JP-30", "\u7F8E\u6D5C\u753A"],
  ["303828", "JP-30", "\u65E5\u9AD8\u753A"],
  ["303836", "JP-30", "\u7531\u826F\u753A"],
  ["303909", "JP-30", "\u5370\u5357\u753A"],
  ["303917", "JP-30", "\u307F\u306A\u3079\u753A"],
  ["303925", "JP-30", "\u65E5\u9AD8\u5DDD\u753A"],
  ["304018", "JP-30", "\u767D\u6D5C\u753A"],
  ["304042", "JP-30", "\u4E0A\u5BCC\u7530\u753A"],
  ["304069", "JP-30", "\u3059\u3055\u307F\u753A"],
  ["304212", "JP-30", "\u90A3\u667A\u52DD\u6D66\u753A"],
  ["304221", "JP-30", "\u592A\u5730\u753A"],
  ["304247", "JP-30", "\u53E4\u5EA7\u5DDD\u753A"],
  ["304271", "JP-30", "\u5317\u5C71\u6751"],
  ["304280", "JP-30", "\u4E32\u672C\u753A"],
  ["312011", "JP-31", "\u9CE5\u53D6\u5E02"],
  ["312029", "JP-31", "\u7C73\u5B50\u5E02"],
  ["312037", "JP-31", "\u5009\u5409\u5E02"],
  ["312045", "JP-31", "\u5883\u6E2F\u5E02"],
  ["313025", "JP-31", "\u5CA9\u7F8E\u753A"],
  ["313254", "JP-31", "\u82E5\u685C\u753A"],
  ["313289", "JP-31", "\u667A\u982D\u753A"],
  ["313297", "JP-31", "\u516B\u982D\u753A"],
  ["313645", "JP-31", "\u4E09\u671D\u753A"],
  ["313700", "JP-31", "\u6E6F\u68A8\u6D5C\u753A"],
  ["313718", "JP-31", "\u7434\u6D66\u753A"],
  ["313726", "JP-31", "\u5317\u6804\u753A"],
  ["313840", "JP-31", "\u65E5\u5409\u6D25\u6751"],
  ["313866", "JP-31", "\u5927\u5C71\u753A"],
  ["313891", "JP-31", "\u5357\u90E8\u753A"],
  ["313904", "JP-31", "\u4F2F\u8006\u753A"],
  ["314013", "JP-31", "\u65E5\u5357\u753A"],
  ["314021", "JP-31", "\u65E5\u91CE\u753A"],
  ["314030", "JP-31", "\u6C5F\u5E9C\u753A"],
  ["322016", "JP-32", "\u677E\u6C5F\u5E02"],
  ["322024", "JP-32", "\u6D5C\u7530\u5E02"],
  ["322032", "JP-32", "\u51FA\u96F2\u5E02"],
  ["322041", "JP-32", "\u76CA\u7530\u5E02"],
  ["322059", "JP-32", "\u5927\u7530\u5E02"],
  ["322067", "JP-32", "\u5B89\u6765\u5E02"],
  ["322075", "JP-32", "\u6C5F\u6D25\u5E02"],
  ["322091", "JP-32", "\u96F2\u5357\u5E02"],
  ["323438", "JP-32", "\u5965\u51FA\u96F2\u753A"],
  ["323861", "JP-32", "\u98EF\u5357\u753A"],
  ["324418", "JP-32", "\u5DDD\u672C\u753A"],
  ["324485", "JP-32", "\u7F8E\u90F7\u753A"],
  ["324493", "JP-32", "\u9091\u5357\u753A"],
  ["325015", "JP-32", "\u6D25\u548C\u91CE\u753A"],
  ["325058", "JP-32", "\u5409\u8CC0\u753A"],
  ["325252", "JP-32", "\u6D77\u58EB\u753A"],
  ["325261", "JP-32", "\u897F\u30CE\u5CF6\u753A"],
  ["325279", "JP-32", "\u77E5\u592B\u6751"],
  ["325287", "JP-32", "\u96A0\u5C90\u306E\u5CF6\u753A"],
  ["331007", "JP-33", "\u5CA1\u5C71\u5E02"],
  ["331015", "JP-33", "\u5CA1\u5C71\u5E02\u5317\u533A"],
  ["331023", "JP-33", "\u5CA1\u5C71\u5E02\u4E2D\u533A"],
  ["331031", "JP-33", "\u5CA1\u5C71\u5E02\u6771\u533A"],
  ["331040", "JP-33", "\u5CA1\u5C71\u5E02\u5357\u533A"],
  ["332020", "JP-33", "\u5009\u6577\u5E02"],
  ["332038", "JP-33", "\u6D25\u5C71\u5E02"],
  ["332046", "JP-33", "\u7389\u91CE\u5E02"],
  ["332054", "JP-33", "\u7B20\u5CA1\u5E02"],
  ["332071", "JP-33", "\u4E95\u539F\u5E02"],
  ["332089", "JP-33", "\u7DCF\u793E\u5E02"],
  ["332097", "JP-33", "\u9AD8\u6881\u5E02"],
  ["332101", "JP-33", "\u65B0\u898B\u5E02"],
  ["332119", "JP-33", "\u5099\u524D\u5E02"],
  ["332127", "JP-33", "\u702C\u6238\u5185\u5E02"],
  ["332135", "JP-33", "\u8D64\u78D0\u5E02"],
  ["332143", "JP-33", "\u771F\u5EAD\u5E02"],
  ["332151", "JP-33", "\u7F8E\u4F5C\u5E02"],
  ["332160", "JP-33", "\u6D45\u53E3\u5E02"],
  ["333468", "JP-33", "\u548C\u6C17\u753A"],
  ["334235", "JP-33", "\u65E9\u5CF6\u753A"],
  ["334456", "JP-33", "\u91CC\u5E84\u753A"],
  ["334618", "JP-33", "\u77E2\u639B\u753A"],
  ["335860", "JP-33", "\u65B0\u5E84\u6751"],
  ["336068", "JP-33", "\u93E1\u91CE\u753A"],
  ["336220", "JP-33", "\u52DD\u592E\u753A"],
  ["336238", "JP-33", "\u5948\u7FA9\u753A"],
  ["336432", "JP-33", "\u897F\u7C9F\u5009\u6751"],
  ["336637", "JP-33", "\u4E45\u7C73\u5357\u753A"],
  ["336661", "JP-33", "\u7F8E\u54B2\u753A"],
  ["336815", "JP-33", "\u5409\u5099\u4E2D\u592E\u753A"],
  ["341002", "JP-34", "\u5E83\u5CF6\u5E02"],
  ["341011", "JP-34", "\u5E83\u5CF6\u5E02\u4E2D\u533A"],
  ["341029", "JP-34", "\u5E83\u5CF6\u5E02\u6771\u533A"],
  ["341037", "JP-34", "\u5E83\u5CF6\u5E02\u5357\u533A"],
  ["341045", "JP-34", "\u5E83\u5CF6\u5E02\u897F\u533A"],
  ["341053", "JP-34", "\u5E83\u5CF6\u5E02\u5B89\u4F50\u5357\u533A"],
  ["341061", "JP-34", "\u5E83\u5CF6\u5E02\u5B89\u4F50\u5317\u533A"],
  ["341070", "JP-34", "\u5E83\u5CF6\u5E02\u5B89\u82B8\u533A"],
  ["341088", "JP-34", "\u5E83\u5CF6\u5E02\u4F50\u4F2F\u533A"],
  ["342025", "JP-34", "\u5449\u5E02"],
  ["342033", "JP-34", "\u7AF9\u539F\u5E02"],
  ["342041", "JP-34", "\u4E09\u539F\u5E02"],
  ["342050", "JP-34", "\u5C3E\u9053\u5E02"],
  ["342076", "JP-34", "\u798F\u5C71\u5E02"],
  ["342084", "JP-34", "\u5E9C\u4E2D\u5E02"],
  ["342092", "JP-34", "\u4E09\u6B21\u5E02"],
  ["342106", "JP-34", "\u5E84\u539F\u5E02"],
  ["342114", "JP-34", "\u5927\u7AF9\u5E02"],
  ["342122", "JP-34", "\u6771\u5E83\u5CF6\u5E02"],
  ["342131", "JP-34", "\u5EFF\u65E5\u5E02\u5E02"],
  ["342149", "JP-34", "\u5B89\u82B8\u9AD8\u7530\u5E02"],
  ["342157", "JP-34", "\u6C5F\u7530\u5CF6\u5E02"],
  ["343021", "JP-34", "\u5E9C\u4E2D\u753A"],
  ["343048", "JP-34", "\u6D77\u7530\u753A"],
  ["343072", "JP-34", "\u718A\u91CE\u753A"],
  ["343099", "JP-34", "\u5742\u753A"],
  ["343684", "JP-34", "\u5B89\u82B8\u592A\u7530\u753A"],
  ["343692", "JP-34", "\u5317\u5E83\u5CF6\u753A"],
  ["344311", "JP-34", "\u5927\u5D0E\u4E0A\u5CF6\u753A"],
  ["344621", "JP-34", "\u4E16\u7F85\u753A"],
  ["345458", "JP-34", "\u795E\u77F3\u9AD8\u539F\u753A"],
  ["352012", "JP-35", "\u4E0B\u95A2\u5E02"],
  ["352021", "JP-35", "\u5B87\u90E8\u5E02"],
  ["352039", "JP-35", "\u5C71\u53E3\u5E02"],
  ["352047", "JP-35", "\u8429\u5E02"],
  ["352063", "JP-35", "\u9632\u5E9C\u5E02"],
  ["352071", "JP-35", "\u4E0B\u677E\u5E02"],
  ["352080", "JP-35", "\u5CA9\u56FD\u5E02"],
  ["352101", "JP-35", "\u5149\u5E02"],
  ["352110", "JP-35", "\u9577\u9580\u5E02"],
  ["352128", "JP-35", "\u67F3\u4E95\u5E02"],
  ["352136", "JP-35", "\u7F8E\u7962\u5E02"],
  ["352152", "JP-35", "\u5468\u5357\u5E02"],
  ["352161", "JP-35", "\u5C71\u967D\u5C0F\u91CE\u7530\u5E02"],
  ["353051", "JP-35", "\u5468\u9632\u5927\u5CF6\u753A"],
  ["353213", "JP-35", "\u548C\u6728\u753A"],
  ["353418", "JP-35", "\u4E0A\u95A2\u753A"],
  ["353434", "JP-35", "\u7530\u5E03\u65BD\u753A"],
  ["353442", "JP-35", "\u5E73\u751F\u753A"],
  ["355020", "JP-35", "\u963F\u6B66\u753A"],
  ["362018", "JP-36", "\u5FB3\u5CF6\u5E02"],
  ["362026", "JP-36", "\u9CF4\u9580\u5E02"],
  ["362034", "JP-36", "\u5C0F\u677E\u5CF6\u5E02"],
  ["362042", "JP-36", "\u963F\u5357\u5E02"],
  ["362051", "JP-36", "\u5409\u91CE\u5DDD\u5E02"],
  ["362069", "JP-36", "\u963F\u6CE2\u5E02"],
  ["362077", "JP-36", "\u7F8E\u99AC\u5E02"],
  ["362085", "JP-36", "\u4E09\u597D\u5E02"],
  ["363014", "JP-36", "\u52DD\u6D66\u753A"],
  ["363022", "JP-36", "\u4E0A\u52DD\u753A"],
  ["363219", "JP-36", "\u4F50\u90A3\u6CB3\u5185\u6751"],
  ["363413", "JP-36", "\u77F3\u4E95\u753A"],
  ["363421", "JP-36", "\u795E\u5C71\u753A"],
  ["363685", "JP-36", "\u90A3\u8CC0\u753A"],
  ["363839", "JP-36", "\u725F\u5C90\u753A"],
  ["363871", "JP-36", "\u7F8E\u6CE2\u753A"],
  ["363880", "JP-36", "\u6D77\u967D\u753A"],
  ["364011", "JP-36", "\u677E\u8302\u753A"],
  ["364029", "JP-36", "\u5317\u5CF6\u753A"],
  ["364037", "JP-36", "\u85CD\u4F4F\u753A"],
  ["364045", "JP-36", "\u677F\u91CE\u753A"],
  ["364053", "JP-36", "\u4E0A\u677F\u753A"],
  ["364681", "JP-36", "\u3064\u308B\u304E\u753A"],
  ["364894", "JP-36", "\u6771\u307F\u3088\u3057\u753A"],
  ["372013", "JP-37", "\u9AD8\u677E\u5E02"],
  ["372021", "JP-37", "\u4E38\u4E80\u5E02"],
  ["372030", "JP-37", "\u5742\u51FA\u5E02"],
  ["372048", "JP-37", "\u5584\u901A\u5BFA\u5E02"],
  ["372056", "JP-37", "\u89B3\u97F3\u5BFA\u5E02"],
  ["372064", "JP-37", "\u3055\u306C\u304D\u5E02"],
  ["372072", "JP-37", "\u6771\u304B\u304C\u308F\u5E02"],
  ["372081", "JP-37", "\u4E09\u8C4A\u5E02"],
  ["373222", "JP-37", "\u571F\u5E84\u753A"],
  ["373249", "JP-37", "\u5C0F\u8C46\u5CF6\u753A"],
  ["373419", "JP-37", "\u4E09\u6728\u753A"],
  ["373648", "JP-37", "\u76F4\u5CF6\u753A"],
  ["373869", "JP-37", "\u5B87\u591A\u6D25\u753A"],
  ["373877", "JP-37", "\u7DBE\u5DDD\u753A"],
  ["374032", "JP-37", "\u7434\u5E73\u753A"],
  ["374041", "JP-37", "\u591A\u5EA6\u6D25\u753A"],
  ["374067", "JP-37", "\u307E\u3093\u306E\u3046\u753A"],
  ["382019", "JP-38", "\u677E\u5C71\u5E02"],
  ["382027", "JP-38", "\u4ECA\u6CBB\u5E02"],
  ["382035", "JP-38", "\u5B87\u548C\u5CF6\u5E02"],
  ["382043", "JP-38", "\u516B\u5E61\u6D5C\u5E02"],
  ["382051", "JP-38", "\u65B0\u5C45\u6D5C\u5E02"],
  ["382060", "JP-38", "\u897F\u6761\u5E02"],
  ["382078", "JP-38", "\u5927\u6D32\u5E02"],
  ["382108", "JP-38", "\u4F0A\u4E88\u5E02"],
  ["382132", "JP-38", "\u56DB\u56FD\u4E2D\u592E\u5E02"],
  ["382141", "JP-38", "\u897F\u4E88\u5E02"],
  ["382159", "JP-38", "\u6771\u6E29\u5E02"],
  ["383562", "JP-38", "\u4E0A\u5CF6\u753A"],
  ["383864", "JP-38", "\u4E45\u4E07\u9AD8\u539F\u753A"],
  ["384011", "JP-38", "\u677E\u524D\u753A"],
  ["384020", "JP-38", "\u7825\u90E8\u753A"],
  ["384224", "JP-38", "\u5185\u5B50\u753A"],
  ["384429", "JP-38", "\u4F0A\u65B9\u753A"],
  ["384844", "JP-38", "\u677E\u91CE\u753A"],
  ["384887", "JP-38", "\u9B3C\u5317\u753A"],
  ["385069", "JP-38", "\u611B\u5357\u753A"],
  ["392014", "JP-39", "\u9AD8\u77E5\u5E02"],
  ["392022", "JP-39", "\u5BA4\u6238\u5E02"],
  ["392031", "JP-39", "\u5B89\u82B8\u5E02"],
  ["392049", "JP-39", "\u5357\u56FD\u5E02"],
  ["392057", "JP-39", "\u571F\u4F50\u5E02"],
  ["392065", "JP-39", "\u9808\u5D0E\u5E02"],
  ["392081", "JP-39", "\u5BBF\u6BDB\u5E02"],
  ["392090", "JP-39", "\u571F\u4F50\u6E05\u6C34\u5E02"],
  ["392103", "JP-39", "\u56DB\u4E07\u5341\u5E02"],
  ["392111", "JP-39", "\u9999\u5357\u5E02"],
  ["392120", "JP-39", "\u9999\u7F8E\u5E02"],
  ["393011", "JP-39", "\u6771\u6D0B\u753A"],
  ["393029", "JP-39", "\u5948\u534A\u5229\u753A"],
  ["393037", "JP-39", "\u7530\u91CE\u753A"],
  ["393045", "JP-39", "\u5B89\u7530\u753A"],
  ["393053", "JP-39", "\u5317\u5DDD\u6751"],
  ["393061", "JP-39", "\u99AC\u8DEF\u6751"],
  ["393070", "JP-39", "\u82B8\u897F\u6751"],
  ["393410", "JP-39", "\u672C\u5C71\u753A"],
  ["393444", "JP-39", "\u5927\u8C4A\u753A"],
  ["393631", "JP-39", "\u571F\u4F50\u753A"],
  ["393649", "JP-39", "\u5927\u5DDD\u6751"],
  ["393860", "JP-39", "\u3044\u306E\u753A"],
  ["393878", "JP-39", "\u4EC1\u6DC0\u5DDD\u753A"],
  ["394017", "JP-39", "\u4E2D\u571F\u4F50\u753A"],
  ["394025", "JP-39", "\u4F50\u5DDD\u753A"],
  ["394033", "JP-39", "\u8D8A\u77E5\u753A"],
  ["394050", "JP-39", "\u68BC\u539F\u753A"],
  ["394106", "JP-39", "\u65E5\u9AD8\u6751"],
  ["394114", "JP-39", "\u6D25\u91CE\u753A"],
  ["394122", "JP-39", "\u56DB\u4E07\u5341\u753A"],
  ["394246", "JP-39", "\u5927\u6708\u753A"],
  ["394271", "JP-39", "\u4E09\u539F\u6751"],
  ["394289", "JP-39", "\u9ED2\u6F6E\u753A"],
  ["401005", "JP-40", "\u5317\u4E5D\u5DDE\u5E02"],
  ["401013", "JP-40", "\u5317\u4E5D\u5DDE\u5E02\u9580\u53F8\u533A"],
  ["401030", "JP-40", "\u5317\u4E5D\u5DDE\u5E02\u82E5\u677E\u533A"],
  ["401056", "JP-40", "\u5317\u4E5D\u5DDE\u5E02\u6238\u7551\u533A"],
  ["401064", "JP-40", "\u5317\u4E5D\u5DDE\u5E02\u5C0F\u5009\u5317\u533A"],
  ["401072", "JP-40", "\u5317\u4E5D\u5DDE\u5E02\u5C0F\u5009\u5357\u533A"],
  ["401081", "JP-40", "\u5317\u4E5D\u5DDE\u5E02\u516B\u5E61\u6771\u533A"],
  ["401099", "JP-40", "\u5317\u4E5D\u5DDE\u5E02\u516B\u5E61\u897F\u533A"],
  ["401307", "JP-40", "\u798F\u5CA1\u5E02"],
  ["401315", "JP-40", "\u798F\u5CA1\u5E02\u6771\u533A"],
  ["401323", "JP-40", "\u798F\u5CA1\u5E02\u535A\u591A\u533A"],
  ["401331", "JP-40", "\u798F\u5CA1\u5E02\u4E2D\u592E\u533A"],
  ["401340", "JP-40", "\u798F\u5CA1\u5E02\u5357\u533A"],
  ["401358", "JP-40", "\u798F\u5CA1\u5E02\u897F\u533A"],
  ["401366", "JP-40", "\u798F\u5CA1\u5E02\u57CE\u5357\u533A"],
  ["401374", "JP-40", "\u798F\u5CA1\u5E02\u65E9\u826F\u533A"],
  ["402028", "JP-40", "\u5927\u725F\u7530\u5E02"],
  ["402036", "JP-40", "\u4E45\u7559\u7C73\u5E02"],
  ["402044", "JP-40", "\u76F4\u65B9\u5E02"],
  ["402052", "JP-40", "\u98EF\u585A\u5E02"],
  ["402061", "JP-40", "\u7530\u5DDD\u5E02"],
  ["402079", "JP-40", "\u67F3\u5DDD\u5E02"],
  ["402109", "JP-40", "\u516B\u5973\u5E02"],
  ["402117", "JP-40", "\u7B51\u5F8C\u5E02"],
  ["402125", "JP-40", "\u5927\u5DDD\u5E02"],
  ["402133", "JP-40", "\u884C\u6A4B\u5E02"],
  ["402141", "JP-40", "\u8C4A\u524D\u5E02"],
  ["402150", "JP-40", "\u4E2D\u9593\u5E02"],
  ["402168", "JP-40", "\u5C0F\u90E1\u5E02"],
  ["402176", "JP-40", "\u7B51\u7D2B\u91CE\u5E02"],
  ["402184", "JP-40", "\u6625\u65E5\u5E02"],
  ["402192", "JP-40", "\u5927\u91CE\u57CE\u5E02"],
  ["402206", "JP-40", "\u5B97\u50CF\u5E02"],
  ["402214", "JP-40", "\u592A\u5BB0\u5E9C\u5E02"],
  ["402231", "JP-40", "\u53E4\u8CC0\u5E02"],
  ["402249", "JP-40", "\u798F\u6D25\u5E02"],
  ["402257", "JP-40", "\u3046\u304D\u306F\u5E02"],
  ["402265", "JP-40", "\u5BAE\u82E5\u5E02"],
  ["402273", "JP-40", "\u5609\u9EBB\u5E02"],
  ["402281", "JP-40", "\u671D\u5009\u5E02"],
  ["402290", "JP-40", "\u307F\u3084\u307E\u5E02"],
  ["402303", "JP-40", "\u7CF8\u5CF6\u5E02"],
  ["402311", "JP-40", "\u90A3\u73C2\u5DDD\u5E02"],
  ["403415", "JP-40", "\u5B87\u7F8E\u753A"],
  ["403423", "JP-40", "\u7BE0\u6817\u753A"],
  ["403431", "JP-40", "\u5FD7\u514D\u753A"],
  ["403440", "JP-40", "\u9808\u6075\u753A"],
  ["403458", "JP-40", "\u65B0\u5BAE\u753A"],
  ["403482", "JP-40", "\u4E45\u5C71\u753A"],
  ["403491", "JP-40", "\u7C95\u5C4B\u753A"],
  ["403814", "JP-40", "\u82A6\u5C4B\u753A"],
  ["403822", "JP-40", "\u6C34\u5DFB\u753A"],
  ["403831", "JP-40", "\u5CA1\u57A3\u753A"],
  ["403849", "JP-40", "\u9060\u8CC0\u753A"],
  ["404012", "JP-40", "\u5C0F\u7AF9\u753A"],
  ["404021", "JP-40", "\u978D\u624B\u753A"],
  ["404217", "JP-40", "\u6842\u5DDD\u753A"],
  ["404471", "JP-40", "\u7B51\u524D\u753A"],
  ["404489", "JP-40", "\u6771\u5CF0\u6751"],
  ["405035", "JP-40", "\u5927\u5200\u6D17\u753A"],
  ["405221", "JP-40", "\u5927\u6728\u753A"],
  ["405442", "JP-40", "\u5E83\u5DDD\u753A"],
  ["406015", "JP-40", "\u9999\u6625\u753A"],
  ["406023", "JP-40", "\u6DFB\u7530\u753A"],
  ["406040", "JP-40", "\u7CF8\u7530\u753A"],
  ["406058", "JP-40", "\u5DDD\u5D0E\u753A"],
  ["406082", "JP-40", "\u5927\u4EFB\u753A"],
  ["406091", "JP-40", "\u8D64\u6751"],
  ["406104", "JP-40", "\u798F\u667A\u753A"],
  ["406210", "JP-40", "\u82C5\u7530\u753A"],
  ["406252", "JP-40", "\u307F\u3084\u3053\u753A"],
  ["406422", "JP-40", "\u5409\u5BCC\u753A"],
  ["406465", "JP-40", "\u4E0A\u6BDB\u753A"],
  ["406473", "JP-40", "\u7BC9\u4E0A\u753A"],
  ["412015", "JP-41", "\u4F50\u8CC0\u5E02"],
  ["412023", "JP-41", "\u5510\u6D25\u5E02"],
  ["412031", "JP-41", "\u9CE5\u6816\u5E02"],
  ["412040", "JP-41", "\u591A\u4E45\u5E02"],
  ["412058", "JP-41", "\u4F0A\u4E07\u91CC\u5E02"],
  ["412066", "JP-41", "\u6B66\u96C4\u5E02"],
  ["412074", "JP-41", "\u9E7F\u5CF6\u5E02"],
  ["412082", "JP-41", "\u5C0F\u57CE\u5E02"],
  ["412091", "JP-41", "\u5B09\u91CE\u5E02"],
  ["412104", "JP-41", "\u795E\u57FC\u5E02"],
  ["413275", "JP-41", "\u5409\u91CE\u30F6\u91CC\u753A"],
  ["413411", "JP-41", "\u57FA\u5C71\u753A"],
  ["413453", "JP-41", "\u4E0A\u5CF0\u753A"],
  ["413461", "JP-41", "\u307F\u3084\u304D\u753A"],
  ["413879", "JP-41", "\u7384\u6D77\u753A"],
  ["414018", "JP-41", "\u6709\u7530\u753A"],
  ["414239", "JP-41", "\u5927\u753A\u753A"],
  ["414247", "JP-41", "\u6C5F\u5317\u753A"],
  ["414255", "JP-41", "\u767D\u77F3\u753A"],
  ["414417", "JP-41", "\u592A\u826F\u753A"],
  ["422011", "JP-42", "\u9577\u5D0E\u5E02"],
  ["422029", "JP-42", "\u4F50\u4E16\u4FDD\u5E02"],
  ["422037", "JP-42", "\u5CF6\u539F\u5E02"],
  ["422045", "JP-42", "\u8AEB\u65E9\u5E02"],
  ["422053", "JP-42", "\u5927\u6751\u5E02"],
  ["422070", "JP-42", "\u5E73\u6238\u5E02"],
  ["422088", "JP-42", "\u677E\u6D66\u5E02"],
  ["422096", "JP-42", "\u5BFE\u99AC\u5E02"],
  ["422100", "JP-42", "\u58F1\u5C90\u5E02"],
  ["422118", "JP-42", "\u4E94\u5CF6\u5E02"],
  ["422126", "JP-42", "\u897F\u6D77\u5E02"],
  ["422134", "JP-42", "\u96F2\u4ED9\u5E02"],
  ["422142", "JP-42", "\u5357\u5CF6\u539F\u5E02"],
  ["423076", "JP-42", "\u9577\u4E0E\u753A"],
  ["423084", "JP-42", "\u6642\u6D25\u753A"],
  ["423211", "JP-42", "\u6771\u5F7C\u6775\u753A"],
  ["423220", "JP-42", "\u5DDD\u68DA\u753A"],
  ["423238", "JP-42", "\u6CE2\u4F50\u898B\u753A"],
  ["423831", "JP-42", "\u5C0F\u5024\u8CC0\u753A"],
  ["423912", "JP-42", "\u4F50\u3005\u753A"],
  ["424111", "JP-42", "\u65B0\u4E0A\u4E94\u5CF6\u753A"],
  ["431001", "JP-43", "\u718A\u672C\u5E02"],
  ["431010", "JP-43", "\u718A\u672C\u5E02\u4E2D\u592E\u533A"],
  ["431028", "JP-43", "\u718A\u672C\u5E02\u6771\u533A"],
  ["431036", "JP-43", "\u718A\u672C\u5E02\u897F\u533A"],
  ["431044", "JP-43", "\u718A\u672C\u5E02\u5357\u533A"],
  ["431052", "JP-43", "\u718A\u672C\u5E02\u5317\u533A"],
  ["432024", "JP-43", "\u516B\u4EE3\u5E02"],
  ["432032", "JP-43", "\u4EBA\u5409\u5E02"],
  ["432041", "JP-43", "\u8352\u5C3E\u5E02"],
  ["432059", "JP-43", "\u6C34\u4FE3\u5E02"],
  ["432067", "JP-43", "\u7389\u540D\u5E02"],
  ["432083", "JP-43", "\u5C71\u9E7F\u5E02"],
  ["432105", "JP-43", "\u83CA\u6C60\u5E02"],
  ["432113", "JP-43", "\u5B87\u571F\u5E02"],
  ["432121", "JP-43", "\u4E0A\u5929\u8349\u5E02"],
  ["432130", "JP-43", "\u5B87\u57CE\u5E02"],
  ["432148", "JP-43", "\u963F\u8607\u5E02"],
  ["432156", "JP-43", "\u5929\u8349\u5E02"],
  ["432164", "JP-43", "\u5408\u5FD7\u5E02"],
  ["433489", "JP-43", "\u7F8E\u91CC\u753A"],
  ["433641", "JP-43", "\u7389\u6771\u753A"],
  ["433675", "JP-43", "\u5357\u95A2\u753A"],
  ["433683", "JP-43", "\u9577\u6D32\u753A"],
  ["433691", "JP-43", "\u548C\u6C34\u753A"],
  ["434035", "JP-43", "\u5927\u6D25\u753A"],
  ["434043", "JP-43", "\u83CA\u967D\u753A"],
  ["434230", "JP-43", "\u5357\u5C0F\u56FD\u753A"],
  ["434248", "JP-43", "\u5C0F\u56FD\u753A"],
  ["434256", "JP-43", "\u7523\u5C71\u6751"],
  ["434281", "JP-43", "\u9AD8\u68EE\u753A"],
  ["434329", "JP-43", "\u897F\u539F\u6751"],
  ["434337", "JP-43", "\u5357\u963F\u8607\u6751"],
  ["434418", "JP-43", "\u5FA1\u8239\u753A"],
  ["434426", "JP-43", "\u5609\u5CF6\u753A"],
  ["434434", "JP-43", "\u76CA\u57CE\u753A"],
  ["434442", "JP-43", "\u7532\u4F50\u753A"],
  ["434477", "JP-43", "\u5C71\u90FD\u753A"],
  ["434680", "JP-43", "\u6C37\u5DDD\u753A"],
  ["434825", "JP-43", "\u82A6\u5317\u753A"],
  ["434841", "JP-43", "\u6D25\u5948\u6728\u753A"],
  ["435015", "JP-43", "\u9326\u753A"],
  ["435058", "JP-43", "\u591A\u826F\u6728\u753A"],
  ["435066", "JP-43", "\u6E6F\u524D\u753A"],
  ["435074", "JP-43", "\u6C34\u4E0A\u6751"],
  ["435104", "JP-43", "\u76F8\u826F\u6751"],
  ["435112", "JP-43", "\u4E94\u6728\u6751"],
  ["435121", "JP-43", "\u5C71\u6C5F\u6751"],
  ["435139", "JP-43", "\u7403\u78E8\u6751"],
  ["435147", "JP-43", "\u3042\u3055\u304E\u308A\u753A"],
  ["435317", "JP-43", "\u82D3\u5317\u753A"],
  ["442011", "JP-44", "\u5927\u5206\u5E02"],
  ["442020", "JP-44", "\u5225\u5E9C\u5E02"],
  ["442038", "JP-44", "\u4E2D\u6D25\u5E02"],
  ["442046", "JP-44", "\u65E5\u7530\u5E02"],
  ["442054", "JP-44", "\u4F50\u4F2F\u5E02"],
  ["442062", "JP-44", "\u81FC\u6775\u5E02"],
  ["442071", "JP-44", "\u6D25\u4E45\u898B\u5E02"],
  ["442089", "JP-44", "\u7AF9\u7530\u5E02"],
  ["442097", "JP-44", "\u8C4A\u5F8C\u9AD8\u7530\u5E02"],
  ["442101", "JP-44", "\u6775\u7BC9\u5E02"],
  ["442119", "JP-44", "\u5B87\u4F50\u5E02"],
  ["442127", "JP-44", "\u8C4A\u5F8C\u5927\u91CE\u5E02"],
  ["442135", "JP-44", "\u7531\u5E03\u5E02"],
  ["442143", "JP-44", "\u56FD\u6771\u5E02"],
  ["443221", "JP-44", "\u59EB\u5CF6\u6751"],
  ["443417", "JP-44", "\u65E5\u51FA\u753A"],
  ["444618", "JP-44", "\u4E5D\u91CD\u753A"],
  ["444626", "JP-44", "\u7396\u73E0\u753A"],
  ["452017", "JP-45", "\u5BAE\u5D0E\u5E02"],
  ["452025", "JP-45", "\u90FD\u57CE\u5E02"],
  ["452033", "JP-45", "\u5EF6\u5CA1\u5E02"],
  ["452041", "JP-45", "\u65E5\u5357\u5E02"],
  ["452050", "JP-45", "\u5C0F\u6797\u5E02"],
  ["452068", "JP-45", "\u65E5\u5411\u5E02"],
  ["452076", "JP-45", "\u4E32\u9593\u5E02"],
  ["452084", "JP-45", "\u897F\u90FD\u5E02"],
  ["452092", "JP-45", "\u3048\u3073\u306E\u5E02"],
  ["453412", "JP-45", "\u4E09\u80A1\u753A"],
  ["453617", "JP-45", "\u9AD8\u539F\u753A"],
  ["453820", "JP-45", "\u56FD\u5BCC\u753A"],
  ["453838", "JP-45", "\u7DBE\u753A"],
  ["454010", "JP-45", "\u9AD8\u934B\u753A"],
  ["454028", "JP-45", "\u65B0\u5BCC\u753A"],
  ["454036", "JP-45", "\u897F\u7C73\u826F\u6751"],
  ["454044", "JP-45", "\u6728\u57CE\u753A"],
  ["454052", "JP-45", "\u5DDD\u5357\u753A"],
  ["454061", "JP-45", "\u90FD\u8FB2\u753A"],
  ["454214", "JP-45", "\u9580\u5DDD\u753A"],
  ["454290", "JP-45", "\u8AF8\u585A\u6751"],
  ["454303", "JP-45", "\u690E\u8449\u6751"],
  ["454311", "JP-45", "\u7F8E\u90F7\u753A"],
  ["454419", "JP-45", "\u9AD8\u5343\u7A42\u753A"],
  ["454427", "JP-45", "\u65E5\u4E4B\u5F71\u753A"],
  ["454435", "JP-45", "\u4E94\u30F6\u702C\u753A"],
  ["462012", "JP-46", "\u9E7F\u5150\u5CF6\u5E02"],
  ["462039", "JP-46", "\u9E7F\u5C4B\u5E02"],
  ["462047", "JP-46", "\u6795\u5D0E\u5E02"],
  ["462063", "JP-46", "\u963F\u4E45\u6839\u5E02"],
  ["462080", "JP-46", "\u51FA\u6C34\u5E02"],
  ["462101", "JP-46", "\u6307\u5BBF\u5E02"],
  ["462136", "JP-46", "\u897F\u4E4B\u8868\u5E02"],
  ["462144", "JP-46", "\u5782\u6C34\u5E02"],
  ["462152", "JP-46", "\u85A9\u6469\u5DDD\u5185\u5E02"],
  ["462161", "JP-46", "\u65E5\u7F6E\u5E02"],
  ["462179", "JP-46", "\u66FD\u65BC\u5E02"],
  ["462187", "JP-46", "\u9727\u5CF6\u5E02"],
  ["462195", "JP-46", "\u3044\u3061\u304D\u4E32\u6728\u91CE\u5E02"],
  ["462209", "JP-46", "\u5357\u3055\u3064\u307E\u5E02"],
  ["462217", "JP-46", "\u5FD7\u5E03\u5FD7\u5E02"],
  ["462225", "JP-46", "\u5944\u7F8E\u5E02"],
  ["462233", "JP-46", "\u5357\u4E5D\u5DDE\u5E02"],
  ["462241", "JP-46", "\u4F0A\u4F50\u5E02"],
  ["462250", "JP-46", "\u59F6\u826F\u5E02"],
  ["463035", "JP-46", "\u4E09\u5CF6\u6751"],
  ["463043", "JP-46", "\u5341\u5CF6\u6751"],
  ["463922", "JP-46", "\u3055\u3064\u307E\u753A"],
  ["464040", "JP-46", "\u9577\u5CF6\u753A"],
  ["464520", "JP-46", "\u6E67\u6C34\u753A"],
  ["464686", "JP-46", "\u5927\u5D0E\u753A"],
  ["464821", "JP-46", "\u6771\u4E32\u826F\u753A"],
  ["464902", "JP-46", "\u9326\u6C5F\u753A"],
  ["464911", "JP-46", "\u5357\u5927\u9685\u753A"],
  ["464929", "JP-46", "\u809D\u4ED8\u753A"],
  ["465011", "JP-46", "\u4E2D\u7A2E\u5B50\u753A"],
  ["465020", "JP-46", "\u5357\u7A2E\u5B50\u753A"],
  ["465054", "JP-46", "\u5C4B\u4E45\u5CF6\u753A"],
  ["465232", "JP-46", "\u5927\u548C\u6751"],
  ["465241", "JP-46", "\u5B87\u691C\u6751"],
  ["465259", "JP-46", "\u702C\u6238\u5185\u753A"],
  ["465275", "JP-46", "\u9F8D\u90F7\u753A"],
  ["465291", "JP-46", "\u559C\u754C\u753A"],
  ["465305", "JP-46", "\u5FB3\u4E4B\u5CF6\u753A"],
  ["465313", "JP-46", "\u5929\u57CE\u753A"],
  ["465321", "JP-46", "\u4F0A\u4ED9\u753A"],
  ["465330", "JP-46", "\u548C\u6CCA\u753A"],
  ["465348", "JP-46", "\u77E5\u540D\u753A"],
  ["465356", "JP-46", "\u4E0E\u8AD6\u753A"],
  ["472018", "JP-47", "\u90A3\u8987\u5E02"],
  ["472051", "JP-47", "\u5B9C\u91CE\u6E7E\u5E02"],
  ["472077", "JP-47", "\u77F3\u57A3\u5E02"],
  ["472085", "JP-47", "\u6D66\u6DFB\u5E02"],
  ["472093", "JP-47", "\u540D\u8B77\u5E02"],
  ["472107", "JP-47", "\u7CF8\u6E80\u5E02"],
  ["472115", "JP-47", "\u6C96\u7E04\u5E02"],
  ["472123", "JP-47", "\u8C4A\u898B\u57CE\u5E02"],
  ["472131", "JP-47", "\u3046\u308B\u307E\u5E02"],
  ["472140", "JP-47", "\u5BAE\u53E4\u5CF6\u5E02"],
  ["472158", "JP-47", "\u5357\u57CE\u5E02"],
  ["473014", "JP-47", "\u56FD\u982D\u6751"],
  ["473022", "JP-47", "\u5927\u5B9C\u5473\u6751"],
  ["473031", "JP-47", "\u6771\u6751"],
  ["473065", "JP-47", "\u4ECA\u5E30\u4EC1\u6751"],
  ["473081", "JP-47", "\u672C\u90E8\u753A"],
  ["473111", "JP-47", "\u6069\u7D0D\u6751"],
  ["473138", "JP-47", "\u5B9C\u91CE\u5EA7\u6751"],
  ["473146", "JP-47", "\u91D1\u6B66\u753A"],
  ["473154", "JP-47", "\u4F0A\u6C5F\u6751"],
  ["473243", "JP-47", "\u8AAD\u8C37\u6751"],
  ["473251", "JP-47", "\u5609\u624B\u7D0D\u753A"],
  ["473260", "JP-47", "\u5317\u8C37\u753A"],
  ["473278", "JP-47", "\u5317\u4E2D\u57CE\u6751"],
  ["473286", "JP-47", "\u4E2D\u57CE\u6751"],
  ["473294", "JP-47", "\u897F\u539F\u753A"],
  ["473481", "JP-47", "\u4E0E\u90A3\u539F\u753A"],
  ["473502", "JP-47", "\u5357\u98A8\u539F\u753A"],
  ["473537", "JP-47", "\u6E21\u5609\u6577\u6751"],
  ["473545", "JP-47", "\u5EA7\u9593\u5473\u6751"],
  ["473553", "JP-47", "\u7C9F\u56FD\u6751"],
  ["473561", "JP-47", "\u6E21\u540D\u559C\u6751"],
  ["473570", "JP-47", "\u5357\u5927\u6771\u6751"],
  ["473588", "JP-47", "\u5317\u5927\u6771\u6751"],
  ["473596", "JP-47", "\u4F0A\u5E73\u5C4B\u6751"],
  ["473600", "JP-47", "\u4F0A\u662F\u540D\u6751"],
  ["473618", "JP-47", "\u4E45\u7C73\u5CF6\u753A"],
  ["473626", "JP-47", "\u516B\u91CD\u702C\u753A"],
  ["473758", "JP-47", "\u591A\u826F\u9593\u6751"],
  ["473812", "JP-47", "\u7AF9\u5BCC\u753A"],
  ["473821", "JP-47", "\u4E0E\u90A3\u56FD\u753A"]
];

// src/regions.ts
var subdivisionsByCountry = /* @__PURE__ */ new Map();
var subdivisionsByCode = /* @__PURE__ */ new Map();
for (const [code, countryCode, name] of SUBDIVISION_RECORDS) {
  const option = { code, name };
  subdivisionsByCode.set(code, option);
  const countryOptions = subdivisionsByCountry.get(countryCode) ?? [];
  countryOptions.push(option);
  subdivisionsByCountry.set(countryCode, countryOptions);
}
var municipalitiesBySubdivision = /* @__PURE__ */ new Map();
var municipalitiesByCode = /* @__PURE__ */ new Map();
for (const [code, subdivisionCode, name] of JAPAN_MUNICIPALITY_RECORDS) {
  const option = { code, name };
  municipalitiesByCode.set(code, { ...option, subdivisionCode });
  const subdivisionOptions = municipalitiesBySubdivision.get(subdivisionCode) ?? [];
  subdivisionOptions.push(option);
  municipalitiesBySubdivision.set(subdivisionCode, subdivisionOptions);
}
var listRegions = /* @__PURE__ */ __name((url) => {
  const countryCode = (url.searchParams.get("countryCode") ?? "").normalize("NFKC").toUpperCase();
  const subdivisionCode = (url.searchParams.get("subdivisionCode") ?? "").normalize("NFKC").toUpperCase();
  if (!/^[A-Z]{2}$/u.test(countryCode)) {
    throw new ApiError(400, "INVALID_COUNTRY", "countryCode must be ISO 3166-1 alpha-2.");
  }
  if (subdivisionCode && !/^[A-Z]{2}-[A-Z0-9]{1,3}$/u.test(subdivisionCode)) {
    throw new ApiError(400, "INVALID_SUBDIVISION", "subdivisionCode must be a complete ISO 3166-2 code.");
  }
  if (subdivisionCode && !subdivisionCode.startsWith(`${countryCode}-`)) {
    throw new ApiError(400, "REGION_FIELD_CONFLICT", "subdivisionCode does not belong to countryCode.");
  }
  const subdivisions = subdivisionsByCountry.get(countryCode) ?? [];
  const municipalities = countryCode === "JP" && subdivisionCode ? municipalitiesBySubdivision.get(subdivisionCode) ?? [] : [];
  return json({ version: REGION_DATA_VERSION, subdivisions, municipalities });
}, "listRegions");
var getSubdivision = /* @__PURE__ */ __name((code) => subdivisionsByCode.get(code) ?? null, "getSubdivision");
var getMunicipality = /* @__PURE__ */ __name((code) => municipalitiesByCode.get(code) ?? null, "getMunicipality");
var hasValidMunicipalityCheckDigit = /* @__PURE__ */ __name((code) => {
  if (!/^\d{6}$/u.test(code)) return false;
  const digits = [...code].map(Number);
  const weighted = digits.slice(0, 5).reduce((sum2, digit, index) => sum2 + digit * (6 - index), 0);
  return digits[5] === (11 - weighted % 11) % 10;
}, "hasValidMunicipalityCheckDigit");

// src/validation.ts
var validatePairRequest = /* @__PURE__ */ __name((value) => {
  if (!isRecord(value)) throw new ApiError(400, "INVALID_BODY", "Request body must be an object.");
  requireExactKeys(value, ["pairingCode"]);
  const pairingCode = requireString(value.pairingCode, "pairingCode", 9, 9).toUpperCase();
  if (!/^[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/u.test(pairingCode)) {
    throw new ApiError(400, "INVALID_PAIRING_CODE", "Pairing code format is invalid.");
  }
  return { pairingCode };
}, "validatePairRequest");
var validateDeviceDraft = /* @__PURE__ */ __name((value) => {
  if (!isRecord(value)) throw new ApiError(400, "INVALID_BODY", "Request body must be an object.");
  requireExactKeys(value, ["name", "countryCode", "subdivisionCode", "municipalityCode", "admin1Code", "localityName", "isPublic", "publicLatitude", "publicLongitude"]);
  const name = requireString(value.name, "name", 1, 80);
  const countryCode = requireString(value.countryCode, "countryCode", 2, 2).normalize("NFKC").toUpperCase();
  if (!/^[A-Z]{2}$/u.test(countryCode)) throw new ApiError(400, "INVALID_COUNTRY", "countryCode must be ISO 3166-1 alpha-2.");
  let subdivisionCode = optionalString(value.subdivisionCode, "subdivisionCode", 6)?.normalize("NFKC").toUpperCase() ?? null;
  const municipalityCode = optionalString(value.municipalityCode, "municipalityCode", 6)?.normalize("NFKC") ?? null;
  const legacyAdmin1Code = optionalString(value.admin1Code, "admin1Code", 32);
  const legacyLocalityName = optionalString(value.localityName, "localityName", 80);
  if (subdivisionCode) {
    if (!/^[A-Z]{2}-[A-Z0-9]{1,3}$/u.test(subdivisionCode) || !getSubdivision(subdivisionCode)) {
      throw new ApiError(400, "INVALID_SUBDIVISION", "subdivisionCode must be a current complete ISO 3166-2 code.");
    }
    if (!subdivisionCode.startsWith(`${countryCode}-`)) {
      throw new ApiError(400, "REGION_FIELD_CONFLICT", "subdivisionCode does not belong to countryCode.");
    }
  }
  const municipality = municipalityCode ? getMunicipality(municipalityCode) : null;
  if (municipalityCode) {
    if (countryCode !== "JP") {
      throw new ApiError(400, "INVALID_MUNICIPALITY", "municipalityCode is available only when countryCode is JP.");
    }
    if (!hasValidMunicipalityCheckDigit(municipalityCode) || !municipality) {
      throw new ApiError(400, "INVALID_MUNICIPALITY", "municipalityCode must be a current six-digit Japanese local public body code with a valid check digit.");
    }
    if (subdivisionCode && municipality.subdivisionCode !== subdivisionCode) {
      throw new ApiError(400, "REGION_FIELD_CONFLICT", "municipalityCode does not belong to subdivisionCode.");
    }
    subdivisionCode ??= municipality.subdivisionCode;
  }
  if (subdivisionCode && legacyAdmin1Code && legacyAdmin1Code.normalize("NFKC").toUpperCase() !== subdivisionCode) {
    throw new ApiError(400, "REGION_FIELD_CONFLICT", "admin1Code conflicts with subdivisionCode.");
  }
  if (municipality && legacyLocalityName && legacyLocalityName !== municipality.name) {
    throw new ApiError(400, "REGION_FIELD_CONFLICT", "localityName conflicts with municipalityCode.");
  }
  const isPublic = value.isPublic === true;
  if (value.isPublic !== void 0 && typeof value.isPublic !== "boolean") throw new ApiError(400, "INVALID_PUBLIC_LOCATION", "isPublic must be boolean.");
  const publicLatitude = coordinate(value.publicLatitude, "publicLatitude", -90, 90);
  const publicLongitude = coordinate(value.publicLongitude, "publicLongitude", -180, 180);
  if (isPublic && (publicLatitude === null || publicLongitude === null)) {
    throw new ApiError(400, "PUBLIC_LOCATION_REQUIRED", "Select an approximate public map location.");
  }
  return {
    name,
    countryCode,
    subdivisionCode,
    municipalityCode,
    admin1Code: subdivisionCode ?? legacyAdmin1Code,
    localityName: municipality?.name ?? legacyLocalityName,
    isPublic,
    publicLatitude: isPublic ? publicLatitude : null,
    publicLongitude: isPublic ? publicLongitude : null
  };
}, "validateDeviceDraft");
var validateProfileDraft = /* @__PURE__ */ __name((value) => {
  if (!isRecord(value)) throw new ApiError(400, "INVALID_BODY", "Request body must be an object.");
  requireExactKeys(value, ["displayName", "xUrl", "githubUrl", "instagramUrl"]);
  return {
    displayName: requireString(value.displayName, "displayName", 1, 60),
    xUrl: socialUrl(value.xUrl, "xUrl", ["x.com"]),
    githubUrl: socialUrl(value.githubUrl, "githubUrl", ["github.com"]),
    instagramUrl: socialUrl(value.instagramUrl, "instagramUrl", ["instagram.com"])
  };
}, "validateProfileDraft");
var coordinate = /* @__PURE__ */ __name((value, field, minimum, maximum) => {
  if (value === void 0 || value === null || value === "") return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < minimum || value > maximum) {
    throw new ApiError(400, "INVALID_PUBLIC_LOCATION", `${field} is outside the accepted range.`);
  }
  return Math.round(value * 10) / 10;
}, "coordinate");
var socialUrl = /* @__PURE__ */ __name((value, field, hosts) => {
  const raw = optionalString(value, field, 240);
  if (!raw) return null;
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new ApiError(400, "INVALID_SOCIAL_URL", `${field} must be a valid HTTPS profile URL.`);
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./u, "");
  const segments = parsed.pathname.split("/").filter(Boolean);
  if (parsed.protocol !== "https:" || !hosts.includes(host) || parsed.port || parsed.username || parsed.password || parsed.search || parsed.hash || segments.length !== 1 || !/^[A-Za-z0-9_.-]{1,80}$/u.test(segments[0] ?? "")) {
    throw new ApiError(400, "INVALID_SOCIAL_URL", `${field} must be an HTTPS account profile URL.`);
  }
  return `https://${host}/${segments[0]}`;
}, "socialUrl");
var validateTelemetry = /* @__PURE__ */ __name((value) => {
  if (!isRecord(value)) throw new ApiError(400, "INVALID_BODY", "Request body must be an object.");
  requireExactKeys(value, ["seq", "observedAt", "data"]);
  if (!Number.isSafeInteger(value.seq) || value.seq < 0) {
    throw new ApiError(400, "INVALID_SEQUENCE", "seq must be a non-negative safe integer.");
  }
  let observedAt = null;
  if (value.observedAt !== void 0 && value.observedAt !== null) {
    observedAt = requireString(value.observedAt, "observedAt", 20, 35);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/u.test(observedAt)) {
      throw new ApiError(400, "INVALID_TIMESTAMP", "observedAt must be an RFC 3339 UTC timestamp.");
    }
    const timestamp = Date.parse(observedAt);
    if (!Number.isFinite(timestamp)) {
      throw new ApiError(400, "INVALID_TIMESTAMP", "observedAt must be an RFC 3339 UTC timestamp.");
    }
    const skew = Math.abs(Date.now() - timestamp);
    if (skew > 31 * 24 * 60 * 60 * 1e3) {
      throw new ApiError(400, "INVALID_TIMESTAMP", "observedAt must be within 31 days of receipt.");
    }
  }
  if (!isRecord(value.data)) throw new ApiError(400, "INVALID_SENSOR_DATA", "data must be an object.");
  const entries = Object.entries(value.data);
  if (entries.length < 1 || entries.length > 16) {
    throw new ApiError(400, "INVALID_SENSOR_DATA", "data must contain between 1 and 16 measurements.");
  }
  const data = {};
  for (const [key, measurement] of entries) {
    if (!/^[a-z][a-z0-9_]{0,31}$/u.test(key)) throw new ApiError(400, "INVALID_SENSOR_KEY", `Invalid sensor key: ${key}.`);
    if (typeof measurement !== "number" || !Number.isFinite(measurement)) {
      throw new ApiError(400, "INVALID_SENSOR_VALUE", `${key} must be a finite number.`);
    }
    const range = SENSOR_RANGES[key];
    if (range && (measurement < range[0] || measurement > range[1])) {
      throw new ApiError(400, "SENSOR_VALUE_OUT_OF_RANGE", `${key} is outside the accepted demo range.`);
    }
    if (!range && Math.abs(measurement) > 1e6) {
      throw new ApiError(400, "SENSOR_VALUE_OUT_OF_RANGE", `${key} is outside the accepted numeric range.`);
    }
    data[key] = measurement;
  }
  return { seq: value.seq, observedAt: observedAt === null ? null : new Date(observedAt).toISOString(), data };
}, "validateTelemetry");
var SENSOR_RANGES = {
  temperature: [-80, 100],
  humidity: [0, 100],
  pm25: [0, 5e3],
  pm10: [0, 5e3],
  voc: [0, 1e5],
  nox: [0, 1e5]
};

// src/devices.ts
var listCountries = /* @__PURE__ */ __name(async (env) => {
  const result = await env.DB.prepare(
    "SELECT code, name_en AS nameEn, name_local AS nameLocal FROM countries WHERE enabled = 1 ORDER BY COALESCE(name_local, name_en)"
  ).all();
  return json({ countries: result.results });
}, "listCountries");
var createPairing = /* @__PURE__ */ __name(async (request, env, user) => {
  await requireCsrf(request, user);
  const draft = validateDeviceDraft(await readJson(request, 4096));
  const country = await env.DB.prepare("SELECT code FROM countries WHERE code = ?1 AND enabled = 1").bind(draft.countryCode).first();
  if (!country) throw new ApiError(400, "INVALID_COUNTRY", "Selected country is not enabled.");
  const code = randomPairingCode();
  const now = /* @__PURE__ */ new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1e3).toISOString();
  await env.DB.prepare(
    `INSERT INTO device_pairing_codes
      (id, code_hash, user_id, device_name, country_code, subdivision_code, municipality_code,
       admin1_code, locality_name, public_latitude, public_longitude, is_public, expires_at, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)`
  ).bind(
    crypto.randomUUID(),
    await hmacHex(env.PAIRING_CODE_PEPPER, code),
    user.id,
    draft.name,
    draft.countryCode,
    draft.subdivisionCode,
    draft.municipalityCode,
    draft.admin1Code,
    draft.localityName,
    draft.publicLatitude,
    draft.publicLongitude,
    draft.isPublic ? 1 : 0,
    expiresAt,
    now.toISOString()
  ).run();
  return json({ pairingCode: code, expiresAt }, 201);
}, "createPairing");
var pairDevice = /* @__PURE__ */ __name(async (request, env) => {
  const { pairingCode } = validatePairRequest(await readJson(request, 2048));
  const codeHash = await hmacHex(env.PAIRING_CODE_PEPPER, pairingCode);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const deviceId = `dev_${randomIdentifier(12)}`;
  const databaseId = crypto.randomUUID();
  const rawToken = randomToken("gdt_");
  const tokenHash = await hmacHex(env.DEVICE_TOKEN_PEPPER, rawToken);
  const results = await env.DB.batch([
    env.DB.prepare(
      `UPDATE device_pairing_codes
       SET used_at = ?1, consumed_by_device_id = ?3
       WHERE code_hash = ?2 AND used_at IS NULL AND expires_at > ?1
       RETURNING id, user_id, device_name, country_code, subdivision_code, municipality_code,
         admin1_code, locality_name,
         public_latitude, public_longitude, is_public`
    ).bind(now, codeHash, databaseId),
    env.DB.prepare(
      `INSERT INTO devices
        (id, public_id, device_id, owner_user_id, name, token_hash, country_code, subdivision_code,
         municipality_code, admin1_code, locality_name,
         public_latitude, public_longitude, is_public, location_precision, created_at, updated_at)
       SELECT ?1, ?2, ?3, user_id, device_name, ?4, country_code, subdivision_code,
         municipality_code, admin1_code, locality_name,
         public_latitude, public_longitude, is_public,
         CASE WHEN municipality_code IS NOT NULL OR locality_name IS NOT NULL THEN 'LOCALITY'
              WHEN subdivision_code IS NOT NULL OR admin1_code IS NOT NULL THEN 'ADMIN1' ELSE 'COUNTRY' END,
         ?5, ?5
       FROM device_pairing_codes
       WHERE code_hash = ?6 AND used_at = ?5 AND consumed_by_device_id = ?1`
    ).bind(databaseId, `sensor_${randomIdentifier(16)}`, deviceId, tokenHash, now, codeHash)
  ]);
  const consumedRows = results[0]?.results;
  const inserted = results[1]?.meta.changes ?? 0;
  if (!consumedRows?.[0] || inserted !== 1) {
    throw new ApiError(409, "PAIRING_CODE_UNAVAILABLE", "Pairing code is invalid, expired, or already used.");
  }
  return json({ deviceId, deviceToken: rawToken, tokenType: "Bearer" }, 201);
}, "pairDevice");
var acceptTelemetry = /* @__PURE__ */ __name(async (request, env, deviceId) => {
  const authorization = request.headers.get("Authorization") ?? "";
  const tokenMatch = /^Bearer ([A-Za-z0-9_-]{40,128})$/u.exec(authorization);
  if (!tokenMatch?.[1]) throw new ApiError(401, "INVALID_DEVICE_TOKEN", "Device authentication failed.");
  const device = await env.DB.prepare(
    "SELECT token_hash, status FROM devices WHERE device_id = ?1 AND deleted_at IS NULL"
  ).bind(deviceId).first();
  const providedHash = await hmacHex(env.DEVICE_TOKEN_PEPPER, tokenMatch[1]);
  if (!device || device.status !== "ACTIVE" || !await timingSafeHexEqual(providedHash, device.token_hash)) {
    throw new ApiError(401, "INVALID_DEVICE_TOKEN", "Device authentication failed.");
  }
  const telemetry = validateTelemetry(await readJson(request, 12 * 1024));
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const canonicalData = Object.fromEntries(Object.entries(telemetry.data).sort(([left], [right]) => left.localeCompare(right)));
  const payload = JSON.stringify(canonicalData);
  const payloadHash = await sha256Hex(JSON.stringify({ observedAt: telemetry.observedAt, data: canonicalData }));
  const results = await env.DB.batch([
    env.DB.prepare(
      `UPDATE devices
       SET last_seq = ?1, last_payload_hash = ?2, last_seen_at = ?3, updated_at = ?3
       WHERE device_id = ?4 AND status = 'ACTIVE' AND deleted_at IS NULL
         AND (last_seq IS NULL OR ?1 > last_seq)
       RETURNING device_id`
    ).bind(telemetry.seq, payloadHash, now, deviceId),
    env.DB.prepare(
      `INSERT INTO telemetry
        (id, device_id, seq, observed_at, received_at, payload_hash, payload_json, created_at)
       SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?5
       FROM devices
       WHERE device_id = ?2 AND last_seq = ?3 AND last_payload_hash = ?6
         AND status = 'ACTIVE' AND deleted_at IS NULL
         AND NOT EXISTS (SELECT 1 FROM telemetry WHERE device_id = ?2 AND seq = ?3)`
    ).bind(crypto.randomUUID(), deviceId, telemetry.seq, telemetry.observedAt, now, payloadHash, payload)
  ]);
  const claimed = (results[0]?.meta.changes ?? 0) === 1;
  const created = (results[1]?.meta.changes ?? 0) === 1;
  if (claimed && created) return json({ accepted: true, duplicate: false, receivedAt: now }, 202);
  if (claimed !== created) throw new ApiError(409, "SEQUENCE_RACE", "Telemetry sequence could not be committed.");
  const existing = await env.DB.prepare(
    "SELECT payload_hash AS payloadHash FROM telemetry WHERE device_id = ?1 AND seq = ?2"
  ).bind(deviceId, telemetry.seq).first();
  if (!existing) throw new ApiError(409, "STALE_SEQUENCE", "seq is lower than the device's latest accepted sequence.");
  if (!await timingSafeHexEqual(payloadHash, existing.payloadHash)) {
    throw new ApiError(409, "SEQUENCE_CONFLICT", "This seq was already used with different telemetry content.");
  }
  await env.DB.prepare(
    `UPDATE devices SET last_seen_at = ?1, updated_at = ?1
     WHERE device_id = ?2 AND last_seq = ?3 AND last_payload_hash = ?4
       AND status = 'ACTIVE' AND deleted_at IS NULL`
  ).bind(now, deviceId, telemetry.seq, payloadHash).run();
  return json({ accepted: true, duplicate: true, receivedAt: now }, 200);
}, "acceptTelemetry");
var listDevices = /* @__PURE__ */ __name(async (env, user) => {
  const threshold = onlineThreshold(env);
  const result = await env.DB.prepare(
    `SELECT d.device_id AS deviceId, d.name, d.country_code AS countryCode,
       COALESCE(c.name_local, c.name_en) AS countryName,
       d.subdivision_code AS subdivisionCode, d.municipality_code AS municipalityCode,
       d.admin1_code AS admin1Code,
       d.locality_name AS localityName,
       CASE WHEN datetime(d.last_seen_at) >= datetime('now', ?1) THEN 'ONLINE' ELSE 'OFFLINE' END AS state,
       d.last_seen_at AS lastSeenAt, d.created_at AS createdAt, d.is_public AS isPublic,
       d.public_latitude AS publicLatitude, d.public_longitude AS publicLongitude
     FROM devices d JOIN countries c ON c.code = d.country_code
     WHERE d.owner_user_id = ?2 AND d.status = 'ACTIVE' AND d.deleted_at IS NULL
     ORDER BY d.created_at DESC`
  ).bind(`-${threshold} seconds`, user.id).all();
  return json({ devices: result.results.map(serializeDevice) });
}, "listDevices");
var getDevice = /* @__PURE__ */ __name(async (env, user, deviceId) => {
  const device = await ownedDevice(env, user.id, deviceId);
  return json({ device: serializeDevice(device) });
}, "getDevice");
var getLatest = /* @__PURE__ */ __name(async (env, user, deviceId) => {
  const device = await ownedDevice(env, user.id, deviceId);
  const latest = await env.DB.prepare(
    `SELECT seq, observed_at AS observedAt, received_at AS receivedAt, payload_json AS payloadJson
     FROM telemetry WHERE device_id = ?1 ORDER BY received_at DESC, seq DESC LIMIT 1`
  ).bind(deviceId).first();
  return json({ device: serializeDevice(device), latest: latest ? serializeTelemetry(latest) : null });
}, "getLatest");
var getHistory = /* @__PURE__ */ __name(async (env, user, deviceId, url) => {
  await ownedDevice(env, user.id, deviceId);
  const limit = parseLimit(url.searchParams.get("limit"));
  const from = parseDateQuery(url.searchParams.get("from"), "from");
  const to = parseDateQuery(url.searchParams.get("to"), "to");
  if (from && to && from > to) throw new ApiError(400, "INVALID_TIME_RANGE", "from must not be after to.");
  const result = await env.DB.prepare(
    `SELECT t.seq, t.observed_at AS observedAt, t.received_at AS receivedAt, t.payload_json AS payloadJson
     FROM telemetry t
     JOIN devices d ON d.device_id = t.device_id
     WHERE t.device_id = ?1 AND d.owner_user_id = ?2 AND d.status = 'ACTIVE' AND d.deleted_at IS NULL
       AND (?3 IS NULL OR t.received_at >= ?3)
       AND (?4 IS NULL OR t.received_at <= ?4)
     ORDER BY t.received_at DESC, t.seq DESC LIMIT ?5`
  ).bind(deviceId, user.id, from, to, limit).all();
  return json({ deviceId, telemetry: result.results.map(serializeTelemetry) });
}, "getHistory");
var updateDevice = /* @__PURE__ */ __name(async (request, env, user, deviceId) => {
  await requireCsrf(request, user);
  const draft = validateDeviceDraft(await readJson(request, 4096));
  const country = await env.DB.prepare("SELECT code FROM countries WHERE code = ?1 AND enabled = 1").bind(draft.countryCode).first();
  if (!country) throw new ApiError(400, "INVALID_COUNTRY", "Selected country is not enabled.");
  const result = await env.DB.prepare(
    `UPDATE devices SET name = ?1, country_code = ?2, subdivision_code = ?3, municipality_code = ?4,
       admin1_code = ?5, locality_name = ?6, is_public = ?7, public_latitude = ?8, public_longitude = ?9,
       location_precision = CASE WHEN ?4 IS NOT NULL OR ?6 IS NOT NULL THEN 'LOCALITY'
         WHEN ?3 IS NOT NULL OR ?5 IS NOT NULL THEN 'ADMIN1' ELSE 'COUNTRY' END,
       updated_at = ?10
     WHERE device_id = ?11 AND owner_user_id = ?12 AND status = 'ACTIVE' AND deleted_at IS NULL`
  ).bind(
    draft.name,
    draft.countryCode,
    draft.subdivisionCode,
    draft.municipalityCode,
    draft.admin1Code,
    draft.localityName,
    draft.isPublic ? 1 : 0,
    draft.publicLatitude,
    draft.publicLongitude,
    (/* @__PURE__ */ new Date()).toISOString(),
    deviceId,
    user.id
  ).run();
  if (result.meta.changes !== 1) throw new ApiError(404, "DEVICE_NOT_FOUND", "Device was not found.");
  return getDevice(env, user, deviceId);
}, "updateDevice");
var revokeDevice = /* @__PURE__ */ __name(async (request, env, user, deviceId) => {
  await requireCsrf(request, user);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const result = await env.DB.prepare(
    `UPDATE devices SET status = 'REVOKED', deleted_at = ?1, updated_at = ?1
     WHERE device_id = ?2 AND owner_user_id = ?3 AND status = 'ACTIVE' AND deleted_at IS NULL`
  ).bind(now, deviceId, user.id).run();
  if (result.meta.changes !== 1) throw new ApiError(404, "DEVICE_NOT_FOUND", "Device was not found.");
  return new Response(null, { status: 204 });
}, "revokeDevice");
var ownedDevice = /* @__PURE__ */ __name(async (env, userId, deviceId) => {
  const threshold = onlineThreshold(env);
  const device = await env.DB.prepare(
    `SELECT d.device_id AS deviceId, d.name, d.country_code AS countryCode,
       COALESCE(c.name_local, c.name_en) AS countryName,
       d.subdivision_code AS subdivisionCode, d.municipality_code AS municipalityCode,
       d.admin1_code AS admin1Code,
       d.locality_name AS localityName,
       CASE WHEN datetime(d.last_seen_at) >= datetime('now', ?1) THEN 'ONLINE' ELSE 'OFFLINE' END AS state,
       d.last_seen_at AS lastSeenAt, d.created_at AS createdAt, d.is_public AS isPublic,
       d.public_latitude AS publicLatitude, d.public_longitude AS publicLongitude
     FROM devices d JOIN countries c ON c.code = d.country_code
     WHERE d.device_id = ?2 AND d.owner_user_id = ?3 AND d.status = 'ACTIVE' AND d.deleted_at IS NULL`
  ).bind(`-${threshold} seconds`, deviceId, userId).first();
  if (!device) throw new ApiError(404, "DEVICE_NOT_FOUND", "Device was not found.");
  return device;
}, "ownedDevice");
var listPublicSensors = /* @__PURE__ */ __name(async (env) => {
  const threshold = onlineThreshold(env);
  const result = await env.DB.prepare(
    `SELECT d.public_id AS id, d.name AS sensorName, d.country_code AS countryCode,
       d.subdivision_code AS subdivisionCode, d.public_latitude AS latitude,
       d.public_longitude AS longitude,
       CASE WHEN datetime(d.last_seen_at) >= datetime('now', ?1) THEN 'ONLINE' ELSE 'OFFLINE' END AS state,
       u.public_id AS ownerPublicId, u.display_name AS ownerDisplayName,
       CASE WHEN u.avatar_png IS NULL THEN 0 ELSE 1 END AS hasAvatar,
       u.avatar_updated_at AS avatarUpdatedAt,
       u.x_url AS xUrl, u.github_url AS githubUrl, u.instagram_url AS instagramUrl
     FROM devices d JOIN users u ON u.id = d.owner_user_id
     WHERE d.is_public = 1 AND d.status = 'ACTIVE' AND d.deleted_at IS NULL
       AND d.public_latitude IS NOT NULL AND d.public_longitude IS NOT NULL
     ORDER BY d.created_at DESC LIMIT 500`
  ).bind(`-${threshold} seconds`).all();
  return json({
    sensors: result.results.map((row) => ({
      id: row.id,
      sensorName: row.sensorName,
      location: { latitude: row.latitude, longitude: row.longitude, precision: "APPROXIMATE_0_1_DEGREE" },
      region: {
        countryCode: row.countryCode,
        subdivisionCode: row.subdivisionCode,
        subdivisionName: row.subdivisionCode ? getSubdivision(row.subdivisionCode)?.name ?? null : null
      },
      state: row.state,
      owner: {
        displayName: row.ownerDisplayName,
        avatarUrl: row.hasAvatar === 1 ? `/api/public/v1/profiles/${encodeURIComponent(row.ownerPublicId)}/avatar?v=${encodeURIComponent(row.avatarUpdatedAt ?? "1")}` : null,
        xUrl: row.xUrl,
        githubUrl: row.githubUrl,
        instagramUrl: row.instagramUrl
      }
    }))
  });
}, "listPublicSensors");
var serializeTelemetry = /* @__PURE__ */ __name((row) => ({
  seq: row.seq,
  observedAt: row.observedAt,
  receivedAt: row.receivedAt,
  data: JSON.parse(row.payloadJson)
}), "serializeTelemetry");
var serializeDevice = /* @__PURE__ */ __name((device) => ({
  ...device,
  subdivisionName: device.subdivisionCode ? getSubdivision(device.subdivisionCode)?.name ?? null : null,
  municipalityName: device.municipalityCode ? getMunicipality(device.municipalityCode)?.name ?? null : null,
  isPublic: device.isPublic === 1
}), "serializeDevice");
var parseLimit = /* @__PURE__ */ __name((value) => {
  if (value === null) return 100;
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new ApiError(400, "INVALID_LIMIT", "limit must be between 1 and 500.");
  return limit;
}, "parseLimit");
var parseDateQuery = /* @__PURE__ */ __name((value, name) => {
  if (value === null || value === "") return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new ApiError(400, "INVALID_TIME_RANGE", `${name} must be an ISO 8601 timestamp.`);
  return new Date(parsed).toISOString();
}, "parseDateQuery");
var onlineThreshold = /* @__PURE__ */ __name((env) => {
  const parsed = Number(env.ONLINE_THRESHOLD_SECONDS);
  return Number.isInteger(parsed) && parsed >= 5 && parsed <= 3600 ? parsed : 30;
}, "onlineThreshold");
var randomIdentifier = /* @__PURE__ */ __name((length) => {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}, "randomIdentifier");

// src/profiles.ts
var MAX_AVATAR_BYTES = 1024 * 1024;
var MAX_AVATAR_EDGE = 512;
var PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
var getProfile = /* @__PURE__ */ __name(async (env, user) => {
  const profile = await profileRow(env, user.id);
  return json({ profile: serializeProfile(profile) });
}, "getProfile");
var updateProfile = /* @__PURE__ */ __name(async (request, env, user) => {
  await requireCsrf(request, user);
  const draft = validateProfileDraft(await readJson(request, 4096));
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const result = await env.DB.prepare(
    `UPDATE users SET display_name = ?1, x_url = ?2, github_url = ?3, instagram_url = ?4, updated_at = ?5
     WHERE id = ?6`
  ).bind(draft.displayName, draft.xUrl, draft.githubUrl, draft.instagramUrl, now, user.id).run();
  if (result.meta.changes !== 1) throw new ApiError(404, "PROFILE_NOT_FOUND", "Profile was not found.");
  return getProfile(env, user);
}, "updateProfile");
var uploadAvatar = /* @__PURE__ */ __name(async (request, env, user) => {
  await requireCsrf(request, user);
  const type = request.headers.get("Content-Type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (type !== "image/png") throw new ApiError(415, "UNSUPPORTED_AVATAR_TYPE", "Avatar must be a PNG image.");
  const sanitized = sanitizePng(await readBytes(request, MAX_AVATAR_BYTES));
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const result = await env.DB.prepare(
    "UPDATE users SET avatar_png = ?1, avatar_updated_at = ?2, updated_at = ?2 WHERE id = ?3"
  ).bind(sanitized, now, user.id).run();
  if (result.meta.changes !== 1) throw new ApiError(404, "PROFILE_NOT_FOUND", "Profile was not found.");
  return getProfile(env, user);
}, "uploadAvatar");
var deleteAvatar = /* @__PURE__ */ __name(async (request, env, user) => {
  await requireCsrf(request, user);
  await env.DB.prepare(
    "UPDATE users SET avatar_png = NULL, avatar_updated_at = NULL, updated_at = ?1 WHERE id = ?2"
  ).bind((/* @__PURE__ */ new Date()).toISOString(), user.id).run();
  return new Response(null, { status: 204 });
}, "deleteAvatar");
var getPublicAvatar = /* @__PURE__ */ __name(async (env, publicId) => {
  const profile = await env.DB.prepare(
    "SELECT avatar_png AS avatarPng, avatar_updated_at AS avatarUpdatedAt FROM users WHERE public_id = ?1"
  ).bind(publicId).first();
  if (!profile?.avatarPng) throw new ApiError(404, "AVATAR_NOT_FOUND", "Avatar was not found.");
  const avatar = avatarBytes(profile.avatarPng);
  const headers = new Headers();
  headers.set("Content-Type", "image/png");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  if (profile.avatarUpdatedAt) headers.set("Last-Modified", new Date(profile.avatarUpdatedAt).toUTCString());
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(avatar, { headers });
}, "getPublicAvatar");
var profileRow = /* @__PURE__ */ __name(async (env, userId) => {
  const profile = await env.DB.prepare(
    `SELECT public_id AS publicId, display_name AS displayName,
       CASE WHEN avatar_png IS NULL THEN 0 ELSE 1 END AS hasAvatar,
       avatar_updated_at AS avatarUpdatedAt, x_url AS xUrl, github_url AS githubUrl,
       instagram_url AS instagramUrl
     FROM users WHERE id = ?1`
  ).bind(userId).first();
  if (!profile?.publicId) throw new ApiError(404, "PROFILE_NOT_FOUND", "Profile was not found.");
  return profile;
}, "profileRow");
var serializeProfile = /* @__PURE__ */ __name((profile) => ({
  publicId: profile.publicId,
  displayName: profile.displayName,
  avatarUrl: profile.hasAvatar === 1 ? `/api/public/v1/profiles/${encodeURIComponent(profile.publicId)}/avatar?v=${encodeURIComponent(profile.avatarUpdatedAt ?? "1")}` : null,
  xUrl: profile.xUrl,
  githubUrl: profile.githubUrl,
  instagramUrl: profile.instagramUrl
}), "serializeProfile");
var avatarBytes = /* @__PURE__ */ __name((value) => {
  if (Array.isArray(value)) return Uint8Array.from(value).buffer;
  if (value instanceof Uint8Array) {
    return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
  }
  return value;
}, "avatarBytes");
var sanitizePng = /* @__PURE__ */ __name((source) => {
  if (source.byteLength < 33 || !PNG_SIGNATURE.every((value, index) => source[index] === value)) {
    throw new ApiError(400, "INVALID_AVATAR", "Avatar is not a valid PNG image.");
  }
  const kept = [source.slice(0, 8)];
  let offset = 8;
  let sawHeader = false;
  let sawData = false;
  let sawEnd = false;
  while (offset + 12 <= source.byteLength && !sawEnd) {
    const length = readUint32(source, offset);
    const end = offset + 12 + length;
    if (length > MAX_AVATAR_BYTES || end > source.byteLength) throw new ApiError(400, "INVALID_AVATAR", "PNG chunks are invalid.");
    const type = new TextDecoder().decode(source.slice(offset + 4, offset + 8));
    if (!/^[A-Za-z]{4}$/u.test(type)) throw new ApiError(400, "INVALID_AVATAR", "PNG chunks are invalid.");
    const chunk = source.slice(offset, end);
    if (type === "IHDR") {
      if (sawHeader || offset !== 8 || length !== 13) throw new ApiError(400, "INVALID_AVATAR", "PNG header is invalid.");
      const width = readUint32(source, offset + 8);
      const height = readUint32(source, offset + 12);
      const bitDepth = source[offset + 16] ?? -1;
      const colorType = source[offset + 17] ?? -1;
      const interlace = source[offset + 20] ?? -1;
      if (width < 1 || height < 1 || width > MAX_AVATAR_EDGE || height > MAX_AVATAR_EDGE || bitDepth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) {
        throw new ApiError(400, "INVALID_AVATAR", `Avatar must be a non-interlaced RGB/RGBA PNG up to ${MAX_AVATAR_EDGE}px.`);
      }
      kept.push(chunk);
      sawHeader = true;
    } else if (type === "IDAT") {
      if (!sawHeader || sawEnd) throw new ApiError(400, "INVALID_AVATAR", "PNG image data is invalid.");
      kept.push(chunk);
      sawData = true;
    } else if (type === "IEND") {
      if (!sawHeader || !sawData || length !== 0) throw new ApiError(400, "INVALID_AVATAR", "PNG ending is invalid.");
      kept.push(chunk);
      sawEnd = true;
    } else if ((type.charCodeAt(0) & 32) === 0 || type === "acTL" || type === "fcTL" || type === "fdAT") {
      throw new ApiError(400, "INVALID_AVATAR", "Animated or unsupported PNG images are not accepted.");
    }
    offset = end;
  }
  if (!sawEnd || offset !== source.byteLength) throw new ApiError(400, "INVALID_AVATAR", "PNG ending is invalid.");
  const total = kept.reduce((sum2, chunk) => sum2 + chunk.byteLength, 0);
  const output = new Uint8Array(total);
  let outputOffset = 0;
  for (const chunk of kept) {
    output.set(chunk, outputOffset);
    outputOffset += chunk.byteLength;
  }
  return output;
}, "sanitizePng");
var readUint32 = /* @__PURE__ */ __name((source, offset) => (source[offset] ?? 0) * 16777216 + ((source[offset + 1] ?? 0) << 16) + ((source[offset + 2] ?? 0) << 8) + (source[offset + 3] ?? 0) >>> 0, "readUint32");

// src/index.ts
var DEVICE_PATTERN = /^\/api\/web\/v1\/devices\/(dev_[a-z0-9]+)$/u;
var LATEST_PATTERN = /^\/api\/web\/v1\/devices\/(dev_[a-z0-9]+)\/latest$/u;
var HISTORY_PATTERN = /^\/api\/web\/v1\/devices\/(dev_[a-z0-9]+)\/telemetry$/u;
var TELEMETRY_PATTERN = /^\/api\/v1\/devices\/(dev_[a-z0-9]+)\/telemetry$/u;
var PUBLIC_AVATAR_PATTERN = /^\/api\/public\/v1\/profiles\/(usr_[a-z0-9]+)\/avatar$/u;
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const requestId = crypto.randomUUID();
    try {
      assertTransport(url, env);
      if (request.method === "OPTIONS") return preflight(request, env);
      const response = await route(request, env, url);
      return secureResponse(response, request, env, requestId);
    } catch (error) {
      if (error instanceof ApiError) {
        const response = errorResponse(error);
        if (url.pathname === "/api/auth/google/callback") response.headers.append("Set-Cookie", clearCookie(OIDC_FLOW_COOKIE, true));
        return secureResponse(response, request, env, requestId);
      }
      console.error(JSON.stringify({ level: "error", event: "request_failed", requestId, method: request.method, path: url.pathname }));
      return secureResponse(errorResponse(new ApiError(500, "INTERNAL_ERROR", "The request could not be completed.")), request, env, requestId);
    }
  }
};
var route = /* @__PURE__ */ __name(async (request, env, url) => {
  if (request.method === "GET" && url.pathname === "/api/health") return json({ ok: true, service: "gaia-senseware-sensor-platform" });
  if (request.method === "GET" && url.pathname === "/api/auth/google/start") return startGoogleLogin(request, env);
  if (request.method === "GET" && url.pathname === "/api/auth/google/callback") return finishGoogleLogin(request, env);
  if (request.method === "POST" && url.pathname === "/api/auth/trial") return startTrialSession(request, env);
  if (request.method === "GET" && url.pathname === "/api/web/v1/session") return sessionResponse(request, env);
  if (request.method === "POST" && url.pathname === "/api/web/v1/logout") return logout(request, env);
  if (request.method === "POST" && url.pathname === "/api/v1/device/pair") return pairDevice(request, env);
  if (request.method === "GET" && url.pathname === "/api/public/v1/sensors") return listPublicSensors(env);
  const publicAvatarMatch = PUBLIC_AVATAR_PATTERN.exec(url.pathname);
  if (request.method === "GET" && publicAvatarMatch?.[1]) return getPublicAvatar(env, publicAvatarMatch[1]);
  const telemetryMatch = TELEMETRY_PATTERN.exec(url.pathname);
  if (request.method === "POST" && telemetryMatch?.[1]) return acceptTelemetry(request, env, telemetryMatch[1]);
  if (request.method === "GET" && url.pathname === "/api/web/v1/countries") {
    await getAuthenticatedUser(request, env);
    return listCountries(env);
  }
  const user = await getAuthenticatedUser(request, env);
  if (request.method === "GET" && url.pathname === "/api/web/v1/regions") return listRegions(url);
  if (request.method === "GET" && url.pathname === "/api/web/v1/profile") return getProfile(env, user);
  if (request.method === "PATCH" && url.pathname === "/api/web/v1/profile") return updateProfile(request, env, user);
  if (request.method === "PUT" && url.pathname === "/api/web/v1/profile/avatar") return uploadAvatar(request, env, user);
  if (request.method === "DELETE" && url.pathname === "/api/web/v1/profile/avatar") return deleteAvatar(request, env, user);
  if (request.method === "GET" && url.pathname === "/api/web/v1/devices") return listDevices(env, user);
  if (request.method === "POST" && url.pathname === "/api/web/v1/devices/pairing") return createPairing(request, env, user);
  const latestMatch = LATEST_PATTERN.exec(url.pathname);
  if (request.method === "GET" && latestMatch?.[1]) return getLatest(env, user, latestMatch[1]);
  const historyMatch = HISTORY_PATTERN.exec(url.pathname);
  if (request.method === "GET" && historyMatch?.[1]) return getHistory(env, user, historyMatch[1], url);
  const deviceMatch = DEVICE_PATTERN.exec(url.pathname);
  if (deviceMatch?.[1]) {
    if (request.method === "GET") return getDevice(env, user, deviceMatch[1]);
    if (request.method === "PATCH") return updateDevice(request, env, user, deviceMatch[1]);
    if (request.method === "DELETE") return revokeDevice(request, env, user, deviceMatch[1]);
  }
  throw new ApiError(404, "NOT_FOUND", "Endpoint was not found.");
}, "route");
var assertTransport = /* @__PURE__ */ __name((url, env) => {
  const local = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  if (url.protocol !== "https:" && !(env.ENVIRONMENT === "local" && local)) {
    throw new ApiError(400, "HTTPS_REQUIRED", "HTTPS is required.");
  }
}, "assertTransport");
var preflight = /* @__PURE__ */ __name((request, env) => {
  const origin = request.headers.get("Origin");
  if (origin !== env.WEB_ORIGIN) throw new ApiError(403, "ORIGIN_NOT_ALLOWED", "Origin is not allowed.");
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token",
      "Access-Control-Max-Age": "600",
      Vary: "Origin"
    }
  });
}, "preflight");
var secureResponse = /* @__PURE__ */ __name((response, request, env, requestId) => {
  const headers = new Headers(response.headers);
  headers.set("X-Request-Id", requestId);
  headers.set("X-Frame-Options", "DENY");
  headers.set("Permissions-Policy", "geolocation=(), camera=(), microphone=(), bluetooth=()");
  if (new URL(request.url).protocol === "https:") headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  const origin = request.headers.get("Origin");
  if (origin === env.WEB_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.append("Vary", "Origin");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}, "secureResponse");

// node_modules/@petamoriken/float16/src/_util/messages.mjs
var CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT = "Cannot convert undefined or null to object";

// node_modules/@petamoriken/float16/src/_util/primordials.mjs
function uncurryThis(target) {
  return (thisArg, ...args) => {
    return ReflectApply(target, thisArg, args);
  };
}
__name(uncurryThis, "uncurryThis");
function uncurryThisGetter(target, key) {
  return uncurryThis(
    ReflectGetOwnPropertyDescriptor(
      target,
      key
    ).get
  );
}
__name(uncurryThisGetter, "uncurryThisGetter");
var {
  apply: ReflectApply,
  construct: ReflectConstruct,
  defineProperty: ReflectDefineProperty,
  get: ReflectGet,
  getOwnPropertyDescriptor: ReflectGetOwnPropertyDescriptor,
  getPrototypeOf: ReflectGetPrototypeOf,
  has: ReflectHas,
  ownKeys: ReflectOwnKeys,
  set: ReflectSet,
  setPrototypeOf: ReflectSetPrototypeOf
} = Reflect;
var {
  EPSILON,
  MAX_SAFE_INTEGER,
  isFinite: NumberIsFinite,
  isNaN: NumberIsNaN
} = Number;
var {
  iterator: SymbolIterator,
  species: SymbolSpecies,
  toStringTag: SymbolToStringTag,
  for: SymbolFor
} = Symbol;
var NativeObject = Object;
var {
  create: ObjectCreate,
  defineProperty: ObjectDefineProperty,
  freeze: ObjectFreeze,
  is: ObjectIs
} = NativeObject;
var ObjectPrototype = NativeObject.prototype;
var ObjectPrototype__lookupGetter__ = (
  /** @type {any} */
  ObjectPrototype.__lookupGetter__ ? uncurryThis(
    /** @type {any} */
    ObjectPrototype.__lookupGetter__
  ) : (object, key) => {
    if (object == null) {
      throw NativeTypeError(
        CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT
      );
    }
    let target = NativeObject(object);
    do {
      const descriptor = ReflectGetOwnPropertyDescriptor(target, key);
      if (descriptor !== void 0) {
        if (ObjectHasOwn(descriptor, "get")) {
          return descriptor.get;
        }
        return;
      }
    } while ((target = ReflectGetPrototypeOf(target)) !== null);
  }
);
var ObjectHasOwn = (
  /** @type {any} */
  NativeObject.hasOwn || uncurryThis(ObjectPrototype.hasOwnProperty)
);
var NativeArray = Array;
var ArrayIsArray = NativeArray.isArray;
var ArrayPrototype = NativeArray.prototype;
var ArrayPrototypeJoin = uncurryThis(ArrayPrototype.join);
var ArrayPrototypePush = uncurryThis(ArrayPrototype.push);
var ArrayPrototypeToLocaleString = uncurryThis(
  ArrayPrototype.toLocaleString
);
var NativeArrayPrototypeSymbolIterator = ArrayPrototype[SymbolIterator];
var ArrayPrototypeSymbolIterator = uncurryThis(NativeArrayPrototypeSymbolIterator);
var {
  abs: MathAbs,
  trunc: MathTrunc
} = Math;
var NativeArrayBuffer = ArrayBuffer;
var ArrayBufferIsView = NativeArrayBuffer.isView;
var ArrayBufferPrototype = NativeArrayBuffer.prototype;
var ArrayBufferPrototypeSlice = uncurryThis(ArrayBufferPrototype.slice);
var ArrayBufferPrototypeGetByteLength = uncurryThisGetter(ArrayBufferPrototype, "byteLength");
var NativeSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : null;
var SharedArrayBufferPrototypeGetByteLength = NativeSharedArrayBuffer && uncurryThisGetter(NativeSharedArrayBuffer.prototype, "byteLength");
var TypedArray = ReflectGetPrototypeOf(Uint8Array);
var TypedArrayFrom = TypedArray.from;
var TypedArrayPrototype = TypedArray.prototype;
var NativeTypedArrayPrototypeSymbolIterator = TypedArrayPrototype[SymbolIterator];
var TypedArrayPrototypeKeys = uncurryThis(TypedArrayPrototype.keys);
var TypedArrayPrototypeValues = uncurryThis(
  TypedArrayPrototype.values
);
var TypedArrayPrototypeEntries = uncurryThis(
  TypedArrayPrototype.entries
);
var TypedArrayPrototypeSet = uncurryThis(TypedArrayPrototype.set);
var TypedArrayPrototypeReverse = uncurryThis(
  TypedArrayPrototype.reverse
);
var TypedArrayPrototypeFill = uncurryThis(TypedArrayPrototype.fill);
var TypedArrayPrototypeCopyWithin = uncurryThis(
  TypedArrayPrototype.copyWithin
);
var TypedArrayPrototypeSort = uncurryThis(TypedArrayPrototype.sort);
var TypedArrayPrototypeSlice = uncurryThis(TypedArrayPrototype.slice);
var TypedArrayPrototypeSubarray = uncurryThis(
  TypedArrayPrototype.subarray
);
var TypedArrayPrototypeGetBuffer = uncurryThisGetter(
  TypedArrayPrototype,
  "buffer"
);
var TypedArrayPrototypeGetByteOffset = uncurryThisGetter(
  TypedArrayPrototype,
  "byteOffset"
);
var TypedArrayPrototypeGetLength = uncurryThisGetter(
  TypedArrayPrototype,
  "length"
);
var TypedArrayPrototypeGetSymbolToStringTag = uncurryThisGetter(
  TypedArrayPrototype,
  SymbolToStringTag
);
var NativeUint8Array = Uint8Array;
var NativeUint16Array = Uint16Array;
var NativeUint32Array = Uint32Array;
var NativeFloat32Array = Float32Array;
var ArrayIteratorPrototype = ReflectGetPrototypeOf([][SymbolIterator]());
var ArrayIteratorPrototypeNext = uncurryThis(ArrayIteratorPrototype.next);
var GeneratorPrototypeNext = uncurryThis((function* () {
})().next);
var IteratorPrototype = ReflectGetPrototypeOf(ArrayIteratorPrototype);
var DataViewPrototype = DataView.prototype;
var DataViewPrototypeGetUint16 = uncurryThis(
  DataViewPrototype.getUint16
);
var DataViewPrototypeSetUint16 = uncurryThis(
  DataViewPrototype.setUint16
);
var NativeTypeError = TypeError;
var NativeWeakSet = WeakSet;
var WeakSetPrototype = NativeWeakSet.prototype;
var WeakSetPrototypeAdd = uncurryThis(WeakSetPrototype.add);
var WeakSetPrototypeHas = uncurryThis(WeakSetPrototype.has);
var NativeWeakMap = WeakMap;
var WeakMapPrototype = NativeWeakMap.prototype;
var WeakMapPrototypeGet = uncurryThis(WeakMapPrototype.get);
var WeakMapPrototypeHas = uncurryThis(WeakMapPrototype.has);
var WeakMapPrototypeSet = uncurryThis(WeakMapPrototype.set);

// node_modules/@petamoriken/float16/src/_util/arrayIterator.mjs
var arrayIterators = new NativeWeakMap();
var SafeIteratorPrototype = ObjectCreate(null, {
  next: {
    value: /* @__PURE__ */ __name(function next() {
      const arrayIterator = WeakMapPrototypeGet(arrayIterators, this);
      return ArrayIteratorPrototypeNext(arrayIterator);
    }, "next")
  },
  [SymbolIterator]: {
    value: /* @__PURE__ */ __name(function values() {
      return this;
    }, "values")
  }
});
function safeIfNeeded(array) {
  if (array[SymbolIterator] === NativeArrayPrototypeSymbolIterator && ArrayIteratorPrototype.next === ArrayIteratorPrototypeNext) {
    return array;
  }
  const safe = ObjectCreate(SafeIteratorPrototype);
  WeakMapPrototypeSet(arrayIterators, safe, ArrayPrototypeSymbolIterator(array));
  return safe;
}
__name(safeIfNeeded, "safeIfNeeded");
var generators = new NativeWeakMap();
var DummyArrayIteratorPrototype = ObjectCreate(IteratorPrototype, {
  next: {
    value: /* @__PURE__ */ __name(function next2() {
      const generator = WeakMapPrototypeGet(generators, this);
      return GeneratorPrototypeNext(generator);
    }, "next"),
    writable: true,
    configurable: true
  }
});
for (const key of ReflectOwnKeys(ArrayIteratorPrototype)) {
  if (key === "next") {
    continue;
  }
  ObjectDefineProperty(DummyArrayIteratorPrototype, key, ReflectGetOwnPropertyDescriptor(ArrayIteratorPrototype, key));
}

// node_modules/@petamoriken/float16/src/_util/converter.mjs
var INVERSE_OF_EPSILON = 1 / EPSILON;
var FLOAT16_MIN_VALUE = 6103515625e-14;
var FLOAT16_EPSILON = 9765625e-10;
var FLOAT16_EPSILON_MULTIPLIED_BY_FLOAT16_MIN_VALUE = FLOAT16_EPSILON * FLOAT16_MIN_VALUE;
var FLOAT16_EPSILON_DEVIDED_BY_EPSILON = FLOAT16_EPSILON * INVERSE_OF_EPSILON;
var buffer = new NativeArrayBuffer(4);
var floatView = new NativeFloat32Array(buffer);
var uint32View = new NativeUint32Array(buffer);
var baseTable = new NativeUint16Array(512);
var shiftTable = new NativeUint8Array(512);
for (let i = 0; i < 256; ++i) {
  const e = i - 127;
  if (e < -24) {
    baseTable[i] = 0;
    baseTable[i | 256] = 32768;
    shiftTable[i] = 24;
    shiftTable[i | 256] = 24;
  } else if (e < -14) {
    baseTable[i] = 1024 >> -e - 14;
    baseTable[i | 256] = 1024 >> -e - 14 | 32768;
    shiftTable[i] = -e - 1;
    shiftTable[i | 256] = -e - 1;
  } else if (e <= 15) {
    baseTable[i] = e + 15 << 10;
    baseTable[i | 256] = e + 15 << 10 | 32768;
    shiftTable[i] = 13;
    shiftTable[i | 256] = 13;
  } else if (e < 128) {
    baseTable[i] = 31744;
    baseTable[i | 256] = 64512;
    shiftTable[i] = 24;
    shiftTable[i | 256] = 24;
  } else {
    baseTable[i] = 31744;
    baseTable[i | 256] = 64512;
    shiftTable[i] = 13;
    shiftTable[i | 256] = 13;
  }
}
var mantissaTable = new NativeUint32Array(2048);
for (let i = 1; i < 1024; ++i) {
  let m = i << 13;
  let e = 0;
  while ((m & 8388608) === 0) {
    m <<= 1;
    e -= 8388608;
  }
  m &= ~8388608;
  e += 947912704;
  mantissaTable[i] = m | e;
}
for (let i = 1024; i < 2048; ++i) {
  mantissaTable[i] = 939524096 + (i - 1024 << 13);
}
var exponentTable = new NativeUint32Array(64);
for (let i = 1; i < 31; ++i) {
  exponentTable[i] = i << 23;
}
exponentTable[31] = 1199570944;
exponentTable[32] = 2147483648;
for (let i = 33; i < 63; ++i) {
  exponentTable[i] = 2147483648 + (i - 32 << 23);
}
exponentTable[63] = 3347054592;
var offsetTable = new NativeUint16Array(64);
for (let i = 1; i < 64; ++i) {
  if (i !== 32) {
    offsetTable[i] = 1024;
  }
}
function convertToNumber(float16bits) {
  const i = float16bits >> 10;
  uint32View[0] = mantissaTable[offsetTable[i] + (float16bits & 1023)] + exponentTable[i];
  return floatView[0];
}
__name(convertToNumber, "convertToNumber");

// node_modules/@petamoriken/float16/src/DataView.mjs
function getFloat16(dataView, byteOffset, ...opts) {
  return convertToNumber(
    DataViewPrototypeGetUint16(dataView, byteOffset, ...safeIfNeeded(opts))
  );
}
__name(getFloat16, "getFloat16");

// node_modules/xml-utils/get-attribute.mjs
function getAttribute(tag, attributeName, options) {
  const debug = options && options.debug || false;
  if (debug) console.log("[xml-utils] getting " + attributeName + " in " + tag);
  const xml = typeof tag === "object" ? tag.outer : tag;
  const opening = xml.slice(0, xml.indexOf(">") + 1);
  const quotechars = ['"', "'"];
  for (let i = 0; i < quotechars.length; i++) {
    const char = quotechars[i];
    const pattern = attributeName + "\\=" + char + "([^" + char + "]*)" + char;
    if (debug) console.log("[xml-utils] pattern:", pattern);
    const re = new RegExp(pattern);
    const match = re.exec(opening);
    if (debug) console.log("[xml-utils] match:", match);
    if (match) return match[1];
  }
}
__name(getAttribute, "getAttribute");

// node_modules/xml-utils/index-of-match.mjs
function indexOfMatch(xml, pattern, startIndex) {
  const re = new RegExp(pattern);
  const match = re.exec(xml.slice(startIndex));
  if (match) return startIndex + match.index;
  else return -1;
}
__name(indexOfMatch, "indexOfMatch");

// node_modules/xml-utils/index-of-match-end.mjs
function indexOfMatchEnd(xml, pattern, startIndex) {
  const re = new RegExp(pattern);
  const match = re.exec(xml.slice(startIndex));
  if (match) return startIndex + match.index + match[0].length - 1;
  else return -1;
}
__name(indexOfMatchEnd, "indexOfMatchEnd");

// node_modules/xml-utils/count-substring.mjs
function countSubstring(string, substring) {
  const pattern = new RegExp(substring, "g");
  const match = string.match(pattern);
  return match ? match.length : 0;
}
__name(countSubstring, "countSubstring");

// node_modules/xml-utils/find-tag-by-name.mjs
function findTagByName(xml, tagName, options) {
  const debug = options && options.debug || false;
  const nested = !(options && typeof options.nested === false);
  const startIndex = options && options.startIndex || 0;
  if (debug) console.log("[xml-utils] starting findTagByName with", tagName, " and ", options);
  const start = indexOfMatch(xml, `<${tagName}[\x20\n>/]`, startIndex);
  if (debug) console.log("[xml-utils] start:", start);
  if (start === -1) return void 0;
  const afterStart = xml.slice(start + tagName.length);
  let relativeEnd = indexOfMatchEnd(afterStart, "^[^<]*[ /]>", 0);
  const selfClosing = relativeEnd !== -1 && afterStart[relativeEnd - 1] === "/";
  if (debug) console.log("[xml-utils] selfClosing:", selfClosing);
  if (selfClosing === false) {
    if (nested) {
      let startIndex2 = 0;
      let openings = 1;
      let closings = 0;
      while ((relativeEnd = indexOfMatchEnd(afterStart, "[ /]" + tagName + ">", startIndex2)) !== -1) {
        const clip = afterStart.substring(startIndex2, relativeEnd + 1);
        openings += countSubstring(clip, "<" + tagName + "[ \n	>]");
        closings += countSubstring(clip, "</" + tagName + ">");
        if (closings >= openings) break;
        startIndex2 = relativeEnd;
      }
    } else {
      relativeEnd = indexOfMatchEnd(afterStart, "[ /]" + tagName + ">", 0);
    }
  }
  const end = start + tagName.length + relativeEnd + 1;
  if (debug) console.log("[xml-utils] end:", end);
  if (end === -1) return void 0;
  const outer = xml.slice(start, end);
  let inner;
  if (selfClosing) {
    inner = null;
  } else {
    inner = outer.slice(outer.indexOf(">") + 1, outer.lastIndexOf("<"));
  }
  return { inner, outer, start, end };
}
__name(findTagByName, "findTagByName");

// node_modules/xml-utils/find-tags-by-name.mjs
function findTagsByName(xml, tagName, options) {
  const tags2 = [];
  const debug = options && options.debug || false;
  const nested = options && typeof options.nested === "boolean" ? options.nested : true;
  let startIndex = options && options.startIndex || 0;
  let tag;
  while (tag = findTagByName(xml, tagName, { debug, startIndex })) {
    if (nested) {
      startIndex = tag.start + 1 + tagName.length;
    } else {
      startIndex = tag.end;
    }
    tags2.push(tag);
  }
  if (debug) console.log("findTagsByName found", tags2.length, "tags");
  return tags2;
}
__name(findTagsByName, "findTagsByName");

// node_modules/geotiff/dist-module/geotiffimage.js
init_globals();

// node_modules/geotiff/dist-module/rgb.js
function fromWhiteIsZero(raster, max) {
  const { width, height } = raster;
  const rgbRaster = new Uint8Array(width * height * 3);
  let value;
  for (let i = 0, j = 0; i < raster.length; ++i, j += 3) {
    value = 256 - raster[i] / max * 256;
    rgbRaster[j] = value;
    rgbRaster[j + 1] = value;
    rgbRaster[j + 2] = value;
  }
  return rgbRaster;
}
__name(fromWhiteIsZero, "fromWhiteIsZero");
function fromBlackIsZero(raster, max) {
  const { width, height } = raster;
  const rgbRaster = new Uint8Array(width * height * 3);
  let value;
  for (let i = 0, j = 0; i < raster.length; ++i, j += 3) {
    value = raster[i] / max * 256;
    rgbRaster[j] = value;
    rgbRaster[j + 1] = value;
    rgbRaster[j + 2] = value;
  }
  return rgbRaster;
}
__name(fromBlackIsZero, "fromBlackIsZero");
function fromPalette(raster, colorMap) {
  const { width, height } = raster;
  const rgbRaster = new Uint8Array(width * height * 3);
  const greenOffset = colorMap.length / 3;
  const blueOffset = colorMap.length / 3 * 2;
  for (let i = 0, j = 0; i < raster.length; ++i, j += 3) {
    const mapIndex = raster[i];
    rgbRaster[j] = colorMap[mapIndex] / 65536 * 256;
    rgbRaster[j + 1] = colorMap[mapIndex + greenOffset] / 65536 * 256;
    rgbRaster[j + 2] = colorMap[mapIndex + blueOffset] / 65536 * 256;
  }
  return rgbRaster;
}
__name(fromPalette, "fromPalette");
function fromCMYK(cmykRaster) {
  const { width, height } = cmykRaster;
  const rgbRaster = new Uint8Array(width * height * 3);
  for (let i = 0, j = 0; i < cmykRaster.length; i += 4, j += 3) {
    const c = cmykRaster[i];
    const m = cmykRaster[i + 1];
    const y = cmykRaster[i + 2];
    const k = cmykRaster[i + 3];
    rgbRaster[j] = 255 * ((255 - c) / 256) * ((255 - k) / 256);
    rgbRaster[j + 1] = 255 * ((255 - m) / 256) * ((255 - k) / 256);
    rgbRaster[j + 2] = 255 * ((255 - y) / 256) * ((255 - k) / 256);
  }
  return rgbRaster;
}
__name(fromCMYK, "fromCMYK");
function fromYCbCr(yCbCrRaster) {
  const { width, height } = yCbCrRaster;
  const rgbRaster = new Uint8ClampedArray(width * height * 3);
  for (let i = 0, j = 0; i < yCbCrRaster.length; i += 3, j += 3) {
    const y = yCbCrRaster[i];
    const cb = yCbCrRaster[i + 1];
    const cr = yCbCrRaster[i + 2];
    rgbRaster[j] = y + 1.402 * (cr - 128);
    rgbRaster[j + 1] = y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128);
    rgbRaster[j + 2] = y + 1.772 * (cb - 128);
  }
  return rgbRaster;
}
__name(fromYCbCr, "fromYCbCr");
var Xn = 0.95047;
var Yn = 1;
var Zn = 1.08883;
function fromCIELab(cieLabRaster) {
  const { width, height } = cieLabRaster;
  const rgbRaster = new Uint8Array(width * height * 3);
  for (let i = 0, j = 0; i < cieLabRaster.length; i += 3, j += 3) {
    const L = cieLabRaster[i + 0];
    const a_ = cieLabRaster[i + 1] << 24 >> 24;
    const b_ = cieLabRaster[i + 2] << 24 >> 24;
    let y = (L + 16) / 116;
    let x = a_ / 500 + y;
    let z = y - b_ / 200;
    let r;
    let g;
    let b;
    x = Xn * (x * x * x > 8856e-6 ? x * x * x : (x - 16 / 116) / 7.787);
    y = Yn * (y * y * y > 8856e-6 ? y * y * y : (y - 16 / 116) / 7.787);
    z = Zn * (z * z * z > 8856e-6 ? z * z * z : (z - 16 / 116) / 7.787);
    r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    b = x * 0.0557 + y * -0.204 + z * 1.057;
    r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : 12.92 * r;
    g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : 12.92 * g;
    b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : 12.92 * b;
    rgbRaster[j] = Math.max(0, Math.min(1, r)) * 255;
    rgbRaster[j + 1] = Math.max(0, Math.min(1, g)) * 255;
    rgbRaster[j + 2] = Math.max(0, Math.min(1, b)) * 255;
  }
  return rgbRaster;
}
__name(fromCIELab, "fromCIELab");

// node_modules/geotiff/dist-module/compression/index.js
var registry = /* @__PURE__ */ new Map();
async function defaultDecoderParameterFn(fileDirectory) {
  const isTiled = !fileDirectory.hasTag("StripOffsets");
  return (
    /** @type {BaseDecoderParameters} */
    {
      tileWidth: isTiled ? await fileDirectory.loadValue("TileWidth") : await fileDirectory.loadValue("ImageWidth"),
      tileHeight: isTiled ? await fileDirectory.loadValue("TileLength") : await fileDirectory.loadValue("RowsPerStrip") || await fileDirectory.loadValue("ImageLength"),
      planarConfiguration: await fileDirectory.loadValue("PlanarConfiguration"),
      bitsPerSample: await fileDirectory.loadValue("BitsPerSample"),
      predictor: await fileDirectory.loadValue("Predictor") || 1
    }
  );
}
__name(defaultDecoderParameterFn, "defaultDecoderParameterFn");
function addDecoder(cases, importFn, decoderParameterFn = defaultDecoderParameterFn, preferWorker_ = true) {
  if (!Array.isArray(cases)) {
    cases = [cases];
  }
  cases.forEach((c) => {
    registry.set(c, { importFn, decoderParameterFn, preferWorker: preferWorker_ });
  });
}
__name(addDecoder, "addDecoder");
async function getDecoderParameters(compression, fileDirectory) {
  if (!registry.has(compression)) {
    throw new Error(`Unknown compression method identifier: ${compression}`);
  }
  const { decoderParameterFn } = (
    /** @type {RegistryEntry} */
    registry.get(compression)
  );
  return decoderParameterFn(fileDirectory);
}
__name(getDecoderParameters, "getDecoderParameters");
async function getDecoder(compression, decoderParameters) {
  if (!registry.has(compression)) {
    throw new Error(`Unknown compression method identifier: ${compression}`);
  }
  const { importFn } = (
    /** @type {RegistryEntry} */
    registry.get(compression)
  );
  const Decoder = await importFn();
  return new Decoder(decoderParameters);
}
__name(getDecoder, "getDecoder");
var defaultDecoderDefinitions = [
  // No compression
  {
    cases: [void 0, 1],
    importFn: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_raw(), raw_exports)).then((m) => m.default), "importFn"),
    preferWorker: false
  },
  // LZW
  {
    cases: 5,
    importFn: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_lzw(), lzw_exports)).then((m) => m.default), "importFn")
  },
  // Old-style JPEG
  {
    cases: 6,
    importFn: /* @__PURE__ */ __name(() => {
      throw new Error("old style JPEG compression is not supported.");
    }, "importFn")
  },
  // JPEG
  {
    cases: 7,
    importFn: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_jpeg(), jpeg_exports)).then((m) => m.default), "importFn"),
    /**
     * @param {import("../imagefiledirectory.js").ImageFileDirectory} fileDirectory
     */
    decoderParameterFn: /* @__PURE__ */ __name(async (fileDirectory) => {
      return {
        ...await defaultDecoderParameterFn(fileDirectory),
        JPEGTables: await fileDirectory.loadValue("JPEGTables")
      };
    }, "decoderParameterFn")
  },
  // Deflate / Adobe Deflate
  {
    cases: [8, 32946],
    importFn: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_deflate(), deflate_exports)).then((m) => m.default), "importFn")
  },
  // PackBits
  {
    cases: 32773,
    importFn: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_packbits(), packbits_exports)).then((m) => m.default), "importFn")
  },
  // LERC
  {
    cases: 34887,
    importFn: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_lerc(), lerc_exports)).then(async (m) => {
      await m.zstd.init();
      return m;
    }).then((m) => m.default), "importFn"),
    /**
     * @param {import("../imagefiledirectory.js").ImageFileDirectory} fileDirectory
     */
    decoderParameterFn: /* @__PURE__ */ __name(async (fileDirectory) => {
      return {
        ...await defaultDecoderParameterFn(fileDirectory),
        LercParameters: await fileDirectory.loadValue("LercParameters")
      };
    }, "decoderParameterFn")
  },
  // zstd
  {
    cases: 5e4,
    importFn: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_zstd(), zstd_exports)).then(async (m) => {
      await m.zstd.init();
      return m;
    }).then((m) => m.default), "importFn")
  },
  // WebP Images
  {
    cases: 50001,
    importFn: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_webimage(), webimage_exports)).then((m) => m.default), "importFn"),
    /**
     * @param {import("../imagefiledirectory.js").ImageFileDirectory} fileDirectory
     */
    decoderParameterFn: /* @__PURE__ */ __name(async (fileDirectory) => {
      return {
        ...await defaultDecoderParameterFn(fileDirectory),
        samplesPerPixel: Number(await fileDirectory.loadValue("SamplesPerPixel")) || 4
      };
    }, "decoderParameterFn"),
    preferWorker: false
  }
];
for (const decoderDefinition of defaultDecoderDefinitions) {
  const { cases, importFn, decoderParameterFn, preferWorker: preferWorker_ } = decoderDefinition;
  addDecoder(cases, importFn, decoderParameterFn, preferWorker_);
}

// node_modules/geotiff/dist-module/resample.js
function copyNewSize(array, width, height, samplesPerPixel = 1) {
  return new (Object.getPrototypeOf(array)).constructor(width * height * samplesPerPixel);
}
__name(copyNewSize, "copyNewSize");
function resampleNearest(valueArrays, inWidth, inHeight, outWidth, outHeight) {
  const relX = inWidth / outWidth;
  const relY = inHeight / outHeight;
  return valueArrays.map((array) => {
    const newArray = copyNewSize(array, outWidth, outHeight);
    for (let y = 0; y < outHeight; ++y) {
      const cy = Math.min(Math.round(relY * y), inHeight - 1);
      for (let x = 0; x < outWidth; ++x) {
        const cx = Math.min(Math.round(relX * x), inWidth - 1);
        const value = array[cy * inWidth + cx];
        newArray[y * outWidth + x] = value;
      }
    }
    return newArray;
  });
}
__name(resampleNearest, "resampleNearest");
function lerp(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}
__name(lerp, "lerp");
function resampleBilinear(valueArrays, inWidth, inHeight, outWidth, outHeight) {
  const relX = inWidth / outWidth;
  const relY = inHeight / outHeight;
  return valueArrays.map((array) => {
    const newArray = copyNewSize(array, outWidth, outHeight);
    for (let y = 0; y < outHeight; ++y) {
      const rawY = relY * y;
      const yl = Math.floor(rawY);
      const yh = Math.min(Math.ceil(rawY), inHeight - 1);
      for (let x = 0; x < outWidth; ++x) {
        const rawX = relX * x;
        const tx = rawX % 1;
        const xl = Math.floor(rawX);
        const xh = Math.min(Math.ceil(rawX), inWidth - 1);
        const ll = array[yl * inWidth + xl];
        const hl = array[yl * inWidth + xh];
        const lh = array[yh * inWidth + xl];
        const hh = array[yh * inWidth + xh];
        const value = lerp(lerp(ll, hl, tx), lerp(lh, hh, tx), rawY % 1);
        newArray[y * outWidth + x] = value;
      }
    }
    return newArray;
  });
}
__name(resampleBilinear, "resampleBilinear");
function resample(valueArrays, inWidth, inHeight, outWidth, outHeight, method = "nearest") {
  switch (method.toLowerCase()) {
    case "nearest":
      return resampleNearest(valueArrays, inWidth, inHeight, outWidth, outHeight);
    case "bilinear":
    case "linear":
      return resampleBilinear(valueArrays, inWidth, inHeight, outWidth, outHeight);
    default:
      throw new Error(`Unsupported resampling method: '${method}'`);
  }
}
__name(resample, "resample");
function resampleNearestInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples) {
  const relX = inWidth / outWidth;
  const relY = inHeight / outHeight;
  const newArray = copyNewSize(valueArray, outWidth, outHeight, samples);
  for (let y = 0; y < outHeight; ++y) {
    const cy = Math.min(Math.round(relY * y), inHeight - 1);
    for (let x = 0; x < outWidth; ++x) {
      const cx = Math.min(Math.round(relX * x), inWidth - 1);
      for (let i = 0; i < samples; ++i) {
        const value = valueArray[cy * inWidth * samples + cx * samples + i];
        newArray[y * outWidth * samples + x * samples + i] = value;
      }
    }
  }
  return newArray;
}
__name(resampleNearestInterleaved, "resampleNearestInterleaved");
function resampleBilinearInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples) {
  const relX = inWidth / outWidth;
  const relY = inHeight / outHeight;
  const newArray = copyNewSize(valueArray, outWidth, outHeight, samples);
  for (let y = 0; y < outHeight; ++y) {
    const rawY = relY * y;
    const yl = Math.floor(rawY);
    const yh = Math.min(Math.ceil(rawY), inHeight - 1);
    for (let x = 0; x < outWidth; ++x) {
      const rawX = relX * x;
      const tx = rawX % 1;
      const xl = Math.floor(rawX);
      const xh = Math.min(Math.ceil(rawX), inWidth - 1);
      for (let i = 0; i < samples; ++i) {
        const ll = valueArray[yl * inWidth * samples + xl * samples + i];
        const hl = valueArray[yl * inWidth * samples + xh * samples + i];
        const lh = valueArray[yh * inWidth * samples + xl * samples + i];
        const hh = valueArray[yh * inWidth * samples + xh * samples + i];
        const value = lerp(lerp(ll, hl, tx), lerp(lh, hh, tx), rawY % 1);
        newArray[y * outWidth * samples + x * samples + i] = value;
      }
    }
  }
  return newArray;
}
__name(resampleBilinearInterleaved, "resampleBilinearInterleaved");
function resampleInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples, method = "nearest") {
  switch (method.toLowerCase()) {
    case "nearest":
      return resampleNearestInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples);
    case "bilinear":
    case "linear":
      return resampleBilinearInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples);
    default:
      throw new Error(`Unsupported resampling method: '${method}'`);
  }
}
__name(resampleInterleaved, "resampleInterleaved");

// node_modules/geotiff/dist-module/geotiffimage.js
function sum(array, start, end) {
  let s = 0;
  for (let i = start; i < end; ++i) {
    s += array[i];
  }
  return s;
}
__name(sum, "sum");
function arrayForType(format, bitsPerSample, sizeOrData) {
  let TypedArrayConstructor;
  switch (format) {
    case 1:
      if (bitsPerSample <= 8) {
        TypedArrayConstructor = Uint8Array;
      } else if (bitsPerSample <= 16) {
        TypedArrayConstructor = Uint16Array;
      } else if (bitsPerSample <= 32) {
        TypedArrayConstructor = Uint32Array;
      }
      break;
    case 2:
      if (bitsPerSample === 8) {
        TypedArrayConstructor = Int8Array;
      } else if (bitsPerSample === 16) {
        TypedArrayConstructor = Int16Array;
      } else if (bitsPerSample === 32) {
        TypedArrayConstructor = Int32Array;
      }
      break;
    case 3:
      switch (bitsPerSample) {
        case 16:
        case 32:
          TypedArrayConstructor = Float32Array;
          break;
        case 64:
          TypedArrayConstructor = Float64Array;
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  if (TypedArrayConstructor) {
    if (typeof sizeOrData === "number") {
      return new TypedArrayConstructor(sizeOrData);
    } else if (sizeOrData instanceof ArrayBuffer) {
      return new TypedArrayConstructor(sizeOrData);
    }
  }
  throw Error("Unsupported data format/bitsPerSample");
}
__name(arrayForType, "arrayForType");
function needsNormalization(format, bitsPerSample) {
  if ((format === 1 || format === 2) && bitsPerSample <= 32 && bitsPerSample % 8 === 0) {
    return false;
  } else if (format === 3 && (bitsPerSample === 16 || bitsPerSample === 32 || bitsPerSample === 64)) {
    return false;
  }
  return true;
}
__name(needsNormalization, "needsNormalization");
function normalizeArray(inBuffer, format, planarConfiguration, samplesPerPixel, bitsPerSample, tileWidth, tileHeight) {
  const view = new DataView(inBuffer);
  const outSize = planarConfiguration === 2 ? tileHeight * tileWidth : tileHeight * tileWidth * samplesPerPixel;
  const samplesToTransfer = planarConfiguration === 2 ? 1 : samplesPerPixel;
  const outArray = arrayForType(format, bitsPerSample, outSize);
  const bitMask = parseInt("1".repeat(bitsPerSample), 2);
  if (format === 1) {
    let pixelBitSkip;
    if (planarConfiguration === 1) {
      pixelBitSkip = samplesPerPixel * bitsPerSample;
    } else {
      pixelBitSkip = bitsPerSample;
    }
    let bitsPerLine = tileWidth * pixelBitSkip;
    if ((bitsPerLine & 7) !== 0) {
      bitsPerLine = bitsPerLine + 7 & ~7;
    }
    for (let y = 0; y < tileHeight; ++y) {
      const lineBitOffset = y * bitsPerLine;
      for (let x = 0; x < tileWidth; ++x) {
        const pixelBitOffset = lineBitOffset + x * samplesToTransfer * bitsPerSample;
        for (let i = 0; i < samplesToTransfer; ++i) {
          const bitOffset = pixelBitOffset + i * bitsPerSample;
          const outIndex = (y * tileWidth + x) * samplesToTransfer + i;
          const byteOffset = Math.floor(bitOffset / 8);
          const innerBitOffset = bitOffset % 8;
          if (innerBitOffset + bitsPerSample <= 8) {
            outArray[outIndex] = view.getUint8(byteOffset) >> 8 - bitsPerSample - innerBitOffset & bitMask;
          } else if (innerBitOffset + bitsPerSample <= 16) {
            outArray[outIndex] = view.getUint16(byteOffset) >> 16 - bitsPerSample - innerBitOffset & bitMask;
          } else if (innerBitOffset + bitsPerSample <= 24) {
            const raw = view.getUint16(byteOffset) << 8 | view.getUint8(byteOffset + 2);
            outArray[outIndex] = raw >> 24 - bitsPerSample - innerBitOffset & bitMask;
          } else {
            outArray[outIndex] = view.getUint32(byteOffset) >> 32 - bitsPerSample - innerBitOffset & bitMask;
          }
        }
      }
    }
  } else if (format === 3) {
  }
  return outArray.buffer;
}
__name(normalizeArray, "normalizeArray");
var GeoTIFFImage = class {
  static {
    __name(this, "GeoTIFFImage");
  }
  /**
   * @constructor
   * @param {import("./imagefiledirectory.js").ImageFileDirectory} fileDirectory The parsed file directory
   * @param {Boolean} littleEndian Whether the file is encoded in little or big endian
   * @param {Boolean} cache Whether or not decoded tiles shall be cached
   * @param {import('./source/basesource.js').BaseSource} source The datasource to read from
   */
  constructor(fileDirectory, littleEndian, cache, source) {
    this.fileDirectory = fileDirectory;
    this.littleEndian = littleEndian;
    this.tiles = cache ? [] : null;
    this.isTiled = !fileDirectory.hasTag("StripOffsets");
    const planarConfiguration = fileDirectory.getValue("PlanarConfiguration") ?? 1;
    if (planarConfiguration !== 1 && planarConfiguration !== 2) {
      throw new Error("Invalid planar configuration.");
    }
    this.planarConfiguration = planarConfiguration;
    this.source = source;
  }
  /**
   * Returns the associated parsed file directory.
   * @returns {import("./imagefiledirectory.js").ImageFileDirectory} the parsed file directory
   */
  getFileDirectory() {
    return this.fileDirectory;
  }
  /**
   * Returns the associated parsed geo keys.
   * @returns {Partial<Record<import('./globals.js').GeoKeyName, *>>|null} the parsed geo keys
   */
  getGeoKeys() {
    return this.fileDirectory.parseGeoKeyDirectory();
  }
  /**
   * Returns the width of the image.
   * @returns {Number} the width of the image
   */
  getWidth() {
    return this.fileDirectory.getValue("ImageWidth") || 0;
  }
  /**
   * Returns the height of the image.
   * @returns {Number} the height of the image
   */
  getHeight() {
    return this.fileDirectory.getValue("ImageLength") || 0;
  }
  /**
   * Returns the number of samples per pixel.
   * @returns {number} the number of samples per pixel
   */
  getSamplesPerPixel() {
    return this.fileDirectory.getValue("SamplesPerPixel") ?? 1;
  }
  /**
   * Returns the width of each tile.
   * @returns {number} the width of each tile
   */
  getTileWidth() {
    return this.isTiled ? this.fileDirectory.getValue("TileWidth") || 0 : this.getWidth();
  }
  /**
   * Returns the height of each tile.
   * @returns {number} the height of each tile
   */
  getTileHeight() {
    if (this.isTiled) {
      return this.fileDirectory.getValue("TileLength") || 0;
    }
    const rowsPerStrip = this.fileDirectory.hasTag("RowsPerStrip") && this.fileDirectory.getValue("RowsPerStrip");
    if (rowsPerStrip) {
      return Math.min(rowsPerStrip, this.getHeight());
    }
    return this.getHeight();
  }
  getBlockWidth() {
    return this.getTileWidth();
  }
  /**
   * @param {number} y
   * @returns {number}
   */
  getBlockHeight(y) {
    if (this.isTiled || (y + 1) * this.getTileHeight() <= this.getHeight()) {
      return this.getTileHeight();
    } else {
      return this.getHeight() - y * this.getTileHeight();
    }
  }
  /**
   * Calculates the number of bytes for each pixel across all samples. Only full
   * bytes are supported, an exception is thrown when this is not the case.
   * @returns {Number} the bytes per pixel
   */
  getBytesPerPixel() {
    let bytes = 0;
    const bitsPerSample = this.fileDirectory.getValue("BitsPerSample") || [];
    for (let i = 0; i < bitsPerSample.length; ++i) {
      bytes += this.getSampleByteSize(i);
    }
    return bytes;
  }
  /**
   * @param {number} i
   * @returns {number}
   */
  getSampleByteSize(i) {
    const bitsPerSample = this.fileDirectory.getValue("BitsPerSample") || [];
    if (i >= bitsPerSample.length) {
      throw new RangeError(`Sample index ${i} is out of range.`);
    }
    return Math.ceil(bitsPerSample[i] / 8);
  }
  /**
   * @param {number} sampleIndex
   * @returns {(this: DataView, byteOffset: number, littleEndian: boolean) => number}
   */
  getReaderForSample(sampleIndex) {
    const sampleFormat = this.fileDirectory.getValue("SampleFormat");
    const format = sampleFormat ? sampleFormat[sampleIndex] : 1;
    const bitsPerSample = (this.fileDirectory.getValue("BitsPerSample") || [])[sampleIndex];
    switch (format) {
      case 1:
        if (bitsPerSample <= 8) {
          return DataView.prototype.getUint8;
        } else if (bitsPerSample <= 16) {
          return DataView.prototype.getUint16;
        } else if (bitsPerSample <= 32) {
          return DataView.prototype.getUint32;
        }
        break;
      case 2:
        if (bitsPerSample <= 8) {
          return DataView.prototype.getInt8;
        } else if (bitsPerSample <= 16) {
          return DataView.prototype.getInt16;
        } else if (bitsPerSample <= 32) {
          return DataView.prototype.getInt32;
        }
        break;
      case 3:
        switch (bitsPerSample) {
          case 16:
            return function(offset, littleEndian) {
              return getFloat16(this, offset, littleEndian);
            };
          case 32:
            return DataView.prototype.getFloat32;
          case 64:
            return DataView.prototype.getFloat64;
          default:
            break;
        }
        break;
      default:
        break;
    }
    throw Error("Unsupported data format/bitsPerSample");
  }
  getSampleFormat(sampleIndex = 0) {
    const sampleFormat = this.fileDirectory.getValue("SampleFormat");
    return sampleFormat ? sampleFormat[sampleIndex] : 1;
  }
  getBitsPerSample(sampleIndex = 0) {
    const bitsPerSample = this.fileDirectory.getValue("BitsPerSample");
    return bitsPerSample ? bitsPerSample[sampleIndex] : 0;
  }
  /**
   * @param {number} sampleIndex
   * @param {number|ArrayBufferLike} sizeOrData
   * @returns {TypedArray}
   */
  getArrayForSample(sampleIndex, sizeOrData) {
    const format = (
      /** @type {1|2|3} */
      this.getSampleFormat(sampleIndex)
    );
    const bitsPerSample = this.getBitsPerSample(sampleIndex);
    return arrayForType(format, bitsPerSample, sizeOrData);
  }
  /**
   * Returns the decoded strip or tile.
   * @param {Number} x the strip or tile x-offset
   * @param {Number} y the tile y-offset (0 for stripped images)
   * @param {Number} sample the sample to get for separated samples
   * @param {DecoderWorker|import("./geotiff.js").BaseDecoder} poolOrDecoder the decoder or decoder pool
   * @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
   *                               to be aborted
   * @returns {Promise.<{x: number, y: number, sample: number, data: ArrayBufferLike}>} the decoded strip or tile
   */
  async getTileOrStrip(x, y, sample, poolOrDecoder, signal) {
    const numTilesPerRow = Math.ceil(this.getWidth() / this.getTileWidth());
    const numTilesPerCol = Math.ceil(this.getHeight() / this.getTileHeight());
    let index;
    const { tiles } = this;
    if (this.planarConfiguration === 1) {
      index = y * numTilesPerRow + x;
    } else if (this.planarConfiguration === 2) {
      index = sample * numTilesPerRow * numTilesPerCol + y * numTilesPerRow + x;
    }
    if (index === void 0) {
      throw new Error("Could not determine tile or strip index.");
    }
    let offset;
    let byteCount;
    if (this.isTiled) {
      offset = Number(await this.fileDirectory.loadValueIndexed("TileOffsets", index));
      byteCount = Number(await this.fileDirectory.loadValueIndexed("TileByteCounts", index));
    } else {
      offset = Number(await this.fileDirectory.loadValueIndexed("StripOffsets", index));
      byteCount = Number(await this.fileDirectory.loadValueIndexed("StripByteCounts", index));
    }
    if (byteCount === 0) {
      const nPixels = this.getBlockHeight(y) * this.getTileWidth();
      const bytesPerPixel = this.planarConfiguration === 2 ? this.getSampleByteSize(sample) : this.getBytesPerPixel();
      const data = new ArrayBuffer(nPixels * bytesPerPixel);
      const view = this.getArrayForSample(sample, data);
      view.fill(this.getGDALNoData() || 0);
      return { x, y, sample, data };
    }
    const slice = (await this.source.fetch([{ offset, length: byteCount }], signal))[0];
    let request;
    if (tiles === null || !tiles[index]) {
      request = (async () => {
        let data = await poolOrDecoder.decode(slice);
        const sampleFormat = (
          /** @type {1|2|3} */
          this.getSampleFormat()
        );
        const bitsPerSample = this.getBitsPerSample();
        if (needsNormalization(sampleFormat, bitsPerSample)) {
          data = normalizeArray(data, sampleFormat, this.planarConfiguration, this.getSamplesPerPixel(), bitsPerSample, this.getTileWidth(), this.getBlockHeight(y));
        }
        return data;
      })();
      if (tiles !== null) {
        tiles[index] = request;
      }
    } else {
      request = tiles[index];
    }
    return { x, y, sample, data: await request };
  }
  /**
   * Internal read function.
   * @private
   * @param {Array<number>} imageWindow The image window in pixel coordinates
   * @param {Array<number>} samples The selected samples (0-based indices)
   * @param {TypedArray|TypedArray[]} valueArrays The array(s) to write into
   * @param {boolean|undefined} interleave Whether or not to write in an interleaved manner
   * @param {DecoderWorker|import("./geotiff.js").BaseDecoder} poolOrDecoder the decoder or decoder pool
   * @param {number} [width] the width of window to be read into
   * @param {number} [height] the height of window to be read into
   * @param {string} [resampleMethod] the resampling method to be used when interpolating
   * @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
   *                               to be aborted
   * @returns {Promise<ReadRasterResult>}
   */
  async _readRaster(imageWindow, samples, valueArrays, interleave, poolOrDecoder, width, height, resampleMethod, signal) {
    const tileWidth = this.getTileWidth();
    const tileHeight = this.getTileHeight();
    const imageWidth = this.getWidth();
    const imageHeight = this.getHeight();
    const minXTile = Math.max(Math.floor(imageWindow[0] / tileWidth), 0);
    const maxXTile = Math.min(Math.ceil(imageWindow[2] / tileWidth), Math.ceil(imageWidth / tileWidth));
    const minYTile = Math.max(Math.floor(imageWindow[1] / tileHeight), 0);
    const maxYTile = Math.min(Math.ceil(imageWindow[3] / tileHeight), Math.ceil(imageHeight / tileHeight));
    const windowWidth = imageWindow[2] - imageWindow[0];
    let bytesPerPixel = this.getBytesPerPixel();
    const srcSampleOffsets = [];
    const sampleReaders = [];
    for (let i = 0; i < samples.length; ++i) {
      if (this.planarConfiguration === 1) {
        const bitsPerSample = await this.fileDirectory.loadValue("BitsPerSample");
        if (typeof bitsPerSample !== "object") {
          throw new Error("Expected BitsPerSample to be an array or typed array.");
        }
        srcSampleOffsets.push(sum(bitsPerSample, 0, samples[i]) / 8);
      } else {
        srcSampleOffsets.push(0);
      }
      sampleReaders.push(this.getReaderForSample(samples[i]));
    }
    const promises = [];
    const { littleEndian } = this;
    for (let yTile = minYTile; yTile < maxYTile; ++yTile) {
      for (let xTile = minXTile; xTile < maxXTile; ++xTile) {
        let getPromise;
        if (this.planarConfiguration === 1) {
          getPromise = this.getTileOrStrip(xTile, yTile, 0, poolOrDecoder, signal);
        }
        for (let sampleIndex = 0; sampleIndex < samples.length; ++sampleIndex) {
          const si = sampleIndex;
          const sample = samples[sampleIndex];
          if (this.planarConfiguration === 2) {
            bytesPerPixel = this.getSampleByteSize(sample);
            getPromise = this.getTileOrStrip(xTile, yTile, sample, poolOrDecoder, signal);
          }
          if (!getPromise) {
            throw new Error("Could not get tile or strip data.");
          }
          const promise = getPromise.then((tile) => {
            const buffer2 = tile.data;
            const dataView = new DataView(buffer2);
            const blockHeight = this.getBlockHeight(tile.y);
            const firstLine = tile.y * tileHeight;
            const firstCol = tile.x * tileWidth;
            const lastLine = firstLine + blockHeight;
            const lastCol = (tile.x + 1) * tileWidth;
            const reader = sampleReaders[si];
            const ymax = Math.min(blockHeight, blockHeight - (lastLine - imageWindow[3]), imageHeight - firstLine);
            const xmax = Math.min(tileWidth, tileWidth - (lastCol - imageWindow[2]), imageWidth - firstCol);
            for (let y = Math.max(0, imageWindow[1] - firstLine); y < ymax; ++y) {
              for (let x = Math.max(0, imageWindow[0] - firstCol); x < xmax; ++x) {
                const pixelOffset = (y * tileWidth + x) * bytesPerPixel;
                const value = reader.call(dataView, pixelOffset + srcSampleOffsets[si], littleEndian);
                let windowCoordinate;
                if (interleave) {
                  windowCoordinate = (y + firstLine - imageWindow[1]) * windowWidth * samples.length + (x + firstCol - imageWindow[0]) * samples.length + si;
                  valueArrays[windowCoordinate] = value;
                } else {
                  windowCoordinate = (y + firstLine - imageWindow[1]) * windowWidth + x + firstCol - imageWindow[0];
                  valueArrays[si][windowCoordinate] = value;
                }
              }
            }
          });
          promises.push(promise);
        }
      }
    }
    await Promise.all(promises);
    if (width && imageWindow[2] - imageWindow[0] !== width || height && imageWindow[3] - imageWindow[1] !== height) {
      let resampled;
      if (interleave) {
        resampled = resampleInterleaved(
          /** @type {TypedArray} */
          valueArrays,
          imageWindow[2] - imageWindow[0],
          imageWindow[3] - imageWindow[1],
          /** @type {number} */
          width,
          /** @type {number} */
          height,
          samples.length,
          resampleMethod
        );
      } else {
        resampled = resample(
          /** @type {TypedArray[]} */
          valueArrays,
          imageWindow[2] - imageWindow[0],
          imageWindow[3] - imageWindow[1],
          /** @type {number} */
          width,
          /** @type {number} */
          height,
          resampleMethod
        );
      }
      const resampledWithDimensions = (
        /** @type {ReadRasterResult} */
        resampled
      );
      resampledWithDimensions.width = width ?? imageWindow[2] - imageWindow[0];
      resampledWithDimensions.height = height ?? imageWindow[3] - imageWindow[1];
      return resampledWithDimensions;
    }
    const valueArraysWithDimensions = (
      /** @type {ReadRasterResult} */
      valueArrays
    );
    valueArraysWithDimensions.width = width || imageWindow[2] - imageWindow[0];
    valueArraysWithDimensions.height = height || imageWindow[3] - imageWindow[1];
    return valueArraysWithDimensions;
  }
  /**
   * @overload
   * @param {ReadRastersOptions & {interleave: true}} options optional parameters
   * @returns {Promise<import("./geotiff.js").TypedArrayWithDimensions>} the decoded arrays as a promise
   */
  /**
   * @overload
   * @param {ReadRastersOptions & {interleave: false}} options optional parameters
   * @returns {Promise<import("./geotiff.js").TypedArrayArrayWithDimensions>} the decoded arrays as a promise
   */
  /**
   * @overload
   * @param {ReadRastersOptions & {interleave: boolean}} options optional parameters
   * @returns {Promise<ReadRasterResult>} the decoded arrays as a promise
   */
  /**
   * @overload
   * @param {ReadRastersOptions} [options={}] optional parameters
   * @returns {Promise<import("./geotiff.js").TypedArrayArrayWithDimensions>} the decoded arrays as a promise
   */
  /**
   * Reads raster data from the image. This function reads all selected samples
   * into separate arrays of the correct type for that sample or into a single
   * combined array when `interleave` is set. When provided, only a subset
   * of the raster is read for each sample.
   *
   * @param {ReadRastersOptions} [options={}] optional parameters
   * @returns {Promise<ReadRasterResult>} the decoded arrays as a promise
   */
  async readRasters(options = {}) {
    const { window: wnd, samples = [], pool = null, width, height, resampleMethod, fillValue, signal } = options;
    const interleave = "interleave" in options && options.interleave;
    const imageWindow = wnd || [0, 0, this.getWidth(), this.getHeight()];
    if (imageWindow[0] > imageWindow[2] || imageWindow[1] > imageWindow[3]) {
      throw new Error("Invalid subsets");
    }
    const imageWindowWidth = imageWindow[2] - imageWindow[0];
    const imageWindowHeight = imageWindow[3] - imageWindow[1];
    const numPixels = imageWindowWidth * imageWindowHeight;
    const samplesPerPixel = this.getSamplesPerPixel();
    if (!samples || !samples.length) {
      for (let i = 0; i < samplesPerPixel; ++i) {
        samples.push(i);
      }
    } else {
      for (let i = 0; i < samples.length; ++i) {
        if (samples[i] >= samplesPerPixel) {
          return Promise.reject(new RangeError(`Invalid sample index '${samples[i]}'.`));
        }
      }
    }
    let valueArrays;
    if (interleave) {
      const { fileDirectory } = this;
      const sampleFormat = fileDirectory.getValue("SampleFormat");
      const format = sampleFormat ? Math.max.apply(null, Array.from(sampleFormat)) : 1;
      if (format !== 1 && format !== 2 && format !== 3) {
        throw new Error("Unsupported sample format for interleaved data. Must be 1, 2, or 3.");
      }
      const bitsPerSample_ = fileDirectory.getValue("BitsPerSample");
      const bitsPerSample = bitsPerSample_ ? Math.max.apply(null, Array.from(bitsPerSample_)) : 8;
      valueArrays = arrayForType(format, bitsPerSample, numPixels * samples.length);
      if (fillValue) {
        if (Array.isArray(fillValue)) {
          throw new Error("When reading interleaved data, fillValue must be a single number.");
        }
        valueArrays.fill(fillValue);
      }
    } else {
      valueArrays = [];
      for (let i = 0; i < samples.length; ++i) {
        const valueArray = this.getArrayForSample(samples[i], numPixels);
        if (Array.isArray(fillValue) && i < fillValue.length) {
          valueArray.fill(fillValue[i]);
        } else if (fillValue && !Array.isArray(fillValue)) {
          valueArray.fill(fillValue);
        }
        valueArrays.push(valueArray);
      }
    }
    const compression = this.fileDirectory.getValue("Compression") || 1;
    const decoderParameters = await getDecoderParameters(compression, this.fileDirectory);
    const poolOrDecoder = pool ? pool.bindParameters(compression, decoderParameters) : await getDecoder(compression, decoderParameters);
    const result = await this._readRaster(imageWindow, samples, valueArrays, interleave, poolOrDecoder, width, height, resampleMethod, signal);
    return result;
  }
  /**
   * @overload
   * @param {ReadRGBOptions & {interleave: true}} options optional parameters
   * @returns {Promise<import("./geotiff.js").TypedArrayWithDimensions>} the RGB array as a Promise
   */
  /**
   * @overload
   * @param {ReadRGBOptions & {interleave: false}} options optional parameters
   * @returns {Promise<import("./geotiff.js").TypedArrayArrayWithDimensions>} the RGB array as a Promise
   */
  /**
   * @overload
   * @param {ReadRGBOptions & {interleave: boolean}} options optional parameters
   * @returns {Promise<ReadRasterResult>} the RGB array as a Promise
   */
  /**
   * @overload
   * @param {ReadRGBOptions} [options={}] optional parameters
   * @returns {Promise<import("./geotiff.js").TypedArrayArrayWithDimensions>} the RGB array as a Promise
   */
  /**
   * Reads raster data from the image as RGB.
   * Colorspaces other than RGB will be transformed to RGB, color maps expanded.
   * When no other method is applicable, the first sample is used to produce a
   * grayscale image.
   * When provided, only a subset of the raster is read for each sample.
   *
   * @param {ReadRGBOptions} [options] optional parameters
   * @returns {Promise<ReadRasterResult>} the RGB array as a Promise
   */
  async readRGB(options = {}) {
    const { window, pool = null, width, height, resampleMethod, enableAlpha = false, signal } = options;
    const interleave = ("interleave" in options && options.interleave) ?? false;
    const imageWindow = window || [0, 0, this.getWidth(), this.getHeight()];
    if (imageWindow[0] > imageWindow[2] || imageWindow[1] > imageWindow[3]) {
      throw new Error("Invalid subsets");
    }
    const pi = this.fileDirectory.getValue("PhotometricInterpretation");
    if (pi === photometricInterpretations.RGB) {
      let s = [0, 1, 2];
      const extraSamples = this.fileDirectory.getValue("ExtraSamples");
      if (extraSamples && extraSamples[0] !== ExtraSamplesValues.Unspecified && enableAlpha) {
        s = [];
        const bitsPerSample = this.fileDirectory.getValue("BitsPerSample") || [];
        for (let i = 0; i < bitsPerSample.length; i += 1) {
          s.push(i);
        }
      }
      return this.readRasters({
        window,
        interleave,
        samples: s,
        pool,
        width,
        height,
        resampleMethod,
        signal
      });
    }
    let samples;
    switch (pi) {
      case photometricInterpretations.WhiteIsZero:
      case photometricInterpretations.BlackIsZero:
      case photometricInterpretations.Palette:
        samples = [0];
        break;
      case photometricInterpretations.CMYK:
        samples = [0, 1, 2, 3];
        break;
      case photometricInterpretations.YCbCr:
      case photometricInterpretations.CIELab:
        samples = [0, 1, 2];
        break;
      default:
        throw new Error("Invalid or unsupported photometric interpretation.");
    }
    const subOptions = {
      window: imageWindow,
      /** @type {true} */
      interleave: true,
      samples,
      pool,
      width,
      height,
      resampleMethod,
      signal
    };
    const { fileDirectory } = this;
    const raster = await this.readRasters(subOptions);
    const max = 2 ** this.getBitsPerSample(0);
    let data;
    switch (pi) {
      case photometricInterpretations.WhiteIsZero:
        data = fromWhiteIsZero(raster, max);
        break;
      case photometricInterpretations.BlackIsZero:
        data = fromBlackIsZero(raster, max);
        break;
      case photometricInterpretations.Palette:
        data = fromPalette(
          raster,
          /** @type {Uint16Array} */
          await fileDirectory.loadValue("ColorMap")
        );
        break;
      case photometricInterpretations.CMYK:
        data = fromCMYK(raster);
        break;
      case photometricInterpretations.YCbCr:
        data = fromYCbCr(raster);
        break;
      case photometricInterpretations.CIELab:
        data = fromCIELab(raster);
        break;
      default:
        throw new Error("Unsupported photometric interpretation.");
    }
    if (!interleave) {
      const red = new Uint8Array(data.length / 3);
      const green = new Uint8Array(data.length / 3);
      const blue = new Uint8Array(data.length / 3);
      for (let i = 0, j = 0; i < data.length; i += 3, ++j) {
        red[j] = data[i];
        green[j] = data[i + 1];
        blue[j] = data[i + 2];
      }
      data = [red, green, blue];
    }
    const dataWithDimensions = (
      /** @type {import("./geotiff.js").ReadRasterResult} */
      data
    );
    dataWithDimensions.width = raster.width;
    dataWithDimensions.height = raster.height;
    return dataWithDimensions;
  }
  /**
   * Returns an array of tiepoints.
   * @returns {Promise<Array<{i: number, j: number, k: number, x: number, y: number, z: number}>>} the tiepoints
   */
  async getTiePoints() {
    if (!this.fileDirectory.hasTag("ModelTiepoint")) {
      return [];
    }
    const modelTiePoint = await this.fileDirectory.loadValue("ModelTiepoint");
    if (typeof modelTiePoint !== "object") {
      throw new Error("Expected ModelTiepoint to be an array or typed array.");
    }
    const tiePoints = [];
    for (let i = 0; i < modelTiePoint.length; i += 6) {
      tiePoints.push({
        i: modelTiePoint[i],
        j: modelTiePoint[i + 1],
        k: modelTiePoint[i + 2],
        x: modelTiePoint[i + 3],
        y: modelTiePoint[i + 4],
        z: modelTiePoint[i + 5]
      });
    }
    return tiePoints;
  }
  /**
   * Returns the parsed GDAL metadata items.
   *
   * If sample is passed to null, dataset-level metadata will be returned.
   * Otherwise only metadata specific to the provided sample will be returned.
   *
   * @param {number|null} [sample=null] The sample index.
   * @returns {Promise<Record<string, unknown>|null>} The GDAL metadata items
   */
  async getGDALMetadata(sample = null) {
    const metadata = {};
    if (!this.fileDirectory.hasTag("GDAL_METADATA")) {
      return null;
    }
    const string = await this.fileDirectory.loadValue("GDAL_METADATA");
    let items = findTagsByName(string, "Item");
    if (sample === null) {
      items = items.filter((item) => getAttribute(item, "sample") === void 0);
    } else {
      items = items.filter((item) => Number(getAttribute(item, "sample")) === sample);
    }
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      metadata[getAttribute(item, "name")] = item.inner;
    }
    return metadata;
  }
  /**
   * Returns the GDAL nodata value
   * @returns {number|null}
   */
  getGDALNoData() {
    const string = this.fileDirectory.hasTag("GDAL_NODATA") && this.fileDirectory.getValue("GDAL_NODATA");
    if (!string) {
      return null;
    }
    return Number(string.substring(0, string.length - 1));
  }
  /**
   * Returns the image origin as a XYZ-vector. When the image has no affine
   * transformation, then an exception is thrown.
   * @returns {Array<number>} The origin as a vector
   */
  getOrigin() {
    const tiePoints = this.fileDirectory.getValue("ModelTiepoint");
    const modelTransformation = this.fileDirectory.getValue("ModelTransformation");
    if (tiePoints && tiePoints.length === 6) {
      return [
        tiePoints[3],
        tiePoints[4],
        tiePoints[5]
      ];
    }
    if (modelTransformation) {
      return [
        modelTransformation[3],
        modelTransformation[7],
        modelTransformation[11]
      ];
    }
    throw new Error("The image does not have an affine transformation.");
  }
  /**
   * Returns the image resolution as a XYZ-vector. When the image has no affine
   * transformation, then an exception is thrown.
   * @param {GeoTIFFImage|null} [referenceImage=null] A reference image to calculate the resolution from
   *                                             in cases when the current image does not have the
   *                                             required tags on its own.
   * @returns {Array<number>} The resolution as a vector
   */
  getResolution(referenceImage = null) {
    const modelPixelScale = this.fileDirectory.getValue("ModelPixelScale");
    const modelTransformation = this.fileDirectory.getValue("ModelTransformation");
    if (modelPixelScale) {
      return [
        modelPixelScale[0],
        -modelPixelScale[1],
        modelPixelScale[2]
      ];
    }
    if (modelTransformation) {
      if (modelTransformation[1] === 0 && modelTransformation[4] === 0) {
        return [
          modelTransformation[0],
          -modelTransformation[5],
          modelTransformation[10]
        ];
      }
      return [
        Math.sqrt(modelTransformation[0] * modelTransformation[0] + modelTransformation[4] * modelTransformation[4]),
        -Math.sqrt(modelTransformation[1] * modelTransformation[1] + modelTransformation[5] * modelTransformation[5]),
        modelTransformation[10]
      ];
    }
    if (referenceImage) {
      const [refResX, refResY, refResZ] = referenceImage.getResolution();
      return [
        refResX * referenceImage.getWidth() / this.getWidth(),
        refResY * referenceImage.getHeight() / this.getHeight(),
        refResZ * referenceImage.getWidth() / this.getWidth()
      ];
    }
    throw new Error("The image does not have an affine transformation.");
  }
  /**
   * Returns whether or not the pixels of the image depict an area (or point).
   * @returns {Boolean} Whether the pixels are a point
   */
  pixelIsArea() {
    return this.getGeoKeys()?.GTRasterTypeGeoKey === 1;
  }
  /**
   * Returns the image bounding box as an array of 4 values: min-x, min-y,
   * max-x and max-y. When the image has no affine transformation, then an
   * exception is thrown.
   * @param {boolean} [tilegrid=false] If true return extent for a tilegrid
   *                                   without adjustment for ModelTransformation.
   * @returns {Array<number>} The bounding box
   */
  getBoundingBox(tilegrid = false) {
    const height = this.getHeight();
    const width = this.getWidth();
    const modelTransformation = this.fileDirectory.getValue("ModelTransformation");
    if (modelTransformation && !tilegrid) {
      const [a, b, , d, e, f, , h] = modelTransformation;
      const corners = [
        [0, 0],
        [0, height],
        [width, 0],
        [width, height]
      ];
      const projected = corners.map(([I, J]) => [
        d + a * I + b * J,
        h + e * I + f * J
      ]);
      const xs = projected.map((pt) => pt[0]);
      const ys = projected.map((pt) => pt[1]);
      return [
        Math.min(...xs),
        Math.min(...ys),
        Math.max(...xs),
        Math.max(...ys)
      ];
    } else {
      const origin = this.getOrigin();
      const resolution = this.getResolution();
      const x1 = origin[0];
      const y1 = origin[1];
      const x2 = x1 + resolution[0] * width;
      const y2 = y1 + resolution[1] * height;
      return [
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.max(x1, x2),
        Math.max(y1, y2)
      ];
    }
  }
};
var geotiffimage_default = GeoTIFFImage;

// node_modules/geotiff/dist-module/dataview64.js
var DataView64 = class {
  static {
    __name(this, "DataView64");
  }
  /**
   * @param {ArrayBufferLike} arrayBuffer
   */
  constructor(arrayBuffer) {
    this._dataView = new DataView(arrayBuffer);
  }
  get buffer() {
    return this._dataView.buffer;
  }
  /**
   * @param {number} offset
   * @param {boolean} littleEndian
   * @returns {number}
   */
  getUint64(offset, littleEndian) {
    const left = this.getUint32(offset, littleEndian);
    const right = this.getUint32(offset + 4, littleEndian);
    let combined;
    if (littleEndian) {
      combined = left + 2 ** 32 * right;
      if (!Number.isSafeInteger(combined)) {
        throw new Error(`${combined} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);
      }
      return combined;
    }
    combined = 2 ** 32 * left + right;
    if (!Number.isSafeInteger(combined)) {
      throw new Error(`${combined} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);
    }
    return combined;
  }
  /**
   * Adapted from https://stackoverflow.com/a/55338384/8060591
   * @param {number} offset
   * @param {boolean} littleEndian
   * @returns {number}
   */
  getInt64(offset, littleEndian) {
    let value = 0;
    const isNegative = (this._dataView.getUint8(offset + (littleEndian ? 7 : 0)) & 128) > 0;
    let carrying = true;
    for (let i = 0; i < 8; i++) {
      let byte = this._dataView.getUint8(offset + (littleEndian ? i : 7 - i));
      if (isNegative) {
        if (carrying) {
          if (byte !== 0) {
            byte = ~(byte - 1) & 255;
            carrying = false;
          }
        } else {
          byte = ~byte & 255;
        }
      }
      value += byte * 256 ** i;
    }
    if (isNegative) {
      value = -value;
    }
    return value;
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  getUint8(offset) {
    return this._dataView.getUint8(offset);
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  getInt8(offset) {
    return this._dataView.getInt8(offset);
  }
  /**
   * @param {number} offset
   * @param {boolean} littleEndian
   * @returns {number}
   */
  getUint16(offset, littleEndian) {
    return this._dataView.getUint16(offset, littleEndian);
  }
  /**
   * @param {number} offset
   * @param {boolean} littleEndian
   * @returns {number}
   */
  getInt16(offset, littleEndian) {
    return this._dataView.getInt16(offset, littleEndian);
  }
  /**
   * @param {number} offset
   * @param {boolean} littleEndian
   * @returns {number}
   */
  getUint32(offset, littleEndian) {
    return this._dataView.getUint32(offset, littleEndian);
  }
  /**
   * @param {number} offset
   * @param {boolean} littleEndian
   * @returns {number}
   */
  getInt32(offset, littleEndian) {
    return this._dataView.getInt32(offset, littleEndian);
  }
  /**
   * @param {number} offset
   * @param {boolean} littleEndian
   * @returns {number}
   */
  getFloat16(offset, littleEndian) {
    return getFloat16(this._dataView, offset, littleEndian);
  }
  /**
   * @param {number} offset
   * @param {boolean} littleEndian
   * @returns {number}
   */
  getFloat32(offset, littleEndian) {
    return this._dataView.getFloat32(offset, littleEndian);
  }
  /**
   * @param {number} offset
   * @param {boolean} littleEndian
   * @returns {number}
   */
  getFloat64(offset, littleEndian) {
    return this._dataView.getFloat64(offset, littleEndian);
  }
};

// node_modules/geotiff/dist-module/dataslice.js
var DataSlice = class {
  static {
    __name(this, "DataSlice");
  }
  /**
   * @param {ArrayBufferLike} arrayBuffer
   * @param {number} sliceOffset
   * @param {boolean} littleEndian
   * @param {boolean} bigTiff
   */
  constructor(arrayBuffer, sliceOffset, littleEndian, bigTiff) {
    this._dataView = new DataView(arrayBuffer);
    this._sliceOffset = sliceOffset;
    this._littleEndian = littleEndian;
    this._bigTiff = bigTiff;
  }
  get sliceOffset() {
    return this._sliceOffset;
  }
  get sliceTop() {
    return this._sliceOffset + this.buffer.byteLength;
  }
  get littleEndian() {
    return this._littleEndian;
  }
  get bigTiff() {
    return this._bigTiff;
  }
  get buffer() {
    return this._dataView.buffer;
  }
  /**
   * @param {number} offset
   * @param {number} length
   * @returns {boolean}
   */
  covers(offset, length) {
    return this.sliceOffset <= offset && this.sliceTop >= offset + length;
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  readUint8(offset) {
    return this._dataView.getUint8(offset - this._sliceOffset);
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  readInt8(offset) {
    return this._dataView.getInt8(offset - this._sliceOffset);
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  readUint16(offset) {
    return this._dataView.getUint16(offset - this._sliceOffset, this._littleEndian);
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  readInt16(offset) {
    return this._dataView.getInt16(offset - this._sliceOffset, this._littleEndian);
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  readUint32(offset) {
    return this._dataView.getUint32(offset - this._sliceOffset, this._littleEndian);
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  readInt32(offset) {
    return this._dataView.getInt32(offset - this._sliceOffset, this._littleEndian);
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  readFloat32(offset) {
    return this._dataView.getFloat32(offset - this._sliceOffset, this._littleEndian);
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  readFloat64(offset) {
    return this._dataView.getFloat64(offset - this._sliceOffset, this._littleEndian);
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  readUint64(offset) {
    const left = this.readUint32(offset);
    const right = this.readUint32(offset + 4);
    let combined;
    if (this._littleEndian) {
      combined = left + 2 ** 32 * right;
      if (!Number.isSafeInteger(combined)) {
        throw new Error(`${combined} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);
      }
      return combined;
    }
    combined = 2 ** 32 * left + right;
    if (!Number.isSafeInteger(combined)) {
      throw new Error(`${combined} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);
    }
    return combined;
  }
  /**
   * Adapted from https://stackoverflow.com/a/55338384/8060591
   * @param {number} offset
   * @returns {number}
   */
  readInt64(offset) {
    let value = 0;
    const isNegative = (this._dataView.getUint8(offset + (this._littleEndian ? 7 : 0)) & 128) > 0;
    let carrying = true;
    for (let i = 0; i < 8; i++) {
      let byte = this._dataView.getUint8(offset + (this._littleEndian ? i : 7 - i));
      if (isNegative) {
        if (carrying) {
          if (byte !== 0) {
            byte = ~(byte - 1) & 255;
            carrying = false;
          }
        } else {
          byte = ~byte & 255;
        }
      }
      value += byte * 256 ** i;
    }
    if (isNegative) {
      value = -value;
    }
    return value;
  }
  /**
   * @param {number} offset
   * @returns {number}
   */
  readOffset(offset) {
    if (this._bigTiff) {
      return this.readUint64(offset);
    }
    return this.readUint32(offset);
  }
};

// node_modules/geotiff/dist-module/source/httputils.js
var CRLFCRLF = "\r\n\r\n";
function itemsToObject(items) {
  if (typeof Object.fromEntries !== "undefined") {
    return Object.fromEntries(items);
  }
  const obj = {};
  for (const [key, value] of items) {
    obj[key.toLowerCase()] = value;
  }
  return obj;
}
__name(itemsToObject, "itemsToObject");
function parseHeaders(text) {
  const items = text.split("\r\n").map((line) => {
    const kv = (
      /** @type {[string, string]} */
      line.split(":").map((str) => str.trim())
    );
    kv[0] = kv[0].toLowerCase();
    return kv;
  });
  return itemsToObject(items);
}
__name(parseHeaders, "parseHeaders");
function parseContentType(rawContentType) {
  if (!rawContentType) {
    return { type: null, params: {} };
  }
  const [type, ...rawParams] = rawContentType.split(";").map((s) => s.trim());
  const paramsItems = (
    /** @type {Array<[string, string]>} */
    rawParams.map((param) => param.split("="))
  );
  return { type, params: itemsToObject(paramsItems) };
}
__name(parseContentType, "parseContentType");
function parseContentRange(rawContentRange) {
  let start = NaN;
  let end = NaN;
  let total = NaN;
  if (rawContentRange) {
    [, start, end, total] = (rawContentRange.match(/bytes (\d+)-(\d+)\/(\d+)/) || []).map(Number);
  }
  return { start, end, total };
}
__name(parseContentRange, "parseContentRange");
function parseByteRanges(responseArrayBuffer, boundary) {
  let offset = -1;
  const decoder2 = new TextDecoder("ascii");
  const out = [];
  const startBoundary = `--${boundary}`;
  const endBoundary = `${startBoundary}--`;
  for (let i = 0; i < 10; ++i) {
    const text = decoder2.decode(new Uint8Array(responseArrayBuffer, i, startBoundary.length));
    if (text === startBoundary) {
      offset = i;
    }
  }
  if (offset === -1) {
    throw new Error("Could not find initial boundary");
  }
  while (offset < responseArrayBuffer.byteLength) {
    const text = decoder2.decode(new Uint8Array(responseArrayBuffer, offset, Math.min(startBoundary.length + 1024, responseArrayBuffer.byteLength - offset)));
    if (text.length === 0 || text.startsWith(endBoundary)) {
      break;
    }
    if (!text.startsWith(startBoundary)) {
      throw new Error("Part does not start with boundary");
    }
    const innerText = text.substr(startBoundary.length + 2);
    if (innerText.length === 0) {
      break;
    }
    const endOfHeaders = innerText.indexOf(CRLFCRLF);
    const headers = parseHeaders(innerText.substr(0, endOfHeaders));
    const { start, end, total } = parseContentRange(headers["content-range"]);
    const startOfData = offset + startBoundary.length + endOfHeaders + CRLFCRLF.length;
    const length = end + 1 - start;
    out.push({
      headers,
      data: responseArrayBuffer.slice(startOfData, startOfData + length),
      offset: start,
      length,
      fileSize: total
    });
    offset = startOfData + length + 4;
  }
  return out;
}
__name(parseByteRanges, "parseByteRanges");

// node_modules/geotiff/dist-module/source/basesource.js
var BaseSource = class {
  static {
    __name(this, "BaseSource");
  }
  /**
   * @param {Array<Slice>} slices
   * @param {AbortSignal} [signal]
   * @returns {Promise<ArrayBufferLike[]>}
   */
  async fetch(slices, signal) {
    return Promise.all(slices.map(async (slice) => (await this.fetchSlice(slice, signal)).data));
  }
  /**
   * @param {Slice} slice
   * @param {AbortSignal} [_signal]
   * @returns {Promise<SliceWithData>}
   */
  async fetchSlice(slice, _signal) {
    throw new Error(`fetching of slice ${slice} not possible, not implemented`);
  }
  /**
   * Returns the filesize if already determined and null otherwise
   * @returns {number|null}
   */
  get fileSize() {
    return null;
  }
  async close() {
  }
};

// node_modules/quick-lru/index.js
var QuickLRU = class extends Map {
  static {
    __name(this, "QuickLRU");
  }
  constructor(options = {}) {
    super();
    if (!(options.maxSize && options.maxSize > 0)) {
      throw new TypeError("`maxSize` must be a number greater than 0");
    }
    if (typeof options.maxAge === "number" && options.maxAge === 0) {
      throw new TypeError("`maxAge` must be a number greater than 0");
    }
    this.maxSize = options.maxSize;
    this.maxAge = options.maxAge || Number.POSITIVE_INFINITY;
    this.onEviction = options.onEviction;
    this.cache = /* @__PURE__ */ new Map();
    this.oldCache = /* @__PURE__ */ new Map();
    this._size = 0;
  }
  // TODO: Use private class methods when targeting Node.js 16.
  _emitEvictions(cache) {
    if (typeof this.onEviction !== "function") {
      return;
    }
    for (const [key, item] of cache) {
      this.onEviction(key, item.value);
    }
  }
  _deleteIfExpired(key, item) {
    if (typeof item.expiry === "number" && item.expiry <= Date.now()) {
      if (typeof this.onEviction === "function") {
        this.onEviction(key, item.value);
      }
      return this.delete(key);
    }
    return false;
  }
  _getOrDeleteIfExpired(key, item) {
    const deleted = this._deleteIfExpired(key, item);
    if (deleted === false) {
      return item.value;
    }
  }
  _getItemValue(key, item) {
    return item.expiry ? this._getOrDeleteIfExpired(key, item) : item.value;
  }
  _peek(key, cache) {
    const item = cache.get(key);
    return this._getItemValue(key, item);
  }
  _set(key, value) {
    this.cache.set(key, value);
    this._size++;
    if (this._size >= this.maxSize) {
      this._size = 0;
      this._emitEvictions(this.oldCache);
      this.oldCache = this.cache;
      this.cache = /* @__PURE__ */ new Map();
    }
  }
  _moveToRecent(key, item) {
    this.oldCache.delete(key);
    this._set(key, item);
  }
  *_entriesAscending() {
    for (const item of this.oldCache) {
      const [key, value] = item;
      if (!this.cache.has(key)) {
        const deleted = this._deleteIfExpired(key, value);
        if (deleted === false) {
          yield item;
        }
      }
    }
    for (const item of this.cache) {
      const [key, value] = item;
      const deleted = this._deleteIfExpired(key, value);
      if (deleted === false) {
        yield item;
      }
    }
  }
  get(key) {
    if (this.cache.has(key)) {
      const item = this.cache.get(key);
      return this._getItemValue(key, item);
    }
    if (this.oldCache.has(key)) {
      const item = this.oldCache.get(key);
      if (this._deleteIfExpired(key, item) === false) {
        this._moveToRecent(key, item);
        return item.value;
      }
    }
  }
  set(key, value, { maxAge = this.maxAge } = {}) {
    const expiry = typeof maxAge === "number" && maxAge !== Number.POSITIVE_INFINITY ? Date.now() + maxAge : void 0;
    if (this.cache.has(key)) {
      this.cache.set(key, {
        value,
        expiry
      });
    } else {
      this._set(key, { value, expiry });
    }
    return this;
  }
  has(key) {
    if (this.cache.has(key)) {
      return !this._deleteIfExpired(key, this.cache.get(key));
    }
    if (this.oldCache.has(key)) {
      return !this._deleteIfExpired(key, this.oldCache.get(key));
    }
    return false;
  }
  peek(key) {
    if (this.cache.has(key)) {
      return this._peek(key, this.cache);
    }
    if (this.oldCache.has(key)) {
      return this._peek(key, this.oldCache);
    }
  }
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this._size--;
    }
    return this.oldCache.delete(key) || deleted;
  }
  clear() {
    this.cache.clear();
    this.oldCache.clear();
    this._size = 0;
  }
  resize(newSize) {
    if (!(newSize && newSize > 0)) {
      throw new TypeError("`maxSize` must be a number greater than 0");
    }
    const items = [...this._entriesAscending()];
    const removeCount = items.length - newSize;
    if (removeCount < 0) {
      this.cache = new Map(items);
      this.oldCache = /* @__PURE__ */ new Map();
      this._size = items.length;
    } else {
      if (removeCount > 0) {
        this._emitEvictions(items.slice(0, removeCount));
      }
      this.oldCache = new Map(items.slice(removeCount));
      this.cache = /* @__PURE__ */ new Map();
      this._size = 0;
    }
    this.maxSize = newSize;
  }
  *keys() {
    for (const [key] of this) {
      yield key;
    }
  }
  *values() {
    for (const [, value] of this) {
      yield value;
    }
  }
  *[Symbol.iterator]() {
    for (const item of this.cache) {
      const [key, value] = item;
      const deleted = this._deleteIfExpired(key, value);
      if (deleted === false) {
        yield [key, value.value];
      }
    }
    for (const item of this.oldCache) {
      const [key, value] = item;
      if (!this.cache.has(key)) {
        const deleted = this._deleteIfExpired(key, value);
        if (deleted === false) {
          yield [key, value.value];
        }
      }
    }
  }
  *entriesDescending() {
    let items = [...this.cache];
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i];
      const [key, value] = item;
      const deleted = this._deleteIfExpired(key, value);
      if (deleted === false) {
        yield [key, value.value];
      }
    }
    items = [...this.oldCache];
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i];
      const [key, value] = item;
      if (!this.cache.has(key)) {
        const deleted = this._deleteIfExpired(key, value);
        if (deleted === false) {
          yield [key, value.value];
        }
      }
    }
  }
  *entriesAscending() {
    for (const [key, value] of this._entriesAscending()) {
      yield [key, value.value];
    }
  }
  get size() {
    if (!this._size) {
      return this.oldCache.size;
    }
    let oldCacheSize = 0;
    for (const key of this.oldCache.keys()) {
      if (!this.cache.has(key)) {
        oldCacheSize++;
      }
    }
    return Math.min(this._size + oldCacheSize, this.maxSize);
  }
  entries() {
    return this.entriesAscending();
  }
  forEach(callbackFunction, thisArgument = this) {
    for (const [key, value] of this.entriesAscending()) {
      callbackFunction.call(thisArgument, value, key, this);
    }
  }
  get [Symbol.toStringTag]() {
    return JSON.stringify([...this.entriesAscending()]);
  }
};

// node_modules/geotiff/dist-module/utils.js
async function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
__name(wait, "wait");
function zip(a, b) {
  const A = Array.isArray(a) ? a : Array.from(a);
  const B = Array.isArray(b) ? b : Array.from(b);
  return A.map((k, i) => [k, B[i]]);
}
__name(zip, "zip");
var AbortError = class _AbortError extends Error {
  static {
    __name(this, "AbortError");
  }
  constructor(...args) {
    super(...args);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _AbortError);
    }
    this.name = "AbortError";
    this.signal = void 0;
  }
};
var CustomAggregateError = class extends Error {
  static {
    __name(this, "CustomAggregateError");
  }
  constructor(errors, message) {
    super(message);
    this.errors = errors;
    this.message = message;
    this.name = "AggregateError";
  }
};
var AggregateError = CustomAggregateError;

// node_modules/geotiff/dist-module/source/blockedsource.js
var Block = class {
  static {
    __name(this, "Block");
  }
  /**
   *
   * @param {number} offset
   * @param {number} length
   * @param {ArrayBuffer} data
   */
  constructor(offset, length, data) {
    this.offset = offset;
    this.length = length;
    this.data = data;
  }
  /**
   * @returns {number} the top byte border
   */
  get top() {
    return this.offset + this.length;
  }
};
var BlockGroup = class {
  static {
    __name(this, "BlockGroup");
  }
  /**
   *
   * @param {number} offset
   * @param {number} length
   * @param {number[]} blockIds
   */
  constructor(offset, length, blockIds) {
    this.offset = offset;
    this.length = length;
    this.blockIds = blockIds;
  }
};
var BlockedSource = class extends BaseSource {
  static {
    __name(this, "BlockedSource");
  }
  /**
   *
   * @param {BaseSource} source The underlying source that shall be blocked and cached
   * @param {object} options
   * @param {number} [options.blockSize]
   * @param {number} [options.cacheSize]
   */
  constructor(source, { blockSize = 65536, cacheSize = 100 } = {}) {
    super();
    this.source = source;
    this.blockSize = blockSize;
    this.blockCache = new QuickLRU({
      maxSize: cacheSize,
      onEviction: /* @__PURE__ */ __name((blockId, block) => {
        this.evictedBlocks.set(blockId, block);
      }, "onEviction")
    });
    this.evictedBlocks = /* @__PURE__ */ new Map();
    this.blockRequests = /* @__PURE__ */ new Map();
    this.blockIdsToFetch = /* @__PURE__ */ new Set();
    this.abortedBlockIds = /* @__PURE__ */ new Set();
  }
  get fileSize() {
    return this.source.fileSize;
  }
  /**
   * @param {import("./basesource.js").Slice[]} slices
   * @param {AbortSignal} [signal]
   * @return {Promise<ArrayBuffer[]>}
   */
  async fetch(slices, signal) {
    const blockRequests = [];
    const missingBlockIds = [];
    const allBlockIds = [];
    this.evictedBlocks.clear();
    for (const { offset, length } of slices) {
      let top = offset + length;
      const { fileSize } = this;
      if (fileSize !== null) {
        top = Math.min(top, fileSize);
      }
      const firstBlockOffset = Math.floor(offset / this.blockSize) * this.blockSize;
      for (let current = firstBlockOffset; current < top; current += this.blockSize) {
        const blockId = Math.floor(current / this.blockSize);
        if (!this.blockCache.has(blockId) && !this.blockRequests.has(blockId)) {
          this.blockIdsToFetch.add(blockId);
          missingBlockIds.push(blockId);
        }
        if (this.blockRequests.has(blockId)) {
          blockRequests.push(this.blockRequests.get(blockId));
        }
        allBlockIds.push(blockId);
      }
    }
    await wait();
    this.fetchBlocks(signal);
    const missingRequests = [];
    for (const blockId of missingBlockIds) {
      if (this.blockRequests.has(blockId)) {
        missingRequests.push(this.blockRequests.get(blockId));
      }
    }
    await Promise.allSettled(blockRequests);
    await Promise.allSettled(missingRequests);
    const abortedBlockRequests = [];
    const abortedBlockIds = allBlockIds.filter((id) => this.abortedBlockIds.has(id) || !this.blockCache.has(id));
    abortedBlockIds.forEach((id) => this.blockIdsToFetch.add(id));
    if (abortedBlockIds.length > 0 && signal && !signal.aborted) {
      this.fetchBlocks();
      for (const blockId of abortedBlockIds) {
        const block = this.blockRequests.get(blockId);
        if (!block) {
          throw new Error(`Block ${blockId} is not in the block requests`);
        }
        abortedBlockRequests.push(block);
      }
      await Promise.allSettled(abortedBlockRequests);
    }
    if (signal && signal.aborted) {
      throw new AbortError("Request was aborted");
    }
    const blocks = allBlockIds.map((id) => this.blockCache.get(id) || this.evictedBlocks.get(id));
    const failedBlocks = blocks.filter((i) => !i);
    if (failedBlocks.length) {
      throw new AggregateError(failedBlocks, "Request failed");
    }
    const requiredBlocks = new Map(zip(allBlockIds, blocks));
    return this.readSliceData(slices, requiredBlocks);
  }
  /**
   * @param {AbortSignal} [signal]
   */
  fetchBlocks(signal) {
    if (this.blockIdsToFetch.size > 0) {
      const groups = this.groupBlocks(this.blockIdsToFetch);
      const groupRequests = groups.map(async (group) => ({ ...group, ...await this.source.fetchSlice(group, signal) }));
      for (let groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
        const group = groups[groupIndex];
        for (const blockId of group.blockIds) {
          this.blockRequests.set(blockId, (async () => {
            try {
              const response = (await Promise.all(groupRequests))[groupIndex];
              const blockOffset = blockId * this.blockSize;
              const o = blockOffset - response.offset;
              const t = Math.min(o + this.blockSize, response.data.byteLength);
              const data = response.data.slice(o, t);
              const block = new Block(
                blockOffset,
                data.byteLength,
                /** @type {ArrayBuffer} */
                data
              );
              this.blockCache.set(blockId, block);
              this.abortedBlockIds.delete(blockId);
            } catch (err2) {
              if (err2 instanceof AbortError && err2.name === "AbortError") {
                err2.signal = signal;
                this.blockCache.delete(blockId);
                this.abortedBlockIds.add(blockId);
              } else {
                throw err2;
              }
            } finally {
              this.blockRequests.delete(blockId);
            }
          })());
        }
      }
      this.blockIdsToFetch.clear();
    }
  }
  /**
   *
   * @param {Set<number>} blockIds
   * @returns {BlockGroup[]}
   */
  groupBlocks(blockIds) {
    const sortedBlockIds = Array.from(blockIds).sort((a, b) => a - b);
    if (sortedBlockIds.length === 0) {
      return [];
    }
    let current = [];
    let lastBlockId = null;
    const groups = [];
    for (const blockId of sortedBlockIds) {
      if (lastBlockId === null || lastBlockId + 1 === blockId) {
        current.push(blockId);
        lastBlockId = blockId;
      } else {
        groups.push(new BlockGroup(current[0] * this.blockSize, current.length * this.blockSize, current));
        current = [blockId];
        lastBlockId = blockId;
      }
    }
    groups.push(new BlockGroup(current[0] * this.blockSize, current.length * this.blockSize, current));
    return groups;
  }
  /**
   * @param {import("./basesource.js").Slice[]} slices
   * @param {Map<number, Block>} blocks
   * @returns {ArrayBuffer[]}
   */
  readSliceData(slices, blocks) {
    return slices.map((slice) => {
      let top = slice.offset + slice.length;
      if (this.fileSize !== null) {
        top = Math.min(this.fileSize, top);
      }
      const blockIdLow = Math.floor(slice.offset / this.blockSize);
      const blockIdHigh = Math.floor((top - 1) / this.blockSize);
      const sliceData = new ArrayBuffer(slice.length);
      const sliceView = new Uint8Array(sliceData);
      for (let blockId = blockIdLow; blockId <= blockIdHigh; ++blockId) {
        const block = blocks.get(blockId);
        if (!block) {
          continue;
        }
        const delta = block.offset - slice.offset;
        const topDelta = block.top - top;
        let blockInnerOffset = 0;
        let rangeInnerOffset = 0;
        let usedBlockLength;
        if (delta < 0) {
          blockInnerOffset = -delta;
        } else if (delta > 0) {
          rangeInnerOffset = delta;
        }
        if (topDelta < 0) {
          usedBlockLength = block.length - blockInnerOffset;
        } else {
          usedBlockLength = top - block.offset - blockInnerOffset;
        }
        const blockView = new Uint8Array(block.data, blockInnerOffset, usedBlockLength);
        sliceView.set(blockView, rangeInnerOffset);
      }
      return sliceData;
    });
  }
};

// node_modules/geotiff/dist-module/source/client/base.js
var BaseResponse = class {
  static {
    __name(this, "BaseResponse");
  }
  /**
   * Returns whether the response has an ok'ish status code
   */
  get ok() {
    return this.status >= 200 && this.status <= 299;
  }
  /**
   * Returns the status code of the response
   * @returns {number} the status code
   */
  get status() {
    throw new Error("not implemented");
  }
  /**
   * Returns the value of the specified header
   * @param {string} _headerName the header name
   * @returns {string|undefined} the header value
   */
  getHeader(_headerName) {
    throw new Error("not implemented");
  }
  /**
   * @returns {Promise<ArrayBuffer>} the response data of the request
   */
  async getData() {
    throw new Error("not implemented");
  }
};
var BaseClient = class {
  static {
    __name(this, "BaseClient");
  }
  /** @param {string} url */
  constructor(url) {
    this.url = url;
  }
  /**
   * Send a request with the options
   * @param {RequestInit} [_options={}]
   * @returns {Promise<BaseResponse>}
   */
  async request(_options) {
    throw new Error("request is not implemented");
  }
};

// node_modules/geotiff/dist-module/source/client/fetch.js
var FetchResponse = class extends BaseResponse {
  static {
    __name(this, "FetchResponse");
  }
  /**
   * BaseResponse facade for fetch API Response
   * @param {Response} response
   */
  constructor(response) {
    super();
    this.response = response;
  }
  get status() {
    return this.response.status;
  }
  /**
   * @param {string} name
   * @returns {string|undefined}
   */
  getHeader(name) {
    return this.response.headers.get(name) || void 0;
  }
  async getData() {
    const data = this.response.arrayBuffer ? await this.response.arrayBuffer() : (await /** @type {*} */
    this.response.buffer()).buffer;
    return data;
  }
};
var FetchClient = class extends BaseClient {
  static {
    __name(this, "FetchClient");
  }
  /**
   * @param {string} url
   * @param {RequestCredentials} [credentials]
   */
  constructor(url, credentials) {
    super(url);
    this.credentials = credentials;
  }
  /**
   * @param {RequestInit} [options={}]
   * @returns {Promise<FetchResponse>}
   */
  async request({ headers, signal } = {}) {
    const response = await fetch(this.url, {
      headers,
      credentials: this.credentials,
      signal
    });
    return new FetchResponse(response);
  }
};

// node_modules/geotiff/dist-module/source/client/xhr.js
var XHRResponse = class extends BaseResponse {
  static {
    __name(this, "XHRResponse");
  }
  /**
   * BaseResponse facade for XMLHttpRequest
   * @param {XMLHttpRequest} xhr
   * @param {ArrayBuffer} data
   */
  constructor(xhr, data) {
    super();
    this.xhr = xhr;
    this.data = data;
  }
  get status() {
    return this.xhr.status;
  }
  /**
   * @param {string} name
   * @returns {string|undefined}
   */
  getHeader(name) {
    return this.xhr.getResponseHeader(name) || void 0;
  }
  async getData() {
    return this.data;
  }
};
var XHRClient = class extends BaseClient {
  static {
    __name(this, "XHRClient");
  }
  /**
   * @param {Object<string, string>} headers
   * @param {AbortSignal} [signal]
   * @returns {Promise<XHRResponse>}
   */
  constructRequest(headers, signal) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", this.url);
      xhr.responseType = "arraybuffer";
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }
      xhr.onload = () => {
        const data = xhr.response;
        resolve(new XHRResponse(xhr, data));
      };
      xhr.onerror = reject;
      xhr.onabort = () => reject(new AbortError("Request aborted"));
      xhr.send();
      if (signal) {
        if (signal.aborted) {
          xhr.abort();
        }
        signal.addEventListener("abort", () => xhr.abort());
      }
    });
  }
  async request({ headers = {}, signal = void 0 } = {}) {
    const response = await this.constructRequest(headers, signal);
    return response;
  }
};

// node_modules/geotiff/dist-module/source/client/http.js
import http from "http";
import https from "https";
import urlMod from "url";
var HttpResponse = class extends BaseResponse {
  static {
    __name(this, "HttpResponse");
  }
  /**
   * BaseResponse facade for node HTTP/HTTPS API Response
   * @param {import('http').IncomingMessage} response
   * @param {Promise<ArrayBuffer>} dataPromise
   */
  constructor(response, dataPromise) {
    super();
    this.response = response;
    this.dataPromise = dataPromise;
  }
  get status() {
    return (
      /** @type {number} */
      this.response.statusCode
    );
  }
  /**
   * @param {string} name
   * @returns {string|undefined}
   */
  getHeader(name) {
    const value = this.response.headers[name];
    return Array.isArray(value) ? value.join(", ") : value;
  }
  async getData() {
    const data = await this.dataPromise;
    return data;
  }
};
var HttpClient = class extends BaseClient {
  static {
    __name(this, "HttpClient");
  }
  /** @param {string} url */
  constructor(url) {
    super(url);
    this.parsedUrl = urlMod.parse(this.url);
    this.httpApi = this.parsedUrl.protocol === "http:" ? http : https;
  }
  /**
   * @param {Object<string, string>} headers
   * @param {AbortSignal} [signal]
   * @returns {Promise<HttpResponse>}
   */
  constructRequest(headers, signal) {
    return new Promise((resolve, reject) => {
      const request = this.httpApi.get({
        ...this.parsedUrl,
        headers
      }, (response) => {
        const dataPromise = new Promise((resolveData) => {
          const chunks = [];
          response.on("data", (chunk) => {
            chunks.push(chunk);
          });
          response.on("end", () => {
            const data = Buffer.concat(chunks).buffer;
            resolveData(data);
          });
          response.on("error", reject);
        });
        resolve(new HttpResponse(response, dataPromise));
      });
      request.on("error", reject);
      if (signal) {
        if (signal.aborted) {
          request.destroy(new AbortError("Request aborted"));
        }
        signal.addEventListener("abort", () => request.destroy(new AbortError("Request aborted")));
      }
    });
  }
  async request({ headers = {}, signal = void 0 } = {}) {
    const response = await this.constructRequest(headers, signal);
    return response;
  }
};

// node_modules/geotiff/dist-module/source/remote.js
var RemoteSource = class extends BaseSource {
  static {
    __name(this, "RemoteSource");
  }
  /**
   * @param {import("../geotiff.js").BaseClient} client
   * @param {RemoteSourceOptions} options
   */
  constructor(client, { headers, maxRanges = 0, allowFullFile } = {}) {
    super();
    this.client = client;
    this.headers = headers;
    this.maxRanges = maxRanges;
    this.allowFullFile = allowFullFile;
    this._fileSize = null;
  }
  /**
   * @param {import('./basesource.js').Slice[]} slices
   * @param {AbortSignal} [signal]
   * @returns {Promise<ArrayBufferLike[]>}
   */
  async fetch(slices, signal) {
    if (this.maxRanges >= slices.length) {
      return this.fetchSlices(slices, signal).then((results) => results.map((r) => r.data));
    } else if (this.maxRanges > 0 && slices.length > 1) {
    }
    return Promise.all(slices.map(async (slice) => (await this.fetchSlice(slice, signal)).data));
  }
  /**
   * @param {Array<import('./basesource.js').Slice>} slices
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array<import('./basesource.js').SliceWithData>>}
   */
  async fetchSlices(slices, signal) {
    const response = await this.client.request({
      headers: {
        ...this.headers,
        Range: `bytes=${slices.map(({ offset, length }) => `${offset}-${offset + length - 1}`).join(",")}`
      },
      signal
    });
    if (!response.ok) {
      throw new Error("Error fetching data.");
    } else if (response.status === 206) {
      const { type, params } = parseContentType(response.getHeader("content-type"));
      if (type === "multipart/byteranges") {
        const byteRanges = parseByteRanges(await response.getData(), params.boundary);
        this._fileSize = byteRanges[0].fileSize || null;
        return byteRanges;
      }
      const data = await response.getData();
      const { start, end, total } = parseContentRange(response.getHeader("content-range"));
      this._fileSize = total || null;
      const first = [{
        data,
        offset: start,
        length: end + 1 - start
      }];
      if (slices.length > 1) {
        const others = await Promise.all(slices.slice(1).map((slice) => this.fetchSlice(slice, signal)));
        return first.concat(others);
      }
      return first;
    } else {
      if (!this.allowFullFile) {
        throw new Error("Server responded with full file");
      }
      const data = await response.getData();
      this._fileSize = data.byteLength;
      return [{
        data,
        offset: 0,
        length: data.byteLength
      }];
    }
  }
  /**
   * @param {import('./basesource.js').Slice} slice
   * @param {AbortSignal} [signal]
   * @returns {Promise<import('./basesource.js').SliceWithData>}
   */
  async fetchSlice(slice, signal) {
    const { offset, length } = slice;
    const response = await this.client.request({
      headers: {
        ...this.headers,
        Range: `bytes=${offset}-${offset + length - 1}`
      },
      signal
    });
    if (!response.ok) {
      throw new Error("Error fetching data.");
    } else if (response.status === 206) {
      const data = await response.getData();
      const { total } = parseContentRange(response.getHeader("content-range"));
      this._fileSize = total || null;
      return {
        data,
        offset,
        length
      };
    } else {
      if (!this.allowFullFile) {
        throw new Error("Server responded with full file");
      }
      const data = await response.getData();
      this._fileSize = data.byteLength;
      return {
        data,
        offset: 0,
        length: data.byteLength
      };
    }
  }
  get fileSize() {
    return this._fileSize;
  }
};
function maybeWrapInBlockedSource(source, { blockSize, cacheSize }) {
  if (blockSize === void 0) {
    return source;
  }
  return new BlockedSource(source, { blockSize, cacheSize });
}
__name(maybeWrapInBlockedSource, "maybeWrapInBlockedSource");
function makeFetchSource(url, { headers = {}, credentials, maxRanges = 0, allowFullFile = false, ...blockOptions } = {}) {
  const client = new FetchClient(url, credentials);
  const source = new RemoteSource(client, { headers, maxRanges, allowFullFile });
  return maybeWrapInBlockedSource(source, blockOptions);
}
__name(makeFetchSource, "makeFetchSource");
function makeXHRSource(url, { headers = {}, maxRanges = 0, allowFullFile = false, ...blockOptions } = {}) {
  const client = new XHRClient(url);
  const source = new RemoteSource(client, { headers, maxRanges, allowFullFile });
  return maybeWrapInBlockedSource(source, blockOptions);
}
__name(makeXHRSource, "makeXHRSource");
function makeHttpSource(url, { headers = {}, maxRanges = 0, allowFullFile = false, ...blockOptions } = {}) {
  const client = new HttpClient(url);
  const source = new RemoteSource(client, { headers, maxRanges, allowFullFile });
  return maybeWrapInBlockedSource(source, blockOptions);
}
__name(makeHttpSource, "makeHttpSource");
function makeRemoteSource(url, { forceXHR = false, ...clientOptions } = {}) {
  if (typeof fetch === "function" && !forceXHR) {
    return makeFetchSource(url, clientOptions);
  }
  if (typeof XMLHttpRequest !== "undefined") {
    return makeXHRSource(url, clientOptions);
  }
  return makeHttpSource(url, clientOptions);
}
__name(makeRemoteSource, "makeRemoteSource");

// node_modules/geotiff/dist-module/imagefiledirectory.js
init_globals();
function getArrayForSamples(fieldType, count) {
  switch (fieldType) {
    case fieldTypes.BYTE:
    case fieldTypes.ASCII:
    case fieldTypes.UNDEFINED:
      return new Uint8Array(count);
    case fieldTypes.SBYTE:
      return new Int8Array(count);
    case fieldTypes.SHORT:
      return new Uint16Array(count);
    case fieldTypes.SSHORT:
      return new Int16Array(count);
    case fieldTypes.LONG:
    case fieldTypes.IFD:
      return new Uint32Array(count);
    case fieldTypes.SLONG:
      return new Int32Array(count);
    case fieldTypes.LONG8:
    case fieldTypes.IFD8:
      return new Array(count);
    case fieldTypes.SLONG8:
      return new Array(count);
    case fieldTypes.RATIONAL:
      return new Uint32Array(count * 2);
    case fieldTypes.SRATIONAL:
      return new Int32Array(count * 2);
    case fieldTypes.FLOAT:
      return new Float32Array(count);
    case fieldTypes.DOUBLE:
      return new Float64Array(count);
    default:
      throw new RangeError(`Invalid field type: ${fieldType}`);
  }
}
__name(getArrayForSamples, "getArrayForSamples");
function getDataSliceReader(dataSlice, fieldType) {
  switch (fieldType) {
    case fieldTypes.BYTE:
    case fieldTypes.ASCII:
    case fieldTypes.UNDEFINED:
      return dataSlice.readUint8;
    case fieldTypes.SBYTE:
      return dataSlice.readInt8;
    case fieldTypes.SHORT:
      return dataSlice.readUint16;
    case fieldTypes.SSHORT:
      return dataSlice.readInt16;
    case fieldTypes.LONG:
    case fieldTypes.IFD:
      return dataSlice.readUint32;
    case fieldTypes.SLONG:
      return dataSlice.readInt32;
    case fieldTypes.LONG8:
    case fieldTypes.IFD8:
      return dataSlice.readUint64;
    case fieldTypes.SLONG8:
      return dataSlice.readInt64;
    case fieldTypes.RATIONAL:
      return dataSlice.readUint32;
    case fieldTypes.SRATIONAL:
      return dataSlice.readInt32;
    case fieldTypes.FLOAT:
      return dataSlice.readFloat32;
    case fieldTypes.DOUBLE:
      return dataSlice.readFloat64;
    default:
      throw new RangeError(`Invalid field type: ${fieldType}`);
  }
}
__name(getDataSliceReader, "getDataSliceReader");
function getValues(outValues = null, readMethod, dataSlice, fieldType, count, offset, isArray = false) {
  const fieldTypeLength = getFieldTypeSize(fieldType);
  const values2 = outValues || getArrayForSamples(fieldType, count);
  const isRational = fieldType === fieldTypes.RATIONAL || fieldType === fieldTypes.SRATIONAL;
  if (!isRational) {
    for (let i = 0; i < count; ++i) {
      values2[i] = readMethod.call(dataSlice, offset + i * fieldTypeLength);
    }
  } else {
    for (let i = 0; i < count; i += 2) {
      values2[i] = readMethod.call(dataSlice, offset + i * fieldTypeLength);
      values2[i + 1] = readMethod.call(dataSlice, offset + (i * fieldTypeLength + 4));
    }
  }
  if (fieldType === fieldTypes.ASCII) {
    return new TextDecoder("utf-8").decode(
      /** @type {Uint8Array} */
      values2
    );
  }
  if (count === 1 && !isArray && !isRational) {
    return values2[0];
  }
  return values2;
}
__name(getValues, "getValues");
var DeferredArray = class {
  static {
    __name(this, "DeferredArray");
  }
  /**
   * Creates a DeferredArray for lazy-loading of large TIFF field arrays.
   * @param {import("./source/basesource.js").BaseSource} source - Data source for fetching
   * @param {number} arrayOffset - Byte offset where the array data starts
   * @param {boolean} littleEndian - Endianness of the data
   * @param {import('./globals.js').FieldType} fieldType - TIFF field type constant
   * @param {number} length - Number of elements in the array
   */
  constructor(source, arrayOffset, littleEndian, fieldType, length) {
    this.source = source;
    this.arrayOffset = arrayOffset;
    this.littleEndian = littleEndian;
    this.fieldType = fieldType;
    this.length = length;
    this.data = getArrayForSamples(fieldType, length);
    this.itemSize = getFieldTypeSize(fieldType);
    this.maskBitmap = new Uint8Array(Math.ceil(length / 8));
    this.fetchIndexPromises = /* @__PURE__ */ new Map();
    this.fullFetchPromise = null;
  }
  /**
   * Loads all values in the deferred array at once.
   * Subsequent calls return the same promise to avoid redundant fetches.
   * @returns {Promise<import('./geotiff.js').TypedArray|Array<number>>} Promise resolving to the fully loaded array
   */
  async loadAll() {
    if (!this.fullFetchPromise) {
      this.fullFetchPromise = this.source.fetch([{
        offset: this.arrayOffset,
        length: this.itemSize * this.length
      }]).then((data) => {
        const dataSlice = new DataSlice(data[0], this.arrayOffset, true, false);
        const result = getValues(this.data, getDataSliceReader(dataSlice, this.fieldType), dataSlice, this.fieldType, this.length, this.arrayOffset, true);
        this.maskBitmap.fill(255);
        this.fetchIndexPromises.clear();
        return result;
      });
    }
    return this.fullFetchPromise;
  }
  /**
   * Loads and returns a single value at the specified index.
   * If the value is already loaded, returns it immediately. Otherwise, fetches it
   * from the source. Multiple calls for the same index reuse the same promise.
   * @param {number} index - Zero-based index of the value to load
   * @returns {Promise<number|bigint>} Promise resolving to the value at the given index
   * @throws {RangeError} If index is out of bounds
   */
  async get(index) {
    if (index < 0 || index >= this.data.length) {
      throw new RangeError(`Index ${index} out of bounds for length ${this.data.length}`);
    }
    const byteIndex = Math.floor(index / 8);
    const bitMask = 1 << index % 8;
    const offset = this.arrayOffset + index * this.itemSize;
    if ((this.maskBitmap[byteIndex] & bitMask) === 0) {
      if (!this.fetchIndexPromises.has(index)) {
        const fetchPromise = this.source.fetch([{
          offset,
          length: this.itemSize
        }]).then((data) => {
          const dataSlice = new DataSlice(data[0], this.arrayOffset + index * this.itemSize, true, false);
          const readMethod = getDataSliceReader(dataSlice, this.fieldType);
          const value = readMethod.call(dataSlice, offset);
          this.data[index] = value;
          this.maskBitmap[byteIndex] |= bitMask;
          this.fetchIndexPromises.delete(index);
          return value;
        });
        this.fetchIndexPromises.set(index, fetchPromise);
      }
      return this.fetchIndexPromises.get(index);
    }
    return this.data[index];
  }
};
var ImageFileDirectory = class {
  static {
    __name(this, "ImageFileDirectory");
  }
  /**
   * Create an ImageFileDirectory.
   * @param {Map<string|number, number|string|Array<number|string>>} actualizedFields the file directory,
   * mapping tag names to values
   * @param {Map<string|number, Function>} deferredFields the deferred fields, mapping tag names to async functions
   * @param {Map<string|number, DeferredArray>} deferredArrays the deferred arrays, mapping tag names to
   * DeferredArray objects
   * @param {number} nextIFDByteOffset the byte offset to the next IFD
   */
  constructor(actualizedFields, deferredFields, deferredArrays, nextIFDByteOffset) {
    this.actualizedFields = actualizedFields;
    this.deferredFields = deferredFields;
    this.deferredFieldsBeingResolved = /* @__PURE__ */ new Map();
    this.deferredArrays = deferredArrays;
    this.nextIFDByteOffset = nextIFDByteOffset;
  }
  /**
   * @param {import('./globals.js').TagName|number} tagIdentifier The field tag ID or name
   * @returns {boolean} whether the field exists (actualized or deferred)
   */
  hasTag(tagIdentifier) {
    const tag = resolveTag(tagIdentifier);
    return this.actualizedFields.has(tag) || this.deferredFields.has(tag) || this.deferredArrays.has(tag);
  }
  /**
   * Synchronously retrieves the value for a given tag. If it is deferred, an error is thrown.
   * @template {import('./globals.js').EagerTagName | import('./globals.js').EagerTag} [T=any]
   * @param {T} tagIdentifier The field tag ID or name
   * @returns {T extends import('./globals.js').TagName ? (import('./globals.js').TagValue<T> | undefined) : any}
   * the field value,
   * or undefined if it does not exist
   * @throws {Error} If the tag is deferred and requires asynchronous loading
   */
  getValue(tagIdentifier) {
    const tag = resolveTag(tagIdentifier);
    if (this.deferredFields.has(tag) || this.deferredArrays.has(tag)) {
      const tagDef = tagDefinitions[tag];
      const tagName = tagDef?.name || `Tag${tag}`;
      throw new Error(`Field '${tagName}' (${tag}) is deferred. Use loadValue() to load it asynchronously.`);
    }
    if (!this.actualizedFields.has(tag)) {
      return (
        /** @type {any} */
        void 0
      );
    }
    return (
      /** @type {any} */
      this.actualizedFields.get(tag)
    );
  }
  /**
   * Retrieves the value for a given tag. If it is deferred, it will be loaded first.
   * @template {import('./globals.js').TagName} [T=any]
   * @param {T|number} tagIdentifier The field tag ID or name
   * @returns {Promise<T extends import('./globals.js').TagName ? (import('./globals.js').TagValue<T> | undefined) : any>}
   *   the field value, or undefined if it does not exist
   */
  async loadValue(tagIdentifier) {
    const tag = resolveTag(tagIdentifier);
    if (this.actualizedFields.has(tag)) {
      return (
        /** @type {any} */
        this.actualizedFields.get(tag)
      );
    }
    if (this.deferredFieldsBeingResolved.has(tag)) {
      return (
        /** @type {any} */
        this.deferredFieldsBeingResolved.get(tag)
      );
    }
    const loaderFn = this.deferredFields.get(tag);
    if (loaderFn) {
      this.deferredFields.delete(tag);
      const valuePromise = (async () => {
        try {
          const value = await loaderFn();
          this.actualizedFields.set(tag, value);
          return value;
        } finally {
          this.deferredFieldsBeingResolved.delete(tag);
        }
      })();
      this.deferredFieldsBeingResolved.set(tag, valuePromise);
      return (
        /** @type {any} */
        valuePromise
      );
    }
    const deferredArray = this.deferredArrays.get(tag);
    if (deferredArray) {
      return (
        /** @type {any} */
        deferredArray.loadAll()
      );
    }
    return (
      /** @type {any} */
      void 0
    );
  }
  /**
   * Retrieves the value at a given index for a tag that is an array. If it is deferred, it will be loaded first.
   * @param {number|string} tagIdentifier The field tag ID or name
   * @param {number} index The index within the array
   * @returns {Promise<number|string|bigint|undefined>} the field value at the given index, or undefined if it does not exist
   */
  async loadValueIndexed(tagIdentifier, index) {
    const tag = resolveTag(tagIdentifier);
    if (this.actualizedFields.has(tag)) {
      const value = this.actualizedFields.get(tag);
      return (
        /** @type {any} */
        value[index]
      );
    } else if (this.deferredArrays.has(tag)) {
      const deferredArray = (
        /** @type {DeferredArray} */
        this.deferredArrays.get(tag)
      );
      return deferredArray.get(index);
    } else if (this.hasTag(tag)) {
      const value = await this.loadValue(tag);
      if (value && typeof value !== "number") {
        return value[index];
      }
    }
    return void 0;
  }
  /**
   * Parses the GeoTIFF GeoKeyDirectory tag into a structured object.
   * The GeoKeyDirectory is a special TIFF tag that contains geographic metadata
   * in a key-value format as defined by the GeoTIFF specification.
   * @returns {Partial<Record<import('./globals.js').GeoKeyName, *>>|null} Parsed geo key directory
   *     mapping key names to values, or null if not present
   * @throws {Error} If a referenced geo key value cannot be retrieved
   */
  parseGeoKeyDirectory() {
    const rawGeoKeyDirectory = this.getValue("GeoKeyDirectory");
    if (!rawGeoKeyDirectory) {
      return null;
    }
    const geoKeyDirectory = {};
    for (let i = 4; i <= rawGeoKeyDirectory[3] * 4; i += 4) {
      const key = (
        /** @type {Record<number, import('./globals.js').GeoKeyName>} */
        geoKeyNames[rawGeoKeyDirectory[i]]
      );
      const location = (
        /** @type {import('./globals.js').EagerTag} */
        rawGeoKeyDirectory[i + 1] || null
      );
      const count = rawGeoKeyDirectory[i + 2];
      const offset = rawGeoKeyDirectory[i + 3];
      let value = null;
      if (!location) {
        value = offset;
      } else {
        value = this.getValue(location);
        if (typeof value === "undefined" || value === null) {
          throw new Error(`Could not get value of geoKey '${key}'.`);
        } else if (typeof value === "string") {
          value = value.substring(offset, offset + count - 1);
        } else if (value.subarray) {
          value = value.subarray(offset, offset + count);
          if (count === 1) {
            value = value[0];
          }
        }
      }
      geoKeyDirectory[key] = value;
    }
    return geoKeyDirectory;
  }
  toObject() {
    const obj = {};
    for (const [tag, value] of this.actualizedFields.entries()) {
      const tagDefinition = typeof tag === "number" ? tagDefinitions[tag] : void 0;
      const tagName = tagDefinition ? tagDefinition.name : `Tag${tag}`;
      obj[tagName] = value;
    }
    return obj;
  }
};
var ImageFileDirectoryParser = class {
  static {
    __name(this, "ImageFileDirectoryParser");
  }
  /**
   * @param {import("./source/basesource.js").BaseSource} source the data source to fetch from
   * @param {boolean} littleEndian the endianness of the file
   * @param {boolean} bigTiff whether the file is a BigTIFF
   * @param {boolean} [eager=false] whether to eagerly fetch deferred fields.
   *                                 When false (default), tags are loaded lazily on-demand.
   *                                 When true, all tags are loaded immediately during parsing.
   */
  constructor(source, littleEndian, bigTiff, eager = false) {
    this.source = source;
    this.littleEndian = littleEndian;
    this.bigTiff = bigTiff;
    this.eager = eager;
  }
  /**
   * Helper function to retrieve a DataSlice from the source.
   * @param {number} offset Byte offset of the slice
   * @param {number} [length] Length of the slice
   * @returns {Promise<DataSlice>}
   */
  async getSlice(offset, length) {
    const fallbackLength = this.bigTiff ? 4048 : 1024;
    return new DataSlice((await this.source.fetch([
      {
        offset,
        length: typeof length !== "undefined" ? length : fallbackLength
      }
    ]))[0], offset, this.littleEndian, this.bigTiff);
  }
  /**
   * Instructs to parse an image file directory at the given file offset.
   * As there is no way to ensure that a location is indeed the start of an IFD,
   * this function must be called with caution (e.g only using the IFD offsets from
   * the headers or other IFDs).
   * @param {number} offset the offset to parse the IFD at
   * @returns {Promise<ImageFileDirectory>} the parsed IFD
   */
  async parseFileDirectoryAt(offset) {
    const entrySize = this.bigTiff ? 20 : 12;
    const offsetSize = this.bigTiff ? 8 : 2;
    let dataSlice = await this.getSlice(offset);
    const numDirEntries = this.bigTiff ? dataSlice.readUint64(offset) : dataSlice.readUint16(offset);
    const byteSize = numDirEntries * (entrySize + (this.bigTiff ? 16 : 6));
    if (!dataSlice.covers(offset, byteSize)) {
      dataSlice = await this.getSlice(offset, byteSize);
    }
    const actualizedFields = /* @__PURE__ */ new Map();
    const deferredFields = /* @__PURE__ */ new Map();
    const deferredArrays = /* @__PURE__ */ new Map();
    let i = offset + (this.bigTiff ? 8 : 2);
    for (let entryCount = 0; entryCount < numDirEntries; i += entrySize, ++entryCount) {
      const fieldTag = dataSlice.readUint16(i);
      const fieldType = (
        /** @type {import('./globals.js').FieldType} */
        dataSlice.readUint16(i + 2)
      );
      const typeCount = this.bigTiff ? dataSlice.readUint64(i + 4) : dataSlice.readUint32(i + 4);
      let fieldValues = null;
      let deferredFieldValues = null;
      let deferredArray = null;
      const fieldTypeLength = getFieldTypeSize(fieldType);
      const valueOffset = i + (this.bigTiff ? 12 : 8);
      const isArray = tagDefinitions[fieldTag]?.isArray;
      const eager = tagDefinitions[fieldTag]?.eager || this.eager;
      if (fieldTypeLength * typeCount <= (this.bigTiff ? 8 : 4)) {
        fieldValues = getValues(getArrayForSamples(fieldType, typeCount), getDataSliceReader(dataSlice, fieldType), dataSlice, fieldType, typeCount, valueOffset, isArray);
      } else {
        const actualOffset = dataSlice.readOffset(valueOffset);
        const length = getFieldTypeSize(fieldType) * typeCount;
        if (dataSlice.covers(actualOffset, length)) {
          fieldValues = getValues(getArrayForSamples(fieldType, typeCount), getDataSliceReader(dataSlice, fieldType), dataSlice, fieldType, typeCount, actualOffset, isArray);
        } else if (eager) {
          const fieldDataSlice = await this.getSlice(actualOffset, length);
          fieldValues = getValues(getArrayForSamples(fieldType, typeCount), getDataSliceReader(fieldDataSlice, fieldType), fieldDataSlice, fieldType, typeCount, actualOffset, isArray);
        } else if (isArray) {
          deferredArray = new DeferredArray(this.source, actualOffset, this.littleEndian, fieldType, typeCount);
        } else {
          deferredFieldValues = /* @__PURE__ */ __name(async () => {
            const fieldDataSlice = await this.getSlice(actualOffset, length);
            return getValues(getArrayForSamples(fieldType, typeCount), getDataSliceReader(fieldDataSlice, fieldType), fieldDataSlice, fieldType, typeCount, actualOffset, isArray);
          }, "deferredFieldValues");
        }
      }
      if (fieldValues !== null) {
        actualizedFields.set(fieldTag, fieldValues);
      } else if (deferredFieldValues !== null) {
        deferredFields.set(fieldTag, deferredFieldValues);
      } else if (deferredArray !== null) {
        deferredArrays.set(fieldTag, deferredArray);
      }
    }
    const nextIFDByteOffset = dataSlice.readOffset(offset + offsetSize + entrySize * numDirEntries);
    return new ImageFileDirectory(actualizedFields, deferredFields, deferredArrays, nextIFDByteOffset);
  }
};

// node_modules/geotiff/dist-module/geotiff.js
init_globals();
function getValues2(dataSlice, fieldType, count, offset) {
  let values2 = null;
  let readMethod = null;
  const fieldTypeLength = getFieldTypeSize(fieldType);
  switch (fieldType) {
    case fieldTypes.BYTE:
    case fieldTypes.ASCII:
    case fieldTypes.UNDEFINED:
      values2 = new Uint8Array(count);
      readMethod = dataSlice.readUint8;
      break;
    case fieldTypes.SBYTE:
      values2 = new Int8Array(count);
      readMethod = dataSlice.readInt8;
      break;
    case fieldTypes.SHORT:
      values2 = new Uint16Array(count);
      readMethod = dataSlice.readUint16;
      break;
    case fieldTypes.SSHORT:
      values2 = new Int16Array(count);
      readMethod = dataSlice.readInt16;
      break;
    case fieldTypes.LONG:
    case fieldTypes.IFD:
      values2 = new Uint32Array(count);
      readMethod = dataSlice.readUint32;
      break;
    case fieldTypes.SLONG:
      values2 = new Int32Array(count);
      readMethod = dataSlice.readInt32;
      break;
    case fieldTypes.LONG8:
    case fieldTypes.IFD8:
      values2 = new Array(count);
      readMethod = dataSlice.readUint64;
      break;
    case fieldTypes.SLONG8:
      values2 = new Array(count);
      readMethod = dataSlice.readInt64;
      break;
    case fieldTypes.RATIONAL:
      values2 = new Uint32Array(count * 2);
      readMethod = dataSlice.readUint32;
      break;
    case fieldTypes.SRATIONAL:
      values2 = new Int32Array(count * 2);
      readMethod = dataSlice.readInt32;
      break;
    case fieldTypes.FLOAT:
      values2 = new Float32Array(count);
      readMethod = dataSlice.readFloat32;
      break;
    case fieldTypes.DOUBLE:
      values2 = new Float64Array(count);
      readMethod = dataSlice.readFloat64;
      break;
    default:
  }
  if (values2 === null || readMethod === null) {
    throw new RangeError(`Invalid field type: ${fieldType}`);
  }
  if (!(fieldType === fieldTypes.RATIONAL || fieldType === fieldTypes.SRATIONAL)) {
    for (let i = 0; i < count; ++i) {
      values2[i] = readMethod.call(dataSlice, offset + i * fieldTypeLength);
    }
  } else {
    for (let i = 0; i < count; i += 2) {
      values2[i] = readMethod.call(dataSlice, offset + i * fieldTypeLength);
      values2[i + 1] = readMethod.call(dataSlice, offset + (i * fieldTypeLength + 4));
    }
  }
  if (fieldType === fieldTypes.ASCII) {
    return new TextDecoder("utf-8").decode(
      /** @type {Uint8Array} */
      values2
    );
  }
  return values2;
}
__name(getValues2, "getValues");
var GeoTIFFImageIndexError = class extends Error {
  static {
    __name(this, "GeoTIFFImageIndexError");
  }
  /**
   * @param {number} index
   */
  constructor(index) {
    super(`No image at index ${index}`);
    this.index = index;
  }
};
var GeoTIFFBase = class {
  static {
    __name(this, "GeoTIFFBase");
  }
  /**
   * @param {number} [_index=0] the index of the image to return.
   * @returns {Promise<GeoTIFFImage>} the image at the given index
   */
  async getImage(_index = 0) {
    throw new Error("Not implemented");
  }
  /**
   * @returns {Promise<number>} the number of internal subfile images
   */
  async getImageCount() {
    throw new Error("Not implemented");
  }
  /**
   * @typedef {Object} ReadRastersWindowOptions
   * @property {number} [resX] desired Y resolution (world units per pixel)
   * @property {number} [resY] desired X resolution (world units per pixel)
   * @property {Array<number>} [bbox] the subset to read data from in
   *     geographical coordinates. Whole image if not specified.
   */
  /**
   * (experimental) Reads raster data from the best fitting image. This function uses
   * the image with the lowest resolution that is still a higher resolution than the
   * requested resolution.
   * When specified, the `bbox` option is translated to the `window` option and the
   * `resX` and `resY` to `width` and `height` respectively.
   * Then, the [readRasters]{@link GeoTIFFImage#readRasters} method of the selected
   * image is called and the result returned.
   * @see GeoTIFFImage.readRasters
   * @param {ReadRastersOptions & ReadRastersWindowOptions} options optional parameters
   * @returns {Promise<ReadRasterResult>} the decoded array(s), with `height` and `width`, as a promise
   */
  async readRasters(options = {}) {
    const { window: imageWindow, width, height } = options;
    let { resX, resY, bbox } = options;
    const firstImage = await this.getImage();
    let usedImage = firstImage;
    const imageCount = await this.getImageCount();
    const imgBBox = firstImage.getBoundingBox();
    if (imageWindow && bbox) {
      throw new Error('Both "bbox" and "window" passed.');
    }
    if (width || height) {
      if (imageWindow) {
        const [oX, oY] = firstImage.getOrigin();
        const [rX, rY] = firstImage.getResolution();
        bbox = [
          oX + imageWindow[0] * rX,
          oY + imageWindow[1] * rY,
          oX + imageWindow[2] * rX,
          oY + imageWindow[3] * rY
        ];
      }
      const usedBBox = bbox || imgBBox;
      if (width) {
        if (resX) {
          throw new Error("Both width and resX passed");
        }
        resX = (usedBBox[2] - usedBBox[0]) / width;
      }
      if (height) {
        if (resY) {
          throw new Error("Both width and resY passed");
        }
        resY = (usedBBox[3] - usedBBox[1]) / height;
      }
    }
    if (resX || resY) {
      const allImages = [];
      for (let i = 0; i < imageCount; ++i) {
        const image = await this.getImage(i);
        const subfileType = image.fileDirectory.getValue("SubfileType");
        const newSubfileType = image.fileDirectory.getValue("NewSubfileType");
        if (i === 0 || subfileType === 2 || (newSubfileType || 0) & 1) {
          allImages.push(image);
        }
      }
      allImages.sort((a, b) => a.getWidth() - b.getWidth());
      for (let i = 0; i < allImages.length; ++i) {
        const image = allImages[i];
        const imgResX = (imgBBox[2] - imgBBox[0]) / image.getWidth();
        const imgResY = (imgBBox[3] - imgBBox[1]) / image.getHeight();
        usedImage = image;
        if (resX && resX > imgResX || resY && resY > imgResY) {
          break;
        }
      }
    }
    let wnd = imageWindow;
    if (bbox) {
      const [oX, oY] = firstImage.getOrigin();
      const [imageResX, imageResY] = usedImage.getResolution(firstImage);
      wnd = [
        Math.round((bbox[0] - oX) / imageResX),
        Math.round((bbox[1] - oY) / imageResY),
        Math.round((bbox[2] - oX) / imageResX),
        Math.round((bbox[3] - oY) / imageResY)
      ];
      wnd = [
        Math.min(wnd[0], wnd[2]),
        Math.min(wnd[1], wnd[3]),
        Math.max(wnd[0], wnd[2]),
        Math.max(wnd[1], wnd[3])
      ];
    }
    return usedImage.readRasters({ ...options, window: wnd });
  }
};
var GeoTIFF = class _GeoTIFF extends GeoTIFFBase {
  static {
    __name(this, "GeoTIFF");
  }
  /**
   * @constructor
   * @param {BaseSource} source The datasource to read from.
   * @param {boolean} littleEndian Whether the image uses little endian.
   * @param {boolean} bigTiff Whether the image uses bigTIFF conventions.
   * @param {number} firstIFDOffset The numeric byte-offset from the start of the image
   *                                to the first IFD.
   * @param {GeoTIFFOptions} [options] further options.
   */
  constructor(source, littleEndian, bigTiff, firstIFDOffset, options = {}) {
    super();
    this.source = source;
    this.parser = new ImageFileDirectoryParser(source, littleEndian, bigTiff, false);
    this.littleEndian = littleEndian;
    this.bigTiff = bigTiff;
    this.firstIFDOffset = firstIFDOffset;
    this.cache = options.cache || false;
    this.ifdRequests = [];
    this.ghostValues = null;
  }
  /**
   * @param {number} offset
   * @param {number} [size]
   * @returns {Promise<DataSlice>}
   */
  async getSlice(offset, size) {
    const fallbackSize = this.bigTiff ? 4048 : 1024;
    return new DataSlice((await this.source.fetch([{
      offset,
      length: typeof size !== "undefined" ? size : fallbackSize
    }]))[0], offset, this.littleEndian, this.bigTiff);
  }
  /**
   * @param {number} index
   * @return {Promise<import('./imagefiledirectory.js').ImageFileDirectory>}
   */
  async requestIFD(index) {
    if (this.ifdRequests[index]) {
      return this.ifdRequests[index];
    } else if (index === 0) {
      this.ifdRequests[index] = this.parser.parseFileDirectoryAt(this.firstIFDOffset);
      return this.ifdRequests[index];
    } else if (!this.ifdRequests[index - 1]) {
      try {
        this.ifdRequests[index - 1] = this.requestIFD(index - 1);
      } catch (e) {
        if (e instanceof GeoTIFFImageIndexError) {
          throw new GeoTIFFImageIndexError(index);
        }
        throw e;
      }
    }
    this.ifdRequests[index] = (async () => {
      const previousPromise = this.ifdRequests[index - 1];
      if (!previousPromise) {
        throw new Error("Previous IFD request missing");
      }
      const previousIfd = await previousPromise;
      if (previousIfd.nextIFDByteOffset === 0) {
        throw new GeoTIFFImageIndexError(index);
      }
      return this.parser.parseFileDirectoryAt(previousIfd.nextIFDByteOffset);
    })();
    return this.ifdRequests[index];
  }
  /**
   * Get the n-th internal subfile of an image. By default, the first is returned.
   *
   * @param {number} [index=0] the index of the image to return.
   * @returns {Promise<GeoTIFFImage>} the image at the given index
   */
  async getImage(index = 0) {
    return new geotiffimage_default(await this.requestIFD(index), this.littleEndian, this.cache, this.source);
  }
  /**
   * Returns the count of the internal subfiles.
   *
   * @returns {Promise<number>} the number of internal subfile images
   */
  async getImageCount() {
    let index = 0;
    let hasNext = true;
    while (hasNext) {
      try {
        await this.requestIFD(index);
        ++index;
      } catch (e) {
        if (e instanceof GeoTIFFImageIndexError) {
          hasNext = false;
        } else {
          throw e;
        }
      }
    }
    return index;
  }
  /**
   * Get the values of the COG ghost area as a parsed map.
   * See https://gdal.org/drivers/raster/cog.html#header-ghost-area for reference
   * @returns {Promise<Record<string, unknown>|null>} the parsed ghost area or null, if no such area was found
   */
  async getGhostValues() {
    const offset = this.bigTiff ? 16 : 8;
    if (this.ghostValues !== null) {
      return this.ghostValues;
    }
    const detectionString = "GDAL_STRUCTURAL_METADATA_SIZE=";
    const heuristicAreaSize = detectionString.length + 100;
    let slice = await this.getSlice(offset, heuristicAreaSize);
    if (detectionString === getValues2(slice, fieldTypes.ASCII, detectionString.length, offset)) {
      const valuesString = getValues2(slice, fieldTypes.ASCII, heuristicAreaSize, offset);
      const firstLine = valuesString.split("\n")[0];
      const metadataSize = Number(firstLine.split("=")[1].split(" ")[0]) + firstLine.length;
      if (metadataSize > heuristicAreaSize) {
        slice = await this.getSlice(offset, metadataSize);
      }
      const fullString = getValues2(slice, fieldTypes.ASCII, metadataSize, offset);
      const ghostValues = {};
      fullString.split("\n").filter((line) => line.length > 0).map((line) => line.split("=")).forEach(([key, value]) => {
        ghostValues[key] = value;
      });
      this.ghostValues = ghostValues;
    }
    return this.ghostValues;
  }
  /**
   * Parse a (Geo)TIFF file from the given source.
   *
   * @param {BaseSource} source The source of data to parse from.
   * @param {GeoTIFFOptions} [options] Additional options.
   * @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
   *                               to be aborted
   */
  static async fromSource(source, options, signal) {
    const headerData = (await source.fetch([{ offset: 0, length: 1024 }], signal))[0];
    const dataView = new DataView64(headerData);
    const BOM = dataView.getUint16(0, false);
    let littleEndian;
    if (BOM === 18761) {
      littleEndian = true;
    } else if (BOM === 19789) {
      littleEndian = false;
    } else {
      throw new TypeError("Invalid byte order value.");
    }
    const magicNumber = dataView.getUint16(2, littleEndian);
    let bigTiff;
    if (magicNumber === 42) {
      bigTiff = false;
    } else if (magicNumber === 43) {
      bigTiff = true;
      const offsetByteSize = dataView.getUint16(4, littleEndian);
      if (offsetByteSize !== 8) {
        throw new Error("Unsupported offset byte-size.");
      }
    } else {
      throw new TypeError("Invalid magic number.");
    }
    const firstIFDOffset = bigTiff ? dataView.getUint64(8, littleEndian) : dataView.getUint32(4, littleEndian);
    return new _GeoTIFF(source, littleEndian, bigTiff, firstIFDOffset, options);
  }
  /**
   * Closes the underlying file buffer
   * N.B. After the GeoTIFF has been completely processed it needs
   * to be closed but only if it has been constructed from a file.
   */
  close() {
    if (typeof this.source.close === "function") {
      return this.source.close();
    }
    return false;
  }
};
async function fromUrl(url, options = {}, signal) {
  return GeoTIFF.fromSource(makeRemoteSource(url, options), void 0, signal);
}
__name(fromUrl, "fromUrl");

// src/live-senseware.ts
var HAWAII_BBOX = [-156.2, 18.8, -154.7, 20.3];
var HAWAII_CENTER = { lat: 19.55, lon: -155.45 };
var TRANSFORM_VERSION = "live-senseware-v1";
var STREAM_LIFETIME_MS = 10 * 60 * 1e3;
var STREAM_REFRESH_MS = 5 * 60 * 1e3;
var HEARTBEAT_MS = 15e3;
var jsonHeaders = Object.freeze({
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff"
});
var fetchWithTimeout = /* @__PURE__ */ __name(async (input, init3 = {}, timeoutMs = 12e3) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("upstream-timeout"), timeoutMs);
  try {
    return await fetch(input, { ...init3, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}, "fetchWithTimeout");
var sourceHeaders = /* @__PURE__ */ __name((response) => ({
  upstreamEtag: response.headers.get("ETag") || void 0,
  upstreamLastModified: response.headers.get("Last-Modified") || void 0
}), "sourceHeaders");
var conditionalHeaders = /* @__PURE__ */ __name((cached) => {
  const headers = new Headers({ Accept: "application/json,text/plain;q=0.9,*/*;q=0.5" });
  if (cached?.upstreamEtag) headers.set("If-None-Match", cached.upstreamEtag);
  if (cached?.upstreamLastModified) headers.set("If-Modified-Since", cached.upstreamLastModified);
  return headers;
}, "conditionalHeaders");
var cacheRequest = /* @__PURE__ */ __name((key) => new Request(`https://gaia-live-cache.invalid/${encodeURIComponent(key)}`), "cacheRequest");
var liveCache = /* @__PURE__ */ __name(() => caches.default, "liveCache");
var readCached = /* @__PURE__ */ __name(async (key) => {
  const response = await liveCache().match(cacheRequest(key));
  if (!response) return void 0;
  try {
    return await response.json();
  } catch {
    return void 0;
  }
}, "readCached");
var writeCached = /* @__PURE__ */ __name(async (key, cached) => {
  const response = new Response(JSON.stringify(cached), {
    headers: { "Cache-Control": "public, max-age=604800", "Content-Type": "application/json" }
  });
  await liveCache().put(cacheRequest(key), response);
}, "writeCached");
var eventAge = /* @__PURE__ */ __name((event) => Date.now() - Date.parse(event.retrievedAt), "eventAge");
var withStaleStatus = /* @__PURE__ */ __name((cached, reason) => ({
  ...cached.event,
  status: "stale",
  fallbackReason: reason
}), "withStaleStatus");
var loadCachedProvider = /* @__PURE__ */ __name(async (definition, ctx) => {
  const cached = await readCached(definition.cacheKey);
  if (cached && eventAge(cached.event) < definition.ttlMs) return cached.event;
  try {
    const fresh = await definition.load(conditionalHeaders(cached));
    ctx.waitUntil(writeCached(definition.cacheKey, fresh));
    return fresh.event;
  } catch (error) {
    if (cached && error instanceof Error && /(?:304|not-modified)/iu.test(error.message)) {
      const refreshed = { ...cached, event: { ...cached.event, retrievedAt: (/* @__PURE__ */ new Date()).toISOString() } };
      ctx.waitUntil(writeCached(definition.cacheKey, refreshed));
      return refreshed.event;
    }
    if (cached) return withStaleStatus(cached, error instanceof Error ? error.message : "upstream-failure");
    throw error;
  }
}, "loadCachedProvider");
var degrees = /* @__PURE__ */ __name((value) => value * Math.PI / 180, "degrees");
var distanceKm = /* @__PURE__ */ __name((lat, lon) => {
  const deltaLat = degrees(lat - HAWAII_CENTER.lat);
  const deltaLon = degrees(lon - HAWAII_CENTER.lon);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(degrees(HAWAII_CENTER.lat)) * Math.cos(degrees(lat)) * Math.sin(deltaLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}, "distanceKm");
var loadNdbc = /* @__PURE__ */ __name(async (headers) => {
  const sourceUrl = "https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt";
  const response = await fetchWithTimeout(sourceUrl, { headers });
  if (response.status === 304) throw new Error("not-modified-without-refresh");
  if (!response.ok) throw new Error(`NDBC ${response.status}`);
  const candidates = (await response.text()).split(/\r?\n/u).slice(2).map((line) => line.trim().split(/\s+/u)).map((columns) => {
    const lat = Number(columns[1]);
    const lon = Number(columns[2]);
    const wind = Number(columns[9]);
    const temperature = Number(columns[16]);
    const observedAt = `${columns[3]}-${columns[4]}-${columns[5]}T${columns[6]}:${columns[7]}:00Z`;
    return { station: columns[0] || "unknown", lat, lon, wind, temperature, observedAt };
  }).filter((row2) => Number.isFinite(row2.lat) && Number.isFinite(row2.lon) && (Number.isFinite(row2.wind) || Number.isFinite(row2.temperature))).sort((left, right) => distanceKm(left.lat, left.lon) - distanceKm(right.lat, right.lon));
  const row = candidates[0];
  if (!row) throw new Error("NDBC valid station missing");
  const retrievedAt = (/* @__PURE__ */ new Date()).toISOString();
  const status = Date.now() - Date.parse(row.observedAt) <= 3 * 60 * 60 * 1e3 ? "near-real-time" : "stale";
  return {
    event: {
      schemaVersion: 1,
      eventId: `noaa:ndbc:${row.station}:${row.observedAt}`,
      provider: "noaa",
      datasetId: `NDBC latest observations / ${row.station}`,
      status,
      observedAt: row.observedAt,
      retrievedAt,
      location: { label: `NDBC ${row.station} (${Math.round(distanceKm(row.lat, row.lon))} km from bbox center)`, lat: row.lat, lon: row.lon, bbox: HAWAII_BBOX },
      measurements: [
        { key: "windSpeed", value: Number.isFinite(row.wind) ? row.wind : null, unit: "m/s", quality: Number.isFinite(row.wind) ? "valid" : "missing", sourceKind: "SOURCE" },
        { key: "airTemperature", value: Number.isFinite(row.temperature) ? row.temperature : null, unit: "degree C", quality: Number.isFinite(row.temperature) ? "valid" : "missing", sourceKind: "SOURCE" }
      ],
      provenance: { sourceUrl, licenseUrl: "https://www.noaa.gov/information-technology/open-data-dissemination", transformVersion: TRANSFORM_VERSION }
    },
    ...sourceHeaders(response)
  };
}, "loadNdbc");
var loadCo2 = /* @__PURE__ */ __name(async (headers) => {
  const sourceUrl = "https://erddap.gml.noaa.gov/erddap/tabledap/greenhouse_gases_co2_insitu_hourly_averages_surface.csv?time,site_code,latitude,longitude,value&site_code=%22MLO%22&orderByMax(%22time%22)";
  headers.set("Accept", "text/csv");
  const response = await fetchWithTimeout(sourceUrl, { headers });
  if (response.status === 304) throw new Error("NOAA GML 304 not-modified");
  if (!response.ok) throw new Error(`NOAA GML ${response.status}`);
  const rows = (await response.text()).trim().split(/\r?\n/u);
  const values2 = rows.at(-1)?.split(",");
  const observedAt = values2?.[0] || "";
  const lat = Number(values2?.[2]);
  const lon = Number(values2?.[3]);
  const co2 = Number(values2?.[4]);
  if (!observedAt || !Number.isFinite(co2)) throw new Error("NOAA GML malformed value");
  return {
    event: {
      schemaVersion: 1,
      eventId: `noaa:gml-mlo-co2:${observedAt}`,
      provider: "noaa",
      datasetId: "NOAA GML Mauna Loa hourly CO2",
      status: "latest-published",
      observedAt,
      retrievedAt: (/* @__PURE__ */ new Date()).toISOString(),
      location: { label: "Mauna Loa Observatory", lat, lon, bbox: HAWAII_BBOX },
      measurements: [{ key: "co2", value: co2, unit: "micromol mol-1", quality: "valid", sourceKind: "SOURCE" }],
      provenance: { sourceUrl, licenseUrl: "https://gml.noaa.gov/ccgg/about/co2_measurements.html", transformVersion: TRANSFORM_VERSION }
    },
    ...sourceHeaders(response)
  };
}, "loadCo2");
var latestLink = /* @__PURE__ */ __name((catalog, pattern) => catalog.links?.map((link) => link.href || "").filter((href) => pattern.test(href)).sort().at(-1), "latestLink");
var loadJaxa = /* @__PURE__ */ __name(async (headers) => {
  const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_GSMaP_standard.Gauge.00Z-23Z.v6_daily/collection.json";
  const collectionResponse = await fetchWithTimeout(collectionUrl, { headers });
  if (collectionResponse.status === 304) throw new Error("JAXA 304 not-modified");
  if (!collectionResponse.ok) throw new Error(`JAXA collection ${collectionResponse.status}`);
  const collection = await collectionResponse.json();
  const monthLink = latestLink(collection, /\/\d{4}-\d{2}\/(?:catalog|collection)\.json$/u);
  if (!monthLink) throw new Error("JAXA latest month missing");
  const monthUrl = new URL(monthLink, collectionUrl).href;
  const monthResponse = await fetchWithTimeout(monthUrl);
  if (!monthResponse.ok) throw new Error(`JAXA month ${monthResponse.status}`);
  const month = await monthResponse.json();
  const dayLink = latestLink(month, /\/\d{2}\/(?:catalog|collection)\.json$/u);
  if (!dayLink) throw new Error("JAXA latest day missing");
  const dateMatch = new URL(dayLink, monthUrl).pathname.match(/(\d{4}-\d{2})\/(\d{2})/u);
  if (!dateMatch) throw new Error("JAXA date malformed");
  const itemUrl = new URL(`${dateMatch[1]}/${dateMatch[2]}/0/W180.00-E000.00/S90.00-N90.00.json`, new URL("./", collectionUrl)).href;
  const itemResponse = await fetchWithTimeout(itemUrl);
  if (!itemResponse.ok) throw new Error(`JAXA item ${itemResponse.status}`);
  const item = await itemResponse.json();
  const assetHref = item.assets?.PRECIP?.href;
  if (!assetHref) throw new Error("JAXA PRECIP asset missing");
  const assetUrl = new URL(assetHref, itemUrl).href;
  const tiff = await fromUrl(assetUrl);
  const rasters = await tiff.readRasters({ bbox: [...HAWAII_BBOX] });
  const values2 = rasters[0];
  if (!values2) throw new Error("JAXA raster missing");
  let sum2 = 0;
  let count = 0;
  for (let index = 0; index < values2.length; index += 1) {
    const value = Number(values2[index]);
    if (!Number.isFinite(value) || value <= -900) continue;
    sum2 += value;
    count += 1;
  }
  if (!count) throw new Error("JAXA bbox has no valid pixels");
  const observedAt = `${dateMatch[1]}-${dateMatch[2]}T00:00:00Z`;
  return {
    event: {
      schemaVersion: 1,
      eventId: `jaxa:gsmap-daily:${observedAt}`,
      provider: "jaxa",
      datasetId: "JAXA.EORC_GSMaP_standard.Gauge.00Z-23Z.v6_daily",
      status: Date.now() - Date.parse(observedAt) <= 48 * 60 * 60 * 1e3 ? "near-real-time" : "latest-published",
      observedAt,
      retrievedAt: (/* @__PURE__ */ new Date()).toISOString(),
      location: { label: "Hawaii fixed bbox mean", ...HAWAII_CENTER, bbox: HAWAII_BBOX },
      measurements: [{ key: "precipitation", value: sum2 / count, unit: "mm/hr", quality: "estimated", sourceKind: "SOURCE" }],
      provenance: { sourceUrl: assetUrl, licenseUrl: "https://data.earth.jaxa.jp/en/terms-of-use/", transformVersion: TRANSFORM_VERSION }
    },
    ...sourceHeaders(collectionResponse)
  };
}, "loadJaxa");
var loadEsa = /* @__PURE__ */ __name(async (env) => {
  if (!env.CDSE_CLIENT_ID || !env.CDSE_CLIENT_SECRET) throw new Error("ESA credentials unavailable");
  const tokenResponse = await fetchWithTimeout("https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.CDSE_CLIENT_ID,
      client_secret: env.CDSE_CLIENT_SECRET
    })
  });
  if (!tokenResponse.ok) throw new Error(`ESA OAuth ${tokenResponse.status}`);
  const token = await tokenResponse.json();
  if (!token.access_token) throw new Error("ESA OAuth token missing");
  const to = /* @__PURE__ */ new Date();
  const from = new Date(to.getTime() - 72 * 60 * 60 * 1e3);
  const sourceUrl = "https://sh.dataspace.copernicus.eu/api/v1/statistics";
  const statisticsResponse = await fetchWithTimeout(sourceUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      input: {
        bounds: { bbox: HAWAII_BBOX, properties: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" } },
        data: [{ type: "sentinel-5p-l2", dataFilter: { timeRange: { from: from.toISOString(), to: to.toISOString() }, timeliness: "NRTI" } }]
      },
      aggregation: {
        timeRange: { from: from.toISOString(), to: to.toISOString() },
        aggregationInterval: { of: "P1D" },
        resolution: { x: 0.02, y: 0.02 },
        evalscript: '//VERSION=3\nfunction setup(){return {input:[{bands:["NO2","dataMask"]}],output:[{id:"data",bands:1,sampleType:"FLOAT32"}]};}\nfunction evaluatePixel(s){return {data:[s.dataMask ? s.NO2 : NaN]};}'
      },
      calculations: { default: {} }
    })
  }, 2e4);
  if (!statisticsResponse.ok) throw new Error(`ESA statistics ${statisticsResponse.status}`);
  const payload = await statisticsResponse.json();
  const latest = payload.data?.filter((entry) => Number.isFinite(entry.outputs?.data?.bands?.B0?.stats?.mean)).at(-1);
  const mean = latest?.outputs?.data?.bands?.B0?.stats?.mean;
  const observedAt = latest?.interval?.from;
  if (typeof mean !== "number" || !Number.isFinite(mean) || !observedAt) throw new Error("ESA NO2 valid mean missing");
  return {
    event: {
      schemaVersion: 1,
      eventId: `esa:sentinel-5p-no2:${observedAt}`,
      provider: "esa",
      datasetId: "Sentinel-5P L2 NO2 NRTI",
      status: "near-real-time",
      observedAt,
      retrievedAt: (/* @__PURE__ */ new Date()).toISOString(),
      location: { label: "Hawaii fixed bbox quality-masked mean", ...HAWAII_CENTER, bbox: HAWAII_BBOX },
      measurements: [{ key: "no2", value: mean, unit: "mol/m2", quality: "estimated", sourceKind: "SOURCE" }],
      provenance: { sourceUrl, licenseUrl: "https://dataspace.copernicus.eu/terms-and-conditions", transformVersion: TRANSFORM_VERSION }
    }
  };
}, "loadEsa");
var eventIdentity = /* @__PURE__ */ __name((event) => `${event.provider}:${event.datasetId.includes("CO2") ? "co2" : "main"}`, "eventIdentity");
var fallbackSnapshot = /* @__PURE__ */ __name(async (request, env, reason) => {
  const fallbackUrl = new URL("/data/live-observation-fallback-v1.json", request.url);
  const response = await env.ASSETS.fetch(new Request(fallbackUrl, { headers: { Accept: "application/json" } }));
  if (!response.ok) throw new Error(`Versioned live snapshot ${response.status}`);
  const payload = await response.json();
  return { schemaVersion: 1, source: "snapshot", generatedAt: payload.generatedAt, bbox: payload.bbox, events: payload.events, fallbackReason: reason };
}, "fallbackSnapshot");
var liveSnapshot = /* @__PURE__ */ __name(async (request, env, ctx) => {
  if (env.LIVE_SENSEWARE_ENABLED !== "true") return fallbackSnapshot(request, env, "LIVE_SENSEWARE_ENABLED is not true");
  const definitions = [
    { cacheKey: "noaa-ndbc", ttlMs: 5 * 60 * 1e3, load: loadNdbc },
    { cacheKey: "noaa-co2", ttlMs: 60 * 60 * 1e3, load: loadCo2 }
  ];
  if (env.LIVE_SENSEWARE_JAXA_ENABLED === "true") {
    definitions.push({ cacheKey: "jaxa-gsmap", ttlMs: 6 * 60 * 60 * 1e3, load: loadJaxa });
  }
  if (env.LIVE_SENSEWARE_ESA_ENABLED === "true" && env.CDSE_CLIENT_ID && env.CDSE_CLIENT_SECRET) {
    definitions.push({ cacheKey: "esa-no2", ttlMs: 30 * 60 * 1e3, load: /* @__PURE__ */ __name(() => loadEsa(env), "load") });
  }
  const settled = await Promise.allSettled(definitions.map((definition) => loadCachedProvider(definition, ctx)));
  const events = settled.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  const errors = settled.flatMap((result) => result.status === "rejected" ? [result.reason instanceof Error ? result.reason.message : "provider failure"] : []);
  if (!events.length) return fallbackSnapshot(request, env, errors.join("; "));
  const fallback = await fallbackSnapshot(request, env, "Some providers use saved snapshots");
  const available = new Set(events.map(eventIdentity));
  const disabledReasons = /* @__PURE__ */ new Map([
    ["jaxa:main", env.LIVE_SENSEWARE_JAXA_ENABLED === "true" ? "JAXA upstream unavailable" : "JAXA live disabled for free-plan CPU safety"],
    ["esa:main", env.LIVE_SENSEWARE_ESA_ENABLED !== "true" ? "ESA live disabled" : !env.CDSE_CLIENT_ID || !env.CDSE_CLIENT_SECRET ? "ESA credentials unavailable" : "ESA upstream unavailable"]
  ]);
  for (const event of fallback.events) {
    const identity = eventIdentity(event);
    if (!available.has(identity)) {
      events.push({ ...event, fallbackReason: disabledReasons.get(identity) || errors.join("; ") || "provider snapshot fallback" });
    }
  }
  return { schemaVersion: 1, source: "live", generatedAt: (/* @__PURE__ */ new Date()).toISOString(), bbox: HAWAII_BBOX, events, errors: errors.length ? errors : void 0 };
}, "liveSnapshot");
var sseLine = /* @__PURE__ */ __name((event, data, id) => `${id ? `id: ${id}
` : ""}event: ${event}
data: ${JSON.stringify(data)}

`, "sseLine");
var streamResponse = /* @__PURE__ */ __name((request, env, ctx) => {
  const encoder2 = new TextEncoder();
  let heartbeat = 0;
  let refresh = 0;
  let lifetime = 0;
  let closed = false;
  let refreshInFlight = false;
  const stream = new ReadableStream({
    start(controller) {
      const close = /* @__PURE__ */ __name(() => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        clearInterval(refresh);
        clearTimeout(lifetime);
        try {
          controller.close();
        } catch {
        }
      }, "close");
      const emitSnapshot = /* @__PURE__ */ __name(async () => {
        if (closed || refreshInFlight) return;
        refreshInFlight = true;
        try {
          const snapshot = await liveSnapshot(request, env, ctx);
          if (closed) return;
          const lastEventId = request.headers.get("Last-Event-ID") || new URL(request.url).searchParams.get("lastEventId") || "";
          const snapshotId = `snapshot:${snapshot.generatedAt || (/* @__PURE__ */ new Date()).toISOString()}`;
          controller.enqueue(encoder2.encode(sseLine("snapshot", { ...snapshot, resumedAfter: lastEventId || void 0 }, snapshotId)));
          for (const event of snapshot.events) controller.enqueue(encoder2.encode(sseLine("provider", event, event.eventId)));
          controller.enqueue(encoder2.encode(sseLine("status", { state: "streaming", source: snapshot.source, refreshSeconds: STREAM_REFRESH_MS / 1e3 }, `status:${Date.now()}`)));
        } catch (error) {
          if (!closed) controller.error(error);
          close();
        } finally {
          refreshInFlight = false;
        }
      }, "emitSnapshot");
      request.signal.addEventListener("abort", close, { once: true });
      heartbeat = setInterval(() => {
        if (!closed) controller.enqueue(encoder2.encode(`: heartbeat ${(/* @__PURE__ */ new Date()).toISOString()}

`));
      }, HEARTBEAT_MS);
      refresh = setInterval(() => void emitSnapshot(), STREAM_REFRESH_MS);
      lifetime = setTimeout(() => {
        controller.enqueue(encoder2.encode(sseLine("status", { state: "complete", reconnect: true })));
        close();
      }, STREAM_LIFETIME_MS);
      void emitSnapshot();
    },
    cancel() {
      closed = true;
      clearInterval(heartbeat);
      clearInterval(refresh);
      clearTimeout(lifetime);
    }
  });
  return new Response(stream, {
    headers: {
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
      "X-Content-Type-Options": "nosniff"
    }
  });
}, "streamResponse");
var handleLiveSenseware = /* @__PURE__ */ __name(async (request, env, ctx) => {
  const url = new URL(request.url);
  if (url.pathname !== "/api/live/v1/snapshot" && url.pathname !== "/api/live/v1/stream") return null;
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  if (url.pathname.endsWith("/stream")) return request.method === "HEAD" ? new Response(null, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } }) : streamResponse(request, env, ctx);
  const snapshot = await liveSnapshot(request, env, ctx);
  const body = request.method === "HEAD" ? null : JSON.stringify(snapshot);
  return new Response(body, { headers: jsonHeaders });
}, "handleLiveSenseware");

// src/pages-entry.ts
var NON_PUBLIC_FILES = new Set([
  "/.codex-write-probe",
  "/.gitattributes",
  "/.gitignore",
  "/AGENTS.md",
  "/CHARACTER-DESIGN.md",
  "/package.json",
  "/README.md",
  "/wrangler.jsonc"
].map((path) => path.toLowerCase()));
var NON_PUBLIC_PREFIXES = [
  "/.github/",
  "/.tmp/",
  "/.wrangler/",
  "/artifacts/",
  "/contest-limited/",
  "/docs/",
  "/node_modules/",
  "/output/",
  "/scripts/",
  "/sensor-platform/",
  "/smartcity-sensor-starter-kit/",
  "/story/",
  "/tests/",
  "/tmp/"
];
var isNonPublicPath = /* @__PURE__ */ __name((pathname) => {
  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
  }
  const normalizedPath = decodedPath.toLowerCase();
  return NON_PUBLIC_FILES.has(normalizedPath) || NON_PUBLIC_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));
}, "isNonPublicPath");
var nonPublicResponse = /* @__PURE__ */ __name(() => new Response("Not Found", {
  status: 404,
  headers: {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff"
  }
}), "nonPublicResponse");
var pages_entry_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (isNonPublicPath(url.pathname)) return nonPublicResponse();
    const liveResponse = await handleLiveSenseware(request, env, ctx);
    if (liveResponse) return liveResponse;
    if (url.pathname.startsWith("/api/")) return index_default.fetch(request, env);
    const assetResponse = await env.ASSETS.fetch(request);
    if (!/^\/assets\/audio\/.+\.mp3$/u.test(url.pathname) || !assetResponse.ok) return assetResponse;
    const headers = new Headers(assetResponse.headers);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    const range = request.headers.get("Range")?.match(/^bytes=(\d*)-(\d*)$/u);
    if (!range || assetResponse.status === 206 || request.method === "HEAD") {
      return new Response(assetResponse.body, { status: assetResponse.status, statusText: assetResponse.statusText, headers });
    }
    const bytes = await assetResponse.arrayBuffer();
    const suffixLength = range[1] ? 0 : Number(range[2]);
    const start = range[1] ? Number(range[1]) : Math.max(0, bytes.byteLength - suffixLength);
    const end = range[2] && range[1] ? Math.min(Number(range[2]), bytes.byteLength - 1) : bytes.byteLength - 1;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || start >= bytes.byteLength) {
      headers.set("Content-Range", `bytes */${bytes.byteLength}`);
      headers.set("Content-Length", "0");
      return new Response(null, { status: 416, headers });
    }
    const chunk = bytes.slice(start, end + 1);
    headers.set("Content-Range", `bytes ${start}-${end}/${bytes.byteLength}`);
    headers.set("Content-Length", String(chunk.byteLength));
    return new Response(chunk, { status: 206, headers });
  }
};
export {
  pages_entry_default as default
};
/*! Bundled license information:

pako/dist/pako.esm.mjs:
  (*! pako 2.2.0 https://github.com/nodeca/pako @license (MIT AND Zlib) *)

lerc/LercDecode.js:
  (* Copyright 2015-2021 Esri. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 @preserve *)
*/

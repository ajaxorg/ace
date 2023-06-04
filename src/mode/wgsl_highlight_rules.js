"use strict";

var oop = require("../lib/oop");
var rustHighlightRules = require("./rust_highlight_rules").RustHighlightRules;

var wgslHighlightRules = function() {

    var keywords = (
        "bitcast|block|break|case|continue|continuing|default|discard|else|elseif|" +
        "enable|fallthrough|for|function|if|loop|override|private|read|read_write|" +
        "return|storage|switch|uniform|while|workgroup|write|asm|const|do|enum|fn|" +
        "handle|premerge|regardless|typedef|unless|using|void|let|var|struct"
    );

    var builtinConstants =
      "abs|acos|acosh|asin|asinh|atan|atanh|atan2|ceil|clamp|cos|cosh|countLeadingZeros|countOneBits|countTrailingZeros|" +
      "cross|degrees|determinant|distance|dot|exp|exp2|extractBits|extractBits|faceForward|firstLeadingBit|firstLeadingBit|firstTrailingBit|" +
      "floor|fma|fract|frexp|insertBits|inverseSqrt|ldexp|length|log|log2|max|min|mix|modf|normalize|pow|quantizeToF16|radians|reflect|" +
      "refract|reverseBits|round|saturate|sign|sin|sinh|smoothstep|sqrt|step|tan|tanh|transpose|trunc|dpdx|dpdxCoarse|dpdxFine|dpdy|" +
      "dpdyCoarse|dpdyFine|fwidth|fwidthCoarse|fwidthFine|textureDimensions|textureGather|textureGatherCompare|textureLoad|textureNumLayers|" +
      "textureNumLevels|textureNumSamples|textureSample|textureSampleBias|textureSampleCompare|textureSampleCompareLevel|textureSampleGrad|" +
      "textureSampleLevel|textureSampleBaseClampToEdge|textureStore|pack4x8snorm|pack4x8unorm|pack2x16snorm|pack2x16unorm|pack2x16float|" +
      "unpack4x8snorm|unpack4x8unorm|unpack2x16snorm|unpack2x16unorm|unpack2x16float|storageBarrier|workgroupBarrier|workgroupUniformLoad|" +
      "atomicAdd|atomicSub|atomicMax|atomicMin|atomicAnd|atomicOr|atomicXor|atomicLoad|atomicStore|array|bool|f16|f32|i32|mat2x2|mat2x3|" +
      "mat2x4|mat3x2|mat3x3|mat3x4|mat4x2|mat4x3|mat4x4";

      var keywordMapper = this.createKeywordMapper(
        {
          "variable.language": "this",
          keyword: keywords,
          "constant.language": builtinConstants
        },
        "identifier"
      );

      this.$rules = keywordMapper;
};

wgslHighlightRules.metaData = {
  fileTypes: ["wgsl"],
  name: "WGSL",
  scopeName: "source.wgsl"
};

oop.inherits(wgslHighlightRules, rustHighlightRules);

exports.wgslHighlightRules = wgslHighlightRules;

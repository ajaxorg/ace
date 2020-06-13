/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var ASLHighlightRules = function() {
        var keywords = (
            "Default|DefinitionBlock|Device|Method|Else|ElseIf|For|Function|If|Include|Method|Return|" +
            "Scope|Switch|Case|While|Break|BreakPoint|Continue|NoOp|Wait|True|False|" +
            "AccessAs|Acquire|Alias|BankField|Buffer|Concatenate|ConcatenateResTemplate|" +
            "CondRefOf|Connection|CopyObject|CreateBitField|CreateByteField|CreateDWordField|" +
            "CreateField|CreateQWordField|CreateWordField|DataTableRegion|Debug|" +
            "DMA|DWordIO|DWordMemory|DWordSpace|EisaId|EISAID|EndDependentFn|Event|ExtendedIO|" +
            "ExtendedMemory|ExtendedSpace|External|Fatal|Field|FindSetLeftBit|FindSetRightBit|" +
            "FixedDMA|FixedIO|Fprintf|FromBCD|GpioInt|GpioIo|I2CSerialBusV2|IndexField|" +
            "Interrupt|IO|IRQ|IRQNoFlags|Load|LoadTable|Match|Memory32|Memory32Fixed|" +
            "Mid|Mutex|Name|Notify|Offset|ObjectType|OperationRegion|Package|PowerResource|Printf|" +
            "QWordIO|QWordMemory|QWordSpace|RawDataBuffer|Register|Release|Reset|ResourceTemplate|" +
            "Signal|SizeOf|Sleep|SPISerialBusV2|Stall|StartDependentFn|StartDependentFnNoPri|" +
            "Store|ThermalZone|Timer|ToBCD|ToBuffer|ToDecimalString|ToInteger|ToPLD|ToString|" +
            "ToUUID|UARTSerialBusV2|Unicode|Unload|VendorLong|VendorShort|WordBusNumber|WordIO|" +
            "WordSpace"
        );

        var keywordOperators = (
            "Add|And|Decrement|Divide|Increment|Index|LAnd|LEqual|LGreater|LGreaterEqual|" +
            "LLess|LLessEqual|LNot|LNotEqual|LOr|Mod|Multiply|NAnd|NOr|Not|Or|RefOf|Revision|" +
            "ShiftLeft|ShiftRight|Subtract|XOr|DerefOf"
        );

        var flags = (
            "AttribQuick|AttribSendReceive|AttribByte|AttribBytes|AttribRawBytes|" +
            "AttribRawProcessBytes|AttribWord|AttribBlock|AttribProcessCall|AttribBlockProcessCall|" +
            "AnyAcc|ByteAcc|WordAcc|DWordAcc|QWordAcc|BufferAcc|" +
            "AddressRangeMemory|AddressRangeReserved|AddressRangeNVS|AddressRangeACPI|" +
            "RegionSpaceKeyword|FFixedHW|PCC|" +
            "AddressingMode7Bit|AddressingMode10Bit|" +
            "DataBitsFive|DataBitsSix|DataBitsSeven|DataBitsEight|DataBitsNine|" +
            "BusMaster|NotBusMaster|" +
            "ClockPhaseFirst|ClockPhaseSecond|ClockPolarityLow|ClockPolarityHigh|" +
            "SubDecode|PosDecode|" +
            "BigEndianing|LittleEndian|" +
            "FlowControlNone|FlowControlXon|FlowControlHardware|" +
            "Edge|Level|ActiveHigh|ActiveLow|ActiveBoth|Decode16|Decode10|" +
            "IoRestrictionNone|IoRestrictionInputOnly|IoRestrictionOutputOnly|" +
            "IoRestrictionNoneAndPreserve|Lock|NoLock|MTR|MEQ|MLE|MLT|MGE|MGT|" +
            "MaxFixed|MaxNotFixed|Cacheable|WriteCombining|Prefetchable|NonCacheable|" +
            "MinFixed|MinNotFixed|" +
            "ParityTypeNone|ParityTypeSpace|ParityTypeMark|ParityTypeOdd|ParityTypeEven|" +
            "PullDefault|PullUp|PullDown|PullNone|PolarityHigh|PolarityLow|" +
            "ISAOnlyRanges|NonISAOnlyRanges|EntireRange|ReadWrite|ReadOnly|" +
            "UserDefRegionSpace|SystemIO|SystemMemory|PCI_Config|EmbeddedControl|" +
            "SMBus|SystemCMOS|PciBarTarget|IPMI|GeneralPurposeIO|GenericSerialBus|" +
            "ResourceConsumer|ResourceProducer|Serialized|NotSerialized|" +
            "Shared|Exclusive|SharedAndWake|ExclusiveAndWake|ControllerInitiated|DeviceInitiated|" +
            "StopBitsZero|StopBitsOne|StopBitsOnePlusHalf|StopBitsTwo|" +
            "Width8Bit|Width16Bit|Width32Bit|Width64Bit|Width128Bit|Width256Bit|" +
            "SparseTranslation|DenseTranslation|TypeTranslation|TypeStatic|" +
            "Preserve|WriteAsOnes|WriteAsZeros|Transfer8|Transfer16|Transfer8_16|" +
            "ThreeWireMode|FourWireMode"
        );

        var storageTypes = (
            "UnknownObj|IntObj|StrObj|BuffObj|PkgObj|FieldUnitObj|DeviceObj|" +
            "EventObj|MethodObj|MutexObj|OpRegionObj|PowerResObj|ProcessorObj|" +
            "ThermalZoneObj|BuffFieldObj|DDBHandleObj"
        );

        var builtinConstants = (
            "__FILE__|__PATH__|__LINE__|__DATE__|__IASL__"
        );

        var strNumbers = (
            "One|Ones|Zero"
        );

        var deprecated = (
            "Memory24|Processor"
        );

        var keywordMapper = this.createKeywordMapper({
            "keyword": keywords,
            "constant.numeric": strNumbers,
            "keyword.operator": keywordOperators,
            "constant.language": builtinConstants,
            "storage.type": storageTypes,
            "constant.library": flags,
            "invalid.deprecated": deprecated
        }, "identifier");

        this.$rules = {
            "start" : [
                {
                    token : "comment",
                    regex : "\\/\\/.*$"
                },
                DocCommentHighlightRules.getStartRule("doc-start"),
                {
                    token : "comment", // multi line comment
                    regex : "\\/\\*",
                    next : "comment"
                },
                DocCommentHighlightRules.getStartRule("doc-start"),
                {
                    token : "comment", // ignored fields / comments
                    regex : "\\\[",
                    next : "ignoredfield"
                }, {
                    token : "variable",
                    regex : "\\Local[0-7]|\\Arg[0-6]"
                }, {
                    token : "keyword", // pre-compiler directives
                    regex : "#\\s*(?:define|elif|else|endif|error|if|ifdef|ifndef|include|includebuffer|line|pragma|undef|warning)\\b",
                    next  : "directive"
                }, {
                    token : "string", // single line
                    regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                }, {
                    token : "constant.character", // single line
                    regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
                }, {
                    token : "constant.numeric", // hex
                    regex : /0[xX][0-9a-fA-F]+\b/
                }, {
                    token : "constant.numeric",
                    regex : /[0-9]+\b/
                }, {
                    token : keywordMapper,
                    regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                }, {
                    token : "keyword.operator",
                    regex : /[!\~\*\/%+-<>\^|=&]/
                }, {
                    token : "lparen",
                    regex : "[[({]"
                }, {
                    token : "rparen",
                    regex : "[\\])}]"
                }, {
                    token : "text",
                    regex : "\\s+"
                }
            ],
            "comment" : [
                {
                    token : "comment", // closing comment
                    regex : "\\*\\/",
                    next : "start"
                }, {
                    defaultToken : "comment"
                }
            ],
            "ignoredfield" : [
                {
                    token : "comment", // closing ignored fields / comments
                    regex : "\\\]",
                    next : "start"
                }, {
                    defaultToken : "comment"
                }
            ],
            "directive" : [
                {
                    token : "constant.other.multiline",
                    regex : /\\/
                },
                {
                    token : "constant.other.multiline",
                    regex : /.*\\/
                },
                {
                    token : "constant.other",
                    regex : "\\s*<.+?>*s",
                    next : "start"
                },
                {
                    token : "constant.other", // single line
                    regex : '\\s*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]*s',
                    next : "start"
                },
                {
                    token : "constant.other", // single line
                    regex : "\\s*['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
                    next : "start"
                },
                // "\" implies multiline, while "/" implies comment
                {
                    token : "constant.other",
                    regex : /[^\\\/]+/,
                    next : "start"
                }
            ]
        };

        this.embedRules(DocCommentHighlightRules, "doc-",
            [ DocCommentHighlightRules.getEndRule("start") ]);
    };

    oop.inherits(ASLHighlightRules, TextHighlightRules);

    exports.ASLHighlightRules = ASLHighlightRules;
});

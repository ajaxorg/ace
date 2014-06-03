define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var PraatHighlightRules = function() {

    var keywords = (
        "if|then|else|elsif|elif|endif|fi|" +
        "endfor|endproc|" + // other for-related keywords are specified below
        "while|endwhile|" +
        "repeat|until|" +
        "select|plus|minus|" +
        "assert"
    );

//     var buildinConstants = ("ARGV|ENV|INC|SIG");

    var predefinedVariables = (
        "macintosh|windows|unix|" +
        "praatVersion|praatVersion\\$" +
        "pi|undefined|" +
        "newline\\$|tab\\$|" +
        "shellDirectory\\$|homeDirectory\\$|preferencesDirectory\\$|" +
        "temporaryDirectory\\$|defaultDirectory\\$"
    );
    
    var functions = (
//      Math functions
        "writeInfo|writeInfoLine|appendInfo|appendInfoLine|" +
        "writeFile|writeFileLine|appendFile|appendFileLine|" +
        "abs|round|floor|ceiling|min|max|imin|imax|" +
        "sqrt|sin|cos|tan|arcsin|arccos|arctan|arctan2|sinc|sincpi|" +
        "exp|ln|log10|log2|" +
        "sinh|cosh|tanh|arcsinh|arccosh|actanh|" +
        "sigmoid|invSigmoid|erf|erfc|" +
        "randomUniform|randomInteger|randomGauss|randomPoisson|" +
        "lnGamma|gaussP|gaussQ|invGaussQ|" +
        "chiSquareP|chiSquareQ|invChiSquareQ|studentP|studentQ|invStudentQ|" +
        "fisherP|fisherQ|invFisherQ|" +
        "binomialP|binomialQ|invBinomialP|invBinomialQ|" +
        "hertzToBark|barkToHerz|" +
        "hertzToMel|melToHertz|" +
        "hertzToSemitones|semitonesToHerz|" +
        "erb|hertzToErb|erbToHertz|" +
        "phonToDifferenceLimens|differenceLimensToPhon|" +
        "beta|besselI|besselK|" +
//      String functions
        "selected|selected$|numberOfSelected|variableExists|"+
        "index|rindex|startsWith|endsWith|"+
        "index_regex|rindex_regex|replace_regex$|"+
        "length|extractWord$|extractLine$|extractNumber|" +
        "left$|right$|mid$|replace$|" +
//      Pause functions
        "beginPause|endPause|" +
//      Demo functions
        "demoShow|demoWindowTitle|demoInput|demoWaitForInput|" +
        "demoClicked|demoClickedIn|demoX|demoY|" +
        "demoKeyPressed|demoKey$|" +
        "demoExtraControlKeyPressed|demoShiftKeyPressed|"+
        "demoCommandKeyPressed|demoOptionKeyPressed|" +
//      File functions
        "environment$|" +
        "chooseDirectory$|createDirectory|fileReadable|deleteFile|" +
        "selectObject|removeObject|plusObject|minusObject|" +
        "runScript|exitScript"
    );

    var objectTypes = (
        "Collection|Strings|ManPages|SortedSetOfString|Sound|Matrix|Polygon|" +
        "PointProcess|ParamCurve|Spectrum|Ltas|Spectrogram|Formant|" +
        "Excitation|Cochleagram|VocalTract|FormantPoint|FormantTier|" +
        "FormantGrid|Label|Tier|Autosegment|Intensity|Pitch|Harmonicity|" +
        "Transition|RealPoint|RealTier|PitchTier|IntensityTier|DurationTier|" +
        "AmplitudeTier|SpectrumTier|Manipulation|TextPoint|TextInterval|" +
        "TextTier|IntervalTier|TextGrid|LongSound|WordList|SpellingChecker|" +
        "Movie|Corpus|TableOfReal|Distributions|PairDistribution|Table|" +
        "LinearRegression|LogisticRegression|Art|Artword|Speaker|Activation|" +
        "BarkFilter|Categories|Cepstrum|CCA|ChebyshevSeries|" +
        "ClassificationTable|Confusion|Correlation|Covariance|Discriminant|" +
        "DTW|Eigen|Excitations|FormantFilter|Index|KlattTable|Permutation|" +
        "ISpline|LegendreSeries|MelFilter|MSpline|Pattern|PCA|Polynomial|" +
        "Roots|SimpleString|StringsIndex|SpeechSynthesizer|SPINET|SSCP|SVD|" +
        "AffineTransform|Procrustes|ContingencyTable|Dissimilarity|" +
        "Similarity|Configuration|Distance|Salience|ScalarProduct|Weight|" +
        "KlattGrid|HMM|HMM_State|HMM_Observation|HMM_ObservationSequence|" +
        "HMM_StateSequence|GaussianMixture|Diagonalizer|MixingMatrix|" +
        "CrossCorrelationTable|CrossCorrelationTables|Network|OTGrammar|" +
        "OTHistory|OTMulti|FFNet|Cepstrumc|LPC|LFCC|MFCC|ExperimentMFC|" +
        "ResultsMFC|EEG|ERPTier|ERP|KNN|FeatureWeights"
    );
    
    var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
//         "constant.language": buildinConstants,
        "support.function": functions
    }, "identifier");
    
    var inlineIf = this.createKeywordMapper({
        "keyword": "(if|then|else|fi)",
//         "constant.language": buildinConstants,
        "support.function": functions
    }, "identifier");

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : ["text", "keyword.operator", "text"],
                regex : /(\s+)((?:\+|-|\/|\*|<|>)=?|==?|!=|%|\^|\||and|or|not)(\s+)/
            }, {
                token : ["text", "text", "keyword.operator", "text", "keyword", "text", "keyword"],
                regex : /(^\s*)(?:([a-z][a-zA-Z0-9_]*\$?\s+)(=)(\s+))?(?:((?:no)?warn|nocheck|noprogress)(\s+))?((?:[A-Z][^.:"]+)(?:$|(?:\.{3}|:)))/
            }, {
                token : ["text", "keyword", "text", "keyword"],
                regex : /(^\s*)(?:(demo)?(\s+))((?:[A-Z][^.:"]+)(?:$|(?:\.{3}|:)))/
            }, {
                token : ["text", "keyword"],
                regex : /(^\s*)(demo\b)/
            }, {
                token : "entity.name.type",
                regex : "(" + objectTypes + ")"
            }, {
                token : "variable.language",
                regex : "(" + predefinedVariables + ")"
            }, {
                token : ["support.function", "text"],
                regex : "((?:" + functions + ")\\$?)(\\s*(?::|\\())"
            }, {
                token : "keyword",
                regex : /(\bfor\b)/,
                next : "for"
            }, {
                token : "keyword",
                regex : "(\\b(?:" + keywords + ")\\b)"
            }, {
                token : "string.interpolated",
                regex : /'((?:[a-z][a-zA-Z0-9_]*)(?:\$|#|:[0-9]+)?)'/
            }, {
                token : "string",
                regex : /"[^"]*"/
            }, {
                token : "string",
                regex : /"[^"]*$/,
                next : "brokenstring"
            }, {
                token : ["text", "keyword", "text", "entity.name.section"], // multi line string start
                regex : /(^\s*)(\bform\b)(\s+)(.*)/,
                next : "form"
            }, {
                token : "constant.numeric",
                regex : /\b[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
            }, {
                token : ["keyword", "text", "entity.name.function"],
                regex : /(procedure)(\s+)(\S+)/
            }, {
                token : ["entity.name.function", "text"],
                regex : /(@\S+)(:|\s*\()/
            }, {
                token : ["text", "keyword", "text", "entity.name.function"],
                regex : /(^\s*)(call)(\s+)(\S+)/
            }, {
                token : "comment",
                regex : ";.*$"
            }, {
                token : "comment",
                regex : "#.*$"
            }, {
                token : "text",
                regex : /\s+/
            }
        ],
        "form" : [
            {
                token : ["keyword", "text", "constant.numeric"],
                regex : /((?:optionmenu|choice)\s+)(\S+:\s+)([0-9]+)/
            }, {
                token : ["keyword", "constant.numeric"],
                regex : /((?:option|button)\s+)([+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b)/
            }, {
                token : ["keyword", "string"],
                regex : /((?:option|button)\s+)(.*)/
            }, {
                token : ["keyword", "text", "string"],
                regex : /((?:sentence|text)\s+)(\S+\s*)(.*)/
            }, {
                token : ["keyword", "text", "string", "invalid.illegal"],
                regex : /(word\s+)(\S+\s*)(\S+)?(\s.*)?/
            }, {
                token : ["keyword", "text", "constant.language"],
                regex : /(boolean\s+)(\S+\s*)(0|1|"?(?:yes|no)"?)/
            }, {
                token : ["keyword", "text", "constant.numeric"],
                regex : /((?:real|natural|positive|integer)\s+)(\S+\s*)([+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b)/
            }, {
                token : ["keyword", "string"],
                regex : /(comment\s+)(.*)/
            }, {
                token : "keyword",
                regex : 'endform',
                next : "start"
            }
        ],
        "for" : [
            {
                token : ["keyword", "text", "constant.numeric", "text"],
                regex : /(from|to)(\s+)([+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?)(\s*)/
            }, {
                token : ["keyword", "text"],
                regex : /(from|to)(\s+\S+\s*)/
            }, {
                token : "text",
                regex : /$/,
                next : "start"
            }
        ],
        "brokenstring" : [
            {
                token : ["text", "string"],
                regex : /(\s*\.{3})([^"]*)/
            }, {
                token : "string",
                regex : /"/,
                next : "start"
            }
        ],
    };
};

oop.inherits(PraatHighlightRules, TextHighlightRules);

exports.PraatHighlightRules = PraatHighlightRules;
});

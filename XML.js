(function() {

window.XML = {};

// regexp must not have capturing parentheses
// regexps are ordered -> the first match is used

XML.RULES = {
  start :
  [
    {
      token: "text",
      regex: "<\\!\\[CDATA\\[",
      next: "cdata"
    },
    {
      token: "xml_pe",
      regex: "<\\?.*?\\?>"
    },
    {
      token: "text", // opening tag
      regex: "<",
      next: "tag"
    },
    {
      token: "text",
      regex: "\\s+"
    },
    {
      token: "text",
      regex: ".+"
    }    
  ],
  
  tag:
  [
    {
      token: "text",
      regex: ">",
      next: "start"
    },
    {
      token: "keyword",
      regex: "[-_a-zA-Z0-9:]+"
    },    
    {
      token: "text",
      regex: "\\s+"
    },
    {
      token: "string",
      regex: '".*?"'
    },
    {
      token: "string",
      regex: "'.*?'"
    }
  ],
  
  cdata:
  [
    {
      token: "text",
      regex: "\\]\\]>",
      next: "start"
    },
    {
      token: "string",
      regex: "\\s+"
    },
    {
      token: "text",
      regex: ".+"
    }
  ]
};

})();
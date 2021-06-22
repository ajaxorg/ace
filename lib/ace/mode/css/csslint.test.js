var CSSLint = require("./csslint").CSSLint;

var a = 2;

it("doesn't break basic stuff", () => {
    const css =
`div { 
    color: red; 
}`;
    const result = CSSLint.verify(css);
    expect(result.messages).toEqual([]);
});

it("parses a simple query", () => {
const css =
`@supports ( stuff: none ) {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages).toEqual([]);
});

it("parses a not query", () => {
    const css =
`@supports not ( stuff: none ) {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages).toEqual([]);
});

it("parses a not not query", () => {
    const css =
`@supports not not ( stuff: none ) {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages).toEqual([]);
});

it("parses an and query", () => {
    const css =
`@supports ( stuff: none ) and ( other: blue ) and ( other: blue ) and ( other: blue ) {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages).toEqual([]);
});

it("parses an or query", () => {
    const css =
`@supports ( stuff: none ) or ( other: blue ) or ( other: blue ) or ( other: blue ) {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages).toEqual([]);
});

it("parses a combined query", () => {
    const css =
`@supports ( stuff: none ) or ( other: blue ) and ( other: blue ) and ( other: blue ) {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages).toEqual([]);
});

it("parses a parenthesis query", () => {
    const css =
`@supports (( stuff: none ) or ( other: blue )) and (( other: blue ) or ( other: blue )) {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages).toEqual([]);
});

it("yells if no query", () => {
    const css =
`@supports {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages.length).toEqual(2);
});

it("yells if empty query", () => {
    const css =
`@supports() {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages.length).toEqual(3);
});

it("yells if orphan not", () => {
    const css =
`@supports not {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages.length).toEqual(1);
});

it("yells if orphan and", () => {
    const css =
`@supports (stuff: thing) and {
    div { 
        color: red;
    }
}`;
    const result = CSSLint.verify(css);
    expect(result.messages.length).toEqual(1);
});
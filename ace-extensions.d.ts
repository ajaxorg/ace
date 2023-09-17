declare module "ace-code/src/ext/simple_tokenizer" {
    export type TokenizeResult = Array<Array<{
        className?: string,
        value: string,
    }>>
    export function tokenize(content: string, highlightRules: import("./ace").Ace.HighlightRules): TokenizeResult;
}

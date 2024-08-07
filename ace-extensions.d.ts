declare module "ace-code/src/ext/simple_tokenizer" {
    export type TokenizeResult = Array<Array<{
        className?: string,
        value: string,
    }>>
    export function tokenize(content: string, highlightRules: import("./ace").Ace.HighlightRules): TokenizeResult;
}

declare module "ace-code/src/ext/modelist" {
    export type Mode = {
        name: string;
        caption: string;
        mode: string;
        extensions: string;
        supportsFile(filename: string): boolean;
    }
    export function getModeForPath(path: string): Mode;
    export const modes: Mode[];
    export const modesByName: Record<string, Mode>;
}

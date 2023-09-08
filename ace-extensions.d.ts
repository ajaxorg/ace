declare module "ace-code/src/ext/syntax-highlighter" {
    export type SyntaxHighlighterProps = {
        content: string, 
        highlightRules: import("./ace").Ace.HighlightRules, 
        className?: string,
    }
    
    declare function highlight(props: SyntaxHighlighterProps): HTMLElement;
    export default highlight;
}

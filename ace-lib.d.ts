declare module "ace-code/src/lib/useragent" {
    export namespace OS {
        let LINUX: string;
        let MAC: string;
        let WINDOWS: string;
    }
    export function getOS(): string;
    export const isWin: boolean;
    export const isMac: boolean;
    export const isLinux: boolean;
    export const isIE: number;
    export const isOldIE: boolean;
    export const isGecko: any;
    export const isMozilla: any;
    export const isOpera: boolean;
    export const isWebKit: number;
    export const isChrome: number;
    export const isSafari: true;
    export const isEdge: number;
    export const isAIR: boolean;
    export const isAndroid: boolean;
    export const isChromeOS: boolean;
    export const isIOS: boolean;
    export const isMobile: boolean;
}
declare module "ace-code/src/lib/dom" {
    export function buildDom(arr: any, parent?: HTMLElement, refs?: any): HTMLElement | Text | any[];
    export function getDocumentHead(doc?: Document): HTMLHeadElement | HTMLElement;
    export function createElement<T extends keyof HTMLElementTagNameMap>(tag: string | T, ns?: string): HTMLElementTagNameMap[T];
    export function removeChildren(element: HTMLElement): void;
    export function createTextNode(textContent: string, element?: HTMLElement): Text;
    export function createFragment(element?: HTMLElement): DocumentFragment;
    export function hasCssClass(el: HTMLElement, name: string): boolean;
    export function addCssClass(el: HTMLElement, name: string): void;
    export function removeCssClass(el: HTMLElement, name: string): void;
    export function toggleCssClass(el: HTMLElement, name: string): boolean;
    export function setCssClass(node: HTMLElement, className: string, include: boolean): void;
    export function hasCssString(id: string, doc?: Document): boolean;
    export function removeElementById(id: string, doc?: Document): void;
    export function useStrictCSP(value: any): void;
    export function importCssStylsheet(uri: string, doc?: Document): void;
    export function scrollbarWidth(doc?: Document): number;
    export function computedStyle(element: Element, style?: any): Partial<CSSStyleDeclaration>;
    export function setStyle(styles: CSSStyleDeclaration, property: string, value: string): void;
    export const HAS_CSS_ANIMATION: boolean;
    export const HAS_CSS_TRANSFORMS: boolean;
    export const HI_DPI: boolean;
    export function translate(element: any, tx: any, ty: any): void;
    export function importCssString(cssText: any, id: any, target: any): number;
}
declare module "ace-code/src/lib/oop" {
    export function inherits(ctor: any, superCtor: any): void;
    export function mixin<T>(obj: T, mixin: any): any;
    export function implement<T>(proto: T, mixin: any): any;
}
declare module "ace-code/src/lib/deep_copy" {
    export function deepCopy(obj: any): any;
}
declare module "ace-code/src/lib/lang" {
    export function last(a: any): any;
    export function stringReverse(string: any): any;
    export function stringRepeat(string: any, count: any): string;
    export function stringTrimLeft(string: any): any;
    export function stringTrimRight(string: any): any;
    export function copyObject(obj: any): {};
    export function copyArray(array: any): any[];
    export const deepCopy: (obj: any) => any;
    export function arrayToMap(arr: any): {};
    export function createMap(props: any): any;
    export function arrayRemove(array: any, value: any): void;
    export function escapeRegExp(str: any): any;
    export function escapeHTML(str: any): string;
    export function getMatchOffsets(string: any, regExp: any): any[];
    export function deferredCall(fcn: any): {
        (timeout: any): any;
        schedule: any;
        call(): any;
        cancel(): any;
        isPending(): any;
    };
    export function delayedCall(fcn: any, defaultTimeout: any): {
        (timeout: any): void;
        delay(timeout: any): void;
        schedule: any;
        call(): void;
        cancel(): void;
        isPending(): any;
    };
    export function supportsLookbehind(): boolean;
    export function skipEmptyMatch(line: any, last: any, supportsUnicodeFlag: any): 1 | 2;
}
declare module "ace-code/src/lib/keys" {
    export function keyCodeToString(keyCode: number): string;
}
declare module "ace-code/src/lib/event" {
    export function addListener(elem: any, type: any, callback: any, destroyer: any | null): void;
    export function removeListener(elem: any, type: any, callback: any): void;
    export function stopEvent(e: any): boolean;
    export function stopPropagation(e: any): void;
    export function preventDefault(e: any): void;
    export function getButton(e: any): any;
    export function capture(el: any, eventHandler: any, releaseCaptureHandler: any): (e: any) => void;
    export function addMouseWheelListener(el: any, callback: any, destroyer?: any): void;
    export function addMultiMouseDownListener(elements: any, timeouts: any, eventHandler: any, callbackName: any, destroyer?: any): void;
    export function getModifierString(e: KeyboardEvent | MouseEvent): any;
    export function addCommandKeyListener(el: EventTarget, callback: (e: KeyboardEvent, hashId: number, keyCode: number) => void, destroyer?: any): void;
    export function nextTick(callback: any, win: any): void;
    export function onIdle(cb: any, timeout: any): number;
    export function blockIdle(delay: any): void;
    export const nextFrame: any;
}
declare module "ace-code/src/lib/event_emitter" {
    /**@type {any}*/
    export var EventEmitter: any;
}
declare module "ace-code/src/lib/net" {
    export function get(url: any, callback: any): void;
    export function loadScript(path: any, callback: any): void;
    export function qualifyURL(url: any): string;
}
declare module "ace-code/src/lib/report_error" {
    export function reportError(msg: any, data: any): void;
}
declare module "ace-code/src/lib/default_english_messages" {
    export var defaultEnglishMessages: {
        "autocomplete.popup.aria-roledescription": string;
        "autocomplete.popup.aria-label": string;
        "autocomplete.popup.item.aria-roledescription": string;
        "autocomplete.loading": string;
        "editor.scroller.aria-roledescription": string;
        "editor.scroller.aria-label": string;
        "editor.gutter.aria-roledescription": string;
        "editor.gutter.aria-label": string;
        "error-marker.good-state": string;
        "prompt.recently-used": string;
        "prompt.other-commands": string;
        "prompt.no-matching-commands": string;
        "search-box.find.placeholder": string;
        "search-box.find-all.text": string;
        "search-box.replace.placeholder": string;
        "search-box.replace-next.text": string;
        "search-box.replace-all.text": string;
        "search-box.toggle-replace.title": string;
        "search-box.toggle-regexp.title": string;
        "search-box.toggle-case.title": string;
        "search-box.toggle-whole-word.title": string;
        "search-box.toggle-in-selection.title": string;
        "search-box.search-counter": string;
        "text-input.aria-roledescription": string;
        "text-input.aria-label": string;
        "gutter.code-folding.range.aria-label": string;
        "gutter.code-folding.closed.aria-label": string;
        "gutter.code-folding.open.aria-label": string;
        "gutter.code-folding.closed.title": string;
        "gutter.code-folding.open.title": string;
        "gutter.annotation.aria-label.error": string;
        "gutter.annotation.aria-label.warning": string;
        "gutter.annotation.aria-label.info": string;
        "inline-fold.closed.title": string;
        "gutter-tooltip.aria-label.error.singular": string;
        "gutter-tooltip.aria-label.error.plural": string;
        "gutter-tooltip.aria-label.warning.singular": string;
        "gutter-tooltip.aria-label.warning.plural": string;
        "gutter-tooltip.aria-label.info.singular": string;
        "gutter-tooltip.aria-label.info.plural": string;
    };
}
declare module "ace-code/src/lib/app_config" {
    const AppConfig_base: undefined;
    export class AppConfig {
        /**
         * @param {Object} obj
         * @param {string} path
         * @param {{ [key: string]: any }} options
         * @returns {AppConfig}
         */
        defineOptions(obj: any, path: string, options: {
            [key: string]: any;
        }): AppConfig;
        /**
         * @param {Object} obj
         */
        resetOptions(obj: any): void;
        /**
         * @param {string} path
         * @param {string} name
         * @param {any} value
         */
        setDefaultValue(path: string, name: string, value: any): boolean;
        /**
         * @param {string} path
         * @param {{ [key: string]: any; }} optionHash
         */
        setDefaultValues(path: string, optionHash: {
            [key: string]: any;
        }): void;
        /**
         * @param {any} value
         */
        setMessages(value: any): void;
        /**
         * @param {string} key
         * @param {string} defaultString
         * @param {{ [x: string]: any; }} [params]
         */
        nls(key: string, defaultString: string, params?: {
            [x: string]: any;
        }): any;
        warn: typeof warn;
        reportError: (msg: any, data: any) => void;
    }
    function warn(message: any, ...args: any[]): void;

    export {};
    namespace Ace {
        type EventEmitter<T> = import("ace-code").Ace.EventEmitter<T>;
    }
    export interface AppConfig extends Ace.EventEmitter<any> {
    }
}
declare module "ace-code/src/lib/scroll" {
    export function preventParentScroll(event: any): void;
}
declare module "ace-code/src/lib/bidiutil" {
    export const ON_R: 3;
    export const AN: 4;
    export const R_H: 5;
    export const B: 6;
    export const RLE: 7;
    export const DOT: "·";
    export function doBidiReorder(text: string, textCharTypes: any[], isRtl: boolean): any;
    export function hasBidiCharacters(text: string, textCharTypes: any[]): boolean;
    export function getVisualFromLogicalIdx(logIdx: number, rowMap: any): number;
    export var L: number;
    export var R: number;
    export var EN: number;
}
declare module "ace-code/src/lib/fixoldbrowsers" {
    export {};
}

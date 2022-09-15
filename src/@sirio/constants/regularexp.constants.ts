
export class RegularExpConstants {
    public static get ALPHA(): string { return '[a-zA-Z]*'; };
    public static get ALPHA_DATE(): string { return '[dDmMyY]*'; };
    public static get ALPHA_ACCENTS(): string { return '[a-zA-Z\u00C0-\u017F\u0020]*'; };
    public static get ALPHA_NUMERIC(): string { return '[a-zA-Z0-9]*'; };
    public static get NUMERIC(): string { return '[0-9]*'; };
    public static get NUMERIC_POINT(): string { return '[0-9\u002E\uFE52]*'; };
    public static get DATE(): string { return '([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))'; };
    // public static get DATE_EN(): string { return '/[12]\d{3}-0[1-9]|1[0-2]-0[1-9]|[12]\d|3[01]/'; };
    public static get DATE_EN(): string { return '(19|20)\d{2}\-(0[1-9]|1\d|2\d|3[01])\-(0[1-9]|1[0-2])'; };
    public static get NUMERIC_COMMA(): string { return '[0-9\u002C]*'; };
    public static get ALPHA_NUMERIC_COMMA_POINT(): string { return '[a-zA-Z0-9\u002C\u002E\uFE52]*'; };
    public static get ALPHA_NUMERIC_ACCENTS(): string { return '[a-zA-Z0-9\u00C0-\u017F\u0020]*'; };
    public static get ALPHA_ACCENTS_CHARACTERS(): string { return '[a-zA-Z\u00C0-\u017F\u0022-\u0023\u0026-\u0029\u002C-\u002E\u0020]*'; };
    public static get ALPHANUMERIC_ACCENTS_CHARACTERS(): string { return '[a-zA-Z0-9\u00C0-\u017F\u0022-\u0023\u0026-\u0029\u002C-\u002E\u0020\s]*'; };
    public static get ALPHANUMERIC_CHARACTERS(): string { return '[a-zA-Z0-9\u00C0-\u017F\u0022-\u0023\u0026-\u0029\u002C-\u002E\u0020]*'; };
    public static get ALPHANUMERIC_CHARACTERS_NOSPACE(): string { return '[a-zA-Z0-9\u00C0-\u017F\u0022-\u0023\u0026-\u0029\u002C-\u002E]*'; };
};

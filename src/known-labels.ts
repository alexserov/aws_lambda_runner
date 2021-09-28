export const VMType = ['ubuntu-lambda'] as const;

type KnownLabel =
    'self-hosted' |
    'linux'
    ;

export default KnownLabel;

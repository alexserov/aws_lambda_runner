export const VMType = ['ubuntu-lambda', 'UNUSED'] as const;
export type tVMType = typeof VMType[number];

type KnownLabel =
    typeof VMType[number] |
    'self-hosted' |
    'linux'
    ;

export default KnownLabel;

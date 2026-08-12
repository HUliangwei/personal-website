export type Locale = 'zh' | 'en';

type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer Item)[]
        ? readonly DeepWiden<Item>[]
        : T extends object
          ? { readonly [Key in keyof T]: DeepWiden<T[Key]> }
          : T;

export type Dictionary = DeepWiden<typeof import('./zh').default>;

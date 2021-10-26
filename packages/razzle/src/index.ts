import { Argv } from "yargs";

export type RazzleOptions {
    verbose?: boolean,
    debug?: boolean
}

export type RazzleContext = {
    paths: [string: string]
}

export type BaseRazzleConfigAtleastOne =
  'modifyRazzleContext' |
  'addCommands' |
  'options';

export type BaseRazzleConfig<
 U extends BaseRazzleConfig<U, T>,
 T extends RazzleContext = RazzleContext> = {
    options?: RazzleOptions,
    modifyRazzleContext?: (
        razzleConfig: U,
        razzleContext: T) => Promise<T> | T,
    addCommands?: (
        razzleConfig: U,
        razzleContext: T) => Argv
}

export type RazzleConfig<RazzleConfig> = {

}

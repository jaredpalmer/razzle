import { Argv } from "yargs";

export type RazzleOptions = {
    verbose?: boolean,
    debug?: boolean
}

export type RazzleConfigAtleastOne =
  'modifyRazzleContext' |
  'addCommands' |
  'options';

export type RazzlePaths =
    'dotenv' |
    'appPath' |
    'appNodeModules' |
    'appPackageJson' |
    'appRazzleConfig' |
    'nodePaths' |
    'ownPath' |
    'ownNodeModules';

export interface RazzleContext<U = RazzlePaths> {
    paths: Map<U, string>
}

export interface BaseRazzleConfig<
 U extends BaseRazzleConfig<U, T>,
 T extends RazzleContext = RazzleContext> {
    options?: RazzleOptions,
    modifyRazzleContext?: (
        razzleConfig: U,
        razzleContext: T) => Promise<T> | T,
    addCommands?: [string: (
        razzleConfig: U,
        razzleContext: T) => Argv
    ]
}

export type RazzleConfig<RazzleConfig> = {

}

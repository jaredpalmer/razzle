import transform from "./transform.js";
import { RazzleWebpack5LoaderContext, Source, SourceMap } from "./types";
import { inspect } from 'util';

const razzleBabelLoader = async function (
  this: RazzleWebpack5LoaderContext,
  inputSource: Source,
  inputSourceMap: SourceMap
): Promise<[Source, SourceMap]> {
  const filename = this.resourcePath;
  const target = this.target;
  const loaderOptions = this.getOptions();

        console.log(inspect(loaderOptions, false, 5, true));
  const result = await transform.call(
    this,
    inputSource,
    inputSourceMap,
    loaderOptions,
    filename,
    target
  );
  const { code: transformedSource, map: outputSourceMap } = result || {
    code: "",
    map: "",
  };

  return [transformedSource, outputSourceMap || inputSourceMap];
};

export default function razzleBabelLoaderOuter(
  this: RazzleWebpack5LoaderContext,
  inputSource: Source,
  inputSourceMap: SourceMap
) {
  const callback = this.async();

  razzleBabelLoader.call(this, inputSource, inputSourceMap).then(
    ([transformedSource, outputSourceMap]) =>
      callback?.(null, transformedSource, outputSourceMap || inputSourceMap),
    (err) => {
      callback?.(err);
    }
  );
}

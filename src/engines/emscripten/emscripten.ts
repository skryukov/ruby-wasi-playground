// @ts-ignore
import { loadRuby } from "ruby-head-wasm-emscripten";
import rubyWasm from "ruby-head-wasm-emscripten/dist/ruby.wasm?url";
import rubyStdlib from "ruby-head-wasm-emscripten/dist/ruby_stdlib.data?url";
import { TRunParams } from "../types";

export const run = async (params: TRunParams) => {
  const { code, setResult, setStdout, setStderr } = params;
  const args = ["-e", code, ""];

  const defaultModule = {
    locateFile: (path: string) => {
      switch (path) {
        case "ruby.wasm":
          return rubyWasm;
        case "ruby_stdlib.data":
          return rubyStdlib;
        default:
          throw `Unknown path ${path}`;
      }
    },
    setStatus: setResult,
    print: (line: string) => setStdout(line + "\n"),
    printErr: (line: string) => setStderr(line + "\n"),
    arguments: args,
  };
  await loadRuby(defaultModule);
};

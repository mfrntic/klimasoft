import * as klimasoft from "./klimatskeformule";

function getArguments(func) {
  const ARROW = true;
  const FUNC_ARGS = ARROW ? /^(function)?\s*[^(]*\(\s*([^)]*)\)/m : /^(function)\s*[^(]*\(\s*([^)]*)\)/m;
  const FUNC_ARG_SPLIT = /,/;
  const FUNC_ARG = /^\s*(_?)(.+?)\1\s*$/;
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;

  return ((func || "").toString().replace(STRIP_COMMENTS, "").match(FUNC_ARGS) || ["", "", ""])[2]
    .split(FUNC_ARG_SPLIT)
    .map(function (arg) {
      const name = arg.replace(FUNC_ARG, function (all, underscore, name) {
        console.log("arg", name);
        const parts = name.split("=");
        return parts[0].trim();
      });
      const def = arg.replace(FUNC_ARG, function (all, underscore, name) {
        const parts = name.split("=");
        if (parts.length > 1) {
          return parts[1].trim();
        }
        else {
          return null;
        }
      });

      return {
        name: name,
        default: def
      }
    })
    .filter(String);
}

export function getCalculations() {
  const formule = [];

  for (const formula in klimasoft) {
    if (klimasoft[formula].title) {
      formule.push(klimasoft[formula]);
    }
  }
  return formule.map((f) => {
    const params = getArguments(f.calculate);

    return {
      selected: false,
      name: f.name,
      type: f.type,
      title: f.title,
      parameters: params.map((p) => {
        return {
          parameter: p.name,
          value: p === "oborine" ? "percipitation" : p === "temperatura" ? "meanTemp" : p.default
        };
      }),
    };
  });
}

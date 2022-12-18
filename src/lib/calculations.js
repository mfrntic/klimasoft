
import * as klimasoft from "./klimatskeformule";


function getParams(formula) {
console.log("formula", formula)
  // // String representation of the function code
  // var str = formula.calculate.toString();
  // // console.log("str", str);
  // // Remove comments of the form /* ... */
  // // Removing comments of the form //
  // // Remove body of the function { ... }
  // // removing '=>' if func is arrow function
  // str = str
  //   .replace(/\/\*[\s\S]*?\*\//g, '')
  //   .replace(/\/\/(.)*/g, '')
  //   .replace(/{[\s\S]*}/, '')
  //   .replace(/=>/g, '')
  //   .trim();


  // // Start parameter names after first '('
  // var start = str.indexOf("(") + 1;

  // // End parameter names is just before last ')'
  // var end = str.length - 1;

  // var result = str.substring(start, end).split(", ");

  // var params = [];

  // result.forEach(element => {
  //   // Removing any default value
  //   element = element.replace(/=[\s\S]*/g, '').trim();

  //   if (element.length > 0)
  //     params.push(element);
  // });

  return formula.parameters;
}

export function getCalculations() {
  const formule = [];

  for (const formula in klimasoft) {
    if (klimasoft[formula].title) {
      formule.push(klimasoft[formula]);
    }
  }

  return formule.map((f) => {
    const params = getParams(f);
    // console.log("PARAMS", params);
    return {
      selected: false,
      name: f.name,
      type: f.type,
      title: f.title,
      parameters: params.map((p) => {
        // console.log("param", p);
        return {
          parameter: p,
          value: p === "oborine" ? "percipitation" : p === "temperatura" ? "meanTemp" : (f.defaultParamValues ? f.defaultParamValues[p] : "")
        };
      }),
    };
  });
}

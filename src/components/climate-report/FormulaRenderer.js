function FormulaRenderer({ formula }) {
    console.log("formula", formula);
    return (
        <div>
            <pre key={formula.name}>
                {JSON.stringify(formula, null, 3)}
            </pre>
            <hr />
        </div>
    )
}

export default FormulaRenderer;
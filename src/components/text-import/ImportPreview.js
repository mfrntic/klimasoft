import "./ImportPreview.css";
import parse from 'html-react-parser';
import { useEffect, useState } from "react";
import DataBlockToolbar from "./DataBlockToolbar";

function ImportPreview({ contents, onDataChange }) {

    const [data, setData] = useState();
    const [selectedData, setSelectedData] = useState({});
    const [html, setHtml] = useState();

    useEffect(() => {
        if (contents) {
            const alldata = getData(contents);
            setData(alldata);
            // console.log("data", alldata);
            const html = prepareHtml(alldata, contents);
            // console.log(parse(html));
            setHtml(html);
        }
    }, [contents]);

    // useEffect(() => {
    //     console.log("active-data", data);
    // }, [data]);

    //Gets data extracted from document
    function getData(text) {
        var regexLines = /^\s*(\d{1,4}\.?(?:\s+[-0-9.,*]+){12})/gmi;
        var mLine = null;
        var rawData = [];
        while ((mLine = regexLines.exec(text)) !== null) {
            var ln = mLine[0];
            var regexLineData = /^\s*(\d{1,4})\.?\s+([-0-9.,*]+)\s+([-0-9.,*]+)\s+([-0-9.,*]+)\s+([-0-9.,*]+)\s+([-0-9.,*]+)\s+([-0-9.,*]+)\s+([-0-9.,*]+)\s+([-0-9.,*]+)\s+([-0-9.,*]+)\s+([-0-9.,*]+)\s+([-0-9.,*]+)\s+([-0-9.,*]+)/gmi;
            var mNum = regexLineData.exec(ln);
            if (mNum !== null) {
                var lineData = [];
                for (var i = 1; i <= 13; i++) {
                    let n = Number(mNum[i].replace(",", "."));
                    if (isNaN(n)){
                        n = "";
                    }
                    lineData.push(n);
                }
                rawData.push({ linedata: lineData, linelength: regexLines.lastIndex - mLine.index, startindex: mLine.index });
            }
        }

        if (rawData.length === 0) {
            //GREŠKA - u datoteci nisu nađene nikakve vrijednosti za parsanje
            return null;
        }
        //process rawdata
        var data = [];
        var tables = [];

        data.push(rawData[0].linedata);
        var startIndex = 0, endIndex = 0; //, tableRowIndex = 0;
        for (let i = 1; i < rawData.length; i++) {
            var prev = rawData[i - 1],
                curr = rawData[i];
            if (i === 1) {
                startIndex = prev.startindex;
            }
            if (prev.linedata[0] + 1 === curr.linedata[0]
                || prev.linelength + prev.startindex > curr.startindex - curr.linelength
                || (Number((prev.linedata[0] + 1).toString().substr((prev.linedata[0] + 1).toString().length - 2, 2)) === Number(curr.linedata[0]))) {
                //uzastopne godine - nastavi
                data.push(curr.linedata);
                endIndex = curr.startindex + curr.linelength; // + text.substr(0, curr.startindex).split("\n").length + 1;
                // tableRowIndex++;
            }
            else {
                //nova tabela 
                //endIndex = curr.startindex + curr.linelength;
                tables.push({ data: data, startIndex: startIndex, endIndex: endIndex });
                startIndex = curr.startindex;
                data = [];
                data.push(rawData[i].linedata);
                // tableRowIndex = 0;
            }

        }
        tables.push({ data: data, startIndex: startIndex, endIndex: endIndex });

        // console.log(tables);

        return tables;
    }

    function prepareHtml(data, txt) {
        let text = txt;
        if (data) {
            for (var k = data.length - 1; k >= 0; k--) {
                var t = data[k];
                //create data block
                text = text.substr(0, t.endIndex) + "</span>" + text.substr(t.endIndex);
                // text = text.substr(0, t.startIndex) + "<span-class='datablock'-data_block='" + JSON.stringify(t.data) + "'-data_position='" + k + "'><span-class='commands'></span>" + text.substr(t.startIndex);
                text = text.substr(0, t.startIndex) + "<span-class='datablock'-data_position='" + k + "'><span-class='commands'></span>" + text.substr(t.startIndex);
            };
            text = text.replace(/^\s*\d{1,4}\.?(?:\s+[-0-9.,*]+){12}/gmi,
                function (s) {
                    return "<span-class='highlight'>" + s + "</span>"
                });

            text = text.replace(/[\n]/g, '<br/>').replace(/[ ]/g, '&nbsp;');
            text = text.replace(/<span-class=/g, "<span class=").replace(/-data_position=/g, " data-position=");


        }
        return text;
    }

    function onDataSelectedChange(data) {
        // console.log("data", data);
        setSelectedData((state) => { return { ...state, ...data } });
    }

    useEffect(() => {
        if (selectedData) {
            const data = { ...selectedData };
            for (const prop in data) {
                if (!data[prop]) {
                    delete data[prop];
                }
            }
            onDataChange(data);
        }
    }, [selectedData, onDataChange])

    function renderPreview() {
        if (html) {
            return parse(html, {
                replace: domNode => {
                    // console.log(domNode);
                    if (domNode.attribs && domNode.attribs.class === "commands") {
                        const position = parseInt(domNode.parent.attribs["data-position"]);
                        // console.log("position", position);
                        return <DataBlockToolbar data={data[position].data} onChange={onDataSelectedChange} selectedData={selectedData} />
                    }
                }
            });
        }
    }


    return (
        <div className="preview">
            {renderPreview()}
        </div>
    )
}

export default ImportPreview;
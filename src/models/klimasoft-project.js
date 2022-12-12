export default class Project {

    constructor(project) {
        if (!project) return;
        // Object.assign(this, project);
        this.header = new ProjectHeader(project.header);
        this.data = new ProjectData(project.data);
    }

    static fromObject(project) {
        if (!project) return null;
        // const res = Object.assign(new Project(), project);
        // console.log("fromObject", res);
        let res = {};
        res.header = new ProjectHeader(project.header);
        res.data = new ProjectData(project.data);
        return res;
    }

    header = undefined;

    data = undefined;
}

export class ProjectHeader {
    constructor(header) {
        if (!header) return;
        Object.assign(this, header);
        if (header.period) {
            this.period = new Period(header.period);
        }
    }

    projectName = undefined;
    period = undefined;
    station = {};
    description = undefined;

    isValid = function () {
        return !!this.projectName && !!this.period && !!this.period.from && !!this.period.to
            && !!this.station && !!this.station.IDStation;
    }
}

export class Period {
    constructor(period) {
        Object.assign(this, period);
    }
    from;
    to;

    toString = function () {
        return `${this.from}. - ${this.to}.`;
    }

    getYears = function () {
        return Number(this.to) - Number(this.from) + 1;
    }
}


export class ProjectData {
    constructor(data) {
        if (!data) return;
        Object.assign(this, data);
    }

    meanTemp = []
    avgMaxTemp = []
    avgMinTemp = []
    absMaxTemp = []
    absMinTemp = []
    percipitation = []

    getYears = function () {
        const years = [];
        const props = ["meanTemp", "avgMaxTemp", "avgMinTemp", "absMaxTemp", "absMinTemp", "percipitation"];
        for (let prop of props) {
            for (let row of this[prop]) {

                const year = Number(row[0]);
                if (!isNaN(year) && (!years.includes(year))) {
                    if (year > 0) {
                        years.push(year);
                    }
                }
            }
        }
        years.sort();
        return years;
    }

    hasData = function (measure) {
        switch (measure?.toLowerCase()) {
            case "meantemp":
                return this.meanTemp && this.meanTemp.length > 0;
            case "avgmaxtemp":
                return this.avgMaxTemp && this.avgMaxTemp.length > 0;
            case "avgmintemp":
                return this.avgMinTemp && this.avgMinTemp.length > 0;
            case "absmaxtemp":
                return this.absMaxTemp && this.absMaxTemp.length > 0;
            case "absmintemp":
                return this.absMinTemp && this.absMinTemp.length > 0;
            case "percipitation":
                return this.percipitation && this.percipitation.length > 0;
            default:
                // console.log("hasdata");
                return (this.meanTemp && this.meanTemp.length > 0) ||
                    (this.avgMaxTemp && this.avgMaxTemp.length > 0) ||
                    (this.avgMinTemp && this.avgMinTemp.length > 0) ||
                    (this.absMaxTemp && this.absMaxTemp.length > 0) ||
                    (this.absMinTemp && this.absMinTemp.length > 0) ||
                    (this.percipitation && this.percipitation.length > 0);
        }
    }
}
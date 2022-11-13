export default class Project {

    constructor(project) {
        if (!project) return;
        // Object.assign(this, project);
        this.header = new ProjectHeader(this.header);
        this.data = new ProjectData(this.data);
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
            this.period = new Period(header.period.from, header.period.to);
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
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    from;
    to;

    getYears = function () {
        return this.to - this.from + 1;
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
                console.log("hasdata");
                return (this.meanTemp && this.meanTemp.length > 0) ||
                    (this.avgMaxTemp && this.avgMaxTemp.length > 0) ||
                    (this.avgMinTemp && this.avgMinTemp.length > 0) ||
                    (this.absMaxTemp && this.absMaxTemp.length > 0) ||
                    (this.absMinTemp && this.absMinTemp.length > 0) ||
                    (this.percipitation && this.percipitation.length > 0);
        }

    }
}
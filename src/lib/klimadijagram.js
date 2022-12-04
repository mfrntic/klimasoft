import moment from "moment";


CanvasRenderingContext2D.prototype.dashedLine = function (x1, y1, x2, y2, dashLen) {
    if (!dashLen) dashLen = 2;
    this.moveTo(x1, y1);

    let dX = x2 - x1;
    let dY = y2 - y1;
    let dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    let dashX = dX / dashes;
    let dashY = dY / dashes;

    let q = 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        this[q % 2 === 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    this[q % 2 === 0 ? 'moveTo' : 'lineTo'](x2, y2);
};

const KD = {
    version: "0.5.1",
    LineIntersection: function (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        let denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
        denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
        if (denominator === 0) {
            return result;
        }
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        // if we cast these lines infinitely in both directions, they intersect here:
        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));
        /*
                // it is worth noting that this should be the same as:
                x = line2StartX + (b * (line2EndX - line2StartX));
                y = line2StartX + (b * (line2EndY - line2StartY));
                */
        // if line1 is a segment and line2 is infinite, they intersect if:
        if (a > 0 && a < 1) {
            result.onLine1 = true;
        }
        // if line2 is a segment and line1 is infinite, they intersect if:
        if (b > 0 && b < 1) {
            result.onLine2 = true;
        }
        // if line1 and line2 are segments, they intersect if both of the above are true
        return result;
    },


    //---------------------------------------------------------------------------------------------- 
    //KLIMA DIJAGRAM
    //--------------------------------------------------------------------------------------------- 
    Diagram: function (canvas, options) {
        let default_options = {
            temp: null,
            perc: null,
            show_aridness: false,
            header_data: {
                station_name: "N/A",
                station_altitude: 0,
                yow_period: 0
            },
            total_perc: function () {
                let res = 0;
                for (let i = 0; i < this.perc.length; i++) {
                    res += this.perc[i];
                }
                return res;
            },
            avg_temp: function () {
                let res = 0;
                for (let i = 0; i < this.temp.length; i++) {
                    res += this.temp[i];
                }
                return Number((res / this.temp.length).toFixed(1));
            },
            avg_amp_temp: function () {
                let min = 100, max = 0;
                for (let i = 0; i < this.temp.length; i++) {
                    min = Math.min(min, this.temp[i]);
                    max = Math.max(max, this.temp[i]);
                }
                return Number((max - min).toFixed(1));
            },
            max_temp: function () {
                let max = 0;
                for (let i = 0; i < this.temp.length; i++) {
                    max = Math.max(max, this.temp[i]);
                }
                return Number(max);
            },
            min_temp: function () {
                let min = 100;
                for (let i = 0; i < this.temp.length; i++) {
                    min = Math.min(min, this.temp[i]);
                }
                return Number(min);
            },
            max_perc: function () {
                let max = 0;
                for (let i = 0; i < this.perc.length; i++) {
                    max = Math.max(max, this.perc[i]);
                }
                return Number(max);
            },
            cardinal_temp: {
                abs_min: -100,
                abs_max: 100,
                avg_min: 0,
                avg_max: 0
            },
            zero_temp_months: ["", "", "", "", "", "", "", "", "", "", "", ""],
            show_months: true,
            show_vegetation_period: true,
            show_cardinal_temp: true,
            vegetation_period: {
                start: 0,
                end: 0
            },
            show_outer_border: true,
            show_axis: true,
            show_axis_scales: true,
            margin_left: 45,
            margin_top: 20,
            interactive: false,
            negative_axis_threshold: [-3.5, -13.5],
            credits: "www.monachus-informatika.hr",
            show_credits: true,
            onready: function () {

            }
        };

        for (let p in default_options) {
            if (options.hasOwnProperty(p)) {
                if (p === "header_data" || p === "cardinal_temp" || p === "vegetation_period") {
                    for (let hd in default_options[p]) {
                        if (options[p].hasOwnProperty(hd)) {
                            default_options[p][hd] = options[p][hd];
                        }
                    }
                }
                else {
                    default_options[p] = options[p];
                }
            }
        }

        this.options = default_options;

        //canvas
        this._canvas = canvas;
        //opći parametri - margine
        let _margin_left = Math.round(this.options.margin_left * (this._canvas.clientWidth / 350.0));
        let _margin_top = Math.round(this.options.margin_top * (this._canvas.clientWidth / 350.0));

        if (_margin_left < 4 && this.options.show_axis) {
            _margin_left = 4;
        }

        //izračun drawing area
        this._drawingArea = null;
        this._mjesecWidthX = 0;
        this._dayPixels = this._mjesecWidthX * 12 / 365;
        this._y_height = 0;
        let _ctx = this._canvas.getContext("2d");

        let _patt_kd;
        let _patt_kd_1;
        this.isReady = false;
        let isReady1 = false, isReady2 = false;
        let kd = this;
        //pattern vertical lines
        let _i_patt_kd = new Image();
        _i_patt_kd.onload = function () {

            _patt_kd = _ctx.createPattern(_i_patt_kd, "repeat");
            isReady1 = true;
            kd.isReady = isReady1 && isReady2;
            if (kd.isReady) {
                //console.log("image loading", _i_patt_kd);
                kd.options.onready();
            }
        };
        _i_patt_kd.src = require("../lib/img/pkd.png");
        _i_patt_kd.width = 8;
        _i_patt_kd.height = 8;


        //pattern dotted
        let _i_patt_kd_1 = new Image();
        _i_patt_kd_1.onload = function () {

            _patt_kd_1 = _ctx.createPattern(_i_patt_kd_1, "repeat");
            isReady2 = true;
            kd.isReady = isReady1 && isReady2;
            if (kd.isReady) {
                //console.log("image loading", _i_patt_kd_1);
                kd.options.onready();
            }
        }
        _i_patt_kd_1.src = require("../lib/img/pkd_2.png");
        _i_patt_kd_1.width = 8;
        _i_patt_kd_1.height = 8;


        //odredi veg. period

        if (!(this.options.vegetation_period.start < this.options.vegetation_period.end)) {
            for (let i = 0; i < options.temp.length; i++) {

                if (this.options.temp[i] > 6) {
                    if (this.options.vegetation_period.start === 0) {
                        this.options.vegetation_period.start = i + 1;
                    }
                    this.options.vegetation_period.end = Math.max(this.options.vegetation_period.end, i + 1);
                }
            }
        }

        //Određuje da li postoji razdoblje suhoće na dijagramu
        this.hasAridnessPeriod = function () {
            let res = false;
            for (let i = 0; i < this.options.temp.length; i++) {
                if (this.options.temp[i] * 3 > this.options.perc[i]) {
                    res = true;
                    break;
                }
            }
            return res;
        }

        this.aridnessPeriodDuration = function () {
            let temp = this.options.temp;
            let perc = this.options.perc;

            let ipoints = [];

            //let cumMonthDays = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 365];

            for (let i = 0; i < temp.length; i++) {
                let p1 = {
                    x: i + 1.5,
                    y: perc[i] / 3
                };
                let p2 = {
                    x: i + 2.5,
                    y: perc[i + 1] / 3
                };
                let t1 = {
                    x: i + 1.5,
                    y: temp[i]
                }
                let t2 = {
                    x: i + 2.5,
                    y: temp[i + 1]
                }

                if (i === 0) {
                    p1.x = 1;
                    p2.x = 2.5;
                    t1.x = 1;
                    t2.x = 2.5;
                }
                if (i === 11) {
                    p1.x = 11.5;
                    p2.x = 13;
                    t1.x = 11.5;
                    t2.x = 13;
                }

                let res = KD.LineIntersection(p1.x, p1.y, p2.x, p2.y, t1.x, t1.y, t2.x, t2.y);
                if (res.onLine1 && res.onLine2) {
                    ipoints.push(res.x);
                }
            }

            let monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let be = [];
            if (temp[0] > perc[0] / 3) {
                be.push(1);
            }
            for (let i = 0; i < ipoints.length; i++) {
                //$.each(ipoints, function (i, o) {
                let o = ipoints[i];
                let m = Math.floor(o);
                let frac = o - m;
                let cumDays = 0;
                for (let j = 0; j < m; j++) {
                    cumDays += monthDays[j];
                }
                cumDays += monthDays[m] * frac;
                be.push(Math.round(cumDays));
            };

            if (temp[temp.length - 1] > perc[perc.length - 1] / 3) {
                be.push(365);
            }

            let tot_days = 0;
            let periods = [];
            for (let i = 0; i < be.length - 1; i++) {
                if (i % 2 === 0) {
                    let fdFrom = moment(new Date(2001, 0, 1)).add(be[i] - 1, "days");
                    let fdTo = moment(new Date(2001, 0, 1)).add(be[i + 1] - 1, "days");
                    tot_days += fdTo.diff(fdFrom, "days");
                    periods.push({
                        from: fdFrom.format("DD.MM."),
                        to: fdTo.format("DD.MM.")
                    });
                }
            }


            return {
                totalDays: tot_days,
                periods: periods,
                periodText: function () {
                    let text = "";
                    for (let i = 0; i < this.periods.length; i++) {
                        //$.each(this.periods, function (i, p) {
                        let p = this.periods[i];
                        text += p.from + " - " + p.to + "; ";
                    };
                    return text;
                }
            };
        }

        this.aridPeriodDuration = function () {
            let temp = this.options.temp;
            let perc = this.options.perc;

            let ipoints = [];

            //let cumMonthDays = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 365];

            for (let i = 0; i < temp.length; i++) {
                let p1 = {
                    x: i + 1.5,
                    y: perc[i] / 2
                };
                let p2 = {
                    x: i + 2.5,
                    y: perc[i + 1] / 2
                };
                let t1 = {
                    x: i + 1.5,
                    y: temp[i]
                }
                let t2 = {
                    x: i + 2.5,
                    y: temp[i + 1]
                }

                if (i === 0) {
                    p1.x = 1;
                    p2.x = 2.5;
                    t1.x = 1;
                    t2.x = 2.5;
                }
                if (i === 11) {
                    p1.x = 11.5;
                    p2.x = 13;
                    t1.x = 11.5;
                    t2.x = 13;
                }

                let res = KD.LineIntersection(p1.x, p1.y, p2.x, p2.y, t1.x, t1.y, t2.x, t2.y);
                if (res.onLine1 && res.onLine2) {
                    ipoints.push(res.x);
                }
            }

            let monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let be = [];
            if (temp[0] > perc[0] / 2) {
                be.push(1);
            }
            for (let i = 0; i < ipoints.length; i++) {
                //$.each(ipoints, function (i, o) {
                let o = ipoints[i];
                let m = Math.floor(o);
                let frac = o - m;
                let cumDays = 0;
                for (let j = 0; j < m; j++) {
                    cumDays += monthDays[j];
                }
                cumDays += monthDays[m] * frac;
                be.push(Math.round(cumDays));
            };

            if (temp[temp.length - 1] > perc[perc.length - 1] / 2) {
                be.push(365);
            }

            let tot_days = 0;
            let periods = [];
            for (let i = 0; i < be.length - 1; i++) {
                if (i % 2 === 0) {
                    let fdFrom = moment(new Date(2001, 0, 1)).add(be[i] - 1, "days");
                    let fdTo = moment(new Date(2001, 0, 1)).add(be[i + 1] - 1, "days");
                    tot_days += fdTo.diff(fdFrom, "days");
                    periods.push({
                        from: fdFrom.format("DD.MM."),
                        to: fdTo.format("DD.MM.")
                    });
                }
            }


            return {
                totalDays: tot_days,
                periods: periods,
                periodText: function () {
                    let text = "";
                    //$.each(this.periods, function (i, p) {
                    for (const p of this.periods) {
                        text += p.from + " - " + p.to + "; ";
                    }
                    return text;
                }
            };
        }

        this.draw = function () {

            let temp = this.options.temp;
            let perc = this.options.perc;
            let show_aridness = (this.options.show_aridness !== undefined ? this.options.show_aridness : false);

            let ctx = _ctx;

            //podesi ulazne parametre
            let perc_calc = [];
            for (let i = 0; i < perc.length; i++) {
                if (perc[i] <= 100) {
                    perc_calc.push(perc[i] / 2);
                }
                else {
                    perc_calc.push(50 + (perc[i] - 100) / 10);
                }
            }

            this.dr = {
                x: _margin_left,
                y: _margin_top,
                width: this._canvas.clientWidth - _margin_left * 2,
                height: this._canvas.clientHeight - (((this._canvas.clientWidth - _margin_left * 2) / 12) + _margin_top * 2),
                bottom: function () {
                    return this.y + this.height;
                },
                right: function () {
                    return this.x + this.width
                }
            };
            this._drawingArea = this.dr;

            //clear context
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);

            //outer border
            if (this.options.show_outer_border) {
                ctx.strokeRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
            }


            //inner border
            let mj_width = this.dr.width / 12;
            this._mjesecWidthX = mj_width;

            let x_axis = [];
            x_axis.push(this.dr.x);
            for (let i = 1; i < 11; i++) {
                x_axis.push(this.dr.x + (mj_width / 2) + mj_width * i);
            }
            x_axis.push(this.dr.right());


            let num_of_y_ticks = (7 + Math.ceil((this.options.max_perc() - 100) / 100));
            if (num_of_y_ticks === 7) {
                num_of_y_ticks++;
            }
            this._y_height = this.dr.height / num_of_y_ticks; //veličina osi je 10 tickova
            let y_tick = this._y_height / 10;

            //baza x osi (default je 0 (bottom), međutim ide u minus ovisno o temperaturi)
            let x_base = this.dr.bottom();
            let xBaseFactor = 0;
            if (this.options.min_temp() < this.options.negative_axis_threshold[1]) {
                x_base -= this._y_height * 2;
                xBaseFactor = this._y_height * 2;
            }
            else if (this.options.min_temp() < this.options.negative_axis_threshold[0]) {
                x_base -= this._y_height;
                xBaseFactor = this._y_height;
            }

            //razdoblje suhoće
            ctx.save();
            if (show_aridness) {
                ctx.beginPath();
                ctx.moveTo(this.dr.x, this.dr.bottom() - 50 * y_tick);
                for (let i = 0; i < x_axis.length; i++) {
                    ctx.lineTo(x_axis[i], x_base - (perc[i] / 3) * y_tick);
                }
                ctx.lineTo(x_axis[x_axis.length - 1], this.dr.bottom() - 50 * y_tick);
                ctx.closePath();
                ctx.clip();

                ctx.beginPath();
                ctx.moveTo(this.dr.x, this.dr.bottom());
                for (let i = 0; i < x_axis.length; i++) {
                    ctx.lineTo(x_axis[i], x_base - temp[i] * y_tick);
                }
                ctx.lineTo(x_axis[x_axis.length - 1], this.dr.bottom());
                ctx.closePath();
                ctx.clip();
                ctx.fillStyle = _patt_kd_1;
                ctx.fill();

                ctx.restore();
            }

            //temperatura i oborine - glavno
            ctx.beginPath();
            ctx.moveTo(this.dr.x, x_base - temp[0] * y_tick);

            for (let i = 0; i < x_axis.length; i++) {

                ctx.lineTo(x_axis[i], x_base - temp[i] * y_tick);
            }
            for (let i = x_axis.length; i >= 0; i--) {
                ctx.lineTo(x_axis[i], x_base - perc_calc[i] * y_tick);
            }
            ctx.closePath();
            ctx.lineWidth = 1;
            ctx.fillStyle = _patt_kd;
            ctx.fill();

            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.save();
            ctx.clip();

            //dodatni clip da neide ispod nule
            ctx.beginPath();
            ctx.rect(this.dr.x, this.dr.y, this.dr.width, this.dr.height);
            ctx.clip();

            //oborine - humidno razdoblje
            ctx.fillStyle = "black";
            ctx.fillRect(this.dr.x, this.dr.y, this.dr.width, this.dr.height - 50 * y_tick - xBaseFactor);

            //temperatura i oborine - aridno razdoblje
            ctx.beginPath();
            ctx.moveTo(this.dr.x, this.dr.bottom());
            for (let i = 0; i < x_axis.length; i++) {
                ctx.lineTo(x_axis[i], x_base - temp[i] * y_tick);
            }
            ctx.lineTo(x_axis[x_axis.length - 1], this.dr.bottom());
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();

            //razdoblje suhoće - crtkano
            ctx.restore();
            if (show_aridness) {
                for (let i = 0; i < x_axis.length - 1; i++) {
                    if (perc[i + 1] / 3 < temp[i + 1] || perc[i] / 3 < temp[i]) {
                        ctx.dashedLine(x_axis[i], x_base - perc[i] / 3 * y_tick, x_axis[i + 1], x_base - perc[i + 1] / 3 * y_tick, 5);
                    }
                }
                ctx.stroke();
            }

            let mrgHd = 14 * (this._canvas.clientWidth / 350.0);
            //ispisi teksta
            if (this._canvas.clientWidth > 150) {
                ctx.fillStyle = "black";
                let fntSzAxis = Math.round(10 * (this._canvas.clientWidth / 350.0));
                ctx.font = "italic " + fntSzAxis + "px Arial";

                let fntSzHeader = Math.round(14 * (this._canvas.clientWidth / 350.0));

                ctx.font = fntSzHeader + "px Arial";
                //header - lijevo
                ctx.fillText(this.options.header_data.station_name.toUpperCase() + " (" + this.options.header_data.station_altitude + ")", this.dr.x + mrgHd, this.dr.y + mrgHd * 2, this.dr.width * (this._canvas.clientWidth <= 200 ? 1 : 0.7));
                ctx.fillText("[" + this.options.header_data.yow_period + "]", this.dr.x + mrgHd, this.dr.y + mrgHd * 2 + fntSzHeader * 1.4);

                if (this._canvas.clientWidth > 200) {
                    //header - desno
                    ctx.textAlign = "end";
                    ctx.fillText(this.options.avg_temp().toFixed(1) + "°C", this.dr.right() - mrgHd, this.dr.y + mrgHd * 2);
                    ctx.fillText(this.options.total_perc().toFixed(0) + " mm", this.dr.right() - mrgHd, this.dr.y + mrgHd * 2 + fntSzHeader * 1.4);

                    if (this.options.show_cardinal_temp) {
                        //cardinal temp
                        ctx.textBaseline = "middle";
                        let fntSzCardinals = Math.round(12 * (this._canvas.clientWidth / 350.0));

                        ctx.font = fntSzCardinals + "px Arial";
                        if (this.options.cardinal_temp.abs_min !== null) {
                            ctx.fillText(this.options.cardinal_temp.abs_min.toFixed(1), this.dr.x - 8, this.dr.bottom() - this._y_height / 2);
                        }
                        if (this.options.cardinal_temp.avg_min !== null) {
                            ctx.fillText(this.options.cardinal_temp.avg_min.toFixed(1), this.dr.x - 8, this.dr.bottom() - (this._y_height * 1 + this._y_height / 2));
                        }
                        ctx.fillText(this.options.avg_amp_temp(), this.dr.x - 8, this.dr.bottom() - (this._y_height * 3));

                        if (this.options.cardinal_temp.avg_max !== null) {
                            ctx.fillText(this.options.cardinal_temp.avg_max.toFixed(1), this.dr.x - 8, this.dr.bottom() - (this._y_height * 4 + this._y_height / 2));
                        }
                        if (this.options.cardinal_temp.abs_max !== null) {
                            ctx.fillText(this.options.cardinal_temp.abs_max, this.dr.x - 8, this.dr.bottom() - (this._y_height * 5 + this._y_height / 2));
                        }
                        ctx.textBaseline = "alphabetic";
                    }
                    //skale (desno)
                    if (this.options.show_axis && this.options.show_axis_scales) {
                        let fntscale = 10 * (this._canvas.clientWidth / 350.0);
                        ctx.textAlign = "start";
                        ctx.textBaseline = "middle";
                        ctx.font = "italic " + fntscale + "px Arial";
                        ctx.fillText("°C", this.dr.right() + 5, this.dr.bottom() - (this._y_height * (num_of_y_ticks) - this._y_height / 3));
                        ctx.fillText("mm", this.dr.right() + 25, this.dr.bottom() - (this._y_height * (num_of_y_ticks) - this._y_height / 3));
                        //Skale
                        for (let i = 0; i <= num_of_y_ticks - 2; i++) {
                            if (i < 5) {
                                let faktorXbase = Math.abs(Math.round((x_base - this.dr.bottom()) / this._y_height) * 10);
                                //temp
                                ctx.fillText(i * 10 - faktorXbase, this.dr.right() + 5, this.dr.bottom() - this._y_height * i);
                            }

                            //oborine
                            let ob = i * 20;
                            if (i * 20 > 100) {
                                ob = (i - 4) * 100;
                            }
                            ctx.textAlign = "end";
                            ctx.fillText(ob, this.dr.right() + 38, x_base - this._y_height * i);
                            ctx.textAlign = "start";

                        }
                    }
                }
            }
            ctx.textAlign = "start";
            //zero temperature months
           
            if (this.options.zero_temp_months !== null) {
                ctx.globalAlpha = 0.65;
                for (let i = 0; i < this.options.zero_temp_months.length; i++) {
                    switch (this.options.zero_temp_months[i]) {
                        case "a":
                            ctx.fillStyle = "silver";
                            ctx.fillRect(this.dr.x + mj_width * i, this.dr.bottom(), mj_width, mj_width);
                            break;
                        case "s":
                            ctx.fillStyle = "black";
                            ctx.fillRect(this.dr.x + mj_width * i, this.dr.bottom(), mj_width, mj_width, 50);
                            break;
                        default:
                    }
                }
                ctx.globalAlpha = 1;

            }
            if (this._canvas.clientWidth > 150 && this.options.show_months && this.options.zero_temp_months !== null) {

                let mrgMths = 9 * (this._canvas.clientWidth / 350.0);
                let oldFont = ctx.font;
                ctx.font = mrgMths + "px Arial";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                for (let i = 0; i < 12; i++) {
                    ctx.fillStyle = "black";
                    switch (this.options.zero_temp_months[i]) {
                        case "s":
                            ctx.fillStyle = "white";
                            break;
                        default:
                            ctx.fillStyle = "black";
                            break;

                    }
                    ctx.fillText(i + 1, this.dr.x + mj_width * i + mj_width / 2, this.dr.bottom() + mj_width / 2);
                }
                ctx.textBaseline = "alphabetic";
                ctx.textAlign = "start";
                ctx.font = oldFont;
                //ctx.fillText(i, this.dr.x + mj_width * i, this.dr.bottom());         
            };

            //inner border - axis
            if (this.options.show_axis) {
                //okvir (osi)
                if (this._canvas.clientWidth > 200) {
                    ctx.lineWidth = 2;
                }
                else {
                    ctx.lineWidth = 1;
                }
                ctx.beginPath();

                //lijevi (y1), desni(y2) i gornji okvir
                ctx.moveTo(this.dr.x, this.dr.bottom());
                ctx.lineTo(this.dr.x, this.dr.y);
                ctx.lineTo(this.dr.right(), this.dr.y);
                ctx.lineTo(this.dr.right(), this.dr.bottom());
                ctx.lineTo(this.dr.x, this.dr.bottom());
                //x os
                if (x_base !== this.dr.bottom()) {
                    ctx.moveTo(this.dr.x, x_base);
                    ctx.lineTo(this.dr.right(), x_base);
                    ctx.stroke();
                }
                //x axis ticks - mjeseci
                for (let mj = 0; mj <= 12; mj++) {
                    ctx.moveTo(this.dr.x + mj_width * mj, x_base);
                    ctx.lineTo(this.dr.x + mj_width * mj, x_base + 5);
                }

                //y axis ticks
                for (let y = 0; y <= 10; y++) {
                    //y1 - perc
                    ctx.moveTo(this.dr.x, this.dr.bottom() - this._y_height * y);
                    ctx.lineTo(this.dr.x + 5, this.dr.bottom() - this._y_height * y);
                    //y2 - temp
                    ctx.moveTo(this.dr.right(), this.dr.bottom() - this._y_height * y);
                    ctx.lineTo(this.dr.right() - 5, this.dr.bottom() - this._y_height * y);
                }
                ctx.stroke();

            }

            //vegetation period
            ctx.fillStyle = "green";
            if (this.options.show_vegetation_period) {
                ctx.fillRect(this.dr.x + (this.options.vegetation_period.start - 1) * mj_width, x_base - (mrgHd + 3), (this.options.vegetation_period.end - this.options.vegetation_period.start + 1) * mj_width, mrgHd);
            }

            ctx.restore();

            if (this.options.show_credits) {
                ctx.fillStyle = "blue";
                ctx.textAlign = "center";
                ctx.textBaseline = "alphabetic";
                ctx.fillText(this.options.credits, this._canvas.clientWidth / 2, this._canvas.clientHeight - 6);
                ctx.textBaseline = "alphabetic";
                ctx.textAlign = "start";
            }
            ctx.fillStyle = "black";

            if (this.options.interactive) {
                //on mouse move (za tooltip)
                let lbl = document.createElement("canvas");
                lbl.width = 160;
                lbl.height = 25;
                lbl.style.position = "absolute";
                const lblCtx = lbl.getContext("2d");

                document.body.appendChild(lbl);

                this.dr = this._drawingArea;
                this._canvas.onmousemove = function (e) {
                    if (this.dr === null) {
                        return;
                    }
                    let r = this.getBoundingClientRect();
                    let imgd = _ctx.getImageData(e.clientX - r.left, e.clientY - r.top, 1, 1);
                    if (!(imgd.data[0] === 255 && imgd.data[1] === 255 && imgd.data[2] === 255)) {
                        let client_x = e.clientX - r.left - this.dr.x;
                        let client_y = Math.round(this.dr.bottom() - (e.clientY - r.top));

                        this.lblCtx.fillStyle = "lemonchiffon";
                        lblCtx.fillRect(0, 0, lbl.width, lbl.height);
                        lblCtx.fillStyle = "black";
                        lblCtx.strokeRect(0, 0, lbl.width, lbl.height);
                        lblCtx.textBaseline = "middle";
                        lblCtx.textAlign = "center";

                        //let text = client_x + "; " + client_y;
                        //let text = imgd.data[0] + ", " + imgd.data[1] + ", " + imgd.data[2];
                        let text = "";

                        if (client_x > 10 && client_x < this.dr.right() - this.dr.x
                            && client_y > 0 && client_y < this.dr.bottom() - this.dr.y - 50) {

                            if (client_y > 225) {
                                if (imgd.data[0] < 15 && imgd.data[1] < 15 && imgd.data[2] < 15) {
                                    text = "Humidno (vlažno) razdoblje";
                                }
                            }
                            else if (imgd.data[0] === 255 && imgd.data[1] === 0 && imgd.data[2] === 0) {
                                text = "Aridno (sušno) razdoblje";
                            }
                            else if (imgd.data[0] === 235 && imgd.data[1] === 254 && imgd.data[2] === 19) {
                                text = "Razdoblje suhoće";
                            }
                            else if (imgd.data[0] === 0 && imgd.data[1] === 128 && imgd.data[2] === 0) {
                                text = "Vegetacijski period";
                            }
                        }
                        else if (client_x > 0 && client_x < this.dr.right() - this.dr.x
                            && client_y < 0 && client_y > -this._mjesecWidthX) {
                            //alert(imgd.data[0] + ", " + imgd.data[1] + ", " + imgd.data[2] + ", ");
                            //ispod osi - kvadratići
                            if ((imgd.data[0] === 90 && imgd.data[1] === 90 && imgd.data[2] === 90)) {
                                text = "Sr. min. temp. < 0";
                            }
                            else if (imgd.data[0] === 214 && imgd.data[1] === 214 && imgd.data[2] === 214) {
                                text = "Aps. min. temp. < 0";
                            }
                        }
                        else if (client_x < -5) {
                            //kardinalne temp.
                            if (client_y > 0 && client_y <= this._y_height) {
                                text = "Apsolutna min. temperatura";
                            }
                            else if (client_y > this._y_height && client_y <= this._y_height * 2) {
                                text = "Srednja min. temperatura";
                            }
                            else if (client_y > this._y_height * 2 && client_y <= this._y_height * 4) {
                                text = "Srednje kolebanje temperature";
                            }
                            else if (client_y > this._y_height * 4 && client_y <= this._y_height * 5) {
                                text = "Srednja max. temperatura";
                            }
                            else if (client_y > this._y_height * 5 && client_y <= this._y_height * 6) {
                                text = "Apsolutna max. temperatura";
                            }
                        }
                        //PRIKAZ TOOLTIPA
                        if (text.length > 0) {
                            lblCtx.fillText(text, lbl.width / 2, lbl.height / 2);
                            lbl.style.left = (e.clientX + 1) + "px";
                            lbl.style.top = (e.clientY - lbl.height - 1) + "px";
                        }
                        else {
                            lbl.style.left = "-200px";
                        }
                    }
                    else {
                        lbl.style.left = "-200px";
                    }
                }
            }
        }

        this.toImage = function (returnType) {
            let dataURL = this._canvas.toDataURL("image/png");
            let ua = window.navigator.userAgent;
            switch (returnType) {
                case "dataurl":
                    return dataURL;
                case "imagedata":
                    return _ctx.getImageData(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
                case 'obj':
                    let imgObj = new Image();
                    imgObj.src = dataURL;
                    document.getElementById('graphics').appendChild(imgObj);
                    break;
                case 'window':
                    window.open(dataURL, "Canvas Image");
                    break;
                case 'download':
                    if (ua.indexOf("Chrome") > 0) {
                        let link = document.createElement('a');
                        link.setAttribute("download", this.options.header_data.station_name + ".png");
                        link.innerText = "Spremanje";
                        link.href = this._canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                        link.click();
                    }
                    else {
                        console.warn("Download from client side is avialable only in Chrome. Please use Chrome!");
                    }
                    break;
                default:
                    return dataURL;
            }
        }
    },


    //---------------------------------------------------------------------------------------------- 
    //KLIMATOGRAM
    //--------------------------------------------------------------------------------------------- 
    Klimatogram: function (canvas, options) {
        let default_options = {
            //header_data: {
            //    station_name: "N/A",
            //    station_altitude: 0,
            //},
            header_data: null,
            data: [{
                year: null, //scalar
                temp: null, //array
                perc: null, //array
                cardinal_temp: {
                    abs_min: -100,
                    abs_max: 100,
                    avg_min: 0,
                    avg_max: 0
                },
                zero_temp_months: ["", "", "", "", "", "", "", "", "", "", "", ""],
                show_cardinal_temp: true,

            }],
            years_in_row: 5,
            onready: function () {

            },
            negative_axis_threshold: [-3.5, -13.5],
            show_cardinal_temp: true,
            show_axis_scales: true,
            show_aridness: false,
            show_months: true,
            margin_left: 20,
            margin_top: 20,
            limited: false
        };
        for (let p in default_options) {
            if (options.hasOwnProperty(p)) {
                if (p === "cardinal_temp") {
                    for (let hd in default_options[p]) {
                        if (options[p].hasOwnProperty(hd)) {
                            default_options[p][hd] = options[p][hd];
                        }
                    }
                }
                else {
                    default_options[p] = options[p];
                }
            }
        }

        for (let i = 0; i < default_options.data.length; i++) {
            default_options.data[i].total_perc = function () {
                let res = 0;
                for (let i = 0; i < this.perc.length; i++) {
                    res += this.perc[i];
                }
                return res;
            };

            default_options.data[i].avg_temp = function () {
                let res = 0;
                for (let i = 0; i < this.temp.length; i++) {
                    res += this.temp[i];
                }
                return Number((res / this.temp.length).toFixed(1));
            };

            default_options.data[i].avg_amp_temp = function () {
                let min = 100, max = 0;
                for (let i = 0; i < this.temp.length; i++) {
                    min = Math.min(min, this.temp[i]);
                    max = Math.max(max, this.temp[i]);
                }
                return Number((max - min).toFixed(1));
            };

        }
        this.options = default_options;

        //opći parametri - margine
        let isDrawn = false;
        this._canvas = canvas;
        if (this._canvas === null) {
            return;
        }

        let _margin_left = Math.round(this.options.margin_left * (this._canvas.clientWidth / 750.0));
        let _margin_top = Math.round(this.options.margin_top * (this._canvas.clientWidth / 750.0));

        let rows = Math.ceil(this.options.data.length / this.options.years_in_row);


        //klimatogram dimensions 
        let kg_width = (this._canvas.clientWidth - 80) / this.options.years_in_row,
            kg_height = kg_width * 1.5;
        let footerHeight = 60 * (kg_width / 165);
        this._canvas.height = 20 + rows * (kg_height + footerHeight) + 2 * _margin_top;
        // let _ctx = this._canvas.getContext("2d");


        //if (_margin_left < 4 && this.options.show_axis) {
        //    _margin_left = 4;
        //}

        //izračun drawing area
        this._drawingArea = null;
        this._mjesecWidthX = 0;
        this._y_height = 0;
        let _ctx = this._canvas.getContext("2d");

        let _patt_kd;
        let _patt_kd_1;
        this.isReady = false;
        let isReady1 = false, isReady2 = false;
        let kd = this;
        //pattern vertical lines

        let _i_patt_kd = new Image();
        _i_patt_kd.onload = function () {

            _patt_kd = _ctx.createPattern(_i_patt_kd, "repeat");
            isReady1 = true;
            kd.isReady = isReady1 && isReady2;
            if (kd.isReady) {
                //console.log("image loading", _i_patt_kd);
                kd.options.onready();
            }
        };
        _i_patt_kd.src = require("../lib/img/pkd.png");
        _i_patt_kd.width = 8;
        _i_patt_kd.height = 8;


        //pattern dotted
        let _i_patt_kd_1 = new Image();
        _i_patt_kd_1.onload = function () {

            _patt_kd_1 = _ctx.createPattern(_i_patt_kd_1, "repeat");
            isReady2 = true;
            kd.isReady = isReady1 && isReady2;
            if (kd.isReady) {
                //console.log("image loading", _i_patt_kd_1);
                kd.options.onready();
            }
        }
        _i_patt_kd_1.src = require("../lib/img/pkd_2.png");
        _i_patt_kd_1.width = 8;
        _i_patt_kd_1.height = 8;

        //Određuje da li postoji razdoblje suhoće na dijagramu
        this.hasAridnessPeriod = function () {
            let res = false;
            for (let i = 0; i < options.data; i++) {
                //$.each(options.data, function (i, o) {
                let o = options.data[i];
                for (let j = 0; j < o.temp.length; j++) {
                    res = o.temp[i] * 3 > o.perc[i];
                    break;
                }
                if (res) {
                    return false;
                }
            };
            return res;
        }

        //----------------------------------------
        //DRAW KLIMATOGRAM
        //----------------------------------------
        this.draw = function () {
            this.options.years_in_row = Number(this.options.years_in_row);
            rows = Math.ceil(this.options.data.length / this.options.years_in_row);
            kg_width = (this._canvas.clientWidth - 80) / this.options.years_in_row;
            kg_height = kg_width * 1.5;
            footerHeight = 60 * (kg_width / 165);
            this._canvas.height = 20 + rows * (kg_height + footerHeight) + 2 * _margin_top;
            //clear context
            _ctx.fillStyle = "white";
            _ctx.fillRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
            //recalc data
            let perc = [];
            let perc_orig = [];
            let temp = [];

            for (let h = 0; h < rows; h++) {

                perc_orig[h] = [];
                perc[h] = [];
                temp[h] = [];

                for (let k = h * this.options.years_in_row; k < h * this.options.years_in_row + this.options.years_in_row; k++) {
                    if (k >= this.options.data.length)
                        break;
                    //data element
                    let o = this.options.data[k];
                    //temperature
                    temp[h] = temp[h].concat(o.temp);
                    perc_orig[h] = perc_orig[h].concat(o.perc);

                    // $.merge(temp[h], o.temp);
                    // $.merge(perc_orig[h], o.perc);
                    //izračunaj percipitation
                    let perc_calc = [];
                    for (let i = 0; i < o.perc.length; i++) {
                        if (o.perc[i] <= 100) {
                            perc_calc.push(o.perc[i] / 2);
                        }
                        else {
                            perc_calc.push(50 + (o.perc[i] - 100) / 10);
                        }
                    }
                    // $.merge(perc[h], perc_calc);
                    perc[h] = perc[h].concat(perc_calc);
                }
            }

            let ctx = _ctx;
            let ml = _margin_left, mt = _margin_top;

            //number of y ticks (y scale)
            let maxperc = 0;
            //$.each(perc, function (i, o) {
            for (const o of perc) {
                maxperc = Math.max(maxperc, ...o.filter(a => !isNaN(a)));
            }


            let num_of_y_ticks = (8 + Math.ceil((maxperc - 100) / 100));
            if (num_of_y_ticks === 8) {
                num_of_y_ticks++;
            }

            let minTemp = 100;
            //$.each(temp, function (i, o) {
            for (const o of temp) {
                minTemp = Math.min(minTemp, Math.min.apply(null, o));
            }
            let xBaseType = "D"; //default --> this.dr.bottom() = 0
            if (minTemp < this.options.negative_axis_threshold[1]) {
                xBaseType = "T2";
            }
            else if (minTemp < this.options.negative_axis_threshold[0]) {
                xBaseType = "T1";
            }

            for (let j = 0; j < temp.length; j++) {

                //calc drawing area
                this.dr = {
                    x: ml,
                    y: mt + j * (kg_height + footerHeight) + 20,
                    width: kg_width * (temp[j].length / 12),
                    height: kg_height,
                    bottom: function () {
                        return this.y + this.height;
                    },
                    right: function () {
                        return this.x + this.width
                    }
                };

                if (temp.length - 1 === j && temp[j].length / 12 < this.options.years_in_row) {
                    this.dr.width = kg_width * (temp[j].length / 12);
                }
                //this._drawingArea = this.dr;

                //outer border
                //if (this.options.show_outer_border) {
                //ctx.strokeRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
                //}

                //dužina jednog mjeseca na skali
                let mj_width = this.dr.width / temp[j].length;
                this._mjesecWidthX = mj_width;

                let x_axis = [];
                x_axis.push(this.dr.x);
                for (let i = 1; i < temp[j].length - 1; i++) {
                    if (i % 12 === 0) {
                        x_axis.push(this.dr.x + mj_width * i);
                    }
                    else {
                        x_axis.push(this.dr.x + (mj_width / 2) + mj_width * i);
                    }
                }
                x_axis.push(this.dr.right());


                this._y_height = this.dr.height / num_of_y_ticks; //veličina osi je 10 tickova
                let y_tick = this._y_height / 10;


                //baza x osi (default je 0 (bottom), međutim ide u minus ovisno o temperaturi)
                let x_base = this.dr.bottom();
                let xBaseFactor = 0;
                switch (xBaseType) {
                    case "T1":
                        x_base -= this._y_height;
                        xBaseFactor = this._y_height;
                        break;
                    case "T2":
                        x_base -= this._y_height * 2;
                        xBaseFactor = this._y_height * 2;
                        break;
                    default:
                }

                //razdoblje suhoće
                ctx.save();
                let show_aridness = (this.options.show_aridness !== undefined ? this.options.show_aridness : false);
                if (show_aridness) {
                    ctx.beginPath();
                    ctx.moveTo(this.dr.x, this.dr.bottom() - 50 * y_tick);
                    for (let i = 0; i < x_axis.length; i++) {
                        ctx.lineTo(x_axis[i], x_base - (perc_orig[j][i] / 3) * y_tick);
                    }
                    ctx.lineTo(x_axis[x_axis.length - 1], this.dr.bottom() - 50 * y_tick);
                    ctx.closePath();
                    ctx.clip();

                    ctx.beginPath();
                    ctx.moveTo(this.dr.x, this.dr.bottom());
                    for (let i = 0; i < x_axis.length - 1; i++) {
                        ctx.lineTo(x_axis[i], x_base - temp[j][i] * y_tick);
                    }
                    ctx.lineTo(x_axis[x_axis.length - 1], this.dr.bottom());
                    ctx.closePath();
                    ctx.clip();
                    ctx.fillStyle = _patt_kd_1;
                    ctx.fill();

                    ctx.restore();
                }

                //dodatni clip da neide ispod nule
                ctx.save();
                ctx.beginPath();
                ctx.rect(this.dr.x, this.dr.y, this.dr.width, this.dr.height);
                ctx.clip();


                //temperatura i oborine - glavno
                ctx.beginPath();
                ctx.moveTo(this.dr.x, x_base - temp[j][0] * y_tick);

                for (let i = 0; i < x_axis.length; i++) {
                    ctx.lineTo(x_axis[i], x_base - temp[j][i] * y_tick);
                }

                for (let i = x_axis.length; i >= 0; i--) {
                    ctx.lineTo(x_axis[i], x_base - perc[j][i] * y_tick);
                }
                ctx.closePath();
                ctx.lineWidth = 1;
                ctx.fillStyle = _patt_kd;
                ctx.fill();

                ctx.strokeStyle = "black";
                ctx.stroke();
                ctx.save();
                ctx.clip();


                //oborine - humidno razdoblje
                ctx.fillStyle = "black";
                ctx.fillRect(this.dr.x, this.dr.y, this.dr.width, this.dr.height - 50 * y_tick - xBaseFactor);

                //temperatura i oborine - aridno razdoblje
                ctx.beginPath();
                ctx.moveTo(this.dr.x, this.dr.bottom());
                for (let i = 0; i < x_axis.length; i++) {
                    ctx.lineTo(x_axis[i], x_base - temp[j][i] * y_tick);
                }
                ctx.lineTo(x_axis[x_axis.length - 1], this.dr.bottom());
                ctx.closePath();
                ctx.fillStyle = "red";
                ctx.fill();

                //razdoblje suhoće - crtkano
                ctx.restore();
                if (show_aridness) {
                    for (let i = 0; i < x_axis.length - 1; i++) {
                        if (perc_orig[j][i + 1] / 3 < temp[j][i + 1] || perc_orig[j][i] / 3 < temp[j][i]) {
                            ctx.dashedLine(x_axis[i], x_base - perc_orig[j][i] / 3 * y_tick, x_axis[i + 1], x_base - perc_orig[j][i + 1] / 3 * y_tick, 5);
                        }
                    }
                    ctx.stroke();
                }

                ctx.restore();

                //inner border - axis
                //if (this.options.show_axis) {
                //okvir (osi)
                ctx.lineWidth = 1;

                //okvir - oko svega
                ctx.strokeRect(this.dr.x, this.dr.y, this.dr.width, this.dr.height + footerHeight);
                //y osi za svaku godinu
                for (let r = 0; r < this.options.years_in_row; r++) {
                    if (this.dr.x + mj_width * 12 * r < this.dr.width) {
                        ctx.moveTo(this.dr.x + mj_width * 12 * r, this.dr.y);
                        ctx.lineTo(this.dr.x + mj_width * 12 * r, this.dr.bottom() + footerHeight)

                        ////y axis ticks
                        for (let y = 1; y < num_of_y_ticks; y++) {
                            //y1 - perc
                            ctx.moveTo(this.dr.x + mj_width * 12 * r, this.dr.bottom() - this._y_height * y);
                            ctx.lineTo(this.dr.x + mj_width * 12 * r + 2, this.dr.bottom() - this._y_height * y);
                            //y2 - temp
                            ctx.moveTo(this.dr.x + mj_width * 12 * r + kg_width, this.dr.bottom() - this._y_height * y);
                            ctx.lineTo(this.dr.x + mj_width * 12 * r + kg_width - 2, this.dr.bottom() - this._y_height * y);
                        }
                    }
                }
                ctx.stroke();
                //obriši crtu viška koja mi se ne sviđa i za koju ne znam kako je nastala
                //for (let r = 0; r < this.options.years_in_row; r++) {
                //    ctx.clearRect(this.dr.x + mj_width * 12 * r + 1, this.dr.bottom() - 2, kg_width - 2, 4);
                //}
                ctx.beginPath();

                //x os
                if (x_base !== this.dr.bottom()) {
                    ctx.moveTo(this.dr.x, x_base);
                    ctx.lineTo(this.dr.right(), x_base);
                    ctx.stroke();
                }
                //x axis ticks - mjeseci
                for (let mj = 0; mj < temp[j].length; mj++) {
                    ctx.moveTo(this.dr.x + mj_width * mj, x_base);
                    ctx.lineTo(this.dr.x + mj_width * mj, x_base + 3);
                }

                ctx.stroke();

                //TEKSTOVI
                let mrgHd = 12 * (kg_width / 180.0);
                ////ispisi teksta
                //ctx.fillStyle = "black";
                let fntSzHeader = Math.round(12 * kg_width / 180.0);
                //header - lijevo
                for (let r = 0; r < this.options.years_in_row; r++) {
                    if (this.dr.x + mj_width * 12 * r < this.dr.width) {
                        ctx.font = "bold " + fntSzHeader + "px Arial";
                        ctx.textAlign = "start";
                        //godina
                        ctx.fillStyle = "black";
                        ctx.fillText(this.options.data[j * this.options.years_in_row + r].year + ".", this.dr.x + mj_width * 12 * r + mrgHd, this.dr.y + mrgHd * 1.7, this.dr.width * (kg_width <= 200 ? 1 : 0.7));
                        //header - desno
                        ctx.font = fntSzHeader + "px Arial";
                        ctx.textAlign = "end";
                        ctx.fillText(this.options.data[j * this.options.years_in_row + r].avg_temp().toFixed(1), this.dr.x + mj_width * 12 * r + kg_width - mrgHd, this.dr.y + mrgHd * 2);
                        ctx.fillText(this.options.data[j * this.options.years_in_row + r].total_perc().toFixed(0), this.dr.x + mj_width * 12 * r + kg_width - mrgHd, this.dr.y + mrgHd * 2 + fntSzHeader * 1.4);
                        //cardinal temp
                        if (this.options.show_cardinal_temp) {
                            let cardTemp = this.options.data[j * this.options.years_in_row + r].cardinal_temp;
                            if (cardTemp !== null && cardTemp !== undefined) {
                                ctx.textAlign = "start";
                                if (cardTemp.abs_max !== null) {
                                    ctx.fillText(cardTemp.abs_max?.toFixed(1), this.dr.x + mj_width * 12 * r + mrgHd, this.dr.bottom() + mrgHd * 2.4);
                                }
                                if (cardTemp.avg_max !== null) {
                                    ctx.fillText(cardTemp.avg_max?.toFixed(1), this.dr.x + mj_width * 12 * r + mrgHd, this.dr.bottom() + mrgHd * 4.2);
                                }
                                ctx.textAlign = "end";
                                if (cardTemp.avg_min !== null) {
                                    ctx.fillText(cardTemp.avg_min?.toFixed(1), this.dr.x + kg_width + mj_width * 12 * r - mrgHd, this.dr.bottom() + mrgHd * 2.4);
                                }
                                if (cardTemp.abs_min !== null) {
                                    ctx.fillText(cardTemp.abs_min?.toFixed(1), this.dr.x + kg_width + mj_width * 12 * r - mrgHd, this.dr.bottom() + mrgHd * 4.2);
                                }
                            }
                            ctx.textAlign = "center";
                            ctx.fillText(this.options.data[j * this.options.years_in_row + r].avg_amp_temp().toFixed(1), this.dr.x + kg_width / 2 + mj_width * 12 * r, this.dr.bottom() + mrgHd * 3.3);
                        }
                        //zero temperature months
                        ctx.globalAlpha = 0.65;
                        let ztm = this.options.data[j * this.options.years_in_row + r].zero_temp_months;
                        if (ztm !== null) {
                            for (let i = 0; i < ztm.length; i++) {
                                switch (ztm[i]) {
                                    case "a":
                                        ctx.fillStyle = "silver";
                                        ctx.fillRect(this.dr.x + kg_width * r + mj_width * i, this.dr.bottom(), mj_width, mj_width);
                                        break;
                                    case "s":
                                        ctx.fillStyle = "black";

                                        ctx.fillRect(this.dr.x + kg_width * r + mj_width * i, this.dr.bottom(), mj_width, mj_width, 50);
                                        break;
                                    default:
                                }
                            }
                        }
                        ctx.globalAlpha = 1;

                        if (this._canvas.clientWidth > 400 && this.options.show_months) {
                            let mrgMths = 8 * (this._canvas.clientWidth / 1100.0);
                            ctx.font = mrgMths + "px Arial";
                            ctx.textBaseline = "middle";
                            ctx.textAlign = "center";
                            for (let i = 0; i < 12; i++) {
                                ctx.fillStyle = "black";
                                if (this.options.data[j * this.options.years_in_row + r].zero_temp_months !== null) {
                                    if (this.options.data[j * this.options.years_in_row + r].zero_temp_months[i] === "s") {
                                        ctx.fillStyle = "white";
                                    }
                                }
                                ctx.fillText(i + 1, this.dr.x + kg_width * r + mj_width * i + mj_width / 2, this.dr.bottom() + mj_width / 2);
                            }
                            ctx.textBaseline = "alphabetic";
                            ctx.textAlign = "start";
                        }
                    }
                }
                if (this.options.show_axis_scales) {
                    let fntscale = 9 * (kg_width / 140.0);
                    if (fntscale > 12)
                        fntscale = 12;
                    ctx.textAlign = "start";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "black";
                    ctx.font = "italic " + fntscale + "px Arial";
                    ctx.fillText("°C", this.dr.right() + 5, this.dr.bottom() - (this._y_height * (num_of_y_ticks) - this._y_height / 2));
                    ctx.fillText("mm", this.dr.right() + 25, this.dr.bottom() - (this._y_height * (num_of_y_ticks) - this._y_height / 2));
                    //Skale
                    for (let i = 0; i <= num_of_y_ticks - 2; i++) {
                        if (i < 5) {
                            let faktorXbase = Math.abs(Math.round((x_base - this.dr.bottom()) / this._y_height) * 10);
                            //temp
                            ctx.fillText(i * 10 - faktorXbase, this.dr.right() + 5, this.dr.bottom() - this._y_height * i);
                        }

                        //oborine
                        if (x_base - this._y_height * i > this.dr.y + this._y_height + 2) {
                            let ob = i * 20;
                            if (i * 20 > 100) {
                                ob = (i - 4) * 100;
                            }
                            ctx.textAlign = "end";
                            ctx.fillText(ob, this.dr.right() + 38, x_base - this._y_height * i);
                            ctx.textAlign = "start";
                        }
                    }
                }
                isDrawn = true;
            }
        }

        this.toImage = function (returnType) {
            let dataURL = this._canvas.toDataURL("image/png");
            let ua = window.navigator.userAgent;
            switch (returnType) {
                case "dataurl":
                    return dataURL;
                case "imagedata":
                    return _ctx.getImageData(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
                case 'obj':
                    let imgObj = new Image();
                    imgObj.src = dataURL;
                    document.getElementById('graphics').appendChild(imgObj);
                    break;
                case 'window':
                    window.open(dataURL, "Canvas Image");
                    break;
                case 'download':
                    if (ua.indexOf("Chrome") > 0) {
                        let link = document.createElement('a');
                        link.setAttribute("download", this.options.header_data.station_name + ".png");
                        link.innerText = "Spremanje";
                        link.href = this._canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                        link.click();
                    }
                    else {
                        console.warn("Download from client side is avialable only in Chrome. Please use Chrome!");
                    }
                    break;
                default:
                    return dataURL;
            }
        }

        if (isDrawn && this.options.header_data !== null) {
            this.ctx.fillStyle = "black";
            //Naslov
            this.ctx.font = "bold 12pt Arial";
            this.ctx.fillText(this.options.header_data.station_name.toUpperCase() + " (" + this.options.header_data.station_altitude + ")", this.dr.x, 30)
        }
    }
};

export default KD;
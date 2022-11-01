const WD = {
    version: "0.1.0",
    Diagram: function (canvas, options) {
        let default_options = {
            labels: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
            wind_data: {
                frequency: [],
                avg_wind_speed: [],
                max_wind_speed: [],
                C: 0
            },
            header_data: {
                title: "",
                station_name: "N/A",
                yow_period: "",
                description: ""
            },
            show_outer_border: true,
            show_calm_time: true,
            show_legend: true,

            margin_left: 20,
            margin_top: 20,
            credits: "www.monachus-informatika.hr",
            show_credits: true,
            onready: function () {

            }
        };

        for (let p in default_options) {
            if (options.hasOwnProperty(p)) {
                if (p === "header_data" || p === "wind_data") {
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


        //izračun drawing area
        this._drawingArea = null;

        let _ctx = this._canvas.getContext("2d");

        //obriši dijagram
        this.clear = function () {
            let ctx = _ctx;
            //clear context
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
        };

        let drawPieSlice = function (ctx, centerX, centerY, radius, startAngle, endAngle, color, gutter) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle + gutter, endAngle - gutter);
            ctx.closePath();
            ctx.fill();
        };

        this.draw = function () {

            let ctx = _ctx;

            //font scale faktor
            let font_scale_factor = this._canvas.clientWidth / 400;


            let hheight = 0;
            if (this.options.header_data.title) {
                hheight = 30 * font_scale_factor;
            }

            //podesi ulazne parametre
            const dr = {
                x: _margin_left,
                y: _margin_top,
                width: this._canvas.clientWidth - _margin_left * 2,
                height: this._canvas.clientHeight - _margin_top * 2 - hheight,
                bottom: _margin_top + (this._canvas.clientHeight - _margin_top * 2 - hheight),
                right: this._canvas.clientWidth - _margin_left,
                centerX: _margin_left + (this._canvas.clientWidth - _margin_left * 2) / 2,
                centerY: _margin_top + (this._canvas.clientHeight - _margin_top * 2) / 2 + hheight / 2,
                radius: (this._canvas.clientHeight - _margin_top * 2 - hheight) / 2
            };
            this._drawingArea = dr;

            //clear context
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);

            //outer border
            if (this.options.show_outer_border) {
                ctx.strokeRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
            }

            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            //naslov
            if (hheight) {
                ctx.textBaseline = "top";
                ctx.font = "normal " + (10 * font_scale_factor).toFixed(2) + "pt Arial";
                ctx.fillText(this.options.header_data.title, dr.centerX, 10 * font_scale_factor);
            }
            ctx.textBaseline = "middle";

            //clip
            ctx.beginPath();
            ctx.arc(dr.centerX, dr.centerY, dr.radius + 1, 0, 2 * Math.PI);
            ctx.save();
            ctx.clip();

            //draw circle
            let crad = dr.radius;
            ctx.strokeStyle = "#D8D8D8";

            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(dr.centerX, dr.centerY, crad, 0, 2 * Math.PI);
                crad -= dr.radius * 0.2;
                ctx.stroke();
                //skala
            }
            //draw lines
            ctx.translate(dr.centerX, dr.centerY);

            let cw = this._canvas.clientWidth;
            let ch = this._canvas.clientHeight;
            for (let i = 0; i < this.options.labels.length; i++) {
                //$.each(this.options.labels, function (i, l) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(cw, ch);
                ctx.stroke();
                ctx.rotate(0.25 * Math.PI);

            }
            ctx.restore();

            ctx.fillStyle = "black";

            //calc. max. frequency
            let fmax = Math.max.apply(Math, this.options.wind_data.frequency);

            //labele - nazivi vjetrova
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.font = "bold " + (9 * font_scale_factor).toFixed(2) + "pt Arial";
            for (let i = 0; i < this.options.labels.length; i++) {
                //$.each(this.options.labels, function (i, l) {
                let l = this.options.labels[i];
                let x = dr.centerX + (dr.radius + 10 * font_scale_factor) * Math.cos(0.25 * (i - 2) * Math.PI);
                let y = dr.centerY - (dr.radius + 10 * font_scale_factor) * Math.sin(0.25 * (i + 2) * Math.PI);
                ctx.fillText(l, x, y);
                //ctx.fillRect(x, y, 4, 4);
            }

            //freq.
            ctx.save();
            ctx.translate(dr.centerX, dr.centerY);
            ctx.rotate(-0.125 * Math.PI);
            ctx.rotate(Math.PI);

            //iscrtavanje frekvencije vjetra (otkuda najčešće puše)
            let faktorpovecanja = 100 / fmax;
            for (const f of this.options.wind_data.frequency) {
                //$.each(this.options.wind_data.frequency, function (i, f) {
                drawPieSlice(ctx, 0, 0, dr.radius * (f / 100) * faktorpovecanja, Math.PI / 2, Math.PI / 2 + Math.PI / 4, "rgba(200, 200, 200, 0.5)", 0.05);
                ctx.rotate(0.25 * Math.PI);

            }
            ctx.restore();

            //calc. max. speed
            let wsmax_max = Math.max.apply(Math, this.options.wind_data.max_wind_speed);


            //max. speed
            if (wsmax_max > 0 && wsmax_max !== Infinity) {
                ctx.save();
                ctx.translate(dr.centerX, dr.centerY);
                ctx.rotate(-0.125 * Math.PI);
                ctx.rotate(Math.PI);

                //iscrtavanje maksimalne brzine vjetra
                let faktorpovecanjawsmax = 100 / wsmax_max;
                for (const f of this.options.wind_data.max_wind_speed) {
                    //$.each(this.options.wind_data.max_wind_speed, function (i, f) {
                    drawPieSlice(ctx, 0, 0, dr.radius * (f / 100) * faktorpovecanjawsmax, Math.PI / 2, Math.PI / 2 + Math.PI / 4, "rgba(255,99,71, 0.5)", 0.25);
                    ctx.rotate(0.25 * Math.PI);
                }

                for (const f of this.options.wind_data.avg_wind_speed) {
                    //$.each(this.options.wind_data.avg_wind_speed, function (i, f) {
                    drawPieSlice(ctx, 0, 0, dr.radius * (f / 100) * faktorpovecanjawsmax, Math.PI / 2, Math.PI / 2 + Math.PI / 4, "rgba(255,0,0, 0.5)", 0.25);
                    ctx.rotate(0.25 * Math.PI);
                }
                ctx.restore();
            }

            //skale
            ctx.font = "normal " + ((7 * font_scale_factor).toFixed(2)) + "pt Calibri";
            ctx.fillStyle = "black";

            for (let a = 0; a <= 100; a += 20) {
                if (a > 0) {
                    ctx.fillText(Math.round(fmax * (a / 100)) + "%", dr.centerX, dr.centerY - dr.radius * (a / 100));
                    if (wsmax_max > 0 && wsmax_max !== Infinity) {
                        ctx.fillText((wsmax_max * (a / 100)).toFixed(1) + " m/s", dr.centerX, dr.centerY + dr.radius * (a / 100));
                    }
                }
                else {
                    ctx.fillText("0", dr.centerX, dr.centerY - dr.radius * (a / 100));

                }

            }

            //calm time
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            if (this.options.show_calm_time) {
                ctx.font = "bold " + (9 * font_scale_factor).toFixed(2) + "pt Arial";
                ctx.textAlign = "end";

                ctx.fillText("C = " + this.options.wind_data.C.toFixed(2) + "%", dr.bottom, dr.right);
                //ctx.fillRect(dr.bottom, dr.right, 10, 10);
                ctx.textAlign = "center";
            }

            ctx.textAlign = "left";
            ctx.strokeStyle = "black";

            if (this.options.show_legend) {

                ctx.font = "normal " + (7 * font_scale_factor).toFixed(2) + "pt Arial";

                let vh = (hheight === 0 ? 30 : 0);
                //legend
                ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
                ctx.fillRect(10 * font_scale_factor, dr.bottom + 5 * font_scale_factor - vh * font_scale_factor, 10 * font_scale_factor, 10 * font_scale_factor);
                ctx.fillStyle = "black";
                ctx.fillText("frekvencija (%)", 22 * font_scale_factor, dr.bottom + 5 * font_scale_factor - vh * font_scale_factor);

                ctx.fillStyle = "rgba(255, 99, 71, 0.5)";
                ctx.fillRect(10 * font_scale_factor, dr.bottom + 20 * font_scale_factor - vh * font_scale_factor, 10 * font_scale_factor, 10 * font_scale_factor);
                ctx.fillStyle = "black";
                ctx.fillText("maks. pros. brzina (m/s)", 22 * font_scale_factor, dr.bottom + 20 * font_scale_factor - vh * font_scale_factor);

                ctx.fillStyle = "rgba(255,0,0, 0.5)";
                ctx.fillRect(10 * font_scale_factor, dr.bottom + 35 * font_scale_factor - vh * font_scale_factor, 10 * font_scale_factor, 10 * font_scale_factor);
                ctx.fillStyle = "black";
                ctx.fillText("sr. pros. brzina (m/s)", 22 * font_scale_factor, dr.bottom + 35 * font_scale_factor - vh * font_scale_factor);

            }
            //ctx.restore();

            //vrati def. stil
            ctx.font = "normal 8pt Arial";

        };

    }
};

export default WD;
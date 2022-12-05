const moment = require("moment");
const { average } = require("./mathUtils");
/*
(c) 2011-2014, Marko Frntić
*/

(function () {



    // shortcuts for easier to read formulas
    var sin = Math.sin,
        cos = Math.cos,
        tan = Math.tan,
        asin = Math.asin,
        atan = Math.atan2,
        acos = Math.acos,
        rad = Math.PI / 180;

    // sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas

    // date/time constants and conversions

    var dayMs = 1000 * 60 * 60 * 24,
        J1970 = 2440588,
        J2000 = 2451545;

    function toJulian(date) { return date.valueOf() / dayMs - 0.5 + J1970; }
    function fromJulian(j) { return new Date((j + 0.5 - J1970) * dayMs); }
    function toDays(date) { return toJulian(date) - J2000; }


    // general calculations for position
    var e = rad * 23.4397; // obliquity of the Earth
    function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }
    function eclipticLongitude(M) {

        var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
            P = rad * 102.9372; // perihelion of the Earth

        return M + C + P + Math.PI;
    }
    function sunCoords(d) {

        var M = solarMeanAnomaly(d),
            L = eclipticLongitude(M);

        return {
            dec: declination(L, 0),
            ra: rightAscension(L, 0)
        };
    }
    function rightAscension(l, b) { return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l)); }
    function declination(l, b) { return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }
    function radians(x) {
        //fmod
        var fmod = 0;
        fmod = parseInt(x / 360);
        fmod = fmod * 360;
        fmod = (x < 0 ? -1 : 1) * Math.abs(x - fmod);
        // normalize the angle
        return fmod * 0.0174532925199433;
    }
    function getMoonLunation(date) {
        // Number of mooncycles since 12/18/1922 12:20:09
        // First, estimate the lunation using the average
        // lunar period (LPERIOD)

        var oaDate = (date - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);

        // upper limit for interpolation
        var diff = (oaDate - 8388.51399305556);
        var temp = (diff / 29.530589);
        var jdate = toJulian(date) + (1.158E-05 / 2);
        // Add a half-second to account for the dropped
        // fraction of a second in VB dates
        // Now interpolate until correct,
        // most cases will not need it.
        //trial value of lunation
        var test = 0;
        // lower limit of result
        var test2 = 0;
        do {
            //System.Windows.Forms.Application.DoEvents()
            test = getMoonPhaseByLunation(temp, 0);
            test2 = getMoonPhaseByLunation(temp + 1, 0);
            if (test > jdate) {
                temp -= 1;
            }
            else if (test2 < jdate) {
                temp = temp + 1;
            }
        } while (!(test <= jdate & test2 > jdate));
        return Math.round(temp);
    }
    function moonCoords(d) { // geocentric ecliptic coordinates of the moon

        var L = rad * (218.316 + 13.176396 * d), // ecliptic longitude
            M = rad * (134.963 + 13.064993 * d), // mean anomaly
            F = rad * (93.272 + 13.229350 * d),  // mean distance

            l = L + rad * 6.289 * sin(M), // longitude
            b = rad * 5.128 * sin(F),     // latitude
            dt = 385001 - 20905 * cos(M);  // distance to the moon in km

        return {
            ra: rightAscension(l, b),
            dec: declination(l, b),
            dist: dt
        };
    }
    //Moonphase lunation
    function getMoonPhaseByLunation(lunation, phase) {
        lunation = Math.round(lunation);
        var k = 0.0;
        var t = 0.0;
        // Phase: 0 = NewMoon, 1 = First Qrtr., 2 = Full, 3 = Last Qrtr.
        // Lunation: number of complete lunar cycles since
        // 12/18/1922 12:20:09 PM (lunation 0)
        k = lunation - 953.0 + (phase / 4.0);
        // Calculate phase of the moon per Meeus, Ch. 47.
        // Phase: 0 = NewMoon, 1 = First Qrtr., 2 = Full, 3 = Last Qrtr.
        t = k / 1236.85;

        var jde = 2451550.09765 + (29.530588853 * k) + t * t * (0.0001337 + t * (-0.00000015 + 0.00000000073 * t));

        // these are correction parameters used below
        var e = 1.0 + t * (-0.002516 + -0.0000074 * t);
        var m = 2.5534 + 29.10535669 * k + t * t * (-0.0000218 + -0.00000011 * t);
        var m1 = 201.5643 + 385.81693528 * k + t * t * (0.0107438 + t * (0.00001239 + -0.000000058 * t));
        var f = 160.7108 + 390.67050274 * k + t * t * (-0.0016341 * t * (-0.00000227 + 0.000000011 * t));
        var o = 124.7746 - 1.5637558 * k + t * t * (0.0020691 + 0.00000215 * t);
        //planetary arguments
        var a = [];
        a[0] = 299.77 + 0.107408 * k - 0.009173 * t * t;
        a[1] = 251.88 + 0.016321 * k;
        a[2] = 251.83 + 26.651886 * k;
        a[3] = 349.42 + 36.412478 * k;
        a[4] = 84.66 + 18.206239 * k;
        a[5] = 141.74 + 53.303771 * k;
        a[6] = 207.14 + 2.453732 * k;
        a[7] = 154.84 + 7.30686 * k;
        a[8] = 34.52 + 27.261239 * k;
        a[9] = 207.19 + 0.121824 * k;
        a[10] = 291.34 + 1.844379 * k;
        a[11] = 161.72 + 24.198154 * k;
        a[12] = 239.56 + 25.513099 * k;
        a[13] = 331.55 + 3.592518 * k;

        // all into radians except for E
        m = radians(m);
        m1 = radians(m1);
        f = radians(f);
        o = radians(o);

        //all those planetary arguments, too
        for (var j = 0; j <= 13; j++) {
            a[j] = radians(a[j]);
        }

        // apply parameters to the jde.
        switch (phase) {

            case 0:
                // New Moon
                jde = jde - 0.4072 * sin(m1) + 0.17241 * e * sin(m) + 0.01608 * sin(2 * m1) + 0.01039 * sin(2 * f) + 0.00739 * e * sin(m1 - m) - 0.00514 * e * sin(m1 + m) + 0.00208 * e * e * sin(2 * m) - 0.00111 * sin(m1 - 2 * f) - 0.00057 * sin(m1 + 2 * f) + 0.00056 * e * sin(2 * m1 + m) - 0.00042 * sin(3 * m1) + 0.00042 * e * sin(m + 2 * f) + 0.00038 * e * sin(m - 2 * f) - 0.00024 * e * sin(2 * m1 - m) - 0.00017 * sin(o) - 7E-05 * sin(m1 + 2 * m) + 4E-05 * sin(2 * m1 - 2 * f) + 4E-05 * sin(3 * m) + 3E-05 * sin(m1 + m - 2 * f) + 3E-05 * sin(2 * m1 + 2 * f) - 3E-05 * sin(m1 + m + 2 * f) + 3E-05 * sin(m1 - m + 2 * f) - 2E-05 * sin(m1 - m - 2 * f) - 2E-05 * sin(3 * m1 + m) + 2E-05 * sin(4 * m1);

                break;
            case 2:
                // Full Moon
                jde = jde - 0.40614 * sin(m1) + 0.17302 * e * sin(m) + 0.01614 * sin(2 * m1) + 0.01043 * sin(2 * f) + 0.00734 * e * sin(m1 - m) - 0.00515 * e * sin(m1 + m) + 0.00209 * e * e * sin(2 * m) - 0.00111 * sin(m1 - 2 * f) - 0.00057 * sin(m1 + 2 * f) + 0.00056 * e * sin(2 * m1 + m) - 0.00042 * sin(3 * m1) + 0.00042 * e * sin(m + 2 * f) + 0.00038 * e * sin(m - 2 * f) - 0.00024 * e * sin(2 * m1 - m) - 0.00017 * sin(o) - 7E-05 * sin(m1 + 2 * m) + 4E-05 * sin(2 * m1 - 2 * f) + 4E-05 * sin(3 * m) + 3E-05 * sin(m1 + m - 2 * f) + 3E-05 * sin(2 * m1 + 2 * f) - 3E-05 * sin(m1 + m + 2 * f) + 3E-05 * sin(m1 - m + 2 * f) - 2E-05 * sin(m1 - m - 2 * f) - 2E-05 * sin(3 * m1 + m) + 2E-05 * sin(4 * m1);

                break;
            case 1:
            case 3:
                // First Quarter, Last Quarter
                jde = jde - 0.62801 * sin(m1) + 0.17172 * e * sin(m) - 0.01183 * e * sin(m1 + m) + 0.00862 * sin(2 * m1) + 0.00804 * sin(2 * f) + 0.00454 * e * sin(m1 - m) + 0.00204 * e * e * sin(2 * m) - 0.0018 * sin(m1 - 2 * f) - 0.0007 * sin(m1 + 2 * f) - 0.0004 * sin(3 * m1) - 0.00034 * e * sin(2 * m1 - m) + 0.00032 * e * sin(m + 2 * f) + 0.00032 * e * sin(m - 2 * f) - 0.00028 * e * e * sin(m1 + 2 * m) + 0.00027 * e * sin(2 * m1 + m) - 0.00017 * sin(o) - 5E-05 * sin(m1 - m - 2 * f) + 4E-05 * sin(2 * m1 + 2 * f) - 4E-05 * sin(m1 + m + 2 * f) + 4E-05 * sin(m1 - 2 * m) + 3E-05 * sin(m1 + m - 2 * f) + 3E-05 * sin(3 * m) + 2E-05 * sin(2 * m1 - 2 * f) + 2E-05 * sin(m1 - m + 2 * f) - 2E-05 * sin(3 * m1 + m);
                // further adjustment for first and last quarters
                var w = 0.00306 - 0.00038 * e * cos(m) + 0.00026 * cos(m1) - 2E-05 * cos(m1 - m) + 2E-05 * cos(m1 + m) + 2E-05 * cos(2 * f);

                // subtract for last, add for first
                if (phase === 3)
                    w = -w;
                jde = jde + w;
                break;
            default:
                return;
        }

        // now there are some final correction to everything
        jde = jde + 0.000325 * sin(a[0]) + 0.000165 * sin(a[1]) + 0.000164 * sin(a[2]) + 0.000126 * sin(a[3]) + 0.00011 * sin(a[4]) + 6.2E-05 * sin(a[5]) + 6E-05 * sin(a[6]) + 5.6E-05 * sin(a[7]) + 4.7E-05 * sin(a[8]) + 4.2E-05 * sin(a[9]) + 4E-05 * sin(a[10]) + 3.7E-05 * sin(a[11]) + 3.5E-05 * sin(a[12]) + 2.3E-05 * sin(a[13]);


        return jde;
    }

    //INIT
    var MoonSunCalc = {};

    //MOON CALCULATIONS PUBLIC
    MoonSunCalc.getMoonAstronomyParams = function (date) {

        var d = toDays(date),
            s = sunCoords(d),
            m = moonCoords(d),

            sdist = 149597870700 / 1000, // distance from Earth to Sun in km

            phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra)),
            inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi)),
            age = toJulian(date) - getMoonPhaseByLunation(getMoonLunation(date), 0), // days between previous new moon and AnyDate
            angle = age * 360 / 29.530589,
            angleT = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));

        return {
            illumination: (1.0 - cos((2 * Math.PI * age) / 29.530589)) / 2.0 * 100,
            phase: 0.5 + 0.5 * inc * (angleT < 0 ? -1 : 1) / Math.PI,
            angle: angle,
            age: age
        };
    };
    MoonSunCalc.getMoonPhases = function (date) {
        var res = {};
        //next new moon
        var temp = fromJulian(getMoonPhaseByLunation(getMoonLunation(date), 0));
        if (temp > date) {
            res.nextNewMoon = temp;
        }
        else {
            res.nextNewMoon = fromJulian(getMoonPhaseByLunation(getMoonLunation(date) + 1, 0));
        }
        //next full moon
        temp = fromJulian(getMoonPhaseByLunation(getMoonLunation(date), 2));
        if (temp > date) {
            res.nextFullMoon = temp;
        }
        else {
            res.nextFullMoon = fromJulian(getMoonPhaseByLunation(getMoonLunation(date) + 1, 2));
        }
        //next first quarter
        temp = fromJulian(getMoonPhaseByLunation(getMoonLunation(date), 1));
        if (temp > date) {
            res.nextFirstQuarter = temp;
        }
        else {
            res.nextFirstQuarter = fromJulian(getMoonPhaseByLunation(getMoonLunation(date) + 1, 1));
        }

        //next last quarter
        temp = fromJulian(getMoonPhaseByLunation(getMoonLunation(date), 3));
        if (temp > date) {
            res.nextLastQuarter = temp;
        }
        else {
            res.nextLastQuarter = fromJulian(getMoonPhaseByLunation(getMoonLunation(date) + 1, 3));
        }

        //previous new moon
        temp = fromJulian(getMoonPhaseByLunation(getMoonLunation(date), 0));
        if (temp < date) {
            res.prevNewMoon = temp;
        }
        else {
            res.prevNewMoon = fromJulian(getMoonPhaseByLunation(getMoonLunation(date) - 1, 0));
        }
        //prev full moon
        temp = fromJulian(getMoonPhaseByLunation(getMoonLunation(date), 2));
        if (temp < date) {
            res.prevFullMoon = temp;
        }
        else {
            res.prevFullMoon = fromJulian(getMoonPhaseByLunation(getMoonLunation(date) - 1, 2));
        }
        //prev first qtr
        temp = fromJulian(getMoonPhaseByLunation(getMoonLunation(date), 1));
        if (temp < date) {
            res.prevFirstQuarter = temp;
        }
        else {
            res.prevFirstQuarter = fromJulian(getMoonPhaseByLunation(getMoonLunation(date) - 1, 1));;
        }
        //prev last qtr
        temp = fromJulian(getMoonPhaseByLunation(getMoonLunation(date), 3));
        if (temp < date) {
            res.prevLastQuarter = temp;
        }
        else {
            res.prevLastQuarter = fromJulian(getMoonPhaseByLunation(getMoonLunation(date) - 1, 3));;
        }


        return res;
    }
    MoonSunCalc.getMoonTimes = function (date, lat, lon) {
        var res = {};
        var mr = moonRise(lat, lon, date);
        if (mr === "always above horizon") {
            res.abovehorizon = true;
        }
        else if (mr === "always below horizon") {
            res.belowhorizon = false;
        }
        else {
            res.rise = mr;
        }

        mr = moonSet(lat, lon, date);
        if (mr === "always above horizon") {
            res.abovehorizon = true;
        }
        else if (mr === "always below horizon") {
            res.belowhorizon = false;
        }
        else {
            res.set = mr;
        }

        return res;
    }

    //moon calc. private
    function sinalt(iobj, mjd0, hour, glong, cphi, sphi) {
        // returns sine of the altitude of either the sun or the moon given the
        // modified julian day number at midnight UT and the hour of the UT day,
        // the longitude of the observer, and the sine and cosine of the latitude
        // of the observer
        var ra = 0, dec = 0;
        var instant = mjd0 + hour / 24.0;
        var t = (instant - 51544.5) / 36525.0;
        var m = moon(t, ra, dec);
        var tau = 15.0 * (lmst(instant, glong) - m.ra);
        //hour angle of object
        return sphi * sin(m.dec * 0.0174532925199433) + cphi * cos(m.dec * 0.0174532925199433) * cos(tau * 0.0174532925199433);
    }
    function lmst(mjd, glong) {
        //    returns the local siderial time for
        //    the mjd and longitude specified
        var mjd0 = (mjd < 0 ? -1 : 1) * parseInt(Math.abs(mjd));;
        var ut = (mjd - mjd0) * 24;
        var t = (mjd0 - 51544.5) / 36525;
        var gmst = 6.697374558 + 1.0027379093 * ut;
        gmst = gmst + (8640184.812866 + (0.093104 - 6.2E-06 * t) * t) * t / 3600.0;
        return 24.0 * fpart((gmst - glong / 15.0) / 24.0);
    }
    function fpart(x) {
        //       returns fractional part of a number
        x = x - parseInt(x);
        if (x < 0) {
            x = x + 1;
        }
        return x;
    }
    function moon(t, ra, dec) {
        // returns ra and dec of Moon to 5 arc min (ra) and 1 arc min (dec)
        // for a few centuries either side of J2000.0
        // Predicts rise and set times to within minutes for about 500 years
        // in past - TDT and UT time diference may become significant for long
        // times
        var p2 = 6.283185307;
        var ARC = 206264.8062;
        var COSEPS = 0.91748;
        var SINEPS = 0.39778;
        var L0 = fpart(0.606433 + 1336.855225 * t);
        //mean long Moon in revs
        var L = p2 * fpart(0.374897 + 1325.55241 * t);
        //mean anomaly of Moon
        var LS = p2 * fpart(0.993133 + 99.997361 * t);
        //mean anomaly of Sun
        var d = p2 * fpart(0.827361 + 1236.853086 * t);
        //diff longitude sun and moon
        var F = p2 * fpart(0.259086 + 1342.227825 * t);
        //mean arg latitude
        // longitude correction terms
        var dl = 0;
        dl = 22640 * sin(L) - 4586 * sin(L - 2 * d);
        dl = dl + 2370 * sin(2 * d) + 769 * sin(2 * L);
        dl = dl - 668 * sin(LS) - 412 * sin(2 * F);
        dl = dl - 212 * sin(2 * L - 2 * d) - 206 * sin(L + LS - 2 * d);
        dl = dl + 192 * sin(L + 2 * d) - 165 * sin(LS - 2 * d);
        dl = dl - 125 * sin(d) - 110 * sin(L + LS);
        dl = dl + 148 * sin(L - LS) - 55 * sin(2 * F - 2 * d);
        // latitude arguments
        var S = F + (dl + 412 * sin(2 * F) + 541 * sin(LS)) / ARC;
        var h = F - 2 * d;
        // latitude correction terms
        var N = 0;
        N = -526 * sin(h) + 44 * sin(L + h) - 31 * sin(h - L) - 23 * sin(LS + h);
        N = N + 11 * sin(h - LS) - 25 * sin(F - 2 * L) + 21 * sin(F - L);
        var lmoon = p2 * fpart(L0 + dl / 1296000.0);
        //Lat in rads
        var bmoon = (18520.0 * sin(S) + N) / ARC;
        //long in rads
        // convert to equatorial coords using a fixed ecliptic
        var CB = cos(bmoon);
        var x = CB * cos(lmoon);
        var V = CB * sin(lmoon);
        var W = sin(bmoon);
        var y = COSEPS * V - SINEPS * W;
        var Z = SINEPS * V + COSEPS * W;
        var rho = Math.sqrt(1.0 - Z * Z);
        dec = (360.0 / p2) * Math.atan(Z / rho);
        ra = (48.0 / p2) * Math.atan(y / (x + rho));
        if (ra < 0) {
            ra = ra + 24.0;
        }

        return { t: t, ra: ra, dec: dec };
    }
    function mjd(y, m, d, h) {
        //   returns modified julian date
        //   number of days since 1858 Nov 17 00:00h
        //   valid for any date since 4713 BC
        //   assumes gregorian calendar after 1582 Oct 15, Julian before
        //   Years BC assumed in calendar format, i.e. the year before 1 AD is 1 BC
        var b = 0;
        var a = 10000.0 * y + 100.0 * m + d;
        if (y < 0)
            y = y + 1;
        if (m <= 2) {
            m = m + 12;
            y = y - 1;
        }
        if (a <= 15821004.1) {
            b = -2 + (y + 4716) / 4 - 1179;
        }
        else {
            b = (y / 400) - (y / 100) + (y / 4);
        }
        a = 365.0 * y - 679004.0;
        var ipart = (30.6001 * (m + 1) < 0 ? -1 : 1) * parseInt(Math.abs(30.6001 * (m + 1)));
        return a + parseInt(b) + ipart + d + h / 24;
    }
    function moonRise(lat, lon, date) {
        //IZRAČUN IZLASKA MJESECA
        var glong = -lon;
        //routines use east longitude negative convention
        //zone = timezone / 24;
        var dat = mjd(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getTimezoneOffset() / 60);
        //define the altitudes for each object
        //treat twilight as a separate object 3, so sinalt routine
        //falls through to finding Sun altitude again     
        var sl = sin(lat * 0.0174532925199433);
        var cl = cos(lat * 0.0174532925199433);
        var sinho = sin((8.0 / 60.0) * 0.0174532925199433);
        //moonrise - average diameter used
        let xe = 0;
        var ye = 0;
        var z1 = 0;
        var z2 = 0;
        ///''''''''''''''''''''''''''''''
        var utrise = 0;
        var utset = 0;
        var rise = 0;
        var sett = 0;
        var Hour = 1;
        var above = 0;

        var ym = sinalt(1, dat, Hour - 1, glong, cl, sl) - sinho;

        if (ym > 0)
            above = 1;
        else
            above = 0;

        //used later to classify non-risings
        do {
            //ym = sinalt(iobj%, date, hour - 1, glong, cl, sl) - sinho(iobj%)
            // var yp = 0;
            var y0 = sinalt(1, dat, Hour, glong, cl, sl) - sinho;
            var yp = sinalt(1, dat, Hour + 1, glong, cl, sl) - sinho;
            xe = 0;
            ye = 0;
            z1 = 0;
            z2 = 0;
            var nz = 0;

            //quad
            //  finds a parabola through three points and returns values of
            //  coordinates of extreme value (xe, ye) and zeros if any (z1, z2)
            //  assumes that the x values are -1, 0, +1
            var a = 0.5 * (ym + yp) - y0,
                b = 0.5 * (yp - ym),
                c = y0,
                //extreme value for y in interval
                dis = b * b - 4.0 * a * c;
            //x coord of symmetry line
            xe = -b / (2.0 * a)
            ye = (a * xe + b) * xe + c

            //discriminant
            //intersects x axis!
            if (dis > 0) {
                var dx = 0.5 * Math.sqrt(dis) / Math.abs(a);
                z1 = xe - dx;
                z2 = xe + dx;
                if ((Math.abs(z1) <= 1))
                    nz = nz + 1;
                if ((Math.abs(z2) <= 1))
                    nz = nz + 1;
                if ((z1 < -1))
                    z1 = z2;
            }
            //
            switch (nz) {
                case 0:
                    //nothing  - go to next time slot
                    break;
                case 1:
                    // simple rise / set event
                    // must be a rising event
                    if ((ym < 0)) {
                        utrise = Hour + z1;
                        rise = 1;
                        // must be setting
                    }
                    else {
                        utset = Hour + z1;
                        sett = 1;
                    }
                    break;
                case 2:
                    // rises and sets within interval
                    // minimum - so set then rise
                    if ((ye < 0)) {
                        utrise = Hour + z2;
                        utset = Hour + z1;
                        // maximum - so rise then set
                    }
                    else {
                        utrise = Hour + z1;
                        utset = Hour + z2;
                    }
                    rise = 1;
                    sett = 1;
                    break;
                default:
                    return;
            }
            ym = yp;
            //reuse the ordinate in the next interval
            Hour = Hour + 2;
        } while (!((Hour === 25) | (rise * sett === 1)));

        // logic to sort the various rise and set states
        //current object rises and sets today
        if (rise === 1) {
            // returns number containing the time written in hours and minutes
            // rounded to the nearest minute
            var ut = parseInt(utrise * 60 + 0.5) / 60;
            //round ut to nearest minute
            var h = parseInt(ut);
            var m = parseInt((60.0 * (ut - h) + 0.5));

            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0, 0);
            //current object not so simple
        }
        else {
            if (above === 1) {
                //"    always above horizon")
                return "always above horizon";
            }
            else {
                //"    always below horizon")
                return " always below horizon";
            }
        }
    }
    function moonSet(lat, lon, date) {
        //IZRAČUN IZLASKA MJESECA
        var glong = -lon;
        //routines use east longitude negative convention
        //zone = timezone / 24;
        var dat = mjd(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getTimezoneOffset() / 60);
        //define the altitudes for each object
        //treat twilight as a separate object 3, so sinalt routine
        //falls through to finding Sun altitude again     
        var sl = sin(lat * 0.0174532925199433);
        var cl = cos(lat * 0.0174532925199433);
        var sinho = sin((8.0 / 60.0) * 0.0174532925199433);
        //moonrise - average diameter used
        var xe = 0;
        var ye = 0;
        var z1 = 0;
        var z2 = 0;
        ///''''''''''''''''''''''''''''''
        var utrise = 0;
        var utset = 0;
        var rise = 0;
        var sett = 0;
        var Hour = 1;
        var above = 0;

        var ym = sinalt(1, dat, Hour - 1, glong, cl, sl) - sinho;

        if (ym > 0)
            above = 1;
        else
            above = 0;

        //used later to classify non-risings
        do {
            //ym = sinalt(iobj%, date, hour - 1, glong, cl, sl) - sinho(iobj%)
            // var yp = 0;
            var y0 = sinalt(1, dat, Hour, glong, cl, sl) - sinho;
            var yp = sinalt(1, dat, Hour + 1, glong, cl, sl) - sinho;
            xe = 0;
            ye = 0;
            z1 = 0;
            z2 = 0;
            var nz = 0;

            //quad
            //  finds a parabola through three points and returns values of
            //  coordinates of extreme value (xe, ye) and zeros if any (z1, z2)
            //  assumes that the x values are -1, 0, +1
            var a = 0.5 * (ym + yp) - y0,
                b = 0.5 * (yp - ym),
                c = y0,

                //extreme value for y in interval
                dis = b * b - 4.0 * a * c;
            xe = -b / (2.0 * a);
            //x coord of symmetry line
            ye = (a * xe + b) * xe + c;
            //discriminant
            //intersects x axis!
            if (dis > 0) {
                var dx = 0.5 * Math.sqrt(dis) / Math.abs(a);
                z1 = xe - dx;
                z2 = xe + dx;
                if ((Math.abs(z1) <= 1))
                    nz = nz + 1;
                if ((Math.abs(z2) <= 1))
                    nz = nz + 1;
                if ((z1 < -1))
                    z1 = z2;
            }
            //
            switch (nz) {
                case 0:
                    //nothing  - go to next time slot
                    break;
                case 1:
                    // simple rise / set event
                    // must be a rising event
                    if ((ym < 0)) {
                        utrise = Hour + z1;
                        rise = 1;
                        // must be setting
                    }
                    else {
                        utset = Hour + z1;
                        sett = 1;
                    }
                    break;
                case 2:
                    // rises and sets within interval
                    // minimum - so set then rise
                    if ((ye < 0)) {
                        utrise = Hour + z2;
                        utset = Hour + z1;
                        // maximum - so rise then set
                    }
                    else {
                        utrise = Hour + z1;
                        utset = Hour + z2;
                    }
                    rise = 1;
                    sett = 1;
                    break;
                default:
                    return;
            }
            ym = yp;
            //reuse the ordinate in the next interval
            Hour = Hour + 2;
        } while (!((Hour === 25) | (rise * sett === 1)));

        // logic to sort the various rise and set states
        //current object rises and sets today
        if (sett === 1) {
            // returns number containing the time written in hours and minutes
            // rounded to the nearest minute
            var ut = parseInt(utset * 60 + 0.5) / 60;
            //round ut to nearest minute
            var h = parseInt(ut);
            var m = parseInt((60.0 * (ut - h) + 0.5));

            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0, 0);
            //current object not so simple
        }
        else {
            if (above === 1) {
                //"    always above horizon")
                return "always above horizon";
            }
            else {
                //"    always below horizon")
                return " always below horizon";
            }
        }
    }

    function fromOADate(oadate) {
        var num = ((oadate * 86400000.0) + ((oadate >= 0.0) ? 0.5 : -0.5));
        if (num < 0) {
            num -= (num % 0x5265c00) * 2;
        }
        num += 0x3680b5e1fc00;
        num -= 62135596800000;
        return new Date(num);
    }
    // function toOADate(date) {
    //     return (date - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    // }

    //SUN CALC. PUBLIC
    MoonSunCalc.getSunTimes = function (date, lat, lon) {
        var res = {};
        res.rise = addTime2Date(date, sunRise(lat, lon, date));
        res.set = addTime2Date(date, sunSet(lat, lon, date));
        res.solarNoon = addTime2Date(date, solarNoon(lat, lon, date));
        res.daylight = Math.abs(res.set - res.rise) / 36e5;
        res.daylightString = moment.utc(moment.duration(moment(res.set).diff(moment(res.rise), "hours", true), "hours").asMilliseconds()).format("HH:mm:ss");
        //if (moment(res.rise).isDST()) {
        //    res.rise = moment(res.rise).add("hour", 1).toDate();
        //}
        //if (moment(res.set).isDST()) 
        //{
        //    res.set = moment(res.set).add("hour", 1).toDate();
        //}

        if (moment(date).isDST()) {
            res.rise = moment(res.rise).add(1, "hour").toDate();
            res.set = moment(res.set).add(1, "hour").toDate();
        }
        return res;
    }

    MoonSunCalc.getAverageDaylight = function (month, year_from, year_to, lat, lon) {
        const durations = [];
        for (let year = year_from; year <= year_to; year++) {
            const daysInMonth = new Date(year, month - 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month - 1, day);
                const res = this.getSunTimes(date, lat, lon);
                durations.push(res.daylight);
            }
        }
        return average(durations);
    }

    function addTime2Date(date, time) {
        var dat2 = moment(date).clone().hour(0).minute(0).second(0).millisecond(0);
        dat2.hour(moment(time).get("hour")).minute(moment(time).get("minute")).second(moment(time).get("second"));
        return dat2.toDate();
    }

    function sunRise(lat, lon, date) {
        // change sign convention for longitude from negative to positive in western hemisphere
        var longitude = lon * -1;
        var latitude = lat;
        if ((latitude > 89.8))
            latitude = 89.8;
        if ((latitude < -89.8))
            latitude = -89.8;

        var jd = toJulian(date);

        // Calculate sunrise for this date
        var riseTimeGMT = calcSunrise(latitude, longitude, jd);

        //  adjust for time zone and daylight savings time in minutes
        var riseTimeLST = riseTimeGMT;//+ (60 * (date.getTimezoneOffset() / 60));

        //  convert to days
        return fromOADate(riseTimeLST / 1440);
    }
    //sun calc. private
    function calcSunrise(latitude, longitude, jd) {
        var newt = 0;
        var t = (jd - 2451545.0) / 36525.0;;

        //First pass to approximate sunrise
        var eqtime = calcEquationOfTime(t);
        var solarDec = calcSunDeclination(t);
        var hourangle = calcHourAngleSunrise(latitude, solarDec);

        var delta = longitude - radToDeg(hourangle);
        var timeDiff = 4 * delta;
        // in minutes of time
        var timeUTC = 720 + timeDiff - eqtime;
        // in minutes

        // *** Second pass includes fractional jday in gamma calc
        newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC / 1440.0);
        eqtime = calcEquationOfTime(newt);
        solarDec = calcSunDeclination(newt);
        hourangle = calcHourAngleSunrise(latitude, solarDec);
        delta = longitude - radToDeg(hourangle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqtime;
        // in minutes
        return timeUTC;
    }
    function sunSet(lat, lon, date) {
        // change sign convention for longitude from negative to positive in western hemisphere
        var longitude = lon * -1;
        var latitude = lat;
        if ((latitude > 89.8))
            latitude = 89.8;
        if ((latitude < -89.8))
            latitude = -89.8;

        var jd = toJulian(date);

        // Calculate sunrise for this date
        var setTimeGMT = calcSunset(latitude, longitude, jd);

        //  adjust for time zone and daylight savings time in minutes
        var setTimeLST = setTimeGMT;//+ (60 * (date.getTimezoneOffset() / 60));

        //  convert to days
        return fromOADate(setTimeLST / 1440);
    }
    function calcSunset(latitude, longitude, jd) {
        var t = calcTimeJulianCent(jd);
        // First calculates sunrise and approx length of day
        var eqtime = calcEquationOfTime(t);
        var solarDec = calcSunDeclination(t);
        var hourangle = calcHourAngleSunset(latitude, solarDec);
        var delta = longitude - radToDeg(hourangle);
        var timeDiff = 4 * delta;
        var timeUTC = 720 + timeDiff - eqtime;

        // first pass used to include fractional day in gamma calc
        var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC / 1440.0);
        eqtime = calcEquationOfTime(newt);
        solarDec = calcSunDeclination(newt);
        hourangle = calcHourAngleSunset(latitude, solarDec);
        delta = longitude - radToDeg(hourangle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqtime;
        // in minutes
        return timeUTC;
    }
    function solarNoon(lat, lon, date) {
        // change sign convention for longitude from negative to positive in western hemisphere
        var longitude = lon * -1;
        var latitude = lat;
        if ((latitude > 89.8))
            latitude = 89.8;
        if ((latitude < -89.8))
            latitude = -89.8;

        var jd = toJulian(date);
        var t = calcTimeJulianCent(jd);

        var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + 0.5 + longitude / 360.0);

        var eqtime = calcEquationOfTime(newt);
        // var solarNoonDec = calcSunDeclination(newt);
        var solNoonUTC = 720 + (longitude * 4) - eqtime;

        //  convert to days
        return fromOADate(solNoonUTC / 1440);
    }
    // function calcSolNoonUTC(t, longitude) {
    //     var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + 0.5 + longitude / 360.0);
    //     var eqtime = calcEquationOfTime(newt);
    //     var solarNoonDec = calcSunDeclination(newt);
    //     var solNoonUTC = 720 + (longitude * 4) - eqtime;
    //     return solNoonUTC;
    // }
    function calcHourAngleSunrise(lat, solarDec) {
        var latRad = degToRad(lat);
        var sdRad = degToRad(solarDec);
        // var HAarg = (cos(degToRad(90.833)) / (cos(latRad) * cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
        return (Math.acos(cos(degToRad(90.833)) / (cos(latRad) * cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)));
    }
    function calcHourAngleSunset(lat, solarDec) {
        var latRad = degToRad(lat);
        var sdRad = degToRad(solarDec);
        // var HAarg = (cos(degToRad(90.833)) / (cos(latRad) * cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
        var HA = (acos(cos(degToRad(90.833)) / (cos(latRad) * cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)));
        return -HA;
    }
    function calcSunDeclination(t) {
        var e = calcObliquityCorrection(t);
        var lambda = calcSunApparentLong(t);
        var sint = sin(degToRad(e)) * sin(degToRad(lambda));
        var theta = radToDeg(asin(sint));
        return theta;
    }
    function calcSunApparentLong(t) {
        var O = calcSunTrueLong(t);
        var omega = 125.04 - 1934.136 * t;
        var lambda = O - 0.00569 - 0.00478 * sin(degToRad(omega));
        return lambda;
    }
    function calcSunTrueLong(t) {
        return calcGeomMeanLongSun(t) + calcSunEqOfCenter(t);
    }
    function calcSunEqOfCenter(t) {
        var m = calcGeomMeanAnomalySun(t);
        var mrad = degToRad(m);
        var sinm = sin(mrad);
        var sin2m = sin(mrad + mrad);
        var sin3m = sin(mrad + mrad + mrad);
        return sinm * (1.914602 - t * (0.004817 + 1.4E-05 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
    }
    function calcMeanObliquityOfEcliptic(t) {
        var seconds = 21.448 - t * (46.815 + t * (0.00059 - t * (0.001813)));
        return 23.0 + (26.0 + (seconds / 60.0)) / 60.0;;
    }
    function calcObliquityCorrection(t) {
        var e0 = 0;
        var omega = 0;
        var e = 0;
        e0 = calcMeanObliquityOfEcliptic(t);
        omega = 125.04 - 1934.136 * t;
        e = e0 + 0.00256 * cos(Math.PI * omega / 180.0);
        return e;
    }
    function calcGeomMeanLongSun(t) {
        var l0 = 280.46646 + t * (36000.76983 + 0.0003032 * t);
        do {
            if ((l0 <= 360) & (l0 >= 0))
                break;
            if (l0 > 360)
                l0 = l0 - 360;
            if (l0 < 0)
                l0 = l0 + 360;
        } while (true);

        return l0;
    }
    function calcEccentricityEarthOrbit(t) {
        return 0.016708634 - t * (4.2037E-05 + 1.267E-07 * t);
    }
    function calcGeomMeanAnomalySun(t) {
        return 357.52911 + t * (35999.05029 - 0.0001537 * t);
    }
    function degToRad(angleDeg) {
        return (Math.PI * angleDeg / 180.0);
    }
    function radToDeg(angleRad) {
        return (180.0 * angleRad / Math.PI);
    }
    function calcTimeJulianCent(jd) {
        return (jd - 2451545.0) / 36525.0;
    }
    function calcJDFromJulianCent(t) {
        return t * 36525.0 + 2451545.0;
    }
    function calcEquationOfTime(t) {
        var epsilon = calcObliquityCorrection(t);
        var l0 = calcGeomMeanLongSun(t);
        var e = calcEccentricityEarthOrbit(t);
        var m = calcGeomMeanAnomalySun(t);

        var y = Math.tan(degToRad(epsilon) / 2.0);
        y = Math.pow(y, 2);

        var sin2l0 = sin(2.0 * degToRad(l0));
        var sinm = sin(degToRad(m));
        var cos2l0 = cos(2.0 * degToRad(l0));
        var sin4l0 = sin(4.0 * degToRad(l0));
        var sin2m = sin(2.0 * degToRad(m));

        var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;

        return radToDeg(Etime) * 4.0;
    }

    // export as AMD module / Node module / browser variable
    if (typeof module !== 'undefined') module.exports = MoonSunCalc;
    else window.MoonSunCalc = MoonSunCalc;

    MoonSunCalc.drawMoonPhase = function (canvas, date, x, y, width) {


        canvas.width = width;
        canvas.height = width;



        if (x === undefined) {
            x = 0;
        }
        if (y === undefined) {
            y = 0;
        }
        if (width === undefined) {
            width = canvas.clientWidth;
        }
        // if (is_image_background === undefined) {
        //     is_image_background = true;
        // }

        var ctx = canvas.getContext("2d");
        var mp = this.getMoonAstronomyParams(date);

        var drawphase = function () {

            var k = Math.atan(1) / 45;
            var R = width / 2;
            var angle, sign = 0;
            if (mp.angle >= 360) {
                angle = mp.angle % 360;
            }
            if (mp.angle > 180) {
                sign = 1;
                angle = mp.angle - 180;
            }
            else {
                sign = -1;
                angle = mp.angle;
            }

            if (mp.angle === 180) {
                return;
            }

            //calculate path
            var pts = [];

            for (var l = -90; l <= 90; l++) {
                var x1 = x + R + R * cos(angle * k) * cos(l * k);
                var y1 = y + R - R * sin(l * k);
                pts.push({ x: x1, y: y1 })
            }
            for (let l = 90; l >= -90; l--) {
                var x2 = x + R + R * cos(l * k) * sign;
                var y2 = y + R - R * sin(l * k);
                pts.push({ x: x2, y: y2 })
            }

            //drawpath
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (var i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.closePath();
            ctx.fillStyle = "rgba(0,0,0, 0.75)";
            ctx.fill();
        }

        ctx.fillStyle = "black";
        //ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        // if (!is_image_background) {
        ctx.beginPath();
        ctx.fillStyle = "gold";
        ctx.arc(x + width / 2, y + width / 2, width / 2, 0, 2 * Math.PI);
        // ctx.clip();
        ctx.fill();

        drawphase();
        // }
        // else {
        //     var img = new Image(width, width);
        //     img.src = "/content/moon.png";
        //     img.onload = function () {
        //         ctx.drawImage(img, x, y, width, width);
        //         drawphase();
        //     }
        // }


    }

}());
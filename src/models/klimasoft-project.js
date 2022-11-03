class KlimasoftProject {

    constructor(projectName) {
        this.ProjectName = projectName;
    }

    static from = function(object){
        return Object.assign(new KlimasoftProject(), object);
    }

    load = function(object){
        return Object.assign(this, object);
    }


    ProjectName = "";

    Description = "";

    Station = {
        "ID": 0,
        "StationName": "",
        "Altitude": null,
        "Latitude": null,
        "Longitude": null,
        "IDStationType": 0,
        "StationTypeName": "",
        "IDCountryISO": "HR",
        "GSN": false
    };

    period = {
        from: null,
        to: null
    };

    YearFrom = null;
    YearTo = null;
    YearsObservation = null;
    YearsObservationPerc = null;
    YearsObservationTemp = null;

    ProcessedData = {
        "YearFrom": null,
        "YearTo": null,
        "Temperature": [],
        "Percipitation": [],
        "ZeroTempMonths": [],
        "MaxAvgTemp": null,
        "MinAvgTemp": null,
        "MaxAbsTemp": null,
        "MinAbsTemp": null,
        "AmplitudeAvg": null,
        "AmplitudeAbs": null
    }

    KlimatogramData = {
        "YearFrom": null,
        "YearTo": null,
        "Items": [
            {
                "year": null,
                "temp": [],
                "perc": [],
                "cardinal_temp": {
                    "abs_min": null,
                    "abs_max": null,
                    "avg_min": null,
                    "avg_max": null
                },
                "zero_temp_months": []
            },
            {
                "year": null,
                "temp": [],
                "perc": [],
                "cardinal_temp": {
                    "abs_min": null,
                    "abs_max": null,
                    "avg_min": null,
                    "avg_max": null
                },
                "zero_temp_months": []
            },
        ]
    }


    Settings = {
        "klimadiagram": {
            "show_aridness": true,
            "show_vegetation_period": false,
            "show_months": false,
            "show_cardinal_temp": false,
            "show_axis_scales": true,
            "interactive": false,
            "ztm": ["s", "s", "a", "a", "", "", "", "", "", "a", "a", "s"]
        }
    }
}
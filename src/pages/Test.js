
import { useRef } from "react";
// import "./App.css";
import KD from "../lib/klimadijagram";
import WD from "../lib/vjetardijagram";

function Test() {
    
  const refKlima = useRef();
  const refWind = useRef();

  let diagram, diagw;

  function onDrawHandler() {
    var options = {
      //perc: [75, 73, 91, 75, 56, 101, 58, 87, 78, 55, 46, 35],
      //temp: [-3.1, -2.1, 5.1, 8.5, 14.2, 17.2, 20.2, 16.7, 13.7, 9.3, 5.2, 0.6],
      temp: [-3.1, -2.1, 1.1, 5.5, 10.2, 13.2, 15.2, 14.7, 11.7, 7.3, 2.2, -1.6],
      perc: [75, 73, 91, 105, 112, 139, 120, 119, 106, 96, 119, 94],
      show_aridness: false, // $("#showAridness").is(":checked"),
      header_data: {
        station_name: "PUNTJARKA",
        station_altitude: 988,
        yow_period: 30
      },
      show_months: true,
      zero_temp_months: ["s", "s", "s", "a", "a", "", "", "", "", "a", "a", "s"],
      show_vegetation_period: false, // $("#showVegPer").is(":checked"),
      show_axis: true,
      interactive: false,
      show_cardinal_temp: true,
      show_axis_scales: true,
      cardinal_temp: {
        abs_min: -20.8,
        abs_max: 30.6,
        avg_min: -5.5,
        avg_max: 19.8
      }
      //margin_left: 0
    };


    // window.api.sendTestMessage("ovo je test 2!");
    diagram = new KD.Diagram(refKlima.current, options);
    diagram.options.onready = () => {
      diagram.draw();
    }

    var options_w = {
      "labels": [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW"
      ],
      "wind_data": {
        "frequency": [
          10.990600144600,
          10.918293564700,
          10.701373825000,
          13.159797541500,
          11.352133044100,
          10.845986984800,
          10.773680404900,
          12.075198843000
        ],
        "max_wind_speed": [
          1.440131,
          1.896688,
          2.207432,
          2.057142,
          1.341401,
          1.808000,
          1.761073,
          1.367065
        ],
        "avg_wind_speed": [
          1.033796,
          1.394662,
          1.697655,
          1.389576,
          0.972050,
          1.168706,
          1.113630,
          0.898922
        ],
        "C": 9.182935647100
      },
      "header_data": {
        "title": "PAZIN",
        "station_name": "Pazin",
        "yow_period": null,
        "decription": "Udaljenost od postaje: 26,77 km"
      },

      show_outer_border: true,
      show_legend: true,
      show_calm_time: true,
    };
    diagw = new WD.Diagram(refWind.current, options_w);
    diagw.draw();
  }

  function onSaveHandler() {
    // const img_data = diagram.toImage();
    // const image = nativeImage.createFromDataURL(img_data);
    // console.log(image);
  }

  return (
    <div>
      <header>
        {/* <p>Built using CRA electron-builder Template.</p> */}
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>public/electron.js</code> or <code>src/App.js</code> and
          save to reload.
        </p> */}
        <div style={{ margin: "10px 0" }}>
          <button type="button" onClick={onDrawHandler}>Draw</button>
          <button type="button" onClick={onSaveHandler}>Save</button>
        </div>

        <canvas ref={refKlima} width={350} height={450} />
        <canvas ref={refWind} width={450} height={450} ></canvas>
      </header>
    </div>
  ); 
}

export default Test;
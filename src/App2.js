import React from "react";
import "scorm-again/dist/scorm12.js";
import "scorm-again/dist/scorm2004.js";

// index_scorm.html
const url1 = "/scorm/seq/"
const manifest1 = "/scorm/seq/imsmanifest.xml"

let settings = {
  logLevel: 4,
  // mastery_override: true,
  // selfReportSessionTime: true,
  // alwaysSendTotalTime: true,
  // autoCommit: false,
  // lmsCommitUrl: "http://localhost:4000/api/scorm/data",
};

// eslint-disable-next-line no-undef
window.API = new Scorm12API(settings);

// default json
var json = {
  "suspend_data": "",
  "launch_data": "",
  "comments": "",
  "comments_from_lms": "",
  "core": {
    "student_id": "123",
    "student_name": "Nanang The Builder",
    "lesson_location": "Rangkuman",
    "credit": "",
    "lesson_status": "incomplete",
    "entry": "",
    "lesson_mode": "normal",
    "exit": "suspend",
    "session_time": "",
    "score": {
      "raw": "0",
      "min": "0",
      "max": "100"
    }
  },
  "objectives": {},
  "student_data": {
    "mastery_score": "",
    "max_time_allowed": "",
    "time_limit_action": ""
  },
  "student_preference": {
    "audio": "",
    "language": "",
    "speed": "",
    "text": ""
  },
  "interactions": {}
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schema_version: "1.2",
      currentUrl: url1,
      manifest: manifest1,
      scorm_index: "index.html",
    }
  }
  componentDidMount() {
    // this.onPrepareManifest();
    const { manifest, currentUrl } = this.state;
    window.API.loadFromJSON(json);

    let request = new XMLHttpRequest();
    request.open("GET", manifest, false);
    request.send();
    let xml = request.responseXML;
    // get scorm version
    let schema_version = xml?.getElementsByTagName("schemaversion")[0]?.firstChild?.nodeValue || false;
    // get scorm index
    let scorm_index = xml?.getElementsByTagName("resource")[0].getAttribute("href") || "index.html";
    let newUrl = currentUrl + scorm_index;

    this.setState({ schema_version, scorm_index, currentUrl: newUrl })
  }

  onPrepareManifest = () => {
    const { manifest, currentUrl } = this.state;
    window.API.loadFromJSON(json);

    let request = new XMLHttpRequest();
    request.open("GET", manifest, false);
    request.send();
    let xml = request.responseXML;
    // get scorm version
    let schema_version = xml?.getElementsByTagName("schemaversion")[0]?.firstChild?.nodeValue || false;
    // get scorm index
    let scorm_index = xml?.getElementsByTagName("resource")[0].getAttribute("href") || "index.html";
    let newUrl = currentUrl + scorm_index;

    this.setState({ schema_version, scorm_index, currentUrl: newUrl })
  }

  updatedPerSetValue = (key, val) => {
    window.API.on("LMSSetValue.cmi.*", function (CMIElement, value) {
      // console.log("on set")
      if (CMIElement != "cmi.suspend_data") {
        // updatedPerSetValue(CMIElement, value);
        console.log("tracking", CMIElement, " => ", value)
      }
      // if (CMIElement === "cmi.core.session_time") {
      //   scorm_result.track_time = value;
      // }
    });
    console.log(key, " => ", val)
    console.log(window.API.LMSGetValue("cmi"))
  }

  getScormResult = (scorm_result) => {
    console.log("get end value", scorm_result)
    console.log("on finish LMS GET VALUE", window.API.LMSGetValue("cmi"))
  }

  onTrackScorm12 = (getScormResult, updatedPerSetValue) => {
    window.API.on("LMSSetValue.cmi.*", function (CMIElement, value) {
      console.log("on set")
      if (CMIElement != "cmi.suspend_data") {
        // updatedPerSetValue(CMIElement, value);
        // console.log("tracking", CMIElement, " => ", value)
      }
      // if (CMIElement === "cmi.core.session_time") {
      //   scorm_result.track_time = value;
      // }
    });

    // window.API.on("LMSFinish", function () {
    //   // console.log("finish")
    //   scorm_result.track_completion = true;
    //   scorm_result.score = window.API.cmi.core.score;
    //   getScormResult(scorm_result);
    //   window.API.clear("LMSInitialize");
    // });
  }

  render() {
    const { currentUrl } = this.state;
    // this.onTrackScorm12(this.getScormResult, this.updatedPerSetValue);
    
    // console.log("form", scorm_result)

    return (
      <div style={{ height: "100vh" }}>
        {/* <button onClick={() => this.onChangeFile(1)}>File 1</button>
        <button onClick={() => this.onChangeFile(2)}>File 2</button>
        <button onClick={() => this.onChangeFile(3)}>File 3</button> */}
        <iframe
          title="scorm"
          src={currentUrl}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    )

  }

}


export default App;

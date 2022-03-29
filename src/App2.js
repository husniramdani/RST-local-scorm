import { useEffect, useState } from "react";
import "scorm-again/dist/scorm12.js";
import "scorm-again/dist/scorm2004.js";

// index_scorm.html
const url1 = "/scorm/seq/"
const manifest1 = "/scorm/seq/imsmanifest.xml"

// res/index.html
const url2 = "/scorm/quiz/"
const manifest2 = "/scorm/quiz/imsmanifest.xml"

// index_lms.html
const url3 = "/scorm/360/"
const manifest3 = "/scorm/360/imsmanifest.xml"

// index_lms.html
const url4 = "/scorm/bug/"
const manifest4 = "/scorm/bug/imsmanifest.xml"

let settings = {
  logLevel: 4,
  mastery_override: true,
  selfReportSessionTime: true,
  alwaysSendTotalTime: true,
  autoCommit: false,
};

// default json
let json = {
  "suspend_data": "",
  "launch_data": "",
  "comments": "",
  "comments_from_lms": "",
  "core": {
    "student_id": "123",
    "student_name": "Nanang The Builder",
    "lesson_location": "",
    "credit": "",
    "lesson_status": "not attempted",
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

// eslint-disable-next-line no-undef
window.API = new Scorm12API(settings);
// eslint-disable-next-line no-undef
window.API_1484_11 = new Scorm2004API(settings);

function App() {
  const [schemaVersion, setSchemaVersion] = useState("1.2");
  const [currentUrl, setCurrentUrl] = useState(url1);
  const [manifest, setManifest] = useState(manifest1);
  const [scormIndex, setScormIndex] = useState("index.html");
  const [scormLink, setScormLink] = useState("");

  let scorm_result = {
    track_completion: false,
    track_time: "",
    score: {
      raw: 0,
      min: 0,
      max: 100,
    },
  }

  useEffect(() => {
    window.API.loadFromJSON(json);
    window.API_1484_11.loadFromJSON(json);

    let request = new XMLHttpRequest();
    request.open("GET", manifest, false);
    request.send();
    let xml = request.responseXML;
    console.log(xml)
    // get scorm version
    let schema_version = xml?.getElementsByTagName("schemaversion")[0]?.firstChild?.nodeValue || false;
    // get scorm index
    let scorm_index = xml?.getElementsByTagName("resource")[0].getAttribute("href") || "index.html";

    setSchemaVersion(schema_version);
    setScormIndex(scorm_index);
    setScormLink(currentUrl + scorm_index);

  }, [currentUrl, scormIndex, manifest]);

  const getScormResult = () => {
    console.log("get end value", scorm_result)
    console.log("on finish LMS GET VALUE", window.API.LMSGetValue("cmi"))
  }
  const updatePerSetValue = (key, value) => {
    console.log("update scorm ", key, " => ", value);
  }

  useEffect(() => {
    console.log("Schema version", schemaVersion);
    if (!schemaVersion) {
      console.log("not scorm content");
    } else if (schemaVersion === "1.2") {
      console.log("IT'S 1.2");
      window.API.on("LMSSetValue.cmi.*", function (CMIElement, value) {
        if (CMIElement != "cmi.suspend_data") {
          updatePerSetValue(CMIElement, value);
        }
      });

      window.API.on("LMSFinish", function () {
        scorm_result.track_completion = true;
        scorm_result.score = window.API.cmi.core.score;
        if (window.API.cmi.core.lesson_status === "incomplete") {
          window.API.LMSSetValue("cmi.core.lesson_status", "completed");
        }
        getScormResult();
        window.API.clear("LMSInitialize");
      });
    } else {
      console.log("IT'S 2004");
      window.API_1484_11.on("SetValue.cmi.*", function (CMIElement, value) {
        if (CMIElement != "cmi.suspend_data") {
          updatePerSetValue(CMIElement, value);
        }
      });

      window.API_1484_11.on("Terminate", function () {
        scorm_result.track_completion = true;
        scorm_result.score = window.API_1484_11.cmi.core.score;
        if (window.API_1484_11.cmi.core.lesson_status === "incomplete") {
          window.API_1484_11.cmi.core.lesson_status = "completed";
        }
        getScormResult();
        window.API_1484_11.clear("Initialize");
      });
    }
  }, []);

  const onChangeFile = async (val) => {
    // use bellow code for handling
    // throwSCORMError : 101: LMS is already finished! (but the last record won't be saved)
    // and it make sure won't run getScormResult() on first render
    window.API.clear("LMSInitialize");
    window.API_1484_11.clear("Initialize");
    // re-initialize scorm api
    // eslint-disable-next-line no-undef
    window.API = new Scorm12API(settings)
    // eslint-disable-next-line no-undef
    window.API_1484_11 = new Scorm2004API(settings);

    let current_url = "";
    let manifesting = "";
    if (val === 1) {
      current_url = url1;
      manifesting = manifest1;
    } else if (val === 2) {
      current_url = url2;
      manifesting = manifest2;
    } else if (val === 3) {
      current_url = url3;
      manifesting = manifest3;
    } else {
      current_url = url4;
      manifesting = manifest4;
    }

    setCurrentUrl(current_url);
    setManifest(manifesting);
  }

  console.log(scormLink)
  return (
    <div style={{ height: "100vh" }}>
      <button onClick={() => onChangeFile(1)}>Client B</button>
      <button onClick={() => onChangeFile(2)}>Memancing</button>
      <button onClick={() => onChangeFile(3)}>360</button>
      <button onClick={() => onChangeFile(4)}>bug</button>
      <iframe
        title="scorm"
        src={scormLink}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  )
}



export default App;

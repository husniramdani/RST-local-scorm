import { useEffect, useState } from "react";
import "scorm-again/dist/scorm12.js";
import "scorm-again/dist/scorm2004.js";

// index_scorm.html
const url1 = "/scorm/seq/"
const manifest1 = "/scorm/seq/imsmanifest.xml"

let settings = {
  logLevel: 4,
};

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

function App() {
  const [schemaVersion, setSchemaVersion] = useState("1.2");
  const [currentUrl, setCurrentUrl] = useState(url1);
  const [manifest, setManifest] = useState(manifest1);
  const [scormIndex, setScormIndex] = useState("index.html");

  useEffect(() => {
    window.API.on("LMSSetValue.cmi.*", function (CMIElement, value) {
      if (CMIElement != "cmi.suspend_data") {
        console.log("tracking", CMIElement, " => ", value)
      }
    });
  }, []);

  useEffect(() => {
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

    setSchemaVersion(schema_version);
    setScormIndex(scorm_index);
    setCurrentUrl(newUrl);

  }, [])

  return (
    <div style={{ height: "100vh" }}>
      <iframe
        title="scorm"
        src={currentUrl}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  )
}



export default App;

import React from "react";
import "scorm-again/dist/scorm12.js";
import "scorm-again/dist/scorm2004.js";

const url1 = "/scorm/seq/index_scorm.html"
const manifest1 = "/scorm/seq/imsmanifest.xml"

const url2 = "/scorm/quiz/res/index.html"
const manifest2 = "/scorm/quiz/imsmanifest.xml"

const url3 = "/scorm/360/index_lms.html"
const manifest3 = "/scorm/360/imsmanifest.xml"

// just html
const url4 = "/scorm/digito/index.html"
const manifest4 = "/scorm/digito/imsmanifest.xml"

const url5 = "/scorm/StopMoneyLaundering/index.html"
const manifest5 = "/scorm/StopMoneyLaundering/imsmanifest.xml"

const url6 = "/scorm/visi/index_scorm.html"
const manifest6 = "/scorm/visi/imsmanifest.xml"

let settings = {
    logLevel: 4,
    // lmsCommitUrl: "http://localhost:4000/api/scorm/data",
};

// eslint-disable-next-line no-undef
window.API = new Scorm12API(settings);
// eslint-disable-next-line no-undef
window.API_1484_11 = new Scorm2004API(settings);

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            schema_version: "1.2",
            currentUrl: url1,
            manifest: manifest1,
        }
    }
    componentDidMount() {
        this.onPrepareManifest();
    }

    onPrepareManifest = () => {
        const { manifest } = this.state
        let request = new XMLHttpRequest();
        request.open("GET", manifest, false);
        request.send();
        let xml = request.responseXML;
        let schema_version = xml?.getElementsByTagName("schemaversion")[0]?.firstChild?.nodeValue || false;
        this.setState({ schema_version })
    }

    onTrackScorm12 = () => {
        console.log("on scorm 12")
        window.API.on("LMSSetValue.cmi.*", function (CMIElement, value) {
            if (CMIElement != "cmi.suspend_data") {
                console.log("tracking", CMIElement, " => ", value)
            }
        });
    }

    onTrackScorm2004 = () => {
        console.log("on scorm 2004")
        window.API_1484_11.on("SetValue.cmi.* ", function (CMIElement, value) {
            console.log("tracking 2004", value)
        });
    }

    onChangeFile = (val) => {
        let currentUrl = "";
        let manifest = "";

        if (val === 1) {
            currentUrl = url1;
            manifest = manifest1;
        } else if (val === 2) {
            currentUrl = url2;
            manifest = manifest2;
        } else {
            currentUrl = url3;
            manifest = manifest3;
        }
        this.setState({ currentUrl, manifest }, () => this.onPrepareManifest())
    }

    render() {
        const { schema_version, currentUrl } = this.state;

        if(!schema_version){
            console.log("not scorm content")
        } else if (schema_version === "1.2") {
            this.onTrackScorm12();
        } else {
            this.onTrackScorm2004();
        }

        // console.log(currentUrl)

        return (
            <div style={{ height: "100vh" }}>
                <button onClick={() => this.onChangeFile(1)}>File 1</button>
                <button onClick={() => this.onChangeFile(2)}>File 2</button>
                <button onClick={() => this.onChangeFile(3)}>File 3</button>
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

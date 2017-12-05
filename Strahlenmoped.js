////////////////////////////////////////////////////////////////////////////////
////BFS-Strahlen-Moped//////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////V0.1     Abfrage von einer Messstelle (22.09.2017)
////V0.2     Ergänzung Grenzwert (Setzen eines Farbwerts) (23.09.2017)
////V0.3     Möglichkeit der Abfrage mehrerer Messstellen (23.09.2017)
////V0.4     Bugfixing (25.09.2017)
////////////////////////////////////////////////////////////////////////////////

var request     = require("request");
var JSON_arr    = {};
var path        = "Strahlung.";
var color_red   = "#ff0000";
var color_green = "#009900";
var i			= 1;



////////////////////////////////////////////////////////////////////////////////
//// Stammdaten ////
////////////////////////////////////////////////////////////////////////////////

var stations=["120612602","110000004","120644481","120644881"]; //Liste mit Stations-IDs
var user="user";
var pass="pass";

////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//// States erzeugen ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function createAllStates(){

steps=stations.length;

	if (i <= steps ) {

createState(path + (i.toString()) +".Ort", "", {
        name: 'Ort der Messstation',
        desc: 'Ort der Messstation',
        type: 'string',
        role: 'value',
        unit: ''
    });   
    
createState(path + (i.toString()) + ".Status_Messstelle", 0, {
        name: 'Status der Messstelle',
        desc: 'Status der Messstelle',
        type: 'number',
        role: 'value',
        unit: ''
    });    
    
createState(path + (i.toString()) + ".Letzter_1h_Messwert", 0, {
        name: 'letzter 1h-Messwert',
        desc: 'letzter 1h-Messwert',
        type: 'number',
        rol2e: 'value',
        unit: ''
    });

createState(path + (i.toString()) + ".Limit_color", "", {
        name: 'Farbe Grenzwert',
        desc: 'Farbe_Grenzwert',
        type: 'string',
        role: 'value',
        unit: ''
    });   
	
	i++;
	createAllStates();
	
}
}

////////////////////////////////////////////////////////////////////////////////
//// Funktion read-URL /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function read(url,callback) {
    request(url, function (err, state, body){
    if (body) {
            var json = parseJson(body);
            callback(null, json);
        } else {
            console.log(err, "warn");  
            callback(err, null);
        }
    });    
}

////////////////////////////////////////////////////////////////////////////////
//// JSON-Parsing  /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function parseJson(text) {
    if (text === "") return {};
    try {
        json = JSON.parse(text);
    } catch (ex) {
        json = {};
    }
    if(!json) json = {};
    return json;
}

////////////////////////////////////////////////////////////////////////////////
//// Hauptprogramm /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function main0() {
var j			= 0;
main();

function main() {
	steps=stations.length;
	if (j < steps ) {
		var url="https://" + user + ":" + pass +"@odlinfo.bfs.de/daten/json/" + stations[j] + ".json";
		var dp=j+1;
    read(url, function(err,json) {
        if(!err) {
            JSON_arr = json;
			setState(path + (dp.toString()) + ".Ort" , JSON_arr.stamm.ort);
            setState(path + (dp.toString()) + ".Status_Messstelle" , JSON_arr.stamm.status);
            setState(path + (dp.toString()) + ".Letzter_1h_Messwert" , JSON_arr.stamm.mw);
            
            if(JSON_arr.stamm.mw <= 1.00) {
                setState(path + (dp.toString()) + ".Limit_color", color_green);
            }else
            {
                setState(path + (dp.toString()) + ".Limit_color", color_red);
            }
            
			
			
        } else {
           console.log("!!!!FEHLER!!!!! : " );
            }
			
});

j++;

main();
}

}
}

createAllStates();

setTimeout(main0,1000);

schedule("*/30 * * * *", function () {
    main0();
});


////////////////////////////////////////////////////////////////////////////////
////*** GrafanaStats VIS ***  //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////V0.1     initial
////V0.2     Delete Snapshot hinzugefügt
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
////////////// CONFIG //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const apiKey		= "API-KEY GRAFANA";
const grafanaIP		= "192.168.0.46";
const grafanaPort	= "3000";
const protocol      = "http";
const user          = "GRAFANA-USER";
const pass          = "GRAFANA-PASSWORT";

////////////////////////////////////////////////////////////////////////////////

let   request     	= require("request");
let   deleteUrl     = "";
const path        	= "javascript.0.Grafana.";
const dashboardUrl	= path+"DashboardURL";                              //Datenpunkt der die Snapshot-URL enthält
const dashboardName	= path+"DashboardName";                             //Datenpunkt um den Dashboardnamen zu übergeben
const grafanaUrl	= protocol + "://" + grafanaIP + ":" + grafanaPort;
const dashData		= grafanaUrl+"/api/dashboards/db/";
const dashGet		= grafanaUrl+"/api/snapshots";
const apiKeyStr		= "Bearer " + apiKey;
////////////////////////////////////////////////////////////////////////////////


createAllStates();

on({id: (dashboardName) , change: "ne"}, function (obj) {

	if (deleteUrl !== "") {
	    deleteSnapshot();
	}
	
	dashName=getState(dashboardName).val;
    getDashJSON();
    setTimeout(getDashSnapshot,1000);
	
});    



function deleteSnapshot(){
    console.log("Deleting old Snapshot");
    request(
    { method: 'GET',
      url: deleteUrl,
      headers: {
            'Content-Type': 'application/json'
		    	}
    },  
    function (error, response, body) 
    {
     jsonArray=JSON.parse(body);
     console.log("Fehlercode: " + error);
     console.log(JSON.stringify(jsonArray.message));
     }
  );
}





function getDashJSON(){

request(
    { method: 'GET',
      url: dashData+dashName,
      headers: {
		    Authorization: apiKeyStr
		}
    },  
    function (error, response, body) 
    {
     jsonArray=JSON.parse(body);
     jsonPost='{"dashboard":' + JSON.stringify(jsonArray.dashboard) + ',    "expires": 0}';
     }
  );
}

function getDashSnapshot(){
    
    request(
    { method: 'POST',
      url: dashGet,
      body: jsonPost,
      headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
		    'Authorization': apiKeyStr
		}
    },  
    function (error, response, body) 
    {
     jsonArray=JSON.parse(body);
     snapshotUrl=JSON.stringify(jsonArray.url);
     snapshotUrl=snapshotUrl.replace("localhost",grafanaIP);
     snapshotUrl=snapshotUrl.replace("\"", "");
     snapshotUrl=snapshotUrl.replace("\"", "");
     console.log("Die URL lautet: " + snapshotUrl);
     setState(dashboardUrl, snapshotUrl);
     deleteUrl=JSON.stringify(jsonArray.deleteUrl);
     deleteUrl=deleteUrl.replace("localhost",grafanaIP);
     deleteUrl=deleteUrl.replace(protocol +"://", protocol + "://" + user + ":" + pass + "@");
     deleteUrl=deleteUrl.replace("\"", "");
     deleteUrl=deleteUrl.replace("\"", "");
     console.log("Die URL zum löschen lautet: " + deleteUrl);
    }
  );
    
}
 


function createAllStates(){
createState(dashboardUrl, "", {
        name: 'Dashboard',
        desc: 'Dashboard',
        type: 'string',
        role: 'value',
        unit: ''
    });   

createState(dashboardName, "", {
        name: 'Dashboard_Name',
        desc: 'Dashboard Name',
        type: 'string',
        role: 'value',
        unit: ''
    });       
}

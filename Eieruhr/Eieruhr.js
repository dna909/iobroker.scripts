//   Eieruhr    dna909 (heinbloed@nu-is-en.de)
//   **************************************************************************
//   v0.1       initial
//   v0.2       Erweiterung Eitemperatur + Gewicht
//   v0.3       Formel Garzeit angepasst (13.10.2017)
//   **************************************************************************
//
//  Datenpunkte:
//  
//  start:      true/false
//  Stop:       true/false
//  fertig:     true/false          //Wert für viele tolle Dinge
//  Haerte:     "w","m","h"         //weich,medium,hart
//  Groesse:    "s","m","l","xl"    //Eigröße
//  Timer:      "mm:ss"
//  Reset:      true/false
//  Gewicht:    g                   //Eigewicht
//  Temperatur: °C                  //Eitemperatur
//  Switch:		true/false			//true=nach Größe ; false=nach Gewicht
///////////////////////////////////////////////////////////////////////////////

// Datenpunkte

var instanz =   "javascript.0";
var objekt  =   "Eieruhr";

var start        =   instanz+"."+objekt+"."+"start";
var fertig       =   instanz+"."+objekt+"."+"fertig";
var haerte       =   instanz+"."+objekt+"."+"Haerte";
var groesse  	 =   instanz+"."+objekt+"."+"Groesse";
var stop    	 =   instanz+"."+objekt+"."+"Stop";
var timer   	 =   instanz+"."+objekt+"."+"Timer";
var reset   	 =   instanz+"."+objekt+"."+"Reset";
var gewicht 	 =   instanz+"."+objekt+"."+"Gewicht";
var temp   		 =   instanz+"."+objekt+"."+"Temperatur";

///////////////////////////////////////////////////////////////////////////////
var SiedePunkt=100;             //Siedepunkt Wasser
var InnenTemp=[62,68,82];       //Kerntemperatur Eigelb (weich,medium,hart)
var TempStart=7;                //Eitemperatur
var EiGroesse=[50,60,70,80];    //S,M,L,XL-Eigewicht

///////////////////////////////////////////////////////////////////////////////

//// Initialwerte

haerte_math=InnenTemp[0];
gewicht_math=EiGroesse[1];

///////////////////////////////////////////////////////////////////////////////

on({id: new RegExp( groesse +"|"+ haerte +"|"+ temp +"|"+ gewicht) , change: "ne"}, function (obj) {
		
    
    switch (getState(haerte).val) {
    case "w":
        haerte_math=InnenTemp[0];
        break;
    case "m":
        haerte_math=InnenTemp[1];
        break;
    case "h":
        haerte_math=InnenTemp[2];
        break;
    case "":
        console.log("error");
        break;
}

	if (getState(gewicht).val < EiGroesse[1]){
	    setState(groesse, "s");
	}else{
	    if ((getState(gewicht).val >= EiGroesse[1]) && (getState(gewicht).val < EiGroesse[2])) {
	       setState(groesse,"m"); 
	}else{
	    if ((getState(gewicht).val >= EiGroesse[2]) && (getState(gewicht).val < EiGroesse[3])) {
	     setState(groesse,"l");   
	}else{
	    if ((getState(gewicht).val >= EiGroesse[3])) {
	     setState(groesse,"xl");   
	}
}
}
	    
}
        TempStart=(getState(temp).val);
        gewicht_math=(getState(gewicht).val);

timer1();

});

on({id: start, change: "ne"}, function (obj) {
    if (getState(start).val === true) {
    setState(fertig, false);
    setState(reset, false);
    setState(stop, false);
    interval = setInterval(countdown, 1000);
        
    }
    
});

on({id: reset, change: "ne"}, function (obj) {
    if (getState(reset).val ===true) {
        clearInterval(interval);
        setState(start, false);
        setState(fertig, false);
        setState(reset, false);
        setState(stop, false);
        timer1();
    }
});


/// Berechnung der Kochzeit ///////////////////////////////////////////////////

function timer1() {
    
    ze1 = 0.517*Math.pow(gewicht_math, 2/3)*Math.log (0.76*((SiedePunkt - TempStart)/(SiedePunkt-haerte_math)));
    ze2 = Math.round(ze1 * 60);             // Kochzeit in Sekunden
    minuten=Math.floor(ze2/60);         // Minuten
    sekunden=ze2 - (minuten*60);        // Sekunden

if (minuten < 10){
         fz_m="0";
     } else {
         fz_m="";
     }
     
     if (sekunden < 10){
         fz_s="0";
     }else {
         fz_s="";
     }
     
    zeit= fz_m + minuten.toString() + ":" + fz_s + sekunden.toString();
    setState(timer, zeit);

}    

// Countdown

function countdown() {
    if (ze2 > 0 ) { 
            if (getState(stop).val ===false) {
            ze2--;
            minuten=Math.floor(ze2/60);      // Minuten
            sekunden=ze2 - (minuten*60);          // Sekunden
            }
        if (minuten < 10){
         fz_m="0";
        } else {
         fz_m="";
        }
     
        if (sekunden < 10){
         fz_s="0";
         }else {
         fz_s="";
        }
     
        zeit= fz_m + minuten.toString() + ":" + fz_s + sekunden.toString();
        setState(timer, zeit);
    
    } else {
        clearInterval(interval);
        setState(start, false);
        setState(fertig, true);
        setStateDelayed(fertig, false, 60000, true);
    }
}



// Datenpunkte erzeugen

function createStates () {
 
 createState(start, false, {
        name: 'Eieruhr starten',
        desc: 'Eieruhr starten',
        type: 'boolean',
        role: 'state',
        unit: ''
    });      
    
 createState(fertig, false, {
        name: 'Eieruhr fertig',
        desc: 'Eieruhr fertig',
        type: 'boolean',
        role: 'state',
        unit: ''
    });          
 
 createState(haerte, "w", {
        name: 'Eierhärte',
        desc: 'Eierhärte',
        type: 'String',
        role: 'value',
        unit: ''
    });          

 createState(groesse, "m", {
        name: 'Eiergröße',
        desc: 'Eiergröße',
        type: 'string',
        role: 'value',
        unit: ''
    });          

 createState(stop, false, {
        name: 'Eieruhr fertig',
        desc: 'Eieruhr fertig',
        type: 'boolean',
        role: 'state',
        unit: ''
    });          
 
 createState(timer, "00:00", {
        name: 'Timer',
        desc: 'Timer',
        type: 'string',
        role: 'value',
        unit: ''
    });          

 createState(reset, false, {
        name: 'Eieruhr reset',
        desc: 'Eieruhr reset',
        type: 'boolean',
        role: 'state',
        unit: ''
    });   

createState(gewicht, 50, {
        name: 'Eigewicht',
        desc: 'Eigewicht',
        type: 'number',
        role: 'value',
        unit: 'g'
    });        	
    
createState(temp, 0, {
        name: 'Eitemperatur',
        desc: 'Eitemperatur',
        type: 'number',
        role: 'value',
        unit: '°C'
    });        	
	

}

///////////////////////////////////////////////////////////////////////////////

createStates();
setTimeout(timer1,1000);

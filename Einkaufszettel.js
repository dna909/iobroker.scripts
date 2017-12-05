//   Einkaufsliste 
//   
//   v0.0               Erstellung
//   v0.1               sendTo Telegram
//   v0.2               Split in 2 Kategorien (Lebensmittel + Drogerieartikel)
//   v0.3               Liste für Drogerieartikel kann separat erzeugt werden
//   v0.5				Optimierung
//   v0.6               Defaultmengen implementiert + Mengen werden nach Telegram gesendet
//   v0.7				Formatierung Telegram-Nachricht angepasst
//
//	 Datenpunkte:
//   ---------------------------------------------
//	 FoodCatFood        Kategorie für Umschaltung in der Visualisierung (Lebensmittel)
//   FoodCatVeg			Kategorie für Umschaltung in der Visualisierung (Obst/Gemüse)
//   FoodCatDrink		Kategorie für Umschaltung in der Visualisierung (Getränke)
//   DrugCat			Kategorie für Umschaltung in der Visualisierung (Drogerieartikel)
//   Visibility			Sichtbarkeit (Wertebereich 0-3)
//   FoodListGenerate	Wert auf true setzen um Gesamteinkaufsliste zu generieren
//   DrugListGenerate	Wert auf true setzen um Drogerieartikeleinkaufsliste zu generieren
//	 Delete				Wert auf true setzen um gesamte Liste zu löschen
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var FoodList=new Array("Eier",6,"Mischbrot",1,"Toastbrot",1,"Butter",1,"Honig",1,"Konfitüre",1,"Wurst",1,"Käse",1,"Öl",1,
                       "Zucker",1,"Mehl",1,"Milch",1,"Salz",500,"Senf",1,"Ketchup",1,"Apfel",1,"Birne",1,"Kiwi",1,"Banane",1,
                       "Trauben",500,"Nektarine",1,"Wasser",1,"Apfelsaft",1,"Orangensaft",1,"Zwiebeln",500,"Knoblauch",1,
                       "Lauchzwiebeln",1,"Brokkoli",1,"Blumenkohl",1,"Paprika",1,"Kartoffeln",1,"Möhren",1,"Pilze",1,
                       "Zucchini",1,"Gurke",1,"Joghurt",1,"Süssigkeiten",1,"Lea-Wasser",1,"Tomaten",1,"Gewürzgurken",1,
                       "Fisch",1,"Fleisch",1,"Hackfleisch",350,"Hähnchenfleisch",500,"Kräuter",1,"Spinat",1,"TK-Gemüse",1,
                       "Ananas",1,"Clementinen",1,"Melone",1,"Mango",1,"Pflaumen",1,"Avocado",1,"Süßkartoffel",1,"Kräuterquark",1,
                       "Quark",1,"Cola",1,"Fanta",1,"Sprite",1,"Bier",6,"Dosentomaten",1,"Tee",1,"Sossenbinder-hell",1,"Sossenbinder-dunkel",1,
                       "Hefe",2,"Backpulver",1,"Vanillezucker",1,"Pizza",2,"Nudeln",1,"Schlagsahne",1,"Eisbergsalat",1,"Suppengrün",1,
                       "Mandeln",2,"Rotwein",1,"Chinagemüse",1,"Dosenmais",1,"Essig",1,"Frosta-Gericht",1,"Reis",1,"Sojasoße",1,
                       "Tomatenmark",1,"Fischstäbchen",1,"Wiener",1,"Bratwurst",1,"Butter-Brot",2,"Traubensaft",1,"Pizzakäse",2,
                       "Aubergine",1,"Lauchzwiebel",1,"Radieschen",1,"Kohlrabi",1,"Rosenkohl",1,"Rotkohl",1,"Kaffee",1);
					   
var DrugList=new Array("Badreiniger",1,"Waschmittel",1,"Taschentücher",1,"Tampons",1,
                       "Wattestäbchen",1,"Wattepads",1,"Blauspüler",1,"Deo",1,"Zahnpasta",1,"Küchenpapier",1,"Mülltüten",1,
                       "Toilettenpapier",1,"Abschminktücher",2,"Duschbad",2,"Geschirrspültabs",1,"Geschirrspülersalz",1,
                       "Lea-Brei",4,"Flaschenbürste",1,"Quetschies",2,"Lea-Zwieback",1,"Spülung",1,"Shampoo",1,
                       "Spüllappen",1,"Toilettenpapier-feucht",1,"Topfschwämme",1,"Lea-Reiswaffeln",1,"Backpapier",1,
					   "Gefrierbeutel",1,"Klarspüler",1,"Rasierschaum",1);
					   
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////					   
					   
var LengthListFood=(FoodList.length)-1;
var LengthListDrug=(DrugList.length)-1;
var Path="javascript.0.Einkaufsliste.";				//Pfad Datenpunkte
var Food=Path+"FoodCatFood";
var Veg =Path+"FoodCatVeg";
var Drink=Path+"FoodCatDrink";
var Drug=Path+"DrugCat";
var Visibility=Path+"Visibility";
var FoodListGenerate=Path+"FoodListGenerate";
var DrugListGenerate=Path+"DrugListGenerate";
var ListType=Path+"ListType";
var Delete=Path+"Delete";
var FoodListJSON=Path+"FoodListJSON";
var Telegram=Path+"Telegram";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

createAllStates();

//***************************************************************************************************************************

on({id: (Food) , change: "ne"}, function (obj) {

    if (getState(Food).val === true){
        setState(Food,false);
        setState(Veg,false);
        setState(Drink,false);
        setState(Drug,false);
        setState(Visibility,0);
    }
});    
    
on({id: (Veg) , change: "ne"}, function (obj) {    
        if (getState(Veg).val === true){
        setState(Veg,false);
        setState(Food,false);
        setState(Drink,false);
        setState(Drug,false);        
        setState(Visibility,1);
    }
});    
   
on({id: (Drink) , change: "ne"}, function (obj) {    
        if (getState(Drink).val === true){
        setState(Drink,false);
        setState(Food,false);
        setState(Veg,false);
        setState(Drug,false);
        setState(Visibility,2);
    }
});    

on({id: (Drug) , change: "ne"}, function (obj) {    
        if (getState(Drug).val === true){
        setState(Drink,false);
        setState(Food,false);
        setState(Veg,false);
        setState(Drug,false);
        setState(Visibility,3);
    }
});    
    
on({id: (FoodListGenerate), change: "ne"}, function (obj) {
    var CounterPositionFood=0;
    
    if (getState(FoodListGenerate).val === true) {
	setState(ListType, 1);
    CreateShoppingList();    
    setState(FoodListGenerate, false);
    }
    
});

on({id: (DrugListGenerate), change: "ne"}, function (obj) {
    var CounterPositionDrug=0;
    
    if (getState(DrugListGenerate).val === true) {
    setState(ListType, 2);
	CreateShoppingListDrug();    
    setState(DrugListGenerate, false);
    }
    
});

on({id: (Delete), change: "ne"}, function (obj) {
    
    if (getState(Delete).val === true) {
    CounterDeleteStates_();
    DeleteFoodStates(); 
    CounterDeleteStates_();
    DeleteDrugStates();
    setState(Delete, false);
    }
});

///// Einkaufsliste erzeugen  //////////////////////////////////////////////////////////////////

function CreateShoppingList(){
    
    var CounterPositionFood=0;
    var CounterFoodStates=0;
	var CounterDrugStates=0;
    var ShoppingList=["{"];
    
    CreateShoppingListLoopAll();
    
    function CreateShoppingListLoopAll(){
	
		CreateShoppingListLoopFood();
		CreateShoppingListLoopDrug();
	
	function CreateShoppingListLoopFood(){
    if (CounterFoodStates <= LengthListFood ) {

        if (getState(Path+FoodList[CounterFoodStates]).val === true){
            ShoppingList=ShoppingList+ '"' + "Artikel" + String.fromCharCode(97+CounterPositionFood) + '":"' + FoodList[CounterFoodStates]+'",';
            var FoodAmount=getState(Path+FoodList[CounterFoodStates]+".Menge").val
            ShoppingList=ShoppingList+ '"' + "Menge" + String.fromCharCode(97+CounterPositionFood) + '":"' + FoodAmount +'",';
            CounterPositionFood++;
        }
            CounterFoodStates++;
            CounterFoodStates++;
            CreateShoppingListLoopFood();
}
}

    function CreateShoppingListLoopDrug(){
    if (CounterDrugStates <= LengthListDrug ) {
        if (getState(Path+DrugList[CounterDrugStates]).val === true){
            ShoppingList=ShoppingList+ '"' + "Artikel" + String.fromCharCode(97+CounterPositionFood) + '":"' + DrugList[CounterDrugStates]+'",';
            var DrugAmount=getState(Path+DrugList[CounterDrugStates]+".Menge").val
            ShoppingList=ShoppingList+ '"' + "Menge" + String.fromCharCode(97+CounterPositionFood) + '":"' + DrugAmount +'",';

            CounterPositionFood++;
        }
            CounterDrugStates++;
            CounterDrugStates++;
            CreateShoppingListLoopDrug();
}
}

if (CounterPositionFood === 0){
    console.log("NIX EINZUKAUFEN!!!");
    return;
}
}

var ShoppingListTemp = (ShoppingList.substr(0, ShoppingList.length-1)+"}");
ShoppingList=ShoppingListTemp;
setState(FoodListJSON , ""+ ShoppingList + "");
setTimeout(SendToTelegram,4000);
}

/////nur Drogerieartikel//////////////////////////////////////////////////////////////

function CreateShoppingListDrug(){
    
    var CounterPositionFood=0;
    var CounterDrugStates=0;
    var ShoppingList=["{"];
    
    CreateShoppingListLoopDrugOnly();
		
    function CreateShoppingListLoopDrugOnly(){

    if (CounterDrugStates <= LengthListDrug ) {
        if (getState(Path+DrugList[CounterDrugStates]).val === true){
            ShoppingList=ShoppingList+ '"' + "Artikel" + String.fromCharCode(97+CounterPositionFood) + '":"' + DrugList[CounterDrugStates]+'",';
            var DrugAmount=getState(Path+DrugList[CounterDrugStates]+".Menge").val
            ShoppingList=ShoppingList+ '"' + "Menge" + String.fromCharCode(97+CounterPositionFood) + '":"' + DrugAmount +'",';
            CounterPositionFood++;
        }
            CounterDrugStates++;
            CounterDrugStates++;
            CreateShoppingListLoopDrugOnly();
}
}

if (CounterPositionFood === 0){
    console.log("NIX EINZUKAUFEN!!!");
    return;
}

var ShoppingListTemp = (ShoppingList.substr(0, ShoppingList.length-1)+"}");
ShoppingList=ShoppingListTemp;
setState(FoodListJSON, ""+ ShoppingList + "");
setTimeout(SendToTelegram,4000);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function SendToTelegram(){

var List=getState(FoodListJSON).val;
var parseJSON = JSON.parse(List);
var TelegramCounter=0;
var TelegramT="";

GenerateTelegram();

    function GenerateTelegram(){
        
        if (TelegramCounter < LengthListFood ){
            var CounterChar="Artikel" + String.fromCharCode(97+TelegramCounter);
            var CounterCharAmount="Menge" + String.fromCharCode(97+TelegramCounter);
            item=parseJSON[CounterChar];
            var amount=parseJSON[CounterCharAmount];
            
            if (typeof item==="undefined"){
                return;
            }
            NumberOfSpaces=25 - (item.length);
            SpacesTemp="____________________________";
            Spaces=SpacesTemp.substr(1,NumberOfSpaces);
            
       
            TelegramT=TelegramT + "`" + item  + Spaces + "`" + "*" + amount + "*" + "\n";
            TelegramCounter++;
            GenerateTelegram();
        }
}
setState(Telegram ,TelegramT);

setTimeout(Send,2000);
    
 function Send(){
 
 if (getState(ListType).val === 1) {
	ListTypeText="Die Einkaufsliste für heute:\n\n\n";
	}else{
	if (getState(ListType).val === 2) {
	ListTypeText="Die Drogerieartikel-Einkaufsliste für heute:\n\n\n";
	}
}
//*******   1. Telegram-Instanz   *************************************************    
    sendTo("telegram.0", "send", {
          text: ListTypeText + (getState(Path+"Telegram").val),
          parse_mode: 'Markdown'
    });

//*******   2. Telegram-Instanz   *************************************************    
    
	sendTo("telegram.1", "send", {
          text: ListTypeText + (getState(Path+"Telegram").val),
          parse_mode: 'Markdown'
    });
	
//****************************************************************************************
   
 TelegramT="";
 setState(Telegram ,"");
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////

function DeleteFoodStates(){

	if (CounterDeleteStates <= LengthListFood ) {

	setState(Path + FoodList[CounterDeleteStates], false);
        CounterDeleteStates++;
        CounterDeleteStates++
	DeleteFoodStates();
    }   
}

function DeleteDrugStates(){

	if (CounterDeleteStates <= LengthListDrug ) {

	setState(Path + DrugList[CounterDeleteStates], false);
        CounterDeleteStates++;
        CounterDeleteStates++
	DeleteDrugStates();
    }   
}

function CounterDeleteStates_(){
    CounterDeleteStates=0;
}

function createAllStates(){

createState(FoodListJSON, "", {
        name: 'Lebensmittel',
        desc: 'Einkaufsliste JSON',
        type: 'string',
        read:  'true',
        write: 'true'
    });   

createState(Telegram, "", {
        name: 'Lebensmittel',
        desc: 'Einkaufsliste',
        type: 'string',
        read:  'true',
        write: 'true'
    });       
	
createState(ListType, 0, {
        name: 'Einkaufsliste',
        desc: 'Einkaufsliste',
        type: 'number',
        role:  'state',
        
    });       	
    
createState(FoodListGenerate, false, {
        name: 'Lebensmittel',
        desc: 'Einkaufsliste',
        type: 'boolean',
        role:  'state',
        
    });  

createState(DrugListGenerate, false, {
        name: 'Drogerie',
        desc: 'Einkaufsliste',
        type: 'boolean',
        role:  'state',
        
    });  

createState(Drink, false, {
        name: 'Lebensmittel',
        desc: 'Einkaufsliste',
        type: 'boolean',
        role:  'state',
        
    });       

createState(Veg, false, {
        name: 'Lebensmittel',
        desc: 'Einkaufsliste',
        type: 'boolean',
        role:  'state',
        
    });       

createState(Food, false, {
        name: 'Lebensmittel',
        desc: 'Einkaufsliste',
        type: 'boolean',
        role:  'state',
        
    });       
    
createState(Drug, false, {
        name: 'Lebensmittel',
        desc: 'Einkaufsliste',
        type: 'boolean',
        role:  'state',
        
    });           

createState(Visibility, 0, {
        name: 'Lebensmittel',
        desc: 'Einkaufsliste',
        type: 'number',
        role:  'state',
        
    });       

createState(Delete, false, {
        name: 'Lebensmittel',
        desc: 'Einkaufsliste',
        type: 'boolean',
        role:  'state',
        
    });           

var CounterCreateStatesFood=0;
var CounterCreateStatesDrug=0;
createAllStatesLoop();

function createAllStatesLoop(){
	
	createAllStatesLoopFood();
	
	CreateAllStatesLoopDrug();

	function createAllStatesLoopFood(){

	if (CounterCreateStatesFood <= LengthListFood ) {

createState(Path + FoodList[CounterCreateStatesFood], false, {
        name: 'Lebensmittel',
        desc:  FoodList[CounterCreateStatesFood],
        type: 'boolean',
        role: 'state',
        unit: ''
    });   
    
createState(Path + (FoodList[CounterCreateStatesFood]) + ".Menge", (FoodList[CounterCreateStatesFood+1]), {
        name: 'Lebensmittel',
        desc:  FoodList[CounterCreateStatesFood],
        type: 'number',
        role: 'state',
        unit: ''
    });       

	CounterCreateStatesFood++;
	CounterCreateStatesFood++;
	createAllStatesLoopFood();
}
}

function CreateAllStatesLoopDrug(){

	if (CounterCreateStatesDrug <= LengthListDrug ) {

createState(Path + DrugList[CounterCreateStatesDrug], false, {
        name: 'Drogerie',
        desc:  DrugList[CounterCreateStatesDrug],
        type: 'boolean',
        role: 'state',
        unit: ''
    });   
    
createState(Path + (DrugList[CounterCreateStatesDrug]) + ".Menge", (DrugList[CounterCreateStatesDrug+1]), {
        name: 'Drogerie',
        desc:  DrugList[CounterCreateStatesDrug],
        type: 'number',
        role: 'state',
        unit: ''
    });       
	
	CounterCreateStatesDrug++;
	CounterCreateStatesDrug++;
	CreateAllStatesLoopDrug();
}
}
}
}
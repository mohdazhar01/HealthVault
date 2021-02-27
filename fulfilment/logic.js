const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
var user;
var passkey;
var uniqid ;
var path = require('path');
var x;
var username;
var password;
var bpval;
var datetime = new Date();
console.log(datetime.toISOString().slice(0,10));

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'ws://healthvault-yfwjcm.firebaseio.com/' 
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({request, response});   
function logoutHandler(agent)
  { username='0';
    password='0';
   agent.add("logout Successfull");
  }
    
function AuthHandler(agent)
  {  user = agent.parameters.username;
     passkey = agent.parameters.password;
     uniqid =agent.parameters.uniqid;
     x = path.join('Reports', 'Auth',uniqid.toString());
     return admin.database().ref(x).once("value", snapshot => {
     if (snapshot.exists()){
      console.log("exists!");
      var ID =snapshot.val();
     username=ID.username;
     password=ID.password;
      if(user == username && passkey==password)
      {agent.add('Welcome to HealthVault'+' '+ username);
       agent.setFollowupEvent('example');
   }
     else {agent.add('invalid user');} 
   }
     else
     agent.add("fail");
});
 }
  function pulsesaveHandler(agent){
       if(username != '0' && password !='0')
     {const value = agent.parameters.pulse_val;
      var test1 = value.toString() +" @"+datetime.toISOString().slice(0,10);
      test1.toString();
      var pulsepath = path.join(x.toString(),'pulsevalues');
      agent.add('Entered pulse rate is: '+value);
     return admin.database().ref(pulsepath).push({pulse_rate: test1}).then((snapshot) => {
     agent.add('Database write successful ! ');
  });}
      else agent.add("please login first");
  }
  function weightsaveHandler(agent){
     if(username != '0' && password !='0')
     { const value = agent.parameters.number;
    var test1 = value.toString() +" @"+datetime.toISOString().slice(0,10);
    test1.toString();
    weightpath = path.join(x.toString(),'weights');
     agent.add('Entered weight in Kilogram is: '+value);
    return admin.database().ref(weightpath).push({weightvalue: test1}).then((snapshot) => {
    agent.add('Database write successful ! ' );
    }).catch(err=>{
       agent.add("something wrong"+err);
   });}
    else agent.add('please login first');
  }
  function rbssaveHandler(agent){
    if(username != '0' && password !='0')
     {
    const value = agent.parameters.number;
    var test1 = value.toString() + " @"+ datetime.toISOString().slice(0,10);
    test1.toString();
    var rbspath = path.join(x.toString(),'Rbloodsugar');
    agent.add('Entered random blood sugar value is: '+value);
    return admin.database().ref(rbspath).push({rbsvalue: test1}).then((snapshot) => {
    agent.add('Database write successful ! ');
    }).catch(err=>{
       agent.add("something wrong"+err);
   });}
    else agent.add("please login first !");
  }
   function fbssaveHandler(agent){
      if(username != '0' && password !='0')
     {
       const value = agent.parameters.number;
   	  var test1 = value.toString() +" @"+ datetime.toISOString().slice(0,10);
      test1.toString();
      var rbspath = path.join(x.toString(),'Fbloodsugar');
        agent.add('Entered Fasting blood suagar value is: '+value);
  	  return admin.database().ref(rbspath).push({fbsvalue: test1}).then((snapshot) => {
      agent.add('Database write successful ! ');
  });}
     else agent.add("please login first");
  }
   function bpsaveHandler(agent){
     if(username != '0' && password !='0')
     {
      bpval = agent.parameters.read_bp_val;
      var test1 = bpval.toString()+ " @"+ datetime.toISOString().slice(0,10);
      test1.toString();
      var bppath;
      bppath = path.join(x.toString(),'BPvalues');
       agent.add('Entered Blood Pressure value is: '+bpval);
      return admin.database().ref(bppath).push({BP: test1 }).then((snapshot) => {
      agent.add('Database write successful !: ');
      });}
      else agent.add("please login first");
    }
  function pulsereadHandler(agent)
{ if(username != '0' && password !='0')
     {pulsepath = path.join(x.toString(),'pulsevalues');
     return admin.database().ref(pulsepath).once("value").then((snapshot) => {
     var pulse_rate=snapshot.val();
     var keys =Object.keys(pulse_rate);
     console.log('number of value: '+keys);
     agent.add('number of value: '+keys.length);
    var pulseval;
     var strstore = " ";
     for (var i=0;i<keys.length;i++) {
      var r=keys[i];
      pulseval=pulse_rate[r].pulse_rate;
      strstore += " " + pulseval + ",";
     } 
    agent.add('Pulse values: '+ strstore); 
   })
       .catch(err=>{
       agent.add("something wrong"+err);
   }) ;}
         else agent.add("please login first");
}

  function weightreadHandler(agent)
{ if(username != '0' && password !='0')
     {
     var weightpath = path.join(x.toString(),'weights');
     return admin.database().ref(weightpath).once("value").then((snapshot) => {
     var weights=snapshot.val();
     var keys =Object.keys(weights);
     console.log('value'+keys);
     agent.add('number of values: '+keys.length);
 var weightval;
     var strstore = " ";
     for (var i=0;i<keys.length;i++) {
      var r=keys[i];
      weightval=weights[r].weightvalue.toString();
      strstore += " " + weightval + ",";
     } 
    agent.add('Weight values: '+ strstore); 
   })
       .catch(err=>{
       agent.add("something wrong"+err);
   });}
       else agent.add('please login first');
     }
  function rbsreadHandler(agent)
  { if(username != '0' && password !='0')
     {
       rbspath = path.join(x.toString(),'Rbloodsugar');
     return admin.database().ref(rbspath).once("value").then((snapshot) => {
     var rbs=snapshot.val();
     var keys =Object.keys(rbs);
     console.log('value'+keys);
     agent.add('number of values: '+keys.length);
     var rbsval;
     var strstore = " ";
     for (var i=0;i<keys.length;i++) {
      var r=keys[i];
      rbsval=rbs[r].rbsvalue.toString();
      strstore += " " + rbsval + ",";
     } 
    agent.add('Random blood Sugar values:'+ strstore); 
   })
       .catch(err=>{
       agent.add("something wrong"+err);
   }) ;}
   else agent.add('please login first!');
  }
   function fbsreadHandler(agent)
{  if(username != '0' && password !='0')
     {
       fbspath = path.join(x.toString(),'Fbloodsugar');
  return admin.database().ref(fbspath).once("value").then((snapshot) => {
     var fbs=snapshot.val();
     var keys =Object.keys(fbs);
     console.log('no of values:'+keys);
     agent.add('number of values: '+keys.length);
  	 var fbsval;
     var strstore = " ";
     for (var i=0;i<keys.length;i++) {
      var r=keys[i];
      fbsval=fbs[r].fbsvalue.toString();
      strstore += " " + fbsval + ",";
     } 
    agent.add('Fasting blood Sugar values:'+ strstore); 
   })
       .catch(err=>{
       agent.add("something wrong"+err);
   });}
 else agent.add('please login first!');
}
  function bpreadHandler(agent)
  {  if(username != '0' && password !='0')
     {
       bppath = path.join(x.toString(),'BPvalues');
     return admin.database().ref(bppath).once("value").then((snapshot) => {
     var bp=snapshot.val();
     var keys =Object.keys(bp);
     console.log('value'+keys);
     agent.add('number of values: '+keys.length);
     var bpvalue;
     var strstore = " ";
     for (var i=0;i<keys.length;i++) {
      var r=keys[i];
      bpvalue=bp[r].BP;
      strstore += " " + bpvalue + ",";
     } 
    agent.add('Blood pressure values:'+ strstore); 
   })
       .catch(err=>{
       agent.add("something wrong"+err);
   });}
  else  {agent.add('please login first');}
}
   function alldataHandler(agent)
  { agent.add("  "+ fbsreadHandler()+" "+pulsereadHandler()); 
  }
  let intentMap = new Map();
   intentMap.set('Auth', AuthHandler);
   intentMap.set('store_BP', bpsaveHandler);
   intentMap.set('bpdata',bpreadHandler);
   intentMap.set('store_pulse', pulsesaveHandler);
   intentMap.set('pulsedata', pulsereadHandler);
   intentMap.set('store_weight', weightsaveHandler);
   intentMap.set('weightdata', weightreadHandler);
   intentMap.set('store_RBS', rbssaveHandler);
   intentMap.set('rbsdata', rbsreadHandler);
   intentMap.set('store_FBS', fbssaveHandler);
   intentMap.set('fbsdata', fbsreadHandler);
   intentMap.set('logout', logoutHandler);
  agent.handleRequest(intentMap);
});
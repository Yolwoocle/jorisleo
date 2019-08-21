const express = require('express');
const app = express(); 
var randomNum

app.use(express.static('dist')); 

app.get('/',function(req,res){
    res.sendFile(__dirname + '/dist/main.js');  
})

var theMax = 9;
randomNum = getRndInteger(1,theMax);
app.listen(3000,function(){

switch (randomNum){
    case 1:
    console.log('Achievement get : faire fonctionner ton code');
        break;
    
    case 2:
    console.log("Le point-virgule n'est pas nécessaire en JS !");
        break;

    case 3:
    console.log('Papi est très fier de toi!');
        break;

    case 4:
    console.log("Ne confonds jamais Java et JavaScript!");
        break;

    case 5:
        console.log("5 fruits et légumes par jour pour garder la forme !");
        break;  
        
    case 6:
        console.log("Ne dépense pas tes diamants sur une houe !");
        break;

    case 7:
        console.log("Le singulier de spaghetti est spaghetto !");

    case 8:
        console.log("Un neutron est composé de 1 quark up et 2 quarks down !");

    case theMax:
    console.log("Une array commence toujours par 0!");
            break;        

    default :
    console.log('ERROR SPLASH MESSAGE');
        break;

}});

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
/*
  ░░░░░░░░░░░░░░░░██████████████████
  ░░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░████
  ░░░░░░░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░░██
  ░░░░░░░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░░██
  ░░░░░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
  ░░░░░░░░██░░░░░░░░░░░░░░░░░░░░██████░░░░██
  ░░░░░░░░██░░░░░░░░░░░░░░░░░░░░██████░░░░██
  ░░░░░░░░██░░░░██████░░░░██░░░░██████░░░░██
  ░░░░░░░░░░██░░░░░░░░░░██████░░░░░░░░░░██
  ░░░░░░░░████░░██░░░░░░░░░░░░░░░░░░██░░████
  ░░░░░░░░██░░░░██████████████████████░░░░██
  ░░░░░░░░██░░░░░░██░░██░░██░░██░░██░░░░░░██
  ░░░░░░░░░░████░░░░██████████████░░░░████
  ░░░░░░░░██████████░░░░░░░░░░░░░░██████████
  ░░░░░░██░░██████████████████████████████░░██
  ░░░░████░░██░░░░██░░░░░░██░░░░░░██░░░░██░░████
  ░░░░██░░░░░░██░░░░██████░░██████░░░░██░░░░░░██
  ░░██░░░░████░░██████░░░░██░░░░██████░░████░░░░██
  ░░██░░░░░░░░██░░░░██░░░░░░░░░░██░░░░██░░░░░░░░██
  ░░██░░░░░░░░░░██░░██░░░░░░░░░░██░░██░░░░░░░░░░██
  ░░░░██░░░░░░██░░░░████░░░░░░████░░░░██░░░░░░██
  ░░░░░░████░░██░░░░██░░░░░░░░░░██░░░░██░░████
  ░░░░░░░░██████░░░░██████████████░░░░██████
  ░░░░░░░░░░████░░░░██████████████░░░░████
  ░░░░░░░░██████████████████████████████████
  ░░░░░░░░████████████████░░████████████████
  ░░░░░░░░░░████████████░░░░░░████████████
  ░░░░░░██████░░░░░░░░██░░░░░░██░░░░░░░░██████
  ░░░░░░██░░░░░░░░░░████░░░░░░████░░░░░░░░░░██
  ░░░░░░░░██████████░░░░░░░░░░░░░░██████████ */
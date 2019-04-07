'use strict';

//Item array
//Taken from Jeff
var productArray = [
  ['Bag', 'bag', './img/bag.jpg'],
  ['Banana', 'banana', './img/banana.jpg'],
  ['Bathroom', 'bathroom', './img/bathroom.jpg'],
  ['Boots', 'boots', './img/boots.jpg'],
  ['Breakfast', 'breakfast', './img/breakfast.jpg'],
  ['Bubblegum', 'bubblegum', './img/bubblegum.jpg'],
  ['Chair', 'chair', './img/chair.jpg'],
  ['Cthulhu', 'cthulhu', './img/cthulhu.jpg'],
  ['Dog and Duck', 'dogDuck', './img/dog-duck.jpg'],
  ['Dragon', 'dragon', './img/dragon.jpg'],
  ['Pen', 'pen', './img/pen.jpg'],
  ['Pet Sweep', 'petSweep', './img/pet-sweep.jpg'],
  ['Scissors', 'scissors', './img/scissors.jpg'],
  ['Shark', 'shark', './img/shark.jpg'],
  ['Sweep', 'sweep', './img/sweep.png'],
  ['Tauntaun', 'tauntaun', './img/tauntaun.jpg'],
  ['Unicorn', 'unicorn', './img/unicorn.jpg'],
  ['Usb', 'usb', './img/usb.gif'],
  ['Water Can', 'waterCan', './img/water-can.jpg'],
  ['Wine Glass', 'wineGlass', './img/wine-glass.jpg'],
];
//global variables!
var productContainer = document.getElementById('container');
var clicks = 0;
var ITEMS = {};
var currentItems = [];
var itemName = '';
var pastItems =[];
var stateKey = 'voteStatus';
var stateObject = {
  clicks: 0,
  pastItems: [],
  currentItems: [],
};

/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                    The Constructor                    |*/
/*---------------------------------------------------------*/
function Item (name, htmlTag, imageLocation){
  this.name = name;
  this.htmlTag = htmlTag;
  this.imageLocation = imageLocation;
  this.itemView = this.itemVote = 0;

  ITEMS[this.htmlTag] = this;
}
/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                      The Renderer                     |*/
/*---------------------------------------------------------*/
Item.prototype.render = function(parentId){
  var parent = document.getElementById(parentId);

  var img = document.createElement('img');
  img.setAttribute('id', this.htmlTag);
  img.setAttribute('src', this.imageLocation);
  img.setAttribute('class', 'product');

  parent.appendChild(img);
};
/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                        Voting                         |*/
/*---------------------------------------------------------*/
Item.prototype.vote = function(){
  return this.itemView / this.itemVote;
};

/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                    The click event                    |*/
/*---------------------------------------------------------*/
function handleClick(e) {
  e.preventDefault();

  if (e.target.className === 'product'){
    clicks++;
    ITEMS[e.target.id].itemVote++;
    stateObject.clicks = clicks;
    itemName = ITEMS[event.target.id].htmlTag;

    stateObject[itemName] = ITEMS[event.target.id].clicks;
    setter();
    for(var i = 0; i < 3; i++){
      var itemDivHolder = document.getElementById(`item${i}`);
      itemDivHolder.removeChild(itemDivHolder.lastChild);
    }

    addCurrentImages();
    if(clicks > 24){
      productContainer.removeEventListener('click', handleClick);
      createList();
      setter();
      return;
    }
  }
}
/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                      Random Image                     |*/
/*---------------------------------------------------------*/
function randomImageSelector(){
  //Taken from Jeff during paired programming assignment
  currentItems = [];

  while (currentItems[2] === undefined) {
    var randomNum = Math.floor(Math.random() * productArray.length);

    if(pastItems.includes(randomNum)){
      randomImageSelector();
    }else if(currentItems.includes(randomNum)){
      randomImageSelector();
    }else{
      currentItems.push(randomNum);
    }
  }
  pastItems = currentItems;
  stateObject.currentItems = currentItems;
  stateObject.pastItems = pastItems;

}
/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|              Adding the Images to the Page            |*/
/*---------------------------------------------------------*/
function addCurrentImages(){
  setter();
  randomImageSelector();
  for( var i = 0; i < currentItems.length; i++) {
    ITEMS[productArray[currentItems[i]][1]].render(`item${i}`);
  }
  
}
/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|            Create a list and append the list          |*/
/*---------------------------------------------------------*/
function createList (){
  var j = 0;
  var orderedListTag = document.getElementById('listDisplay');
  while (j < productArray.length){
    var listItem = document.createElement('li');
    listItem.textContent = `${ITEMS[productArray[j][1]].itemVote} votes for ${ITEMS[productArray[j][1]].name}`;
    orderedListTag.appendChild(listItem);
    j++;
  }
  createChart();
}
/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                    Create the Chart                   |*/
/*---------------------------------------------------------*/
function createChart () {
  var ctx = document.getElementById('chartBody').getContext('2d');
  var keys = Object.keys(ITEMS);
  
  var voteData = [];
  var productNames = [];
  for (var k = 0; k < keys.length; k++){
    voteData.push(ITEMS[keys[k]].itemVote);
    productNames.push(ITEMS[keys[k]].name);
  }
  var colors = [
    'rgb(200,200,200)',
    'rgb(20,120,98)',
    'rgb(130,6,17)',
    'rgb(75,0,160)',
    'rgb(90,123,160)',
    'rgb(250,1,45)',
    'rgb(55,190,2)',
    'rgb(160,200,30)',
    'rgb(100,14,200)',
    'rgb(155,200,20)',
    'rgb(199,54,99)',
    'rgb(9,99,199)',
    'rgb(2,22,222)',
    'rgb(69,134,89)',
    'rgb(76,13,0)',
    'rgb(54,253,56)',
    'rgb(78,94,215)',
    'rgb(43,222,23)',
    'rgb(65,43,34)',
    'rgb(243,35,63)',
  ];
  var dataSetItem = {
    data: voteData,
    backgroundColor: colors,
  };
  var metaData = {labels: productNames,
    datasets: [dataSetItem]
  };
  

  var chartBody = new Chart(ctx, {
    type:  'bar',
    data: metaData,
    options: {
      title: {
        display: true,
        text: 'Products and amount Voted'
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    },
  });
  new Chart(ctx, chartBody);
}
/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                        The Setter                     |*/
/*---------------------------------------------------------*/
function setter() {
  localStorage.setItem(stateKey, JSON.stringify(stateObject));
}
/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                        The Getter                     |*/
/*---------------------------------------------------------*/
function gitter() {
  //from Jeffs Code with help from Jeff
  var rawState = localStorage.getItem(stateKey);
  stateObject = JSON.parse(rawState);
  
  currentItems = stateObject.currentItems;
  pastItems = stateObject.pastItems;
  clicks = stateObject.clicks;

  for(var i = 0; i < productArray.length; i++){

    itemName = productArray[i][1];
    if(isNaN(stateObject[itemName])){
      ITEMS[productArray[i][1]].clicks = 0;
    }else{
      ITEMS[productArray[i][1]].clicks = stateObject[itemName];
    }
  }

}

/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                   DO ALL THE THINGS                   |*/
/*---------------------------------------------------------*/
//Stuff I don't know what to do with that seems important! Maybe put it in a starter function

//click event
productContainer.addEventListener('click', handleClick);

//Places the images
for (var i = 0; i < productArray.length; i++) {
  new Item(productArray[i][0], productArray[i][1], productArray[i][2]);
}

//Starts everything!
addCurrentImages();

/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                     Future Ideas                      |*/
/*---------------------------------------------------------*/

/*
  1. Orginize bar chart horizontally
  2. Use random numbers to generate colors
  3. Orginize Data in decreasing order
  4. Increase sample size
  5. After 100 clicks divide votes in 2
  6. Create 2 functions called Test and Learning
  7. Pridict votes
  8. Profit!
  */

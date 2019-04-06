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
//local or global I dont know which
var productContainer = document.getElementById('container');
var clicks = 0;
var ITEMS = {};
var currentItems = [];
var pastItems =[];
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
    for(var i = 0; i < 3; i++){
      var itemDivHolder = document.getElementById(`item${i}`);
      itemDivHolder.removeChild(itemDivHolder.lastChild);
    }
    addCurrentImages();
    if(clicks > 24){
      productContainer.removeEventListener('click', handleClick);
      createList(clicks);
    }
  }
  return clicks;
}
/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|                      Random Image                     |*/
/*---------------------------------------------------------*/
function randomImageSelector(){
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

}
/*---------------------------------------------------------*/
/*|                   Function handling:                  |*/
/*|              Adding the Images to the Page            |*/
/*---------------------------------------------------------*/
function addCurrentImages(){
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
    console.log(ITEMS[productArray[j][1]].name);
    listItem.textContent = `${ITEMS[productArray[j][1]].itemVote} votes for ${ITEMS[productArray[j][1]].name}`;
    orderedListTag.appendChild(listItem);
    j++;
  }
  console.log('hello from createList!');
}


//Stuff I don't know what to do with!

//click event
productContainer.addEventListener('click', handleClick);

//Places the images
for (var i = 0; i < productArray.length; i++) {
  new Item(productArray[i][0], productArray[i][1], productArray[i][2]);
}
addCurrentImages();

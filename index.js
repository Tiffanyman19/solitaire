'use strict'

let DEBUG = false;
const values = ["A", "2", "3","4", "5", "6", "7","8", "9", "10", "J","Q", "K"];
const suits = ["♠", "♣", "♦", "♥"];
const stuckdeck = document.querySelector("#stuck-deck");
const dealtdeck = document.querySelector("#dealt-deck");

// Create Deck
let deck = new Array();
for(let suit = 0; suit < suits.length; suit++){
  for(let value = 0; value < values.length; value++){
    deck.push(new Card(suits[suit], values[value]));
  }
}
console.log("CREATED DECK")
console.log(deck)
// Shuffle
deck = shuffle(deck);
// deck = deck.reverse();console.log("USING THE REVERSED DECK")

function shuffle(deck){
  let newDeck = new Array(deck.length);
  newDeck.fill(0);
  for(let card of deck){
    let spot = Math.floor(Math.random() * deck.length);
    while(newDeck[spot]){ 
      // if the newDeck[spot] has a value, then generate a new spot
      // I would like to make this better, but computers are fast enough
      spot = Math.floor(Math.random() * deck.length)
    }
    newDeck[spot] = card;
  }
  console.log("NEW DECK")
  console.log(newDeck)
  return newDeck;
}
console.log("SHUFFLED DECK")
console.log(deck)


// Deal Cards
deck.forEach(card => {console.log(card);stuckdeck.appendChild(card)});
console.log("CARDS DEALT TO STUCK DECK");

// Deal to other decks

dealToColumns()
function dealToColumns(){
  // Deal one facedown card to each column if the current number <= facedown number
  let cards = stuckdeck.querySelectorAll(".card");
  let columnDecks = document.querySelectorAll("#columns > .deck");
  let currentCard = cards.length - 1;

  // Then deal successive cards to the bottom of the pile
  
  for(let deck of columnDecks){
    let facedowns = parseInt(deck.dataset.facedowns);
    let count = 0;
    while(count < facedowns + 1){
      count++;
      let topCard = cards[currentCard];
      currentCard--;
      lastElement(deck).appendChild(topCard);
    }

    console.log("CARDS DEALT TO COLUMNS");
    
    console.log("FLIPPING BOTTOM CARDS");
    lastElement(deck).draggable = true;
    lastElement(deck).dataset.facedown = false;
  }
}

function lastElement(element){
  let type = element.dataset.type;
  let count = element.childElementCount;
  // console.log({element,type,count,element.childNodes})
  if(type == "deck"){
    if(count == 0){
      return element;
    } else {
      return lastElement(element.lastElementChild)
    }
  } else if(type == "card"){
    if(count > 1){
      return lastElement(element.lastElementChild);
    } else {
      return element;
    }
  } else {
    console.error("Last Element Not Given A Card Or Deck");
  }
}


const cards = document.querySelectorAll(".card");
const decks = document.querySelectorAll(".deck");
const columnDecks = document.querySelectorAll("#columns > .deck");
const pileDecks = document.querySelectorAll("#piles > .deck");
let dragged = null;

[...cards].forEach(card=>{
  card.addEventListener("dragstart", dragstart);
})

function dragstart(event){
  dragged = event.target;
};

[...decks].forEach(deck=>{
  deck.addEventListener("dragover", preventDefault);
  deck.addEventListener("drop", drop);
})




function preventDefault(event){
  event.preventDefault();
}


function drop(event){
  let target = event.target;
  if(target.dataset.suit == dragged.dataset.suit && target.dataset.value == dragged.dataset.value){
    console.log("SAME")
    return
  }
  
  
  console.log("profiling drop")
  console.log("target")
  console.log(target)
  console.log("deck : this")
  console.log(this)
  if(target.nodeName == "P"){
    target = target.parentNode;
  }
  let type = target.dataset.type;

  if(this.parentNode.id == "stuck-decks"){
    console.log("Tried to put a card on a stuck deck")
    return
  }

  if(this.parentNode.id == "piles"){
    let thisSuit = this.dataset.pilesuit;
    let cardSuit = dragged.dataset.suit;
    if(dragged.childElementCount > 1){
      // if there's more than a text node
      console.log("Can't put more than one card on a suit pile")
      return
    }
    console.log(thisSuit)
    if(thisSuit != "null"){
      console.log("Has a suit")
      if(thisSuit == cardSuit){
        // check that the card is the next increment
        console.log(values.indexOf(dragged.dataset.value))
        console.log(values.indexOf(target.dataset.value))
        if(values.indexOf(target.dataset.value) + 1 == values.indexOf(dragged.dataset.value) ){
          this.appendChild(dragged);    
        }
      }
    } else {
      // check that the card is an ace
      console.log("No suit")
      if(dragged.dataset.value == "A"){
        this.dataset.pilesuit = cardSuit;
        this.appendChild(dragged);           
      }
    }
  }

  if(this.parentNode.id == "columns"){
    if(type == "deck" ){
      if(target.childElementCount == 0){
        target.appendChild(dragged);      
      }
    }
    if(type  == "card" ){
      let indexOfDragged = values.indexOf(dragged.dataset.value);
      let indexOfTarget = values.indexOf(target.dataset.value);
      if(!DEBUG){
        if((indexOfTarget - 1 == indexOfDragged)){    
          // Check descending value
          if(dragged.dataset.colour != target.dataset.colour){
            lastElement(target).appendChild(dragged);
          }
        } else {
          console.log(`Can't put ${dragged.dataset.value} on ${target.dataset.value}. Try dragging a ${values[indexOfTarget - 1]}`)
        }
      } else {lastElement(target).appendChild(dragged);}
    }
  }

  // Checking bottom cards to flip
  [...columnDecks].forEach(deck => {
    let bottomCard = lastElement(deck);
    if(bottomCard.dataset.facedown == "true"){
      console.log("Flip")
      bottomCard.dataset.facedown = "false";
      bottomCard.draggable = true;
  }})

  let completedPiles = 0;
  pileDecks.forEach(deck=>{
    if(deck.childElementCount == 0){
      deck.dataset.pilesuit = null;
    }
    if(deck.lastElementChild.dataset.value == "K"){
      completedPiles++
    }
  });
  console.log("Completed Piles: "+completedPiles);
  if(completedPiles == 4){
    victory(); // This is from the victory.js file
  }
};

function Card(suit, value){
  let card = document.createElement("div");
  let p = document.createElement("p");
  p.classList.add("unselectable");
  let text = document.createTextNode(value + "" + suit);
  card.classList.add("card")
  p.appendChild(text);
  card.appendChild(p)
  card.dataset.suit = suit;
  switch(suit){
    case "♠": card.dataset.colour = "black";break;
    case "♣": card.dataset.colour = "black";break;
    case "♦": card.dataset.colour = "red";break;
    case "♥": card.dataset.colour = "red";break;
  }
  card.dataset.value = value;
  card.dataset.facedown = true;
  card.dataset.type = "card";
  card.draggable = false;
  return card;
}

stuckdeck.addEventListener("click", event=>{
  console.log("CLICKED STUCK DECK")
  let cards = stuckdeck.querySelectorAll(".card");
  console.log(cards)
  if(cards.length){
    let topCard = cards[cards.length - 1];
    topCard.dataset.facedown = false;
    topCard.draggable = true;
    dealtdeck.appendChild(topCard);
  } else {
    cards = dealtdeck.querySelectorAll(".card")
    for(let index = cards.length - 1; index >= 0; index-- ){
      cards[index].dataset.facedown = true;
      cards[index].draggable = false;
      stuckdeck.appendChild(cards[index]);
    }
  }
})
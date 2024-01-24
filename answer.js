function solve(){
    console.log("SOLVE")
    let cards = document.querySelectorAll(".card");
    // console.log(cards);
    let piles = document.querySelectorAll("#piles .deck");
    // console.log(piles);
    let compareFunction = (a, b) => {return values.indexOf(a.dataset.value) > values.indexOf(b.dataset.value)};

    let spades = [...cards].filter(card => card.dataset.suit == suits[0])
    spades = spades.sort(compareFunction);
    let clubs = [...cards].filter(card => card.dataset.suit == suits[1])
    console.log("UNSORTED")
    console.log(clubs)
    clubs = clubs.sort(compareFunction);
    console.log("SORTED")
    console.log(clubs)
    let diamonds = [...cards].filter(card => card.dataset.suit == suits[2])
    diamonds = diamonds.sort(compareFunction);
    let hearts = [...cards].filter(card => card.dataset.suit == suits[3])
    hearts = hearts.sort(compareFunction);
    let mySuits = [spades, clubs, diamonds, hearts];
    for(let i = 0; i < piles.length; i++){
        let pile = piles[i];
        let suit = mySuits[i];
        pile.dataset.pilesuit = suits[i];
        console.log(pile);
        console.log(suit)
        for(let index = 0; index < 13; index++){
            // console.log(index);
            let card = suit[index];
            // console.log(card)
            card.dataset.facedown = false;
            card.draggable = true;
            pile.appendChild(card);
        }
    }
    let extraSpace = document.querySelectorAll("#columns .deck")[4];
    extraSpace.appendChild(clubs[12]);
}
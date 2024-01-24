let floor = 600;
let rightWall;
let gravity;
let maxSpeed = 100;
let animateFlag = true;

function victory(){
    console.log("++++ VICTORY ++++")
    let piles = document.querySelectorAll("#piles .deck");
    let cards = [];
    for(let i = 0; i < 13; i++){
        for(let j = 0; j < 4; j++){
            cards.unshift(piles[j].childNodes[i])
        }
    }
    let activeCards = cards.map(card => new ActiveCard(card, card.offsetLeft + 3, card.scrollHeight));


    activeCards[0].log = true;
    activeCards[activeCards.length - 1].lastCard = true;

    let timeout = 1000;
    activeCards.forEach(card => {setTimeout(card.flipflag.bind(card), timeout); timeout+=1000});

    let keyTime = 0;

    function animate(time){
        //console.log(time)
        activeCards.forEach(card => card.update(card));
        if(time - keyTime > 1){
            activeCards.forEach(card => card.draw(card));
            keyTime = time;
        }
        //if(time > 10000){return}
        if(animateFlag){
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

class ActiveCard{
    constructor(card, x = 1200, y = 100){
        this.flag = false;
        this.log = false;
        this.card = card;
        this.x = x;
        this.y = y;
        this.upForce = 0;
        this.downForce = 0;
        this.vertical = Math.floor(Math.random() * 15) + 3; // the constant leftward speed, but randomised to give it a varied feel.
    }
    update(){
        //console.log(this.flag)
        if(this.flag == true){
            this.card.remove()
            // Physics logic
            this.x -= this.vertical;
            this.downForce += (maxSpeed - this.downForce) / maxSpeed
            this.y = this.y + ( this.downForce + this.upForce)
            this.upForce *= 0.9;

            if(this.y > 600){
                // bounce
                this.y = 600;
                this.upForce = -this.downForce;
                this.downForce = 0;
            }

            if(this.x < -100){
                //console.info(this)
                this.flag = false;
                if(this.lastCard){
                    // SOMETHING AS A FLAIR
                    document.querySelector("#afterEffect").style.display = "flex"
                    animateFlag = false
                }
            }
        }
    }
    draw(){
        if(this.log){
            console.log(this)
        }
        if(this.flag == true){
            let newCard = this.card.cloneNode(true);
            newCard.style.position = "absolute";
            newCard.style.top = this.y + "px";
            newCard.style.left = this.x + "px";
            document.body.appendChild(newCard);
            setTimeout(() => newCard.remove(), 1000);
        }
    }
    flipflag(){
        //console.log(this)
        this.flag = true;
    }
}

let count = 0;
document.querySelector("#afterEffect").addEventListener("animationiteration", ()=>{
    count++
    if(count == 2){
        document.querySelector("#reset").style.display = "block"
    }
})

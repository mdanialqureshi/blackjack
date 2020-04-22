const hit_btn = document.getElementById('hit');
//another way to do it.
const deal_btn = document.getElementById('deal');
const stand_btn = document.querySelector('#stand').addEventListener('click', () => {
    stand()
});
const user_score_span = document.getElementById('user-bj-result');
const dealer_score_span = document.getElementById('dealer-bj-result')
const game_msg_h2 = document.getElementById('result');
const wins_span = document.getElementById('win-num');
const loses_span = document.querySelector('#loss-num');
const draws_span = document.querySelector('#draw-num');
const hit_sound = new Audio('sounds/swish.m4a');
const lose_sound = new Audio('sounds/aww.mp3');
const win_sound = new Audio('sounds/cash.mp3');
const result_h3 = document.getElementById('result');

const blackjackGame = {
    "you": {
        'scoreSpan': "#user-bj-result",
        'board': "#user-board",
        'score': 0
    },
    "dealer": {
        'scoreSpan': "#dealer-bj-result",
        'board': "#dealer-board",
        'score': 0
    },
    "cards": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
    "suits": ["C", "D", "H", "S"],
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "isStand": false,
    "turnsOver": false,
}

// can also put this in blackJackGame object
const card_values = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: [1, 11], //make into 1 or 11
}

const YOU = blackjackGame.you;
const DEALER = blackjackGame["dealer"];


function main() {
    hit_btn.addEventListener('click', () => {
        hit();
    })
    deal_btn.addEventListener('click', () => {
        deal();
    })

}

main();

function hit() {
    if (!blackjackGame['isStand'] && YOU.score < 21) {
        showCard(YOU);
    }
}

function stand() {
    if (YOU.score != 0 && !blackjackGame.turnsOver) {
        blackjackGame.isStand = true;
        dealerLogic();
    }
}

function deal() {
    if (blackjackGame.turnsOver) {
        reset();
    }
}

function reset() {
    // remove all the images
    //this is an array
    let yourImages = document.querySelector(YOU['board']).querySelectorAll('img');
    let dealerImages = document.querySelector(DEALER['board']).querySelectorAll('img');
    yourImages.forEach(img => {
        img.remove();
    })
    dealerImages.forEach(img => {
        img.remove();
    })
    //make score 0
    YOU.score = 0;
    DEALER.score = 0;
    user_score_span.innerHTML = 0;
    dealer_score_span.innerHTML = 0;
    user_score_span.style.color = 'white';
    dealer_score_span.style.color = 'white';
    result_h3.innerHTML = "Lets Play!";
    result_h3.style.color = 'white';
    blackjackGame.isStand = false;
    blackjackGame.turnsOver = false;
}

function showCard(activePlayer) {
    let card = randomCard();
    updateScore(activePlayer, card);
    //if (activePlayer.score < 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer["board"]).appendChild(cardImage); //adds as block element
        hit_sound.play();
  //  }
}

// return a random suit and card
function randomCard() {
    return (blackjackGame.cards[Math.floor(Math.random() * blackjackGame.cards.length)]
        + blackjackGame.suits[Math.floor(Math.random() * blackjackGame.suits.length)])
}

function updateScore(activePlayer, card) {
    if (card[0] == "A") {
        if (activePlayer.score + card_values['A'][1] <= 21) {
            activePlayer.score += card_values['A'][1]
        } else {
            activePlayer.score += card_values['A'][0];
        }
    } else {
        if (card[1] == "0") { //case for 10
            activePlayer.score += card_values[10]
        } else {
            activePlayer.score += card_values[card[0]]
        }
    }
    if (activePlayer.score > 21) {
        document.querySelector(activePlayer.scoreSpan).innerHTML = " BUST! 💩"
        document.querySelector(activePlayer.scoreSpan).style.color = 'red';
    } else {
        document.querySelector(activePlayer.scoreSpan).innerHTML = activePlayer.score
    }
}

function sleep(ms) { //sleep function
    return new Promise(resolve => setTimeout(resolve,ms))
}

//async function meaning code is not running linearly. 
// every second the computer is waiting the browser freezes if the computer is waiting
// the async function allows it to not run linearly rather in parralel. 
async function dealerLogic() {
    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        showCard(DEALER);
        await sleep(1000);
    }


    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    if (blackjackGame['turnsOver']) {
        showResult(winner);
    }
}

function computeWinner() {
    let winner;
    let userScore = YOU['score'];
    let dealerScore = DEALER['score'];

    if (YOU['score'] <= 21) { // user score is less than 21
        // higher score than dealer or dealer busts
        if ((userScore > dealerScore) || (dealerScore > 21)) {
            winner = YOU;
        } else if (userScore < dealerScore) {
            winner = DEALER;
        } else if (dealerScore === userScore) {
        }
    } else if (userScore > 21 && dealerScore <= 21) { // user busts dealer doest
        winner = DEALER;
    } else if (userScore > 21 && dealerScore > 21) { //both bust
    }
    return winner;
}

function showResult(winner) {
    let message, messageColor;
    if (winner == YOU) {
        message = "You Won!";
        messageColor = 'green';
        win_sound.play();
        blackjackGame['wins']++;
    } else if (winner == DEALER) {
        messageColor = 'red';
        message = 'You Lost!';
        lose_sound.play();
        blackjackGame['losses']++;
    } else {
        message = 'It\'s a draw!';
        messageColor = 'lightblue';
        blackjackGame['draws']++;
    }
    document.querySelector("#result").textContent = message;
    document.querySelector("#result").style.color = messageColor;
    wins_span.innerHTML = blackjackGame['wins'];
    loses_span.innerHTML = blackjackGame['losses'];
    draws_span.innerHTML = blackjackGame['draws'];
}
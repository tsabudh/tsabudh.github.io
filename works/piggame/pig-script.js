'use strict';

const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');

const diceEl = document.querySelector('.dice');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const current0El = document.querySelector('#current--0');
const current1El = document.querySelector('#current--1');
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const newGame = document.querySelector('.btn--new');

let playing = true;
let score1 = 0;
let score0 = 0;
let currentScore = 0;
let activeplayer = 0;
let scorelimit = 100;

//Initial score is 0
score0El.textContent = 0;
score1El.textContent = 0;

//Hide the dice
diceEl.classList.add('hidden');

//Add random dice roll event on "roll dice " button

btnRoll.addEventListener('click', function () {
  if (playing) {
    let dice = Math.trunc(Math.random() * 6 + 1);
    diceEl.src = `diceimages/dice-${dice}.png`;
    diceEl.classList.remove('hidden');

    //If dice is not 1 add the dice to score

    if (dice != 1) {
      currentScore += dice;
      document.getElementById(`current--${activeplayer}`).textContent =
        currentScore;
    } else {
      currentScore = 0;
      document.getElementById(`current--${activeplayer}`).textContent =
        currentScore;
      activeplayer = activeplayer === 0 ? 1 : 0;
      player0.classList.toggle('player--active');
      player1.classList.toggle('player--active');
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    if (activeplayer == 0) score0 += currentScore;
    else score1 += currentScore;

    score0El.textContent = score0;
    score1El.textContent = score1;

    if (score0 >= scorelimit) {
      //Player 1 wins
      player0.classList.add('player--winner');
      diceEl.classList.add('hidden');
      btnHold.classList.add('hidden');
      btnRoll.classList.add('hidden');
      playing = false;
    } else if (score1 >= scorelimit) {
      //Player 2 wins
      player1.classList.add('player--winner');
      diceEl.classList.add('hidden');
      btnHold.classList.add('hidden');
      btnRoll.classList.add('hidden');
      playing = false;
    }

    currentScore = 0;
    document.getElementById(`current--${activeplayer}`).textContent =
      currentScore;

    activeplayer = activeplayer === 0 ? 1 : 0;
    player0.classList.toggle('player--active');
    player1.classList.toggle('player--active');
  }
});

newGame.addEventListener('click', function () {
  currentScore = score0 = score1 = 0;
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = current1El.textContent = 0;
  player0.classList.remove('player--winner');
  player1.classList.remove('player--winner');
  player1.classList.remove('player--active');
  player0.classList.add('player--active');
  diceEl.classList.add('hidden');
  btnHold.classList.remove('hidden');
  btnRoll.classList.remove('hidden');
  playing = true;
});

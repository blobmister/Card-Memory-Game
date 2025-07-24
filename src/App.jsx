import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const characters = [
  "Mario",
  "Luigi",
  "Bowser",
  "Toad",
  "Wario",
  "Waluigi",
  "Princess Peach",
  "Yoshi",
  "Bowser Jr",
  "Rosalina",
  "Donkey Kong",
  "Princess Daisy"
];

function createCaracter(name) {
  return {name: name, clicked: 0};
}

function shuffleArray(array) {
  const shuffled = array.slice(); // copy array to avoid mutating original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap
  }
  return shuffled;
}

function Header() {
  return null;
}

async function Card({name, clickHandler}) {
  const apiReq = await fetch('https://super-mario-bros-character-api.onrender.com/api/%{name}')
  const data = await apiReq.json();

  return (
    <div className='card' onClick={clickHandler}>
      <img src='{data.image}'/>
      <p>{name}</p>
    </div>
  )
}

function Body({score, highScore, setScore, setHighScore}) {
  let [charAr, setCharAr] = useState(characters.map(chars => createCaracter(chars)));
  charAr = shuffleArray(charAr);

  let handleCardClick = function(name) {
    let clickedChar = charAr.filter(char => char.name === name);
    if (clickedChar.clicked === 0) {
      clickedChar.clicked = 1;
      setScore(prev => prev + 1);
    } else {
      if (score > highScore) {
        setHighScore(score);
      }
      setScore(0);
    }
    setCharAr(shuffleArray(charAr));
  };

  return (
    <div className='body'>
      {charAr.map((char) => {
        return <Card name={char.name} clickHandler={handleCardClick} key={char.name} />;
      })}
    </div>
  )
}

function App() {
  return (
    <div>
      <Header></Header>
      <Body></Body>
    </div>
  );
}

export default App

import { useState } from 'react'
import { useEffect } from 'react'
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

function shuffleArray(array) {
  const shuffled = array.slice(); // copy array to avoid mutating original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap
  }
  
  return shuffled;
}

function Header({score, highScore}) {
  return <div className='header'>
    <p>Card Game</p>
    <div className='stats'>
      <p>Score: {score}</p>
      <p>High Score: {highScore}</p>
    </div>
  </div>
}

function Card({name, clickHandler}) {
  const [image, setImage] = useState(null)

  useEffect(() => {
    async function fetchImage() {
      try {
        const res = await fetch(`https://super-mario-bros-character-api.onrender.com/api/${encodeURIComponent(name)}`);
        const data = await res.json();
        setImage(data.image);
      } catch (err) {
        console.error('Failed to fetch image {name}:', err);
      }
    }
    fetchImage();
  }, [name]);


  return (
    <div className='card' onClick={() => clickHandler(name)}>
      <p>{name}</p>
      <img src={image}/>
    </div>
  );
}

function Body({score, setScore, highScore, setHighScore}) {
  let [charAr, setCharAr] = useState(characters.map((chars) => ({name: chars, clicked: false})));

  const handleCardClick = (name) => {

    // Returns an updated charAr
    let didLose = false;
    const updated = charAr.map((char) => {
      if (char.name === name) {
        if (!char.clicked) {
          setScore(prev => prev + 1);
          return { ...char, clicked: true };
        } else {
          if (score > highScore) setHighScore(score);
          setScore(0);
          didLose = true;
        }
      }
      return char;
    });

    if (didLose) {
      updated = updated.map((char) => (char.clicked = false));
    }

    // Sets charAr to the updated one
    setCharAr(shuffleArray(updated));
  };

  return (
    <div className='content'>
      {charAr.map((char) => {
        return <Card name={char.name} clickHandler={handleCardClick} key={char.name} />;
      })}
    </div>
  );
}

function App() {
  let [score, setScore] = useState(0);
  let [highScore, setHighScore] = useState(0);

  return (
    <div className='app'>
      <Header score={score} highScore={highScore}></Header>
      <Body score={score} setScore={setScore} highScore={highScore} setHighScore={setHighScore}></Body>
    </div>
  );
}

export default App

import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import { Search } from './utils/searcher';
import { parseCards } from './utils/cardutils';
import cv from 'opencv-ts';


interface Deck {
  name: string
  characters: {
    [id: string]: number
  },
  actions: {
    [id: string]: number
  }
}


const GenshinTCGImporter: React.FC<{}> = () => {

  const [actionsSearcher, setActionsSearcher] = useState<Search>();
  const [charSearcher, setCharSearcher] = useState<Search>();

  const [deckName, setDeckName] = useState<string>("My Deck");
  const [deck, setDeck] = useState<Deck>();
  const [deckText, setDeckText] = useState<string>("");

  const [deckImageURL, setDeckImageURL] = useState<string>("");

  const init = () => {
    fetch('./characters_index.json')
      .then(response => response.json())
      .then(data => setCharSearcher(new Search(data)))
      .then(() => console.log("Fetched characters index"));
    fetch('./actions_index.json')
      .then(response => response.json())
      .then(data => setActionsSearcher(new Search(data)))
      .then(() => console.log("Fetched actions index"));
  }

  useEffect(() => { init() }, [])
  useEffect(() => { console.log(deck) }, [deck]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      return
    }
    const file = files[0]
    if (file.type !== "image/png") {
      let err = new TypeError(`Input file must be a PNG image!`);
      console.error(err);
      setDeckText(err.message);
      return;
    }
    setDeckImageURL(URL.createObjectURL(file));
  }

  const handleImageLoad = () => {
    console.log("Image loaded!");
    let queryMat = cv.imread('uploaded-image');

    if (charSearcher && actionsSearcher) {
      try {
        let [characters, actions] = parseCards(queryMat, charSearcher, actionsSearcher);
        let newDeck = { name: deckName, characters: characters, actions: actions };
        setDeck(newDeck);
        setDeckText(JSON.stringify(newDeck));
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setDeckText(err.message);
        }
      }
    }
  }

  return (
    <>
      <label>Deck name:</label> <input id="deckname" type="text" onChange={(e) => setDeckName(e.target.value)} />
      <br />
      <input id="file" type="file" onChange={handleFileChange} />
      <br />
      <img id="image-preview" src={deckImageURL} alt="" width={'600px'} height={'815px'} />
      <br />
      <textarea readOnly value={deckText} style={{ width: '50%', height: '12em' }}></textarea>
      <br />
      <button onClick={() => navigator.clipboard.writeText(deckText)}>Copy</button>


      {/* Dummy image to load in opencv */}
      <img id="uploaded-image" src={deckImageURL} alt="" onLoad={handleImageLoad} style={{ display: 'none' }} />

    </>
  )

}

function App() {
  return (
    <div className="App">
      <div>
        <GenshinTCGImporter />
      </div>
    </div>
  );
}

export default App;

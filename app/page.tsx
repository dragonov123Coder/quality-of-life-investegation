"use client";

import React, { useState } from 'react';

interface Protagonist {
  name: string;
  age: number;
  gender: string;
  balance: number;
  social_credit: number;
  health_percent: number;
  inventory: string[];
}

const initialProtagonist: Protagonist = {
  name: "Henry",
  age: 13,
  gender: "boy",
  balance: 120,
  social_credit: 700,
  health_percent: 85,
  inventory: []
};

interface Scene {
  text: string | ((state: Protagonist) => string);
  hasChoice: boolean;
  onYes?: (state: Protagonist) => Protagonist;
  onNo?: (state: Protagonist) => Protagonist;
  onEnter?: (state: Protagonist) => Protagonist;
  nextScene: (state: Protagonist, choice?: boolean) => number | null;
  fact?: string;
}

// Scenes
const scenes: Scene[] = [
  // Scene 0: Intro
  {
    text: (state) => `${state.name} is a ${state.age}-year old ${state.gender}, who is living in poverty.\nYou will make choices that will impact ${state.name} in different ways.`,
    hasChoice: false,
    nextScene: () => 1,
  },
  // Scene 1: Fridge
  {
    text: "It's morning. You open your pantry, and see one box of cereal.\nDo you choose to eat it now? If so, you will have to buy lunch later.",
    hasChoice: true,
    onYes: (state) => ({ ...state, inventory: [...state.inventory, "breakfast"] }),
    onNo: (state) => ({ ...state, health_percent: state.health_percent - 5 }),
    nextScene: () => 2,
  },
  // Scene 2: Fridge result
  {
    text: (state) => state.inventory.includes("breakfast") ? "Your hunger is satisfied." : "You go on feeling hungry, saving your money.",
    hasChoice: false,
    nextScene: () => 3,
    fact: "FACT: Nearly 1 in 4 children in Canada lived in a food-insecure household recently, \nmeaning they didn't always have enough food for a healthy diet.",
  },
  // Scene 3: Wardrobe
  {
    text: "You head over to your wardrobe. All you see is last year's jacket and a newer hoodie. \nThe hoodie is too thin for today's weather, but your friends will make fun of you for wearing that jacket.\nDo you wear last year's jacket?",
    hasChoice: true,
    onYes: (state) => ({ ...state, social_credit: state.social_credit - 120, inventory: [...state.inventory, "jacket"] }),
    onNo: (state) => ({ ...state, health_percent: state.health_percent - 10, inventory: [...state.inventory, "hoodie"] }),
    nextScene: () => 4,
  },
  // Scene 4: Wardrobe result
  {
    text: (state) => state.inventory.includes("jacket") ? "The jacket feels small, but you're happy that your health is fine." : "You wear the sweater to avoid being teased.",
    hasChoice: false,
    nextScene: () => 5,
    fact: "FACT: When income is limited, families must choose between essentials like warm clothing, \nfood, rent, or transport — all part of everyday hardship for children in poverty",
  },
  // Scene 5: Table
  {
    text: "You head over to your table. You see a broken pencil and ripped notebook. You wonder if you should take these, or ask the teacher for supplies.\nDo you live with these supplies?",
    hasChoice: true,
    onYes: (state) => ({ ...state, inventory: [...state.inventory, "broken-pencil"] }),
    onNo: (state) => state,
    nextScene: () => 6,
  },
  // Scene 6: Table result
  {
    text: (state) => state.inventory.includes("broken-pencil") ? "You take these materials." : "You'll ask for materials from the teacher later.",
    hasChoice: false,
    nextScene: () => 7,
    fact: "FACT: Kids in low-income families often struggle to afford school necessities, \nand poverty affects about 1 in 5 children in Canada.",
  },
  // Scene 7: Outside
  {
    text: "You step outside, sighing. Your school is far from you, and it'll take awhile to get there by walking.\nYou could instead use the money meant for lunch to take the bus.\nDo you take the bus?",
    hasChoice: true,
    onYes: (state) => ({ ...state, inventory: [...state.inventory, "ticket"], balance: state.balance - 5 }),
    onNo: (state) => {
      const newState = { ...state, social_credit: state.social_credit - 150 };
      if (!state.inventory.includes("breakfast")) newState.health_percent -= 5;
      return newState;
    },
    nextScene: () => 8,
  },
  // Scene 8: Outside result
  {
    text: (state) => {
      if (state.inventory.includes("ticket")) {
        return "You take the bus, costing you $5, and you arrive on time.";
      } else {
        let t = "You walk to school, ending up being an hour late. Your teacher sighs as you walk in.";
        if (!state.inventory.includes("breakfast")) t += "\nYou feel extra fatuiged by the 40 minute walk.";
        return t;
      }
    },
    hasChoice: false,
    nextScene: () => 9,
  },
  // Scene 9: Class
  {
    text: "In your next class, your teacher reminds you of the assingment due in a few days, and reccomends working at home.\nYou don't have internet and technology to work on this project. \nShould you ask for an extension?",
    hasChoice: true,
    onYes: (state) => ({ ...state, social_credit: state.social_credit - 100 }),
    onNo: (state) => ({ ...state, health_percent: state.health_percent - 10 }),
    nextScene: (state, choice) => choice ? 10 : 11,
  },
  // Scene 10: Class yes result
  {
    text: (state) => {
      let t = "You ask the teacher for an extention. You get sideyes from peers and the teachers sighs, \nbut she understands your situation and gives you an extension.";
      if (state.social_credit < 50) t += "\nYou're starting to get builled and teased by your peers...";
      return t;
    },
    hasChoice: false,
    nextScene: () => 12,
    fact: "FACT: Students without home internet or supplies may fall behind, a known education gap linked to poverty.",
  },
  // Scene 11: Class no result
  {
    text: "Your mental health suffers from the anxiety knowing you will have to find a way to complete your assignment.",
    hasChoice: false,
    nextScene: () => 12,
    fact: "FACT: Students without home internet or supplies may fall behind, a known education gap linked to poverty.",
  },
  // Scene 12: Break
  {
    text: (state) => {
      if (state.inventory.includes("ticket")) {
        return "It's break!\nYou don't have enough money with you to buy lunch. You suffer from hunger.";
      } else if (!state.inventory.includes("breakfast")) {
        return "It's break!\nYou enjoy a light snack.";
      } else {
        return "It's break!\nYou buy and enjoy a light snack.";
      }
    },
    hasChoice: false,
    onEnter: (state) => {
      if (state.inventory.includes("ticket")) {
        return { ...state, health_percent: state.health_percent - 15 };
      } else {
        return { ...state, health_percent: state.health_percent + 5, balance: state.balance - (state.inventory.includes("breakfast") ? 5 : 0) };
      }
    },
    nextScene: () => 13,
    fact: "FACT: Skipping meals is a reality for some children facing food insecurity.",
  },
  // Scene 13: Friends
  {
    text: "Your friends are going out tonight. The price is $50 if you want to come with them.\nWill you go?",
    hasChoice: true,
    onYes: (state) => ({ ...state, social_credit: state.social_credit + 150, balance: state.balance - 50 }),
    onNo: (state) => ({ ...state, social_credit: state.social_credit - 100 }),
    nextScene: () => 14,
  },
  // Scene 14: Friends result
  {
    text: (state) => state.balance < 120 ? "You and your friends had a great time!" : "You tell them that you can't come, and they sigh and walk away.",
    hasChoice: false,
    nextScene: () => 15,
  },
  // Scene 15: Home
  {
    text: "Your home feels messy, but you need to get grocieries. Should you clean up your home?",
    hasChoice: true,
    onYes: (state) => ({ ...state, health_percent: state.health_percent + 5 }),
    onNo: (state) => ({ ...state }),
    nextScene: (state, choice) => choice ? 16 : 17,
  },
  // Scene 16: Clean yes
  {
    text: "You feel great now that it's clean! However, you lose this time to get grocieres and will have to live with no food tomorrow.\n",
    hasChoice: false,
    nextScene: () => 19,
  },
  // Scene 17: Grocery
  {
    text: "You sigh, thinking there'll be time to clean up later, and walk to the grocerry store.\n\n~~~\n\nYou see a nice, healthy frozen dinner that will cost you $15, and a few unhealthy comfort foods that cost $5.\nShould you get the healthy meal?",
    hasChoice: true,
    onYes: (state) => ({ ...state, balance: state.balance - 30, inventory: [...state.inventory, "healthy-dinner"], health_percent: state.health_percent + 10 }),
    onNo: (state) => ({ ...state, balance: state.balance - 15, health_percent: state.health_percent - 10, inventory: [...state.inventory, "chips"] }),
    nextScene: () => 18,
  },
  // Scene 18: Meal
  {
    text: "~~~ You head home... ~~~\nYou enjoy your meal.",
    hasChoice: false,
    nextScene: () => 19,
  },
  // Scene 19: Sick
  {
    text: "You're feeling a bit sick.\n\nShould you take a day off?",
    hasChoice: true,
    onYes: (state) => ({ ...state, health_percent: state.health_percent + 25, social_credit: state.social_credit - 15 }),
    onNo: (state) => ({ ...state, health_percent: state.health_percent - 10 }),
    nextScene: () => 20,
  },
  // Scene 20: Final
  {
    text: "~~~\nNo matter the descision you take, you will always loose in the end.\n10-11% of children have to live in poverty.\n45% of children growing up in lone parent familes live in poverty.\n~~~\nMost children who live in poverty in Canada have to work multiple jobs and end up leaving school early.\n\"Having to work multiple jobs while doing fulltime school is so hard and defeating.\"\n\"I was forced to work extra hours to afford food and housing, \nleading me to being unable to dedicate time to school and being forced to drop out of my college courses.\"\n\nPoverty also has an extreme social impact. The impacts on social life occur during middle school. This starts with exclusion, as you have a lower chance of being popular. They'll always have the latest fashion trends, technology, and toys. It also means you are restricted to sports, clubs, and other activities. Because of this, you would be likely to be bullied, which can lead to depression. This is why poverty is associated with higher rates of dropout, increased participation in crime, as well as increased rates of hospital admission.",
    hasChoice: false,
    nextScene: () => null,
  },
];

const getEmoji = (item: string) => {
  switch (item) {
    case 'breakfast': return '🥣';
    case 'jacket': return '🧥';
    case 'hoodie': return '👕';
    case 'broken-pencil': return '✏️';
    case 'ticket': return '🎫';
    case 'healthy-dinner': return '🍲';
    case 'chips': return '🍟';
    default: return item;
  }
};

const getDescription = (item: string) => {
  switch (item) {
    case 'breakfast': return 'Breakfast cereal';
    case 'jacket': return 'Last year\'s jacket';
    case 'hoodie': return 'Newer hoodie';
    case 'broken-pencil': return 'Broken pencil';
    case 'ticket': return 'Bus ticket';
    case 'healthy-dinner': return 'Healthy frozen dinner';
    case 'chips': return 'Unhealthy comfort food';
    default: return item;
  }
};

export default function Home() {
  const [protagonist, setProtagonist] = useState<Protagonist>(initialProtagonist);
  const [previousProtagonist, setPreviousProtagonist] = useState<Protagonist>(initialProtagonist);
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [showBoard, setShowBoard] = useState<boolean>(false);
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<{text: string, x: number, y: number}[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [quit, setQuit] = useState<boolean>(false);
  const [fadeToBlack, setFadeToBlack] = useState<boolean>(false);

  const current = scenes[currentScene];
  const text = typeof current.text === 'function' ? current.text(protagonist) : current.text;

  const handleChoice = (yes: boolean) => {
    setPreviousProtagonist(protagonist);
    const newState = yes ? (current.onYes ? current.onYes(protagonist) : protagonist) : (current.onNo ? current.onNo(protagonist) : protagonist);
    setProtagonist(newState);
    const next = current.nextScene(newState, yes);
    if (next !== null) setCurrentScene(next);
  };

  const handleContinue = () => {
    setPreviousProtagonist(protagonist);
    const newState = current.onEnter ? current.onEnter(protagonist) : protagonist;
    setProtagonist(newState);
    const next = current.nextScene(newState);
    if (next !== null) {
      setCurrentScene(next);
    } else {
      // Last scene, fade out and show board
      setFadeOut(true);
      setTimeout(() => setShowBoard(true), 1000);
    }
  };

  const handleSubmitIdea = () => {
    if (inputValue.trim()) {
      const x = Math.random() * 80 + 5; // 5% to 85%
      const y = Math.random() * 80 + 5;
      setIdeas([...ideas, { text: inputValue.trim(), x, y }]);
      setInputValue('');
    }
  };

  const handleBack = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
      setProtagonist(initialProtagonist);
      setPreviousProtagonist(initialProtagonist);
    }
  };

  if (quit) {
    return (
      <div style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '10vh' }}>Thank you for your time</h1>
        <p style={{ fontSize: '2vh' }}>by Viaan Jauhari</p>
      </div>
    );
  }

  if (showBoard) {
    return (
      <div style={{ backgroundColor: fadeToBlack ? 'black' : 'white', minHeight: '100vh', padding: '20px', position: 'relative', opacity: fadeToBlack ? 0 : 1, transition: 'opacity 1s, background-color 1s' }}>
        <button
          onClick={() => { setFadeToBlack(true); setTimeout(() => setQuit(true), 1000); }}
          style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px' }}
        >
          Quit
        </button>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#000' }}>Solution Board</h1>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', height: '600px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your idea"
            style={{ width: '70%', padding: '10px', fontSize: '16px', color: '#000' }}
          />
          <button
            onClick={handleSubmitIdea}
            style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '5px' }}
          >
            Add Idea
          </button>
          {ideas.map((idea, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: `${idea.y}%`,
                left: `${idea.x}%`,
                padding: '10px',
                backgroundColor: '#e0f7fa',
                border: '1px solid #00bcd4',
                borderRadius: '5px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                maxWidth: '120px',
                wordWrap: 'break-word',
                color: '#000',
                fontWeight: 'bold'
              }}
            >
              {idea.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center p-4 max-w-4xl mx-auto"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 1s'
      }}
    >
      <div className="w-full mb-4 p-4 border rounded bg-gray-200">
        <h2 className="font-bold text-black text-xl md:text-2xl">Stats</h2>
        <p className="text-black text-base md:text-lg">
          Money: ${protagonist.balance}
          {(() => {
            const diff = protagonist.balance - previousProtagonist.balance;
            if (diff > 0) return <span style={{ color: 'green' }}> (+{diff} ↑)</span>;
            if (diff < 0) return <span style={{ color: 'red' }}> ({diff} ↓)</span>;
            return null;
          })()}
        </p>
        <p className="text-black text-base md:text-lg">
          Social Credit: {protagonist.social_credit} pts
          {(() => {
            const diff = protagonist.social_credit - previousProtagonist.social_credit;
            if (diff > 0) return <span style={{ color: 'green' }}> (+{diff} ↑)</span>;
            if (diff < 0) return <span style={{ color: 'red' }}> ({diff} ↓)</span>;
            return null;
          })()}
        </p>
        <p className="text-black text-base md:text-lg">
          Health: {protagonist.health_percent}%
          {(() => {
            const diff = protagonist.health_percent - previousProtagonist.health_percent;
            if (diff > 0) return <span style={{ color: 'green' }}> (+{diff} ↑)</span>;
            if (diff < 0) return <span style={{ color: 'red' }}> ({diff} ↓)</span>;
            return null;
          })()}
        </p>
        <p className="text-black text-base md:text-lg">Inventory: {protagonist.inventory.length ? protagonist.inventory.map(item => <span key={item} title={getDescription(item)}>{getEmoji(item)} </span>) : 'None'}</p>
      </div>
      <div className="w-full mb-4 p-4 border border-white rounded bg-black">
        <h2 className="font-bold text-white text-xl md:text-2xl">Story</h2>
        <p className="whitespace-pre-line text-white text-lg md:text-xl lg:text-2xl">{text}</p>
      </div>
      {current.hasChoice ? (
        <div className="flex gap-4 mb-4">
          {currentScene > 0 && <button onClick={handleBack} className="px-3 py-3 bg-gray-500 text-white rounded text-lg md:text-xl">⬅️</button>}
          <button onClick={() => handleChoice(true)} className="px-6 py-3 bg-blue-500 text-white rounded text-lg md:text-xl">Yes</button>
          <button onClick={() => handleChoice(false)} className="px-6 py-3 bg-red-500 text-white rounded text-lg md:text-xl">No</button>
        </div>
      ) : !current.hasChoice ? (
        <div className="flex gap-4 mb-4">
          {currentScene > 0 && <button onClick={handleBack} className="px-3 py-3 bg-gray-500 text-white rounded text-lg md:text-xl">⬅️</button>}
          <button onClick={handleContinue} className="px-6 py-3 bg-green-500 text-white rounded text-lg md:text-xl">Continue</button>
        </div>
      ) : null}
      {current.fact && (
        <div className="w-full p-4 border rounded bg-yellow-200">
          <p className="whitespace-pre-line text-black text-lg md:text-xl lg:text-2xl">{current.fact}</p>
        </div>
      )}
    </div>
  );
}

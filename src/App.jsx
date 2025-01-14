import { useState } from 'react'
import MemoryCard from '../components/MemoryCard'
import Form from '../components/From'


export default function App() {
    const [isGameOn, setIsGameOn] = useState(false)
    const [emojisData, setEmojisData] = useState([])

    async function startGame(e) {
        e.preventDefault()
        
        try {
            const response = await fetch("https://emojihub.yurace.pro/api/all/category/animals-and-nature")
            
            if (!response.ok) {
                throw new Error("Could not fetch data from API")
            }
            
            const data = await response.json()
            const dataSlice = getDataSlice(data)
            const EmojiArray = getEmojisArray(dataSlice)

            setEmojisData(EmojiArray)
            setIsGameOn(true)
        } catch(err) {
            console.error(err)
        }   
    }

    function getDataSlice(data){
      const randomIndices = getRandomIndices(data);
      const dataSlice = randomIndices.map(index => data[index])
      return dataSlice

    }

    function getRandomIndices(data) {
      const randomIndicesArray = []
      for(let i=0; i<5;i++){
        const randomNum = Math.floor(Math.random()*data.length);
        if(!randomIndicesArray.includes(randomNum)){
          randomIndicesArray.push(randomNum)
        }
        else{
          i--
        }
      }
      return(randomIndicesArray)
    }

    function getEmojisArray(data){
      //Step 1: creating duplicates in the array
      const pairedEmojisArray = [...data,...data]; // using spread twice to get exactly two copies of each emoji 
      //Step 2: shuffleing the array with Fisher-Yates algo 
      for(let i= pairedEmojisArray.length-1; i>0; i--){     //startin from the last element of the array and swapping it with a randomindex whihch is in range of the pairedEmojisArray and moving to the right until all elements are shuffled.
        const randomIndex = Math.floor(Math.random()*(i+1))
        //swapping elements
        pairedEmojisArray[i] = [pairedEmojisArray[randomIndex], pairedEmojisArray[randomIndex] = pairedEmojisArray[i]][0];   
      }
      return pairedEmojisArray
    }

    function turnCard() {
        console.log("Memory card clicked")

    }
    
    return (
        <main>
            <h1>Memory</h1>
            {!isGameOn && <Form handleSubmit={startGame} />}
            {isGameOn && <MemoryCard handleClick={turnCard} data={emojisData} />}
        </main>
    )
}
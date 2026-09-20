import { useState } from 'react'
import MemoryCard from '../components/MemoryCard'
import Form from '../components/From'
import RegularButton from '../components/RegularButton'

export default function App() {
    const [isGameOn, setIsGameOn] = useState(false)
    const [cards, setCards] = useState([])
    const [selectedCards, setSelectedCards] = useState([])
    const [matches, setMatches] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    async function startGame(e) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const category = formData.get('category')
        const cardCount = Number(formData.get('cardCount'))
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch(`https://emojihub.yurace.pro/api/all/category/${category}`)
            
            if (!response.ok) {
                throw new Error('Could not fetch emojis from the API')
            }
            
            const data = await response.json()
            const pairCount = Math.min(Math.floor(cardCount / 2), data.length)
            const selectedEmojis = getDataSlice(data, pairCount)
            setCards(getEmojisArray(selectedEmojis))
            setSelectedCards([])
            setMatches(0)
            setAttempts(0)
            setIsGameOn(true)
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    function getDataSlice(data, count) {
        return getRandomIndices(data, count).map(index => data[index])
    }

    function getRandomIndices(data, count) {
        const randomIndicesArray = []
        while (randomIndicesArray.length < count) {
            const randomNum = Math.floor(Math.random() * data.length)
            if (!randomIndicesArray.includes(randomNum)) {
                randomIndicesArray.push(randomNum)
            }
        }
        return randomIndicesArray
    }

    function getEmojisArray(data) {
        const pairedEmojisArray = data.flatMap((emoji, index) => [
            { id: `${index}-a`, emoji, isFlipped: false, isMatched: false },
            { id: `${index}-b`, emoji, isFlipped: false, isMatched: false },
        ])
        for (let i = pairedEmojisArray.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1))
            ;[pairedEmojisArray[i], pairedEmojisArray[randomIndex]] =
                [pairedEmojisArray[randomIndex], pairedEmojisArray[i]]
        }
        return pairedEmojisArray
    }

    function turnCard(index) {
        if (selectedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
            return
        }

        const nextCards = cards.map((card, cardIndex) =>
            cardIndex === index ? { ...card, isFlipped: true } : card
        )
        const nextSelectedCards = [...selectedCards, index]
        setCards(nextCards)
        setSelectedCards(nextSelectedCards)

        if (nextSelectedCards.length === 2) {
            setAttempts((currentAttempts) => currentAttempts + 1)
            const [firstIndex, secondIndex] = nextSelectedCards
            const isMatch = nextCards[firstIndex].emoji.htmlCode[0] === nextCards[secondIndex].emoji.htmlCode[0]

            if (isMatch) {
                setCards((currentCards) => currentCards.map((card, cardIndex) =>
                    nextSelectedCards.includes(cardIndex)
                        ? { ...card, isMatched: true }
                        : card
                ))
                setMatches((currentMatches) => currentMatches + 1)
                setSelectedCards([])
            } else {
                window.setTimeout(() => {
                    setCards((currentCards) => currentCards.map((card, cardIndex) =>
                        nextSelectedCards.includes(cardIndex)
                            ? { ...card, isFlipped: false }
                            : card
                    ))
                    setSelectedCards([])
                }, 800)
            }
        }
    }

    function resetGame() {
        setIsGameOn(false)
        setCards([])
        setSelectedCards([])
        setMatches(0)
        setAttempts(0)
    }

    const gameComplete = cards.length > 0 && matches === cards.length / 2

    return (
        <main>
            <h1>Memory</h1>
            {!isGameOn && <Form handleSubmit={startGame} isLoading={isLoading} />}
            {error && <p role="alert" className="error">{error}</p>}
            {isGameOn && (
                <>
                    <div className="scoreboard" aria-live="polite">
                        <span>Matches: {matches}</span>
                        <span>Attempts: {attempts}</span>
                    </div>
                    {gameComplete && (
                        <section className="wrapper wrapper--accent result">
                            <h2>You matched them all!</h2>
                            <p>You found {matches} pairs in {attempts} attempts.</p>
                            <RegularButton handleClick={resetGame}>Play Again</RegularButton>
                        </section>
                    )}
                    <MemoryCard handleClick={turnCard} data={cards} />
                </>
            )}
        </main>
    )
}
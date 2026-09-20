import { decodeEntity } from 'html-entities'
import PropTypes from 'prop-types'

export default function MemoryCard({ handleClick, data }) {
    const emojiEl = data.map((card, index) =>
        <li key={card.id} className={`card-item ${card.isFlipped || card.isMatched ? 'card-item--selected' : ''}`}>
            <button
                className={`btn btn--emoji ${card.isMatched ? 'btn--emoji--matched' : ''}`}
                onClick={() => handleClick(index)}
                disabled={card.isMatched}
                aria-label={card.isFlipped || card.isMatched ? `Emoji card ${index + 1}` : 'Hidden emoji card'}
            >
                {card.isFlipped || card.isMatched ? decodeEntity(card.emoji.htmlCode[0]) : '?'}
            </button>
        </li>
    )
    
    return <ul className="card-container">{emojiEl}</ul>
}

MemoryCard.propTypes = {
    handleClick: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        emoji: PropTypes.shape({
            htmlCode: PropTypes.arrayOf(PropTypes.string).isRequired,
        }).isRequired,
        isFlipped: PropTypes.bool.isRequired,
        isMatched: PropTypes.bool.isRequired,
    })).isRequired,
}
import PropTypes from 'prop-types'

export default function RegularButton({ children, handleClick, type = 'button', disabled = false }) {
    return (
        <button
            className="btn btn--text"
            onClick={handleClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

RegularButton.propTypes = {
    children: PropTypes.node.isRequired,
    handleClick: PropTypes.func,
    type: PropTypes.string,
    disabled: PropTypes.bool,
}
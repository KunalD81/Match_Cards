import { useEffect, useId, useRef, useState } from 'react'
import PropTypes from 'prop-types'

export default function CustomSelect({ name, options, defaultValue }) {
    const id = useId()
    const rootRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState(defaultValue)
    const selectedOption = options.find((option) => option.value === selectedValue) ?? options[0]

    useEffect(() => {
        function handlePointerDown(event) {
            if (!rootRef.current?.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [])

    function selectOption(value) {
        setSelectedValue(value)
        setIsOpen(false)
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            setIsOpen(false)
            return
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsOpen((open) => !open)
        }
    }

    return (
        <div className={`custom-select ${isOpen ? 'custom-select--open' : ''}`} ref={rootRef}>
            <input type="hidden" name={name} value={selectedOption.value} />
            <button
                aria-controls={`${id}-options`}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                className="custom-select__trigger"
                onClick={() => setIsOpen((open) => !open)}
                onKeyDown={handleKeyDown}
                type="button"
            >
                <span>{selectedOption.label}</span>
                <span aria-hidden="true" className="custom-select__chevron">⌄</span>
            </button>
            {isOpen && (
                <ul className="custom-select__options" id={`${id}-options`} role="listbox">
                    {options.map((option) => (
                        <li key={option.value} role="option" aria-selected={option.value === selectedValue}>
                            <button
                                className={`custom-select__option ${option.value === selectedValue ? 'custom-select__option--selected' : ''}`}
                                onClick={() => selectOption(option.value)}
                                type="button"
                            >
                                <span>{option.label}</span>
                                {option.value === selectedValue && <span aria-hidden="true">✓</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

CustomSelect.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    })).isRequired,
    defaultValue: PropTypes.string.isRequired,
}

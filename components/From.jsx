import RegularButton from './RegularButton'
import { data } from '../data/data'
import PropTypes from 'prop-types'
import CustomSelect from './CustomSelect'

export default function Form({ handleSubmit, isLoading }) {
    return (
        <form className="wrapper wrapper--accent" onSubmit={handleSubmit}>
            <div className="form-container">
                <label className="form__inner-wrapper">
                    Category
                    <CustomSelect
                        defaultValue={data.category[0].value}
                        name="category"
                        options={data.category.map((category) => ({
                            label: category.name,
                            value: category.value,
                        }))}
                    />
                </label>
                <label className="form__inner-wrapper">
                    Cards
                    <CustomSelect
                        defaultValue={data.number[0].value}
                        name="cardCount"
                        options={data.number.map((number) => ({
                            label: `${number.value} cards`,
                            value: number.value,
                        }))}
                    />
                </label>
            </div>
            <RegularButton type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Start Game'}
            </RegularButton>
        </form>
    )
}

Form.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
}
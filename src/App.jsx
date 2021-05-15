import React from 'react';
import create from 'zustand';
import { debounce } from './libs/utils';
import './App.css';

const COUNTRIES_URL = 'https://gist.githubusercontent.com/mainendra/0b8ae73421f3e2efa8b1096eec53ae2d/raw/f73d55009a631192e1658d932fe6849a513eaa69/countries.json';

const useStore = create(set => ({
    filter: '',
    countries: [],
    filteredCountries: [],
    setFilter: filter => {
        set(state => ({
            ...state,
            filter
        }));
    },
    setCountrries: countries => {
        set(state => ({
            ...state,
            countries
        }));
    },
    updateFilteredCountries: debounce(() => {
        set(state => ({
            ...state,
            filteredCountries: state.countries.filter(country => country.name.toLowerCase().includes(state.filter.toLowerCase()))
        }));
    }, 100)
}));

function FilterInput() {
    const {filter, setFilter, updateFilteredCountries} = useStore(state => state);
    return (
        <input value={filter} onChange={evt => {setFilter(evt.target.value); updateFilteredCountries();}} />
    );
}

function CountriesTable() {
    const filteredCountries = useStore(state => state.filteredCountries);

    return (
        <table width="100%">
            <tbody>
                {
                    filteredCountries.map(({ id, name, code }) => (
                        <tr key={id}>
                            <td>{name}</td>
                            <td>{code}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}

function App() {
    const setCountrries = useStore(state => state.setCountrries);
    const updateFilteredCountries = useStore(state => state.updateFilteredCountries);

    React.useEffect(() => {
        fetch(COUNTRIES_URL).then(resp => resp.json())
            .then(resp => resp.countries.reduce((result, country, index) => {
                result.push({
                    id: index,
                    ...country
                });
                return result;
            }, [])).then(resp => {
                setCountrries(resp);
                updateFilteredCountries();
            });
    }, [setCountrries, updateFilteredCountries]);

    return (
        <div className="App">
            <FilterInput />
            <br />
            <h1>Countries</h1>
            <CountriesTable />
        </div>
    );
}

export default App;

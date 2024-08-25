import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
];

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [isValidJson, setIsValidJson] = useState(true);
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleInputChange = (event) => {
        setJsonInput(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const parsedInput = JSON.parse(jsonInput);
            setIsValidJson(true);
            
            const res = await axios.post('http://localhost:5000/bfhl', parsedInput);
            setResponse(res.data);
        } catch (error) {
            setIsValidJson(false);
            setResponse(null);
        }
    };

    const handleSelectChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    const renderResponse = () => {
        if (!response) return null;

        const filteredResponse = selectedOptions.reduce((acc, option) => {
            if (response[option.value]) {
                acc[option.label] = response[option.value].join(', ');
            }
            return acc;
        }, {});

        return (
            <div>
                <h3>Filtered Response</h3>
                {Object.entries(filteredResponse).map(([key, value]) => (
                    <div key={key}>
                        <strong>{key}:</strong> {value}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="App">
            <h2>API Input</h2>
            <input 
                type="text" 
                value={jsonInput} 
                onChange={handleInputChange} 
                placeholder='{"data":["M","1","334","4","B"]}'
            />
            <button onClick={handleSubmit}>Submit</button>
            {!isValidJson && <p style={{ color: 'red' }}>Invalid JSON Input</p>}

            {response && (
                <>
                    <h3>Multi Filter</h3>
                    <Select 
                        isMulti
                        options={options}
                        onChange={handleSelectChange}
                    />
                </>
            )}

            {renderResponse()}
        </div>
    );
}

export default App;

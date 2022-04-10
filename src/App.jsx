import {useState} from "react";

function App() {
    const [counter, setCounter] = useState(0)

    async function updateCounter() {
        setTimeout(() => setCounter(counter => counter + 1), 300)
    }

    return (
        <div className="App">
            <div data-testid="counter">{counter}</div>
            <button onClick={updateCounter}>Async update counter</button>
        </div>
    );
}

export default App;

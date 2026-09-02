import { useEffect, useState } from "react";

function App() {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/metrics")
            .then((response) => response.json())
            .then((data) => {
                setMetrics(data);
            });
    }, []);

    return (
        <div>
            <h1>LifeOS</h1>

            <p>Your personal analytics dashboard.</p>

            <hr />

            <h2>Today's Overview</h2>

            {metrics ? (
                <div>
                    <p>Weight: {metrics.weight} kg</p>
                    <p>Steps: {metrics.steps}</p>
                    <p>Sleep: {metrics.sleep} hours</p>
                    <p>Study: {metrics.study} hours</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default App;
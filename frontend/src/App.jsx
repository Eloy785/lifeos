import { useEffect, useState } from "react";

function App() {
    const [metrics, setMetrics] = useState([]);

    const [formData, setFormData] = useState({
        date: "",
        weight_kg: "",
        steps: "",
        sleep_hours: "",
        study_hours: ""
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = () => {
        fetch("http://localhost:3000/api/metrics")
            .then((response) => response.json())
            .then((data) => {
                setMetrics(data);
            })
            .catch((error) => {
                console.error("Error fetching metrics:", error);
            });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:3000/api/metrics",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(`Error: ${data.error}`);
                return;
            }

            setMessage("Metrics saved successfully!");

            setFormData({
                date: "",
                weight_kg: "",
                steps: "",
                sleep_hours: "",
                study_hours: ""
            });

            fetchMetrics();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        }
    };

    const latest = metrics[0];

    return (
        <div>
            <h1>LifeOS</h1>
            <p>Your personal analytics dashboard.</p>

            <hr />

            <h2>Add Daily Metrics</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date: </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Weight (kg): </label>
                    <input
                        type="number"
                        step="0.1"
                        name="weight_kg"
                        value={formData.weight_kg}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Steps: </label>
                    <input
                        type="number"
                        name="steps"
                        value={formData.steps}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Sleep (hours): </label>
                    <input
                        type="number"
                        step="0.1"
                        name="sleep_hours"
                        value={formData.sleep_hours}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Study (hours): </label>
                    <input
                        type="number"
                        step="0.1"
                        name="study_hours"
                        value={formData.study_hours}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <button type="submit">
                    Save Daily Metrics
                </button>
            </form>

            {message && <p>{message}</p>}

            <hr />

            <h2>Latest Entry</h2>

            {latest ? (
                <div>
                    <p>Date: {latest.date}</p>
                    <p>Weight: {latest.weight_kg} kg</p>
                    <p>Steps: {latest.steps}</p>
                    <p>Sleep: {latest.sleep_hours} hours</p>
                    <p>Study: {latest.study_hours} hours</p>
                </div>
            ) : (
                <p>No metrics found.</p>
            )}
        </div>
    );
}

export default App;
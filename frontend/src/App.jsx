import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import "./App.css";

function MetricCard({ title, value, unit }) {
    return (
        <div className="metric-card">
            <p className="metric-title">{title}</p>

            <h3>
                {value ?? "--"}
                <span>{unit}</span>
            </h3>
        </div>
    );
}

function TrendChart({ title, data, dataKey, unit }) {
    return (
        <div className="chart-card">
            <h2>{title}</h2>

            {data.length > 0 ? (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="date" />

                            <YAxis />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                name={title}
                                unit={unit}
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
}

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

    const chartData = [...metrics]
        .reverse()
        .map((metric) => ({
            ...metric,

            weight_kg:
                metric.weight_kg === null
                    ? null
                    : Number(metric.weight_kg),

            steps:
                metric.steps === null
                    ? null
                    : Number(metric.steps),

            sleep_hours:
                metric.sleep_hours === null
                    ? null
                    : Number(metric.sleep_hours),

            study_hours:
                metric.study_hours === null
                    ? null
                    : Number(metric.study_hours)
        }));

    return (
        <div className="app">
            <header className="header">
                <div>
                    <h1>LifeOS</h1>
                    <p>Your personal analytics dashboard.</p>
                </div>
            </header>

            <main>
                <section className="metrics-grid">
                    <MetricCard
                        title="Weight"
                        value={latest?.weight_kg}
                        unit=" kg"
                    />

                    <MetricCard
                        title="Steps"
                        value={latest?.steps}
                        unit=""
                    />

                    <MetricCard
                        title="Sleep"
                        value={latest?.sleep_hours}
                        unit=" hrs"
                    />

                    <MetricCard
                        title="Study"
                        value={latest?.study_hours}
                        unit=" hrs"
                    />
                </section>

                <section className="form-card">
                    <h2>Add Daily Metrics</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div>
                                <label>Date</label>

                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label>Weight (kg)</label>

                                <input
                                    type="number"
                                    step="0.1"
                                    name="weight_kg"
                                    value={formData.weight_kg}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label>Steps</label>

                                <input
                                    type="number"
                                    name="steps"
                                    value={formData.steps}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label>Sleep (hours)</label>

                                <input
                                    type="number"
                                    step="0.1"
                                    name="sleep_hours"
                                    value={formData.sleep_hours}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label>Study (hours)</label>

                                <input
                                    type="number"
                                    step="0.1"
                                    name="study_hours"
                                    value={formData.study_hours}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button type="submit">
                            Save Daily Metrics
                        </button>
                    </form>

                    {message && (
                        <p className="message">
                            {message}
                        </p>
                    )}
                </section>

                <section className="charts-grid">
                    <TrendChart
                        title="Weight Trend"
                        data={chartData}
                        dataKey="weight_kg"
                        unit=" kg"
                    />

                    <TrendChart
                        title="Steps Trend"
                        data={chartData}
                        dataKey="steps"
                        unit=" steps"
                    />

                    <TrendChart
                        title="Sleep Trend"
                        data={chartData}
                        dataKey="sleep_hours"
                        unit=" hrs"
                    />

                    <TrendChart
                        title="Study Trend"
                        data={chartData}
                        dataKey="study_hours"
                        unit=" hrs"
                    />
                </section>

                <section className="history-card">
                    <h2>History</h2>

                    {metrics.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Weight</th>
                                        <th>Steps</th>
                                        <th>Sleep</th>
                                        <th>Study</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {metrics.map((metric) => (
                                        <tr key={metric.id}>
                                            <td>{metric.date}</td>
                                            <td>
                                                {metric.weight_kg} kg
                                            </td>
                                            <td>{metric.steps}</td>
                                            <td>
                                                {metric.sleep_hours} hrs
                                            </td>
                                            <td>
                                                {metric.study_hours} hrs
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No history yet.</p>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;
"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import "./styles.css"

export default function Page() {
  const [period, setPeriod] = useState("monthly")
  const [chartData, setChartData] = useState({
    monthlyData: [],
    electricityData: [],
    waterData: [],
    savingsData: [],
  })

  // Base data for different periods
  const data = {
    monthly: {
      barChart: [
        { name: "Dec", electricity: 1800, water: 1680 },
        { name: "Jan", electricity: 2100, water: 1750 },
        { name: "Feb", electricity: 3360, water: 1680 },
        { name: "Mar", electricity: 2800, water: 1900 },
        { name: "Apr", electricity: 1800, water: 1680 },
        { name: "May", electricity: 3600, water: 2100 },
        { name: "Jun", electricity: 3900, water: 2300 },
        { name: "Jul", electricity: 4200, water: 2400 },
      ],
      electricityPie: [
        { name: "AC", value: 40 },
        { name: "Dryer", value: 25 },
        { name: "Television", value: 15 },
        { name: "Pump", value: 12 },
        { name: "Refrigerator", value: 8 },
      ],
      waterPie: [
        { name: "Showers", value: 28 },
        { name: "Dishes", value: 17 },
        { name: "Gardening", value: 25 },
        { name: "Laundry", value: 22 },
        { name: "Miscellaneous", value: 8 },
      ],
      savingsPie: [
        { name: "Electricity Savings", value: 75 },
        { name: "Water Savings", value: 25 },
      ],
    },
    quarterly: {
      barChart: [
        { name: "Q1", electricity: 7260, water: 5110 },
        { name: "Q2", electricity: 8200, water: 5680 },
        { name: "Q3", electricity: 9300, water: 6100 },
        { name: "Q4", electricity: 6800, water: 4900 },
      ],
      electricityPie: [
        { name: "AC", value: 35 },
        { name: "Dryer", value: 28 },
        { name: "Television", value: 18 },
        { name: "Pump", value: 10 },
        { name: "Refrigerator", value: 9 },
      ],
      waterPie: [
        { name: "Showers", value: 30 },
        { name: "Dishes", value: 15 },
        { name: "Gardening", value: 22 },
        { name: "Laundry", value: 25 },
        { name: "Miscellaneous", value: 8 },
      ],
      savingsPie: [
        { name: "Electricity Savings", value: 65 },
        { name: "Water Savings", value: 35 },
      ],
    },
    yearly: {
      barChart: [
        { name: "2021", electricity: 28000, water: 19000 },
        { name: "2022", electricity: 31560, water: 21790 },
        { name: "2023", electricity: 29800, water: 20500 },
        { name: "2024", electricity: 31500, water: 21800 },
      ],
      electricityPie: [
        { name: "AC", value: 32 },
        { name: "Dryer", value: 30 },
        { name: "Television", value: 20 },
        { name: "Pump", value: 8 },
        { name: "Refrigerator", value: 10 },
      ],
      waterPie: [
        { name: "Showers", value: 25 },
        { name: "Dishes", value: 20 },
        { name: "Gardening", value: 30 },
        { name: "Laundry", value: 18 },
        { name: "Miscellaneous", value: 7 },
      ],
      savingsPie: [
        { name: "Electricity Savings", value: 60 },
        { name: "Water Savings", value: 40 },
      ],
    },
  }

  // Update chart data when period changes
  useEffect(() => {
    setChartData({
      monthlyData: data[period].barChart,
      electricityData: data[period].electricityPie,
      waterData: data[period].waterPie,
      savingsData: data[period].savingsPie,
    })
  }, [period])

  // Color schemes matching the design
  const COLORS = {
    electricity: {
      bar: "#94a3b8",
      pie: ["#0a1529", "#1e40af", "#3b82f6", "#60a5fa", "#93c5fd"],
    },
    water: {
      bar: "#60a5fa",
      pie: ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"],
    },
    savings: ["#94a3b8", "#60a5fa"],
  }

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name === "electricity" ? "Electricity (kWh)" : "Water (m³)"}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-title">Dashboard</h1>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item">
            <span>⊞</span>
            Dashboard
          </a>
          <a href="#" className="nav-item active">
            <span>📈</span>
            Consumption Analysis
          </a>
          <a href="#" className="nav-item">
            <span>⚠</span>
            Emergency Controls
          </a>
          <a href="#" className="nav-item">
            <span>🎮</span>
            Device Controls
          </a>
          <a href="#" className="nav-item">
            <span>🎧</span>
            Customer Support
          </a>
          <button className="nav-item">
            <span>↪</span>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h2>Consumption Analysis</h2>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="period-select">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="charts-grid">
          {/* Consumption Charts */}
          <div className="chart-card">
            <h3>Consumption Charts</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.monthlyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="electricity" fill={COLORS.electricity.bar} name="Electricity (kWh)" />
                  <Bar dataKey="water" fill={COLORS.water.bar} name="Water (m³)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Electricity Consumption */}
          <div className="chart-card">
            <h3>Electricity Consumption</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.electricityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                  >
                    {chartData.electricityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS.electricity.pie[index % COLORS.electricity.pie.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Water Consumption */}
          <div className="chart-card">
            <h3>Water Consumption</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.waterData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                  >
                    {chartData.waterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.water.pie[index % COLORS.water.pie.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Savings Distribution */}
          <div className="chart-card">
            <h3>Savings Distribution</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.savingsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                  >
                    {chartData.savingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.savings[index % COLORS.savings.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


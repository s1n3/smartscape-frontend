"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { generateDashboardData, CHART_COLORS } from "./utils/generateDashboardData"
import { FirebaseProvider, useFirebase } from "./firebase/use-firebase"
import "./styles.css"

// Wrap the main component with the FirebaseProvider
export default function PageWrapper() {
  return (
    <FirebaseProvider>
      <Page />
    </FirebaseProvider>
  )
}

function Page() {
  const [period, setPeriod] = useState("monthly")
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const firebase = useFirebase()

  // Generate random data on initial load and when period changes
  useEffect(() => {
    // Simulate a loading delay for realism
    setLoading(true)

    const timer = setTimeout(() => {
      setChartData(generateDashboardData(period))
      setLoading(false)
    }, 500) // Short delay to simulate data loading

    return () => clearTimeout(timer)
  }, [period])

  // Handle period change
  const handlePeriodChange = (e) => {
    setPeriod(e.target.value)
  }

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === "electricity" ? "Electricity (kWh)" : "Water (m³)"}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Show loading state
  if (loading || firebase.loading) {
    return <div className="loading">Loading dashboard data...</div>
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
        {/* Peak Hour Alert */}
        {firebase.showVoltageAlert && (
          <div className="peak-hour-alert">
            <strong>Peak Hour Alert!</strong> Your current power consumption ({firebase.totalVoltage}W) exceeds the
            recommended threshold ({firebase.VOLTAGE_THRESHOLD}W) during peak hours.
            <button onClick={firebase.dismissVoltageAlert} className="dismiss-alert">
              Dismiss
            </button>
          </div>
        )}

        <div className="content-header">
          <h2>Consumption Analysis</h2>
          <div className="header-right">
            {firebase.isPeakHour && <span className="peak-hour-indicator">Peak Hours (6PM-8PM)</span>}
            <select value={period} onChange={handlePeriodChange} className="period-select">
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
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
                  <Bar dataKey="electricity" fill={CHART_COLORS.electricity.bar} name="Electricity (kWh)" />
                  <Bar dataKey="water" fill={CHART_COLORS.water.bar} name="Water (m³)" />
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
                        fill={CHART_COLORS.electricity.pie[index % CHART_COLORS.electricity.pie.length]}
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
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS.water.pie[index % CHART_COLORS.water.pie.length]}
                      />
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
                      <Cell key={`cell-${index}`} fill={CHART_COLORS.savings[index % CHART_COLORS.savings.length]} />
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


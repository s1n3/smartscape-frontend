// Helper function to generate random number within a range
const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Main function to generate random dashboard data
export function generateDashboardData(period) {
  // Create a seed based on current time to ensure different data on each refresh
  const seed = Date.now() % 100 // This gives us 100 different variations

  // Generate random consumption data with realistic patterns
  const generateConsumptionData = () => {
    let data = []

    if (period === "daily") {
      // Daily data with hourly intervals
      const baseElectricity = randomInRange(80, 150)
      const baseWater = randomInRange(50, 100)
      const peakHour = randomInRange(2, 5) // Random peak hour (2PM to 5PM)

      const hours = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "12AM"]

      data = hours.map((hour, index) => {
        // Create a curve with peak during afternoon/evening
        let multiplier = 1
        if (index === peakHour) {
          multiplier = randomInRange(20, 30) / 10 // Peak multiplier 2.0-3.0
        } else if (index === peakHour - 1 || index === peakHour + 1) {
          multiplier = randomInRange(15, 25) / 10 // Near peak 1.5-2.5
        } else if (index === 0 || index === 6) {
          multiplier = randomInRange(7, 12) / 10 // Early morning/late night 0.7-1.2
        }

        return {
          name: hour,
          electricity: Math.round(baseElectricity * multiplier * (1 + (seed % 10) / 100)),
          water: Math.round(baseWater * multiplier * (1 + (seed % 7) / 100)),
        }
      })
    } else if (period === "monthly") {
      // Monthly data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const baseElectricity = randomInRange(1500, 2500)
      const baseWater = randomInRange(1200, 2000)

      // Seasonal patterns
      const seasonalFactors = {
        electricity: [1.2, 1.1, 1.0, 0.9, 0.8, 1.0, 1.2, 1.3, 1.1, 0.9, 1.0, 1.2], // Higher in summer and winter
        water: [0.8, 0.8, 0.9, 1.0, 1.2, 1.3, 1.4, 1.3, 1.1, 0.9, 0.8, 0.8], // Higher in summer
      }

      // Select a random starting month based on seed
      const startMonth = seed % 12

      data = Array.from({ length: 8 }, (_, i) => {
        const monthIndex = (startMonth + i) % 12
        const randomVariation = 0.8 + ((seed + i) % 10) / 10

        return {
          name: months[monthIndex],
          electricity: Math.round(baseElectricity * seasonalFactors.electricity[monthIndex] * randomVariation),
          water: Math.round(baseWater * seasonalFactors.water[monthIndex] * randomVariation),
        }
      })
    } else if (period === "quarterly") {
      // Quarterly data
      const baseElectricity = randomInRange(6000, 9000)
      const baseWater = randomInRange(4000, 6000)

      // Seasonal patterns by quarter
      const quarterFactors = {
        electricity: [1.1, 0.9, 1.0, 1.2], // Q1 (winter), Q2 (spring), Q3 (summer), Q4 (fall/winter)
        water: [0.8, 1.0, 1.3, 0.9],
      }

      data = ["Q1", "Q2", "Q3", "Q4"].map((quarter, i) => {
        const randomVariation = 0.9 + ((seed + i) % 10) / 20

        return {
          name: quarter,
          electricity: Math.round(baseElectricity * quarterFactors.electricity[i] * randomVariation),
          water: Math.round(baseWater * quarterFactors.water[i] * randomVariation),
        }
      })
    } else if (period === "yearly") {
      // Yearly data
      const baseYear = 2021
      const baseElectricity = randomInRange(25000, 35000)
      const baseWater = randomInRange(18000, 25000)

      // Yearly growth trend
      const yearlyGrowth = {
        electricity: 1 + randomInRange(5, 15) / 100, // 5-15% yearly growth
        water: 1 + randomInRange(3, 12) / 100, // 3-12% yearly growth
      }

      data = Array.from({ length: 4 }, (_, i) => {
        // Some years might have unexpected spikes or drops
        const electricityAnomaly = i === seed % 4 ? randomInRange(80, 120) / 100 : 1
        const waterAnomaly = i === (seed + 2) % 4 ? randomInRange(85, 115) / 100 : 1

        return {
          name: (baseYear + i).toString(),
          electricity: Math.round(baseElectricity * Math.pow(yearlyGrowth.electricity, i) * electricityAnomaly),
          water: Math.round(baseWater * Math.pow(yearlyGrowth.water, i) * waterAnomaly),
        }
      })
    }

    return data
  }

  // Generate random pie chart data with realistic distributions
  const generatePieData = (type) => {
    let categories = []
    let baseValues = []

    if (type === "electricity") {
      categories = ["AC", "Dryer", "Television", "Pump", "Refrigerator"]

      // Different distribution patterns based on period
      if (period === "daily") {
        baseValues = [40, 20, 20, 10, 10]
      } else if (period === "monthly") {
        baseValues = [35, 25, 15, 15, 10]
      } else if (period === "quarterly") {
        baseValues = [38, 22, 18, 12, 10]
      } else {
        baseValues = [32, 28, 20, 10, 10]
      }
    } else if (type === "water") {
      categories = ["Showers", "Dishes", "Gardening", "Laundry", "Miscellaneous"]

      if (period === "daily") {
        baseValues = [35, 25, 10, 15, 15]
      } else if (period === "monthly") {
        baseValues = [30, 20, 20, 20, 10]
      } else if (period === "quarterly") {
        baseValues = [25, 15, 30, 20, 10]
      } else {
        baseValues = [28, 17, 25, 22, 8]
      }
    } else if (type === "savings") {
      categories = ["Electricity Savings", "Water Savings"]

      if (period === "daily") {
        baseValues = [55, 45]
      } else if (period === "monthly") {
        baseValues = [60, 40]
      } else if (period === "quarterly") {
        baseValues = [65, 35]
      } else {
        baseValues = [70, 30]
      }
    }

    // Apply random variations based on seed
    const data = categories.map((name, index) => {
      // Random variation of ±20% based on seed and index
      const variation = 0.8 + ((seed + index) % 40) / 100
      const value = Math.round(baseValues[index] * variation)

      return { name, value }
    })

    // Normalize to ensure total is 100%
    const total = data.reduce((sum, item) => sum + item.value, 0)
    return data.map((item) => ({
      ...item,
      value: Math.round((item.value / total) * 100),
    }))
  }

  return {
    monthlyData: generateConsumptionData(),
    electricityData: generatePieData("electricity"),
    waterData: generatePieData("water"),
    savingsData: generatePieData("savings"),
  }
}

// Export color schemes for charts
export const CHART_COLORS = {
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


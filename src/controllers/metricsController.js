const Result = require("../models/Result");
const LoveResult = require("../models/loveResult");

const getMetrics = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const startOfMonth = new Date(Date.UTC(targetYear, targetMonth, 1));
    const endOfMonth = new Date(
      Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59, 999)
    );

    const discUsers = await Result.distinct("name").then((names) =>
      names.filter((name) => name).map((name) => name.toLowerCase())
    );
    const loveUsers = await LoveResult.distinct("name").then((names) =>
      names.filter((name) => name).map((name) => name.toLowerCase())
    );
    const totalUsers = [...new Set([...discUsers, ...loveUsers])].length;

    const discTestsThisMonth = await Result.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const loveTestsThisMonth = await LoveResult.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.json({
      totalUsers,
      discTestsThisMonth,
      loveTestsThisMonth,
      period: `${targetMonth + 1}/${targetYear}`,
    });
  } catch (error) {
    console.error("Erro ao buscar métricas:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Erro ao buscar métricas" });
  }
};

module.exports = { getMetrics };

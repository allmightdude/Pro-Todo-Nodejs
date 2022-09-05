const router = require("express").Router();
const CatModel = require("../models/planCategory");
const PlanModel = require("../models/plan");

router.get("/category", async (req, res) => {
  try {
    let cats = await CatModel.find({ userId: req.userId });
    res.json({
      success: true,
      cats,
    });
  } catch {
    res.status(200).json({
      success: true,
      cat,
    });
  }
});

router.post("/category/create", async (req, res) => {
  try {
    const { title, icon } = req.body.category;
    const userId = req.userId;
    let cat = await CatModel.create({
      title,
      icon,
      userId,
    });

    res.status(200).json({
      success: true,
      cat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const userId = req.userId;
    const { title, date, tasks, category, categoryID } = req.body;

    let newPlan = await PlanModel.create({
      title,
      date,
      tasks,
      category,
      categoryID,
      userId,
    });

    // amount plan with this category +1
    await CatModel.findByIdAndUpdate(
      {
        _id: categoryID,
      },
      {
        $inc: {
          items: 1,
        },
      }
    );

    res.status(200).json({
      success: true,
      newPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

// Get Week Plans
router.post("/", async (req, res) => {
  try {
    let dates = req.body;
    console.log(dates);
    let plans = [];

    plans = await PlanModel.find({
      date: {
        $in: dates,
      },
      userId : req.userId
    }).populate({ path: "tasks", model: "Task" });

    plans.sort(function (a, b) {
      a = a.toString().split("-");
      b = b.toString().split("-");
      return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
    });

    res.json({
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

router.get("/:date", async (req, res) => {
  try {
    let { date } = req.params;
    let plans = await PlanModel.find({
      date: date,
      userId: req.userId,
    }).populate({ path: "tasks", model: "Task" });

    res.status(200).json({
      success: 200,
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

router.get("/getSinglePlan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await PlanModel.findOne({
      _id: id,
    });

    res.json({
      plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let deletedPlan = await PlanModel.findByIdAndDelete({
      _id: id,
    });

    // amount plan with this category -1
    await CatModel.findByIdAndUpdate(
      {
        _id: deletedPlan.categoryID,
      },
      {
        $inc: {
          items: -1,
        },
      }
    );

    res.status(200).json({
      success: true,
      msg: "Plan succussfully deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

module.exports = router;

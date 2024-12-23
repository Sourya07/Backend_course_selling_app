const { Router } = require("express");
const { userModel, courseModel, purchaseModel } = require("../db")
const userRouter = Router();
const { z } = require("zod")
const jwt = require("jsonwebtoken")
const { JWT_USER_PASSWORD } = require("../config");

userRouter.post("/signup", async function (req, res) {
    const { email, password, firstName, lastName } = req.body

    const requirebody = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string().min(8),
        lastName: z.string().min(8)

    })

    const parsedata = requirebody.safeParse(req.body);
    if (!parsedata.success) {
        console.error("Validation error:", parsedata.error);
        return res.status(400).json(parsedata.error);
    }
    // const hasedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
        email,
        password,
        firstName,
        lastName
    })

    res.json({
        message: "signup is completed"
    })
})

userRouter.post("/signin", async function (req, res) {

    const { email, password } = req.body
    const user = await userModel.findOne({ email, password })

    if (user) {
        const token = jwt.sign({
            id: user._id
        }, JWT_USER_PASSWORD)
        res.json({
            token
        })
    }

})

userRouter.get("/purchases", userMiddleware, async function (req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i < purchases.length; i++) {
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})

module.exports = {
    userRouter: userRouter
}
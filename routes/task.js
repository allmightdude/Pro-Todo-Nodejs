const router = require('express').Router();
const TaskModel = require('../models/task');

router.post('/create' , async(req , res) => { 
    try {
        const userId = req.userId;
        const {title,
            important,
            checked,
            date,
            time} = req.body;

        let newTask = await TaskModel.create({
            title,
            important,
            checked,
            date,
            time,
            userId
        })

        await newTask.save();
        
        res.status(200).json({
            success : true,
            newTask
        })
            

    } catch (error) {
        res.status(500).json({
            success : false,
            msg : error
        })
    }
})

// router.get('/' , async(req , res)=>{
//     try {
//         console.log(req.userId);
//         const tasks = await TaskModel.find({
//             userId : req.userId
//         });
        
//         res.json({
//             tasks
//         })
//     } catch (error) {
//         res.status(500).json({
//             success:false,
//             error : error
//         })
//     }
// })

router.get('/:date' , async (req , res) => {
    try {   
        const {date} = req.params;
        const tasks = await TaskModel.find({
            date : date,
            userId : req.userId
        })
        res.json({
            tasks
        })
    }catch (error) {
        res.status(500).json({
            success:false,
            error : error
        })
    }
})


router.delete('/delete/:id' , async(req , res) => {
    try {
        await TaskModel.findByIdAndDelete({
            _id : req.params.id
        })

        res.status(200).json({
            success: true,
            msg : "task succussfully deleted!",
        });
        
    }catch (error) {
        res.status(500).json({
            success:false,
            error : error
        })
    }
})

router.put('/:id' , async (req , res) => {
    try {
        let {id} = req.params;
        
        await TaskModel.findOneAndUpdate({_id : id} , 
            [{$set:{checked:{$eq:[false,"$checked"]}}}]);

        res.status(200).json({
            success : 200
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            error : error
        })
    }
})

module.exports = router;

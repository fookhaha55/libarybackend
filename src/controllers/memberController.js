const Member = require('../models/memberModel');

exports.getMembers = async (req, res) => {

    Member.find()
        .exec((err, result) => {
            res.status(200).json({
                msg: "OK",
                data: result
            });
        });
};

exports.getMemberById = async (req, res) => {

    Member.find({member_id:req.params.id})
        .exec((err, result) => {
            res.status(200).json({
                msg: "OK",
                data: result
            });
        });
};

exports.addMember = async (req,res) =>{

    try {

        let member = new Member({

            memberid: req.body.memberid,
            password: req.body.password,
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            categoryId: req.body.categoryId
        });

        // member.password = await member.hashPassword(req.body.password);

        let createMember = await member.save();

        res.status(200).json({
            msg: "Add Member OK",
            data: createMember
        });

        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            error: error
        });

    }

}

exports.login = async (req,res) => {
    const login = {
        memberid: req.body.memberid,
        password: req.body.password
    }
    try {
        let member = await Member.findOne({
            memberid: login.memberid
        });
        if (!member) {
            res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            })
        }

        let match = await member.compareUserPassword(login.password, member.password);
        if (match) {
            let token = await member.generateJwtToken({
                staff
            }, "secret", {
                expiresIn: 604800
            })

            if (token) {
                member.password = null;
                res.status(200).json({
                    success: true,
                    token: token,
                    userCredentials: member
                })
            }
        } else {
            res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            type: "Something Went Wrong",
            msg: err
        })
    }
}

exports.updateMember = async (req,res)=>{
    let member = {
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            categoryId: req.body.categoryId
    };
    Member.findByIdAndUpdate(req.params.id,member)
    .exec((err,data)=>{
        // Member.findById(req.params.id,{"password":0})
        Member.findById(req.params.id)
        .exec((err,data)=>{
            res.status(200).json({
                msg: "OK",
                data: data
            });
        });
    });
};

exports.deleteMember = async (req, res) => {
    Member.findByIdAndDelete(req.params.id)
        .exec((err)=>{
            if(err){
                res.status(500).json({
                    msg: err
                });
            } else{
                res.status(200).json({
                    msg: "Delete complete"
                });
            }
        });
};

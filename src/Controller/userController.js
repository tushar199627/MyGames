const UserModel = require("../Model/UserModel")
const jwt = require("jsonwebtoken");

const createUser = async function (req, res) {
    try {
        let {name, emailId, password } = req.body

   //=================================================Validation starts===================================================================     
        if (!name) {
            return res.status(400).send({ status: false, message: "author title is required" })
        }
       
        if (!emailId) {
            return res.status(400).send({ status: false, message: "user email is required" })
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailId)) {
           return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }

        if (!password) {
            return res.status(400).send({ status: false, message: "user password is required" })
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
          return  res.status(400).send({ status: false, message: `password should contain atleastone number or one alphabet and should be 9 character long` });
        }

        let emailAllready=await UserModel.findOne({emailId})
        if(emailAllready){
          return  res.status(400).send({ status: false, message: `${emailId} already exist` });
        }
    

        let userCreated = await UserModel.create(req.body)
        return res.status(201).send({ status: true, date: userCreated, msg: "User Successfully Created" })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

};

const loginUser = async function (req, res) {
    try {
        let emailId = req.body.emailId;
        let password = req.body.password;


        if (!emailId) {
            return res.status(400).send({ status: false, msg: "Email is required" })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }

        let user = await UserModel.findOne({ emailId: emailId, password: password });
        if (!user)
            return res.status(400).send({
                status: false,
                msg: "Invalid Email or Password",
            });

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                organisation: "IG",
            },
            "IG-secretKey"
        );
        res.setHeader("x-api-key", token);

        return res.status(200).send({ status: true, token: token, msg: "User logged in successfully" });
    }
    catch (err) {
        return res.status(500).send(err.message);

    }
}

const getuser = async function (req, res) {

    try {
        
        const users = await UserModel.find();

        res.status(200).send({ status: true, message: "User list", data: users })

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};



module.exports.createUser = createUser
module.exports.loginUser = loginUser
module.exports.getuser = getuser
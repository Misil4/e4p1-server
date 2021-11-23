import UserModel from "../models/userModel.js";
export const getAllUsers = (req, res) => {
    UserModel.find({rol:"user"}, (err, users) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (!users) return res.status(404).send({ message: `No existen users` });
        res.status(200).send({ users: users });
    });
};
export const getUserById = (req, res) => {
    let userId = req.params.id;
    UserModel.findOne({ _id: userId }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (!user) return res.status(404).send({ message: `No existe ese user` });
        res.send({ user: user });
    });
};
export const insertUserData = (req, res) => {
    const data = {
        name : req.body.givenName,
        email : req.body.email,
        rol : "user",
        login_status : false
    };
    UserModel.findOne({ email: data.email }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (user === null) {
            UserModel.create(data, (err, docs) => {
                if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
                res.send({ data: docs });
            })
        }
        else {res.send({data : user})}
    })
}
export const updateUserData = (req, res) => {
    const data = req.body;
    let userId = req.params.id;
    UserModel.findByIdAndUpdate(userId, { $set: data }, { new: true }, (err, docs) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (!docs) return res.status(404).send({ message: `No existe ese user` });
        res.send({ data: user });
    })
}

export const deleteUserData = (req, res) => {
    let userId = req.params.id;
    UserModel.findByIdAndRemove(userId, (err, docs) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (!docs) return res.status(404).send({ message: `No existe ese user` });
        res.send({ data: docs });
    })
}

export const updateUserStatus = (req, res) => {
    let userEmail = req.body.email;
    let login_status = true;
    UserModel.find({email : userEmail}, (err,docs) => {
        if (docs[0].login_status) {
            login_status = false
        }
    UserModel.updateOne({email: userEmail}, { $set: {login_status: login_status} }, { new: true }, (err, docs) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (!docs) return res.status(404).send({ message: `No existe ese user` });
        res.send({ data: userEmail });
    })
})
}
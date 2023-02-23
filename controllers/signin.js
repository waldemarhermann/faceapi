
const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('input is wrong')
    } 
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('error: unable to find user'))
            } else {
                res.status(400).json('wrong login informations')
            }
        })
        .catch(err => res.status(400).json('wrong login informations'))
}

module.exports = {
    handleSignin: handleSignin
}
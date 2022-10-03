let fragdb = require('../server/f_model');
let clothingdb = require('../server/c_model');

// FRAGRANCES
exports.create = (req,res) => {    
    res.send('<script>alert("You are not authorized to perform this action as a guest."); location = "/f-index"</script>');
}

exports.find = (req, res) => {

    if(req.query.id) {
        const id = req.query.id;

        fragdb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({ message: `Frag ID ${id} not found.` });
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: `Error retrieving Frag ID ${id}`})
        })

    } else {
        fragdb.find()  // returns ALL data saved in Cluster
        .then(frag => {
            res.send(frag)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error occured while retrieving frag info"});
        })
    }
}

exports.update = (req, res) => {
    res.send('<script>alert("You are not authorized to perform this action as a guest."); location = "/f-index"</script>');
}

exports.delete = (req, res) => {
    res.send('<script>alert("You are not authorized to perform this action as a guest."); location = "/f-index"</script>');
}



// CLOTHING
exports.c_create = (req,res) => {    
    res.send('<script>alert("You are not authorized to perform this action as a guest."); location = "/c-index"</script>');
}

exports.c_find = (req, res) => {

    if(req.query.id) {
        const id = req.query.id;

        clothingdb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({ message: `Clothing ID ${id} not found.` });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: `Error retrieving Clothing ID ${id}`})
        })

    } else {
        clothingdb.find()
        .then(clothing => {
            res.send(clothing)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error occured while retrieving clothing info"});
        })
    }
}

exports.c_update = (req, res) => {
    res.send('<script>alert("You are not authorized to perform this action as a guest."); location = "/c-index"</script>');
}

exports.c_delete = (req, res) => {
    res.send('<script>alert("You are not authorized to perform this action as a guest."); location = "/c-index"</script>');
}

exports.c_scanprices = (req, res) => {  // manual scan button
    res.send('<script>alert("You are not authorized to perform this action as a guest."); location = "/c-index"</script>');
}

exports.c_launchscan = (req, res) => {  // initial scan when server starts
    res.send('<script>alert("You are not authorized to perform this action as a guest."); location = "/c-index"</script>');
}
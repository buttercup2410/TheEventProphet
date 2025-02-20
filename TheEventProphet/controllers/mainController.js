exports.index = (req, res, next) => {
    res.render('./index');
};

exports.aboutus = (req, res) => {
    res.render('./aboutus');
};

exports.contactus = (req, res) => {
    res.render('./contactus');
};
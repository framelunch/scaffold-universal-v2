const User = require('../../models/User');
const { signToken } = require('../../auth/auth.service');
const { activate } = require('../../etc/mail');
const optimizeQuery = require('../../libs/utils/optimizeQuery');

function _getID({ params, user }) {
  return (params && params.id) || (user && user._id) || null;
}

function _getQuery({ query }) {
  return (
    typeof query === 'object' && typeof query.query === 'string' ?
      JSON.parse(decodeURIComponent(query.query)) :
      query
  ) || {};
}

exports.getUsers = function (req, res) {
  const query = _getQuery(req);
  const sort = query.sort || '-_id';
  const select = query.select || '-salt -hashedPassword -emailActivate -facebook -twitter -google';
  const limit = parseInt(query.limit || 100, 10);
  const page = parseInt(query.page || 0, 10);
  const skip = page ? (page - 1) * limit : parseInt(query.skip || 0, 10);

  delete query.sort;
  delete query.page;
  delete query.skip;
  delete query.select;
  delete query.limit;

  User
    .find(optimizeQuery(query))
    .select(select)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .exec((err, users) => {
      if (err) return res.status(500).send(err);

      return res.json(users.reduce((docs, u) => {
        if (u.ranking) u.ranking = u.ranking.slice(0, 1);
        delete u.salt;
        delete u.hashedPassword;
        delete u.emailActivate;
        docs.push(u);
        return docs;
      }, []));
    });
};

exports.createUser = function (req, res) {
  const newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save((err, user) => {
    if (err) return res.status(422).json(err);
    req.body.token = signToken(user._id);
    res.sendStatus(200);

    return activate(req.body);
  });
};

exports.activateUser = function (req, res, next) {
  if (req.user.emailActivate) {
    res.sendStatus(200);
  } else {
    req.user.emailActivate = true;
    req.user.save(err => {
      if (err) return next(err);
      return res.sendStatus(200);
    });
  }
};

exports.getUser = function (req, res, next) {
  const id = _getID(req);
  if (!id) {
    res.sendStatus(401);
  } else {
    User.findById(id, '-salt -hashedPassword -emailActivate', (err, user) => {
      if (err) return next(err);
      if (!user) return res.sendStatus(401);
      return res.json(user);
    });
  }
};

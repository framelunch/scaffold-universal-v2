const compose = require('composable-middleware');
const { QUERY_NAME } = require('../etc/define');

function getRequestQuery({ query }, name = 'query') {
  return (typeof query === 'object' && typeof query[name] === 'string' ?
    JSON.parse(decodeURIComponent(query[name])) :
    query
  ) || {};
}

function optimizeMongoQuery(obj) {
  // mongoDBのfindのqueryで正規表現を使えるようにする
  return Object.keys(obj)
    .map(item => {
      switch (typeof item) {
        case 'object': {
          return optimizeMongoQuery(item);
        }
        case 'string': {
          const arr = /\/(.+)\/(g|i|m|y)?$/.exec(item);
          if (arr) {
            return new RegExp(arr[1], arr[2]);
          }
          return item;
        }
        default: return item;
      }
    });
}

exports.parseMongoQuery = (option = {}) => (
  (req, res, next) => {
    const query = getRequestQuery(req, QUERY_NAME);
    const sort = query.sort || option.sort || '-_id';
    const select = query.select || option.select || '';
    const limit = parseInt(query.limit || option.limit || 100, 10);
    const page = parseInt(query.page || option.page || 0, 10);
    const skip = page ? (page - 1) * limit : parseInt(query.skip || option.skip || 0, 10);

    delete query.sort;
    delete query.page;
    delete query.skip;
    delete query.limit;

    req.mongo = {
      query: optimizeMongoQuery(query),
      sort, select, limit, page, skip,
    };
    next();
  }
);

exports.getList = Model => (
  (req, res, next) => {
    const { query, sort, select, limit, skip } = req.mongo;

    Model
      .find(query)
      .sort(sort)
      .select(select)
      .limit(limit)
      .skip(skip)
      .exec()
      .then(data => res.json(data))
      .catch(err => next(err));
  }
);
exports.getResourceList = (Model, option) => (
  compose()
    .use(exports.parseMongoQuery(option))
    .use(exports.getList(Model))
);
exports.getMyResourceList = (Model, option) => (
  compose()
    .use(exports.parseMongoQuery(option))
    .use((req, res, next) => {
      req.mongo.query.userId = req.user._id;
      next();
    })
    .use(exports.getList(Model))
);

exports.getResource = Model => (
  (req, res, next) => {
    const _id = req.params.id;

    return Model.findById(_id)
      .then(data => {
        if (!data) return res.sendStatus(401);
        return res.json(data);
      })
      .catch(error => next(error));
  }
);
exports.getMyResource = Model => (
  (req, res, next) => {
    const _id = req.params.id;
    const userId = req.user._id;

    return Model.findById(_id)
      .then(data => {
        if (!data || data.userId.toString() !== userId) return res.sendStatus(401);
        return res.json(data);
      })
      .catch(error => next(error));
  }
);

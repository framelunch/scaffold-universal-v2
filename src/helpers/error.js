module.exports = {
  505: (err, req, res) => {
    res.status(505).send(`Status 505 : Internal Server Error. ${err.message}`);
  },
  404: (req, res) => {
    const code = 404;
    res.status(code).format({
      'text/plain': () => res.send('Not Acceptable'),
      'text/html': () => res.render('_404.ejs'),
      'application/json': () => res.json({ status: code }),
      default() {
        res.send('Not Acceptable');
      },
    });
  },
};

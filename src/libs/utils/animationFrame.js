const loop = require('./loop');
const addToLoop = loop.addToLoop;
const removeFromLoop = loop.removeFromLoop;

module.exports =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
((exec) => {
  const func = () => {
    exec();
    removeFromLoop(func);
  };
  addToLoop(func);
});

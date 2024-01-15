const user = (req, res) => {
  res.json({ message: "user home controller" });
};

const test = (req, res) => {
  res.json({ message: "user test controller" });
};

module.exports = {
  user,
  test,
};

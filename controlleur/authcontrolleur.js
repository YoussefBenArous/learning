const bcrypt = require('bcryptjs');
const User = require('../modles/users/user');
// Inscription
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    // Au lieu de retourner un token, on retourne un message de succès
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid user' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid acc' });
    }
    // Au lieu de retourner un token, on retourne un message de succès
    res.status(200).json({ msg: 'Login successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('probelem error verefiez votre code ');
  }
};


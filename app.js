const http = require('http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const PORT = 3000;
const SECRET_KEY = 'super_secret_key';


const users = [
  {
    id: 1,
    username: 'user@esgi.fr',
    firstName: "John",
    lastName: "Doe",
    role: "Utilisateur",
    password: '05d49692b755f99c4504b510418efeeeebfd466892540f27acf9a31a326d6504'
  },
  {
    id: 2,
    username: 'admin@esgi.fr',
    firstName: "Bill",
    lastName: "Gates",
    role: "Administrator",
    password: '713bfda78870bf9d1b261f565286f85e97ee614efe5f0faf7c34e7ca4f65baca'
  }
];

function handleCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permet toutes les origines
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Méthodes autorisées
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // En-têtes autorisées
}

function handleOptions(req, res) {
  handleCors(req, res);
  res.writeHead(204); // Pas de contenu pour OPTIONS
  res.end();
}

// Auth and gen JWT 
function authenticate(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    const { username, password } = JSON.parse(body);
    console.log(username, password)
    const user = users.find(u => u.username === username);

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(
        {
          status: 401, error: 'Utilisateur non trouvé.'
        }));
    }

    if (password !== user.password) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(
        {
          status: 401,
          error: 'Mot de passe incorrect.'
        }
      ));
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ token }));
  });
}

// Verify and return the infos
function infoUser(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(
      {
        status: 401,
        error: 'Token manquant ou invalide.'
      }));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(
      {
        status: 200,
        message: "Success",
        userId: decoded.userId,
        firstName: users.find(u => u.id === decoded.userId).firstName,
        lastName: users.find(u => u.id === decoded.userId).lastName,
        role: users.find(u => u.id === decoded.userId).role,
      }
    ));
  } catch (err) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(
      {
        status: 401,
        message: 'Token invalide ou expiré.'
      }
    ));
  }
}

// Création du serveur HTTP
const server = http.createServer((req, res) => {
  handleCors(req, res);

  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  if (req.method === 'POST' && req.url === '/auth') {
    return authenticate(req, res);
  } else if (req.method === 'GET' && req.url === '/info') {
    return infoUser(req, res);
  } else {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(
      {
        status: 500,
        error: "Route n'existe pas."
      }));
  }
});

// Démarrage du serveur
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

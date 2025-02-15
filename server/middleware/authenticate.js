const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];

  console.log("Token:", token);
  console.log("Decoded Header:", jwt.decode(token, { complete: true }));

  const client = jwksRsa({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  });

  const { kid } = jwt.decode(token, { complete: true }).header;
  console.log("our kid is ", kid);

  client.getSigningKey(kid, (err, key) => {
    if (err) {
      console.error("Error fetching signing key:", err);
      return res.status(401).send("Unauthorized");
    }

    const signingKey = key.getPublicKey();

    jwt.verify(
      token,
      signingKey,
      {
        algorithms: ["RS256"],
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      },
      (err, decoded) => {
        if (err) {
          console.error("Token verification error:", err);
          return res.status(401).send("Unauthorized");
        }

        req.user = decoded;
        next();
      }
    );
  });
};

module.exports = authenticate;

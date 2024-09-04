const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5001;

app.use(express.json());

app.use("/customer", session({ secret:"fingerprint_customer", resave: true, saveUninitialized: true}))

// Middleware to authenticate requests to "/customer/auth" endpoint
app.use("/customer/auth/*", function auth(req, res, next){
    // Check if user is logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: 'Login expired for user ' + user });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running at port: " + PORT));

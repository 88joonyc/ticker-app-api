const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require("path");

const { environment } = require('./config');
const { ValidationError } = require('sequelize');

const isProduction = environment === 'production';
const routes = require('./routes');

const app = express();

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

if (!isProduction) {
    app.use(cors(
      // {
      //   origin:'*', 
      //   credentials:true,            //access-control-allow-credentials:true
      //   optionSuccessStatus:200,
      // }
    ));
}
app.use(helmet({
    contentSecurityPolicy: false
}));

// may need to remove due to error from mapping numbers
// app.use(
//     csurf({
//         cookie: {
//         secure: isProduction,
//         sameSite: isProduction && "Lax",
//         httpOnly: false,
//         },
//     })
// );
// app.use(csurf())
app.use(routes); 

app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
      err.errors = err.errors.map((e) => e.message);
      err.title = 'Validation error';
    }
    next(err);
});

app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
      title: err.title || 'Server Error',
      message: err.message,
      errors: err.errors,
      stack: isProduction ? null : err.stack,
    });
});

// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", function (_, res) {
//   res.sendFile(
//     path.join(__dirname, "./client/build/index.html"),
//     function (err) {
//       res.status(500).send(err);
//     }
//   );
// });

// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => console.log(`listening on port:${PORT}`))

module.exports = app;
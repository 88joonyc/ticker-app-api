const express = require('express');
const router = express.Router();

const apiRouter = require('./api');

router.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    // Serve the frontend's index.html file at the root route
    router.get('/', (req, res) => {
      
      return res.cookie('XSRF-TOKEN', req.csrfToken(),  {
        maxAge: 604800 * 1000, 
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });
      // return res.cookie(
      //   path.resolve(__dirname, 'client/build', 'build', 'index.html')
      // );
    });
  
    // Serve the static assets in the frontend's build folder
    router.use(express.static(path.resolve("../frontend/build")));
  
    // Serve the frontend's index.html file at all other routes NOT starting with /api
    router.get(/^(?!\/?api).*/, (req, res) => {
      
      return res.cookie('XSRF-TOKEN', req.csrfToken(),  {
        maxAge: 604800 * 1000, 
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });
      // return res.sendFile(
      //   path.resolve(__dirname, '../../frontend', 'build', 'index.html')
      //   );
    });
}

if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {


      res.cookie('XSRF-TOKEN', req.csrfToken(), {
      maxAge: 604800 * 1000, 
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });
    res.status(201).json({});
    return res.json({"XSRF-token" : req.csrfToken()})
  });
}

module.exports = router;
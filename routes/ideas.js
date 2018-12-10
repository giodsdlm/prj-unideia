const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse requests of content-type - application/json
app.use(bodyParser.json())

const {
  ensureAuthenticated
} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Load Theme Model
require('../models/Theme');
const Theme = mongoose.model('themes');

// User Idea Index Page
router.get('/myideas', ensureAuthenticated, (req, res) => {

  Theme.find({}).sort({
      curso: 'asc'
    })
    .then(themes => {
      if (!themes) {
        req.flash('error_msg', 'Erro ao retornar a lista de cursos.');
        res.redirect('/ideas');
      } else {
        Idea.find({
          user: req.user.id
          })
          .sort({
            date: 'desc'
          })
          .then(ideas => {
            if (!ideas) {
              req.flash('error_msg', 'Acesso não autorizado.');
              res.redirect('/ideas');
            } else {
              res.render('ideas/myideas', {
                ideas: ideas,
                themes: themes
              });
            }
          })

      }

    });
});

// General Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Theme.find({}).sort({
      curso: 'asc'
    })
    .then(themes => {
      if (!themes) {
        req.flash('error_msg', 'Erro ao retornar a lista de cursos.');
        res.redirect('/ideas');
      } else {
        Idea.find({})
          .sort({
            date: 'desc'
          })
          .then(ideas => {
            if (!ideas) {
              req.flash('error_msg', 'Acesso não autorizado.');
              res.redirect('/ideas');
            } else {
              res.render('ideas/index', {
                ideas: ideas,
                themes: themes
              });
            }
          })

      }

    });
});


// Add ideas form
router.get('/add', ensureAuthenticated, (req, res) => {
  Theme.find({})
    .then(themes => {
      if (!themes) {
        req.flash('error_msg', 'Erro ao retornar a lista de cursos.');
        res.redirect('/ideas');
      } else {
        res.render('ideas/add', {
          themes: themes
        });
      }
    })
});

// Process form
router.post('/', ensureAuthenticated, (req, res) => {


  //Validating empty fields on the server side
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Por favor adicione um título.'
    });
  }
  if (!req.body.details) {
    errors.push({
      text: 'Por favor adicione detalhes.'
    });
  }

  if (errors.length > 0) {
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
      tema: req.body.theme
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      autor: req.user,
      user: req.user.id,
      tema: req.body.theme
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Nova ideia adicionada!');
        res.redirect('/ideas');
      })
  }
});

// Edit ideas form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Theme.find({})
    .then(themes => {
      if (!themes) {
        req.flash('error_msg', 'Erro ao retornar a lista de cursos.');
        res.redirect('/ideas');
      } else {
        Idea.findOne({
            _id: req.params.id,
          })
          .then(idea => {
            if (idea.user != req.user.id) {
              req.flash('error_msg', 'Acesso não autorizado.');
              res.redirect('/ideas');
            } else {
              res.render('ideas/edit', {
                themes: themes,
                idea: idea
              });
            }
          })
      }
    });
}); 

// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      //new values
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.tema = req.body.theme;
      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Alteração registrada com sucesso.');
          res.redirect('/ideas/myideas');
        })
    });
});


router.post('/search', ensureAuthenticated, (req, res) => {
  var teste = req.body.title
  Idea.find({
      tema: teste
    })
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      if (!ideas) {
        req.flash('error_msg', 'Acesso não autorizado.');
        res.redirect('/ideas');
      } else {
        res.render(
          'ideas/search', {
            ideas: ideas
          });
      }
    });
});

// Delete Process
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      req.flash('success_msg', 'Ideia removida!');
      res.redirect('/ideas');
    });
});



let Pusher = require('pusher');
let pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER
});

router.post('/posts/:id/act', (req, res, next) => {
  const action = req.body.action;
  const counter = action === 'Like' ? 1 : -1;
  Post.update({
    _id: req.params.id
  }, {
    $inc: {
      likes_count: counter
    }
  }, {}, (err, numberAffected) => {
    pusher.trigger('post-events', 'postAction', {
      action: action,
      postId: req.params.id
    }, req.body.socketId);
    res.send('');
  });
});

router.post('/posts/:id/act', (req, res, next) => {
  const action = req.body.action;
  const counter = action === 'Like' ? 1 : -1;
  Post.update({
    _id: req.params.id
  }, {
    $inc: {
      likes_count: counter
    }
  }, {}, (err, numberAffected) => {
    res.send('');
  });
});

module.exports = router;
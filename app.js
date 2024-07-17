const express = require('express');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

let transporter = nodemailer.createTransport({
  host: "mail.21twelve.africa",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "info@21twelve.africa",
    pass: "LadyJane101!!@",
  },
});

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Phone: ${req.body.phone}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  async function main() {
    try {
      const info = await transporter.sendMail({
        from: 'Nodemailer Contact form <info@21twelve.africa>', // sender address
        to: "len@21twelve.africa, radka@21twelve.africa", // list of receivers
        subject: "Contact Form Request", // Subject line
        text: "Contact Form", // plain text body
        html: output, // html body
      });
      res.render('contact', { msg: 'Email has been sent' });
    } catch (error) {
      res.status(500).send('Something went wrong.');
    }
  }

  main();
});

app.listen(3000, () => console.log('Server started on port 3000...'));

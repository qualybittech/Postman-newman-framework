var Imap = require('imap');
var cheerio = require('cheerio');
const {simpleParser} = require('mailparser');

var imap = new Imap({
    user: 'motorunittests@gmail.com',
    password: 'aavcmsoqmnyyfpen',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  });

  imap.connect();

  imap.once('ready', () => {
    console.log("inside Hello")
    imap.openBox('INBOX', false, () => {
    imap.search(['ALL', ['SINCE', new Date()]], (err, results) => {
    const f = imap.fetch(results, {bodies: ''});
    f.on('message', msg => {
    msg.on('body', stream => {
    simpleParser(stream, async (err, parsed) => {
              console.log(parsed);
              $ = cheerio.load(parsed.html);
              var title = $("title").text();
              console.log("title: "+title);
            });
           });
    msg.once('attributes', attrs => {
    const {uid} = attrs;

    imap.addFlags(uid, ['\\Seen'], () => {
    console.log('Marked as read!');
    });
    });
    });
    f.once('error', ex => {
    return Promise.reject(ex);
    });
    f.once('end', () => {
    console.log('Done fetching all messages!');
    imap.end();
    });
    });
    });
    });

   
console.log("Hello")
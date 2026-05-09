var f = require('./functions.js')

module.exports = function (app) {
    app.get('/', (req, res) => {
        res.render(__dirname + '/EJS/Home.ejs', {
        })
    })
    
    app.post('/audio', async (req, res) => {
        audio = f.make_audio(req.body.text)
        res.send(audio)
    })
}
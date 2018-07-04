var fs = require('fs');

fs.writeFile('test.txt', '您好嗎?', function (err) {
    if (err)
        console.log(err);
    else
        console.log('Write operation complete.');
});

fs.readFile('test.txt', function (err, data) {
    if (err) throw err;
    console.log(data.toString());
});
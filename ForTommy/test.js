var templateButtonCommand = require('./templateButtonCommand') ;

templateButtonCommand.createAction('testA' , 'testB' , 'testC') ;
templateButtonCommand.createAction('testA2' , 'testB2' , 'testC2') ;
templateButtonCommand.createAction('testA3' , 'testB3' , 'testC3') ;
templateButtonCommand.createAction('testA4' , 'testB4' , 'testC4') ;


console.log(templateButtonCommand.getAction()) ;

templateButtonCommand.createCommand("command" , "image_url" , "title" , "text" , templateButtonCommand.getAction()) ;

var object = templateButtonCommand.getCommand(0) ;
console.log(object) ;
console.log(object.action) ;
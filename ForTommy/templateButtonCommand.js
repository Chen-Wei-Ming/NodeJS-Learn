var Command = [] ;
var Action = [] ;

function templateButtonCommand(command , image_url , title , text , action_array){
	this.type = 'templateButtons' ;
	this.command = command ;
	this.image_url = image_url ;
	this.title = title ;
	this.text = text ;
	this.action = action_array ;
}
function action(type , label , data){
	this.type = type ;
	this.label = label ;
	this.data = data ;
}

module.exports = {
	createCommand : function(command , image_url , title , text , action_array){
		var object = new templateButtonCommand(command , image_url , title , text , action_array) ;
		Command.push(object) ;
		// clear Action array
		Action = [] ;
	},
	createAction : function(type , label , data){
		var object = new action(type , label , data) ;
		Action.push(object) ;
	},
	getAction : function(){
		return Action ;
	},
	getCommand : function(){
		return Command ;
	},
	getCommandByIndex : function(index){
		return Command[index] ;
	}
};
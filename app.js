var express       = require("express"),
	app           = express(),
	bodyParser    = require("body-parser"),
	mongoose      = require("mongoose")
app.use(bodyParser.urlencoded({extended: true}))
require('dotenv').config()
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/nakupny_kosik", { useNewUrlParser: true });

var itemSchema = new mongoose.Schema({
	item: String,
	person: String}
	)
var choresScema = new mongoose.Schema({
		item: String,
		person: String}
		)

var Item = mongoose.model("Item", itemSchema)
var Chore = mongoose.model("Chore", choresScema)

app.use(express.static("public"))
app.set("view engine","ejs")



app.get("/",(req, res)=>{
	res.render("landing")
})
		

app.get("/nakup",(req, res)=>{
	Item.find({},(err, items)=>{
		if(err){
			console.log("Error")
		}else{
			res.render("home", {cart:items})
		}})})

app.get("/prace",(req, res)=>{
	Chore.find({},(err, items)=>{
		if(err){
			console.log("Error")
		}else{
			res.render("chores", {prace:items})
		}})})


app.post("/newItemPrace", function(req,res){
	var newItem = req.body.newItem
	var person = req.body.person
	var everything = {item:newItem, person:person}
	Chore.create(everything,(err,newlyCreated)=>{
		if(err){
			console.log("Error")
		}else{
			res.redirect("/prace")
		}
	})
})   


app.post("/newItem", function(req,res){
	var newItem = req.body.newItem
	var person = req.body.person
	var everything = {item:newItem, person:person}
	if(newItem != ""){
		Item.create(everything,(err,newlyCreated)=>{
			if(err){
				console.log("Error")
			}else{
				res.redirect("/nakup")
			}
		})
	}else{
		res.redirect("/nakup")
	}
	
})   

app.post("/removeItem", function(req,res){
	const stuff = req.body
	function myFunc(){
	for (let [key, value] of Object.entries(stuff)) {
 		return(`${key}`);
		}
	}
	Item.deleteOne({ item: myFunc() }, function (err) {
  if (err) return handleError(err);
  // deleted at most one tank document
});
	res.redirect("/nakup")
}) 

app.post("/removeItemPrace", function(req,res){
	const stuff = req.body
	function myFunc(){
	for (let [key, value] of Object.entries(stuff)) {
 		return(`${key}`);
		}
	}
	Chore.deleteOne({ item: myFunc() }, function (err) {
  if (err) return handleError(err);
  // deleted at most one tank document
});
	res.redirect("/prace")
}) 

app.get("/removeAllItems",function(req, res){
	Item.remove({}, function (err) {
  if (err) return handleError(err);
  // deleted at most one tank document
})
	res.redirect("/nakup")
})

app.get("/removeAllItemsPrace",function(req, res){
	Chore.remove({}, function (err) {
  if (err) return handleError(err);
  // deleted at most one tank document
})
	res.redirect("/prace")
})


const port = process.env.PORT || 3000;
app.listen(port);

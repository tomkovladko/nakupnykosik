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

var Item = mongoose.model("Item", itemSchema)

app.use(express.static("public"))
app.set("view engine","ejs")



app.get("/",(req, res)=>{
	Item.find({},(err, items)=>{
		if(err){
			console.log("Error")
		}else{
			res.render("home", {cart:items})
		}})})

app.post("/newItem", function(req,res){
	var newItem = req.body.newItem
	var person = req.body.person
	var everything = {item:newItem, person:person}
	Item.create(everything,(err,newlyCreated)=>{
		if(err){
			console.log("Error")
		}else{
			res.redirect("/")
		}
	})
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
	res.redirect("/")
}) 


app.get("/removeAllItems",function(req, res){
	Item.remove({}, function (err) {
  if (err) return handleError(err);
  // deleted at most one tank document
})
	res.redirect("/")
})

const port = process.env.PORT || 3000;
app.listen(port);

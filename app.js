const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');//exported module
const { redirect } = require('express/lib/response');
const _ = require('lodash');

const app = express();
app.use(express.static('public'));//used for the addition of th static files.
// const items =['Buy Food','Cook Food','Eat Food'];
// const workItems = [];
app.set('view engine', 'ejs');//set view engine ejs

app.use(bodyparser.urlencoded({ extended: true }));//for getting the value from the form inputs...
mongoose.connect('mongodb+srv://admin-aman:Aman%401007@cluster0.qs2bdvf.mongodb.net/todolistDB', { useNewUrlParser: true });//for mongoose connection.


// for items create mongoose Schema..
const itemSchema = {
    name: String
}
// create a mongoose.model...
const Item = mongoose.model('item', itemSchema);

// create document...

const item1 = new Item({
    name: 'Welcome to the ToDolist'
})

const item2 = new Item({
    name: 'Click + to add new item'
})

const item3 = new Item({
    name: '<-- click to delete an item'
})

const defaultItems = [item1, item2, item3];

// create a list schema for custom list...
const listSchema = {
    name:String,
    items:[itemSchema]
}
// list mongoose.model...
const List = mongoose.model('List',listSchema);

app.get('/', function (req, res) {
    Item.find({}, function (err, foundItems) {  //reading the database by using mongoose...
        // if (err) {
        //     console.log(err);
        // } else {
        // console.log(foundItems);
        if (foundItems.length === 0) {
             Item.insertMany(defaultItems, function (err) {  //inserting the value in databas using mongooose...
                 if (err) {
                     console.log(err);
                 } else {
                     console.log('Successfully saved item to DB.');
                 }
             })
             res.redirect('/');
        }else{
            let day = date.getDay();
            res.render('list', { listTitle: day, newlistItem: foundItems })
        }
    })
});

// rout parameter...
app.get('/:customListName',function(req,res){
    // console.log(req.params.customListName);
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                // console.log('Does not exist');
                const list = new List({
                    name:customListName,
                    items:defaultItems
                })
                list.save()
                res.redirect('/'+ customListName);
            }else{
                // console.log('exist');
            res.render('list', { listTitle: foundList.name, newlistItem: foundList.items })

            }
        }
    })

    
})

app.post('/', function (req, res) {
    // let item = req.body.newItem;
    // if (req.body.list === 'Work') {
    //     workItems.push(item);
    //     res.redirect('/work')
    // } else {
    //     items.push(item);
    //     res.redirect('/')
    // }

    // adding new items to our todolist database....
     const itemName = req.body.newItem;
     const listNames = req.body.list;

     const item = new Item({
         name:itemName
     })

     if(listNames === date.getDay()){
        item.save();
        console.log("successfully added new item");
        res.redirect('/');
     }else{
         List.findOne({name:listNames},function(err,foundList){
             foundList.items.push(item);
             foundList.save();
             res.redirect('/'+ listNames);
         })
     }



    

});

// for delteing the data from database...

app.post('/delete',function(req,res){
    // console.log(req.body.checkbox);

    const checkedItemId = req.body.checkbox;
    const listName = req.body.newName;
    // console.log(listName);



    if(listName === date.getDay()){
        Item.deleteOne({_id:checkedItemId},function(err){
            if(!err){
                console.log('Successfully deleted the checked item');
            }
            res.redirect('/');
        })
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect('/'+ listName);
            }else{
                console.log(err);
            }
        })
        // console.log('err');
    }
})

// app.get('/work', function (req, res) {
//     res.render('list', { listTitle: 'Work List', newlistItem: workItems })
// })
// app.post('/work', function (req, res) {
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect('/work')
// })
// app.get('/about', function (req, res) {
//     res.render('about');
// })

app.listen(3000, function () {
    console.log('server is running at port 3000');
})


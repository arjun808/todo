const express = require("express")
const app=express();
const mongoose = require("mongoose");
const _ = require("lodash");
 mongoose.connect("mongodb+srv://arjun6261:KsCNKSo3PERtKs7o@cluster0.p32j9g3.mongodb.net/todolist",{useNewUrlParser:true})

const bodyParser=require("body-parser");
const { urlencoded } = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))//it is used for tell the express to use the file which is inside this folder because node ignore all the file externalyy accept app.js and views
app.set("view engine","ejs");//it is used to tell our server  to use ejs
const itemSchema = new mongoose.Schema({
    name:String
})
const Item = mongoose.model("Item",itemSchema);
const item1= new Item({
    name:"welcome to your todolist"
})
const item2= new Item({
    name:"hit the + button to add new items"
})
const item3= new Item({
    name:"<---- hit this to delete an item"
})
const defaultitem=[item1,item2,item3];


app.get("/",(req,res)=>{
    // var today=new Date();
    // var options ={
    //     weekday:"long",
    //     day:"numeric",
    //     month:"long"
    // };
    // var day=today.toLocaleDateString("en-US",options);
    Item.find({},(err,founditems)=>{
       
        if(founditems.length ===0){
            Item.insertMany(defaultitem,(err)=>{
                if(err){
                    console.log("there is some error")
            
                }
                else{
                    console.log("it is ready to go");
                }
            })
            res.redirect("/");

        }
        else{

            res.render("list",{listtitle:"Today",newv:founditems});
        }
    });
    


//     let currenday=today.getDay();
//     var day="";
//     if(currenday!==6|| currenday!==0){
// day="weekend";
//         // res.send("prectise python");//res.send send the data only for once for multiple time we have to use res.write
//             //    res.write("prectise python");
//             res.render("list",{kindofday:day});
//     }
//     else{
//         day="weekday";
//         // res.write("prectise the question of DSA");
//         // res.write("prectise the question of DSA");
//     //   res.sendFile(__dirname + "/index.html");
//       //so we also have to make one for html file for weekend and for avoid multiple html file we use EJS(Embedded Javascript Templating ) due to which EJS is a simple templating language which is used to generate HTML markup with plain JavaScript.
//       res.render("list",{kindofday:day}); //it is use to send the data from app.js to list.html
//     }
})

const listSchema ={
    name:String,
    item:[itemSchema],
}
const List = mongoose.model("List",listSchema);

app.get("/:customlist",(req,res)=>{
    const lname=_.capitalize(req.params.customlist);
    List.findOne({name:lname},(err,found)=>{
        if(!err){
            if(!found){
                const list = new List({
                    name:lname,
                    item:defaultitem,
                });
                 list.save();
                 res.redirect("/"+lname)
            }
            else{
                res.render("list",{listtitle:found.name,newv:found.item});
            }
        }

    })
 
    
})


app.post("/",(req,res)=>{
    const itemName = req.body.newItem;
    const listn=req.body.list;
  
    const it = new Item({
        name:itemName
    })

    if(req.body.list==="Today"){
        // witems.push(req.body.newItem);
        it.save();
        res.redirect("/");
    }
    else{
     List.findOne({name:listn},(err,foundlist)=>{
        foundlist.item.push(it);
        foundlist.save();
        res.redirect("/"+listn)

     })
       
        
    }
   
    // console.log(req.body);
//    console.log(item);
// res.render("list",{item:newv});
})
// app.post("/",(req,res)=>{
//     witems.push(req.body.newItem);
//     res.redirect("/work");
// })
app.post("/delete",(req,res)=>{
    // console.log(req.body.checkbox);
    const listaName= req.body.listName;
    if(listaName==="Today"){
        Item.findByIdAndDelete(req.body.checkbox,(err)=>{
            if(err){
                console.log("err");
            }
            else{
                console.log("done");
            }
        })
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name:listaName},{$pull:{item:{_id:req.body.checkbox}}},(err,foundl)=>{
            if(!err){
                res.redirect("/"+listaName);
            }
        })
    }
  
})
app.listen(3000,(req,res)=>{
    console.log("server is started on porn number 3000");
})
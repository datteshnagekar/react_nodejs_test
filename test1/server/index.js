const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const moment = require("moment");
const path = require('path');
const bcrypt = require('bcrypt');

// app.use('/', express.static(path.join(__dirname, '/uploads')));


// trial

// trial

// mysql package

const mysql = require("mysql");

// db connection 
const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"intervw_db",
});



app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.use(express.static('uploads'))
app.use("/uploads", express.static("uploads"));

var imgconfig = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null, "./uploads")
    },
    filename:(req,file,callback)=>{
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
});

const isImage = (req, file, callback) => {
    if(file.mimetype.startsWith("image")){
        callback(null, true);
    }
    else{
        callback(null, Error('only image is allowed'));
    }
}


var upload = multer({
    storage:imgconfig,
    fileFilter:isImage,
});


app.post("/api/update_profile/:id", upload.single("photo"), (req, res) => {


    const {filename} = req.file;
    const {id} = req.params;

    console.log("test_data");
    console.log(req.file);
    console.log("test_data");
    console.log(id);

    if(!filename)
    {
        res.send("2");
    }
    
    try{

         const sqlupdate = "UPDATE registered_users SET user_image = ? WHERE id = ?";
    db.query(sqlupdate, [filename, id], (err, result)=>{
        if(err){
            console.log("error", err);
        }
        else{
            console.log("result", result);
        }
        
        
    });
       
    }

    catch (error){
        res.send("1");
    }
    // const sqlget = "SELECT * FROM registered_users";
    // db.query(sqlget, (err, result)=>{
    //     console.log("error", err);
    //     console.log("result", result);
    //     res.send(result);
    // });
    // res.send("Hello Express");
});




app.get("/api/get", (req, res) => {
    const sqlget = "SELECT * FROM registered_users";
    db.query(sqlget, (err, result)=>{
        console.log("error", err);
        console.log("result", result);
        res.send(result);
    });
    // res.send("Hello Express");
});


// send data to db register user
app.post("/api/post", (req, res) => {

    const {user, email, password} = req.body;
    console.log(email);

    const sqlpost = "SELECT * FROM registered_users WHERE email = ?";
    db.query(sqlpost, email, (err, result)=>{

        if(err){
            console.log("error", err);
        }
        else{
            if(result.length > 0){
                res.send("2");
                console.log("already registered");
            }
            
        }

    });

        
        


    (async function main(){
        const saltrounds = 10;
        const original_password = password;

        const hashPassword = await bcrypt.hash(original_password, saltrounds);

        console.log(hashPassword);

        const sqlpost = "INSERT INTO registered_users (name, email, password) values(?,?,?)";
    db.query(sqlpost, [user, email, hashPassword], (err, result)=>{

        if(err){
            console.log("error", err);
        }
        
        
    });
   

    })();


    
});


app.get("/api/get/:id", (req, res) => {
    const {id} = req.params;
    const sqlget = "SELECT * FROM registered_users WHERE id = ?";
    db.query(sqlget, id, (err, result)=>{

        if (err)
        {
            console.log("error", err);
        }
        else{
            console.log("result", result);
            res.send(result);
        }
       
        
        
    });
    // res.send("Hello Express");
});


// send data to db register user
app.post("/api/fetch_details", (req, res) => {

    const {user, email, password} = req.body;
    const sqlpost = "INSERT INTO registered_users (name, email, password) values(?,?,?)";
    db.query(sqlpost, [user, email, password], (err, result)=>{

        if(err){
            console.log("error", err);
        }
        
        
    });
   
});


// // get user id
// app.get("/api/get_user_data", (req, res) => {

//     const {email, password} = req.body;
//     const sqlget = "SELECT * FROM registered_users WHERE email= ? AND password=?";
//     db.query(sqlget, [email, password], (err, result)=>{

//         if(err){
//             console.log("error", err);
//         }
//         else{

//             Object.keys(result).forEach(function(key){

//                 // data from db
//                 let login_data_rows_get = result[key];
//                 user_id = login_data_rows_get.id
                

                
//             });

//             console.log("user id is");
//             console.log(user_id);
//             res.send(user_id);
//         }
        
        
//     });
   
// });


// send check data to login
app.post("/api/login", (req, res) => {

    const {email, password} = req.body;
    const sqlLoginCheck = "Select * FROM registered_users WHERE email = ?";
    db.query(sqlLoginCheck, [email], (err, result)=>{

        if(err){
            console.log("error", err);
        }
        else{
            if(result.length > 0){
                Object.keys(result).forEach(function(key){

                    // data from db
                    let login_data_rows = result[key];
                    user_email = login_data_rows.email
                    user_id = login_data_rows.id
                    user_password = login_data_rows.password

                    // console.log(login_data_rows);
                    console.log('**************** data from database start *****************')

                    console.log(login_data_rows);

                    console.log('\n')
                    console.log('***********************************************************')

                    
                    console.log('\n')
                    console.log('**************** data from UI start *****************')

                    console.log('user values from user')
                    console.log(email)
                    console.log(password)
                    console.log('\n')
                    console.log('***********************************************************')



                    // **********************************************

                    // (async function main(){
                        
                        const original_password = password;
                        const db_password = user_password;

                        const passVerify = bcrypt.compareSync(original_password, db_password);
                
                        // const passVerify = await bcrypt.compare(original_password, db_password);
                
                        console.log(passVerify);

                        if(passVerify == true){
                            console.log("user caan login");
                            //res.send(user_id);
                            //res.sendStatus(user_id);
    
                            res.send({
                                user_id,
                              });
                            // res.send(user_id);
                        }
                        else{
                            console.log("user not registered");
                            res.send("2");
                        }



                
                    
                   
                
                    // })();

                    // **********************************************

                   
                    

                    
                });
            }
            else{
                console.log("user not registered");
                        res.send("2");
            }

        }
        
        
    });
   
});



app.get("/", (req, res) => {
    // const sqlinsert = "INSERT INTO registered_users (name, email, password) values('test11', 'test11@gmail.com', 'test11@123')";
    // db.query(sqlinsert, (err, result)=>{
    //     console.log("error", err);
    //     console.log("result", result);
    //     res.send("Hello Express");
    // });
    // res.send("Hello Express");
});

// check if app / backend is listening on port 5000


// app.use(express.static('./uploads'));

app.listen(5000, () => {
    console.log("server is running on port 5000");
})


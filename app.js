import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
const app = express();
const server = createServer(app)
app.use(bodyParser.json());

app.use('/image', express.static('uploads'))
const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
}
app.use(cors(corsOpts));

mongoose.connect('mongodb+srv://jayeshp:qedoEwQVtUijFTAp@cluster0.vrgqok6.mongodb.net/Cluster0?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const loginSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    mobileno: String
}, { collection: 'login' });

const contactUs = new mongoose.Schema({
    name: String,
    email: String,
    mobileno: String,
    message: String
}, { collection: 'contactUs' });

const blog = new mongoose.Schema({
    content: String,
    image: String,
    title: String
}, { collection: 'blog' });


const category = new mongoose.Schema({
    author: String,
    image: String,
    price: Number,
    title: String
}, { collection: 'category' });


const addtocart = new mongoose.Schema({
    quantity: String,
    bookname: String,
    price: Number,
    bookimg: String,
    author: String
}, { collection: 'cart' });





const LoginData = mongoose.model('LoginData', loginSchema);
const ContactUs = mongoose.model('ContactUs', contactUs);
const Blog = mongoose.model('blog', blog);
const Category = mongoose.model('category', category);

app.post('/register', async (req, res) => {
    try {
        let body = req.body;
        let isUser = await LoginData.find({ username: body.username });
        let error = false;
        let data = {};
        if (isUser.length == 0) {
            if (!body.username) {
                data.username = "Please Enter Username";
                error = true;
            }
            if (!body.password) {
                data.password = "Please Enter Password";
                error = true;
            }
            if (!body.email) {
                data.password = "Please Enter Email";
                error = true;
            }
            if (!body.mobileno) {
                data.password = "Please Enter Mobile Number";
                error = true;
            }
            if (!error) {
                const newUser = new LoginData(body);
                const savedUser = await newUser.save();
                res.status(200).send({ code: 0, returnMessage: 'Register Successfully', data: savedUser })
            }
            else {
                res.status(400).send({ code: 1, error: data })
            }
        }
        else {
            res.send({ code: 1, returnMessage: "User Already Exist" })
        }
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
})

app.post('/login', async (req, res) => {
    try {
        let body = req.body;
        console.log("body", body);
        let isUser = await LoginData.findOne({ username: body.username });
        console.log("body", isUser);
        let data = {};
        let error = false;
        if (isUser) {
            if (!body.username) {
                data.username = "Please Enter Username";
                error = true;
            }
            if (!body.password) {
                data.password = "Please Enter Password";
                error = true;
            }
            if (!body.email) {
                data.password = "Please Enter Email";
                error = true;
            }
            if (!error) {
                res.status(200).send({ code: 0, returnMessage: 'Login Successfully' })
            }
            if (error) {
                res.status(400).send({ code: 1, error: data })
            }
        }
        else {
            res.send({ code: 1, returnMessage: "User Doesn't Exist" })
        }
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
})



app.get('/get-contact-data', async (req, res) => {
    try {
        let contactData = await ContactUs.find({});
        res.send({ code: 0, data: contactData })
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
})

app.post('/add-contact-data', async (req, res) => {
    try {
        let body = req.body;
        let data = {};
        let error = false;
        if (!body.message) {
            data.message = "Please Enter message";
            error = true;
        }
        if (!body.name) {
            data.name = "Please Enter name";
            error = true;
        }
        if (!body.mobileno) {
            data.mobileno = "Please Enter Mobile No";
            error = true;
        }
        if (!body.email) {
            data.email = "Please Enter email";
            error = true;
        }
        if (!error) {
            const newUser = new ContactUs(body);
            const savedUser = await newUser.save();
            res.status(200).send({ code: 0, returnMessage: 'Contact Successfully', data: savedUser })
        }
        if (error) {
            res.status(400).send({ code: 1, error: data })
        }
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
})



// app.post('/upload', (req, res) => {
//     upload(req, res, (err) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('An error occurred');
//         } else {
//             if (req.file) {
//                 console.log('File uploaded:', req.file);
//                 res.status(200).send('File uploaded successfully');
//             } else {
//                 res.status(400).send('No file selected');
//             }
//         }
//     });
// })


app.get('/get-blog', async (req, res) => {
    try {
        let BlogData = await Blog.find({});
        res.send({ code: 0, data: BlogData })
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
})

app.get('/get-category', async (req, res) => {
    try {
        let CategoryData = await Category.find({});
        res.send({ code: 0, data: CategoryData })
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
})

app.post('/add-to-cart', async (req, res) => {
    try {
        let body = req.body;
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
})

app.get('/', function (req, res) {
    res.send('we are at the root route of our server');
})

app.post('/change-password', async (req, res) => {
    try {
        let body = req.body;
        console.log("body", body);
        if (body.username) {
            const user = await LoginData.findOne({ username: body.username });
            if (body.newPassword) {
                if (body.newPassword == body.oldPassword) {
                    res.status(400).send({ code: 1, returnMessage: "Old And New Password Are Same!!!" })
                }
                else {
                    user.password = body.password;
                    const result = await LoginData.replaceOne({ username: body.username }, user);
                    res.status(200).send({ code: 0, returnMessage: "Password Changed Successfully" })
                }
            }
            else {
                res.status(400).send({ returnMessage: "Password Required!!!" })
            }

        }
        else {
            res.status(400).send({ returnMessage: "Username Required!!!" })
        }
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
})



// Admin_Apis



const adminLoginSchema = new mongoose.Schema({
    username: String,
    password: String,
}, { collection: 'adminLogin' });
const AdminLoginData = mongoose.model('AdminLoginData', adminLoginSchema);

const addBook = new mongoose.Schema({
    bookname: String,
    price: String,
    imageUrl: String,
    type: String,
    author: String
}, { collection: 'book' });

const BookData = mongoose.model('BookData', addBook);



app.post('/Adminlogin', async (req, res) => {
    try {
        let body = req.body;
        console.log("body", body);
        let isUser = await AdminLoginData.findOne({ username: body.username });
        console.log("body", isUser);
        let data = {};
        let error = false;
        if (isUser) {
            if (!body.username) {
                data.username = "Please Enter Username";
                error = true;
            }
            if (!body.password) {
                data.password = "Please Enter Password";
                error = true;
            }
            if (!error) {
                res.status(200).send({ code: 0, returnMessage: 'Login Successfully' })
            }
            if (error) {
                res.status(400).send({ code: 1, error: data })
            }
        }
        else {
            res.send({ code: 1, returnMessage: "User Doesn't Exist" })
        }
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
})

app.post('/change-password', async (req, res) => {
    try {
        let body = req.body;
        console.log("body", body);
        if (body.username) {
            const user = await AdminLoginData.findOne({ username: body.username });
            if (body.newPassword) {
                if (body.newPassword == body.oldPassword) {
                    res.status(400).send({ code: 1, returnMessage: "Old And New Password Are Same!!!" })
                }
                else {
                    user.password = body.password;
                    const result = await AdminLoginData.replaceOne({ username: body.username }, user);
                    res.status(200).send({ code: 0, returnMessage: "Password Changed Successfully" })
                }
            }
            else {
                res.status(400).send({ returnMessage: "Password Required!!!" })
            }

        }
        else {
            res.status(400).send({ returnMessage: "Username Required!!!" })
        }
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


const upload = multer({ storage: storage });

app.post('/book', upload.single('image'), (req, res) => {
    try {
        const { bookData } = req.body;
        const { bookname, price, type, author } = JSON.parse(bookData);
        const imageUrl = 'image/' + req.file.filename;
        console.log(req.file);
        const book = new BookData({ bookname, author, price, type, imageUrl, imageName: req.file.filename });
        book.save();
        res.status(200).send({ code: 0, returnMessage: 'Book Added successfully' });
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
},);
app.get('/get-book', async (req, res) => {
    try {
        const book = await BookData.find({});
        // book.forEach(x => {
        //     x.imageUrl = window.location.origin + '/' + x.imageUrl;
        // })
        res.status(200).send({ code: 0, data: book });
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
},);

app.delete('/Deletebook/:id', async (req, res) => {
    let id = req.params.id;
    try {
        if (id) {
            const user = await BookData.findOne({ _id: id });
            if (user) {
                console.log(id);
                const book = await BookData.findOneAndDelete({ _id: id });
                res.status(200).send({ code: 0, data: book, returnMessage: 'Deleted Successfully!' });
            }
            else {
                res.status(400).send({ code: 1, returnMessage: "User Doesn't Exist!" });
            }
        }
        else {
            res.status(400).send({ code: 1, returnMessage: 'Id Not Valid!!' });
        }
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
});
app.post('/UpdateBook/:id', async (req, res) => {
    try {
        let id = req.params.id;
        if (id) {
            console.log(id);
            const book = await BookData.findOneAndDelete({ _id: id });
            res.status(200).send({ code: 0, data: book, returnMessage: 'Deleted Successfully!' });
        }
        else {
            res.status(400).send({ code: 1, returnMessage: 'Id Not Valid!!' });
        }
    }
    catch {
        res.status(401).send({ code: 2, returnMessage: 'something went wrong' });
    }
});


function deleteImage(filename) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const imagePath = path.join(__dirname, 'uploads', filename);

    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error('Error deleting image:', err);
            return;
        }
        console.log('Image deleted successfully');
    });
}

// Example usage
// const filenameToDelete = 'delete.png';
// deleteImage(filenameToDelete);

// Server Port 
app.listen(3000, () => {
    console.log('Server Is Running on Port 3000')
})
const Signup = require("./models/signupSchema")
const Request=require("./models/requestSchema")
const Books=require("./models/bookSchema")

const express = require("express");
const mdb = require("mongoose");
const dotenv = require("dotenv");
const bcrypt=require('bcrypt')
const cors=require('cors')
const jwt=require('jsonwebtoken')
const app = express();

app.use(cors({
    origin:['https://library-project-nine.vercel.app/','http://localhost:5173'],
    methods:['GET','POST','DELETE'],
    allowedHeaders:['Content-Type','Authorization','x-access-token']
}))

app.use(express.json())
const PORT = 3002;
dotenv.config();

mdb.connect(process.env.MONGODB_URL)   //if doesnt connect use this inside paranthesis- "mongodb://127.0.0.1:27017/sjit" which is local compass
.then(() => {
    console.log("DB Connection Successful");
})
.catch((err) => {
    console.log("Check your Connection String", err);
});

  
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Backend Server Hehekeke </h1>");
});

app.post("/signup",async (req,res)=>{
    try{
        const {firstName,email,password,phoneNumber}=req.body
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists", isSignup: false });
        }
        const hashPassword= await bcrypt.hash(password,10)
        const newSignup= new Signup({
            firstName:firstName,
            email:email,
            password:hashPassword,
            phoneNumber:phoneNumber,
        })
        await newSignup.save()
        console.log("Signup Successful")
        res.status(201).json({message:"Signup Successful",isSignup:true})
    }
    catch(error){
        res.status(201).json({message:"Signup UnSuccessful",isSignup:false})
    }
})







const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ auth: false, message: "Token required" });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ auth: false, message: "Invalid token" });
      }
      req.user = decoded;  // Instead of req.userId = decoded.id
      next();
    });
  };
  
  
//   app.get("/isUserAuth",verifyJWT,async(req,res)=>{
//     res.send("you are Authenticated!!!!!!")
//   })
   
  app.get("/getUserDetails", verifyJWT, async (req, res) => {
    try {
        const user = await Signup.findById(req.user.id).select("-password"); // Exclude password
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user details" });
    }
  });
  

app.post("/login",async(req,res)=>{
    try{
      const {email,password}=req.body
      const user=await Signup.findOne({email:email})
       // Debugging: Log input data
      console.log("Login request received:", email, password);
    //   console.log(user)
      if(!user){
        return res.status(400).json({message:"Invalid User",isLogin:false});
      }
      const pass=await bcrypt.compare(password,user.password);
      if(!pass){
        return res.status(400).json({message:"Invalid Password",isLogin:false})
      }
      const payload={
        id:user._id,
        firstname:user.firstName,
        email:user.email
    }
    const token=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"1hr"})
    console.log(token)
    res.status(201).json({isLogin:true,auth:true,token:token,user:user,message:"Login Successful"})
    
    console.log("Login Successful")
    }
    catch(error){
      console.log("Error During Login")
      res.status(201).json({message:"Login UnSuccessful",isLogin:false})
    }
})






app.post("/add", async (req, res) => {
    try {
        const { title, author } = req.body;

        // Check if the book already exists
        const existingBook = await Books.findOne({ title });
        if (existingBook) {
            return res.status(400).json({ message: "Book already exists", isAddBook: false });
        }

        // Create new book
        const newBook = new Books({
            title: title,
            author: author
        });

        await newBook.save();
        console.log("Book adding Successful");

        res.status(201).json({ message: "Book Adding Successful", isAddBook: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Book Adding Unsuccessful", isAddBook: false });
    }
});

app.delete("/delete", async (req, res) => {
    try {
        const { title } = req.body;

        // Check if the book exists
        const existingBook = await Books.findOne({ title });
        if (!existingBook) {
            return res.status(404).json({ message: "Book not found", isDeleted: false });
        }

        // Delete the book
        await Books.findOneAndDelete({ title });
        console.log("Book deletion successful");

        res.status(200).json({ message: "Book Deletion Successful", isDeleted: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Book Deletion Unsuccessful", isDeleted: false });
    }
});

app.get("/books", async (req, res) => {
    try {
        const books = await Books.find();

        // Process books to determine availability
        const formattedBooks = books.map(book => {
            const lastBorrow = book.borrowHistory.length > 0 
                ? book.borrowHistory[book.borrowHistory.length - 1] 
                : null;
            
            const isAvailable = !lastBorrow || lastBorrow.returned; 
            // console.log(book._id)
            return {
                id:book._id,
                title: book.title,
                author: book.author,
                available: isAvailable
            };
        });

        res.status(200).json({ books: formattedBooks, message: "Books fetched successfully", isFetched: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching books", isFetched: false });
    }
});

app.post("/request", async (req, res) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        console.log("Request body:", req.body); // Debugging log

        const { bookId } = req.body;
        console.log("Extracted bookId:", bookId); // Debugging log

        if (!bookId) {
            return res.status(400).json({ error: "Book ID is required." });
        }

        const user = await Signup.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const book = await Books.findById(bookId);
        if (!book || !book.available) {
            return res.status(400).json({ error: "Book is not available." });
        }

        book.available = false;
        await book.save();

        const borrowDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        user.borrowHistory.push({
            bookId,
            borrowDate,
            dueDate,
            returned: false,
        });

        await user.save();

        res.status(201).json({ message: "Book requested successfully." });

    } catch (error) {
        console.error("Error processing book request:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});



app.post("/accept",async (req,res)=>{
    try{
        const { requestId, userId, bookId } = req.body;
        // Validate input
        if (!requestId || !userId || !bookId) {
            return res.status(400).json({ error: "Request ID, User ID, and Book ID are required." });
        }
        // Find the request
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found." });
        }

        // Check if the request is already approved
        if (request.status === "Approved") {
            return res.status(400).json({ error: "Request is already approved." });
        }

        // Find the book
        const book = await Books.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book not found." });
        }

        // Find the user
        const user = await Signup.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Update the request status to "Approved"
        request.status = "Approved";
        await request.save();

        // Find the request in the book's borrowRequests and update its status
        const requestIndex = book.borrowRequests.findIndex(req => req._id.toString() === requestId);
        if (requestIndex !== -1) {
            book.borrowRequests[requestIndex].status = "Approved";
        }

        // Calculate due date (e.g., 14 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        // Add to book's borrowHistory
        book.borrowHistory.push({
            userId,
            borrowDate: new Date(),
            dueDate,
            returned: false,
        });

        // Add to user's borrowHistory
        user.borrowHistory.push({
            bookId,
            borrowDate: new Date(),
            dueDate,
            returned: false,
        });

        // Save changes
        await book.save();
        await user.save();

        res.status(200).json({ message: "Request approved successfully." });

    } catch (error) {
        console.error("Error approving request:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
})

app.post("/reject", async (req, res) => {
    try {
        const { requestId, userId, bookId } = req.body;

        // Validate input
        if (!requestId || !userId || !bookId) {
            return res.status(400).json({ error: "Request ID, User ID, and Book ID are required." });
        }

        // Find the request
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found." });
        }

        // Check if the request is already processed
        if (request.status !== "Pending") {
            return res.status(400).json({ error: "Request is already processed." });
        }

        // Update the request status to "Rejected"
        request.status = "Rejected";
        await request.save();

        res.status(200).json({ message: "Request rejected successfully." });

    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

app.post("/return", async (req, res) => {
    try {
        const { bookId } = req.body;

        // Validate input
        if (!bookId) {
            return res.status(400).json({ error: "Book ID is required." });
        }
        // Find the book
        const book = await Books.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book not found." });
        }

        // Find the latest borrow entry that is not returned
        const borrowEntry = book.borrowHistory.find(entry => !entry.returned);
        if (!borrowEntry) {
            return res.status(400).json({ error: "This book is not currently borrowed." });
        }

        // Update the book's borrow history (mark as returned)
        borrowEntry.returned = true;
        await book.save();

        // Find the user and update their borrow history
        const user = await Signup.findOne({ _id: borrowEntry.userId });
        if (user) {
            const userBorrowEntry = user.borrowHistory.find(entry => entry.bookId.toString() === bookId && !entry.returned);
            if (userBorrowEntry) {
                userBorrowEntry.returned = true;
                await user.save();
            }
        }

        res.status(200).json({ message: "Book returned successfully." });

    } catch (error) {
        console.error("Error returning book:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

app.get("/search", async (req, res) => {
    try {
        const books = await Books.find({},"title author borrowHistory");

        if (books.length === 0) { // Check if books array is empty
            return res.status(404).json({ message: "No books available right now" });
        }

        const formattedBooks=books.map(book=>{
            const lastBorrow=book.borrowHistory.length>0?book.borrowHistory[book.borrowHistory.length-1]:null;
            const availability=(!lastBorrow|| lastBorrow.returned)?"Available":"Not Available";

            return{
                _id:book._id,
                title:book.title,
                author:book.author,
                availability:availability
            }
        })

        res.status(200).json({ message: "Here are the books", books:formattedBooks });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Server error while fetching books" });
    }
});


app.get("/history", async (req, res) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token and extract user ID
        const decoded = jwt.verify(token,process.env.SECRET_KEY); // Replace with your actual secret key
        const userId = decoded.id;

        const user = await Signup.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.borrowHistory || user.borrowHistory.length === 0) {
            return res.status(404).json({ message: "No borrow history" });
        }

        const formattedHistory = await Promise.all(
            user.borrowHistory.map(async (history) => {
                const book = await Books.findById(history.bookId);
                return {
                    id:history._id,
                    book: book ? book.title : "Unknown Book",
                    borrowDate: history.borrowDate,
                    dueDate: history.dueDate,
                    returned: history.returned
                };
            })
        );

        res.status(200).json({ message: "Borrow history retrieved", borrowHistory: formattedHistory });

    } catch (error) {
        console.error("Error retrieving borrow history:", error);
        res.status(500).json({ message: "Error retrieving borrow history" });
    }
});


app.listen(PORT, () => console.log("Server Started Successfully"));


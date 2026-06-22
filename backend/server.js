const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const ADMIN_WHATSAPP = "971567275589";
const ROOT_DIR = path.join(__dirname, "..");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(ROOT_DIR));

const demoSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    business: String,
    businessType: String,
    service: String,
    message: String,
  },
  { timestamps: true }
);

const Demo = mongoose.model("Demo", demoSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(ROOT_DIR, "index.html"));
});

app.get("/book-demo", (req, res) => {
  res.sendFile(path.join(ROOT_DIR, "book-demo.html"));
});

app.get("/book-demo.html", (req, res) => {
  res.sendFile(path.join(ROOT_DIR, "book-demo.html"));
});

app.get("/thank-you", (req, res) => {
  res.redirect("/thank-you.html");
});

app.get("/thank-you.html", (req, res) => {
  res.sendFile(path.join(ROOT_DIR, "backend", "thank-you.html"));
});

app.post("/api/book-demo", async (req, res) => {
  try {
    const { name, phone, email, business, businessType, service, message } = req.body;

    if (!name || !phone || !email || !business || !businessType || !service) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    await Demo.create({
      name,
      phone,
      email,
      business,
      businessType,
      service,
      message,
    });

    const whatsappText =
      `NEW DEMO REQUEST\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Business: ${business}\n` +
      `Industry: ${businessType}\n` +
      `Service: ${service}\n` +
      `Message: ${message || "No message"}`;

    await sendEmails({
      name,
      phone,
      email,
      business,
      businessType,
      service,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your demo request submitted successfully.",
      whatsapp: `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(whatsappText)}`,
    });
  } catch (error) {
    console.error("❌ Server Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

async function sendEmails(data) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("⚠️ Email skipped: EMAIL_USER or EMAIL_PASS missing");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"LoopTech Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Demo Request - LoopTech",
      html: `
        <h2>New Demo Request</h2>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Business:</b> ${data.business}</p>
        <p><b>Industry:</b> ${data.businessType}</p>
        <p><b>Service:</b> ${data.service}</p>
        <p><b>Message:</b> ${data.message || "No message"}</p>
      `,
    });

    await transporter.sendMail({
      from: `"LoopTech Software Solutions" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Thank You For Contacting LoopTech",
      html: `
        <div style="font-family:Segoe UI,sans-serif;padding:20px">
          <h2 style="color:#25d366">Thank You, ${data.name}!</h2>
          <p>Your demo request has been submitted successfully.</p>
          <p>Our LoopTech team will contact you shortly.</p>
          <hr>
          <p><b>Your Request Details</b></p>
          <p><b>Business:</b> ${data.business}</p>
          <p><b>Industry:</b> ${data.businessType}</p>
          <p><b>Service:</b> ${data.service}</p>
          <br>
          <p><b>LoopTech Software Solutions</b></p>
          <p>📞 +971 56 727 5589</p>
          <p>📧 jcjlooptech@gmail.com</p>
          <p>📍 Abu Dhabi, UAE</p>
        </div>
      `,
    });

    console.log("✅ Emails sent successfully");
  } catch (error) {
    console.log("❌ Email Error:", error.message);
  }
}

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
}

startServer();
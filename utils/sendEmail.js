const nodemailer = require("nodemailer");
const EmailLog = require("../models/emailLog");

function generateOTP() {
  const min = 100000;
  const max = 999999;
  return String(Math.floor(Math.random() * (max - min + 1) + min));
}

function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USR,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.USR,
    to: email,
    subject: "OTP for Registration",
    text: `Your OTP for registration is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending OTP: " + error);
    } else {
      console.log("OTP sent: " + info.response);
    }
  });
}

function sendNewOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USR,
      pass: process.env.PASS,
    },
  });
  console.log(otp);
  const mailOptions = {
    from: process.env.USR,
    to: email,
    subject: "New OTP for Registration",
    text: `Your new OTP for registration is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending new OTP: " + error);
    } else {
      console.log("New OTP sent: " + info.response);
    }
  });
}

// Predefined email messages
const emailMessages = {
  taskAssigned: (user, task) => ({
    subject: `New Task Assigned: ${task.title}`,
    content: user.role === "Admin"
      ? `Hello Admin, A new task titled "${task.title}" has been created and assigned to ${task.assignedTo.name}.`
      : `Hello ${task.assignedTo.name}, You have been assigned a new task:
Title: ${task.title}
Description: ${task.description}
Due Date: ${task.dueDate}
Priority: ${task.priority}
Please complete it on time.`,
  }),

  taskUpdated: (user, task) => ({
    subject: `Task Updated: ${task.title}`,
    content: user.role === "Admin"
      ? `Hello Admin, The task "${task.title}" assigned to ${task.assignedTo.name} has been updated.
Title: ${task.title}
Status: ${task.status}
Due Date: ${task.dueDate}`
      : `Hello ${task.assignedTo.name}, Your task has been updated:
Title: ${task.title}
Status: ${task.status}
Due Date: ${task.dueDate}
Please review the changes.`,
  }),

  taskCompleted: (user, task) => ({
    subject: `Task Completed: ${task.title}`,
    content: `The task "${task.title}" assigned to ${task.assignedTo.name} has been marked as completed.`,
  }),

  taskDeleted: (user, task) => ({
    subject: `Task Deleted: ${task.title}`,
    content: user.role === "Admin"
      ? `Hello Admin, The task "${task.title}" has been deleted.`
      : `Hello ${task.assignedTo.name}, Your assigned task "${task.title}" has been deleted.`,
  }),
};

async function sendEmail(user, task, type) {
  try {
    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USR,
        pass: process.env.PASS,
      },
    });
    // Check if the email type is defined
    if (!emailMessages[type]) {
      throw new Error("Invalid email type specified.");
    }

    // Generate the subject and content based on the email type
    const { subject, content } = emailMessages[type](user, task);

    // console.log({ subject, content })
    // Send the email
    const mailOptions = {
      from: process.env.USR,
      to: user.email,
      subject,
      text: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending new message: " + error);
      } else {
        console.log("New message sent: " + info.response);
      }
    });

    // Log the sent email in MongoDB
    const newEmailLog = new EmailLog({
      to: user.email,
      subject,
      content,
      status: "Sent",
    });
    
    await newEmailLog.save();

  } catch (error) {
    // Log the failed email in MongoDB
    await EmailLog.create({
      to,
      subject: type ? emailMessages[type].subject : "Unknown",
      content: type ? emailMessages[type].content : "Unknown",
      status: "Failed",
      errorMessage: error.message,
    });

    console.error("Error sending email:", error);
  }
}

module.exports = {
  sendEmail,
  generateOTP,
  sendOTP,
  sendNewOTP,
};

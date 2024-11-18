import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";

export async function POST(request: Request) {
  const emailPassword = process.env.NEXT_EMAIL_PASSWORD;
  const transporter = createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true,
    auth: {
      user: "happy2help@sarthaki.in",
      pass: emailPassword,
    },
  });

  try {
    const req = await request.json();

    req.emails.forEach(async (email: string) => {
      const mail = await transporter.sendMail({
        from: '"Sarthaki HelpDesk" <happy2help@sarthaki.in>"',
        to: email,
        subject: "Transformatrix Quiz",
        html: `
            <div>
            Hello User, you have been assigned a quiz. <br/>
            <div>
              Quiz Name - ${req.quizName} <br/>
              Total Questions - ${req.totalQuestionCount} <br/>
              Link - <a href="http://localhost:3000/quizzes/${req.quizId}" target="_blank">http://localhost:3000/quizzes/${req.quizId}</a> <br/>
            </div>
            </div>`,
      });
      console.log("Success - " + email + mail.response);
    });
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Message Sent",
    });
  } catch (error) {
    console.error("Error: " + error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Error sending email",
      error: error,
    });
  }
}

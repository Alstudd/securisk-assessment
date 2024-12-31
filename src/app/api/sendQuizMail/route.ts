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

    const emailPromises = req.emails.map(async (email: string) => {
      const mail = await transporter.sendMail({
        from: '"Sarthaki HelpDesk" <happy2help@sarthaki.in>',
        to: email,
        subject: `Securisk Assessment - ${req.subject}`,
        html: `
          <div>
            Hello user, ${req.message} <br/>
            <div>
              Quiz Name - ${req.quizName} <br/>
              Total Questions - ${req.totalQuestionCount} <br/>
              Link - <a href="${process.env.NEXT_PUBLIC_API_URL}/quizzes/${req.quizId}" target="_blank">${process.env.NEXT_PUBLIC_API_URL}/quizzes/${req.quizId}</a> <br/>
            </div>
          </div>`,
      });
      console.log("Success - " + email + mail.response);
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({
        status: 200,
        success: true,
        message: "Message Sent",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Error: " + error);
    return new Response(
      JSON.stringify({
        status: 500,
        success: false,
        message: "Error sending email",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

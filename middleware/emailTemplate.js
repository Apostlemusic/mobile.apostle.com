import sendEmail from "./sendEmail.js";

export async function activationEmail({name, email, otp}) {
  const html = `
    <div style="font-family: Arial; color: #333;">
      <h2>Hello ${name},</h2>
      <p>Thank you for joining us!</p>

      <p>Your activation code is:</p>
      <h1>${otp}</h1>

      <p>If you did not request this, simply ignore.</p>
      <br/>

      <p>
        Reach your spiritual goals effortlessly, whether it's deepening your faith or finding uplifting sermons and songs.
      </p>
      <br />

      <p>Regards,<br/>Apostles</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Apostle | Activate Your Account",
    html,
  });
}

export async function forgotPasswordEmail({ name, email, otp }) {
  const html = `
    <div style="font-family: Arial; color: #333;">
      <h2>Hello ${name},</h2>
      <p>We received a request to reset your password.</p>

      <p>Your password reset code is:</p>
      <h1>${otp}</h1>

      <p>If you did not request this, simply ignore this email.</p>
      <br/>

      <p>
        Keep your account secure and never share your OTP with anyone.
      </p>
      <br />

      <p>Regards,<br/>Apostles</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Apostle | Password Reset OTP",
    html,
  });
}

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const LOGO_URL="https://res.cloudinary.com/dk9shqzdu/image/upload/v1775067795/logo_wfchsj.png";

const sendBookingEmail = async (userEmail, userName, car, booking) => {
  await transporter.sendMail({
    from: `"PrimeDrive" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Your Booking is Confirmed | PrimeDrive",
    html: `
    <div style="margin:0; padding:0; background:#f6f9fc; font-family:Arial, sans-serif; line-height:1.6;">
      
      <div style="max-width:600px; margin:40px auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="padding:30px; text-align:center; border-bottom:1px solid #eee;">
          <img src="${LOGO_URL}" style="height:80px; margin-bottom:7px;" />
          <p style="margin:5px 0; color:#777;">Drive Your Journey with Confidence</p>
        </div>

        <!-- Body -->
        <div style="padding:35px;">
          <h2 style="margin-top:0; color:#111;">Booking Successfully Confirmed</h2>
          
          <p style="color:#444; font-size:15px;">
            Hi <b>${userName}</b>,
          </p>

          <p style="color:#555;">
            We are delighted to inform you that your booking has been successfully confirmed with <b>PrimeDrive</b>. 
            Your reservation is now secured, and your selected vehicle will be ready for you on the scheduled date.
          </p>

          <p style="color:#555;">
            Below you will find a detailed summary of your booking. Please review the information carefully 
            and keep this email for your records.
          </p>

          <!-- Booking Card -->
          <div style="background:#f9fafb; padding:22px; border-radius:10px; margin-top:20px;">
            
            <p><b>Vehicle Selected:</b><br/>
            ${car.brand} ${car.model} — A reliable and comfortable choice for your journey.</p>

            <p><b>Pickup Date:</b><br/>
            ${new Date(booking.pickupDate).toLocaleDateString()} — Please ensure timely arrival.</p>

            <p><b>Return Date:</b><br/>
            ${new Date(booking.returnDate).toLocaleDateString()} — Late returns may incur additional charges.</p>

            <p><b>Total Booking Amount:</b><br/>
            <span style="color:#16a34a; font-size:18px; font-weight:bold;">
              Rs. ${booking.price}
            </span></p>

          </div>

          <!-- Instructions -->
          <h3 style="margin-top:30px;">Important Instructions</h3>
          <p style="color:#555;">
            • Please carry your valid ID or driving license at the time of pickup.<br/>
            • Make sure to inspect the vehicle before starting your trip.<br/>
            • Follow all traffic rules and drive responsibly.<br/>
            • Contact our support team if you face any issues during your rental period.
          </p>

          <!-- Support -->
          <h3 style="margin-top:30px;">Need Assistance?</h3>
          <p style="color:#555;">
            Our support team is available to help you at every step. Whether you need to modify your booking, 
            extend your rental period, or have any general inquiries, feel free to reach out to us anytime.
          </p>

          <!-- CTA -->
          <div style="text-align:center; margin:35px 0;">
            <a href="#" style="background:#2563eb; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold;">
              Manage Your Booking
            </a>
          </div>

          <!-- Closing -->
          <p style="color:#555;">
            Thank you for choosing <b>PrimeDrive</b>. We truly appreciate your trust in our service and 
            look forward to providing you with a smooth, safe, and enjoyable driving experience.
          </p>

          <p style="color:#555;">
            Wishing you a fantastic journey ahead
          </p>

        </div>

        <!-- Footer -->
        <div style="padding:25px; text-align:center; font-size:12px; color:#888; border-top:1px solid #eee;">
          © ${new Date().getFullYear()} PrimeDrive. All rights reserved.<br/>
        </div>

      </div>
    </div>
    `,
  });
};



const sendCancelEmail = async (userEmail, userName, car, booking) => {
  await transporter.sendMail({
    from: `"PrimeDrive" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Booking Cancelled | PrimeDrive",
    html: `
    <div style="margin:0; padding:0; background:#f6f9fc; font-family:Arial, sans-serif; line-height:1.6;">
      
      <div style="max-width:600px; margin:40px auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="padding:30px; text-align:center; border-bottom:1px solid #eee;">
          <img src="${LOGO_URL}" style="height:90px; margin-bottom:7px;" />
          <p style="margin:5px 0; color:#777;">Drive Your Journey with Confidence</p>
        </div>

        <!-- Body -->
        <div style="padding:35px;">
          <h2 style="margin-top:0; color:#111;">Your Booking Has Been Cancelled</h2>

          <p>Hi <b>${userName}</b>,</p>

          <p style="color:#555;">
            We would like to inform you that your booking has been successfully cancelled as per your request.
            We understand that plans can change, and we’re here to make the process as smooth as possible.
          </p>

          <!-- Booking Info -->
          <div style="background:#f9fafb; padding:22px; border-radius:10px; margin-top:20px;">
            
            <p><b>Vehicle:</b><br/> ${car.brand} ${car.model}</p>
            <p><b>Pickup Date:</b><br/> ${new Date(booking.pickupDate).toLocaleDateString()}</p>
            <p><b>Return Date:</b><br/> ${new Date(booking.returnDate).toLocaleDateString()}</p>

          </div>

          <!-- Refund -->
          <h3 style="margin-top:30px;">Refund Information</h3>
          <p style="color:#555;">
            If your booking included a prepaid amount, the refund (if applicable) will be processed 
            according to our refund policy. Please allow a few business days for the amount to reflect 
            in your account.
          </p>

          <!-- Why choose us -->
          <h3 style="margin-top:30px;">We’d Love to Serve You Again</h3>
          <p style="color:#555;">
            Although this booking was cancelled, we hope to assist you again in the future. 
            PrimeDrive is committed to providing reliable vehicles, affordable pricing, 
            and a seamless booking experience.
          </p>

          <!-- CTA -->
          <div style="text-align:center; margin:35px 0;">
            <a href="#" style="background:#2563eb; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold;">
              Book Another Ride
            </a>
          </div>

          <!-- Closing -->
          <p style="color:#555;">
            Thank you for considering <b>PrimeDrive</b>. If you have any feedback or need assistance, 
            feel free to reach out to our support team.
          </p>

        </div>

        <!-- Footer -->
        <div style="padding:25px; text-align:center; font-size:12px; color:#888; border-top:1px solid #eee;">
          © ${new Date().getFullYear()} PrimeDrive. All rights reserved.
        </div>

      </div>
    </div>
    `,
  });
};

export { sendBookingEmail, sendCancelEmail };
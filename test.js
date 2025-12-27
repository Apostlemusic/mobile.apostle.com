import { activationEmail } from "./middleware/emailTemplate.js";

                await activationEmail({
                    name: 'JENNy',
                    email: 'successakin123@gmail.com',
                    otp: '9908'
                })
import OtpModel from "../model/Otp.js";
import SongModel from "../model/Song.js";

export async function generateOtp(userId, email) {
    const generateOtp = () => {
        // Generate a random 6-digit number
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); 
        return otp;
    };

    let otp;
    let exists = true;

    while (exists) {
        otp = generateOtp();
        exists = await OtpModel.findOne({ code: otp });
    }

    const otpCode = await new OtpModel({
        userId: userId,
        code: otp,
        email: email,
    }).save();

    return otp; 
}

export async function generateUniqueCode(length) {
    const courseSlug = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let slugCode = ''; 

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            slugCode += characters[randomIndex]; 
        }

        return slugCode;
    };

    let slugCode;
    let exists = true;

    while (exists) {
        slugCode = courseSlug();
        const existingCourse = await SongModel.findOne({ trackId: slugCode });
        exists = existingCourse !== null; 
    }

    return slugCode;
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
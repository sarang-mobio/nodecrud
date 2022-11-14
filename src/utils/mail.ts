import nodemailer from 'nodemailer';

export const sendEmail = (from: string, to: string, subject: string, html: string) => {
    const { MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD } = process.env;

    const mail = nodemailer.createTransport({
        host: MAIL_HOST,
        port: 2525,
        auth: {
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD
        }
    });

    let options = {
        from, to, subject, html
    }

    mail.sendMail(options, function(error,info){
        if(error){
            console.log(error);
            
        } else {
            console.log('Response:---------',info.response);

        }
    })

}
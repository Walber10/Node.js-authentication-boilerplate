import nodemailer from "nodemailer";
import HandlebarsMailTemplate from "./HandlebarsMailTemplate";
import { AppError, getErrorMessage } from "../../../middleware/error-handler";

interface IMailContact {
  name: string;
  email: string;
}

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariable;
}

interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplate;
}

export default class EtherealMail {
  static async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    try {
      const account = await nodemailer.createTestAccount();
      const mailTemplate = new HandlebarsMailTemplate();
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      const message = await transporter.sendMail({
        from: {
          name: from?.name || "Walber Amorim",
          address: from?.email || "walberamorimsp@gmail.com",
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject,
        html: await mailTemplate.parse(templateData),
      });
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    } catch (error) {
      throw new AppError(getErrorMessage(error), 500);
    }
  }
}

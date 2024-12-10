import nodemailer, { type Transporter } from 'nodemailer';

type Config = {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    fromAddress?: string;
    fromName?: string;
}

type SendMailOptions = {
    from?: string;
    fromName?: string;
    to: string;
    toName?: string;
    subject: string;
    body: string;
    isHtml?: boolean;
}

type SendMailerOptions = {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
}

/**
 * Class representing an email sender.
 */
export class Mail {
  private config: Config | any;
  private transporter: Transporter | any;

  /**
     * Set the configuration for the mail transporter.
     * @param {Config} config - The configuration object.
     */
  private setConfig(config: Config) {
    this.config = config;
  }

  /**
     * Initialize the mail transporter with the given configuration.
     * @param {Config} config - The configuration object.
     */
  public init(config: Config) {
    this.setConfig(config);

    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure, // true for 465, false for other ports
      auth: {
        user: config.user,
        pass: config.pass
      }
    });

    return this;
  }

  /**
     * Send an email.
     * @param {SendMailOptions} mailOptions - Options for sending the email.
     * @param {string} mailOptions.from - Sender's email address.
     * @param {string} mailOptions.to - Recipient's email address.
     * @param {string} mailOptions.subject - Email subject.
     * @param {string} mailOptions.text - Plain text body of the email.
     * @param {string} [mailOptions.html] - HTML body of the email (optional).
     * @returns {Promise<{}>} A promise that resolves to the result of the send operation.
     */
  async send(mailOptions: SendMailOptions): Promise<{}> {
    try {
      const fromAddress = mailOptions.from || this.config.fromAddress;
      const fromName = mailOptions.fromName || this.config.fromName;
      const toAddress = mailOptions.to;
      const toName = mailOptions.toName;

      const mailerOptions: SendMailerOptions = {
        from: fromName ? `${fromName} <${fromAddress}>` : fromAddress,
        to: toName ? `${toName} <${toAddress}>` : toAddress,
        subject: mailOptions.subject,
        text: mailOptions.body,
        html: mailOptions.isHtml ? mailOptions.body : ''
      };

      const info = await this.transporter.sendMail(mailerOptions);
      return info;
    } catch (error) {
      throw error;
    }
  }
}
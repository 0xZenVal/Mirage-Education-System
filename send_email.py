import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email, subject, body):
    # Email configuration
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    from_email = 'caseyng100@gmail.com'
    password = 'mspi xjcw ovye tluc'  # App Password

    # Create the email
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    try:
        # Connect to the SMTP server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Upgrade the connection to a secure encrypted SSL/TLS connection
        server.login(from_email, password)
        server.send_message(msg)
        print('Email sent successfully!')
    except Exception as e:
        print(f'Failed to send email: {e}')
    finally:
        server.quit()

# Example usage
if __name__ == '__main__':
    send_email('recipient@example.com', 'Test Email', '<h1>This is a test email</h1>')

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset Notification</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #f8f8f8;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            background: #ffffff;
            margin: 40px auto;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .email-header {
            background-color: #800000;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .email-header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
        }
        .email-body {
            padding: 25px;
        }
        .email-body h2 {
            color: #800000;
            font-size: 20px;
            margin-bottom: 15px;
        }
        .credential-box {
            background: #f9f0f0;
            border-left: 4px solid #800000;
            padding: 15px;
            margin: 20px 0;
            font-size: 15px;
            border-radius: 6px;
        }
        .credential-box p {
            margin: 5px 0;
        }
        .email-footer {
            text-align: center;
            font-size: 13px;
            color: #777;
            padding: 15px;
            background-color: #fafafa;
            border-top: 1px solid #eee;
        }
        a.button {
            display: inline-block;
            background-color: #800000;
            color: white !important;
            padding: 10px 18px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
            font-weight: bold;
            font-size: 14px;
        }
        a.button:hover {
            background-color: #a83232;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>EskwelaForEveryJuan</h1>
        </div>
        <div class="email-body">
            <h2>Password Reset Successful</h2>
            <p>Hi {{ $userDetails->name }},</p>
            <p>This is to inform you that your account password has been successfully reset.
            You can now log in using the new temporary credentials provided below:</p>

            <div class="credential-box">
                <p><strong>Username:</strong> {{ $userDetails->username }}</p>
                <p><strong>Temporary Password:</strong> {{ $plainPassword }}</p>
            </div>

            <p style="margin-bottom: 20px;">For your security, please log in and update your password immediately.</p>

            <a href="{{ config('app.url') }}" class="button">Go to Login</a>
        </div>
        <div class="email-footer">
            <p>Best regards,<br>{{ config('app.name') }} Team</p>
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

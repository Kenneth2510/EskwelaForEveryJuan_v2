<?php

namespace App\Mail\UserManagement;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendLearnerCredentials extends Mailable
{
    use Queueable, SerializesModels;

    public $email;
    public $plainPassword;
    public $userDetails;
    /**
     * Create a new message instance.
     */
    public function __construct($email, $plainPassword, $userDetails)
    {
        $this->email = $email;
        $this->plainPassword = $plainPassword;
        $this->userDetails = $userDetails;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to EskwelaForEveryJuan',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.userManagement.learnerManagement.learner-credentials',
            with: [
                'email' => $this->email,
                'plainPassword' => $this->plainPassword,
                'userDetails' => $this->userDetails,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

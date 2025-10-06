<?php

namespace App\Http\Requests\UserManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInstructorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var \App\Models\User $instructor */
        $instructor = $this->route('instructor');

        return [
            'fname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
            'mname' => ['nullable', 'regex:/^[A-Za-z\s\-]+$/'],
            'lname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
            'bday' => ['required', 'date'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($instructor->id) // ignore user.id
            ],
            'phone' => [
                'required',
                'regex:/^\+63\d{10}$/',
                Rule::unique('users', 'phone')->ignore($instructor->id) // ignore user.id
            ],
            'instructor_code' => [
                'required',
                'regex:/^[A-Z0-9\-]+$/',
                Rule::unique('instructors', 'instructor_code')->ignore($instructor->instructor->id ?? null) // ignore learner.id
            ],
            'instructor_type' => ['required', 'string'],
            'date_started' => ['nullable', 'date'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }


    public function messages()
    {
        return [
            'fname.required' => 'First name is required.',
            'fname.regex' => 'First name can only contain letters, spaces, and hyphens.',
            'mname.regex' => 'Middle name can only contain letters, spaces, and hyphens.',
            'lname.required' => 'Last name is required.',
            'lname.regex' => 'Last name can only contain letters, spaces, and hyphens.',
            'bday.required' => 'Birthday is required.',
            'bday.date' => 'Birthday must be a valid date.',
            'email.required' => 'Email is required.',
            'email.email' => 'Invalid email format.',
            'email.unique' => 'Email already exists.',
            'phone.required' => 'Phone number is required.',
            'phone.regex' => 'Phone number must start with +63 and contain 10 digits after it.',
            'phone.unique' => 'This phone number is already in use.',
            'instructor_code.required' => 'Instructor code is required.',
            'instructor_code.regex' => 'Instructor code can only contain uppercase letters, numbers, and hyphens.',
            'instructor_code.unique' => 'This instructor code is already in use.',
            'instructor_type.required' => 'Instructor type is required.',
            'date_started.date' => 'Date started must be a valid date.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either active or inactive.',
        ];
    }
}

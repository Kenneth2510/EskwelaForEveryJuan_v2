<?php

namespace App\Http\Requests\UserManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLearnerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
        // return auth()->check() && auth()->user()->hasRole('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var \App\Models\User $learner */
        $learner = $this->route('learner');

        return [
            'fname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
            'mname' => ['nullable', 'regex:/^[A-Za-z\s\-]+$/'],
            'lname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
            'bday' => ['required', 'date'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($learner->id) // ignore user.id
            ],
            'phone' => [
                'required',
                'regex:/^\+63\d{10}$/',
                Rule::unique('users', 'phone')->ignore($learner->id) // ignore user.id
            ],
            'student_number' => [
                'required',
                'regex:/^[A-Z0-9\-]+$/',
                Rule::unique('learners', 'student_number')->ignore($learner->learner->id ?? null) // ignore learner.id
            ],
            'course' => ['required', 'string'],
            'enrollment_date' => ['nullable', 'date'],
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
            'student_number.required' => 'Student number is required.',
            'student_number.regex' => 'Student number can only contain uppercase letters, numbers, and hyphens.',
            'student_number.unique' => 'This student number is already in use.',
            'course.required' => 'Course is required.',
            'enrollment_date.date' => 'Enrollment date must be a valid date.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either active or inactive.',
        ];
    }
}

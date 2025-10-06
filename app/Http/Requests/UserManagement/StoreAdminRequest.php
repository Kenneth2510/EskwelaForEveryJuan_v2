<?php

namespace App\Http\Requests\UserManagement;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdminRequest extends FormRequest
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
        return [
            'fname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
            'mname' => ['nullable', 'regex:/^[A-Za-z\s\-]+$/'],
            'lname' => ['required', 'regex:/^[A-Za-z\s\-]+$/'],
            'bday' => ['required', 'date'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['required', 'regex:/^\+63\d{10}$/', 'unique:users,phone'],
            'admin_code' => ['required', 'regex:/^[A-Z0-9\-]+$/', 'unique:admins,admin_code'],
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
            'admin_code.required' => 'Admin code is required.',
            'admin_code.regex' => 'Admin code can only contain uppercase letters, numbers, and hyphens.',
            'admin_code.unique' => 'This admin code is already in use.',
        ];
    }
}

package org.example.flashcardsweb

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class GoogleLoginRequest(
    val credential: String
)

data class AuthResponse(
    val token: String,
    val user: UserDto
)

data class UserDto(
    val id: Long,
    val name: String,
    val email: String
)
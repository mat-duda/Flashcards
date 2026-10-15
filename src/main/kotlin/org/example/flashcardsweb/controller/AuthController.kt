package org.example.flashcardsweb.controller

import org.example.flashcardsweb.dto.AuthResponse
import org.example.flashcardsweb.dto.GoogleLoginRequest
import org.example.flashcardsweb.dto.LoginRequest
import org.example.flashcardsweb.dto.RegisterRequest
import org.example.flashcardsweb.dto.UserDto
import org.example.flashcardsweb.model.User
import org.example.flashcardsweb.repository.UserRepository
import org.example.flashcardsweb.security.GoogleTokenVerifier
import org.example.flashcardsweb.security.JwtService
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.http.ResponseEntity

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val googleTokenVerifier: GoogleTokenVerifier
) {

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<Any> {
        if (userRepository.findByEmail(request.email) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(mapOf("message" to "Email already in use"))
        }
        else{
            val hashedPassword = passwordEncoder.encode(request.password)

            val newUser = User(
                name = request.email,
                password = hashedPassword,
                email = request.email,
            )

            val savedUser =userRepository.save(newUser)

            val token = jwtService.createToken(savedUser)
            val userDto = UserDto(savedUser.id!!, savedUser.name, savedUser.email)
            return ResponseEntity.ok(AuthResponse(token, userDto))
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        // 1. Find user by email
        val user = userRepository.findByEmail(request.email)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("message" to "Invalid email or password"))
        // 2. Check password with passwordEncoder.matches()
        if (!passwordEncoder.matches(request.password, user.password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("message" to "Invalid email or password"))
        }
        // 3. Generate JWT token
        val token = jwtService.createToken(user)
        // 4. Return AuthResponse
        val userDto = UserDto(user.id!!, user.name, user.email)
        return ResponseEntity.ok(AuthResponse(token, userDto))
    }
    @PostMapping("/google")
    fun googleLogin(@RequestBody request: GoogleLoginRequest): ResponseEntity<Any> {

        try {
            val payload = googleTokenVerifier.verify(request.credential)

            val email = payload.email
            val name = payload["name"].toString()
            val googleId = payload.subject

            var user = userRepository.findByEmail(email)

            if (user == null) {
                val dummyPassword = passwordEncoder.encode(java.util.UUID.randomUUID().toString())
                val newUser = User(
                    name = name,
                    email = email,
                    password = dummyPassword,
                    googleId = googleId
                )
                user = userRepository.save(newUser)
            } else if (user.googleId == null) {
                user.googleId = googleId
                user = userRepository.save(user)
            }

            val token = jwtService.createToken(user)

            val userDto = UserDto(user.id!!, user.name, user.email)
            return ResponseEntity.ok(AuthResponse(token, userDto))

        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("message" to "Invalid Google token"))
        }
    }
}
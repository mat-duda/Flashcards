package org.example.flashcardsweb.controller

import org.example.flashcardsweb.dto.UserDto
import org.example.flashcardsweb.model.User
import org.example.flashcardsweb.repository.UserRepository
import org.example.flashcardsweb.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException


@RestController
@RequestMapping("/api/users")
class UserController (
    private val userRepository: UserRepository,
    private val userService: UserService
)
{
    @GetMapping("/{id}")
    fun findUserById(@PathVariable id: Long, authentication: Authentication): UserDto {
        val me = authentication.principal.toString().toLong()
        if (id != me) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
        val user = userService.getUserById(id)
        return UserDto(user.id!!, user.name, user.email)
    }

}
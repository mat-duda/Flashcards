package org.example.flashcardsweb.controller

import org.example.flashcardsweb.model.User
import org.example.flashcardsweb.repository.UserRepository
import org.example.flashcardsweb.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/users")
class UserController (
    private val userRepository: UserRepository,
    private val userService: UserService
)
{
    @GetMapping
    fun findAll(): List<User> = userRepository.findAll()

    @GetMapping("/{id}")
    fun findUserById(@PathVariable id:Long): User
    = userService.getUserById(id)



   /* @PostMapping
    fun login(@RequestBody )*/
}
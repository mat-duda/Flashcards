package org.example.flashcardsweb.service

import org.example.flashcardsweb.model.User
import org.example.flashcardsweb.repository.UserRepository
import org.springframework.stereotype.Service


@Service
class UserService(
    private val userRepository: UserRepository
) {

    fun getAllUsers(): List<User>
    = userRepository.findAll()

    fun getUserById(id: Long): User
    = userRepository.findById(id).orElseThrow{
        NoSuchElementException("User with id $id does not exist")
    }

    fun createUser(user: User): User
    = userRepository.save(user)

    fun deleteUserById(id: Long)
    = userRepository.deleteById(id)
}
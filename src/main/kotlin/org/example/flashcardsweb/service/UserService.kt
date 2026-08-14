package org.example.flashcardsweb.service

import org.example.flashcardsweb.repository.UserRepository
import org.springframework.stereotype.Service


@Service
class UserService(
    private val userRepository: UserRepository
) {

}
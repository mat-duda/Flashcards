package org.example.flashcardsweb

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping

@SpringBootApplication
class FlashcardsWebApplication

fun main(args: Array<String>) {
    runApplication<FlashcardsWebApplication>(*args)
}


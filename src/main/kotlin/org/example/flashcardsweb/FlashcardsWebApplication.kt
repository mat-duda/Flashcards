package org.example.flashcardsweb

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class FlashcardsWebApplication

fun main(args: Array<String>) {
    runApplication<FlashcardsWebApplication>(*args)
}

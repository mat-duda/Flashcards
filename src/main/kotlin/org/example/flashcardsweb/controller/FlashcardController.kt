package org.example.flashcardsweb.controller

import org.example.flashcardsweb.model.Flashcard
import org.example.flashcardsweb.repository.FlashcardRepository
import org.example.flashcardsweb.service.FlashcardService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController


import org.example.flashcardsweb.service.FsrsService

data class ReviewRequest(val rating: Int)

@RestController
@RequestMapping("/api/flashcards")
class FlashcardController(
    private val flashcardRepository: FlashcardRepository,
    private val flashcardService: FlashcardService,
    private val fsrsService: FsrsService
) {
    @GetMapping
    fun findAll(): List<Flashcard> = flashcardRepository.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): Flashcard =
        flashcardService.getFlashcardById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody flashcard: Flashcard): Flashcard {
        flashcard.state = org.example.flashcardsweb.model.State.New
        flashcard.due = java.time.Instant.now()
        flashcard.stability = 0.0
        flashcard.difficulty = 0.0
        flashcard.step = 0
        return flashcardService.createFlashcard(flashcard)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) = flashcardService.deleteFlashcardById(id)

    @GetMapping("/deck/{deckId}")
    fun getFlashcardsByDeckId(@PathVariable("deckId") id: Long): List<Flashcard> = flashcardRepository.findByDeckId(id)

    @GetMapping("/deck/{deckId}/study")
    fun getFlashcardsToStudy(@PathVariable("deckId") id: Long): List<Flashcard> {
        return flashcardRepository.findCardsToStudy(id)
    }

    @PostMapping("/{id}/review")
    fun submitReview(
        @PathVariable id: Long,
        @RequestBody request: ReviewRequest
    ): Flashcard {
        return fsrsService.processReview(id, request.rating)
    }
}
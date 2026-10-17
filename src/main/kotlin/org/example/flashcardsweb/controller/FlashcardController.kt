package org.example.flashcardsweb.controller

import org.example.flashcardsweb.model.Flashcard
import org.example.flashcardsweb.repository.DeckRepository
import org.example.flashcardsweb.repository.FlashcardRepository
import org.example.flashcardsweb.service.DeckService
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
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.server.ResponseStatusException
import kotlin.time.Instant

data class ReviewRequest(val rating: Int)

@RestController
@RequestMapping("/api/flashcards")
class FlashcardController(
    private val flashcardRepository: FlashcardRepository,
    private val flashcardService: FlashcardService,
    private val fsrsService: FsrsService,
    private val deckRepository: DeckRepository,
    private val deckService: DeckService
) {
    @GetMapping
    fun findAll(authentication: Authentication): List<Flashcard> {
        val myself=  authentication.principal.toString().toLong()
        return flashcardRepository.findAllByUserId(myself)
    }


    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long,
                authentication: Authentication
                ): Flashcard {
        val myself = authentication.principal.toString().toLong()

        val flashcard = flashcardService.getFlashcardById(myself)
        if (flashcard.userId != myself){
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        return flashcard
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody flashcard: Flashcard, authentication: Authentication): Flashcard {
        val me = authentication.principal.toString().toLong()
        val deck = deckRepository.findById(flashcard.deckId).orElse(null)
        if (deck == null || deck.userId != me) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        val newCard = flashcard.copy(
            id = null,
            userId = me,
            due = java.time.Instant.now(),
            stability = 0.0,
            difficulty = 0.0,
            step = 0,
            lastReview = null
        )
        return flashcardService.createFlashcard(newCard)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long,
               authentication: Authentication
               ) {
        val me = authentication.principal.toString().toLong()
        val card = flashcardService.getFlashcardById(id)
        if (card.userId != me) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
    }

    @GetMapping("/deck/{deckId}")
    fun getFlashcardsByDeckId(@PathVariable deckId: Long, authentication: Authentication): List<Flashcard> {
        val me = authentication.principal.toString().toLong()
        val deck = deckRepository.findById(deckId).orElse(null)
        if (deck == null || (deck.userId != me && deck.isPublic != true)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        return flashcardRepository.findByDeckId(deckId)
    }

    @GetMapping("/deck/{deckId}/study")
    fun getFlashcardsToStudy(@PathVariable deckId: Long, authentication: Authentication): List<Flashcard> {
        val me = authentication.principal.toString().toLong()
        val deck = deckRepository.findById(deckId).orElse(null)
        if (deck == null || deck.userId != me) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        return flashcardRepository.findCardsToStudy(deckId)
    }

    @PutMapping("/{id}")
    fun editFlashcardById(@PathVariable id: Long, @RequestBody flashcard: Flashcard, authentication: Authentication): Flashcard {
        val me = authentication.principal.toString().toLong()
        val existing = flashcardService.getFlashcardById(id)
        if (existing.userId != me) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        return flashcardService.editFlashcardById(id, flashcard)
    }

    @PostMapping("/{id}/review")
    fun submitReview(@PathVariable id: Long, @RequestBody request: ReviewRequest, authentication: Authentication): Flashcard {
        val me = authentication.principal.toString().toLong()
        val card = flashcardService.getFlashcardById(id)
        if (card.userId != me) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        return fsrsService.processReview(id, request.rating)
    }
}
package org.example.flashcardsweb.controller

import org.example.flashcardsweb.model.Deck
import org.example.flashcardsweb.repository.DeckRepository
import org.example.flashcardsweb.service.DeckService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.Optional


@RestController
@RequestMapping("/api/decks")
class DeckController(
    private val deckRepository: DeckRepository,
    private val deckService: DeckService
) {

    @GetMapping
    fun findAll(): List<Deck> = deckRepository.findAll()

    @GetMapping("/{id}")
    fun getDeckById(@PathVariable("id") id: Long ) : Optional<Deck> = deckRepository.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody deck: Deck): Deck = deckService.createDeck(deck)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) = deckService.deleteDeckById(id)


}
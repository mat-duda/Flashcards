package org.example.flashcardsweb.controller

import org.example.flashcardsweb.model.Deck
import org.example.flashcardsweb.repository.DeckRepository
import org.example.flashcardsweb.service.DeckService
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.util.Optional


@RestController
@RequestMapping("/api/decks")
class DeckController(
    private val deckRepository: DeckRepository,
    private val deckService: DeckService,

) {

    @GetMapping
    fun findAll(authentication: org.springframework.security.core.Authentication): List<Deck> {
        val userId = authentication.principal.toString().toLong()
        return deckRepository.findByUserId(userId)
    }

    @GetMapping("/public")
    fun getPublicDecks(): List<org.example.flashcardsweb.dto.CommunityDeckDTO> {
        return deckService.getPublicDecks()
    }

    @GetMapping("/{id}")
    fun getDeckById(@PathVariable id: Long, authentication: Authentication): Deck {
        val me = authentication.principal.toString().toLong()
        val deck = deckRepository.findById(id).orElse(null)
        if (deck == null || (deck.userId != me && deck.isPublic != true)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        return deck
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody deck: Deck, authentication: Authentication): Deck {
        val me = authentication.principal.toString().toLong()
        val newDeck = Deck(name = deck.name, userId = me, isPublic = deck.isPublic ?: false)
        return deckService.createDeck(newDeck)
    }
    @PutMapping("/{id}")
    fun updateDeck(@PathVariable id: Long, @RequestBody updatedDeck: Deck, authentication: Authentication): Deck {
        val me = authentication.principal.toString().toLong()
        val deck = deckRepository.findById(id).orElse(null)
        if (deck == null || deck.userId != me) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        return deckService.updateDeck(id, updatedDeck)
    }


    @PostMapping("/{id}/clone")
    fun cloneDeck(@PathVariable id: Long, authentication: Authentication): Deck {
        val userId = authentication.principal.toString().toLong()
        return deckService.clonePublicDeck(id,userId)!!
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long, authentication: Authentication) {
        val me = authentication.principal.toString().toLong()
        val deck = deckRepository.findById(id).orElse(null)
        if (deck == null || deck.userId != me) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        deckService.deleteDeckById(id)
    }


}
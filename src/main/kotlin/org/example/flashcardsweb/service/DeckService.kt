package org.example.flashcardsweb.service

import org.example.flashcardsweb.model.Deck
import org.example.flashcardsweb.repository.DeckRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class DeckService(
    private val deckRepository: DeckRepository,
) {
    fun getAllDecks(): List<Deck>
    = deckRepository.findAll()

    fun getDeckById(id: Long): Deck
    = deckRepository.findById(id).orElseThrow{
        NoSuchElementException("Deck with id $id not found")
    }

    fun createDeck(deck: Deck): Deck
    = deckRepository.save(deck)

    fun deleteDeckById(deckId: Long)
    = deckRepository.deleteById(deckId)

}
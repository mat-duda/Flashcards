package org.example.flashcardsweb.repository

import org.example.flashcardsweb.model.Deck
import org.example.flashcardsweb.model.Flashcard
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DeckRepository : JpaRepository<Deck, Long>{

    fun getAllDecks(): List<Deck>
    fun getDeckById(id: Long): List<Deck>
}
package org.example.flashcardsweb.repository

import org.example.flashcardsweb.model.Deck
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DeckRepository : JpaRepository<Deck, Long>{

    fun findByIsPublicTrue(): List<Deck>
    fun findByUserId(userId: Long): List<Deck>
}
package org.example.flashcardsweb.repository

import org.example.flashcardsweb.model.Flashcard
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


@Repository
interface FlashcardRepository : JpaRepository<Flashcard, Long> {

    fun findAllByUserId(userId: Long): List<Flashcard>
    fun findByDeckId(deckId: Int): List<Flashcard>
}
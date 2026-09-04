package org.example.flashcardsweb.repository

import org.example.flashcardsweb.model.Flashcard
import org.springframework.data.jpa.repository.JpaRepository

import org.springframework.stereotype.Repository


import org.springframework.data.repository.query.Param
import org.springframework.data.jpa.repository.Query

@Repository
interface FlashcardRepository : JpaRepository<Flashcard, Long> {
    
    @Query("""
        SELECT f FROM Flashcard f 
        WHERE f.deckId = :deckId 
        AND f.due <= CURRENT_TIMESTAMP 
        ORDER BY f.due ASC
    """)
    fun findCardsToStudy(@Param("deckId") deckId: Long): List<Flashcard>

    fun findAllByUserId(userId: Long): List<Flashcard>
    
    fun findByDeckId(deckId: Long): List<Flashcard>
}
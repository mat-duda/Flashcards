package org.example.flashcardsweb.service

import org.example.flashcardsweb.model.Flashcard
import org.example.flashcardsweb.repository.FlashcardRepository
import org.springframework.stereotype.Service


@Service
class FlashcardService(
    private val flashcardRepository: FlashcardRepository,
) {
    fun getAllFlashcards(): List<Flashcard>
    = flashcardRepository.findAll()
    fun getFlashcardById(id: Long): Flashcard
    = flashcardRepository.findById(id).orElseThrow{
        NoSuchElementException("Flashcard not found")}
    fun createFlashcard(flashcard: Flashcard): Flashcard
    = flashcardRepository.save(flashcard)
    fun deleteFlashcardById(id: Long)
    = flashcardRepository.deleteById(id)


    fun getFlashcardsByDeckId(id: Long): List<Flashcard>
    = flashcardRepository.findByDeckId(id)

    fun editFlashcardById(id: Long, newFlashcard: Flashcard): Flashcard{
        val flashcard = flashcardRepository.findById(id).orElseThrow{ NoSuchElementException("Flashcard not found") }
        flashcard.frontText = newFlashcard.frontText
        flashcard.backText = newFlashcard.backText
        return flashcardRepository.save(flashcard)
    }
}
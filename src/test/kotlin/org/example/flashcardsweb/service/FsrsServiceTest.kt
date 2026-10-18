package org.example.flashcardsweb.service

import io.github.openspacedrepetition.Rating
import org.example.flashcardsweb.model.Flashcard
import org.example.flashcardsweb.repository.FlashcardRepository
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito
import java.util.*
import kotlin.test.Test
import kotlin.test.assertTrue

class FsrsServiceTest {
    private val repository = Mockito.mock(FlashcardRepository::class.java)
    private val service = FsrsService(repository)

    private fun newCard() = Flashcard(userId = 1, frontText = "front", backText = "back", deckId = 1)


    @Test()
    fun `Card reviewed as EASY is shown later than AGAIN`(){
        val easy = service.calculateTheDateOfNextReview(newCard(), Rating.EASY)
        val again = service.calculateTheDateOfNextReview(newCard(), Rating.AGAIN)
        assertTrue { easy.due.isAfter(again.due) }
    }

    @Test
    fun `Only from 1 to 4 rating accepted`(){
        Mockito.`when`(repository.findById( 1)).thenReturn(Optional.of(newCard()))
        assertThrows<IllegalArgumentException>{service.processReview(1,7)}
    }


}
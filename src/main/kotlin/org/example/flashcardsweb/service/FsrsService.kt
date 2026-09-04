package org.example.flashcardsweb.service

import io.github.openspacedrepetition.Card
import io.github.openspacedrepetition.Rating
import io.github.openspacedrepetition.Scheduler
import jakarta.transaction.Transactional
import org.example.flashcardsweb.model.Flashcard
import org.example.flashcardsweb.model.State
import org.example.flashcardsweb.repository.FlashcardRepository
import org.springframework.stereotype.Service
import io.github.openspacedrepetition.State as FsrsState

@Service
class FsrsService(
    private val flashcardRepository: FlashcardRepository
) {

    private val scheduler = Scheduler.builder().build()

    @Transactional
    fun processReview(cardId: Long, ratingInt: Int): Flashcard {
        val card = flashcardRepository.findById(cardId)
            .orElseThrow { NoSuchElementException("Card with ID $cardId not found") }

        val ratingEnum = when (ratingInt) {
            1 -> Rating.AGAIN
            2 -> Rating.HARD
            3 -> Rating.GOOD
            4 -> Rating.EASY
            else -> throw IllegalArgumentException("Rating must be 1 (Again), 2 (Hard), 3 (Good), or 4 (Easy)")
        }

        val updatedCard = calculateTheDateOfNextReview(card, ratingEnum)

        return flashcardRepository.save(updatedCard)
    }

    fun calculateTheDateOfNextReview(
        currentCard: Flashcard, rating: Rating
    ): Flashcard {
        val fsrsCard = if (currentCard.state == State.New) {
            Card.builder().build()
        } else {
            val fsrsState = FsrsState.valueOf(currentCard.state.name.uppercase())
            Card.builder()
                .state(fsrsState)
                .due(currentCard.due)
                .stability(currentCard.stability)
                .difficulty(currentCard.difficulty)
                .lastReview(currentCard.lastReview)
                .step(currentCard.step)
                .build()
        }

        val result = scheduler.reviewCard(fsrsCard, rating)

        val nextCard = result.card

        val mappedStateName = nextCard.state.name.lowercase().replaceFirstChar { it.uppercase() }
        currentCard.state = State.valueOf(mappedStateName)
        currentCard.due = nextCard.due
        currentCard.stability = nextCard.stability
        currentCard.difficulty = nextCard.difficulty
        currentCard.step = nextCard.step
        currentCard.lastReview = nextCard.lastReview

        return currentCard
    }
}
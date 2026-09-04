package org.example.flashcardsweb.service

import org.example.flashcardsweb.model.Flashcard
import org.example.flashcardsweb.model.FlashcardState
import java.util.Date
import io.github.openspacedrepetition.Card
import io.github.openspacedrepetition.Rating
import io.github.openspacedrepetition.Scheduler
import org.example.flashcardsweb.model.State
import io.github.openspacedrepetition.State as FsrsState
class FsrsService{

    private val scheduler = Scheduler.builder().build()

    fun calculateTheDateOfNextReview(
        currentCardState: FlashcardState, rating: Rating
    ): FlashcardState
    {
        val fsrsState = FsrsState.valueOf(currentCardState.state.name.uppercase())


        val fsrsCard = Card.builder()
            .state(fsrsState)
            .due(currentCardState.due)
            .stability(currentCardState.stability)
            .difficulty(currentCardState.difficulty)
            .lastReview(currentCardState.lastReview)
             .step(currentCardState.step)
            .build()

        val result = scheduler.reviewCard(fsrsCard, rating)

        val nextCard = result.card

        val mappedStateName = nextCard.state.name.lowercase().replaceFirstChar { it.uppercase() }
        currentCardState.state = State.valueOf(mappedStateName)
        currentCardState.due = nextCard.due
        currentCardState.stability = nextCard.stability
        currentCardState.difficulty = nextCard.difficulty
        currentCardState.step = nextCard.step
        currentCardState.lastReview = nextCard.lastReview


        return currentCardState
    }

}
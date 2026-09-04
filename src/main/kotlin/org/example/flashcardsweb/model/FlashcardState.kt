package org.example.flashcardsweb.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

enum class State {
New, Learning, Review, Relearning
}

@Entity
@Table(name = "flashcards_state")
data class FlashcardState (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: String? = null,

    @Column()
    var flashcardId: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    var state: State,

    @Column(name = "due")
    var due: java.time.Instant,

    @Column(name = "stability")
    var stability: Double,

    @Column(name = "difficulty")
    var difficulty: Double,

    @Column(name = "last_review")
    var lastReview: java.time.Instant? = null,

    @Column(name = "step")
    var step: Int = 0



)
